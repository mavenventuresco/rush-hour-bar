// ─── HELPERS ─────────────────────────────────────────────────────────────────
function rr(x, y, w, h, r, fill, stroke, lw = 1.5) {
  X.beginPath(); X.roundRect(x, y, w, h, r);
  if (fill)   { X.fillStyle = fill;     X.fill();   }
  if (stroke) { X.strokeStyle = stroke; X.lineWidth = lw; X.stroke(); }
}

function txt(str, x, y, color, size = 12, align = 'center', weight = '600') {
  X.font = `${weight} ${Math.round(size)}px 'Fredoka', sans-serif`;
  X.fillStyle = color; X.textAlign = align; X.textBaseline = 'middle';
  X.fillText(str, Math.round(x * 2) / 2, Math.round(y * 2) / 2);
}

// Darken / lighten a hex colour by a multiplier
function _dk(hex, f) {
  const c = parseInt(hex.replace('#',''), 16);
  const r = Math.max(0, Math.min(255, Math.round(((c>>16)&0xff)*f)));
  const g = Math.max(0, Math.min(255, Math.round(((c>>8) &0xff)*f)));
  const b = Math.max(0, Math.min(255, Math.round(( c     &0xff)*f)));
  return `rgb(${r},${g},${b})`;
}

// ─── GLASS LIQUID COLOUR ─────────────────────────────────────────────────────
function liquidColor(ings) {
  if (!ings.length) return null;
  if (ings.some(i => ['red_wine','cranberry','campari','grenadine'].includes(i))) return '#cc224499';
  if (ings.some(i => ['cola','dark_rum','kahlua'].includes(i)))                    return '#33110099';
  if (ings.some(i => ['orange','orange_soda','grapefruit','peach'].includes(i)))  return '#ff882299';
  if (ings.some(i => ['lemon','lime','citrus_soda','lemonade','tequila'].includes(i))) return '#eedd5099';
  if (ings.some(i => ['absinthe'].includes(i)))                                    return '#22ff2299';
  if (ings.some(i => ['rose'].includes(i)))                                        return '#ffaabb99';
  if (ings.some(i => ['vodka','gin','tonic','water'].includes(i)))                 return '#aaddff99';
  if (ings.some(i => ['bourbon','scotch','rye','irish','tennessee','vs','vsop','xo'].includes(i))) return '#cc883399';
  if (ings.some(i => ['light_rum','pineapple','coconut'].includes(i)))             return '#88ee8899';
  if (ings.some(i => ['baileys'].includes(i)))                                     return '#c8a06099';
  return '#bbbbff55';
}

// ─── GLASS SHAPES ────────────────────────────────────────────────────────────
function drawGlassShape(x, y, type, ings, finished, sc = 1) {
  X.save(); X.translate(x, y); X.scale(sc, sc);
  const stroke = finished ? '#f5c842' : '#c0b0e0';
  const lw     = finished ? 2.5 : Math.max(1.5, 2 / sc);
  X.strokeStyle = stroke; X.lineWidth = lw;
  if (finished) { X.shadowBlur = 18; X.shadowColor = '#f5c84466'; }

  const liq = liquidColor(ings);
  const hasIce = ings.includes('ice');

  switch (type) {
    case 'wine': {
      X.beginPath();
      X.moveTo(-10,-24); X.bezierCurveTo(-16,-20,-18,4,-7,18);
      X.lineTo(-3,20); X.lineTo(-3,28); X.lineTo(-9,28); X.lineTo(-9,30);
      X.lineTo(9,30); X.lineTo(9,28); X.lineTo(3,28); X.lineTo(3,20);
      X.bezierCurveTo(7,18,16,4,10,-24); X.closePath(); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha=.72;
        X.beginPath(); X.moveTo(-8,0); X.bezierCurveTo(-14,6,-6,16,-3,20); X.lineTo(3,20); X.bezierCurveTo(6,16,14,6,8,0); X.closePath();
        X.fillStyle=liq; X.fill(); X.restore();
      }
      break;
    }
    case 'martini': {
      X.beginPath(); X.moveTo(-18,-22); X.lineTo(0,12); X.lineTo(18,-22); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(0,12); X.lineTo(0,26); X.moveTo(-9,26); X.lineTo(9,26); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha=.72;
        X.beginPath(); X.moveTo(-12,-8); X.lineTo(0,12); X.lineTo(12,-8); X.closePath();
        X.fillStyle=liq; X.fill(); X.restore();
      }
      break;
    }
    case 'shot': {
      X.beginPath(); X.moveTo(-6,-16); X.lineTo(-7,16); X.lineTo(7,16); X.lineTo(6,-16); X.closePath(); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha=.72;
        X.beginPath(); X.moveTo(-5,0); X.lineTo(-6,13); X.lineTo(6,13); X.lineTo(5,0); X.closePath();
        X.fillStyle=liq; X.fill(); X.restore();
      }
      break;
    }
    case 'rocks': {
      X.beginPath(); X.moveTo(-15,-10); X.lineTo(-16,16); X.lineTo(16,16); X.lineTo(15,-10); X.closePath(); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha=.72;
        X.beginPath(); X.moveTo(-13,2); X.lineTo(-14,14); X.lineTo(14,14); X.lineTo(13,2); X.closePath();
        X.fillStyle=liq; X.fill();
        if (hasIce) { X.globalAlpha=.5; rr(-9,3,6,6,1,'#cceeff',null); rr(3,5,5,5,1,'#cceeff',null); }
        X.restore();
      }
      break;
    }
    case 'tall': {
      X.beginPath(); X.moveTo(-9,-26); X.lineTo(-10,24); X.lineTo(10,24); X.lineTo(9,-26); X.closePath(); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha=.72;
        X.beginPath(); X.moveTo(-8,-4); X.lineTo(-9,22); X.lineTo(9,22); X.lineTo(8,-4); X.closePath();
        X.fillStyle=liq; X.fill();
        if (hasIce) { X.globalAlpha=.45; rr(-6,-2,5,6,1,'#cceeff',null); }
        X.restore();
      }
      break;
    }
    case 'mug': {
      X.beginPath(); X.moveTo(-13,-20); X.lineTo(-14,20); X.lineTo(12,20); X.lineTo(11,-20); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(11,-8); X.bezierCurveTo(24,-8,24,12,11,12); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha=.75;
        X.beginPath(); X.moveTo(-11,-2); X.lineTo(-12,18); X.lineTo(10,18); X.lineTo(9,-2); X.closePath();
        X.fillStyle=liq; X.fill();
        if (ings.some(i=>['light','dark'].includes(i))) {
          X.fillStyle='#ffffffcc';
          X.beginPath(); X.ellipse(-1,-2,11,5,0,0,Math.PI*2); X.fill();
        }
        X.restore();
      }
      break;
    }
  }
  X.shadowBlur=0;
  if (finished) {
    X.save(); X.fillStyle='#f5c842';
    [[14,-22],[-14,-18],[0,-30]].forEach(([dx,dy])=>{ X.beginPath(); X.arc(dx,dy,2.5,0,Math.PI*2); X.fill(); });
    X.restore();
  }
  X.restore();
}

