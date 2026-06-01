import { initCanvas, resize, lo, seatX, cv, X, W, H, DPR } from './canvas.js';
import { GL, SHELVES, DRINKS, SKINS, HAIRS, CLOTHS, CNAMES } from './drinks.js';
import { BSTYLES } from './bottles.js';
import { initAudio, toggleMute, setGameRunning,
         bellChime, serveSound, comboSound, failSound, tipSound, clickSfx, shakeSound } from './audio.js';
import { draw, wsLayout, shelfPopupLayout, pillLayout } from './renderer.js';

// Initialise canvas + wire resize
initCanvas();
window.addEventListener('resize', resize);

// ─── POPUP STATE ─────────────────────────────────────────────────────────────
let popupOpen    = false;
let popupAnchorX = 0;

function setPopup(open, anchorX) {
  popupOpen = open;
  if (anchorX !== undefined) popupAnchorX = anchorX;
  if (G.running) G.paused = open; // freeze timers while browsing ingredients
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

setGameRunning(false);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function R(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function spawnParticles(x, y, color, n = 8) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 / n) * i + Math.random() * 0.5;
    particles.push({ x, y, vx: Math.cos(a) * (2 + Math.random() * 3), vy: Math.sin(a) * (2 + Math.random() * 3) - 2, life: 1, color, size: 3 + Math.random() * 3 });
  }
}

// ─── GAME INIT ───────────────────────────────────────────────────────────────
function _initGame() {
  document.getElementById('overlay').style.display = 'none';
  initAudio();
  G = {
    running: true, paused: false,
    money: 0, score: 0, combo: 0, served: 0,
    stools: new Array(SEATS).fill(null),
    queue: [],
    glass: null, ings: [], mixed: false, finished: false,
    spawnTimer: 0, spawnInterval: Math.round(120 + Math.random() * 120),
    burstTarget: 3 + Math.floor(Math.random() * 3), burstUsed: 0,
  };
  setGameRunning(true);
  buildMenu(); updHUD();
  particles = []; floats = [];
  requestAnimationFrame(loop);
}

function startGame() {
  _initGame();
  setLog('New game started! 🍸');
}

function continueGame() {
  _initGame();
  try {
    const s = localStorage.getItem('rushbar_save');
    if (s) {
      const d = JSON.parse(s);
      G.money = d.money || 0; G.score = d.score || 0; G.served = d.served || 0;
      updHUD();
      setLog('Welcome back! Continuing from your save 🍸');
    }
  } catch (e) { setLog('Bar is open! 🍸'); }
}

function saveGame() {
  try { localStorage.setItem('rushbar_save', JSON.stringify({ money: G.money, score: G.score, served: G.served })); } catch (e) {}
  flash('💾 Game saved!');
}

// Show Continue button if a save exists
try {
  const s = localStorage.getItem('rushbar_save');
  if (s) {
    const d = JSON.parse(s);
    const btn = document.getElementById('loadbtn');
    const info = document.getElementById('loadinfo');
    if (btn)  btn.style.display = 'inline-block';
    if (info) info.textContent  = `$${d.money || 0} earned · ${d.served || 0} drinks served`;
  }
} catch (e) {}

// ─── CUSTOMER LOGIC ──────────────────────────────────────────────────────────
function _nextSpawnDelay() {
  // Base interval shrinks as the bar gets busier, with ±40% jitter
  const base = Math.max(60, 180 - G.served * 2);
  return Math.round(base * (0.6 + Math.random() * 0.8));
}

function spawnCustomer() {
  const pool = G.served < 5  ? DRINKS.filter(d => !d.mix && d.steps.length <= 2)
             : G.served < 15 ? DRINKS.filter(d => d.steps.length <= 3)
             : DRINKS;
  const drink = R(pool);
  const pat   = Math.max(35, 80 - Math.floor(G.served / 5) * 3);
  return {
    id: ++NID,
    name: R(CNAMES), skin: R(SKINS), hair: R(HAIRS), cloth: R(CLOTHS),
    hairStyle: R(['short','wavy','long','curly','updo','spiky']),
    eyeStyle:  R(['round','almond','wide','hooded']),
    drink, pat, maxP: pat,
    state: 'waiting', drinkTimer: 0, payAmount: 0,
  };
}

