import { X, W, H, cv, DPR, lo, seatX } from './canvas.js';
import { GL, SHELVES } from './drinks.js';
import { BSTYLES, drawBottle } from './bottles.js';

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
export function drawGlassShape(x, y, type, ings, finished, sc = 1) {
  X.save(); X.translate(x, y); X.scale(sc, sc);
  X.lineCap = 'round'; X.lineJoin = 'round';

  const stroke = finished ? '#f5c842' : '#c8bce8';
  const lw = Math.max(1.4, 2 / sc);
  X.strokeStyle = stroke; X.lineWidth = lw;
  if (finished) { X.shadowBlur = 20; X.shadowColor = '#f5c84455'; }

  const liq    = liquidColor(ings);
  const hasIce = ings.includes('ice');

  // Shared glass-body highlight helper (left-side sheen)
  function _glassSheen(path) {
    X.save(); X.globalAlpha = 0.1; X.fillStyle = '#ffffff';
    path(); X.fill(); X.restore();
  }

  switch (type) {

    case 'wine': {
      // Liquid fill
      if (liq) {
        X.save(); X.globalAlpha = 0.75;
        X.beginPath();
        X.moveTo(-14,2); X.bezierCurveTo(-16,8,-10,17,-3,20);
        X.lineTo(3,20); X.bezierCurveTo(10,17,16,8,14,2); X.closePath();
        X.fillStyle = liq; X.fill(); X.restore();
      }
      // Outline (drawn on top so it's always sharp)
      X.beginPath();
      X.moveTo(-10,-24);
      X.bezierCurveTo(-18,-22,-20,0,-12,14);
      X.bezierCurveTo(-9,18,-5,20,-3,20);
      X.lineTo(-3,27); X.lineTo(-9,27); X.lineTo(-9,30); X.lineTo(9,30);
      X.lineTo(9,27); X.lineTo(3,27); X.lineTo(3,20);
      X.bezierCurveTo(5,20,9,18,12,14);
      X.bezierCurveTo(20,0,18,-22,10,-24); X.closePath(); X.stroke();
      // Sheen
      _glassSheen(() => {
        X.moveTo(-9,-22); X.bezierCurveTo(-15,-18,-17,-4,-12,10);
        X.lineTo(-8,10); X.bezierCurveTo(-12,-2,-10,-16,-6,-22); X.closePath();
      });
      break;
    }

    case 'martini': {
      if (liq) {
        X.save(); X.globalAlpha = 0.75;
        X.beginPath(); X.moveTo(-14,-6); X.lineTo(0,10); X.lineTo(14,-6); X.closePath();
        X.fillStyle = liq; X.fill(); X.restore();
      }
      // Wide rim
      X.beginPath(); X.moveTo(-20,-24); X.lineTo(0,10); X.lineTo(20,-24); X.closePath(); X.stroke();
      // Stem + foot
      X.beginPath(); X.moveTo(0,10); X.lineTo(0,26);
      X.moveTo(-8,26); X.lineTo(8,26); X.stroke();
      // Rim line
      X.beginPath(); X.moveTo(-20,-24); X.lineTo(20,-24); X.stroke();
      _glassSheen(() => {
        X.moveTo(-18,-24); X.lineTo(-4,8); X.lineTo(-1,8); X.lineTo(-14,-24); X.closePath();
      });
      break;
    }

    case 'shot': {
      if (liq) {
        X.save(); X.globalAlpha = 0.78;
        X.beginPath(); X.moveTo(-5,-2); X.lineTo(-6,13); X.lineTo(6,13); X.lineTo(5,-2); X.closePath();
        X.fillStyle = liq; X.fill(); X.restore();
      }
      // Thick-walled cylinder with slight taper
      X.beginPath();
      X.moveTo(-7,-18); X.lineTo(-8,14); X.lineTo(8,14); X.lineTo(7,-18); X.closePath(); X.stroke();
      // Rim highlight
      X.beginPath(); X.moveTo(-7,-18); X.lineTo(7,-18); X.stroke();
      // Thick base
      X.save(); X.globalAlpha=0.4;
      X.beginPath(); X.moveTo(-8,10); X.lineTo(-8,14); X.lineTo(8,14); X.lineTo(8,10); X.closePath();
      X.fillStyle='#b0a0d8'; X.fill(); X.restore();
      _glassSheen(() => { X.moveTo(-6,-16); X.lineTo(-7,12); X.lineTo(-4,12); X.lineTo(-3,-16); X.closePath(); });
      break;
    }

    case 'rocks': {
      if (liq) {
        X.save(); X.globalAlpha = 0.75;
        X.beginPath(); X.moveTo(-14,0); X.lineTo(-15,15); X.lineTo(15,15); X.lineTo(14,0); X.closePath();
        X.fillStyle = liq; X.fill();
        if (hasIce) {
          X.globalAlpha = 0.55;
          rr(-9,2,7,7,2,'#cceeff',null); rr(2,4,6,6,2,'#ddeeff',null);
        }
        X.restore();
      }
      // Squat tumbler — slight taper
      X.beginPath();
      X.moveTo(-15,-12); X.lineTo(-16,16); X.lineTo(16,16); X.lineTo(15,-12); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(-15,-12); X.lineTo(15,-12); X.stroke(); // rim
      // Base thickness
      X.save(); X.globalAlpha=0.35;
      X.beginPath(); X.moveTo(-16,12); X.lineTo(-16,16); X.lineTo(16,16); X.lineTo(16,12); X.closePath();
      X.fillStyle='#b0a0d8'; X.fill(); X.restore();
      _glassSheen(() => { X.moveTo(-14,-10); X.lineTo(-15,14); X.lineTo(-10,14); X.lineTo(-9,-10); X.closePath(); });
      break;
    }

    case 'tall': {
      if (liq) {
        X.save(); X.globalAlpha = 0.75;
        X.beginPath(); X.moveTo(-8,-6); X.lineTo(-9,22); X.lineTo(9,22); X.lineTo(8,-6); X.closePath();
        X.fillStyle = liq; X.fill();
        if (hasIce) { X.globalAlpha=0.5; rr(-6,-4,5,7,2,'#cceeff',null); }
        X.restore();
      }
      // Tall straight cylinder
      X.beginPath();
      X.moveTo(-9,-28); X.lineTo(-10,24); X.lineTo(10,24); X.lineTo(9,-28); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(-9,-28); X.lineTo(9,-28); X.stroke(); // rim
      X.save(); X.globalAlpha=0.35;
      X.beginPath(); X.moveTo(-10,20); X.lineTo(-10,24); X.lineTo(10,24); X.lineTo(10,20); X.closePath();
      X.fillStyle='#b0a0d8'; X.fill(); X.restore();
      _glassSheen(() => { X.moveTo(-8,-26); X.lineTo(-9,22); X.lineTo(-5,22); X.lineTo(-4,-26); X.closePath(); });
      break;
    }

    case 'mug': {
      if (liq) {
        X.save(); X.globalAlpha = 0.78;
        X.beginPath(); X.moveTo(-11,-4); X.lineTo(-12,18); X.lineTo(10,18); X.lineTo(9,-4); X.closePath();
        X.fillStyle = liq; X.fill();
        if (ings.some(i=>['light','dark'].includes(i))) {
          X.fillStyle='#ffffffcc';
          X.beginPath(); X.ellipse(-1,-4,10,4,0,0,Math.PI*2); X.fill();
        }
        X.restore();
      }
      // Barrel body with subtle ring
      X.beginPath();
      X.moveTo(-13,-22); X.lineTo(-14,20); X.lineTo(12,20); X.lineTo(11,-22); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(-13,-22); X.lineTo(11,-22); X.stroke(); // rim
      // Barrel ring mid-way
      X.save(); X.globalAlpha=0.3; X.strokeStyle=stroke; X.lineWidth=lw*0.7;
      X.beginPath(); X.moveTo(-13,-2); X.lineTo(11,-2); X.stroke(); X.restore();
      // D-handle — thick, rounded
      X.beginPath();
      X.moveTo(11,-10);
      X.bezierCurveTo(26,-10,26,0,22,6);
      X.bezierCurveTo(20,10,16,12,11,12); X.stroke();
      // Handle inner detail
      X.save(); X.globalAlpha=0.3; X.lineWidth=lw*0.6;
      X.beginPath();
      X.moveTo(11,-7); X.bezierCurveTo(22,-7,22,0,18,5); X.bezierCurveTo(16,8,13,10,11,10); X.stroke();
      X.restore();
      _glassSheen(() => { X.moveTo(-12,-20); X.lineTo(-13,18); X.lineTo(-8,18); X.lineTo(-7,-20); X.closePath(); });
      break;
    }
  }

  X.shadowBlur = 0;

  // ── Finished-drink garnish ──
  if (finished && ings.length) {
    _drawGarnish(type, ings);
    // Gentle sparkle dots
    X.save(); X.fillStyle='#f5c842';
    [[16,-20],[-15,-16],[1,-32]].forEach(([dx,dy])=>{
      X.beginPath(); X.arc(dx,dy,2.2,0,Math.PI*2); X.fill();
    });
    X.restore();
  }

  X.restore();
}