// ─── CHARACTER DRAWING ───────────────────────────────────────────────────────
function drawPerson(x, y, skin, cloth, hair, face, scale = 1) {
  X.save(); X.translate(x, y); X.scale(scale, scale);

  // Ground shadow
  X.save(); X.globalAlpha = 0.18;
  X.beginPath(); X.ellipse(0, 46, 16, 4, 0, 0, Math.PI * 2);
  X.fillStyle = '#000'; X.fill(); X.restore();

  // ── Arms (drawn behind body) ──
  const clothDark = _dk(cloth, 0.72);
  // Left arm
  X.beginPath();
  X.moveTo(-14, 16);
  X.bezierCurveTo(-22, 18, -25, 30, -23, 40);
  X.lineTo(-18, 40);
  X.bezierCurveTo(-18, 30, -16, 20, -13, 18);
  X.closePath();
  X.fillStyle = clothDark; X.fill();
  // Right arm
  X.beginPath();
  X.moveTo(14, 16);
  X.bezierCurveTo(22, 18, 25, 30, 23, 40);
  X.lineTo(18, 40);
  X.bezierCurveTo(18, 30, 16, 20, 13, 18);
  X.closePath();
  X.fillStyle = clothDark; X.fill();

  // Hands
  X.beginPath(); X.arc(-21, 40, 5, 0, Math.PI * 2);
  X.fillStyle = skin; X.fill();
  X.save(); X.globalAlpha = 0.4; X.strokeStyle = _dk(skin, 0.8); X.lineWidth = 1;
  X.stroke(); X.restore();
  X.beginPath(); X.arc(21, 40, 5, 0, Math.PI * 2);
  X.fillStyle = skin; X.fill();

  // ── Torso ──
  X.beginPath();
  X.moveTo(-15, 40); X.lineTo(-16, 14); X.lineTo(16, 14); X.lineTo(15, 40); X.closePath();
  const bodyG = X.createLinearGradient(-16, 14, 16, 14);
  bodyG.addColorStop(0,   _dk(cloth, 0.75));
  bodyG.addColorStop(0.45, cloth);
  bodyG.addColorStop(1,   _dk(cloth, 0.8));
  X.fillStyle = bodyG; X.fill();

  // Shirt front panel / collar V
  X.beginPath();
  X.moveTo(-5, 14); X.lineTo(0, 24); X.lineTo(5, 14); X.closePath();
  X.fillStyle = _dk(cloth, 0.65); X.fill();

  // Shirt fold / shadow at waist
  X.save(); X.globalAlpha = 0.18;
  X.beginPath(); X.moveTo(-15, 34); X.lineTo(15, 34); X.lineTo(14, 40); X.lineTo(-14, 40); X.closePath();
  X.fillStyle = '#000'; X.fill(); X.restore();

  // ── Neck ──
  X.beginPath(); X.moveTo(-5, 14); X.lineTo(-5, 7); X.lineTo(5, 7); X.lineTo(5, 14); X.closePath();
  X.fillStyle = skin; X.fill();

  // ── Head ──
  // Head shape
  X.beginPath();
  X.ellipse(0, -5, 14, 17, 0, 0, Math.PI * 2);
  const headG = X.createRadialGradient(-4, -10, 1, 0, -5, 17);
  headG.addColorStop(0, _dk(skin, 1.18));
  headG.addColorStop(0.6, skin);
  headG.addColorStop(1, _dk(skin, 0.86));
  X.fillStyle = headG; X.fill();

  // Ears
  X.beginPath(); X.ellipse(-15, -3, 3.5, 5, 0.2, 0, Math.PI * 2);
  X.fillStyle = _dk(skin, 0.88); X.fill();
  X.beginPath(); X.ellipse(15, -3, 3.5, 5, -0.2, 0, Math.PI * 2);
  X.fillStyle = _dk(skin, 0.88); X.fill();
  // Inner ear detail
  X.save(); X.globalAlpha = 0.35;
  X.beginPath(); X.ellipse(-15, -3, 2, 3.5, 0.2, 0, Math.PI * 2);
  X.fillStyle = _dk(skin, 0.7); X.fill();
  X.restore();

  // ── Hair ──
  X.beginPath();
  X.moveTo(-16, -6);
  X.bezierCurveTo(-18, -16, -14, -28, 0, -28);
  X.bezierCurveTo(14, -28, 18, -16, 16, -6);
  X.bezierCurveTo(10, -8, -10, -8, -16, -6);
  X.closePath();
  X.fillStyle = hair; X.fill();
  // Hair highlight
  X.save(); X.globalAlpha = 0.28;
  X.beginPath(); X.ellipse(-3, -20, 5, 3, -0.4, 0, Math.PI * 2);
  X.fillStyle = _dk(hair, 1.8); X.fill(); X.restore();
  // Sideburn detail
  X.save(); X.globalAlpha = 0.5;
  X.beginPath(); X.ellipse(-14, -8, 2.5, 5, 0, 0, Math.PI * 2);
  X.fillStyle = hair; X.fill();
  X.beginPath(); X.ellipse(14, -8, 2.5, 5, 0, 0, Math.PI * 2);
  X.fillStyle = hair; X.fill(); X.restore();

  // ── Face ──
  if (face === 'angry') {
    // Furrowed brows
    X.save(); X.strokeStyle = _dk(skin, 0.5); X.lineWidth = 2.5; X.lineCap = 'round';
    X.beginPath(); X.moveTo(-12, -12); X.lineTo(-5, -9); X.stroke();
    X.beginPath(); X.moveTo(12, -12); X.lineTo(5, -9); X.stroke(); X.restore();
    // Squinting red eyes
    X.fillStyle = '#bb1100';
    X.beginPath(); X.ellipse(-7, -5, 4.5, 2.5, 0, 0, Math.PI * 2); X.fill();
    X.beginPath(); X.ellipse(7, -5, 4.5, 2.5, 0, 0, Math.PI * 2); X.fill();
    // Frown
    X.beginPath(); X.arc(0, 7, 5, Math.PI + 0.25, Math.PI * 2 - 0.25);
    X.strokeStyle = '#661100'; X.lineWidth = 1.8; X.stroke();
  } else if (face === 'happy') {
    // Curved happy eyes
    X.save(); X.strokeStyle = '#1a1a1a'; X.lineWidth = 2.2; X.lineCap = 'round';
    X.beginPath(); X.arc(-7, -4, 4, Math.PI + 0.15, Math.PI * 2 - 0.15); X.stroke();
    X.beginPath(); X.arc(7, -4, 4, Math.PI + 0.15, Math.PI * 2 - 0.15); X.stroke(); X.restore();
    // Smile path
    X.beginPath(); X.arc(0, 3, 7, 0.08, Math.PI - 0.08);
    X.strokeStyle = '#7a3322'; X.lineWidth = 2; X.stroke();
    // Teeth fill
    X.save();
    X.beginPath(); X.arc(0, 3, 7, 0.08, Math.PI - 0.08); X.lineTo(0, 3); X.closePath();
    X.clip();
    X.fillStyle = '#fffaf0'; X.fillRect(-7, 3, 14, 7); X.restore();
    // Rosy cheeks
    X.save(); X.globalAlpha = 0.28; X.fillStyle = '#ff7777';
    X.beginPath(); X.ellipse(-11, 1, 4.5, 3, 0, 0, Math.PI * 2); X.fill();
    X.beginPath(); X.ellipse(11, 1, 4.5, 3, 0, 0, Math.PI * 2); X.fill(); X.restore();
  } else if (face === 'drinking') {
    // Closed/tilted eyes while sipping
    X.save(); X.strokeStyle = '#2a2a2a'; X.lineWidth = 2; X.lineCap = 'round';
    X.beginPath(); X.moveTo(-11, -6); X.lineTo(-4, -5); X.stroke();
    X.beginPath(); X.moveTo(4, -5); X.lineTo(11, -6); X.stroke(); X.restore();
    // Open mouth
    X.beginPath(); X.ellipse(0, 5, 4.5, 4, 0, 0, Math.PI * 2);
    X.fillStyle = '#5a1a00'; X.fill();
    X.save(); X.globalAlpha = 0.6; X.fillStyle = '#cc4422';
    X.beginPath(); X.ellipse(0, 5, 3, 2.5, 0, 0, Math.PI * 2); X.fill(); X.restore();
  } else {
    // Neutral — round whites + dark pupils
    X.fillStyle = '#f8f8f8';
    X.beginPath(); X.ellipse(-7, -5, 5, 5.5, 0, 0, Math.PI * 2); X.fill();
    X.beginPath(); X.ellipse(7, -5, 5, 5.5, 0, 0, Math.PI * 2); X.fill();
    X.fillStyle = '#1a1a2a';
    X.beginPath(); X.arc(-7, -4, 3.2, 0, Math.PI * 2); X.fill();
    X.beginPath(); X.arc(7, -4, 3.2, 0, Math.PI * 2); X.fill();
    X.save(); X.globalAlpha = 0.75; X.fillStyle = '#ffffff';
    X.beginPath(); X.arc(-6, -5, 1.4, 0, Math.PI * 2); X.fill();
    X.beginPath(); X.arc(8, -5, 1.4, 0, Math.PI * 2); X.fill(); X.restore();
    // Neutral mouth
    X.beginPath(); X.arc(0, 5, 4, 0.1, Math.PI - 0.1);
    X.strokeStyle = _dk(skin, 0.65); X.lineWidth = 1.6; X.stroke();
  }

  X.restore();
}

