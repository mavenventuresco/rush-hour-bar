// ─── CANVAS CONTEXT & HELPERS ─────────────────────────────────────────────────
// `cv` and `X` (CanvasRenderingContext2D) are set up in game.js
// All draw* functions use the global X.

function rr(x, y, w, h, r, fill, stroke, lw = 1.5) {
  X.beginPath(); X.roundRect(x, y, w, h, r);
  if (fill)   { X.fillStyle = fill;     X.fill();   }
  if (stroke) { X.strokeStyle = stroke; X.lineWidth = lw; X.stroke(); }
}

function txt(str, x, y, color, size = 12, align = 'center', weight = '600') {
  // Round x/y to nearest 0.5 to hit sub-pixel boundary cleanly
  X.font = `${weight} ${Math.round(size)}px 'Fredoka', sans-serif`;
  X.fillStyle = color; X.textAlign = align; X.textBaseline = 'middle';
  X.fillText(str, Math.round(x * 2) / 2, Math.round(y * 2) / 2);
}

// ─── GLASS SHAPES ────────────────────────────────────────────────────────────
function liquidColor(ings) {
  if (!ings.length) return null;
  if (ings.some(i => ['red_wine', 'cranberry', 'campari', 'grenadine'].includes(i))) return '#cc224499';
  if (ings.some(i => ['cola', 'dark_rum', 'kahlua'].includes(i)))                    return '#33110099';
  if (ings.some(i => ['orange', 'orange_soda', 'grapefruit', 'peach'].includes(i))) return '#ff882299';
  if (ings.some(i => ['lemon', 'lime', 'citrus_soda', 'lemonade', 'tequila'].includes(i))) return '#eedd5099';
  if (ings.some(i => ['absinthe'].includes(i)))                                      return '#22ff2299';
  if (ings.some(i => ['rose'].includes(i)))                                          return '#ffaabb99';
  if (ings.some(i => ['vodka', 'gin', 'tonic', 'water'].includes(i)))               return '#aaddff99';
  if (ings.some(i => ['bourbon', 'scotch', 'rye', 'irish', 'tennessee', 'vs', 'vsop', 'xo'].includes(i))) return '#cc883399';
  if (ings.some(i => ['light_rum', 'pineapple', 'coconut'].includes(i)))            return '#88ee8899';
  if (ings.some(i => ['baileys'].includes(i)))                                      return '#c8a06099';
  return '#bbbbff55';
}