// Drink-specific garnish drawn on a finished glass
function _drawGarnish(type, ings) {
  const hasLime     = ings.includes('lime');
  const hasOrange   = ings.includes('orange');
  const hasLemon    = ings.includes('lemon');
  const hasBeer     = ings.some(i=>['light','dark'].includes(i));
  const hasCranberry= ings.includes('cranberry');
  const hasGrenadine= ings.includes('grenadine');

  if (type === 'mug' && hasBeer) {
    // Foam bubbles peeking over rim
    X.save(); X.globalAlpha=0.9;
    X.fillStyle='#fffff0';
    [-8,-3,3,8].forEach(bx=>{
      X.beginPath(); X.arc(bx,-24,3.5,0,Math.PI*2); X.fill();
    });
    X.restore();
    return;
  }

  if (type === 'tall' && hasGrenadine && hasOrange) {
    // Tequila Sunrise gradient overlay
    X.save(); X.globalAlpha=0.4;
    const sr=X.createLinearGradient(0,-6,0,22);
    sr.addColorStop(0,'#ff8800'); sr.addColorStop(1,'#cc0033');
    X.beginPath(); X.moveTo(-8,-6); X.lineTo(-9,22); X.lineTo(9,22); X.lineTo(8,-6); X.closePath();
    X.fillStyle=sr; X.fill(); X.restore();
  }

  // Citrus wheel on rim
  if (hasLime || hasOrange || hasLemon) {
    const col = hasLime?'#44cc22':hasLemon?'#ffdd00':'#ff8800';
    const rimX = type==='wine'?14:type==='tall'?11:type==='mug'?13:12;
    const rimY = type==='wine'?-20:type==='tall'?-24:type==='rocks'?-10:-20;
    X.save();
    X.translate(rimX, rimY);
    // Wheel circle
    X.beginPath(); X.arc(0,0,5,0,Math.PI*2);
    X.fillStyle=col; X.fill();
    X.strokeStyle=_dk(col,0.7); X.lineWidth=1; X.stroke();
    // Segments
    X.save(); X.globalAlpha=0.5; X.strokeStyle='#fff'; X.lineWidth=0.8;
    for(let s=0;s<6;s++){
      const a=s*Math.PI/3;
      X.beginPath(); X.moveTo(0,0); X.lineTo(Math.cos(a)*5,Math.sin(a)*5); X.stroke();
    }
    X.restore();
    // Rind arc
    X.beginPath(); X.arc(0,0,5,0,Math.PI*2);
    X.strokeStyle=_dk(col,0.6); X.lineWidth=1.5; X.stroke();
    X.restore();
  }

  if (type === 'martini') {
    // Olive on a cocktail pick
    X.save();
    X.strokeStyle='#c8b060'; X.lineWidth=1;
    X.beginPath(); X.moveTo(-6,-20); X.lineTo(6,-10); X.stroke();
    X.beginPath(); X.arc(6,-10,3.5,0,Math.PI*2);
    X.fillStyle='#4a7a20'; X.fill(); X.strokeStyle='#2a4a10'; X.lineWidth=1; X.stroke();
    // Pimento dot
    X.beginPath(); X.arc(6,-10,1.5,0,Math.PI*2); X.fillStyle='#dd3322'; X.fill();
    X.restore();
  }

  if (type === 'rocks' && ings.some(i=>['bourbon','scotch'].includes(i))) {
    // Orange twist curl
    X.save(); X.strokeStyle='#ff8800'; X.lineWidth=1.5; X.lineCap='round';
    X.beginPath(); X.moveTo(8,-14); X.bezierCurveTo(14,-18,16,-10,12,-8); X.stroke();
    X.restore();
  }
}


