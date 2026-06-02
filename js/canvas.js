// Shared canvas state — imported by renderer and game
export let cv, X, W, H, DPR;

export function initCanvas() {
  cv = document.getElementById('c');
  resize();
}

export function resize() {
  DPR = window.devicePixelRatio || 1;
  W   = window.innerWidth;
  H   = window.innerHeight;
  cv.width        = Math.round(W * DPR);
  cv.height       = Math.round(H * DPR);
  cv.style.width  = W + 'px';
  cv.style.height = H + 'px';
  X = cv.getContext('2d');
  X.setTransform(DPR, 0, 0, DPR, 0, 0);
}

export function lo() {
  const hudH = 40, rackH = 70, barH = 82, wsH = 78;
  const tabH = W < 600 ? 118 : 62; // PH=52; 2-row: 52×2+GAP+12; 1-row: 52+10
  const contentH = rackH + barH + wsH + tabH;
  const availH   = H - hudH;
  // 0.25 puts 25% of the gap above the content, leaving more space at the bottom
  const topOff   = Math.round(Math.max(0, (availH - contentH) * 0.25));
  return {
    hudH, rackH, barH, wsH, tabH,
    rackY:    hudH + topOff,
    barY:     hudH + topOff + rackH,
    counterY: hudH + topOff + rackH + barH - 18,
    wsY:      hudH + topOff + rackH + barH,
    tabY:     hudH + topOff + rackH + barH + wsH,
  };
}

export function seatX(i) {
  const SEATS = 8;
  const totalW = Math.min(W - 40, SEATS * 100);
  const startX = (W - totalW) / 2;
  return startX + i * (totalW / SEATS) + totalW / SEATS / 2;
}
