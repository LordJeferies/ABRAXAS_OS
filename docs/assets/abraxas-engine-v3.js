/**
 * ABRAXAS OS — Master Apple & Awwwards Engine (v3.0.0 Pro)
 * 31 Core Architectural & Visual Principles Integrated
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. DATA-DRIVEN CONFIGURATION LAYER (Principle 2: window.siteConfig)
  // ==========================================================================
  window.siteConfig = {
    brand: {
      name: "ABRAXAS OS",
      tagline: "Mente abierta. Poder total.",
      thesis: "ABRAXAS convierte criterio en infraestructura.",
      version: "v3.0.0-PRO",
      commitSha: "91234741f0b3a1ac5bd7e4c0556fafa868d00769"
    },
    colors: {
      iris: "#8052ff",
      gold: "#d4af37",
      cyan: "#2997ff",
      emerald: "#30d158",
      darkBg: "#000000"
    },
    metrics: [
      { num: "18s", label: "Auto-Edición Quirúrgica", sub: "De silencio a exportación", color: "gold" },
      { num: "1➔8", label: "Multiplicación de Formatos", sub: "Una semilla viva", color: "cyan" },
      { num: "50", label: "Activos al Mes por Lote", sub: "Gobernanza en una tarde", color: "iris" },
      { num: "0.00%", label: "Margen de Error (GAPs)", sub: "Metrología estricta", color: "gold" }
    ],
    formats: [
      { id: "reels", name: "Videos Cortos (9:16)", speed: "18s auto-corte", tag: "TikTok / Reels / Shorts", photo: "plate_05_vav_cathedral.webp", desc: "Subtítulos cinéticos Whisper palabra por palabra con 13 familias de motion y masterización a -14 LUFS." },
      { id: "carousels", name: "Carruseles 4:5", speed: "8 láminas HD", tag: "Instagram / LinkedIn", photo: "plate_08_contenido_portal.webp", desc: "Arquitectura tipográfica de alta retención visual con jerarquía editorial de 4 niveles." },
      { id: "threads", name: "Hilos de Autoridad", speed: "7 posts conectados", tag: "X / LinkedIn", photo: "plate_03_continuity_axis.webp", desc: "Estructura dialéctica Tesis-Antítesis-Síntesis diseñada para generar guardados y reposts." },
      { id: "newsletters", name: "Newsletters & Email", speed: "1-clic Markdown", tag: "Substack / Beehiiv", photo: "plate_07_moon_loop.webp", desc: "Bucle de retención y conversión directa con apertura de bucle narrativo y payoff garantizado." },
      { id: "podcasts", name: "Audio & Micro-Podcasts", speed: "-14 LUFS", tag: "Spotify / Apple Podcasts", photo: "plate_04_shim_metrology.webp", desc: "Balance tonal quirúrgico con ecualización dinámica a 45Hz y reducción de sibilancias." },
      { id: "youtube", name: "YouTube Ensayos (16:9)", speed: "4K Master", tag: "YouTube Long-form", photo: "plate_10_master_monument.webp", desc: "Guiones en 4 tiempos estructurados con el Eje de Continuidad para retención de audiencia superior al 60%." }
    ]
  };

  // ==========================================================================
  // 2. REACTIVE STATE MANAGEMENT VIA JS PROXY (Principle 5: window.appState)
  // ==========================================================================
  const rawState = {
    activeFormat: "reels",
    isArchitectOpen: false,
    isDrawerOpen: false,
    currentLocale: (window.location.pathname.includes('/en/') ? 'en' : 'es')
  };

  window.appState = new Proxy(rawState, {
    set(target, key, value) {
      target[key] = value;
      if (key === 'activeFormat') updateFormatViewer(value);
      if (key === 'isArchitectOpen') toggleArchitectPopup(value);
      if (key === 'isDrawerOpen') toggleDrawerUI(value);
      return true;
    }
  });

  // ==========================================================================
  // 3. CINEMATIC PRELOADER (Principle 9)
  // ==========================================================================
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('preloader-counter');
    const bar = document.getElementById('preloader-bar');
    if (!preloader || !counter || !bar) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        counter.textContent = '100%';
        bar.style.width = '100%';
        
        setTimeout(() => {
          preloader.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          preloader.style.opacity = '0';
          preloader.style.transform = 'translateY(-30px)';
          setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }, 150);
      } else {
        counter.textContent = progress + '%';
        bar.style.width = progress + '%';
      }
    }, 25);
  }

  // ==========================================================================
  // 4. HTML5 CANVAS PARTICLE BRAIN ENGINE (Principle 25: Chevron Particles)
  // ==========================================================================
  function initParticleBrain() {
    const canvas = document.getElementById('brain-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const colors = ['rgba(128, 82, 255, ', 'rgba(212, 175, 55, ', 'rgba(41, 151, 255, ', 'rgba(48, 209, 88, '];
    const particleCount = Math.min(width > 768 ? 65 : 30, 80);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.8,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 8 + 4,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    function renderChevron(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      // Draw Abraxas Chevron Symbol (Inverted V / Open Triangle)
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size * 0.85, p.size);
      ctx.lineTo(p.size * 0.45, p.size * 0.75);
      ctx.lineTo(0, -p.size * 0.3);
      ctx.lineTo(-p.size * 0.45, p.size * 0.75);
      ctx.lineTo(-p.size * 0.85, p.size);
      ctx.closePath();
      ctx.fillStyle = p.colorBase + p.alpha + ')';
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting neural lines between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(212, 175, 55, ' + (1 - dist / 130) * 0.15 + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height * 0.8 + 20;
        if (p.y > height * 0.8 + 20) p.y = -20;

        renderChevron(p);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ==========================================================================
  // 5. MOUSE SPOTLIGHT EFFECT (Principle 23: --mouse-x, --mouse-y tracking)
  // ==========================================================================
  function initMouseSpotlight() {
    document.querySelectorAll('.spotlight-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // ==========================================================================
  // 6. FORMAT VIEWER CONTROLLER
  // ==========================================================================
  function updateFormatViewer(formatId) {
    const format = window.siteConfig.formats.find(f => f.id === formatId) || window.siteConfig.formats[0];
    const displayPhoto = document.getElementById('viewer-active-photo');
    const displayTitle = document.getElementById('viewer-active-title');
    const displaySpeed = document.getElementById('viewer-active-speed');
    const displayTag = document.getElementById('viewer-active-tag');
    const displayDesc = document.getElementById('viewer-active-desc');

    if (displayTitle) displayTitle.textContent = format.name;
    if (displaySpeed) displaySpeed.textContent = format.speed;
    if (displayTag) displayTag.textContent = format.tag;
    if (displayDesc) displayDesc.textContent = format.desc;
    if (displayPhoto) {
      displayPhoto.style.opacity = '0.3';
      setTimeout(() => {
        displayPhoto.src = `../../assets/${format.photo}`;
        displayPhoto.style.opacity = '1';
      }, 120);
    }

    document.querySelectorAll('.format-pill-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-format') === formatId);
    });
  }

  // ==========================================================================
  // 7. CONTEXTUAL ARQUITECTO WIDGET (Principle 30)
  // ==========================================================================
  function toggleArchitectPopup(isOpen) {
    const popup = document.getElementById('architect-popup-card');
    if (popup) {
      popup.classList.toggle('open', isOpen);
    }
  }

  function initArchitectWidget() {
    const trigger = document.getElementById('architect-pill-trigger');
    const closeBtn = document.getElementById('architect-popup-close');
    const copyBtn = document.getElementById('btn-copy-prompt');

    if (trigger) {
      trigger.addEventListener('click', () => {
        window.appState.isArchitectOpen = !window.appState.isArchitectOpen;
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.appState.isArchitectOpen = false;
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const promptText = `Actúa como ARQUITECTO de ABRAXAS OS. Evalúa mi idea de contenido aplicando: 1. Tesis contraria de nicho, 2. Deuda narrativa legítima (Hook), 3. Payoff exacto, 4. Ramificación en 8 formatos derivados sincronizados con Merkle-DAG.`;
        navigator.clipboard.writeText(promptText).then(() => {
          copyBtn.textContent = '✅ ¡Prompt Copiado!';
          setTimeout(() => { copyBtn.textContent = '📋 Preparar pregunta para IA'; }, 2000);
        });
      });
    }
  }

  // ==========================================================================
  // 8. CONTROL CENTER DRAWER (Principle 26)
  // ==========================================================================
  function toggleDrawerUI(isOpen) {
    const drawer = document.getElementById('control-center-drawer');
    if (drawer) {
      drawer.classList.toggle('open', isOpen);
    }
  }

  function initControlCenter() {
    const openBtn = document.getElementById('btn-open-control-center');
    const closeBtn = document.getElementById('btn-close-control-center');

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        window.appState.isDrawerOpen = true;
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.appState.isDrawerOpen = false;
      });
    }
  }

  // ==========================================================================
  // 9. INITIALIZE EVERYTHING ON DOM READY
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initParticleBrain();
    initMouseSpotlight();
    initArchitectWidget();
    initControlCenter();

    document.querySelectorAll('.format-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const formatId = btn.getAttribute('data-format');
        if (formatId) window.appState.activeFormat = formatId;
      });
    });
  });

})();
