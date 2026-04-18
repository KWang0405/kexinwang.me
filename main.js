/* ===== CANVAS BACKGROUND: traffic network animation ===== */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes, edges, animFrame;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    init();
  }

  function init() {
    // Create nodes representing intersections
    nodes = Array.from({ length: 38 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.8,
      type: Math.random() < 0.15 ? 'cav' : 'node',  // 15% highlighted
    }));
    // Fixed edges (road links)
    edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) edges.push([i, j, d]);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Recompute nearby edges each frame for dynamic feel
    const dynamicEdges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) dynamicEdges.push([i, j, d]);
      }
    }

    // Draw edges
    dynamicEdges.forEach(([i, j, d]) => {
      const alpha = (1 - d / 180) * 0.12;
      const ni = nodes[i], nj = nodes[j];
      const isCav = ni.type === 'cav' || nj.type === 'cav';
      ctx.beginPath();
      ctx.moveTo(ni.x, ni.y);
      ctx.lineTo(nj.x, nj.y);
      ctx.strokeStyle = isCav
        ? `rgba(0,229,255,${alpha * 1.8})`
        : `rgba(74,158,255,${alpha})`;
      ctx.lineWidth = isCav ? 0.8 : 0.5;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      if (n.type === 'cav') {
        ctx.fillStyle = 'rgba(0,229,255,0.9)';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = 'rgba(74,158,255,0.35)';
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    resize();
    draw();
  });

  resize();
  draw();
})();

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      // stagger within a group
      const siblings = [...e.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay = siblings.indexOf(e.target) * 80;
      setTimeout(() => e.target.classList.add('visible'), Math.min(delay, 300));
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));

/* ===== NAV: shrink on scroll ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 60
    ? 'rgba(10,14,26,0.97)'
    : 'rgba(10,14,26,0.85)';
}, { passive: true });

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`nav a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

const activeStyle = document.createElement('style');
activeStyle.textContent = `nav ul li a.active:not(.nav-cta) { color: #e8edf5 !important; }`;
document.head.appendChild(activeStyle);
