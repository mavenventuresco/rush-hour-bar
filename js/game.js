// ─── CANVAS SETUP ────────────────────────────────────────────────────────────
const cv = document.getElementById('c');
const X  = cv.getContext('2d');
let W, H, DPR;

function resize() {
  DPR = window.devicePixelRatio || 1;
  W   = window.innerWidth;
  H   = window.innerHeight;
  cv.width        = Math.round(W * DPR);
  cv.height       = Math.round(H * DPR);
  cv.style.width  = W + 'px';
  cv.style.height = H + 'px';
  // Scale all drawing commands by DPR so coordinates stay in CSS pixels
  X.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resize();
window.onresize = resize;

// ─── LAYOUT ──────────────────────────────────────────────────────────────────
function lo() {
  const hudH = 40, rackH = 56, barH = 144, wsH = 80, tabH = 34;
  const shelfH = Math.max(80, H - hudH - rackH - barH - wsH - tabH - 22);
  return {
    hudH, rackH, barH, wsH, tabH, shelfH,
    rackY:    hudH,
    barY:     hudH + rackH,
    counterY: hudH + rackH + barH - 18,
    wsY:      hudH + rackH + barH,
    tabY:     hudH + rackH + barH + wsH,
    shelfY:   hudH + rackH + barH + wsH + tabH,
  };
}

function seatX(i) {
  const totalW = Math.min(W - 40, SEATS * 100);
  const startX = (W - totalW) / 2;
  return startX + i * (totalW / SEATS) + totalW / SEATS / 2;
}

// ─── STATE ───────────────────────────────────────────────────────────────────
const SEATS = 8;
let G = { running: false };
let curTab = 'cognac';
let dragging = null;
let particles = [], floats = [];
let frame = 0;
let regions = [];
let NID = 0;

window._gameRunning = false;
window._dragging    = null; // renderer reads this

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function R(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function spawnParticles(x, y, color, n = 8) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 / n) * i + Math.random() * 0.5;
    particles.push({ x, y, vx: Math.cos(a) * (2 + Math.random() * 3), vy: Math.sin(a) * (2 + Math.random() * 3) - 2, life: 1, color, size: 3 + Math.random() * 3 });
  }
}

// ─── GAME INIT ───────────────────────────────────────────────────────────────
function startGame() {
  document.getElementById('overlay').style.display = 'none';
  initAudio();
  G = {
    running: true,
    money: 0, score: 0, combo: 0, served: 0,
    stools: new Array(SEATS).fill(null),
    queue: [],
    glass: null, ings: [], mixed: false, finished: false,
    spawnTimer: 0, spawnInterval: 180,
  };
  window._gameRunning = true;

  // Restore saved progress
  try {
    const s = localStorage.getItem('rushbar_save');
    if (s) { const d = JSON.parse(s); G.money = d.money || 0; G.score = d.score || 0; G.served = d.served || 0; }
  } catch (e) {}

  buildMenu();
  updHUD();
  particles = []; floats = [];
  setLog('Bar is open! 🍸');
  requestAnimationFrame(loop);
}

function saveGame() {
  try { localStorage.setItem('rushbar_save', JSON.stringify({ money: G.money, score: G.score, served: G.served })); } catch (e) {}
  flash('💾 Game saved!');
}

// Check for save on load
try {
  const s = localStorage.getItem('rushbar_save');
  if (s) { const d = JSON.parse(s); document.getElementById('loadinfo').textContent = `Saved: $${d.money || 0} earned, ${d.served || 0} served`; }
} catch (e) {}

// ─── CUSTOMER LOGIC ──────────────────────────────────────────────────────────
function spawnCustomer() {
  const pool = G.served < 5  ? DRINKS.filter(d => !d.mix && d.steps.length <= 2)
             : G.served < 15 ? DRINKS.filter(d => d.steps.length <= 3)
             : DRINKS;
  const drink = R(pool);
  const pat   = Math.max(35, 80 - Math.floor(G.served / 5) * 3);
  return {
    id: ++NID,
    name: R(CNAMES), skin: R(SKINS), hair: R(HAIRS), cloth: R(CLOTHS),
    drink, pat, maxP: pat,
    state: 'waiting', drinkTimer: 0, payAmount: 0,
  };
}

