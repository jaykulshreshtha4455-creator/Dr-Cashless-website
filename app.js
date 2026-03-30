/* Dr. Cashless — app.js */

// --- Drawer ---
const menuBtn  = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const drawer   = document.getElementById('drawer');
const overlay  = document.getElementById('overlay');

const openDrawer  = () => { drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
const closeDrawer = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };

menuBtn.addEventListener('click', openDrawer);
closeBtn.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

// --- Scroll Reveal ---
const revealEls = document.querySelectorAll('.reveal');
const revealIO  = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealIO.observe(el));

// --- Animated Counters ---
function animateCount(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = target >= 1000
      ? (start >= 1000 ? (start / 1000).toFixed(start >= 10000 ? 0 : 1) + 'K' : Math.floor(start))
      : Math.floor(start);
    if (start < target) requestAnimationFrame(tick);
    else el.textContent = target >= 1000
      ? (target >= 10000 ? (target/1000).toFixed(0)+'K' : (target/1000).toFixed(1)+'K')
      : target;
  };
  requestAnimationFrame(tick);
}

const numEls = document.querySelectorAll('.num-val[data-target]');
const numIO  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target, +e.target.dataset.target);
      numIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
numEls.forEach(el => numIO.observe(el));

// --- Header bg shift on scroll out of hero ---
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (scrollY > 80) {
    header.style.background = 'rgba(10,10,10,0.97)';
  } else {
    header.style.background = 'rgba(10,10,10,0.85)';
  }
}, { passive: true });
