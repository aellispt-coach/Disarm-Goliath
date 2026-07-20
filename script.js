const TEST_MODE = false;

const phases = [
  {
    bgImage: 'Images/album1.png',
    albumTitle: 'No Moon, No Power',
    bodyClass: 'phase-1',
    dropTime: new Date('2026-06-29T23:00:00Z')
  },
  {
    bgImage: 'Images/album2.png',
    albumTitle: 'Find The Betrayer',
    bodyClass: 'phase-2',
    dropTime: new Date('2026-07-06T23:00:00Z')
  },
  {
    bgImage: 'Images/album3.png',
    albumTitle: 'Look Me In The Eye Before You Die',
    bodyClass: 'phase-3',
    dropTime: new Date('2026-07-13T23:00:00Z')
  },
  {
    bgImage: '',
    albumTitle: 'Something Is Coming',
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

const bgImageEl     = document.getElementById('bg-image');
const albumTitleEl  = document.getElementById('album-title');
const countdownEl   = document.getElementById('countdown');
const finalRevealEl = document.getElementById('final-reveal');

const numEls = {
  days:    document.getElementById('days'),
  hours:   document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};

function pad(n) {
  return String(n).padStart(2, '0');
}

function triggerFlip(el) {
  el.style.animation = 'none';
  void el.offsetHeight;
  el.style.animation = 'flip 0.28s ease';
}

const KEYS = ['days', 'hours', 'minutes', 'seconds'];
let ticker;
let currentPhaseIndex;
let currentPhase;
let prev;

function applyPhase(index) {
  phases.forEach(p => document.body.classList.remove(p.bodyClass));
  currentPhaseIndex = index;
  currentPhase = phases[index];
  prev = { days: null, hours: null, minutes: null, seconds: null };
  document.body.classList.add(currentPhase.bodyClass);
  bgImageEl.style.backgroundImage = currentPhase.bgImage ? `url('${currentPhase.bgImage}')` : '';
  albumTitleEl.textContent = currentPhase.albumTitle;
}

function tick() {
  const diff = currentPhase.dropTime.getTime() - Date.now();

  if (diff <= 0) {
    for (const key of KEYS) {
      if (prev[key] !== '00') {
        triggerFlip(numEls[key]);
        numEls[key].textContent = '00';
        prev[key] = '00';
      }
    }
    clearInterval(ticker);
    const nextIndex = getCurrentPhaseIndex();
    if (nextIndex !== currentPhaseIndex) {
      applyPhase(nextIndex);
      ticker = setInterval(tick, 1000);
      tick();
    } else {
      countdownEl.style.display = 'none';
      albumTitleEl.style.display = 'none';
      finalRevealEl.classList.add('visible');
      // The single is live — flash the reveal, then open the full site.
      if (!finalRevealEl.dataset.redirecting) {
        finalRevealEl.dataset.redirecting = '1';
        setTimeout(function () {
          window.location.href = 'site/index.html';
        }, 4500);
      }
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

applyPhase(getCurrentPhaseIndex());
tick();
ticker = setInterval(tick, 1000);