// ─── CHARACTER DRAWING ───────────────────────────────────────────────────────
export function drawPerson(x, y, skin, cloth, hair, face, scale = 1, hairStyle = 'wavy', eyeStyle = 'round') {
  X.save(); X.translate(x, y); X.scale(scale, scale);

  // Ground shadow
  X.save(); X.globalAlpha = 0.18;
  X.beginPath(); X.ellipse(0, 46, 16, 4, 0, 0, Math.PI * 2);
  X.fillStyle = '#000'; X.fill(); X.restore();

  const clothDark = _dk(cloth, 0.72);

  // ── Arms behind body ──
  [[-14,-22,18,40],  [14,22,18,40]].forEach(([sx,ex,ey,by], side) => {
    const dir = side === 0 ? -1 : 1;
    X.beginPath();
    X.moveTo(dir*14, 16);
    X.bezierCurveTo(dir*22, 18, dir*25, 30, dir*23, 40);
    X.lineTo(dir*18, 40);
    X.bezierCurveTo(dir*18, 30, dir*16, 20, dir*13, 18);
    X.closePath();
    X.fillStyle = clothDark; X.fill();
  });

  // Hands
  X.beginPath(); X.arc(-21,40,5,0,Math.PI*2); X.fillStyle=skin; X.fill();
  X.beginPath(); X.arc(21,40,5,0,Math.PI*2);  X.fillStyle=skin; X.fill();

  // ── Torso ──
  X.beginPath();
  X.moveTo(-15,40); X.lineTo(-16,14); X.lineTo(16,14); X.lineTo(15,40); X.closePath();
  const bodyG = X.createLinearGradient(-16,14,16,14);
  bodyG.addColorStop(0, _dk(cloth,0.75)); bodyG.addColorStop(0.45,cloth); bodyG.addColorStop(1,_dk(cloth,0.8));
  X.fillStyle=bodyG; X.fill();
  // Collar V
  X.beginPath(); X.moveTo(-5,14); X.lineTo(0,23); X.lineTo(5,14); X.closePath();
  X.fillStyle=_dk(cloth,0.62); X.fill();
  // Button row
  X.save(); X.fillStyle=_dk(cloth,0.55);
  [26,30,34].forEach(by=>{ X.beginPath(); X.arc(0,by,1.2,0,Math.PI*2); X.fill(); });
  X.restore();
  // Waist shadow
  X.save(); X.globalAlpha=0.15;
  X.beginPath(); X.moveTo(-15,34); X.lineTo(15,34); X.lineTo(14,40); X.lineTo(-14,40); X.closePath();
  X.fillStyle='#000'; X.fill(); X.restore();

  // ── Neck ──
  X.beginPath(); X.moveTo(-5,14); X.lineTo(-5,7); X.lineTo(5,7); X.lineTo(5,14); X.closePath();
  X.fillStyle=skin; X.fill();

  // ── Head ──
  X.beginPath(); X.ellipse(0,-5,14,17,0,0,Math.PI*2);
  const headG = X.createRadialGradient(-4,-10,1,0,-5,17);
  headG.addColorStop(0,_dk(skin,1.18)); headG.addColorStop(0.6,skin); headG.addColorStop(1,_dk(skin,0.86));
  X.fillStyle=headG; X.fill();

  // Ears
  X.beginPath(); X.ellipse(-15,-3,3.5,5,0.2,0,Math.PI*2); X.fillStyle=_dk(skin,0.88); X.fill();
  X.beginPath(); X.ellipse(15,-3,3.5,5,-0.2,0,Math.PI*2); X.fillStyle=_dk(skin,0.88); X.fill();
  X.save(); X.globalAlpha=0.35;
  X.beginPath(); X.ellipse(-15,-3,2,3.5,0.2,0,Math.PI*2); X.fillStyle=_dk(skin,0.7); X.fill();
  X.restore();

  // ── Hair styles ──
  _drawHair(hair, hairStyle);

  // ── Eyes + face ──
  _drawFace(face, eyeStyle, skin);

  X.restore();
}

// Draw hair by style
function _drawHair(hair, style) {
  const hi = _dk(hair, 1.7); // highlight colour

  if (style === 'short') {
    // Close crop — thin cap hugging the head
    X.beginPath();
    X.moveTo(-15, -4);
    X.bezierCurveTo(-17, -14, -12, -26, 0, -26);
    X.bezierCurveTo(12, -26, 17, -14, 15, -4);
    X.bezierCurveTo(10, -6, -10, -6, -15, -4);
    X.closePath();
    X.fillStyle = hair; X.fill();
    // Tight fade on sides
    X.save(); X.globalAlpha = 0.25;
    X.beginPath(); X.ellipse(-13, -6, 3, 6, 0.3, 0, Math.PI*2); X.fillStyle = hair; X.fill();
    X.beginPath(); X.ellipse(13, -6, 3, 6, -0.3, 0, Math.PI*2); X.fillStyle = hair; X.fill();
    X.restore();

  } else if (style === 'wavy') {
    // Medium natural waves
    X.beginPath();
    X.moveTo(-16, -6);
    X.bezierCurveTo(-18, -18, -12, -28, 0, -28);
    X.bezierCurveTo(12, -28, 18, -18, 16, -6);
    X.bezierCurveTo(10, -8, -10, -8, -16, -6);
    X.closePath();
    X.fillStyle = hair; X.fill();
    // Wave texture lines
    X.save(); X.globalAlpha = 0.2; X.strokeStyle = _dk(hair, 0.6); X.lineWidth = 1;
    X.beginPath(); X.moveTo(-12,-16); X.quadraticCurveTo(-6,-20,0,-17); X.quadraticCurveTo(6,-20,12,-16); X.stroke();
    X.restore();
    X.save(); X.globalAlpha = 0.3;
    X.beginPath(); X.ellipse(-3,-20,5,3,-0.3,0,Math.PI*2); X.fillStyle=hi; X.fill();
    X.restore();

  } else if (style === 'long') {
    // Shoulder-length — flows down past the ears
    X.beginPath();
    X.moveTo(-16, -6);
    X.bezierCurveTo(-20, -18, -13, -28, 0, -28);
    X.bezierCurveTo(13, -28, 20, -18, 16, -6);
    X.bezierCurveTo(18, 4, 18, 14, 16, 20);   // right side flows down
    X.lineTo(-16, 20);
    X.bezierCurveTo(-18, 14, -18, 4, -16, -6);
    X.closePath();
    X.fillStyle = hair; X.fill();
    // Part highlight
    X.save(); X.globalAlpha=0.28;
    X.beginPath(); X.moveTo(0,-28); X.lineTo(0,-8);
    X.strokeStyle=hi; X.lineWidth=2.5; X.stroke(); X.restore();
    // Volume highlight
    X.save(); X.globalAlpha=0.22;
    X.beginPath(); X.ellipse(-4,-18,5,3,-0.4,0,Math.PI*2); X.fillStyle=hi; X.fill(); X.restore();

  } else if (style === 'curly') {
    // Poofy curls — bumpy outer ring
    const bumps = 10;
    X.beginPath();
    for (let b = 0; b < bumps; b++) {
      const a = (b / bumps) * Math.PI * 2 - Math.PI / 2;
      const r1 = 18, r2 = 22;
      const mid = a + Math.PI / bumps;
      const cx = Math.cos(a) * r1, cy = -14 + Math.sin(a) * r1 * 0.7;
      const ox = Math.cos(mid) * r2, oy = -14 + Math.sin(mid) * r2 * 0.7;
      if (b === 0) X.moveTo(cx, cy);
      X.quadraticCurveTo(ox, oy, Math.cos(a + Math.PI*2/bumps)*r1, -14+Math.sin(a+Math.PI*2/bumps)*r1*0.7);
    }
    X.closePath();
    X.fillStyle = hair; X.fill();
    // Curl texture
    X.save(); X.globalAlpha = 0.22; X.strokeStyle = _dk(hair, 0.6); X.lineWidth = 1.2;
    for (let b=0; b<5; b++) {
      const a = (b/5)*Math.PI - Math.PI*0.7;
      X.beginPath(); X.arc(Math.cos(a)*12, -14+Math.sin(a)*9, 4, 0, Math.PI*1.5); X.stroke();
    }
    X.restore();

  } else if (style === 'updo') {
    // Hair pulled up — tight on sides, bun on top
    X.beginPath();
    X.moveTo(-14, -5);
    X.bezierCurveTo(-16, -12, -10, -22, -4, -24);
    X.bezierCurveTo(4, -24, 10, -22, 14, -12);
    X.bezierCurveTo(16, -5, 12, -3, 8, -5);
    X.bezierCurveTo(4, -7, -4, -7, -14, -5);
    X.closePath();
    X.fillStyle = hair; X.fill();
    // Bun circle on top
    X.beginPath(); X.arc(0, -26, 9, 0, Math.PI*2);
    const bunG = X.createRadialGradient(-3,-28,1,0,-26,9);
    bunG.addColorStop(0, hi); bunG.addColorStop(1, hair);
    X.fillStyle = bunG; X.fill();
    // Bun seam
    X.save(); X.globalAlpha=0.3; X.strokeStyle=_dk(hair,0.6); X.lineWidth=1;
    X.beginPath(); X.arc(0,-26,7,0.4,Math.PI-0.4); X.stroke(); X.restore();

  } else { // spiky
    // Sharp spikes radiating upward
    const spikes = [[-10,-28,-6,-14],[-4,-32,0,-14],[4,-32,2,-14],[10,-28,6,-14]];
    spikes.forEach(([tx,ty,bx,by]) => {
      X.beginPath(); X.moveTo(bx,by); X.lineTo(bx-4,by+4); X.lineTo(tx,ty); X.lineTo(bx+4,by+4); X.closePath();
      X.fillStyle = hair; X.fill();
    });
    // Base layer
    X.beginPath();
    X.moveTo(-14,-6); X.bezierCurveTo(-16,-14,-10,-20,-14,-6);
    X.arc(0,-8,14,Math.PI*1.1,Math.PI*1.9); X.closePath();
    X.fillStyle = hair; X.fill();
  }

  // Sideburns (all styles)
  X.save(); X.globalAlpha=0.45;
  X.beginPath(); X.ellipse(-14,-8,2.5,5,0,0,Math.PI*2); X.fillStyle=hair; X.fill();
  X.beginPath(); X.ellipse(14,-8,2.5,5,0,0,Math.PI*2); X.fillStyle=hair; X.fill();
  X.restore();
}

