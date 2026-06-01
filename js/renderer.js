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
  const lw = Math.max(1.6, 2.2 / sc);
  X.strokeStyle = stroke; X.lineWidth = lw;
  if (finished) { X.shadowBlur = 20; X.shadowColor = '#f5c84455'; }

  const liq    = liquidColor(ings);
  const hasIce = ings.includes('ice');
  const empty  = ings.length === 0;

  // Frosted-glass fill — makes glasses visible even when empty
  function _glassBody(path) {
    X.save(); X.globalAlpha = empty ? 0.07 : 0.04; X.fillStyle = '#c8c0ff';
    path(); X.fill(); X.restore();
  }
  function _sheen(path) {
    X.save(); X.globalAlpha = 0.18; X.fillStyle = '#ffffff';
    path(); X.fill(); X.restore();
  }

  switch (type) {

    // ── Wine glass — tall tulip bowl, elegant stem ───────────────────────────
    case 'wine': {
      const bowl = () => {
        X.moveTo(-10,-26);
        X.bezierCurveTo(-20,-22,-22,0,-13,14);
        X.bezierCurveTo(-9,19,-4,22,-3,22);
        X.lineTo(3,22);
        X.bezierCurveTo(4,22,9,19,13,14);
        X.bezierCurveTo(22,0,20,-22,10,-26); X.closePath();
      };
      if (liq) {
        X.save(); X.globalAlpha=0.78;
        X.beginPath(); X.moveTo(-14,2); X.bezierCurveTo(-18,8,-11,18,-3,22);
        X.lineTo(3,22); X.bezierCurveTo(11,18,18,8,14,2); X.closePath();
        X.fillStyle=liq; X.fill(); X.restore();
      }
      X.beginPath(); bowl();
      _glassBody(bowl);
      X.beginPath(); bowl(); X.stroke();
      // Stem + foot
      X.beginPath(); X.moveTo(-3,22); X.lineTo(-3,29); X.lineTo(-10,29);
      X.lineTo(-10,32); X.lineTo(10,32); X.lineTo(10,29); X.lineTo(3,29); X.lineTo(3,22); X.stroke();
      _sheen(() => { X.moveTo(-9,-24); X.bezierCurveTo(-16,-18,-18,-2,-13,12); X.lineTo(-9,12); X.bezierCurveTo(-14,0,-11,-14,-6,-24); X.closePath(); });
      break;
    }

    // ── Martini — dramatic wide V, thin stem ────────────────────────────────
    case 'martini': {
      if (liq) {
        X.save(); X.globalAlpha=0.78;
        X.beginPath(); X.moveTo(-16,-8); X.lineTo(0,12); X.lineTo(16,-8); X.closePath();
        X.fillStyle=liq; X.fill(); X.restore();
      }
      // Bowl fill
      X.save(); X.globalAlpha=0.07; X.fillStyle='#c8c0ff';
      X.beginPath(); X.moveTo(-22,-26); X.lineTo(0,12); X.lineTo(22,-26); X.closePath(); X.fill(); X.restore();
      // Bowl outline
      X.beginPath(); X.moveTo(-22,-26); X.lineTo(0,12); X.lineTo(22,-26); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(-22,-26); X.lineTo(22,-26); X.stroke(); // rim bar
      // Stem + foot
      X.beginPath(); X.moveTo(0,12); X.lineTo(0,28);
      X.moveTo(-9,28); X.lineTo(9,28); X.stroke();
      _sheen(() => { X.moveTo(-20,-26); X.lineTo(-5,10); X.lineTo(-2,10); X.lineTo(-16,-26); X.closePath(); });
      break;
    }

    // ── Shot glass — very short, thick walls, wide base ─────────────────────
    case 'shot': {
      if (liq) {
        X.save(); X.globalAlpha=0.82;
        X.beginPath(); X.moveTo(-6,-4); X.lineTo(-7,12); X.lineTo(7,12); X.lineTo(6,-4); X.closePath();
        X.fillStyle=liq; X.fill(); X.restore();
      }
      X.save(); X.globalAlpha=0.08; X.fillStyle='#c8c0ff';
      X.beginPath(); X.moveTo(-8,-16); X.lineTo(-9,14); X.lineTo(9,14); X.lineTo(8,-16); X.closePath(); X.fill(); X.restore();
      X.beginPath(); X.moveTo(-8,-16); X.lineTo(-9,14); X.lineTo(9,14); X.lineTo(8,-16); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(-8,-16); X.lineTo(8,-16); X.stroke(); // rim
      // Thick base bar
      X.save(); X.globalAlpha=0.45;
      X.beginPath(); X.moveTo(-9,10); X.lineTo(-9,14); X.lineTo(9,14); X.lineTo(9,10); X.closePath();
      X.fillStyle='#a090cc'; X.fill(); X.restore();
      _sheen(() => { X.moveTo(-7,-14); X.lineTo(-8,12); X.lineTo(-5,12); X.lineTo(-4,-14); X.closePath(); });
      break;
    }

    // ── Tumbler — wide & squat, clearly shorter than highball ───────────────
    case 'rocks': {
      if (liq) {
        X.save(); X.globalAlpha=0.78;
        X.beginPath(); X.moveTo(-16,0); X.lineTo(-17,14); X.lineTo(17,14); X.lineTo(16,0); X.closePath();
        X.fillStyle=liq; X.fill();
        if (hasIce) { X.globalAlpha=0.6; rr(-11,2,8,7,2,'#cceeff',null); rr(3,4,7,6,2,'#ddeeff',null); }
        X.restore();
      }
      X.save(); X.globalAlpha=0.08; X.fillStyle='#c8c0ff';
      X.beginPath(); X.moveTo(-18,-12); X.lineTo(-19,16); X.lineTo(19,16); X.lineTo(18,-12); X.closePath(); X.fill(); X.restore();
      X.beginPath(); X.moveTo(-18,-12); X.lineTo(-19,16); X.lineTo(19,16); X.lineTo(18,-12); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(-18,-12); X.lineTo(18,-12); X.stroke(); // rim
      X.save(); X.globalAlpha=0.4;
      X.beginPath(); X.moveTo(-19,12); X.lineTo(-19,16); X.lineTo(19,16); X.lineTo(19,12); X.closePath();
      X.fillStyle='#a090cc'; X.fill(); X.restore();
      _sheen(() => { X.moveTo(-17,-10); X.lineTo(-18,14); X.lineTo(-12,14); X.lineTo(-11,-10); X.closePath(); });
      break;
    }

    // ── Highball — tall & narrow, clearly taller than tumbler ───────────────
    case 'tall': {
      if (liq) {
        X.save(); X.globalAlpha=0.78;
        X.beginPath(); X.moveTo(-7,-8); X.lineTo(-8,22); X.lineTo(8,22); X.lineTo(7,-8); X.closePath();
        X.fillStyle=liq; X.fill();
        if (hasIce) { X.globalAlpha=0.55; rr(-5,-6,5,7,2,'#cceeff',null); }
        X.restore();
      }
      X.save(); X.globalAlpha=0.08; X.fillStyle='#c8c0ff';
      X.beginPath(); X.moveTo(-8,-26); X.lineTo(-9,24); X.lineTo(9,24); X.lineTo(8,-26); X.closePath(); X.fill(); X.restore();
      X.beginPath(); X.moveTo(-8,-26); X.lineTo(-9,24); X.lineTo(9,24); X.lineTo(8,-26); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(-8,-26); X.lineTo(8,-26); X.stroke(); // rim
      X.save(); X.globalAlpha=0.4;
      X.beginPath(); X.moveTo(-9,20); X.lineTo(-9,24); X.lineTo(9,24); X.lineTo(9,20); X.closePath();
      X.fillStyle='#a090cc'; X.fill(); X.restore();
      _sheen(() => { X.moveTo(-7,-24); X.lineTo(-8,22); X.lineTo(-4,22); X.lineTo(-3,-24); X.closePath(); });
      break;
    }

    // ── Beer mug — barrel shape, strong D-handle ─────────────────────────────
    case 'mug': {
      if (liq) {
        X.save(); X.globalAlpha=0.82;
        X.beginPath(); X.moveTo(-12,-6); X.lineTo(-13,18); X.lineTo(11,18); X.lineTo(10,-6); X.closePath();
        X.fillStyle=liq; X.fill();
        if (ings.some(i=>['light','dark'].includes(i))) {
          X.fillStyle='#ffffffcc';
          X.beginPath(); X.ellipse(-1,-6,11,4.5,0,0,Math.PI*2); X.fill();
        }
        X.restore();
      }
      X.save(); X.globalAlpha=0.08; X.fillStyle='#c8c0ff';
      X.beginPath(); X.moveTo(-13,-22); X.lineTo(-14,20); X.lineTo(12,20); X.lineTo(11,-22); X.closePath(); X.fill(); X.restore();
      // Body
      X.beginPath(); X.moveTo(-13,-22); X.lineTo(-14,20); X.lineTo(12,20); X.lineTo(11,-22); X.closePath(); X.stroke();
      X.beginPath(); X.moveTo(-13,-22); X.lineTo(11,-22); X.stroke(); // rim
      // Barrel ring
      X.save(); X.globalAlpha=0.35; X.strokeStyle=stroke; X.lineWidth=lw*0.8;
      X.beginPath(); X.moveTo(-13,-2); X.lineTo(11,-2); X.stroke(); X.restore();
      // Bold D-handle
      X.beginPath(); X.moveTo(11,-12); X.bezierCurveTo(28,-12,28,2,24,8); X.bezierCurveTo(22,12,17,14,11,14); X.stroke();
      X.save(); X.globalAlpha=0.28; X.lineWidth=lw*0.65;
      X.beginPath(); X.moveTo(11,-9); X.bezierCurveTo(24,-9,24,2,20,7); X.bezierCurveTo(18,10,14,12,11,12); X.stroke(); X.restore();
      _sheen(() => { X.moveTo(-12,-20); X.lineTo(-13,18); X.lineTo(-8,18); X.lineTo(-7,-20); X.closePath(); });
      break;
    }
  }

  X.shadowBlur = 0;

  if (finished && ings.length) {
    _drawGarnish(type, ings);
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
// Style based on: clean 2D cartoon, bold outlines, gradient shading,
// large round head ~1/3 of body, visible shirt collar + pocket, defined hair volume.
export function drawPerson(x, y, skin, cloth, hair, face, scale = 1, hairStyle = 'wavy', eyeStyle = 'round') {
  X.save(); X.translate(x, y); X.scale(scale, scale);
  X.lineCap = 'round'; X.lineJoin = 'round';

  const OL = '#1a1828'; // universal dark outline colour
  const clothDark = _dk(cloth, 0.65);
  const clothMid  = _dk(cloth, 0.85);

  // Ground shadow
  X.save(); X.globalAlpha = 0.22;
  X.beginPath(); X.ellipse(0, 46, 18, 5, 0, 0, Math.PI*2);
  X.fillStyle = '#000'; X.fill(); X.restore();

  // ── ARMS (behind torso) ──
  [-1, 1].forEach(dir => {
    X.beginPath();
    X.moveTo(dir*16, 14);
    X.bezierCurveTo(dir*26, 17, dir*28, 32, dir*26, 44);
    X.lineTo(dir*20, 44);
    X.bezierCurveTo(dir*20, 32, dir*18, 20, dir*15, 16);
    X.closePath();
    const ag = X.createLinearGradient(dir*28,20,dir*14,20);
    ag.addColorStop(0, clothDark); ag.addColorStop(1, clothMid);
    X.fillStyle = ag; X.fill();
    X.strokeStyle = OL; X.lineWidth = 1.6; X.stroke();
    // Rolled sleeve cuff
    rr(dir > 0 ? 19 : -27, 34, 8, 5, 2, _dk(cloth,0.75), OL, 1);
  });

  // ── HANDS ──
  [-1,1].forEach(dir => {
    X.beginPath(); X.arc(dir*23, 44, 5.5, 0, Math.PI*2);
    X.fillStyle = skin; X.fill();
    X.strokeStyle = OL; X.lineWidth = 1.4; X.stroke();
    // Knuckle line
    X.save(); X.globalAlpha = 0.3; X.strokeStyle = _dk(skin,0.7); X.lineWidth = 0.8;
    X.beginPath(); X.moveTo(dir*20,44); X.lineTo(dir*26,44); X.stroke(); X.restore();
  });

  // ── TORSO (shirt) ──
  X.beginPath();
  X.moveTo(-18, 14);   // shoulder left
  X.lineTo(-17, 44);   // hip left
  X.lineTo(17,  44);   // hip right
  X.lineTo(18,  14);   // shoulder right
  X.closePath();
  const tg = X.createLinearGradient(-18,14,18,14);
  tg.addColorStop(0, clothDark); tg.addColorStop(0.45, cloth); tg.addColorStop(1, clothMid);
  X.fillStyle = tg; X.fill();
  X.strokeStyle = OL; X.lineWidth = 1.8; X.stroke();

  // Shirt collar — spread collar like reference
  X.beginPath();
  X.moveTo(-10,14); X.lineTo(-4,14); X.lineTo(0,20); X.lineTo(4,14); X.lineTo(10,14);
  X.strokeStyle = OL; X.lineWidth = 1.5; X.stroke();
  X.beginPath(); X.moveTo(-4,14); X.lineTo(0,20); X.lineTo(4,14); X.closePath();
  X.fillStyle = _dk(cloth,0.6); X.fill();

  // Breast pocket (left side, like reference)
  X.save();
  rr(-14, 20, 9, 7, 1.5, _dk(cloth,0.8), OL, 1);
  X.save(); X.globalAlpha=0.4; X.strokeStyle=OL; X.lineWidth=0.8;
  X.beginPath(); X.moveTo(-14,22); X.lineTo(-5,22); X.stroke(); X.restore();
  X.restore();

  // Shoulder seam lines
  X.save(); X.globalAlpha=0.25; X.strokeStyle=OL; X.lineWidth=1;
  X.beginPath(); X.moveTo(-18,14); X.lineTo(-14,20); X.stroke();
  X.beginPath(); X.moveTo(18,14); X.lineTo(14,20); X.stroke(); X.restore();

  // Waist shadow strip
  X.save(); X.globalAlpha=0.12;
  X.beginPath(); X.moveTo(-17,38); X.lineTo(17,38); X.lineTo(17,44); X.lineTo(-17,44); X.closePath();
  X.fillStyle='#000'; X.fill(); X.restore();

  // ── NECK ──
  X.beginPath();
  X.moveTo(-6, 14); X.lineTo(-6, 8); X.lineTo(6, 8); X.lineTo(6, 14); X.closePath();
  X.fillStyle = skin; X.fill();
  X.strokeStyle = OL; X.lineWidth = 1.2; X.stroke();

  // ── HEAD ── (larger, round with defined jaw like reference)
  X.beginPath();
  X.moveTo(-17, 2);
  X.bezierCurveTo(-20, -4, -20, -16, -15, -22);
  X.bezierCurveTo(-10, -28, -5, -30,  0, -30);
  X.bezierCurveTo(  5, -30, 10, -28, 15, -22);
  X.bezierCurveTo( 20, -16, 20,  -4, 17,   2);
  X.bezierCurveTo( 13,   8,  6,  11,  0,  11);
  X.bezierCurveTo( -6,  11,-13,   8,-17,   2);
  X.closePath();
  const hg = X.createRadialGradient(-5,-14,2, 0,-10,22);
  hg.addColorStop(0, _dk(skin,1.16)); hg.addColorStop(0.65,skin); hg.addColorStop(1,_dk(skin,0.88));
  X.fillStyle = hg; X.fill();
  X.strokeStyle = OL; X.lineWidth = 2; X.stroke();

  // Ears
  [-1,1].forEach(dir => {
    X.beginPath(); X.ellipse(dir*18, -5, 4.5, 6.5, dir*0.15, 0, Math.PI*2);
    X.fillStyle = _dk(skin,0.9); X.fill();
    X.strokeStyle = OL; X.lineWidth = 1.4; X.stroke();
    // Inner ear
    X.save(); X.globalAlpha=0.3;
    X.beginPath(); X.ellipse(dir*18, -5, 2.5, 4, dir*0.15, 0, Math.PI*2);
    X.fillStyle = _dk(skin,0.72); X.fill(); X.restore();
  });

  // ── HAIR ──
  _drawHair(hair, hairStyle, OL);

  // ── FACE ──
  _drawFace(face, eyeStyle, skin, OL);

  X.restore();
}

// ── HAIR STYLES ──────────────────────────────────────────────────────────────
function _drawHair(hair, style, OL) {
  const hi = _dk(hair, 1.6);
  const dk = _dk(hair, 0.6);

  const _outline = (path) => {
    path(); X.fillStyle=hair; X.fill();
    X.strokeStyle=OL; X.lineWidth=1.8; X.stroke();
  };

  if (style === 'short') {
    // Clean tapered crop — hugs the skull
    _outline(() => {
      X.beginPath();
      X.moveTo(-17, -2);
      X.bezierCurveTo(-19, -14, -13, -28, 0, -29);
      X.bezierCurveTo(13, -28, 19, -14, 17, -2);
      X.bezierCurveTo(10, -4, -10, -4, -17, -2);
      X.closePath();
    });
    // Strand lines for texture
    X.save(); X.globalAlpha=0.25; X.strokeStyle=dk; X.lineWidth=1;
    [[-8,-20,-2,-14],[2,-22,8,-15],[-14,-10,-9,-4]].forEach(([x1,y1,x2,y2])=>{
      X.beginPath(); X.moveTo(x1,y1); X.lineTo(x2,y2); X.stroke();
    }); X.restore();

  } else if (style === 'wavy') {
    // Voluminous medium wave (like reference character)
    _outline(() => {
      X.beginPath();
      X.moveTo(-17, -4);
      X.bezierCurveTo(-22, -18, -14, -32, 0, -32);
      X.bezierCurveTo(14, -32, 22, -18, 17, -4);
      X.bezierCurveTo(12, -8, 6, -10, 0, -10);
      X.bezierCurveTo(-6, -10, -12, -8, -17, -4);
      X.closePath();
    });
    // Wavy strand lines
    X.save(); X.globalAlpha=0.3; X.strokeStyle=dk; X.lineWidth=1.2;
    X.beginPath(); X.moveTo(-12,-22); X.quadraticCurveTo(-4,-28,4,-22); X.stroke();
    X.beginPath(); X.moveTo(-6,-14); X.quadraticCurveTo(2,-20,10,-14); X.stroke();
    X.restore();
    // Highlight
    X.save(); X.globalAlpha=0.3;
    X.beginPath(); X.ellipse(-3,-24,6,3.5,-0.3,0,Math.PI*2); X.fillStyle=hi; X.fill(); X.restore();

  } else if (style === 'long') {
    // Flows past ears onto shoulders
    _outline(() => {
      X.beginPath();
      X.moveTo(-17, -4);
      X.bezierCurveTo(-22, -18, -14, -32, 0, -32);
      X.bezierCurveTo(14, -32, 22, -18, 17, -4);
      X.bezierCurveTo(20, 8, 20, 20, 18, 28);
      X.lineTo(-18, 28);
      X.bezierCurveTo(-20, 20, -20, 8, -17, -4);
      X.closePath();
    });
    // Centre part
    X.save(); X.globalAlpha=0.28; X.strokeStyle=hi; X.lineWidth=2;
    X.beginPath(); X.moveTo(0,-32); X.lineTo(0,-10); X.stroke(); X.restore();
    // Flow lines
    X.save(); X.globalAlpha=0.22; X.strokeStyle=dk; X.lineWidth=1.2;
    [[-14,-22,-16,10],[14,-22,16,10]].forEach(([x1,y1,x2,y2])=>{
      X.beginPath(); X.moveTo(x1,y1); X.bezierCurveTo(x1-2,0,x2,4,x2,y2); X.stroke();
    }); X.restore();

  } else if (style === 'curly') {
    // Large poofy afro-style
    const cx_ = 0, cy_ = -16, r = 20;
    _outline(() => {
      X.beginPath();
      for (let b=0; b<12; b++) {
        const a  = (b/12)*Math.PI*2 - Math.PI*0.5;
        const a2 = a + Math.PI/12;
        const rm = r + 5;
        const mx = cx_+Math.cos(a2)*rm, my = cy_+Math.sin(a2)*rm*0.75;
        const px = cx_+Math.cos(a)*r,   py = cy_+Math.sin(a)*r*0.75;
        const nx = cx_+Math.cos(a+Math.PI/6)*r, ny = cy_+Math.sin(a+Math.PI/6)*r*0.75;
        if (b===0) X.moveTo(px,py);
        X.quadraticCurveTo(mx,my,nx,ny);
      }
      X.closePath();
    });
    // Curl swirls
    X.save(); X.globalAlpha=0.2; X.strokeStyle=dk; X.lineWidth=1;
    for(let b=0;b<6;b++){
      const a=(b/6)*Math.PI*2;
      X.beginPath(); X.arc(cx_+Math.cos(a)*10, cy_+Math.sin(a)*8, 4.5, a, a+Math.PI*1.6); X.stroke();
    } X.restore();

  } else if (style === 'updo') {
    // Tight sides, bun on top
    _outline(() => {
      X.beginPath();
      X.moveTo(-16,-4);
      X.bezierCurveTo(-18,-14,-10,-24,-3,-26);
      X.bezierCurveTo(3,-26,10,-24,16,-14);
      X.bezierCurveTo(18,-4,14,-2,8,-4);
      X.bezierCurveTo(4,-6,-4,-6,-16,-4);
      X.closePath();
    });
    // Bun
    X.beginPath(); X.arc(0,-30,10,0,Math.PI*2);
    const bunG = X.createRadialGradient(-3,-33,2,0,-30,10);
    bunG.addColorStop(0,hi); bunG.addColorStop(1,hair);
    X.fillStyle=bunG; X.fill(); X.strokeStyle=OL; X.lineWidth=1.8; X.stroke();
    // Bun wrap line
    X.save(); X.globalAlpha=0.35; X.strokeStyle=dk; X.lineWidth=1.2;
    X.beginPath(); X.arc(0,-30,7,0.5,Math.PI-0.5); X.stroke(); X.restore();

  } else { // spiky
    // Base
    _outline(() => {
      X.beginPath();
      X.moveTo(-16,-4); X.bezierCurveTo(-18,-14,-12,-24,0,-26);
      X.bezierCurveTo(12,-24,18,-14,16,-4);
      X.bezierCurveTo(10,-6,-10,-6,-16,-4); X.closePath();
    });
    // Spikes
    [[-12,-28,-7,-10],[-5,-34,0,-12],[5,-34,3,-12],[12,-28,8,-10]].forEach(([tx,ty,bx,by])=>{
      X.beginPath(); X.moveTo(bx-3,by+3); X.lineTo(tx,ty); X.lineTo(bx+3,by+3); X.closePath();
      X.fillStyle=hair; X.fill(); X.strokeStyle=OL; X.lineWidth=1.5; X.stroke();
    });
  }

  // Sideburns — all styles
  [-1,1].forEach(dir=>{
    X.save(); X.globalAlpha=0.5;
    X.beginPath(); X.ellipse(dir*16,-8,3,6,0,0,Math.PI*2);
    X.fillStyle=hair; X.fill(); X.restore();
  });
}

// ── FACE EXPRESSIONS + EYE STYLES ────────────────────────────────────────────
function _drawFace(face, eyeStyle, skin, OL) {
  // Nose — simple curved bridge visible in all states (like reference)
  X.save(); X.strokeStyle=_dk(skin,0.7); X.lineWidth=1.2; X.lineCap='round';
  X.beginPath(); X.moveTo(-2,0); X.bezierCurveTo(-3,3,-3,6,-1,7);
  X.bezierCurveTo(1,8,3,7,2,5); X.stroke(); X.restore();

  // Expressions override neutral eyes
  if (face === 'angry') {
    // Heavy furrowed brows
    X.save(); X.strokeStyle=OL; X.lineWidth=2.5; X.lineCap='round';
    X.beginPath(); X.moveTo(-14,-14); X.lineTo(-6,-10); X.stroke();
    X.beginPath(); X.moveTo(14,-14); X.lineTo(6,-10); X.stroke(); X.restore();
    // Squinting eyes — red-tinted
    X.fillStyle='#cc1100';
    X.beginPath(); X.ellipse(-8,-6,5,3,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.ellipse(8,-6,5,3,0,0,Math.PI*2); X.fill();
    X.save(); X.globalAlpha=0.6; X.fillStyle='#1a1a2a';
    X.beginPath(); X.arc(-8,-6,2.5,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(8,-6,2.5,0,Math.PI*2); X.fill(); X.restore();
    // Angry frown
    X.beginPath(); X.arc(0,9,6,Math.PI+0.3,Math.PI*2-0.3);
    X.strokeStyle=OL; X.lineWidth=2; X.stroke();
    return;
  }

  if (face === 'happy') {
    // Arc eyes (squinting with smile)
    X.save(); X.strokeStyle=OL; X.lineWidth=2.2; X.lineCap='round';
    X.beginPath(); X.arc(-8,-7,5,Math.PI+0.1,Math.PI*2-0.1); X.stroke();
    X.beginPath(); X.arc(8,-7,5,Math.PI+0.1,Math.PI*2-0.1); X.stroke(); X.restore();
    // Smile with teeth
    X.beginPath(); X.arc(0,5,8,0.06,Math.PI-0.06);
    X.strokeStyle=OL; X.lineWidth=2; X.stroke();
    X.save(); X.beginPath(); X.arc(0,5,8,0.06,Math.PI-0.06); X.lineTo(0,5); X.closePath(); X.clip();
    X.fillStyle='#fffaf0'; X.fillRect(-8,5,16,9); X.restore();
    // Rosy cheeks
    X.save(); X.globalAlpha=0.3; X.fillStyle='#ff8888';
    X.beginPath(); X.ellipse(-13,2,5,3.5,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.ellipse(13,2,5,3.5,0,0,Math.PI*2); X.fill(); X.restore();
    return;
  }

  if (face === 'drinking') {
    X.save(); X.strokeStyle=OL; X.lineWidth=2; X.lineCap='round';
    X.beginPath(); X.moveTo(-13,-7); X.lineTo(-4,-6); X.stroke();
    X.beginPath(); X.moveTo(4,-6); X.lineTo(13,-7); X.stroke(); X.restore();
    X.beginPath(); X.ellipse(0,7,5.5,5,0,0,Math.PI*2); X.fillStyle='#4a1400'; X.fill();
    X.strokeStyle=OL; X.lineWidth=1.5; X.stroke();
    return;
  }

  // ── Neutral eyes by style ──
  if (eyeStyle === 'round') {
    // Classic round eyes with thick outline
    X.fillStyle='#f8f8f8';
    X.beginPath(); X.ellipse(-8,-7,6,6.5,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.ellipse(8,-7,6,6.5,0,0,Math.PI*2); X.fill();
    X.strokeStyle=OL; X.lineWidth=1.8;
    X.beginPath(); X.ellipse(-8,-7,6,6.5,0,0,Math.PI*2); X.stroke();
    X.beginPath(); X.ellipse(8,-7,6,6.5,0,0,Math.PI*2); X.stroke();
    X.fillStyle='#1a1828';
    X.beginPath(); X.arc(-8,-6,3.5,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(8,-6,3.5,0,Math.PI*2); X.fill();
    X.save(); X.fillStyle='#fff'; X.globalAlpha=0.8;
    X.beginPath(); X.arc(-6.5,-7.5,1.5,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(9.5,-7.5,1.5,0,Math.PI*2); X.fill(); X.restore();

  } else if (eyeStyle === 'almond') {
    // Almond/cat-eye — angular outer corner
    [[-8,-7,-1],[8,-7,1]].forEach(([ex,ey,dir])=>{
      X.beginPath();
      X.moveTo(ex-6*dir, ey+1);
      X.bezierCurveTo(ex-3*dir, ey-5, ex+3*dir, ey-5, ex+6*dir, ey-1);
      X.bezierCurveTo(ex+5*dir, ey+3, ex-2*dir, ey+3, ex-6*dir, ey+1);
      X.closePath(); X.fillStyle='#f0f0f0'; X.fill();
      X.strokeStyle=OL; X.lineWidth=1.6; X.stroke();
      X.beginPath(); X.arc(ex, ey, 3.2, 0, Math.PI*2); X.fillStyle='#1a1828'; X.fill();
      X.save(); X.globalAlpha=0.8; X.fillStyle='#fff';
      X.beginPath(); X.arc(ex-dir,ey-1.5,1.3,0,Math.PI*2); X.fill(); X.restore();
    });

  } else if (eyeStyle === 'wide') {
    // Big innocent wide eyes
    X.fillStyle='#fff';
    X.beginPath(); X.ellipse(-8,-7,7,8,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.ellipse(8,-7,7,8,0,0,Math.PI*2); X.fill();
    X.strokeStyle=OL; X.lineWidth=2;
    X.beginPath(); X.ellipse(-8,-7,7,8,0,0,Math.PI*2); X.stroke();
    X.beginPath(); X.ellipse(8,-7,7,8,0,0,Math.PI*2); X.stroke();
    X.fillStyle='#1a1828';
    X.beginPath(); X.arc(-8,-6,4,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(8,-6,4,0,Math.PI*2); X.fill();
    // Coloured iris
    X.save(); X.globalAlpha=0.45; X.strokeStyle='#3366cc'; X.lineWidth=1.4;
    X.beginPath(); X.arc(-8,-6,3,0,Math.PI*2); X.stroke();
    X.beginPath(); X.arc(8,-6,3,0,Math.PI*2); X.stroke(); X.restore();
    X.save(); X.fillStyle='#fff'; X.globalAlpha=0.85;
    X.beginPath(); X.arc(-6,-8,1.8,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(10,-8,1.8,0,Math.PI*2); X.fill(); X.restore();

  } else { // hooded
    // Half-lidded relaxed eyes
    X.fillStyle='#f0f0f0';
    X.beginPath(); X.ellipse(-8,-6,6,6,0,0,Math.PI*2); X.fill();
    X.beginPath(); X.ellipse(8,-6,6,6,0,0,Math.PI*2); X.fill();
    X.fillStyle='#1a1828';
    X.beginPath(); X.arc(-8,-5,3.2,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(8,-5,3.2,0,Math.PI*2); X.fill();
    // Upper lid covers top 45%
    X.fillStyle=skin;
    X.beginPath(); X.moveTo(-14,-6); X.bezierCurveTo(-12,-13,-4,-13,-2,-6); X.closePath(); X.fill();
    X.beginPath(); X.moveTo(2,-6);   X.bezierCurveTo(4,-13,12,-13,14,-6);   X.closePath(); X.fill();
    X.save(); X.strokeStyle=OL; X.lineWidth=1.4;
    X.beginPath(); X.moveTo(-14,-6); X.bezierCurveTo(-10,-11,-4,-11,-2,-6); X.stroke();
    X.beginPath(); X.moveTo(2,-6);   X.bezierCurveTo(4,-11,10,-11,14,-6);   X.stroke(); X.restore();
    X.save(); X.globalAlpha=0.7; X.fillStyle='#fff';
    X.beginPath(); X.arc(-6.5,-6,1.3,0,Math.PI*2); X.fill();
    X.beginPath(); X.arc(9.5,-6,1.3,0,Math.PI*2); X.fill(); X.restore();
  }

  // Neutral mouth — slight natural curve
  X.beginPath(); X.moveTo(-6,9); X.bezierCurveTo(-3,12,3,12,6,9);
  X.strokeStyle=OL; X.lineWidth=1.8; X.stroke();
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
  // Proportional sections — always fill the screen width on any device
  const usable = W - 16;
  const GAP    = Math.max(2, Math.round(usable * 0.008));
  const TAP_W  = Math.min(92,  Math.round(usable * 0.17));
  const ICE_W  = Math.min(58,  Math.round(usable * 0.10));
  const SINK_W = Math.min(90,  Math.round(usable * 0.16));
  const JIG_W  = Math.min(78,  Math.round(usable * 0.13));
  const MX_W   = usable - TAP_W - ICE_W - SINK_W - JIG_W - GAP * 4;
  const ox     = 8;
  return [
    { id:'taps', x:ox,                               w:TAP_W,  label:'TAPS'          },
    { id:'ice',  x:ox+TAP_W+GAP,                     w:ICE_W,  label:'ICE'            },
    { id:'mix',  x:ox+TAP_W+ICE_W+GAP*2,             w:MX_W,   label:'MIXING STATION' },
    { id:'sink', x:ox+TAP_W+ICE_W+MX_W+GAP*3,       w:SINK_W, label:'SINK'           },
    { id:'jig',  x:ox+TAP_W+ICE_W+MX_W+SINK_W+GAP*4,w:JIG_W,  label:'SHAKE'          },
  ];
}

// Shared pill geometry — single row on desktop (W≥600), two rows on mobile
export function pillLayout() {
  const tabs   = Object.keys(SHELVES); // 9 categories
  const rackIW = Math.min(96, (W - 16) / 6);
  const rackW  = rackIW * 6;
  const startX = Math.round((W - rackW) / 2);
  const rows   = W < 600 ? 2 : 1;
  const perRow = rows === 2 ? 5 : tabs.length; // row 0: 5 pills, row 1: 4 pills
  const GAP    = Math.max(2, Math.round(rackW * 0.008));
  const PW     = Math.round((rackW - GAP * (perRow - 1)) / perRow);
  const PH     = Math.min(38, Math.max(26, Math.round(PW * 0.56)));
  return { tabs, startX, PW, PH, GAP, rackW, rows, perRow };
}

// ─── SHARED SHELF POPUP GEOMETRY ─────────────────────────────────────────────
// anchorX is passed in from game.js (popupAnchorX) so renderer stays stateless
export function shelfPopupLayout(tab, anchorX = null) {
  const items = SHELVES[tab].items;
  const IW=68, IH=66, GAP=8;
  const COLS = Math.min(items.length, 5);
  const ROWS = Math.ceil(items.length / COLS);
  const pw = COLS*(IW+GAP)-GAP+32;
  const ph = ROWS*(IH+GAP)-GAP+52;

  const L   = lo();
  const PAD = 12;
  const ax  = anchorX !== null ? anchorX : W / 2;
  const px  = Math.round(Math.max(PAD, Math.min(W - pw - PAD, ax - pw / 2)));
  const py  = Math.round(L.tabY - ph - 10);
  return { px, py, pw, ph, IW, IH, GAP, COLS, ROWS, items, anchorX: ax };
}

// ─── MAIN DRAW ───────────────────────────────────────────────────────────────
export function draw(G, frame, curTab, popupOpen, popupAnchorX, dragging, particles, floats) {
  const L = lo();
  X.setTransform(1,0,0,1,0,0);
  X.clearRect(0,0,cv.width,cv.height);
  X.setTransform(DPR,0,0,DPR,0,0);
  X.imageSmoothingEnabled = true;
  X.imageSmoothingQuality = 'high';

  _drawBackground(L, frame);
  _drawGlassRack(L, G, frame);
  _drawBar(L, G, frame, dragging);
  _drawWorkstation(L, G, frame, dragging);
  _drawShelfTabs(L, curTab, popupOpen);
  if (popupOpen) _drawShelfPopup(curTab, G, popupAnchorX);
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

  const rackIW = Math.min(96,(W-16)/6);
  const rackStartX = (W-rackIW*6)/2;

  GL.forEach((gl, i) => {
    const cx  = rackStartX + i*rackIW + rackIW/2;
    // Glass centered in upper 3/4, label pinned to bottom
    const cy  = L.rackY + 18 + (L.rackH - 32) * 0.48;
    const sel = G.glass === gl.id;
    const cardTop = L.rackY + 14;
    const cardH   = L.rackH - 18;

    // Hanging hook
    X.strokeStyle = '#3a2870'; X.lineWidth = 1.5;
    X.beginPath(); X.moveTo(cx, L.rackY + 8); X.lineTo(cx, cardTop); X.stroke();
    X.beginPath(); X.arc(cx, cardTop, 2.5, 0, Math.PI*2);
    X.strokeStyle = '#5a4090'; X.lineWidth = 1.2; X.stroke();

    // Card background
    const cardG = X.createLinearGradient(0, cardTop, 0, cardTop+cardH);
    if (sel) { cardG.addColorStop(0,'#2c2060'); cardG.addColorStop(1,'#1a1244'); }
    else      { cardG.addColorStop(0,'#120830'); cardG.addColorStop(1,'#0a0420'); }
    rr(cx - rackIW/2+3, cardTop, rackIW-6, cardH, 8, cardG, sel?'#f5c842':'#251848', sel?2:1.2);

    // Gold glow on selected
    if (sel) {
      X.save(); X.globalAlpha = 0.15 + 0.1*Math.sin(frame*0.1);
      X.shadowBlur = 16; X.shadowColor = '#f5c842';
      rr(cx-rackIW/2+3, cardTop, rackIW-6, cardH, 8, '#f5c84222', null);
      X.restore();
    }

    // Glass illustration
    drawGlassShape(cx, cy, gl.id, [], false, 0.88);

    // Translucent pill behind label
    const labelColor = sel ? '#f5c842' : '#7060a0';
    const pillW = 52, pillH = 16;
    X.save(); X.globalAlpha = sel ? 0.22 : 0.15;
    rr(cx - pillW/2, cardTop+cardH-16, pillW, pillH, pillH/2,
       sel ? '#f5c842' : '#3a2860', null);
    X.restore();
    txt(gl.l, cx, cardTop+cardH-8, labelColor, 10);
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
function _drawWorkstation(L, G, frame, dragging) {
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
  [{x:t1x,c:'#d4a017',label:'LITE'},{x:t2x,c:'#7a5c10',label:'DARK'}].forEach(t=>{
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

  if (G.finished&&!dragging) {
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
  const { tabs, startX, PW, PH, GAP, rackW, rows, perRow } = pillLayout();
  const trayH = rows === 2 ? PH*2+GAP+6 : PH+6;
  const ty0   = L.tabY + Math.max(2, Math.round((L.tabH - trayH) / 2));
  const iconSc = Math.min(1, PW / 56);

  // Tray strip
  X.save(); X.globalAlpha=0.5;
  rr(startX-4, ty0-3, rackW+8, trayH, 16, '#0a0618','#1a1030', 1);
  X.restore();

  tabs.forEach((key,i)=>{
    const row = rows === 2 ? Math.floor(i / perRow) : 0;
    const col = rows === 2 ? i % perRow : i;
    const tx  = startX + col*(PW+GAP);
    const ty  = ty0 + row*(PH+GAP);
    const on    = curTab===key&&popupOpen;
    const color = _CAT_COLORS[key]||'#8060a0';

    // Pill background
    const pg=X.createLinearGradient(tx,ty,tx,ty+PH);
    if(on){ pg.addColorStop(0,'#3a2068'); pg.addColorStop(1,'#211040'); }
    else  { pg.addColorStop(0,'#160c30'); pg.addColorStop(1,'#0c0820'); }
    rr(tx,ty,PW,PH,10,pg,on?color:'#2a1c50',on?2:1.2);

    // Active glow
    if(on){
      X.save(); X.globalAlpha=0.15; X.shadowBlur=10; X.shadowColor=color;
      rr(tx,ty,PW,PH,10,color+'44',null); X.restore();
    }

    // Canvas icon — scaled for pill size
    const iconX=tx+PW/2, iconY=ty+PH*0.34;
    const iconCol = on ? color : _dk(color, 0.8);
    X.save(); X.translate(iconX, iconY); X.scale(iconSc, iconSc); X.translate(-iconX, -iconY);
    if(_CAT_ICONS[key]) _CAT_ICONS[key](iconX, iconY, iconCol);
    X.restore();

    // Label always visible (bottom of pill)
    txt(SHELVES[key].lbl, tx+PW/2, ty+PH-8, on?color:'#6050a0', 7, 'center', '600');
  });
}

// ─── SHELF POPUP ─────────────────────────────────────────────────────────────
function _drawShelfPopup(curTab, G, anchorX) {
  const p=shelfPopupLayout(curTab, anchorX);

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