function drawGlassShape(x, y, type, ings, finished, sc = 1) {
  X.save(); X.translate(x, y); X.scale(sc, sc);
  // Thicker strokes stay crisp at any DPR — lineWidth is in logical pixels
  // so divide by sc so strokes don't fatten when sc < 1
  const stroke = finished ? '#f5c842' : '#c0b0e0';
  const lw     = finished ? 2.5 : Math.max(1.5, 2 / sc);
  X.strokeStyle = stroke; X.lineWidth = lw;
  if (finished) { X.shadowBlur = 18; X.shadowColor = '#f5c84466'; }

  const liq = liquidColor(ings);
  const hasIce = ings.includes('ice');

  switch (type) {
    case 'wine': {
      X.beginPath();
      X.moveTo(-10, -24); X.bezierCurveTo(-16, -20, -18, 4, -7, 18);
      X.lineTo(-3, 20); X.lineTo(-3, 28); X.lineTo(-9, 28); X.lineTo(-9, 30);
      X.lineTo(9, 30); X.lineTo(9, 28); X.lineTo(3, 28); X.lineTo(3, 20);
      X.bezierCurveTo(7, 18, 16, 4, 10, -24); X.closePath(); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha = 0.72;
        X.beginPath();
        X.moveTo(-8, 0); X.bezierCurveTo(-14, 6, -6, 16, -3, 20);
        X.lineTo(3, 20); X.bezierCurveTo(6, 16, 14, 6, 8, 0); X.closePath();
        X.fillStyle = liq; X.fill();
        X.restore();
      }
      break;
    }
    case 'martini': {
      X.beginPath();
      X.moveTo(-18, -22); X.lineTo(0, 12); X.lineTo(18, -22); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(0, 12); X.lineTo(0, 26); X.moveTo(-9, 26); X.lineTo(9, 26); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha = 0.72;
        X.beginPath(); X.moveTo(-12, -8); X.lineTo(0, 12); X.lineTo(12, -8); X.closePath();
        X.fillStyle = liq; X.fill(); X.restore();
      }
      break;
    }
    case 'shot': {
      X.beginPath();
      X.moveTo(-6, -16); X.lineTo(-7, 16); X.lineTo(7, 16); X.lineTo(6, -16); X.closePath(); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha = 0.72;
        X.beginPath(); X.moveTo(-5, 0); X.lineTo(-6, 13); X.lineTo(6, 13); X.lineTo(5, 0); X.closePath();
        X.fillStyle = liq; X.fill(); X.restore();
      }
      break;
    }
    case 'rocks': {
      X.beginPath();
      X.moveTo(-15, -10); X.lineTo(-16, 16); X.lineTo(16, 16); X.lineTo(15, -10); X.closePath(); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha = 0.72;
        X.beginPath(); X.moveTo(-13, 2); X.lineTo(-14, 14); X.lineTo(14, 14); X.lineTo(13, 2); X.closePath();
        X.fillStyle = liq; X.fill();
        if (hasIce) {
          X.globalAlpha = 0.5;
          rr(-9, 3, 6, 6, 1, '#cceeff', null); rr(3, 5, 5, 5, 1, '#cceeff', null);
        }
        X.restore();
      }
      break;
    }
    case 'tall': {
      X.beginPath();
      X.moveTo(-9, -26); X.lineTo(-10, 24); X.lineTo(10, 24); X.lineTo(9, -26); X.closePath(); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha = 0.72;
        X.beginPath(); X.moveTo(-8, -4); X.lineTo(-9, 22); X.lineTo(9, 22); X.lineTo(8, -4); X.closePath();
        X.fillStyle = liq; X.fill();
        if (hasIce) { X.globalAlpha = 0.45; rr(-6, -2, 5, 6, 1, '#cceeff', null); }
        X.restore();
      }
      break;
    }
    case 'mug': {
      X.beginPath();
      X.moveTo(-13, -20); X.lineTo(-14, 20); X.lineTo(12, 20); X.lineTo(11, -20); X.closePath(); X.stroke();
      // Handle
      X.beginPath();
      X.moveTo(11, -8); X.bezierCurveTo(24, -8, 24, 12, 11, 12); X.stroke();
      if (liq) {
        X.save(); X.globalAlpha = 0.75;
        X.beginPath(); X.moveTo(-11, -2); X.lineTo(-12, 18); X.lineTo(10, 18); X.lineTo(9, -2); X.closePath();
        X.fillStyle = liq; X.fill();
        // Beer foam
        if (ings.some(i => ['light', 'dark'].includes(i))) {
          X.fillStyle = '#ffffffcc';
          X.beginPath(); X.ellipse(-1, -2, 11, 5, 0, 0, Math.PI * 2); X.fill();
        }
        X.restore();
      }
      break;
    }
  }

  X.shadowBlur = 0;
  if (finished) {
    // Gold sparkle dots
    X.save(); X.fillStyle = '#f5c842';
    [[14, -22], [-14, -18], [0, -30]].forEach(([dx, dy]) => {
      X.beginPath(); X.arc(dx, dy, 2.5, 0, Math.PI * 2); X.fill();
    });
    X.restore();
  }
  X.restore();
}

