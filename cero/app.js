(() => {
  'use strict';
  const KEY = 'un-cero-per-maria:coin-last-lit';
  const votive = document.getElementById('votive');
  const button = document.getElementById('coin-button');
  const scene = document.getElementById('candle-scene');
  const status = document.getElementById('daily-status');
  let memoryDate = null;
  let storageAvailable = true;
  let inserting = false;
  const dayKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  function readDate() {
    if (!storageAvailable) return memoryDate;
    try { return localStorage.getItem(KEY) || memoryDate; }
    catch { storageAvailable = false; document.getElementById('storage-note').hidden = false; return memoryDate; }
  }
  function update() {
    const now = new Date();
    const lit = readDate() === dayKey(now);
    votive.classList.toggle('lit', lit && !inserting);
    scene.setAttribute('aria-label', lit && !inserting ? 'Un cero acceso' : 'Un cero spento');
    button.hidden = lit && !inserting;
    button.disabled = lit || inserting;
    status.hidden = !lit || inserting;
    return lit;
  }
  button.addEventListener('click', () => {
    if (inserting || update()) return;
    inserting = true;
    memoryDate = dayKey(new Date());
    try { localStorage.setItem(KEY, memoryDate); }
    catch { storageAvailable = false; document.getElementById('storage-note').hidden = false; }
    button.disabled = true;
    votive.classList.add('inserting');
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 750;
    setTimeout(() => {
      inserting = false;
      votive.classList.remove('inserting');
      update();
      document.getElementById('announcement').textContent = 'Moneta inserita. Il tuo cero è acceso.';
    }, delay);
  });
  document.getElementById('extinguish-button').addEventListener('click', () => {
    if (inserting) return;
    memoryDate = null;
    try { localStorage.removeItem(KEY); }
    catch { storageAvailable = false; document.getElementById('storage-note').hidden = false; }
    update();
    document.getElementById('announcement').textContent = 'Il cero è spento.';
    button.focus();
  });
  window.addEventListener('storage', event => { if (event.key === KEY || event.key === null) { memoryDate = null; storageAvailable = true; update(); } });
  window.addEventListener('focus', update);
  document.addEventListener('visibilitychange', update);
  update();
  setInterval(update, 60000);
})();
