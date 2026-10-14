(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("is-visible"));
  }

  // Lightweight ambient particle canvas; respects reduced-motion settings.
  const canvas = document.getElementById("particles");
  if (!canvas || reducedMotion) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let width = 0, height = 0, particles = [], frame = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px"; canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(72, Math.floor(width / 18));
    particles = Array.from({length: count}, () => ({
      x: Math.random() * width, y: Math.random() * height,
      r: Math.random() * 1.5 + .35, speed: Math.random() * .22 + .06,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > .65 ? "96,165,250" : "94,242,192"
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; }
      const alpha = .18 + (Math.sin(frame * .018 + p.phase) + 1) * .2;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${alpha})`; ctx.fill();
    });
    frame++;
    requestAnimationFrame(draw);
  };
  resize();
  window.addEventListener("resize", resize, {passive: true});
  draw();
})();