// ─── CUSTOMER / PERSON ───────────────────────────────────────────────────────
function drawPerson(x, y, skin, cloth, hair, face, scale = 1) {
  X.save(); X.translate(x, y); X.scale(scale, scale);

  // Shadow
  X.save(); X.globalAlpha = 0.18;
  X.beginPath(); X.ellipse(0, 44, 14, 4, 0, 0, Math.PI * 2);
  X.fillStyle = '#000'; X.fill(); X.restore();

  // Body
  rr(-13, 14, 26, 26, 7, cloth, null);
  // Arms
  rr(-20, 16, 9, 20, 5, cloth, null);
  rr(11, 16, 9, 20, 5, cloth, null);
  // Hands
  X.beginPath(); X.arc(-15, 37, 5, 0, Math.PI * 2); X.fillStyle = skin; X.fill();
  X.beginPath(); X.arc(15, 37, 5, 0, Math.PI * 2); X.fillStyle = skin; X.fill();
  // Neck
  rr(-6, 8, 12, 10, 3, skin, null);
  // Head
  X.beginPath(); X.arc(0, -4, 17, 0, Math.PI * 2); X.fillStyle = skin; X.fill();
  // Hair cap
  X.beginPath(); X.arc(0, -6, 17, Math.PI, Math.PI * 2); X.fillStyle = hair; X.fill();
  X.fillStyle = hair; X.fillRect(-17, -8, 34, 6);

  // Face expressions
  if (face === 'angry') {
    X.fillStyle = '#cc1100'; X.fillRect(-8, -2, 5, 4); X.fillRect(3, -2, 5, 4);
    X.fillStyle = '#440000'; X.fillRect(-11, -6, 9, 2); X.fillRect(2, -6, 9, 2);
    X.beginPath(); X.arc(0, 8, 5, Math.PI + 0.3, Math.PI * 2 - 0.3);
    X.strokeStyle = '#883322'; X.lineWidth = 1.5; X.stroke();
  } else if (face === 'happy') {
    X.fillStyle = '#222';
    X.beginPath(); X.arc(-5, 0, 3, 0, Math.PI * 2); X.fill();
    X.beginPath(); X.arc(5, 0, 3, 0, Math.PI * 2); X.fill();
    X.save(); X.globalAlpha = 0.7; X.fillStyle = '#fff';
    X.beginPath(); X.arc(-4, -1, 1.5, 0, Math.PI * 2); X.fill();
    X.beginPath(); X.arc(6, -1, 1.5, 0, Math.PI * 2); X.fill(); X.restore();
    X.beginPath(); X.arc(0, 4, 7, 0.1, Math.PI - 0.1);
    X.strokeStyle = '#883322'; X.lineWidth = 1.5; X.stroke();
    // Rosy cheeks
    X.save(); X.globalAlpha = 0.25; X.fillStyle = '#ff8888';
    X.beginPath(); X.ellipse(-9, 4, 4, 3, 0, 0, Math.PI * 2); X.fill();
    X.beginPath(); X.ellipse(9, 4, 4, 3, 0, 0, Math.PI * 2); X.fill(); X.restore();
  } else if (face === 'drinking') {
    X.fillStyle = '#222'; X.fillRect(-7, -1, 4, 2); X.fillRect(3, -1, 4, 2);
    X.beginPath(); X.arc(0, 7, 5, 0, Math.PI); X.fillStyle = '#aa6644'; X.fill();
  } else {
    // neutral
    X.fillStyle = '#222';
    X.beginPath(); X.arc(-5, 0, 3, 0, Math.PI * 2); X.fill();
    X.beginPath(); X.arc(5, 0, 3, 0, Math.PI * 2); X.fill();
    X.save(); X.globalAlpha = 0.6; X.fillStyle = '#fff';
    X.beginPath(); X.arc(-4, -1, 1.5, 0, Math.PI * 2); X.fill();
    X.beginPath(); X.arc(6, -1, 1.5, 0, Math.PI * 2); X.fill(); X.restore();
    X.fillStyle = '#664433'; X.fillRect(-4, 6, 8, 2);
  }
  X.restore();
}