// ─── COCKTAIL SHAKER ─────────────────────────────────────────────────────────
function _drawShaker(cx, cy) {
  X.save(); X.translate(cx, cy);
  X.beginPath();
  X.moveTo(-11,18); X.lineTo(-12,-4); X.lineTo(-8,-13); X.lineTo(-8,-20); X.lineTo(8,-20); X.lineTo(8,-13); X.lineTo(12,-4); X.lineTo(11,18); X.closePath();
  const bg = X.createLinearGradient(-12,0,12,0);
  bg.addColorStop(0,'#a0a8c0'); bg.addColorStop(0.3,'#dce0f0'); bg.addColorStop(0.7,'#c0c8dc'); bg.addColorStop(1,'#8890a8');
  X.fillStyle=bg; X.fill(); X.strokeStyle='#6870a0'; X.lineWidth=1.8; X.stroke();
  X.beginPath(); X.roundRect(-8,-28,16,10,3);
  const cg=X.createLinearGradient(-8,0,8,0); cg.addColorStop(0,'#b0b8d0'); cg.addColorStop(0.5,'#e0e4f4'); cg.addColorStop(1,'#9098b8');
  X.fillStyle=cg; X.fill(); X.strokeStyle='#6870a0'; X.lineWidth=1.5; X.stroke();
  X.beginPath(); X.roundRect(-5,-34,10,8,3); X.fillStyle='#d0d8f0'; X.fill(); X.strokeStyle='#8088b0'; X.lineWidth=1.2; X.stroke();
  X.save(); X.globalAlpha=0.35; X.fillStyle='#fff';
  X.beginPath(); X.moveTo(-10,16); X.lineTo(-11,-3); X.lineTo(-7,-3); X.lineTo(-6,16); X.closePath(); X.fill();
  X.globalAlpha=0.28; X.fillRect(-7,-27,4,8); X.restore();
  X.restore();
}