function updateCustomers() {
  // Spawn into queue
  G.spawnTimer++;
  if (G.spawnTimer >= G.spawnInterval) {
    G.spawnTimer = 0;
    G.spawnInterval = Math.max(60, 180 - G.served * 2);
    if (G.queue.length < 4) G.queue.push(spawnCustomer());
  }

  // Seat queued customers
  if (G.queue.length > 0) {
    const empty = G.stools.findIndex(s => s === null);
    if (empty !== -1) {
      const c = G.queue.shift();
      c.state = 'ordering';
      G.stools[empty] = c;
      bellChime();
    }
  }

  // Update seated customers
  G.stools.forEach((c, i) => {
    if (!c) return;
    if (c.state === 'ordering') {
      c.pat -= 1 / 60;
      if (c.pat <= 0) {
        c.state = 'leaving'; c.leaveTimer = 30;
        G.score = Math.max(0, G.score - 10); G.combo = 0; updCombo();
        setLog(c.name + ' left angry! -10pts', 'b');
        failSound();
      }
    } else if (c.state === 'drinking') {
      c.drinkTimer--;
      if (c.drinkTimer <= 0) {
        c.state = 'paying'; c.leaveTimer = 40;
        const pct  = c.savedPct || 0.5;
        const base = c.drink.steps.length + 2;
        const tip  = pct > 0.65 ? base + 3 : pct > 0.35 ? base + 1 : Math.max(1, base);
        const mult = Math.min(c.comboMult || 1, 4);
        c.payAmount = tip * mult;
        G.money += c.payAmount; G.score += 20 + c.payAmount * 3; G.served++;
        const cx = seatX(i), cy = lo().barY + lo().barH - 65;
        spawnParticles(cx, cy, '#f5c842', 12);
        floats.push({ x: cx, y: cy - 30, text: '$' + c.payAmount + (mult > 1 ? ' x' + mult + '!' : ''), color: '#f5c842', life: 1, vy: -1.3 });
        tipSound();
        setLog(c.name + ' pays $' + c.payAmount + (mult > 1 ? ' COMBO x' + mult + '!' : '') + ' 💰', 't');
        updHUD();
      }
    } else if (c.state === 'paying' || c.state === 'leaving') {
      c.leaveTimer--;
      if (c.leaveTimer <= 0) G.stools[i] = null;
    }
  });
}

