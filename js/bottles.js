// ─── BOTTLE / CAN STYLE DATA ─────────────────────────────────────────────────
const BSTYLES = {
  // Cognac
  vs:          { body: '#8B4513', dark: '#5C2E0E', cap: '#C8A050', label: '#F5DEB3', labelText: '#4A2000', text: 'VS'    },
  vsop:        { body: '#A0522D', dark: '#6B3410', cap: '#D4A960', label: '#FFE4B5', labelText: '#5A2800', text: 'VSOP'  },
  xo:          { body: '#8B6914', dark: '#5A4410', cap: '#FFD700', label: '#FFF8DC', labelText: '#6B4000', text: 'XO'    },
  // Liqueur
  baileys:     { body: '#F5DEB3', dark: '#C4A060', cap: '#8B4513', label: '#8B4513', labelText: '#FFF',    text: 'BAIL'  },
  kahlua:      { body: '#1A0800', dark: '#000',    cap: '#FFD700', label: '#FFD700', labelText: '#1A0800', text: 'KAH'   },
  triple_sec:  { body: '#FF8C00', dark: '#CC6600', cap: '#F0E68C', label: '#FFF',    labelText: '#CC4400', text: 'T.SEC' },
  cointreau:   { body: '#FF6600', dark: '#CC4400', cap: '#DDD',    label: '#FFF',    labelText: '#CC3300', text: 'COIN'  },
  vermouth:    { body: '#8B0000', dark: '#550000', cap: '#C0C0C0', label: '#FFE4C4', labelText: '#660000', text: 'VERM'  },
  bitters:     { body: '#800000', dark: '#400000', cap: '#FFD700', label: '#FFE4B5', labelText: '#600000', text: 'BITS'  },
  campari:     { body: '#DC143C', dark: '#8B0A1E', cap: '#C0C0C0', label: '#FFF',    labelText: '#AA0020', text: 'CAMP'  },
  amaretto:    { body: '#CD853F', dark: '#8B6914', cap: '#DAA520', label: '#FFF8DC', labelText: '#6B4000', text: 'AMAR'  },
  // Rum
  light_rum:   { body: '#F5F5DC', dark: '#CCC',    cap: '#228B22', label: '#228B22', labelText: '#FFF',    text: 'L.RUM' },
  dark_rum:    { body: '#2F1400', dark: '#1A0A00', cap: '#8B4513', label: '#DAA520', labelText: '#FFF',    text: 'D.RUM' },
  // Wine
  red_wine:    { body: '#4A0020', dark: '#2A0010', cap: '#8B0000', label: '#FFE4E1', labelText: '#660022', text: 'RED'   },
  white_wine:  { body: '#F0E68C', dark: '#BDB76B', cap: '#DAA520', label: '#FFF8DC', labelText: '#8B7500', text: 'WHT'   },
  rose:        { body: '#FFB6C1', dark: '#DB7093', cap: '#FF69B4', label: '#FFF0F5', labelText: '#C71585', text: 'ROSÉ'  },
  // Juice
  apple:       { body: '#90EE90', dark: '#228B22', cap: '#006400', label: '#FFF',    labelText: '#006400', text: 'APPL'  },
  coconut:     { body: '#FFF8DC', dark: '#DEB887', cap: '#8B4513', label: '#D2B48C', labelText: '#FFF',    text: 'COCO'  },
  cranberry:   { body: '#DC143C', dark: '#8B0A1E', cap: '#8B0000', label: '#FFF',    labelText: '#AA0020', text: 'CRAN'  },
  grapefruit:  { body: '#FFA07A', dark: '#E9967A', cap: '#FF6347', label: '#FFF',    labelText: '#CC4400', text: 'GRPF'  },
  lemon:       { body: '#FFD700', dark: '#DAA520', cap: '#BDB76B', label: '#FFF',    labelText: '#8B7500', text: 'LEM'   },
  lime:        { body: '#32CD32', dark: '#228B22', cap: '#006400', label: '#FFF',    labelText: '#006400', text: 'LIME'  },
  orange:      { body: '#FF8C00', dark: '#CC6600', cap: '#FF6600', label: '#FFF',    labelText: '#CC4400', text: 'OJ'    },
  peach:       { body: '#FFDAB9', dark: '#E6A070', cap: '#FF7F50', label: '#FFF5EE', labelText: '#CD853F', text: 'PCH'   },
  pineapple:   { body: '#FFD700', dark: '#DAA520', cap: '#228B22', label: '#FFF',    labelText: '#8B7500', text: 'PINE'  },
  tomato:      { body: '#FF4500', dark: '#CC2200', cap: '#8B0000', label: '#FFF',    labelText: '#CC0000', text: 'TOM'   },
  // Beverage — cans
  citrus_soda: { shape: 'can', body: '#00AA44', dark: '#006622', top: '#C0C0C0', label: '#FFFF00', text: 'CITR'  },
  cola:        { shape: 'can', body: '#8B0000', dark: '#550000', top: '#C0C0C0', label: '#FFF',    text: 'COLA'  },
  energy:      { shape: 'can', body: '#111',    dark: '#000',    top: '#00FF00', label: '#00FF00', text: 'ENRG'  },
  lemonade:    { shape: 'can', body: '#FFD700', dark: '#BDB76B', top: '#FFF',    label: '#FF6600', text: 'LMND'  },
  water:       { body: '#87CEEB', dark: '#4682B4', cap: '#FFF',  label: '#E0F0FF', labelText: '#1E90FF', text: 'H₂O'  },
  orange_soda: { shape: 'can', body: '#FF6600', dark: '#CC4400', top: '#FFF',    label: '#FFF',    text: 'O.SDA' },
  tonic:       { shape: 'can', body: '#B8C8A0', dark: '#8a9a70', top: '#FFF',    label: '#1a3300', text: 'TONC'  },
  // Spirits
  absinthe:    { body: '#006400', dark: '#003300', cap: '#000',    label: '#90EE90', labelText: '#003300', text: 'ABSI'  },
  gin:         { body: '#4682B4', dark: '#2E5A7E', cap: '#C0C0C0', label: '#E6F0FA', labelText: '#2E5A7E', text: 'GIN'   },
  schnapps:    { body: '#FF69B4', dark: '#DB7093', cap: '#FFB6C1', label: '#FFF0F5', labelText: '#C71585', text: 'SCHN'  },
  tequila:     { body: '#F0E68C', dark: '#BDB76B', cap: '#DAA520', label: '#FFF8DC', labelText: '#8B7500', text: 'TEQL'  },
  vodka:       { body: '#E8E8F0', dark: '#B0B0C0', cap: '#4682B4', label: '#4682B4', labelText: '#FFF',    text: 'VDKA'  },
  // Whiskey
  bourbon:     { body: '#8B4513', dark: '#5C2E0E', cap: '#000',    label: '#FFF8DC', labelText: '#5C2E0E', text: 'BRBN'  },
  scotch:      { body: '#DAA520', dark: '#B8860B', cap: '#8B4513', label: '#FFF8DC', labelText: '#8B6914', text: 'SCTH'  },
  rye:         { body: '#CD853F', dark: '#8B6914', cap: '#556B2F', label: '#FFF8DC', labelText: '#6B4000', text: 'RYE'   },
  irish:       { body: '#228B22', dark: '#006400', cap: '#FFD700', label: '#FFF',    labelText: '#006400', text: 'IRSH'  },
  tennessee:   { body: '#1A1A1A', dark: '#000',    cap: '#8B4513', label: '#FFF',    labelText: '#000',    text: 'TENN'  },
  // Syrup
  simple:      { body: '#FFF8DC', dark: '#DEB887', cap: '#DAA520', label: '#FFF5EE', labelText: '#8B7500', text: 'SMPL'  },
  grenadine:   { body: '#DC143C', dark: '#8B0A1E', cap: '#FFD700', label: '#FFF',    labelText: '#AA0020', text: 'GREN'  },
  elderflower: { body: '#F0FFF0', dark: '#90EE90', cap: '#228B22', label: '#E0FFE0', labelText: '#006400', text: 'ELDR'  },
};

