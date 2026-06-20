// ---------------------------------------------------------------------------
// Adheeb Aflah — portfolio interactions
// Sections: network background, typewriter, navbar state, scroll reveal,
// card tilt, system clock
// ---------------------------------------------------------------------------

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initNetworkBackground();
  initTypewriter();
  initNavbar();
  initScrollReveal();
  initCardTilt();
  initSystemClock();
});

// --- Background: animated node network ---------------------------------------
// A graph of moving nodes, edges drawn between nearby nodes, and a stronger
// link to the cursor — a nod to the knowledge-graph / DAG work in the
// projects below, rather than a generic decorative effect.
function initNetworkBackground() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (prefersReducedMotion) {
    // Static, low-cost version: draw one frame of nodes + links, no animation.
    drawStaticNetwork(canvas, ctx);
    return;
  }

  const LINK_DISTANCE = 150;
  const CURSOR_RADIUS = 180;
  const MAX_NODES = 140;
  const mouse = { x: null, y: null };
  let width, height, nodes, frame;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const count = Math.min(MAX_NODES, Math.floor((width * height) / 13000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.4 + 1,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // edges between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DISTANCE) {
          const alpha = (1 - dist / LINK_DISTANCE) * 0.35;
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // edge to cursor, accent color
      if (mouse.x !== null) {
        const dx = nodes[i].x - mouse.x;
        const dy = nodes[i].y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CURSOR_RADIUS) {
          const alpha = (1 - dist / CURSOR_RADIUS) * 0.6;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    // nodes drawn on top of edges
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x <= 0 || n.x >= width) n.vx *= -1;
      if (n.y <= 0 || n.y >= height) n.vy *= -1;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.65)';
      ctx.fill();
    });

    frame = requestAnimationFrame(step);
  }

  resize();
  frame = requestAnimationFrame(step);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 200);
  });
}

function drawStaticNetwork(canvas, ctx) {
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  const count = Math.min(70, Math.floor((width * height) / 20000));
  const nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
  }));

  nodes.forEach((n, i) => {
    nodes.slice(i + 1).forEach((m) => {
      const dist = Math.hypot(n.x - m.x, n.y - m.y);
      if (dist < 150) {
        ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - dist / 150) * 0.3})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
      }
    });
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.fill();
  });
}

// --- Footer system clock -------------------------------------------------------
function initSystemClock() {
  const el = document.getElementById('systemClock');
  if (!el) return;

  function update() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour12: false });
    el.textContent = `SESSION ACTIVE — ${time} LOCAL`;
  }

  update();
  setInterval(update, 1000);
}

// --- Typewriter headline -----------------------------------------------------
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'RAG-powered legal tech.',
    'high-throughput async pipelines.',
    'scalable FastAPI backends.',
    'graph-driven knowledge systems.'
  ];

  if (prefersReducedMotion) {
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1700);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }

  tick();
}

// --- Navbar: scroll weight + active section highlight ------------------------
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 16);
  }, { passive: true });

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('text-emerald-400', isActive);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

// --- Scroll-triggered reveal --------------------------------------------------
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
}

// --- Subtle 3D tilt on project cards -------------------------------------------
function initCardTilt() {
  if (prefersReducedMotion) return;
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 3.5}deg) rotateX(${-y * 3.5}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });
}