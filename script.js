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
     CONSTELLATION PROGRESS THREAD
     Reading-progress bar with a star lit at each poem's position.
     ========================================================================== */
  const progressFill = document.getElementById('progress-fill');
  const constellationTrack = document.getElementById('constellation-track');
  const sections = document.querySelectorAll('.memory-fragment');
  let markers = [];

  function buildMarkers() {
    if (!constellationTrack) return;
    constellationTrack.querySelectorAll('.progress-star').forEach(s => s.remove());
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    markers = Array.from(sections).map(sec => {
      const pos = totalHeight > 0 ? Math.min((sec.offsetTop / totalHeight) * 100, 100) : 0;
      const star = document.createElement('span');
      star.className = 'progress-star';
      star.style.left = `${pos}%`;
      constellationTrack.appendChild(star);
      return { el: star, pos };
    });
  }

  function updateProgress() {
    if (!progressFill) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = totalHeight > 0 ? Math.min((window.scrollY / totalHeight) * 100, 100) : 0;
    progressFill.style.width = `${scrolled}%`;
    markers.forEach(m => m.el.classList.toggle('lit', scrolled >= m.pos - 1));
  }

  /* ==========================================================================
     PARALLAX FLOATING EFFECTS
     ========================================================================== */
  const parallaxElements = document.querySelectorAll('.parallax');

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }

  /* ==========================================================================
     SHARED SCROLL / RESIZE LOOP
     One rAF-throttled listener drives both progress and parallax.
     ========================================================================== */
  let ticking = false;
  function onFrame() {
    updateProgress();
    if (!reducedMotion) updateParallax();
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onFrame);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    buildMarkers();
    updateProgress();
  });

  // Document height can shift once web fonts swap in — recalculate then too.
  window.addEventListener('load', () => { buildMarkers(); updateProgress(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { buildMarkers(); updateProgress(); });
  }

  buildMarkers();
  updateProgress();
  if (!reducedMotion) updateParallax();
});
