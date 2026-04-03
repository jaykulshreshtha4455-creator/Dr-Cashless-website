/* Agency page — scroll reveal */
document.addEventListener('DOMContentLoaded', () => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.ag-step, .tech-category, .plan-card, .why-stat').forEach(
    (el) => {
      el.classList.add('reveal');
      io.observe(el);
    }
  );
});