// ─── MAIN DRAW ───────────────────────────────────────────────────────────────
function draw(G, frame, curTab, dragging, particles, floats) {
  const L = lo();
  // clearRect resets the transform — restore DPR scale immediately after
  X.setTransform(1, 0, 0, 1, 0, 0);
  X.clearRect(0, 0, cv.width, cv.height);
  X.setTransform(DPR, 0, 0, DPR, 0, 0);
  // Crisp sub-pixel rendering
  X.imageSmoothingEnabled = true;
  X.imageSmoothingQuality = 'high';

  // ── Background gradient ──
  const bg = X.createLinearGradient(0, L.rackY, 0, H);
  bg.addColorStop(0,   '#130930');
  bg.addColorStop(0.3, '#1c0e40');
  bg.addColorStop(0.7, '#10082a');
  bg.addColorStop(1,   '#080516');
  X.fillStyle = bg; X.fillRect(0, L.hudH, W, H - L.hudH);

  // Subtle star field
  X.save(); X.globalAlpha = 0.3;
  for (let i = 0; i < 40; i++) {
    const sx = (i * 137.5) % W;
    const sy = L.hudH + (i * 73.1) % (L.rackY - L.hudH + L.rackH);
    const r = (i % 3 === 0) ? 1.2 : 0.7;
    X.fillStyle = '#ffffff';
    X.beginPath(); X.arc(sx, sy, r + 0.4 * Math.sin(frame * 0.04 + i), 0, Math.PI * 2); X.fill();
  }
  X.restore();

  _drawGlassRack(L, G, frame);
  _drawBar(L, G, frame, dragging);
  _drawWorkstation(L, G, frame);
  _drawShelfTabs(L, curTab);
  _drawShelfItems(L, curTab, G);
  _drawParticles(particles, floats);

  if (dragging) {
    X.save(); X.globalAlpha = 0.88; X.shadowBlur = 20; X.shadowColor = '#f5c84466';
    drawGlassShape(dragging.x, dragging.y, dragging.glass, dragging.ings, true, 1.25);
    X.restore();
  }
}

// ─── GLASS RACK ──────────────────────────────────────────────────────────────
function _drawGlassRack(L, G, frame) {
  // Rack background — dark wood panel
  const rg = X.createLinearGradient(0, L.rackY, 0, L.rackY + L.rackH);
  rg.addColorStop(0, '#0e0624'); rg.addColorStop(1, '#160a30');
  X.fillStyle = rg; X.fillRect(0, L.rackY, W, L.rackH);

  // Top ledge
  rr(0, L.rackY, W, 4, 0, '#2a1850', null);

  // Hanging bar
  rr(W * 0.06, L.rackY + 4, W * 0.88, 5, 3, '#3a2268', '#5a3898', 1.5);

  const rackIW = Math.min(84, (W - 24) / 6);
  const rackStartX = (W - rackIW * 6) / 2;

  GL.forEach((gl, i) => {
    const cx = rackStartX + i * rackIW + rackIW / 2;
    const cy = L.rackY + L.rackH / 2 + 8;
    const sel = G.glass === gl.id;

    // Chain link
    X.strokeStyle = '#3a2870'; X.lineWidth = 1.5;
    X.beginPath(); X.moveTo(cx, L.rackY + 9); X.lineTo(cx, L.rackY + 16); X.stroke();

    // Card bg
    const cardGrad = X.createLinearGradient(0, L.rackY + 12, 0, L.rackY + L.rackH - 2);
    if (sel) {
      cardGrad.addColorStop(0, '#2a1e58'); cardGrad.addColorStop(1, '#1a1240');
    } else {
      cardGrad.addColorStop(0, '#110830'); cardGrad.addColorStop(1, '#0a0420');
    }
    rr(cx - rackIW / 2 + 3, L.rackY + 14, rackIW - 6, L.rackH - 18, 7,
       cardGrad, sel ? '#f5c842' : '#2a1850', sel ? 2 : 1);

    // Selected highlight glow
    if (sel) {
      X.save(); X.globalAlpha = 0.2 + 0.1 * Math.sin(frame * 0.1);
      X.shadowBlur = 14; X.shadowColor = '#f5c842';
      rr(cx - rackIW / 2 + 3, L.rackY + 14, rackIW - 6, L.rackH - 18, 7, '#f5c84222', null);
      X.restore();
    }

    drawGlassShape(cx, cy, gl.id, [], false, 0.82);
    txt(gl.l, cx, L.rackY + L.rackH - 4, sel ? '#f5c842' : '#6a5090', 9);
  });
}