// ─── SHARED WORKSTATION GEOMETRY ─────────────────────────────────────────────
function wsLayout() {
  const TAP_W=92, ICE_W=58, MX_W=Math.min(220,Math.max(160,W*0.2));
  const SINK_W=90, JIG_W=78, GAP=5;
  const totalW=TAP_W+ICE_W+MX_W+SINK_W+JIG_W+GAP*4;
  const ox=Math.round((W-totalW)/2);
  return [
    { id:'taps', x:ox,                               w:TAP_W,  label:'TAPS'          },
    { id:'ice',  x:ox+TAP_W+GAP,                     w:ICE_W,  label:'ICE'            },
    { id:'mix',  x:ox+TAP_W+ICE_W+GAP*2,             w:MX_W,   label:'MIXING STATION' },
    { id:'sink', x:ox+TAP_W+ICE_W+MX_W+GAP*3,       w:SINK_W, label:'SINK'           },
    { id:'jig',  x:ox+TAP_W+ICE_W+MX_W+SINK_W+GAP*4,w:JIG_W,  label:'SHAKE'          },
  ];
}

// ─── SHARED SHELF POPUP GEOMETRY ─────────────────────────────────────────────
function shelfPopupLayout(tab) {
  const items = SHELVES[tab].items;
  const IW=68, IH=66, GAP=8;
  const COLS = Math.min(items.length, 5);
  const ROWS = Math.ceil(items.length / COLS);
  const pw = COLS*(IW+GAP)-GAP+32;
  const ph = ROWS*(IH+GAP)-GAP+52;
  const px = Math.round((W-pw)/2);
  const py = Math.round((H-ph)/2);
  return { px, py, pw, ph, IW, IH, GAP, COLS, ROWS, items };
}

// ─── MAIN DRAW ───────────────────────────────────────────────────────────────
function draw(G, frame, curTab, popupOpen, dragging, particles, floats) {
  const L = lo();
  X.setTransform(1,0,0,1,0,0);
  X.clearRect(0,0,cv.width,cv.height);
  X.setTransform(DPR,0,0,DPR,0,0);
  X.imageSmoothingEnabled = true;
  X.imageSmoothingQuality = 'high';

  _drawBackground(L, frame);
  _drawGlassRack(L, G, frame);
  _drawBar(L, G, frame, dragging);
  _drawWorkstation(L, G, frame);
  _drawShelfTabs(L, curTab, popupOpen);
  if (popupOpen) _drawShelfPopup(curTab, G);
  _drawParticles(particles, floats);

  if (dragging) {
    X.save(); X.globalAlpha=0.88; X.shadowBlur=20; X.shadowColor='#f5c84466';
    drawGlassShape(dragging.x,dragging.y,dragging.glass,dragging.ings,true,1.25);
    X.restore();
  }
}

