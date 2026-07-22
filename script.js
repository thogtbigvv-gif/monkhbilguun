"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const buttons = document.querySelectorAll('.mode-btn');
  const STORAGE_KEY = 'mb_ecosystem_mode';
  
  // Local storage-ээс өмнөх тохиргоог шалгах, байхгүй бол 'zen' горимоор эхлэх
  let currentMode = localStorage.getItem(STORAGE_KEY) || 'zen';
  
  // Анхны төлөвийг ачааллах үед шилжилтгүйгээр тохируулах
  applyMode(currentMode);

  // Товчлууруудад үйлдэл холбох
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetMode = btn.getAttribute('data-mode-btn');
      
      // Хэрэв ижилхэн горим дээр дарвал үйлдэл хийхгүй
      if (targetMode === currentMode) return;
      
      const updateDOM = () => applyMode(targetMode);

      // View Transitions API дэмждэг эсэхийг шалгаж, animation ажиллах нөхцөлийг хангах
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (document.startViewTransition && !prefersReducedMotion) {
        document.startViewTransition(updateDOM);
      } else {
        updateDOM();
      }
    });
  });

  // Горим өөрчлөх үндсэн функц
  function applyMode(mode) {
    currentMode = mode;
    root.setAttribute('data-mode', mode);
    localStorage.setItem(STORAGE_KEY, mode);
    
    // Товчлуурын идэвхтэй төлөв (Aria болон Text) шинэчлэх
    buttons.forEach(btn => {
      const isSelected = btn.getAttribute('data-mode-btn') === mode;
      btn.setAttribute('aria-pressed', isSelected);
      
      // Сонгогдсон горимоос шалтгаалан товчны текстийн хэлбэрийг өөрчлөх
      if (mode === 'zen') {
        btn.textContent = btn.getAttribute('data-mode-btn') === 'zen' ? '[ ZEN ]' : '[ SOUL ]';
      } else {
        btn.textContent = btn.getAttribute('data-mode-btn') === 'zen' ? 'Zen' : 'Soul';
      }
    });
  }

  // Зөвхөн Zen горим дээр харагдах сүлжээний хоцролт (Latency) симуляци
  const latencyEl = document.getElementById('zen-latency');
  if (latencyEl) {
    setInterval(() => {
      if (currentMode === 'zen') {
        // 8-аас 13ms хооронд санамсаргүй тоо гаргах
        latencyEl.textContent = Math.floor(8 + Math.random() * 6) + 'ms';
      }
    }, 2400);
  }
});