// ─── BAR + CUSTOMERS ────────────────────────────────────────────────────────
function _drawBar(L, G, frame, dragging) {
  // Stage lighting cones
  for (let i = 0; i < 6; i++) {
    X.save();
    X.globalAlpha = 0.025 + 0.012 * Math.sin(frame * 0.018 + i * 1.1);
    X.beginPath();
    const lx = W * (i + 0.5) / 6;
    X.moveTo(lx, L.rackY + L.rackH);
    X.lineTo(lx - 60, L.barY + L.barH);
    X.lineTo(lx + 60, L.barY + L.barH);
    X.closePath();
    X.fillStyle = ['#ff50c0', '#50c0ff', '#c050ff', '#50ffc0', '#f5c842', '#ff8844'][i];
    X.fill(); X.restore();
  }

  // Bar counter top — polished wood
  const cg = X.createLinearGradient(0, L.counterY, 0, L.counterY + 18);
  cg.addColorStop(0, '#b07840'); cg.addColorStop(0.3, '#9B6B3C'); cg.addColorStop(1, '#6B4423');
  X.fillStyle = cg; X.fillRect(0, L.counterY, W, 18);
  // Highlight strip
  X.save(); X.globalAlpha = 0.35; X.fillStyle = '#fff'; X.fillRect(0, L.counterY, W, 2); X.restore();
  // Shadow under counter
  X.fillStyle = '#3a2010'; X.fillRect(0, L.counterY + 18, W, 6);

  // Stools + customers
  G.stools.forEach((c, i) => {
    const cx = seatX(i);
    const cy = L.barY + L.barH - 62;

    // Stool pole
    X.fillStyle = '#3a2050'; X.fillRect(cx - 3, cy + 44, 6, 22);
    // Stool seat
    X.beginPath(); X.ellipse(cx, cy + 43, 17, 6, 0, 0, Math.PI * 2);
    X.fillStyle = '#5a3280'; X.fill();
    X.strokeStyle = '#7a50b0'; X.lineWidth = 1; X.stroke();

    if (!c) {
      X.save(); X.globalAlpha = 0.15;
      txt('open', cx, cy + 43, '#7a50b0', 8); X.restore();
      return;
    }

    // Order bubble
    if (c.state === 'ordering') {
      const bw = 92, bh = 30;
      const bx = cx - bw / 2, by = cy - 52;
      const pct = Math.max(0, c.pat / c.maxP);
      const bubbleBg = X.createLinearGradient(bx, by, bx, by + bh);
      bubbleBg.addColorStop(0, '#22103cdd'); bubbleBg.addColorStop(1, '#180c28dd');
      rr(bx, by, bw, bh, 8, bubbleBg, pct < 0.25 ? '#c0392b' : '#5a3490', 1.8);
      // Bubble tail
      X.beginPath(); X.moveTo(cx - 5, by + bh); X.lineTo(cx + 5, by + bh); X.lineTo(cx, by + bh + 7);
      X.closePath(); X.fillStyle = '#180c28dd'; X.fill();
      txt(c.drink.name, cx, by + bh / 2, '#f5c842', 10);
      // Patience bar
      const pbw = bw - 10;
      rr(bx + 5, by + bh - 7, pbw, 4, 2, '#120820', null);
      const pc = pct > 0.5 ? '#27ae60' : pct > 0.25 ? '#f39c12' : '#c0392b';
      if (pct > 0) rr(bx + 5, by + bh - 7, pbw * pct, 4, 2, pc, null);
    }

    // Person sprite
    const face = c.state === 'drinking' ? 'drinking'
               : c.state === 'paying'   ? 'happy'
               : c.pat / c.maxP < 0.25  ? 'angry' : 'normal';
    const bob  = c.state === 'drinking'
               ? Math.sin(frame * 0.15) * 2
               : Math.sin(frame * 0.03 + c.id) * 1.5;

    drawPerson(cx, cy + bob, c.skin, c.cloth, c.hair, face, 0.92);
    txt(c.name, cx, cy + 55, '#8070b0', 8);

    // Held drink while drinking
    if (c.state === 'drinking') {
      drawGlassShape(cx + 20, cy + 22 + bob, c.drink.g,
        c.drink.steps.map(s => s.t === 'ice' ? 'ice' : s.id), false, 0.5);
    }

    if (c.state === 'paying') {
      txt('$' + c.payAmount, cx, cy - 52, '#f5c842', 14);
    }

    // Drop zone highlight when dragging a finished drink
    if (dragging && c.state === 'ordering') {
      X.save(); X.globalAlpha = 0.1 + 0.07 * Math.sin(frame * 0.1);
      X.shadowBlur = 18; X.shadowColor = '#f5c842';
      rr(cx - 42, cy - 18, 84, 70, 10, '#f5c84222', '#f5c842', 1.5);
      X.restore();
    }
  });
}