// ─── BACKGROUND ──────────────────────────────────────────────────────────────
function _drawBackground(L, frame) {
  // Deep bar atmosphere
  const bg = X.createLinearGradient(0, L.rackY, 0, H);
  bg.addColorStop(0,   '#130930');
  bg.addColorStop(0.3, '#1c0e40');
  bg.addColorStop(0.7, '#10082a');
  bg.addColorStop(1,   '#080516');
  X.fillStyle = bg; X.fillRect(0, L.hudH, W, H - L.hudH);

  // Back wall panels — subtle texture
  const panelH = L.barY - L.hudH;
  for (let i = 0; i < 5; i++) {
    const px = i * (W / 5);
    X.save(); X.globalAlpha = 0.04;
    rr(px + 8, L.hudH + 4, W/5 - 16, panelH - 8, 4, '#ffffff', null);
    X.restore();
  }

  // Neon wall glow strips near ceiling
  const neonColors = ['#ff40b0','#4090ff','#c040ff','#40ffb0','#ffcc30'];
  neonColors.forEach((c, i) => {
    X.save();
    X.globalAlpha = 0.06 + 0.03 * Math.sin(frame * 0.02 + i * 1.3);
    X.shadowBlur = 18; X.shadowColor = c;
    X.strokeStyle = c; X.lineWidth = 2;
    const nx = W * (i + 0.5) / 5;
    X.beginPath(); X.moveTo(nx - 20, L.hudH + 6); X.lineTo(nx + 20, L.hudH + 6); X.stroke();
    X.restore();
  });

  // Stars
  X.save(); X.globalAlpha = 0.3;
  for (let i = 0; i < 40; i++) {
    const sx = (i * 137.5) % W;
    const sy = L.hudH + (i * 73.1) % (panelH * 0.7);
    const r = i % 3 === 0 ? 1.2 : 0.7;
    X.fillStyle = '#ffffff';
    X.beginPath(); X.arc(sx, sy, r + 0.4 * Math.sin(frame * 0.04 + i), 0, Math.PI * 2); X.fill();
  }
  X.restore();
}

// ─── GLASS RACK ──────────────────────────────────────────────────────────────
function _drawGlassRack(L, G, frame) {
  // Rack panel
  const rg = X.createLinearGradient(0,L.rackY,0,L.rackY+L.rackH);
  rg.addColorStop(0,'#0e0624'); rg.addColorStop(1,'#160a30');
  X.fillStyle=rg; X.fillRect(0,L.rackY,W,L.rackH);
  rr(0,L.rackY,W,4,0,'#2a1850',null);

  // Wooden beam
  const beam = X.createLinearGradient(0,L.rackY+4,0,L.rackY+10);
  beam.addColorStop(0,'#4a3060'); beam.addColorStop(1,'#2e1c44');
  X.fillStyle=beam; X.fillRect(W*0.06, L.rackY+4, W*0.88, 6);
  X.save(); X.globalAlpha=0.3; X.fillStyle='#8060b0'; X.fillRect(W*0.06,L.rackY+4,W*0.88,1); X.restore();

  const rackIW = Math.min(84,(W-24)/6);
  const rackStartX = (W-rackIW*6)/2;

  GL.forEach((gl, i) => {
    const cx = rackStartX + i*rackIW + rackIW/2;
    const cy = L.rackY + L.rackH/2 + 8;
    const sel = G.glass===gl.id;

    // Hanging chain
    X.strokeStyle='#3a2870'; X.lineWidth=1.5;
    X.beginPath(); X.moveTo(cx,L.rackY+10); X.lineTo(cx,L.rackY+17); X.stroke();
    // Hook circle
    X.beginPath(); X.arc(cx,L.rackY+17,2,0,Math.PI*2);
    X.strokeStyle='#5a4090'; X.lineWidth=1.2; X.stroke();

    // Card
    const cardG = X.createLinearGradient(0,L.rackY+17,0,L.rackY+L.rackH-2);
    if (sel) { cardG.addColorStop(0,'#2a1e58'); cardG.addColorStop(1,'#1a1240'); }
    else      { cardG.addColorStop(0,'#110830'); cardG.addColorStop(1,'#0a0420'); }
    rr(cx-rackIW/2+3, L.rackY+17, rackIW-6, L.rackH-21, 7, cardG, sel?'#f5c842':'#2a1850', sel?2:1);

    if (sel) {
      X.save(); X.globalAlpha=0.18+0.1*Math.sin(frame*0.1);
      X.shadowBlur=14; X.shadowColor='#f5c842';
      rr(cx-rackIW/2+3,L.rackY+17,rackIW-6,L.rackH-21,7,'#f5c84222',null);
      X.restore();
    }

    drawGlassShape(cx,cy,gl.id,[],false,0.82);
    txt(gl.l,cx,L.rackY+L.rackH-4,sel?'#f5c842':'#6a5090',9);
  });
}

