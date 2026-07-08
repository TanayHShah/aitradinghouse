(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!prefersReducedMotion.matches) {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        }
      },
      { threshold: 0.12 }
    );

    document
      .querySelectorAll('.glass, .glass-soft, .app-card, .bento-card')
      .forEach(el => {
        el.style.transform = 'translateY(8px)';
        el.style.opacity = '0';
        el.style.transition = 'opacity 220ms ease-out, transform 220ms ease-out';
        observer.observe(el);
      });

    const style = document.createElement('style');
    style.textContent = `
      .in-view {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
})();

