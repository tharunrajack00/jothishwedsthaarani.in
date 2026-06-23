/* ============================================================
   WEDDING WEBSITE — PREMIUM JAVASCRIPT
   ============================================================ */

'use strict';

/* ===== LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      /* Only unlock scroll if envelope overlay is already gone */
      if (!document.getElementById('envOverlay')) document.body.style.overflow = '';
      triggerReveal();
    }
  }, 2200);
});
document.body.style.overflow = 'hidden';

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateScrollTop();
});

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ===== SCROLL TO TOP ===== */
const scrollTopBtn = document.getElementById('scrollTop');

function updateScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn?.classList.add('visible');
  } else {
    scrollTopBtn?.classList.remove('visible');
  }
}

scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== SMOOTH ACTIVE NAV ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}, { passive: true });

/* ===== PARALLAX HERO ===== */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const offset = window.scrollY;
  if (offset < window.innerHeight) {
    heroBg.style.transform = `translateY(${offset * 0.4}px)`;
  }
}, { passive: true });

/* ===== COUNTDOWN TIMER ===== */
const weddingDate = new Date('2026-09-06T00:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    ['days','hours','minutes','seconds'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '00';
    });
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  setCount('days', days);
  setCount('hours', hours);
  setCount('minutes', minutes);
  setCount('seconds', seconds);
}

let prevValues = {};
function setCount(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const padded = String(value).padStart(2, '0');
  if (prevValues[id] !== padded) {
    el.classList.add('flip');
    setTimeout(() => el.classList.remove('flip'), 400);
    el.textContent = padded;
    prevValues[id] = padded;
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ===== SCROLL REVEAL ===== */
const revealElements = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .fade-up'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

function triggerReveal() {
  revealElements.forEach(el => revealObserver.observe(el));
  // Immediately reveal above-fold elements
  document.querySelectorAll('.fade-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('revealed');
  });
}

/* ===== PETAL ANIMATION ===== */
const petalsCanvas = document.getElementById('petalsCanvas');
const petalsCtx = petalsCanvas?.getContext('2d');

const petals = [];
const PETAL_COUNT = 18;
const petalColors = ['#F8D7DA','#D4AF37','#7B1E3A','#ffb3c1','#ffd6e7'];

class Petal {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x = Math.random() * petalsCanvas.width;
    this.y = init ? Math.random() * petalsCanvas.height : -20;
    this.size = Math.random() * 10 + 6;
    this.speedY = Math.random() * 0.8 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.03;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    this.sway = Math.random() * Math.PI * 2;
    this.swaySpeed = Math.random() * 0.02 + 0.005;
    this.swayAmp = Math.random() * 1.5 + 0.5;
  }
  update() {
    this.y += this.speedY;
    this.sway += this.swaySpeed;
    this.x += this.speedX + Math.sin(this.sway) * this.swayAmp;
    this.rotation += this.rotSpeed;
    if (this.y > petalsCanvas.height + 20 || this.x < -30 || this.x > petalsCanvas.width + 30) {
      this.reset();
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function resizePetalsCanvas() {
  if (!petalsCanvas) return;
  petalsCanvas.width = window.innerWidth;
  petalsCanvas.height = window.innerHeight;
}

function initPetals() {
  if (!petalsCanvas || !petalsCtx) return;
  resizePetalsCanvas();
  for (let i = 0; i < PETAL_COUNT; i++) petals.push(new Petal());
}

function animatePetals() {
  if (!petalsCtx) return;
  petalsCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);
  petals.forEach(p => { p.update(); p.draw(petalsCtx); });
  requestAnimationFrame(animatePetals);
}

window.addEventListener('resize', resizePetalsCanvas);
initPetals();
animatePetals();

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const moonSVG = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
const sunSVG  = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;

let isDark = false;

themeToggle?.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('dark-mode', isDark);
  if (themeIcon) themeIcon.innerHTML = isDark ? moonSVG : sunSVG;
  localStorage.setItem('weddingTheme', isDark ? 'dark' : 'light');
});

// Restore saved theme
const savedTheme = localStorage.getItem('weddingTheme');
if (savedTheme === 'dark') {
  isDark = true;
  document.body.classList.add('dark-mode');
  if (themeIcon) themeIcon.innerHTML = moonSVG;
}

/* ===== MUSIC TOGGLE ===== */
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let musicPlaying = false;

musicToggle?.addEventListener('click', () => {
  if (!bgMusic) return;
  musicPlaying = !musicPlaying;
  if (musicPlaying) {
    bgMusic.play().catch(() => { musicPlaying = false; });
    musicToggle.classList.add('music-playing');
    musicToggle.title = 'Pause Music';
  } else {
    bgMusic.pause();
    musicToggle.classList.remove('music-playing');
    musicToggle.title = 'Play Music';
  }
});


/* ===== RSVP FORM ===== */
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

