/* ═══════════════════════════════════════
   Dr. Cashless — App JavaScript
═══════════════════════════════════════ */

// ── Drawer (Side Nav) ──────────────────
const menuBtn  = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const drawer   = document.getElementById('drawer');
const overlay  = document.getElementById('overlay');

function openDrawer() {
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

// Close drawer when a nav link is clicked
drawer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

// ── Hospital Slider ────────────────────
const track     = document.getElementById('sliderTrack');
const dots      = document.querySelectorAll('.dot');
const prevBtn   = document.getElementById('prevSlide');
const nextBtn   = document.getElementById('nextSlide');
const slides    = track ? track.children : [];
let current     = 0;
let autoTimer   = null;

function goToSlide(index) {
  if (!track || slides.length === 0) return;
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(current - 1); resetAuto(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(current + 1); resetAuto(); });

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.i, 10));
    resetAuto();
  });
});

function startAuto() {
  autoTimer = setInterval(() => goToSlide(current + 1), 4500);
}
function resetAuto() {
  clearInterval(autoTimer);
  startAuto();
}

// Touch / swipe on slider
let touchStartX = 0;
if (track) {
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? current + 1 : current - 1);
      resetAuto();
    }
  });
}

// Start auto-play
startAuto();

// ── Smooth active nav highlight on scroll ──
const sections = document.querySelectorAll('section[id], main[id]');
const navLinks  = document.querySelectorAll('.drawer-nav a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.parentElement.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => observer.observe(sec));

// ── Header shadow on scroll ──
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (header) {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,0.08)'
      : 'none';
  }
}, { passive: true });

// ── Animate service cards on scroll ──
const cards = document.querySelectorAll('.svc-card, .step, .hero-stat-card');
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

cards.forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
  cardObserver.observe(card);
});
