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
    toggleBtn.setAttribute("aria-pressed", mode === "zen" ? "true" : "false");

    Object.keys(modes).forEach(k => {
      if (!modes[k]) return;
      if (k === mode) {
        modes[k].hidden = false;
        modes[k].classList.add("active");
      } else {
        modes[k].classList.remove("active");
        modes[k].hidden = true;
      }
    });

    if (mode === "zen") bootZenTerminal();
  }

  /* ==========================================================================
     ZEN TERMINAL - TYPING EFFECT (boots once, first time zen mode opens)
     ========================================================================== */
  let zenBooted = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function bootZenTerminal() {
    if (zenBooted) return;
    zenBooted = true;

    const typedEls = Array.from(document.querySelectorAll('#zen-terminal .typed'));
    const outputEls = document.querySelectorAll('#zen-terminal .term-output');

    if (reducedMotion) {
      // Skip animation, just show everything immediately
      typedEls.forEach(el => {
        el.textContent = el.getAttribute('data-typed-text') || '';
        el.classList.add('done');
      });
      outputEls.forEach(el => el.classList.add('visible'));
      return;
    }

    let i = 0;
    function typeNext() {
      if (i >= typedEls.length) return;
      const el = typedEls[i];
      const text = el.getAttribute('data-typed-text') || '';
      let charIndex = 0;

      function typeChar() {
        if (charIndex <= text.length) {
          el.textContent = text.slice(0, charIndex);
          charIndex++;
          setTimeout(typeChar, 35);
        } else {
          el.classList.add('done');
          if (outputEls[i]) {
            setTimeout(() => outputEls[i].classList.add('visible'), 200);
          }
          i++;
          setTimeout(typeNext, 500);
        }
      }
      typeChar();
    }

    typeNext();
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
