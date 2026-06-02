const TEST_MODE = false;

const phases = [
  {
    bgImage: 'images/phase1.jpg',
    albumTitle: 'Something Is Coming',
    bodyClass: 'phase-1',
    dropTime: new Date('2026-06-29T23:00:00Z')
  },
  {
    bgImage: 'images/phase2.jpg',
    albumTitle: 'Something Is Coming',
    bodyClass: 'phase-2',
    dropTime: new Date('2026-07-06T23:00:00Z')
  },
  {
    bgImage: 'images/phase3.jpg',
    albumTitle: 'Something Is Coming',
    bodyClass: 'phase-3',
    dropTime: new Date('2026-07-13T23:00:00Z')
  },
  {
    bgImage: 'images/phase4.jpg',
    albumTitle: 'Fighting Talk',
    bodyClass: 'phase-4',
    dropTime: new Date('2026-07-20T23:00:00Z')
  }
];

function getCurrentPhaseIndex() {
  const now = Date.now();
  for (let i = 0; i < phases.length; i++) {
    if (now < phases[i].dropTime.getTime()) {
      return i;
    }
  }
  return phases.length - 1;
}

const phaseIndex = getCurrentPhaseIndex();
const phase = phases[phaseIndex];

if (TEST_MODE) {
  phase.dropTime = new Date(Date.now() + 60000);
}

const bgImageEl    = document.getElementById('bg-image');
const albumTitleEl = document.getElementById('album-title');
const countdownEl  = document.getElementById('countdown');
const finalRevealEl = document.getElementById('final-reveal');

const numEls = {
  days:    document.getElementById('days'),
  hours:   document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};

document.body.classList.add(phase.bodyClass);
bgImageEl.style.backgroundImage = `url('${phase.bgImage}')`;
albumTitleEl.textContent = phase.albumTitle;

function pad(n) {
  return String(n).padStart(2, '0');
}

function triggerFlip(el) {
  el.style.animation = 'none';
  void el.offsetHeight;
  el.style.animation = 'flip 0.28s ease';
}

const prev = { days: null, hours: null, minutes: null, seconds: null };
const KEYS = ['days', 'hours', 'minutes', 'seconds'];
let ticker;

function tick() {
  const diff = phase.dropTime.getTime() - Date.now();

  if (diff <= 0) {
    for (const key of KEYS) {
      if (prev[key] !== '00') {
        triggerFlip(numEls[key]);
        numEls[key].textContent = '00';
        prev[key] = '00';
      }
    }
    if (phaseIndex === phases.length - 1) {
      clearInterval(ticker);
      countdownEl.style.display = 'none';
      albumTitleEl.style.display = 'none';
      finalRevealEl.classList.add('visible');
    }
    return;
  }

  const totalSec = Math.floor(diff / 1000);
  const s        = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const m        = totalMin % 60;
  const totalHr  = Math.floor(totalMin / 60);
  const h        = totalHr % 24;
  const d        = Math.floor(totalHr / 24);

  const vals = {
    days:    pad(d),
    hours:   pad(h),
    minutes: pad(m),
    seconds: pad(s)
  };

  for (const key of KEYS) {
    if (vals[key] !== prev[key]) {
      triggerFlip(numEls[key]);
      numEls[key].textContent = vals[key];
      prev[key] = vals[key];
    }
  }
}

tick();
ticker = setInterval(tick, 1000);
