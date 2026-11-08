/* AAIRAGALAXY STARFIELD */
(() => {
  "use strict";

  const canvas = document.getElementById("bg") || document.getElementById("stars");
  if (!canvas || typeof canvas.getContext !== "function") return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let frame = 0;
  const stars = [];
  const STAR_COUNT = 180;
  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  for (let i = 0; i < STAR_COUNT; i += 1) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 0.45 + 0.08,
      alpha: Math.random() * 0.65 + 0.25
    });
  }

  function animateStars() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      if (!reduceMotion) {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      }
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = "#b9ffff";
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduceMotion) frame = window.requestAnimationFrame(animateStars);
  }

  animateStars();
  window.addEventListener("pagehide", () => {
    if (frame) window.cancelAnimationFrame(frame);
  }, { once: true });
})();
