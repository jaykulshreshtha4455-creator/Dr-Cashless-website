/* Dr. Cashless — app.js */

// ── Drawer ──────────────────────────────
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

// ── Header on scroll ────────────────────
const hdr = document.querySelector('.header');
window.addEventListener('scroll', () => {
  hdr.style.borderBottomColor = scrollY > 10 ? '#e5e5e5' : 'transparent';
}, { passive: true });

// ── Scroll entrance animations ──────────
const els = document.querySelectorAll('.svc-card, .step, .why-card, .hcard, .hero-stats-row, .num-item');
const io  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

els.forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(16px)';
  el.style.transition = `opacity .45s ease ${i * 0.05}s, transform .45s ease ${i * 0.05}s`;
  io.observe(el);
});