function _newBurstTarget() {
  // Pick how many seats fill up this wave: 3, 4, or 5
  return 3 + Math.floor(Math.random() * 3);
}

function updateCustomers() {
  if (G.paused) return; // hard stop — timers never tick while paused
  // Spawn into queue with randomised interval
  G.spawnTimer++;
  if (G.spawnTimer >= G.spawnInterval) {
    G.spawnTimer = 0;
    G.spawnInterval = _nextSpawnDelay();
    if (G.queue.length < 4) G.queue.push(spawnCustomer());
  }

  const occupied = G.stools.filter(s => s !== null).length;

  // When the bar drains low, roll a fresh burst size for the next wave
  if (occupied <= 1 && G.burstTarget === G.burstUsed) {
    G.burstTarget = _newBurstTarget();
    G.burstUsed   = 0;
  }

  // Only seat if we haven't hit this burst's cap yet
  const burstSlotsFree = G.burstTarget - occupied;
  if (G.queue.length > 0 && burstSlotsFree > 0 && Math.random() < 0.35) {
    const emptySeats = G.stools
      .map((s, i) => s === null ? i : -1)
      .filter(i => i !== -1);

    if (emptySeats.length > 0) {
      const seat = emptySeats[Math.floor(Math.random() * emptySeats.length)];
      const c = G.queue.shift();
      c.state = 'ordering';
      G.stools[seat] = c;
      G.burstUsed++;
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

  // Popup items registered FIRST — they float above the workstation visually
  // and must win over any workstation regions they spatially overlap with.
  if (popupOpen) {
    const p = shelfPopupLayout(curTab, popupAnchorX);
    p.items.forEach((item, i) => {
      const col = i % p.COLS, row = Math.floor(i / p.COLS);
      const ix = p.px + 16 + col * (p.IW + p.GAP);
      const iy = p.py + 36 + row * (p.IH + p.GAP);
      regions.push({ id: 'item_' + item.id, x: ix, y: iy, w: p.IW, h: p.IH, type: 'shelfitem', itemId: item.id });
    });
  }
  const rackIW = Math.min(84, (W - 24) / 6);
  const rackStartX = (W - rackIW * 6) / 2;
  for (let i = 0; i < 6; i++) {
    regions.push({ id: 'glass' + i, x: rackStartX + i * rackIW, y: L.rackY, w: rackIW, h: L.rackH, type: 'glass', idx: i });
  }
  // Workstation regions — derived from the same wsLayout() used by the renderer
  const ws = wsLayout();
  const tapSec  = ws[0], iceSec = ws[1], mxSec = ws[2], skSec = ws[3], jgSec = ws[4];
  const t1x = tapSec.x + tapSec.w * 0.3;
  const t2x = tapSec.x + tapSec.w * 0.72;
  regions.push({ id: 'tap_light', x: t1x - 18, y: L.wsY, w: 36, h: L.wsH, type: 'tap', tap: 'light' });
  regions.push({ id: 'tap_dark',  x: t2x - 18, y: L.wsY, w: 36, h: L.wsH, type: 'tap', tap: 'dark'  });
  regions.push({ id: 'ice',        x: iceSec.x, y: L.wsY, w: iceSec.w, h: L.wsH, type: 'ice' });
  regions.push({ id: 'mixstation', x: mxSec.x,  y: L.wsY, w: mxSec.w,  h: L.wsH, type: 'mixstation' });
  const mxCx = mxSec.x + mxSec.w / 2;
  regions.push({ id: 'mixbtn', x: mxCx - 30, y: L.wsY + L.wsH - 22, w: 60, h: 16, type: 'mixbtn' });
  regions.push({ id: 'sink',       x: skSec.x,  y: L.wsY, w: skSec.w,  h: L.wsH, type: 'sink' });
  regions.push({ id: 'jig',        x: jgSec.x,  y: L.wsY, w: jgSec.w,  h: L.wsH, type: 'jig'  });
  // Tab pills — same geometry as renderer via pillLayout()
  const { tabs, startX: tabStartX, PW, PH, GAP, rows, perRow } = pillLayout();
  const trayH = rows === 2 ? PH*2+GAP+6 : PH+6;
  const tabTY0 = L.tabY + Math.max(2, Math.round((L.tabH - trayH) / 2));
  tabs.forEach((k, i) => {
    const row = rows === 2 ? Math.floor(i / perRow) : 0;
    const col = rows === 2 ? i % perRow : i;
    const tx  = tabStartX + col * (PW + GAP);
    const ty  = tabTY0 + row * (PH + GAP);
    regions.push({ id: 'tab_' + k, x: tx, y: ty, w: PW, h: PH, type: 'shelftab', key: k });
  });

}

function pos(e) {
  const r  = cv.getBoundingClientRect();
  // touchend has empty e.touches — must read e.changedTouches for the lift position
  const t  = (e.changedTouches && e.changedTouches[0])
           || (e.touches && e.touches[0]);
  if (t) return { x: t.clientX - r.left, y: t.clientY - r.top };
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function hit(x, y) { return regions.find(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h); }

function handleDown(e) {
  if (!G.running) return;
  const p = pos(e);
  const L = lo();

  // When popup is open, handle tab clicks first so switching is instant (1 click)
  if (popupOpen) {
    const tabHit = regions.find(r => r.type === 'shelftab' &&
      p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h);
    if (tabHit) {
      const ax = tabHit.x + tabHit.w / 2;
      if (curTab === tabHit.key) { setPopup(false, ax); }
      else { curTab = tabHit.key; setPopup(true, ax); }
      clickSfx(); return;
    }
    // Non-tab click outside popup panel → close
    const pl = shelfPopupLayout(curTab, popupAnchorX);
    const inside = p.x >= pl.px && p.x <= pl.px + pl.pw &&
                   p.y >= pl.py && p.y <= pl.py + pl.ph;
    if (!inside) { setPopup(false); return; }
  }

  // Two-tap mobile serving: if holding a finished drink, tap on a customer to serve
  if (dragging && _tryServe(p.x, p.y)) return;

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
    // Anchor the popup over the centre of the pill that was tapped
    const ax = h.x + h.w / 2;
    if (curTab === h.key) { setPopup(!popupOpen, ax); }
    else { curTab = h.key; setPopup(true, ax); }
    clickSfx();
    return;
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
    ;
  }
}

function handleMove(e) {
  if (!G.running) return; e.preventDefault();
  const p = pos(e);
  if (dragging) { dragging.x = p.x; dragging.y = p.y; ; }
}

// ── shared serve-check — called from both handleDown (tap) and handleUp (drag)
function _tryServe(px, py) {
  if (!dragging) return false;
  const L = lo();
  let served = false;
  G.stools.forEach((c, i) => {
    if (!c || c.state !== 'ordering' || served) return;
    const cx = seatX(i), cy = L.barY + L.barH - 62;
    if (Math.abs(px - cx) > 32 || py < cy - 25 || py > cy + 40) return;
    const d = c.drink;
    if (dragging.glass !== d.g) {
      flash('Wrong glass! Need: ' + GL.find(g => g.id === d.g).l);
      failSound(); dragging = null; served = true; return;
    }
    const req = d.steps.map(s => s.t === 'ice' ? 'ice' : s.id);
    if (!req.every(r => dragging.ings.includes(r))) {
      flash('Missing ingredients!'); failSound(); dragging = null; served = true; return;
    }
    if (d.mix && !dragging.mixed) {
      flash('Needs mixing/shaking!'); failSound(); dragging = null; served = true; return;
    }
    G.combo++; updCombo();
    c.state = 'drinking'; c.drinkTimer = 180;
    c.savedPct = c.pat / c.maxP; c.comboMult = Math.min(G.combo, 4);
    G.glass = null; G.ings = []; G.mixed = false; G.finished = false;
    dragging = null;
    if (G.combo > 1) comboSound(); else serveSound();
    setLog('Served ' + c.name + '! 🍸', 'g'); updHUD();
    served = true;
  });
  return served;
}

function handleUp(e) {
  if (!G.running || !dragging) { dragging = null; return; }
  const p  = pos(e);              // release position (changedTouches on mobile)
  const dp = { x: dragging.x, y: dragging.y }; // glass visual position

  // Accept drop at EITHER the release point or where the glass is shown
  if (!_tryServe(p.x, p.y)) _tryServe(dp.x, dp.y);

  // Drop on sink
  if (dragging) {
    const sinkR = regions.find(r => r.id === 'sink');
    if (sinkR && p.x >= sinkR.x && p.x <= sinkR.x + sinkR.w &&
        p.y >= sinkR.y && p.y <= sinkR.y + sinkR.h) {
      G.glass = null; G.ings = []; G.mixed = false; G.finished = false;
      failSound(); setLog('Dumped in the sink 🚰', 'b');
    }
  }
  dragging = null;
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
  let h = `<div class="rrow"><span class="rlabel">Glass</span><span>${gl.l}</span></div>`;
  d.steps.forEach(s => {
    const lbl = s.t === 'ice' ? 'Ice' : s.t === 'tap' ? 'Tap' : 'Add';
    h += `<div class="rrow"><span class="rlabel">${lbl}</span><span>${s.l}</span></div>`;
  });
  if (d.mix) h += `<div class="rrow"><span class="rlabel shake">Shake</span><span>Mix / Shake</span></div>`;
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
    const mx = d.mix ? `<div class="mr"><span class="tag tg">Shake</span></div>` : '';
    card.innerHTML = `<div class="dn">${d.name}</div><div class="mr"><span class="tag tm">${gl.l}</span></div><div class="mr">${steps}</div>${mx}`;
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

// ─── PAUSE ───────────────────────────────────────────────────────────────────
function pauseGame() {
  if (!G.running) return;
  G.paused = true;
  document.getElementById('pausemodal').classList.add('open');
}

function resumeGame() {
  G.paused = false;
  document.getElementById('pausemodal').classList.remove('open');
}

function quitToMenu() {
  G.running = false;
  G.paused  = false;
  setGameRunning(false);
  document.getElementById('pausemodal').classList.remove('open');
  document.getElementById('overlay').style.display = 'flex';
}

// Escape or P to pause/resume
document.addEventListener('keydown', e => {
  if (!G.running) return;
  if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
    G.paused ? resumeGame() : pauseGame();
  }
});

// ─── MAIN LOOP ────────────────────────────────────────────────────────────────
function loop() {
  if (!G.running) return;
  frame++;
  buildRegions();
  if (!G.paused) {
    updateCustomers();                    // timers only tick when not paused
    particles = particles.filter(p => p.life > 0);
    floats    = floats.filter(f => f.life > 0);
  }
  draw(G, frame, curTab, popupOpen, popupAnchorX, dragging, particles, floats);
  requestAnimationFrame(loop);           // loop always keeps running
}

// ─── EXPOSE TO HTML onclick ATTRIBUTES ───────────────────────────────────────
// ES modules are scoped — inline onclick handlers need window references
window.startGame    = startGame;
window.continueGame = continueGame;
window.saveGame   = saveGame;
window.toggleMute = toggleMute;
window.openMenu   = openMenu;
window.closeMenu  = closeMenu;
window.pauseGame  = pauseGame;
window.resumeGame = resumeGame;
window.quitToMenu = quitToMenu;