rsvpForm?.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  const required = rsvpForm.querySelectorAll('[required]');
  required.forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
  });

  if (!valid) {
    const firstError = rsvpForm.querySelector('.error');
    firstError?.focus();
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Success
  rsvpForm.style.display = 'none';
  rsvpSuccess?.classList.add('show');
  launchConfetti();
  rsvpSuccess?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* ===== CONFETTI ===== */
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas?.getContext('2d');
let confettiParticles = [];
let confettiActive = false;

function resizeConfettiCanvas() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

const confettiColors = [
  '#D4AF37','#7B1E3A','#F8D7DA','#FF6B9D','#FFF8F0',
  '#FFD700','#C0392B','#8E44AD','#3498DB','#2ECC71'
];

class Confetti {
  constructor() {
    this.x = Math.random() * confettiCanvas.width;
    this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
    this.size = Math.random() * 10 + 5;
    this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    this.speedY = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 3;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 10;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    this.opacity = 1;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotSpeed;
    if (this.y > confettiCanvas.height * 0.8) this.opacity -= 0.02;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;
    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function launchConfetti() {
  if (!confettiCtx) return;
  confettiParticles = [];
  for (let i = 0; i < 200; i++) confettiParticles.push(new Confetti());
  confettiActive = true;
  animateConfetti();
}

function animateConfetti() {
  if (!confettiCtx || !confettiActive) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles = confettiParticles.filter(p => p.opacity > 0);
  confettiParticles.forEach(p => { p.update(); p.draw(confettiCtx); });
  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiActive = false;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

/* ===== DOWNLOAD INVITE ===== */
document.getElementById('downloadInvite')?.addEventListener('click', () => {
  const inviteContent = `
WEDDING INVITATION

Thaarani & Jothishwar

Together with their families, we invite you to celebrate our wedding.

DATE: September 6 & 7, 2026
VENUE: [VENUE NAME], [VENUE CITY]

DAY 1 — September 6, 2026
• Mehendi Ceremony — 10:00 AM
• Sangeet Night — 7:00 PM
• Family Dinner — 9:00 PM

DAY 2 — September 7, 2026
• Wedding Ceremony — 8:00 AM
• Reception — 6:00 PM
• Blessings & Lunch — 12:00 PM

RSVP by August 1st, 2026
Contact: +91 XXXXX XXXXX

With love & blessings,
Thaarani & Jothishwar
`;
  const blob = new Blob([inviteContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Wedding_Invitation.txt';
  a.click();
  URL.revokeObjectURL(url);
});

/* ===== MICRO-INTERACTIONS ===== */
// Add ripple effect to buttons
document.querySelectorAll('.save-date-btn, .rsvp-submit-btn, .directions-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute;border-radius:50%;
      background:rgba(255,255,255,0.3);
      width:0;height:0;
      left:${e.clientX - rect.left}px;
      top:${e.clientY - rect.top}px;
      transform:translate(-50%,-50%);
      animation:rippleAnim 0.6s linear;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { width: 300px; height: 300px; opacity: 0; }
  }
  .nav-links a.active { color: var(--gold); }
  .nav-links a.active::after { width: 100%; }
`;
document.head.appendChild(style);

/* ===== EVENT CARD TILT ===== */
document.querySelectorAll('.event-card, .glass-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * 4;
    const rotY = ((x - centerX) / centerX) * -4;
    this.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});


function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ===== INIT ===== */
// Start reveal on DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(triggerReveal, 2300);
});

/* ============================================================
   ENVELOPE INVITATION OPENING
   ============================================================ */
(function () {
  const overlay  = document.getElementById('envOverlay');
  const envelope = document.getElementById('envelope');
  const wrapper  = envelope && envelope.closest('.env-wrapper');
  const seal     = document.getElementById('envSeal');
  const hint     = document.getElementById('envHint');
  const envCard  = document.getElementById('envCard');
  const enterBtn = document.getElementById('cardEnterBtn');

  if (!overlay || !envelope) return;

  let opened = false;

  /* Seal is the primary target; whole envelope is the fallback */
  seal  && seal.addEventListener('click', openEnvelope);
  seal  && seal.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });
  envelope.addEventListener('click', e => {
    /* Only open if not clicking the "View Invitation" card button */
    if (!e.target.closest('#envCard')) openEnvelope();
  });

  function openEnvelope() {
    if (opened) return;
    opened = true;

    /* Seal press animation */
    if (seal) seal.classList.add('is-clicked');

    /* Hide hint */
    if (hint) hint.classList.add('hidden');

    /* Flap opens — envelope stays centered while card animates */
    setTimeout(() => envelope.classList.add('is-open'), 400);

    /* Card rises from inside the envelope once flap is open */
    setTimeout(() => envCard && envCard.classList.add('is-visible'), 1600);

    /* Envelope fades while card is paused at center (~38% into the 2.6s animation) */
    setTimeout(() => envelope.classList.add('is-gone'), 2600);
  }

  enterBtn && enterBtn.addEventListener('click', () => {
    overlay.classList.add('is-closed');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    /* Unlock scroll */
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width    = '';
    document.documentElement.style.overflow = '';
    /* Always start from top of page */
    window.scrollTo(0, 0);
    document.getElementById('navbar')?.classList.add('visible');
  });

  /* Lock scroll while overlay is visible — position:fixed prevents iOS touch scroll too */
  function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width    = '100%';
    document.documentElement.style.overflow = 'hidden';
  }

  lockScroll();

  /* Re-lock if loader briefly cleared it */
  document.getElementById('loader') && document.getElementById('loader').addEventListener('transitionend', () => {
    if (!opened) lockScroll();
  }, { once: true });

})();