// Draw face + eyes by style
function _drawFace(face, eyeStyle, skin) {
  // Face expressions override eye style (angry/happy/drinking have fixed eyes)
  if (face === 'angry') {
    X.save(); X.strokeStyle=_dk(skin,0.45); X.lineWidth=2.5; X.lineCap='round';
    X.beginPath(); X.moveTo(-12,-12); X.lineTo(-5,-9); X.stroke();
    X.beginPath(); X.moveTo(12,-12); X.lineTo(5,-9); X.stroke(); X.restore();
    X.fillStyle='#bb1100';
    X.beginPath(); X.ellipse(-7,-5,4.5,2.5,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.ellipse(7,-5,4.5,2.5,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(0,7,5,Math.PI+0.25,Math.PI*2-0.25);
    X.strokeStyle='#661100'; X.lineWidth=1.8; X.stroke();
    return;
  }
  if (face === 'happy') {
    X.save(); X.strokeStyle='#1a1a1a'; X.lineWidth=2.2; X.lineCap='round';
    X.beginPath(); X.arc(-7,-4,4,Math.PI+0.15,Math.PI*2-0.15); X.stroke();
    X.beginPath(); X.arc(7,-4,4,Math.PI+0.15,Math.PI*2-0.15); X.stroke(); X.restore();
    X.beginPath(); X.arc(0,3,7,0.08,Math.PI-0.08);
    X.strokeStyle='#7a3322'; X.lineWidth=2; X.stroke();
    X.save(); X.beginPath(); X.arc(0,3,7,0.08,Math.PI-0.08); X.lineTo(0,3); X.closePath(); X.clip();
    X.fillStyle='#fffaf0'; X.fillRect(-7,3,14,7); X.restore();
    X.save(); X.globalAlpha=0.28; X.fillStyle='#ff7777';
    X.beginPath(); X.ellipse(-11,1,4.5,3,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.ellipse(11,1,4.5,3,0,0,Math.PI*2); X.fill(); X.restore();
    return;
  }
  if (face === 'drinking') {
    X.save(); X.strokeStyle='#2a2a2a'; X.lineWidth=2; X.lineCap='round';
    X.beginPath(); X.moveTo(-11,-6); X.lineTo(-4,-5); X.stroke();
    X.beginPath(); X.moveTo(4,-5); X.lineTo(11,-6); X.stroke(); X.restore();
    X.beginPath(); X.ellipse(0,5,4.5,4,0,0,Math.PI*2); X.fillStyle='#5a1a00'; X.fill();
    return;
  }

  // Neutral face — eye shape varies by eyeStyle
  if (eyeStyle === 'round') {
    X.fillStyle='#f8f8f8';
    X.beginPath(); X.ellipse(-7,-5,5,5.5,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.ellipse(7,-5,5,5.5,0,0,Math.PI*2); X.fill();
    X.fillStyle='#1a1a2a';
    X.beginPath(); X.arc(-7,-4,3.2,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(7,-4,3.2,0,Math.PI*2); X.fill();
    X.save(); X.globalAlpha=0.75; X.fillStyle='#fff';
    X.beginPath(); X.arc(-6,-5,1.4,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(8,-5,1.4,0,Math.PI*2); X.fill(); X.restore();

  } else if (eyeStyle === 'almond') {
    // Cat-eye almond shape — pointed outer corner
    [[- 7, -5, -1], [7, -5, 1]].forEach(([ex, ey, dir]) => {
      X.beginPath();
      X.moveTo(ex - 5*dir, ey + 1);
      X.bezierCurveTo(ex - 3*dir, ey - 4, ex + 2*dir, ey - 4, ex + 5*dir, ey);
      X.bezierCurveTo(ex + 4*dir, ey + 3, ex - 2*dir, ey + 3, ex - 5*dir, ey + 1);
      X.closePath(); X.fillStyle='#f0f0f0'; X.fill();
      X.beginPath(); X.arc(ex, ey, 3, 0, Math.PI*2); X.fillStyle='#1a1a2a'; X.fill();
      X.save(); X.globalAlpha=0.7; X.fillStyle='#fff';
      X.beginPath(); X.arc(ex - dir*0.5, ey - 1, 1.2, 0, Math.PI*2); X.fill(); X.restore();
    });

  } else if (eyeStyle === 'wide') {
    // Large innocent eyes with thick outline
    X.fillStyle='#f8f8f8';
    X.beginPath(); X.ellipse(-7,-5,6,6.5,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.ellipse(7,-5,6,6.5,0,0,Math.PI*2); X.fill();
    X.save(); X.strokeStyle='#222'; X.lineWidth=1.5;
    X.beginPath(); X.ellipse(-7,-5,6,6.5,0,0,Math.PI*2); X.stroke();
    X.beginPath(); X.ellipse(7,-5,6,6.5,0,0,Math.PI*2); X.stroke(); X.restore();
    X.fillStyle='#1a1a2a';
    X.beginPath(); X.arc(-7,-4,3.6,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(7,-4,3.6,0,Math.PI*2); X.fill();
    // Coloured iris ring
    X.save(); X.globalAlpha=0.5; X.strokeStyle='#4488ff'; X.lineWidth=1.2;
    X.beginPath(); X.arc(-7,-4,2.5,0,Math.PI*2); X.stroke();
    X.beginPath(); X.arc(7,-4,2.5,0,Math.PI*2); X.stroke(); X.restore();
    X.save(); X.globalAlpha=0.8; X.fillStyle='#fff';
    X.beginPath(); X.arc(-5.5,-5.5,1.5,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(8.5,-5.5,1.5,0,Math.PI*2); X.fill(); X.restore();

  } else { // hooded
    // Heavy eyelids drooping over top of eye
    X.fillStyle='#f0f0f0';
    X.beginPath(); X.ellipse(-7,-4,5,5,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.ellipse(7,-4,5,5,0,0,Math.PI*2); X.fill();
    X.fillStyle='#1a1a2a';
    X.beginPath(); X.arc(-7,-3,3,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(7,-3,3,0,Math.PI*2); X.fill();
    // Drooping upper lid covering top ~40% of eye
    X.fillStyle=skin;
    X.beginPath(); X.moveTo(-12,-4); X.bezierCurveTo(-10,-10,-4,-10,-2,-4); X.closePath(); X.fill();
    X.beginPath(); X.moveTo(2,-4);   X.bezierCurveTo(4,-10,10,-10,12,-4);   X.closePath(); X.fill();
    // Eyelid crease
    X.save(); X.strokeStyle=_dk(skin,0.7); X.lineWidth=1;
    X.beginPath(); X.moveTo(-12,-4); X.bezierCurveTo(-8,-8,-4,-8,-2,-4); X.stroke();
    X.beginPath(); X.moveTo(2,-4);   X.bezierCurveTo(4,-8,8,-8,12,-4);   X.stroke(); X.restore();
    X.save(); X.globalAlpha=0.65; X.fillStyle='#fff';
    X.beginPath(); X.arc(-6,-4,1.2,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(8,-4,1.2,0,Math.PI*2); X.fill(); X.restore();
  }

  // Neutral mouth (same for all eye styles)
  X.beginPath(); X.arc(0,5,4,0.1,Math.PI-0.1);
  X.strokeStyle=_dk(skin,0.65); X.lineWidth=1.6; X.stroke();
}

// ─── COCKTAIL SHAKER ─────────────────────────────────────────────────────────
function _drawShaker(cx, cy) {
  X.save(); X.translate(cx, cy);
  X.lineCap='round'; X.lineJoin='round';

  const chrome=(x0,y0,x1,y1)=>{
    const g=X.createLinearGradient(x0,y0,x1,y1);
    g.addColorStop(0,'#606474'); g.addColorStop(0.3,'#c8ccd8');
    g.addColorStop(0.7,'#a0a4b4'); g.addColorStop(1,'#484c5c'); return g;
  };

  // Main tin body — smooth tapered cylinder
  X.beginPath();
  X.moveTo(-11,20);
  X.bezierCurveTo(-13,14,-13,4,-10,-4);
  X.lineTo(-8,-14); X.lineTo(-8,-21); X.lineTo(8,-21); X.lineTo(8,-14); X.lineTo(10,-4);
  X.bezierCurveTo(13,4,13,14,11,20); X.closePath();
  X.fillStyle=chrome(-13,0,13,0); X.fill(); X.strokeStyle='#50546a'; X.lineWidth=1.8; X.stroke();
  // Shoulder seam ring
  X.save(); X.globalAlpha=0.5; X.strokeStyle='#707488'; X.lineWidth=1.2;
  X.beginPath(); X.moveTo(-10,-4); X.lineTo(10,-4); X.stroke(); X.restore();

  // Strainer cap — slightly narrower, sits on top
  X.beginPath(); X.roundRect(-8,-31,16,12,4);
  X.fillStyle=chrome(-8,0,8,0); X.fill(); X.strokeStyle='#50546a'; X.lineWidth=1.5; X.stroke();
  // Cap seam line
  X.save(); X.globalAlpha=0.4; X.strokeStyle='#888'; X.lineWidth=0.8;
  X.beginPath(); X.moveTo(-8,-25); X.lineTo(8,-25); X.stroke(); X.restore();

  // Lid — small flat cap
  X.beginPath(); X.roundRect(-5,-37,10,8,3);
  X.fillStyle=chrome(-5,0,5,0); X.fill(); X.strokeStyle='#50546a'; X.lineWidth=1.2; X.stroke();

  // Shine strip on body
  X.save(); X.globalAlpha=0.32; X.fillStyle='#fff';
  X.beginPath(); X.moveTo(-10,18); X.bezierCurveTo(-12,10,-12,2,-9,-3);
  X.lineTo(-6,-3); X.bezierCurveTo(-8,4,-8,12,-6,18); X.closePath(); X.fill();
  // Shine on cap
  X.globalAlpha=0.25; X.fillRect(-7,-29,4,8); X.restore();

  X.restore();
}

// ─── SHARED WORKSTATION GEOMETRY ─────────────────────────────────────────────
export function wsLayout() {
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
export function shelfPopupLayout(tab) {
  const items = SHELVES[tab].items;
  const IW=68, IH=66, GAP=8;
  const COLS = Math.min(items.length, 5);
  const ROWS = Math.ceil(items.length / COLS);
  const pw = COLS*(IW+GAP)-GAP+32;
  const ph = ROWS*(IH+GAP)-GAP+52;

  // Anchor above the pill that was clicked; fall back to screen centre
  const L   = lo();
  const PAD = 12;
  const anchorX = (typeof popupAnchorX !== 'undefined') ? popupAnchorX : W / 2;
  const px  = Math.round(Math.max(PAD, Math.min(W - pw - PAD, anchorX - pw / 2)));
  const py  = Math.round(L.tabY - ph - 10);   // sit just above tab bar
  return { px, py, pw, ph, IW, IH, GAP, COLS, ROWS, items, anchorX };
}

// ─── MAIN DRAW ───────────────────────────────────────────────────────────────
export function draw(G, frame, curTab, popupOpen, dragging, particles, floats) {
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

    drawPerson(cx, cy+bob, c.skin, c.cloth, c.hair, face, 0.9, c.hairStyle||'wavy', c.eyeStyle||'round');
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

// ─── BEER TAP ────────────────────────────────────────────────────────────────
function _drawBeerTap(cx, tapY, wsY, wsH, color, label) {
  const chrome = (x0,y0,x1,y1) => {
    const g=X.createLinearGradient(x0,y0,x1,y1);
    g.addColorStop(0,'#6a6e80'); g.addColorStop(0.35,'#c8ccd8');
    g.addColorStop(0.65,'#a0a4b4'); g.addColorStop(1,'#50546a'); return g;
  };

  // Base plate
  const bp = X.createLinearGradient(cx-14,0,cx+14,0);
  bp.addColorStop(0,'#404454'); bp.addColorStop(0.5,'#7880a0'); bp.addColorStop(1,'#404454');
  rr(cx-13, tapY+22, 26, 6, 3, bp, '#2a2e3e', 1.5);

  // Column — chrome cylinder
  const col = chrome(cx-5,0,cx+5,0);
  rr(cx-5, tapY-6, 10, 30, 3, col, '#40445a', 1.5);
  // Column shine
  X.save(); X.globalAlpha=0.35; X.fillStyle='#fff';
  rr(cx-4, tapY-4, 3, 26, 2, '#fff', null); X.restore();

  // Handle — pill-shaped, colour-coded
  const hg = X.createLinearGradient(cx-9,tapY-28,cx+9,tapY-4);
  hg.addColorStop(0,_dk(color,1.3)); hg.addColorStop(0.5,color); hg.addColorStop(1,_dk(color,0.7));
  X.beginPath(); X.roundRect(cx-9, tapY-28, 18, 24, 9);
  X.fillStyle=hg; X.fill(); X.strokeStyle=_dk(color,0.6); X.lineWidth=1.5; X.stroke();
  // Handle grip lines
  X.save(); X.globalAlpha=0.22; X.strokeStyle='#000'; X.lineWidth=1;
  for(let i=0;i<3;i++){ X.beginPath(); X.moveTo(cx-7,tapY-20+i*6); X.lineTo(cx+7,tapY-20+i*6); X.stroke(); }
  X.restore();
  // Handle shine
  X.save(); X.globalAlpha=0.3; X.fillStyle='#fff';
  X.beginPath(); X.roundRect(cx-7, tapY-26, 5, 20, 4); X.fill(); X.restore();

  // Spout — curved downward
  X.save(); X.lineCap='round';
  X.strokeStyle=chrome(cx,0,cx-14,0); X.lineWidth=4;
  X.beginPath(); X.moveTo(cx,tapY+24); X.quadraticCurveTo(cx-4,tapY+32,cx-10,tapY+36); X.stroke();
  // Inner spout
  X.strokeStyle=_dk(color,0.8); X.lineWidth=1.5;
  X.beginPath(); X.moveTo(cx,tapY+24); X.quadraticCurveTo(cx-4,tapY+32,cx-10,tapY+36); X.stroke();
  X.restore();

  // Tap knob where handle meets column
  X.beginPath(); X.arc(cx,tapY-4,5,0,Math.PI*2);
  X.fillStyle=chrome(cx-5,0,cx+5,0); X.fill(); X.strokeStyle='#40445a'; X.lineWidth=1.2; X.stroke();

  txt(label, cx, wsY+wsH-7, color, 7);
}

// ─── ICE MACHINE ─────────────────────────────────────────────────────────────
function _drawIceMachine(cx, tapY, wsY, wsH) {
  // Cabinet body
  const bg=X.createLinearGradient(cx-18,wsY+8,cx+18,wsY+8);
  bg.addColorStop(0,'#182838'); bg.addColorStop(0.5,'#223448'); bg.addColorStop(1,'#182838');
  rr(cx-18, wsY+8, 36, wsH-20, 6, bg, '#3a6888', 2);

  // Ice window / hopper
  const win=X.createLinearGradient(cx-12,wsY+12,cx+12,wsY+42);
  win.addColorStop(0,'#1a3a54'); win.addColorStop(1,'#0e2030');
  rr(cx-12, wsY+12, 24, 26, 4, win, '#4a88aa', 1.5);

  // Ice cubes inside window
  const icePositions=[[-7,-1],[-1,-5],[5,-2],[-4,5],[3,6]];
  icePositions.forEach(([dx,dy])=>{
    const ix=cx+dx, iy=wsY+27+dy;
    X.beginPath(); X.roundRect(ix,iy,6,5,1);
    const ig=X.createLinearGradient(ix,iy,ix+6,iy+5);
    ig.addColorStop(0,'#c8e8f8'); ig.addColorStop(1,'#88c4e0');
    X.fillStyle=ig; X.fill(); X.strokeStyle='#60a8cc'; X.lineWidth=0.8; X.stroke();
    // Cube highlight
    X.save(); X.globalAlpha=0.55; X.fillStyle='#fff';
    X.beginPath(); X.roundRect(ix,iy,3,2,0.5); X.fill(); X.restore();
  });

  // Dispense chute at bottom
  rr(cx-7, wsY+wsH-16, 14, 8, 2, '#111a24', '#2a5060', 1.2);
  // Dispense button
  X.beginPath(); X.arc(cx, wsY+14, 4, 0, Math.PI*2);
  X.fillStyle='#44aadd'; X.fill(); X.strokeStyle='#2288bb'; X.lineWidth=1; X.stroke();
  X.save(); X.globalAlpha=0.5; X.fillStyle='#fff';
  X.beginPath(); X.arc(cx-1,wsY+13,1.5,0,Math.PI*2); X.fill(); X.restore();

  // Side vents
  X.save(); X.globalAlpha=0.3; X.strokeStyle='#3a6888'; X.lineWidth=0.8;
  [2,5,8].forEach(vx=>{ X.beginPath(); X.moveTo(cx+12,wsY+12+vx*3); X.lineTo(cx+17,wsY+12+vx*3); X.stroke(); });
  X.restore();

  txt('ICE', cx, wsY+wsH-7, '#88ccee', 7);
}

// ─── SINK ────────────────────────────────────────────────────────────────────
function _drawSink(cx, tapY, wsY, wsH) {
  const chrome=(x0,y0,x1,y1)=>{
    const g=X.createLinearGradient(x0,y0,x1,y1);
    g.addColorStop(0,'#606474'); g.addColorStop(0.4,'#b8bcc8'); g.addColorStop(1,'#484c5c'); return g;
  };

  // Basin outer rim
  rr(cx-22, tapY-2, 44, 26, 4, chrome(cx-22,0,cx+22,0), '#38404e', 1.5);
  // Basin inner (dark water pit)
  const basin=X.createLinearGradient(cx,tapY,cx,tapY+22);
  basin.addColorStop(0,'#0a1820'); basin.addColorStop(1,'#050e14');
  rr(cx-18, tapY+1, 36, 21, 3, basin, '#2a3848', 1.2);
  // Water sheen in basin
  X.save(); X.globalAlpha=0.12; X.fillStyle='#4488bb';
  rr(cx-18,tapY+16,36,6,2,'#4488bb',null); X.restore();
  // Drain circle
  X.beginPath(); X.arc(cx, tapY+18, 4, 0, Math.PI*2);
  X.fillStyle='#0a1218'; X.fill(); X.strokeStyle='#304050'; X.lineWidth=1; X.stroke();
  // Drain cross
  X.save(); X.strokeStyle='#304050'; X.lineWidth=0.8;
  X.beginPath(); X.moveTo(cx-3,tapY+18); X.lineTo(cx+3,tapY+18); X.stroke();
  X.beginPath(); X.moveTo(cx,tapY+15); X.lineTo(cx,tapY+21); X.stroke(); X.restore();

  // Faucet arch
  X.save(); X.lineCap='round'; X.lineJoin='round';
  X.strokeStyle=chrome(cx-4,0,cx+4,0); X.lineWidth=5;
  X.beginPath();
  X.moveTo(cx-8,tapY-2);
  X.bezierCurveTo(cx-8,tapY-16,cx+8,tapY-16,cx+8,tapY-2); X.stroke();
  // Spout hole
  X.beginPath(); X.arc(cx+8, tapY-2, 2.5, 0, Math.PI*2);
  X.fillStyle='#222'; X.fill(); X.restore();

  // Left handle
  X.beginPath(); X.roundRect(cx-24,tapY-10,8,10,3);
  const lh=X.createLinearGradient(cx-24,0,cx-16,0);
  lh.addColorStop(0,'#404860'); lh.addColorStop(1,'#8890b0');
  X.fillStyle=lh; X.fill(); X.strokeStyle='#30384a'; X.lineWidth=1.2; X.stroke();
  // Right handle
  X.beginPath(); X.roundRect(cx+16,tapY-10,8,10,3);
  X.fillStyle=lh; X.fill(); X.strokeStyle='#30384a'; X.lineWidth=1.2; X.stroke();

  // Rim shine
  X.save(); X.globalAlpha=0.28; X.fillStyle='#fff';
  rr(cx-22,tapY-2,44,2,1,'#fff',null); X.restore();

  txt('SINK', cx, wsY+wsH-7, '#88aacc', 7);
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

  // ── Beer Taps ──
  const tapSec=secs[0];
  const t1x=tapSec.x+tapSec.w*0.3;
  const t2x=tapSec.x+tapSec.w*0.72;
  [{x:t1x,c:'#6688cc',label:'LITE'},{x:t2x,c:'#bb8844',label:'DARK'}].forEach(t=>{
    _drawBeerTap(t.x, tapY, L.wsY, L.wsH, t.c, t.label);
  });

  // ── Ice Machine ──
  const iceSec=secs[1];
  _drawIceMachine(iceSec.x+iceSec.w/2, tapY, L.wsY, L.wsH);

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

  // ── Sink ──
  const skSec=secs[3], skCx=skSec.x+skSec.w/2;
  _drawSink(skCx, tapY, L.wsY, L.wsH);

  // ── Shaker ──
  const jgSec=secs[4], jgCx=jgSec.x+jgSec.w/2;
  rr(jgSec.x+6,L.wsY+10,jgSec.w-12,L.wsH-18,8,'#130a22','#5a3888',1.5);
  _drawShaker(jgCx, tapY+2);
  txt('SHAKE',jgCx,L.wsY+L.wsH-7,'#c8a0ff',7);
}

// ─── SHELF TABS — compact centred pills ──────────────────────────────────────
// Category canvas icons — drawn inside pills instead of emoji
const _CAT_ICONS = {
  cognac:   (x,y,c) => { // Cognac bottle silhouette
    X.save(); X.translate(x,y);
    X.beginPath(); X.moveTo(-3,8); X.bezierCurveTo(-5,4,-5,-2,-3,-6); X.lineTo(-2,-10); X.lineTo(2,-10); X.lineTo(3,-6); X.bezierCurveTo(5,-2,5,4,3,8); X.closePath();
    X.fillStyle=c; X.fill(); X.strokeStyle=_dk(c,0.6); X.lineWidth=1; X.stroke();
    X.fillStyle=_dk(c,1.5); X.fillRect(-2,-10,4,3);
    X.restore();
  },
  liqueur:  (x,y,c) => { // Round liqueur bottle
    X.save(); X.translate(x,y);
    X.beginPath(); X.ellipse(0,4,5,6,0,0,Math.PI*2); X.fillStyle=c; X.fill(); X.strokeStyle=_dk(c,0.6); X.lineWidth=1; X.stroke();
    X.beginPath(); X.roundRect(-2,-4,4,6,1); X.fillStyle=c; X.fill(); X.stroke();
    X.fillStyle=_dk(c,1.5); X.fillRect(-1.5,-7,3,4);
    X.restore();
  },
  rum:      (x,y,c) => { // Dark bottle with curved body
    X.save(); X.translate(x,y);
    X.beginPath(); X.moveTo(-4,8); X.bezierCurveTo(-6,2,-4,-4,-3,-7); X.lineTo(3,-7); X.bezierCurveTo(4,-4,6,2,4,8); X.closePath();
    X.fillStyle=c; X.fill(); X.strokeStyle=_dk(c,0.6); X.lineWidth=1; X.stroke();
    X.fillStyle=_dk(c,1.5); X.fillRect(-2,-10,4,4);
    X.restore();
  },
  wine:     (x,y,c) => { // Wine glass
    X.save(); X.translate(x,y); X.strokeStyle=c; X.lineWidth=1.5; X.lineCap='round';
    X.beginPath(); X.moveTo(-5,-9); X.bezierCurveTo(-7,-6,-7,1,-3,5); X.lineTo(-1,6); X.lineTo(-1,9); X.lineTo(-3,9); X.lineTo(3,9); X.lineTo(1,9); X.lineTo(1,6); X.bezierCurveTo(3,5,7,1,7,-6); X.bezierCurveTo(7,-9,5,-9,0,-9); X.bezierCurveTo(-3,-9,-5,-9,-5,-9); X.stroke();
    X.restore();
  },
  juice:    (x,y,c) => { // Orange/citrus slice
    X.save(); X.translate(x,y);
    X.beginPath(); X.arc(0,2,7,0,Math.PI*2); X.fillStyle=c; X.fill(); X.strokeStyle=_dk(c,0.6); X.lineWidth=1; X.stroke();
    X.save(); X.globalAlpha=0.35; X.strokeStyle='#fff'; X.lineWidth=0.8;
    for(let s=0;s<6;s++){ const a=s*Math.PI/3; X.beginPath(); X.moveTo(0,2); X.lineTo(Math.cos(a)*6,2+Math.sin(a)*6); X.stroke(); }
    X.restore();
    X.beginPath(); X.arc(0,2,4,0,Math.PI*2); X.fillStyle=_dk(c,1.2); X.fill();
    X.restore();
  },
  beverage: (x,y,c) => { // Can
    X.save(); X.translate(x,y);
    X.beginPath(); X.roundRect(-4,-9,8,16,2); X.fillStyle=c; X.fill(); X.strokeStyle=_dk(c,0.6); X.lineWidth=1; X.stroke();
    X.fillStyle=_dk(c,1.4); X.beginPath(); X.roundRect(-4,-9,8,4,2); X.fill();
    X.save(); X.globalAlpha=0.3; X.fillStyle='#fff'; X.fillRect(-3,-8,2,12); X.restore();
    X.restore();
  },
  vodka:    (x,y,c) => { // Tall spirit bottle
    X.save(); X.translate(x,y);
    X.beginPath(); X.moveTo(-3,8); X.lineTo(-4,-2); X.lineTo(-3,-8); X.lineTo(3,-8); X.lineTo(4,-2); X.lineTo(3,8); X.closePath();
    X.fillStyle=c; X.fill(); X.strokeStyle=_dk(c,0.6); X.lineWidth=1; X.stroke();
    X.fillStyle=_dk(c,0.8); X.fillRect(-2,-11,4,4);
    X.save(); X.globalAlpha=0.3; X.fillStyle='#fff'; X.fillRect(-3,-7,2,13); X.restore();
    X.restore();
  },
  whiskey:  (x,y,c) => { // Squat whiskey bottle
    X.save(); X.translate(x,y);
    X.beginPath(); X.moveTo(-5,8); X.lineTo(-6,0); X.lineTo(-4,-6); X.lineTo(-2,-9); X.lineTo(2,-9); X.lineTo(4,-6); X.lineTo(6,0); X.lineTo(5,8); X.closePath();
    X.fillStyle=c; X.fill(); X.strokeStyle=_dk(c,0.6); X.lineWidth=1; X.stroke();
    X.save(); X.globalAlpha=0.25; X.fillStyle='#fff'; X.fillRect(-5,-5,3,12); X.restore();
    X.restore();
  },
  syrup:    (x,y,c) => { // Dropper/sauce bottle
    X.save(); X.translate(x,y);
    X.beginPath(); X.ellipse(0,4,5,5,0,0,Math.PI*2); X.fillStyle=c; X.fill(); X.strokeStyle=_dk(c,0.6); X.lineWidth=1; X.stroke();
    X.fillStyle=c; X.beginPath(); X.roundRect(-2,-4,4,8,1); X.fill(); X.stroke();
    X.fillStyle=_dk(c,0.7); X.fillRect(-1,-7,2,4);
    // Drop
    X.beginPath(); X.arc(0,10,2,0,Math.PI*2); X.fillStyle=c; X.fill();
    X.restore();
  },
};

// Icon accent colours per category
const _CAT_COLORS = {
  cognac:'#c8903a', liqueur:'#e06020', rum:'#8B3800', wine:'#9B1030',
  juice:'#FF8C00',  beverage:'#20aa60', vodka:'#8888cc', whiskey:'#c87830', syrup:'#dd2255',
};

function _drawShelfTabs(L, curTab, popupOpen) {
  const tabs=Object.keys(SHELVES);
  const PW=64, PH=42, GAP=5;
  const totalW=tabs.length*(PW+GAP)-GAP;
  const startX=Math.round((W-totalW)/2);
  const ty=L.tabY+Math.round((L.tabH-PH)/2);

  // Tray strip behind all pills
  X.save(); X.globalAlpha=0.5;
  rr(startX-10, ty-4, totalW+20, PH+8, 20, '#0a0618','#1a1030', 1);
  X.restore();

  tabs.forEach((key,i)=>{
    const tx=startX+i*(PW+GAP);
    const on=curTab===key&&popupOpen;
    const col=_CAT_COLORS[key]||'#8060a0';

    // Pill background
    const pg=X.createLinearGradient(tx,ty,tx,ty+PH);
    if(on){ pg.addColorStop(0,'#3a2068'); pg.addColorStop(1,'#211040'); }
    else  { pg.addColorStop(0,'#160c30'); pg.addColorStop(1,'#0c0820'); }
    rr(tx,ty,PW,PH,10,pg,on?col:'#2a1c50',on?2:1.2);

    // Active glow
    if(on){
      X.save(); X.globalAlpha=0.15; X.shadowBlur=10; X.shadowColor=col;
      rr(tx,ty,PW,PH,10,col+'44',null); X.restore();
    }

    // Canvas icon (top half of pill)
    const iconX=tx+PW/2, iconY=ty+14;
    const iconCol = on ? col : _dk(col, 0.8);
    if(_CAT_ICONS[key]) _CAT_ICONS[key](iconX, iconY, iconCol);

    // Label always visible (bottom of pill)
    txt(SHELVES[key].lbl, tx+PW/2, ty+PH-8, on?col:'#6050a0', 7, 'center', '600');
  });
}

// ─── SHELF POPUP ─────────────────────────────────────────────────────────────
function _drawShelfPopup(curTab, G) {
  const p=shelfPopupLayout(curTab);

  // Soft local dim — only behind the popup, not full-screen blackout
  X.save(); X.globalAlpha=0.35; X.fillStyle='#000'; X.fillRect(0,0,W,H); X.restore();

  // Panel shadow
  X.save(); X.shadowBlur=40; X.shadowColor='#6030c055';
  const panG=X.createLinearGradient(p.px,p.py,p.px,p.py+p.ph);
  panG.addColorStop(0,'#1e1248'); panG.addColorStop(1,'#0e0828');
  rr(p.px,p.py,p.pw,p.ph,16,panG,'#5a3898',2.5);
  X.restore();

  // Pointer arrow pointing down toward the pill that opened it
  const arrowX = Math.max(p.px+18, Math.min(p.px+p.pw-18, p.anchorX));
  X.beginPath();
  X.moveTo(arrowX-10, p.py+p.ph);
  X.lineTo(arrowX+10, p.py+p.ph);
  X.lineTo(arrowX,    p.py+p.ph+12);
  X.closePath();
  const arG=X.createLinearGradient(0,p.py+p.ph,0,p.py+p.ph+12);
  arG.addColorStop(0,'#1e1248'); arG.addColorStop(1,'#0e0828');
  X.fillStyle=arG; X.fill();
  X.strokeStyle='#5a3898'; X.lineWidth=2; X.stroke();

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