// ─── BAR + CUSTOMERS ─────────────────────────────────────────────────────────
function _drawBar(L, G, frame, dragging) {
  // Stage lighting cones
  for (let i = 0; i < 6; i++) {
    X.save();
    X.globalAlpha = 0.025 + 0.012*Math.sin(frame*0.018+i*1.1);
    X.beginPath();
    const lx = W*(i+0.5)/6;
    X.moveTo(lx, L.rackY+L.rackH);
    X.lineTo(lx-60, L.barY+L.barH);
    X.lineTo(lx+60, L.barY+L.barH);
    X.closePath();
    X.fillStyle=['#ff50c0','#50c0ff','#c050ff','#50ffc0','#f5c842','#ff8844'][i];
    X.fill(); X.restore();
  }

  // Bar floor (lower section behind stools)
  X.save(); X.globalAlpha=0.25;
  const floorG = X.createLinearGradient(0,L.counterY+24,0,L.counterY+60);
  floorG.addColorStop(0,'#2a1c10'); floorG.addColorStop(1,'#1a100a');
  X.fillStyle=floorG; X.fillRect(0,L.counterY+24,W,60); X.restore();

  // Counter — polished wood with grain
  const cg = X.createLinearGradient(0,L.counterY,0,L.counterY+20);
  cg.addColorStop(0,'#c08844'); cg.addColorStop(0.2,'#a8763a'); cg.addColorStop(0.6,'#8B5E2A'); cg.addColorStop(1,'#5a3818');
  X.fillStyle=cg; X.fillRect(0,L.counterY,W,20);
  // Wood grain lines
  X.save(); X.globalAlpha=0.08;
  for (let g=0; g<12; g++) {
    X.strokeStyle='#000'; X.lineWidth=0.8;
    X.beginPath(); X.moveTo(g*W/12,L.counterY); X.lineTo(g*W/12+20,L.counterY+20); X.stroke();
  }
  X.restore();
  // Top highlight
  X.save(); X.globalAlpha=0.4; X.fillStyle='#fff8e0'; X.fillRect(0,L.counterY,W,2); X.restore();
  // Bottom shadow edge
  const edgeG = X.createLinearGradient(0,L.counterY+20,0,L.counterY+26);
  edgeG.addColorStop(0,'#3a2010'); edgeG.addColorStop(1,'transparent');
  X.fillStyle=edgeG; X.fillRect(0,L.counterY+20,W,6);

  // Stools + customers
  G.stools.forEach((c, i) => {
    const cx = seatX(i);
    const cy = L.barY + L.barH - 62;

    // Stool pole
    const poleG = X.createLinearGradient(cx-3,0,cx+3,0);
    poleG.addColorStop(0,'#2a1840'); poleG.addColorStop(0.5,'#4a2a6a'); poleG.addColorStop(1,'#2a1840');
    X.fillStyle=poleG; X.fillRect(cx-3,cy+44,6,24);

    // Stool seat — 3D ellipse look
    X.save();
    X.beginPath(); X.ellipse(cx,cy+43,18,7,0,0,Math.PI*2);
    const seatG=X.createRadialGradient(cx-4,cy+40,1,cx,cy+43,18);
    seatG.addColorStop(0,'#7a52a0'); seatG.addColorStop(1,'#4a2870');
    X.fillStyle=seatG; X.fill();
    X.strokeStyle='#8a60b8'; X.lineWidth=1.2; X.stroke(); X.restore();
    // Seat bottom shadow
    X.save(); X.globalAlpha=0.3;
    X.beginPath(); X.ellipse(cx,cy+47,18,5,0,0,Math.PI*2);
    X.fillStyle='#000'; X.fill(); X.restore();

    if (!c) {
      X.save(); X.globalAlpha=0.14;
      txt('open',cx,cy+43,'#9070c0',8); X.restore();
      return;
    }

    // Order bubble
    if (c.state==='ordering') {
      const bw=96,bh=32;
      const bx=cx-bw/2, by=cy-56;
      const pct=Math.max(0,c.pat/c.maxP);
      const bubG=X.createLinearGradient(bx,by,bx,by+bh);
      bubG.addColorStop(0,'#24103edd'); bubG.addColorStop(1,'#180c28dd');
      rr(bx,by,bw,bh,9,bubG,pct<0.25?'#c0392b':'#5a3490',2);
      // Drop shadow on bubble
      X.save(); X.globalAlpha=0.2; X.shadowBlur=8; X.shadowColor='#000';
      rr(bx,by,bw,bh,9,'transparent','#000',0); X.restore();
      // Tail
      X.beginPath(); X.moveTo(cx-5,by+bh); X.lineTo(cx+5,by+bh); X.lineTo(cx,by+bh+8); X.closePath();
      X.fillStyle='#180c28dd'; X.fill();
      txt(c.drink.name,cx,by+bh/2,'#f5c842',10);
      // Patience bar
      const pbw=bw-12;
      rr(bx+6,by+bh-8,pbw,4,2,'#100820',null);
      const pc=pct>0.5?'#27ae60':pct>0.25?'#f39c12':'#c0392b';
      if (pct>0) rr(bx+6,by+bh-8,pbw*pct,4,2,pc,null);
    }

    const face = c.state==='drinking'?'drinking':c.state==='paying'?'happy':c.pat/c.maxP<0.25?'angry':'normal';
    const bob  = c.state==='drinking'?Math.sin(frame*0.15)*2:Math.sin(frame*0.03+c.id)*1.5;

    drawPerson(cx, cy+bob, c.skin, c.cloth, c.hair, face, 0.9);
    txt(c.name, cx, cy+56, '#8070b0', 8);

    if (c.state==='drinking') {
      drawGlassShape(cx+22,cy+20+bob,c.drink.g,c.drink.steps.map(s=>s.t==='ice'?'ice':s.id),false,0.5);
    }
    if (c.state==='paying') {
      X.save(); X.shadowBlur=10; X.shadowColor='#f5c842';
      txt('$'+c.payAmount,cx,cy-54,'#f5c842',14); X.restore();
    }
    if (dragging&&c.state==='ordering') {
      X.save(); X.globalAlpha=0.1+0.07*Math.sin(frame*0.1);
      X.shadowBlur=18; X.shadowColor='#f5c842';
      rr(cx-44,cy-20,88,74,10,'#f5c84222','#f5c842',1.5); X.restore();
    }
  });
}

