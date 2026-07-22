"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     MODE SWITCHING (SOUL / ZEN)
     ========================================================================== */
  const root = document.documentElement;
  const toggleBtn = document.getElementById("mode-toggle");
  const modes = {
    soul: document.getElementById("soul-canvas"),
    zen: document.getElementById("zen-terminal")
  };

  let currentMode = "soul";

  toggleBtn.addEventListener("click", () => {
    const nextMode = currentMode === "soul" ? "zen" : "soul";
    
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => switchMode(nextMode));
    } else {
      switchMode(nextMode);
    }
  });

  function switchMode(mode) {
    currentMode = mode;
    root.setAttribute("data-mode", mode);
    
    Object.keys(modes).forEach(k => {
      if (modes[k]) modes[k].classList.remove("active");
    });
    
    if (modes[mode]) {
      modes[mode].classList.add("active");
    }
  }

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

  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-blur');
  revealElements.forEach(el => observer.observe(el));

  /* ==========================================================================
     PARALLAX FLOATING EFFECTS
     ========================================================================== */
  const parallaxElements = document.querySelectorAll('.parallax');
  let scrollY = window.scrollY;
  let ticking = false;

  function updateParallax() {
    if (currentMode !== 'soul') return;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0;
      const yPos = scrollY * speed;
      el.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!ticking && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  updateParallax();
});
