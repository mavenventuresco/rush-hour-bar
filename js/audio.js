// ─── WEB AUDIO ENGINE ────────────────────────────────────────────────────────
let AC, musicGain, muted = false;

function initAudio() {
  AC = new (window.AudioContext || window.webkitAudioContext)();
  musicGain = AC.createGain();
  musicGain.gain.value = 0.055;
  musicGain.connect(AC.destination);
  startMusic();
}

function toggleMute() {
  muted = !muted;
  document.getElementById('mutebtn').textContent = muted ? '🔇' : '🔊';
  if (musicGain) musicGain.gain.value = muted ? 0 : 0.055;
}

// Generic one-shot tone
function sfx(freq, dur, type = 'sine', vol = 0.15) {
  if (!AC || muted) return;
  const o = AC.createOscillator(), g = AC.createGain();
  o.connect(g); g.connect(AC.destination);
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
  o.start(); o.stop(AC.currentTime + dur);
}

function bellChime() {
  sfx(1200, 0.12, 'sine', 0.2);
  setTimeout(() => sfx(1600, 0.15, 'sine', 0.15), 100);
  setTimeout(() => sfx(2000, 0.20, 'sine', 0.10), 200);
}
function serveSound()  { sfx(660, 0.08); setTimeout(() => sfx(880, 0.08), 70); setTimeout(() => sfx(1100, 0.12), 140); }
function comboSound()  { [880, 1100, 1320, 1760].forEach((f, i) => setTimeout(() => sfx(f, 0.1, 'sine', 0.2), i * 55)); }
function failSound()   { sfx(180, 0.15, 'sawtooth', 0.12); setTimeout(() => sfx(140, 0.18, 'sawtooth', 0.1), 120); }
function tipSound()    { sfx(550, 0.06); setTimeout(() => sfx(730, 0.08), 60); }
function clickSfx()    { sfx(400, 0.04, 'sine', 0.08); }
function shakeSound()  { sfx(660, 0.05); setTimeout(() => sfx(880, 0.05), 60); }

// ─── JAZZ LOOP ────────────────────────────────────────────────────────────────
// Chord progressions with richer voicings (root, 3rd, 5th, 7th)
const _jazzChords = [
  [261, 329, 392, 494],  // Cmaj7
  [293, 370, 440, 554],  // Dm7
  [329, 415, 494, 622],  // Em7
  [349, 440, 523, 659],  // Fmaj7
  [392, 494, 587, 740],  // G7
  [440, 554, 659, 831],  // Am7
  [293, 370, 440, 554],  // Dm7
  [392, 494, 587, 740],  // G7
];
let _ci = 0;

function startMusic() {
  if (!AC) return;
  function playBeat() {
    if (!AC || !window._gameRunning) return;
    const ch = _jazzChords[_ci % _jazzChords.length];
    const t = AC.currentTime;

    // Chord tones — piano-like triangle waves
    ch.forEach((freq, i) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.connect(g); g.connect(musicGain);
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.35 - i * 0.04, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      o.start(t); o.stop(t + 0.7);
    });

    // Walking bass note (root an octave down)
    const bass = AC.createOscillator(), bg = AC.createGain();
    bass.connect(bg); bg.connect(musicGain);
    bass.type = 'triangle';
    bass.frequency.value = ch[0] / 2;
    bg.gain.setValueAtTime(0.55, t);
    bg.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    bass.start(t); bass.stop(t + 0.6);

    // Hi-hat tick (every beat)
    const hh = AC.createOscillator(), hg = AC.createGain();
    hh.connect(hg); hg.connect(musicGain);
    hh.type = 'square'; hh.frequency.value = 3200;
    hg.gain.setValueAtTime(0.03, t + 0.42);
    hg.gain.exponentialRampToValueAtTime(0.001, t + 0.46);
    hh.start(t + 0.42); hh.stop(t + 0.48);

    _ci++;
    setTimeout(playBeat, 750);
  }
  playBeat();
}