// ─── WORKSTATION ─────────────────────────────────────────────────────────────
function _drawWorkstation(L, G, frame) {
  const wsGrad=X.createLinearGradient(0,L.wsY,0,L.wsY+L.wsH);
  wsGrad.addColorStop(0,'#140e2a'); wsGrad.addColorStop(1,'#0e0a1e');
  X.fillStyle=wsGrad; X.fillRect(0,L.wsY,W,L.wsH);

  // Metallic counter surface line
  X.save(); X.globalAlpha=0.18; X.fillStyle='#a0a0c0'; X.fillRect(0,L.wsY,W,1); X.restore();
  rr(0,L.wsY,W,L.wsH,0,null,'#2a1c50',1.5);

  const secs=wsLayout();
  const tapY=L.wsY+L.wsH/2-4;

  secs.forEach(s=>{
    const secG=X.createLinearGradient(s.x,L.wsY+4,s.x,L.wsY+L.wsH-4);
    secG.addColorStop(0,'#150a25'); secG.addColorStop(1,'#0c0618');
    rr(s.x,L.wsY+4,s.w,L.wsH-8,8,secG,'#2a1c50',1.5);
    txt(s.label,s.x+s.w/2,L.wsY+L.wsH-6,'#3a2870',7);
  });

  // Taps
  const tapSec=secs[0];
  const t1x=tapSec.x+tapSec.w*0.3;
  const t2x=tapSec.x+tapSec.w*0.72;
  [{x:t1x,c:'#7090d0',l:'LITE'},{x:t2x,c:'#c09050',l:'DARK'}].forEach(t=>{
    // Tap body with gradient
    const tg=X.createLinearGradient(t.x-10,0,t.x+10,0);
    tg.addColorStop(0,_dk(t.c,0.6)); tg.addColorStop(0.5,t.c); tg.addColorStop(1,_dk(t.c,0.7));
    rr(t.x-10,L.wsY+8,20,34,4,tg,t.c,2);
    rr(t.x-6,L.wsY+4,12,8,3,t.c,_dk(t.c,0.6),1);
    // Spout
    X.strokeStyle=t.c; X.lineWidth=3;
    X.beginPath(); X.moveTo(t.x,L.wsY+42); X.quadraticCurveTo(t.x-8,L.wsY+50,t.x-10,L.wsY+54); X.stroke();
    // Shine
    X.save(); X.globalAlpha=0.3; X.strokeStyle='#fff'; X.lineWidth=1;
    X.beginPath(); X.moveTo(t.x-4,L.wsY+10); X.lineTo(t.x-4,L.wsY+36); X.stroke(); X.restore();
    txt(t.l,t.x,L.wsY+L.wsH-13,t.c,7);
  });

  // Ice machine
  const iceSec=secs[1];
  const iceCx=iceSec.x+iceSec.w/2;
  const iceBox=X.createLinearGradient(iceCx-18,L.wsY+10,iceCx+18,L.wsY+48);
  iceBox.addColorStop(0,'#1a3050'); iceBox.addColorStop(1,'#0e1e34');
  rr(iceCx-18,L.wsY+10,36,38,6,iceBox,'#3a7090',1.5);
  X.save(); X.globalAlpha=0.3; X.strokeStyle='#88ccee'; X.lineWidth=1;
  X.beginPath(); X.moveTo(iceCx-12,L.wsY+22); X.lineTo(iceCx-6,L.wsY+22); X.stroke(); X.restore();
  txt('🧊',iceCx,tapY-2,'#aaddff',20);

  // Mixing station
  const mxSec=secs[2];
  const mxCx=mxSec.x+mxSec.w/2;
  if (G.glass) {
    drawGlassShape(mxCx,tapY+4,G.glass,G.ings,G.finished,1.15);
  } else {
    X.save(); X.globalAlpha=0.18; txt('pick glass ↑',mxCx,tapY,'#9070c0',10); X.restore();
  }

  if (G.ings.length>0) {
    const chipStartX=mxSec.x+6;
    G.ings.slice(-8).forEach((id,i)=>{
      const bst=BSTYLES[id]; if(!bst)return;
      const chipX=chipStartX+i*18, chipY=L.wsY+7;
      rr(chipX,chipY,16,16,3,bst.body,bst.dark,1);
      X.font="bold 6px 'Fredoka',sans-serif";
      X.fillStyle='#fff'; X.textAlign='center'; X.textBaseline='middle';
      X.fillText((bst.text||'').slice(0,4),chipX+8,chipY+8);
    });
  }

  const mixBtnY=L.wsY+L.wsH-20;
  rr(mxCx-30,mixBtnY,60,14,5,G.mixed?'#1a4020':'#1e1640',G.mixed?'#4aaa60':'#5a3898',1.5);
  txt(G.mixed?'✅ MIXED':'🔀 MIX',mxCx,mixBtnY+7,G.mixed?'#7dff9a':'#b0a0e0',8);

  if (G.finished&&!window._dragging) {
    const pulse=0.65+0.35*Math.sin(frame*0.14);
    X.save(); X.globalAlpha=pulse; txt('✅ DRAG TO SERVE!',mxCx,L.wsY+9,'#7dff9a',10); X.restore();
  }

  // Sink
  const skSec=secs[3], skCx=skSec.x+skSec.w/2;
  const sinkG=X.createLinearGradient(skSec.x+8,L.wsY+10,skSec.x+8,L.wsY+46);
  sinkG.addColorStop(0,'#0e2030'); sinkG.addColorStop(1,'#070f18');
  rr(skSec.x+8,L.wsY+10,skSec.w-16,36,5,sinkG,'#3a6080',1.5);
  X.save(); X.globalAlpha=0.35; X.strokeStyle='#88aacc'; X.lineWidth=1;
  X.beginPath(); X.ellipse(skCx,L.wsY+32,10,4,0,0,Math.PI*2); X.stroke(); X.restore();
  txt('🚰',skCx,tapY-2,'#88aacc',20);

  // Shaker
  const jgSec=secs[4], jgCx=jgSec.x+jgSec.w/2;
  rr(jgSec.x+6,L.wsY+10,jgSec.w-12,36,5,'#180c28','#7050b0',1.5);
  _drawShaker(jgCx,tapY+2);
  txt('SHAKE',jgCx,L.wsY+L.wsH-13,'#c8a0ff',7);
}