// ─── WORKSTATION ─────────────────────────────────────────────────────────────
function _drawWorkstation(L, G, frame) {
  const wsGrad = X.createLinearGradient(0, L.wsY, 0, L.wsY + L.wsH);
  wsGrad.addColorStop(0, '#140e2a'); wsGrad.addColorStop(1, '#0e0a1e');
  X.fillStyle = wsGrad; X.fillRect(0, L.wsY, W, L.wsH);
  rr(0, L.wsY, W, L.wsH, 0, null, '#2a1c50', 1.5);

  const mxW = Math.max(130, W - 340);
  const sections = [
    { x: 6,               w: 88,  label: 'TAPS'          },
    { x: 98,              w: 56,  label: 'ICE'            },
    { x: 158,             w: mxW, label: 'MIXING STATION' },
    { x: 158 + mxW + 4,  w: 92,  label: 'SINK'           },
    { x: 158 + mxW + 100, w: W - 158 - mxW - 104, label: 'SHAKE' },
  ];

  sections.forEach(s => {
    rr(s.x, L.wsY + 4, s.w, L.wsH - 8, 8, '#100820', '#2a1c50', 1.5);
    txt(s.label, s.x + s.w / 2, L.wsY + L.wsH - 6, '#3a2870', 7);
  });

  // Beer taps — improved look
  const tapY = L.wsY + L.wsH / 2 - 4;
  [{ x: 26, c: '#7090d0', l: 'LITE' }, { x: 68, c: '#c09050', l: 'DARK' }].forEach(t => {
    // Tap body
    rr(t.x - 10, L.wsY + 8, 20, 34, 4, t.c + '55', t.c, 2);
    // Tap handle
    rr(t.x - 6, L.wsY + 4, 12, 8, 3, t.c, null);
    // Spout curve
    X.strokeStyle = t.c; X.lineWidth = 3;
    X.beginPath(); X.moveTo(t.x, L.wsY + 42); X.quadraticCurveTo(t.x - 10, L.wsY + 50, t.x - 12, L.wsY + 54); X.stroke();
    // Label
    txt(t.l, t.x + 1, L.wsY + L.wsH - 13, t.c, 7);
  });

  // Ice machine
  const iceX = 126;
  rr(iceX - 18, L.wsY + 10, 36, 38, 6, '#162840', '#3a7090', 1.5);
  txt('🧊', iceX, tapY - 2, '#aaddff', 20);

  // Mixing station glass
  const mxX = 158 + mxW / 2;
  if (G.glass) {
    drawGlassShape(mxX, tapY + 4, G.glass, G.ings, G.finished, 1.15);
  } else {
    X.save(); X.globalAlpha = 0.18; txt('pick glass ↑', mxX, tapY, '#9070c0', 10); X.restore();
  }

  // Ingredient chips below glass
  if (G.ings.length > 0) {
    G.ings.slice(-8).forEach((id, i) => {
      const bst = BSTYLES[id];
      if (!bst) return;
      const chipX = 160 + i * 18;
      const chipY = L.wsY + 7;
      rr(chipX, chipY, 16, 16, 3, bst.body, bst.dark, 1);
      X.font = "bold 6px 'Fredoka', sans-serif";
      X.fillStyle = '#fff'; X.textAlign = 'center'; X.textBaseline = 'middle';
      X.fillText((bst.text || '').slice(0, 4), chipX + 8, chipY + 8);
    });
  }

  // Mix / Shake button
  const mixBtnX = mxX - 30, mixBtnY = L.wsY + L.wsH - 20;
  rr(mixBtnX, mixBtnY, 60, 14, 5,
     G.mixed ? '#1a4020' : '#1e1640',
     G.mixed ? '#4aaa60' : '#5a3898', 1.5);
  txt(G.mixed ? '✅ MIXED' : '🔀 MIX', mxX, mixBtnY + 7,
      G.mixed ? '#7dff9a' : '#b0a0e0', 8);

  // "Drag to serve" pulse
  if (G.finished && !window._dragging) {
    const pulse = 0.65 + 0.35 * Math.sin(frame * 0.14);
    X.save(); X.globalAlpha = pulse;
    txt('✅ DRAG TO SERVE!', mxX, L.wsY + 9, '#7dff9a', 10); X.restore();
  }

  // Sink
  const skX = sections[3].x + sections[3].w / 2;
  rr(sections[3].x + 8, L.wsY + 10, sections[3].w - 16, 36, 5, '#0a1828', '#3a6080', 1.5);
  txt('🚰', skX, tapY - 2, '#88aacc', 20);

  // Shaker / Jig
  const jgX = sections[4].x + sections[4].w / 2;
  rr(sections[4].x + 6, L.wsY + 10, sections[4].w - 12, 36, 5, '#180c28', '#7050b0', 1.5);
  txt('🍶', jgX, tapY - 2, '#c8a0ff', 20);
}

