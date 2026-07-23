"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     INTERSECTION OBSERVER (REVEAL)
     ========================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-fade, .reveal-blur').forEach(el => observer.observe(el));

  /* ==========================================================================
     PARALLAX FLOATING EFFECTS
     ========================================================================== */
  const parallaxElements = document.querySelectorAll('.parallax');
  let scrollY = window.scrollY;
  let ticking = false;

  function updateParallax() {
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0;
      const yPos = scrollY * speed;
      el.style.transform = `translateY(${yPos}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!ticking && !reducedMotion) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  if (!reducedMotion) updateParallax();
});