// ─── RECIPE CHECK ─────────────────────────────────────────────────────────────
function checkFinished() {
  if (!G.glass) { G.finished = false; return; }
  for (const c of G.stools) {
    if (!c || c.state !== 'ordering') continue;
    const d = c.drink;
    if (G.glass !== d.g) continue;
    const req = d.steps.map(s => s.t === 'ice' ? 'ice' : s.id);
    if (req.every(r => G.ings.includes(r)) && (!d.mix || G.mixed)) { G.finished = true; return; }
  }
  G.finished = false;
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
function buildRegions() {
  regions = [];
  const L = lo();
  const rackIW = Math.min(84, (W - 24) / 6);
  const rackStartX = (W - rackIW * 6) / 2;
  for (let i = 0; i < 6; i++) {
    regions.push({ id: 'glass' + i, x: rackStartX + i * rackIW, y: L.rackY, w: rackIW, h: L.rackH, type: 'glass', idx: i });
  }
  regions.push({ id: 'tap_light', x: 6,  y: L.wsY, w: 44, h: L.wsH, type: 'tap', tap: 'light' });
  regions.push({ id: 'tap_dark',  x: 50, y: L.wsY, w: 44, h: L.wsH, type: 'tap', tap: 'dark'  });
  regions.push({ id: 'ice',       x: 98, y: L.wsY, w: 56, h: L.wsH, type: 'ice' });
  const mxW = Math.max(130, W - 340);
  regions.push({ id: 'mixstation', x: 158, y: L.wsY, w: mxW, h: L.wsH, type: 'mixstation' });
  regions.push({ id: 'mixbtn', x: 158 + mxW / 2 - 30, y: L.wsY + L.wsH - 22, w: 60, h: 16, type: 'mixbtn' });
  regions.push({ id: 'sink', x: 158 + mxW + 4, y: L.wsY, w: 92, h: L.wsH, type: 'sink' });
  regions.push({ id: 'jig',  x: 158 + mxW + 100, y: L.wsY, w: W - 158 - mxW - 104, h: L.wsH, type: 'jig' });
  const tabs = Object.keys(SHELVES); const tabW = W / tabs.length;
  tabs.forEach((k, i) => regions.push({ id: 'tab_' + k, x: i * tabW, y: L.tabY, w: tabW, h: L.tabH, type: 'shelftab', key: k }));

  // Shelf items
  const items = SHELVES[curTab].items;
  const iw = 60, ih = 56, gap = 5;
  const totalW = items.length * (iw + gap) - gap;
  const startX = (W - totalW) / 2;
  items.forEach((item, i) => {
    const ix = startX + i * (iw + gap);
    regions.push({ id: 'item_' + item.id, x: ix, y: L.shelfY + 6, w: iw, h: ih, type: 'shelfitem', itemId: item.id });
  });
}

function pos(e) {
  const r = cv.getBoundingClientRect();
  if (e.touches) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function hit(x, y) { return regions.find(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h); }

function handleDown(e) {
  if (!G.running) return;
  const p = pos(e);
  const L = lo();

  // Tap on order bubble → show recipe
  G.stools.forEach((c, i) => {
    if (!c || c.state !== 'ordering') return;
    const cx = seatX(i), cy = L.barY + L.barH - 62;
    if (p.x >= cx - 46 && p.x <= cx + 46 && p.y >= cy - 52 && p.y <= cy - 22) { openRecipe(c); return; }
  });

  const h = hit(p.x, p.y);
  if (!h) return;

  if (h.type === 'glass') {
    G.glass = GL[h.idx].id; G.ings = []; G.mixed = false; G.finished = false; clickSfx();
  } else if (h.type === 'tap') {
    if (!G.glass) { flash('Pick a glass first!'); return; }
    G.ings.push(h.tap); G.mixed = false; G.finished = false; checkFinished(); clickSfx();
  } else if (h.type === 'ice') {
    if (!G.glass) { flash('Pick a glass first!'); return; }
    G.ings.push('ice'); G.mixed = false; checkFinished(); clickSfx();
  } else if (h.type === 'mixbtn' || h.type === 'jig') {
    if (!G.glass || !G.ings.length) { flash('Nothing to mix!'); return; }
    G.mixed = true; checkFinished(); shakeSound(); setLog('Shaken & mixed! 🔀');
  } else if (h.type === 'sink') {
    G.glass = null; G.ings = []; G.mixed = false; G.finished = false; dragging = null;
    G.combo = 0; updCombo(); failSound(); setLog('Dumped in the sink 🚰', 'b');
  } else if (h.type === 'shelftab') {
    curTab = h.key; clickSfx();
  } else if (h.type === 'shelfitem') {
    if (!G.glass) { flash('Pick a glass first!'); return; }
    G.ings.push(h.itemId); G.mixed = false; G.finished = false; checkFinished(); clickSfx();
    const allI = Object.values(SHELVES).flatMap(s => s.items);
    const it = allI.find(x => x.id === h.itemId);
    if (it) setLog('Added: ' + it.n);
  }

  // Start drag if drink is finished and click is on mixing station
  if (G.finished && h.type === 'mixstation') {
    dragging = { x: p.x, y: p.y, glass: G.glass, ings: [...G.ings], mixed: G.mixed };
    window._dragging = dragging;
  }
}

function handleMove(e) {
  if (!G.running) return; e.preventDefault();
  const p = pos(e);
  if (dragging) { dragging.x = p.x; dragging.y = p.y; window._dragging = dragging; }
}

function handleUp(e) {
  if (!G.running || !dragging) { dragging = null; window._dragging = null; return; }
  const p = pos(e);
  const L = lo();

  G.stools.forEach((c, i) => {
    if (!c || c.state !== 'ordering') return;
    const cx = seatX(i), cy = L.barY + L.barH - 62;
    if (Math.abs(p.x - cx) < 50 && p.y > cy - 28 && p.y < cy + 58) {
      const d = c.drink;
      if (dragging.glass !== d.g) { flash('Wrong glass! Need: ' + GL.find(g => g.id === d.g).l); failSound(); dragging = null; window._dragging = null; return; }
      const req = d.steps.map(s => s.t === 'ice' ? 'ice' : s.id);
      if (!req.every(r => dragging.ings.includes(r))) { flash('Missing ingredients!'); failSound(); dragging = null; window._dragging = null; return; }
      if (d.mix && !dragging.mixed) { flash('Needs mixing/shaking!'); failSound(); dragging = null; window._dragging = null; return; }

      // Correct serve!
      G.combo++;
      updCombo();
      c.state = 'drinking'; c.drinkTimer = 180;
      c.savedPct = c.pat / c.maxP; c.comboMult = Math.min(G.combo, 4);
      G.glass = null; G.ings = []; G.mixed = false; G.finished = false;
      if (G.combo > 1) comboSound(); else serveSound();
      setLog('Served ' + c.name + '! 🍸', 'g');
      updHUD();
    }
  });

  // Drop on sink
  const sinkR = regions.find(r => r.id === 'sink');
  if (sinkR && p.x >= sinkR.x && p.x <= sinkR.x + sinkR.w && p.y >= sinkR.y && p.y <= sinkR.y + sinkR.h) {
    G.glass = null; G.ings = []; G.mixed = false; G.finished = false;
    failSound(); setLog('Dumped in the sink 🚰', 'b');
  }

  dragging = null; window._dragging = null;
}

cv.addEventListener('mousedown',  handleDown);
cv.addEventListener('mousemove',  handleMove);
cv.addEventListener('mouseup',    handleUp);
cv.addEventListener('touchstart', e => { e.preventDefault(); handleDown(e); }, { passive: false });
cv.addEventListener('touchmove',  e => { e.preventDefault(); handleMove(e); }, { passive: false });
cv.addEventListener('touchend',   e => { e.preventDefault(); handleUp(e);   });

// ─── RECIPE MODAL ────────────────────────────────────────────────────────────
function openRecipe(c) {
  const d = c.drink, gl = GL.find(g => g.id === d.g);
  let el = document.getElementById('rmodal');
  if (!el) {
    el = document.createElement('div'); el.className = 'modal'; el.id = 'rmodal';
    el.onclick = () => el.classList.remove('open');
    el.innerHTML = '<div class="mbox" onclick="event.stopPropagation()"><h3 id="rtitle"></h3><div id="rsteps"></div><button class="cbtn" onclick="document.getElementById(\'rmodal\').classList.remove(\'open\')">Close</button></div>';
    document.body.appendChild(el);
  }
  document.getElementById('rtitle').textContent = d.name;
  let h = `<div class="rrow"><span class="rico">🫙</span><span>${gl.l} Glass</span></div>`;
  d.steps.forEach(s => {
    h += `<div class="rrow"><span class="rico">${s.t === 'ice' ? '🧊' : s.t === 'tap' ? '🍺' : '🍾'}</span><span>${s.l}</span></div>`;
  });
  if (d.mix) h += `<div class="rrow"><span class="rico">🔀</span><span>Shake / Mix</span></div>`;
  document.getElementById('rsteps').innerHTML = h;
  el.classList.add('open');
}

// ─── COCKTAIL MENU ───────────────────────────────────────────────────────────
function buildMenu() {
  const mg = document.getElementById('mgrid'); mg.innerHTML = '';
  DRINKS.forEach(d => {
    const gl   = GL.find(g => g.id === d.g);
    const card = document.createElement('div'); card.className = 'mc';
    const steps = d.steps.map(s => `<span class="tag tl">${s.l}</span>`).join(' ');
    const mx = d.mix ? `<div class="mr">🔀 <span class="tag tg">Shake</span></div>` : '';
    card.innerHTML = `<div class="dn">${d.name}</div><div class="mr">🫙 <span class="tag tm">${gl.l}</span></div><div class="mr">${steps}</div>${mx}`;
    mg.appendChild(card);
  });
}
function openMenu()  { document.getElementById('mmodal').classList.add('open');    }
function closeMenu() { document.getElementById('mmodal').classList.remove('open'); }

// ─── HUD ─────────────────────────────────────────────────────────────────────
function updCombo() {
  const b = document.getElementById('combo');
  if (G.combo > 1) { b.textContent = 'x' + Math.min(G.combo, 4); b.classList.add('on'); }
  else b.classList.remove('on');
}
function updHUD() {
  document.getElementById('sv').textContent   = '$' + G.money;
  document.getElementById('scv').textContent  = G.score;
  document.getElementById('srvd').textContent = G.served;
}
function setLog(m, c) { const e = document.getElementById('logbar'); e.textContent = m; e.className = c || ''; }
function flash(m) {
  const e = document.getElementById('flash'); e.textContent = m; e.classList.add('show');
  clearTimeout(G._ft); G._ft = setTimeout(() => e.classList.remove('show'), 2200);
}

// ─── MAIN LOOP ────────────────────────────────────────────────────────────────
function loop() {
  if (!G.running) return;
  frame++;
  buildRegions();
  updateCustomers();
  draw(G, frame, curTab, dragging, particles, floats);
  particles = particles.filter(p => p.life > 0);
  floats    = floats.filter(f => f.life > 0);
  requestAnimationFrame(loop);
}