// ─── SHELF TABS ─────────────────────────────────────────────────────────────
function _drawShelfTabs(L, curTab) {
  const tabs = Object.keys(SHELVES);
  const tabW = W / tabs.length;
  tabs.forEach((key, i) => {
    const tx = i * tabW, ty = L.tabY;
    const on = curTab === key;
    const tg = X.createLinearGradient(tx, ty, tx, ty + L.tabH);
    if (on) { tg.addColorStop(0, '#221438'); tg.addColorStop(1, '#160c2a'); }
    else    { tg.addColorStop(0, '#0d0820'); tg.addColorStop(1, '#080514'); }
    rr(tx + 1, ty + 1, tabW - 2, L.tabH - 2, 6, tg, on ? '#f5c842' : '#221640', on ? 2 : 1);
    txt(SHELVES[key].ico, tx + tabW / 2, ty + 11, on ? '#f5c842' : '#604888', 14);
    txt(SHELVES[key].lbl, tx + tabW / 2, ty + L.tabH - 6, on ? '#f5c842' : '#4a3870', 7);
  });
}

// ─── SHELF ITEMS ─────────────────────────────────────────────────────────────
function _drawShelfItems(L, curTab, G) {
  const items = SHELVES[curTab].items;
  const iw = 60, ih = 56, gap = 5;
  const totalW = items.length * (iw + gap) - gap;
  const startX = (W - totalW) / 2;

  items.forEach((item, i) => {
    const ix = startX + i * (iw + gap);
    const iy = L.shelfY + 6;
    const used = G.ings.includes(item.id);

    // Card
    const ig = X.createLinearGradient(ix, iy, ix, iy + ih);
    if (used) { ig.addColorStop(0, '#0c1e0a'); ig.addColorStop(1, '#080e06'); }
    else       { ig.addColorStop(0, '#0e0820'); ig.addColorStop(1, '#080514'); }
    rr(ix, iy, iw, ih, 8, ig, used ? '#27ae60' : '#221640', 1.5);

    const bst = BSTYLES[item.id];
    if (bst) drawBottle(X, ix + iw / 2, iy + ih / 2 - 3, bst, item.n, 0.72);
    txt(item.n, ix + iw / 2, iy + ih - 6, used ? '#7dff9a' : '#7060a0', 7);
  });
}

// ─── PARTICLES & FLOATS ──────────────────────────────────────────────────────
function _drawParticles(particles, floats) {
  particles.forEach(p => {
    X.save(); X.globalAlpha = p.life; X.fillStyle = p.color;
    X.beginPath(); X.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); X.fill(); X.restore();
    p.x += p.vx; p.y += p.vy; p.vy += 0.14; p.life -= 0.024;
  });

  floats.forEach(f => {
    X.save(); X.globalAlpha = f.life; X.shadowBlur = 10; X.shadowColor = f.color;
    txt(f.text, f.x, f.y, f.color, 14); X.restore();
    f.y += f.vy; f.life -= 0.018;
  });
}
