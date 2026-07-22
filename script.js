"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     MODE SWITCHING
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
      if (modes[k]) {
        modes[k].classList.remove("active");
      }
    });
    
    if (modes[mode]) {
      modes[mode].classList.add("active");
    }
  }

  /* ==========================================================================
     INTERSECTION OBSERVER (REVEAL ANIMATIONS)
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
        // Optional: Stop observing once revealed to keep it persistent
        // observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-blur');
  revealElements.forEach(el => observer.observe(el));

  /* ==========================================================================
     SMOOTH PARALLAX (REQUEST ANIMATION FRAME)
     ========================================================================== */
  const parallaxElements = document.querySelectorAll('.parallax');
  let scrollY = window.scrollY;
  let ticking = false;

  function updateParallax() {
    if (currentMode !== 'soul') return; // Only run in soul mode

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0;
      // Calculate offset based on scroll position
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

  // Initial trigger
  updateParallax();
});