// ─── SHELF TABS — compact centred pills ──────────────────────────────────────
function _drawShelfTabs(L, curTab, popupOpen) {
  const tabs=Object.keys(SHELVES);
  const PW=56, PH=26, GAP=5;
  const totalW=tabs.length*(PW+GAP)-GAP;
  const startX=Math.round((W-totalW)/2);
  const ty=L.tabY+Math.round((L.tabH-PH)/2);

  // Pill strip background
  X.save(); X.globalAlpha=0.4;
  rr(startX-8,ty-3,totalW+16,PH+6,14,'#0c0820','#1e1240',1);
  X.restore();

  tabs.forEach((key,i)=>{
    const tx=startX+i*(PW+GAP);
    const on=curTab===key&&popupOpen;
    const pg=X.createLinearGradient(tx,ty,tx,ty+PH);
    if(on){ pg.addColorStop(0,'#3a2068'); pg.addColorStop(1,'#221244'); }
    else  { pg.addColorStop(0,'#180e34'); pg.addColorStop(1,'#0e0820'); }
    rr(tx,ty,PW,PH,PH/2,pg,on?'#f5c842':'#3a2860',on?2:1.2);
    if(on){ X.save(); X.globalAlpha=0.15; X.shadowBlur=10; X.shadowColor='#f5c842';
      rr(tx,ty,PW,PH,PH/2,'#f5c84233',null); X.restore(); }
    txt(SHELVES[key].ico,tx+PW/2,ty+PH/2,on?'#f5c842':'#8060a0',13);
  });

  // Label under active tab
  if(popupOpen){
    const idx=tabs.indexOf(curTab);
    const tx=startX+idx*(PW+GAP);
    txt(SHELVES[curTab].lbl,tx+PW/2,ty+PH+9,'#f5c842',8);
  }
}

// ─── SHELF POPUP ─────────────────────────────────────────────────────────────
function _drawShelfPopup(curTab, G) {
  const p=shelfPopupLayout(curTab);

  // Full-screen dim
  X.save(); X.globalAlpha=0.55; X.fillStyle='#000'; X.fillRect(0,0,W,H); X.restore();

  // Panel shadow
  X.save(); X.shadowBlur=40; X.shadowColor='#6030c055';
  const panG=X.createLinearGradient(p.px,p.py,p.px,p.py+p.ph);
  panG.addColorStop(0,'#1e1248'); panG.addColorStop(1,'#0e0828');
  rr(p.px,p.py,p.pw,p.ph,16,panG,'#5a3898',2.5);
  X.restore();

  // Top accent bar
  const acG=X.createLinearGradient(p.px,p.py,p.px+p.pw,p.py);
  acG.addColorStop(0,'#7030c0'); acG.addColorStop(0.5,'#a050f0'); acG.addColorStop(1,'#7030c0');
  X.fillStyle=acG; X.fillRect(p.px+2,p.py+2,p.pw-4,3);
  // Round top corners of accent
  rr(p.px+2,p.py+2,p.pw-4,5,3,acG,null);

  // Header
  const sh=SHELVES[curTab];
  txt(sh.ico+' '+sh.lbl,p.px+p.pw/2,p.py+18,'#f5c842',14,'center','700');

  // Item grid
  p.items.forEach((item,i)=>{
    const col=i%p.COLS, row=Math.floor(i/p.COLS);
    const ix=p.px+16+col*(p.IW+p.GAP);
    const iy=p.py+36+row*(p.IH+p.GAP);
    const used=G.ings.includes(item.id);

    const ig=X.createLinearGradient(ix,iy,ix,iy+p.IH);
    if(used){ ig.addColorStop(0,'#122012'); ig.addColorStop(1,'#080e06'); }
    else    { ig.addColorStop(0,'#1a1038'); ig.addColorStop(1,'#0e0822'); }
    rr(ix,iy,p.IW,p.IH,10,ig,used?'#27ae60':'#3a2860',used?2:1.5);

    // Used checkmark badge
    if(used){
      X.save(); X.globalAlpha=0.85;
      rr(ix+p.IW-14,iy+2,12,12,6,'#1a4020','#27ae60',1);
      txt('✓',ix+p.IW-8,iy+8,'#7dff9a',8,'center','700');
      X.restore();
    }

    const bst=BSTYLES[item.id];
    if(bst) drawBottle(X,ix+p.IW/2,iy+p.IH/2-4,bst,item.n,0.8);
    txt(item.n,ix+p.IW/2,iy+p.IH-7,used?'#7dff9a':'#9080c0',7);
  });

  // Close hint
  X.save(); X.globalAlpha=0.35;
  txt('click outside to close',p.px+p.pw/2,p.py+p.ph-10,'#8070a0',8);
  X.restore();
}

// ─── PARTICLES & FLOATS ──────────────────────────────────────────────────────
function _drawParticles(particles, floats) {
  particles.forEach(p=>{
    X.save(); X.globalAlpha=p.life; X.fillStyle=p.color;
    X.beginPath(); X.arc(p.x,p.y,p.size*p.life,0,Math.PI*2); X.fill(); X.restore();
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.14; p.life-=0.024;
  });
  floats.forEach(f=>{
    X.save(); X.globalAlpha=f.life; X.shadowBlur=10; X.shadowColor=f.color;
    txt(f.text,f.x,f.y,f.color,14); X.restore();
    f.y+=f.vy; f.life-=0.018;
  });
}