// ─── DRAWING ─────────────────────────────────────────────────────────────────
function drawBottle(ctx, x, y, style, label, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const s = style;

  if (s.shape === 'can') {
    // Can body
    _rr(ctx, -13, -30, 26, 56, 5, s.body, s.dark, 1.5);
    // Top rim
    _rr(ctx, -11, -30, 22, 7, 3, s.top || '#aaa', null);
    // Label band
    _rr(ctx, -12, -12, 24, 22, 2, s.label || s.body, null);
    // Brand text
    ctx.fillStyle = _contrastText(s.label || s.body);
    ctx.font = "bold 7px 'Fredoka', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.text || label, 0, -1);
    // Shine strip
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#fff';
    ctx.fillRect(-11, -28, 7, 52);
    ctx.restore();
  } else {
    // Bottle body (wider, more polished shape)
    ctx.beginPath();
    ctx.moveTo(-11, 26);
    ctx.bezierCurveTo(-13, 20, -13, 10, -10, 0);
    ctx.lineTo(-8, -14);
    ctx.lineTo(-5, -28);
    ctx.lineTo(5, -28);
    ctx.lineTo(8, -14);
    ctx.lineTo(10, 0);
    ctx.bezierCurveTo(13, 10, 13, 20, 11, 26);
    ctx.closePath();
    ctx.fillStyle = s.body;
    ctx.fill();
    ctx.strokeStyle = s.dark;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cap / cork
    _rr(ctx, -5, -34, 10, 8, 3, s.cap || '#777', s.dark || '#555', 1);

    // Label panel
    _rr(ctx, -9, -5, 18, 20, 3, s.label || '#fff8', null);

    // Label text
    ctx.fillStyle = s.labelText || '#333';
    ctx.font = "bold 7px 'Fredoka', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.text || label, 0, 5);

    // Shine strip
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(-9, -4);
    ctx.lineTo(-7, -26);
    ctx.lineTo(-4, -26);
    ctx.lineTo(-6, -4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// Pick black or white text depending on background brightness
function _contrastText(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) || 0;
  const g = parseInt(c.slice(2, 4), 16) || 0;
  const b = parseInt(c.slice(4, 6), 16) || 0;
  return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? '#333' : '#fff';
}

function _rr(ctx, x, y, w, h, r, fill, stroke, lw = 1.5) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill)   { ctx.fillStyle = fill;     ctx.fill();   }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
