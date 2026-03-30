/* ═══════════════════════════════
   Dr. Cashless — app.js
═══════════════════════════════ */

// ── Drawer ─────────────────────
const menuBtn  = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const drawer   = document.getElementById('drawer');
const overlay  = document.getElementById('overlay');

function openDrawer()  {
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', openDrawer);
closeBtn.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

// ── Hospital Slider ─────────────
const track   = document.getElementById('sliderTrack');
const dots    = document.querySelectorAll('.sdot');
const slides  = track ? Array.from(track.children) : [];
let cur = 0, timer = null;

function goTo(idx) {
  cur = (idx + slides.length) % slides.length;
  track.style.transform = `translateX(-${cur * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === cur));
}

dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.idx); resetTimer(); }));

// Touch swipe
let tx = 0;
if (track) {
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 48) { goTo(cur + (dx > 0 ? 1 : -1)); resetTimer(); }
  });
}

function startTimer() { timer = setInterval(() => goTo(cur + 1), 4500); }
function resetTimer() { clearInterval(timer); startTimer(); }
startTimer();

// ── Scroll-triggered entrance ───
const animEls = document.querySelectorAll('.svc-row-card, .step-card, .hero-stat-card, .hosp-card');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity  = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

animEls.forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = `opacity .4s ease ${i * 0.06}s, transform .4s ease ${i * 0.06}s`;
  io.observe(el);
});

// ── Header shadow on scroll ─────
const hdr = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (hdr) hdr.style.boxShadow = scrollY > 6 ? '0 2px 14px rgba(0,0,0,.07)' : 'none';
}, { passive: true });
