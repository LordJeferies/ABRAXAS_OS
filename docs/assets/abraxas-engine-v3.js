/**
 * ABRAXAS OS — Master Apple & Awwwards Engine (v3.1.0 Pro Edition)
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
      version: "v3.1.0-PRO",
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

  // Helper to determine asset root path based on page URL depth
  function getAssetRoot() {
    const p = window.location.pathname;
    if (p.includes('/tools/vav/') || p.includes('/tools/shim/') || p.includes('/tools/arquitecto/')) return '../../../../assets/';
    if (p.includes('/tools/') || p.includes('/ecosistema/') || p.includes('/gerencia/') || p.includes('/flujo/') || p.includes('/canon/') || p.includes('/backup/') || p.includes('/luna-comercial/') || p.includes('/branding-method/') || p.includes('/abraxas-core-example/') || p.includes('/criterios-roadmap/')) return '../../assets/';
    if (p.includes('/es/') || p.includes('/en/') || p.includes('/v3/')) return '../assets/';
    return 'assets/';
  }

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

    // Click to dismiss immediately
    preloader.addEventListener(click, () => {
      preloader.style.opacity = 0;
      setTimeout(() => preloader.remove(), 200);
    });

    // Failsafe auto-dismiss after 1.2s regardless of timer
    setTimeout(() => {
      if (preloader && preloader.parentNode) {
        preloader.style.opacity = 0;
        setTimeout(() => preloader.remove(), 250);
      }
    }, 1200);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        counter.textContent = '100%';
        bar.style.width = '100%';
        
        setTimeout(() => {
          preloader.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          preloader.style.opacity = '0';
          preloader.style.transform = 'translateY(-20px)';
          setTimeout(() => { preloader.style.display = 'none'; }, 500);
        }, 120);
      } else {
        counter.textContent = progress + '%';
        bar.style.width = progress + '%';
      }
    }, 20);
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
    const particleCount = Math.min(width > 768 ? 60 : 25, 70);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.75,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 7 + 4,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.25,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    function renderChevron(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      // Draw Abraxas Chevron Symbol (Inverted V)
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

      // Connecting neural lines between nearby nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(212, 175, 55, ' + (1 - dist / 120) * 0.12 + ')';
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
        if (p.y < -20) p.y = height * 0.75 + 20;
        if (p.y > height * 0.75 + 20) p.y = -20;

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
  // 6. FORMAT VIEWER CONTROLLER (Smart Crossfade & Image Resolution)
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
      displayPhoto.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
      displayPhoto.style.opacity = '0.2';
      displayPhoto.style.transform = 'scale(0.98)';
      
      setTimeout(() => {
        const rootPath = getAssetRoot();
        displayPhoto.src = `${rootPath}${format.photo}`;
        displayPhoto.style.opacity = '1';
        displayPhoto.style.transform = 'scale(1)';
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
        const promptText = `Actúa como ARQUITECTO de ABRAXAS OS. Evalúa mi idea aplicando: 1. Tesis contraria de nicho, 2. Deuda narrativa legítima (Hook), 3. Payoff exacto, 4. Ramificación en 8 formatos derivados sincronizados con Merkle-DAG y 5. Atribución de ventas en la Luna Comercial.`;
        navigator.clipboard.writeText(promptText).then(() => {
          copyBtn.textContent = '✅ ¡Prompt Copiado al Portapapeles!';
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

  
  // ==========================================================================
  // MASTER HIERARCHICAL TREE MODAL (RAÍCES, SUB-RAÍCES Y SUB-TEMAS)
  // ==========================================================================
  function ensureMasterTreeModal() {
    let modal = document.getElementById('abraxas-master-tree-modal');
    if (modal) return modal;

    const isEs = document.documentElement.lang !== 'en';
    const langPrefix = window.location.pathname.includes('/en/') ? '../../en/' : '../../es/';

    modal = document.createElement('div');
    modal.id = 'abraxas-master-tree-modal';
    modal.style.cssText = 'position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.88); backdrop-filter: blur(25px); display: none; align-items: center; justify-content: center; padding: 20px;';
    
    modal.innerHTML = `
      <div style="background: #0d0d12; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; width: 100%; max-width: 1080px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 30px 100px rgba(0,0,0,0.9); overflow: hidden;">
        
        <!-- Modal Header -->
        <div style="padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.02);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.4rem;">🌳</span>
            <div>
              <h3 style="color: #fff; font-size: 1.2rem; margin: 0; font-weight: 700;">${isEs ? 'Atlas y Árbol Total del Sistema' : 'Master System Hierarchy & Atlas'}</h3>
              <p style="color: #94a3b8; font-size: 0.8rem; margin: 2px 0 0 0;">${isEs ? '11 Raíces Maestras • 35 Sub-raíces • Criterios y Enlaces Directos' : '11 Master Roots • 35 Sub-roots • Criteria & Direct Links'}</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <a href="${langPrefix}mapa-sistema/index.html" style="background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.4); color: #d4af37; padding: 6px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; text-decoration: none;">${isEs ? '📖 Ver Página Completa del Mapa' : '📖 View Full Map Page'}</a>
            <button id="btn-close-tree-modal" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center;">✕</button>
          </div>
        </div>

        <!-- Search Bar -->
        <div style="padding: 12px 24px; background: rgba(0,0,0,0.5); border-bottom: 1px solid rgba(255,255,255,0.06);">
          <input type="text" id="tree-search-input" placeholder="${isEs ? '🔍 Buscar por tema, herramienta, ecuación o concepto (ej. carrusel, 18s, facturas, merkle, lunas)...' : '🔍 Search by topic, tool, formula or concept (e.g. carousel, 18s, receipts, merkle, moons)...'}" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); padding: 10px 16px; border-radius: 10px; color: #fff; font-size: 0.9rem; outline: none;">
        </div>

        <!-- Tree Body Container -->
        <div id="tree-modal-body" style="padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 18px;">
          
          <!-- Raíz 1 -->
          <div class="tree-root-item" data-keywords="cosmogonia sol primordial sol negro rayo manifestacion piramide arbol vida ojo 3d lunas">
            <div style="color: #fef08a; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 01 // ATZILUTH & KETER</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}cosmogonia/index.html" style="color: #fff; text-decoration: none;">☀️ 1. Arquitectura Cósmica, Génesis Solar & 10 Esferas</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}cosmogonia/index.html#genesis" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 1.1 Los Dos Soles y el Eclipse</a>
              <a href="${langPrefix}cosmogonia/index.html#piramide" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 1.2 Pirámide de Amatista & Oro</a>
              <a href="${langPrefix}cosmogonia/index.html#ojo-3d" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 1.3 Ojo Digital 3D & 3 Lunas</a>
            </div>
          </div>

          <!-- Raíz 2 -->
          <div class="tree-root-item" data-keywords="yod ganchos hook radar puntos ciegos branding method vectores origen destino 4 campanas">
            <div style="color: #bf5af2; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 02 // CHOKHMAH & YOD</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}tools/yod/index.html" style="color: #fff; text-decoration: none;">🎯 2. Inteligencia Seminal, Radar de Ganchos & Branding</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}tools/yod/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 2.1 YOD Hook Evaluator (0-100)</a>
              <a href="${langPrefix}branding-method/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 2.2 Branding Method (4 Vectores)</a>
              <a href="${langPrefix}abraxas-core-example/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 2.3 Caso Real ABRAXAS Core</a>
            </div>
          </div>

          <!-- Raíz 3 -->
          <div class="tree-root-item" data-keywords="contenido lienzo merkle dag 8 formatos reels carrusel x thread newsletter podcast youtube">
            <div style="color: #38bdf8; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 03 // BINAH & CONTENIDO</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}tools/contenido/index.html" style="color: #fff; text-decoration: none;">🌳 3. Eje de Continuidad en Merkle-DAG & Ecosistema 8-en-1</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}tools/contenido/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 3.1 Objeto Lienzo (6 Bloques)</a>
              <a href="${langPrefix}ecosistema/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 3.2 Ramificación a 8 Formatos</a>
            </div>
          </div>

          <!-- Raíz 4 -->
          <div class="tree-root-item" data-keywords="shim metrologia gaps whisper teleprompter live omisiones levenshtein">
            <div style="color: #bf5af2; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 04 // DA'AT & SHIM</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}tools/shim/index.html" style="color: #fff; text-decoration: none;">🔍 4. Metrología Lúcida en Set (0.00% GAPs con Whisper)</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}tools/shim/index.html#resumen" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 4.1 Live Teleprompter Inteligente</a>
              <a href="${langPrefix}tools/shim/index.html#ecuacion" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 4.2 Distancia Levenshtein Fonética</a>
            </div>
          </div>

          <!-- Raíz 5 -->
          <div class="tree-root-item" data-keywords="vav cuts autocorte 18s motions 13 familias captions whisper vfx zooms framing multicam carousel tipografia png animacion">
            <div style="color: #30d158; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 05 // TIFERET & VAV SÍNTESIS</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}tools/vav/cuts/index.html" style="color: #fff; text-decoration: none;">✂️ 5. La Suite Audiovisual VAV (7 Herramientas de Edición)</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}tools/vav/cuts/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 5.1 VAV Cuts (Auto-Corte 18s & Densidad)</a>
              <a href="${langPrefix}tools/vav/captions/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 5.2 VAV Captions (Subtítulos Cinéticos)</a>
              <a href="${langPrefix}tools/vav/motions/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 5.3 VAV Motions (13 Familias Remotion)</a>
              <a href="${langPrefix}tools/vav/vfx/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 5.4 VAV VFX (Zooms & Efectos con Criterio)</a>
              <a href="${langPrefix}tools/vav/framing/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 5.5 VAV Framing (Multi-Cámara de 1 Toma)</a>
              <a href="${langPrefix}tools/vav/carousel/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 5.6 VAV Carousel (Tipografía & PNGs)</a>
            </div>
          </div>

          <!-- Raíz 6 -->
          <div class="tree-root-item" data-keywords="he kanban 50 lotes compuertas calidad gerencia sqlite roles equipo">
            <div style="color: #ff453a; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 06 // GEVURAH & HE</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}tools/he/index.html" style="color: #fff; text-decoration: none;">📋 6. Despacho Kanban de 50 Lotes & Gobernanza HE</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}tools/he/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 6.1 Kanban de 50 Lotes en Mac</a>
              <a href="${langPrefix}gerencia/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 6.2 Telemetría SQLite & Roles</a>
            </div>
          </div>

          <!-- Raíz 7 -->
          <div class="tree-root-item" data-keywords="luna comercial facturas ocr recibos closers roi ventas whatsapp mercadolibre bucle aprendizaje">
            <div style="color: #30d158; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 07 // HOD & MALKHUT (3 LUNAS)</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}luna-comercial/index.html" style="color: #fff; text-decoration: none;">🌙 7. Luna Comercial, Escáner OCR de Facturas & ROI Real</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}luna-comercial/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 7.1 Escáner OCR de Facturas</a>
              <a href="${langPrefix}cosmogonia/index.html#tres-lunas" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 7.2 Bucle Cerrado: S(t+1) = S(t) + A(t)</a>
            </div>
          </div>

          <!-- Raíz 8 -->
          <div class="tree-root-item" data-keywords="catedra formal 165 iq hilbert delta s e maquina estados algebra medios">
            <div style="color: #38bdf8; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 08 // EPISTEMOLOGÍA & CIENCIA</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}catedra/index.html" style="color: #fff; text-decoration: none;">🏛️ 8. Cátedra Formal 165 IQ (Tratado Epistemológico)</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}catedra/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 8.1 Máquina de Estados delta(s, e)</a>
              <a href="${langPrefix}catedra/index.html#hilbert" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 8.2 Espacio de Hilbert de Activos</a>
            </div>
          </div>

          <!-- Raíz 9 -->
          <div class="tree-root-item" data-keywords="scrum roadmap 1 semana mvp 1 mes enterprise backlog sprints fases">
            <div style="color: #d4af37; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 09 // INGENIERÍA ÁGIL</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}scrum/index.html" style="color: #fff; text-decoration: none;">📋 9. Backlog Scrum: 1 Semana (MVP) vs 1 Mes (Enterprise)</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}scrum/index.html#sprint-1-semana" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 9.1 Sprint MVP de 1 Semana</a>
              <a href="${langPrefix}scrum/index.html#sprint-1-mes" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 9.2 Rollout Enterprise de 1 Mes</a>
            </div>
          </div>

          <!-- Raíz 10 -->
          <div class="tree-root-item" data-keywords="gustos canon direccion arte negro oled 000000 deuda narrativa sf pro botones">
            <div style="color: #bf5af2; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 10 // DIRECCIÓN DE ARTE</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}gustos-canon/index.html" style="color: #fff; text-decoration: none;">🎨 10. Canon de Gustos Visuales & Deuda Narrativa</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}gustos-canon/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 10.1 Estándar Apple MacBook Pro</a>
              <a href="${langPrefix}gustos-canon/index.html#deuda-narrativa" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 10.2 Deuda Narrativa & Payoff</a>
            </div>
          </div>

          <!-- Raíz 11 -->
          <div class="tree-root-item" data-keywords="canon 37 txt buscador boveda sha256 prompt maestro mega prompt">
            <div style="color: #d4af37; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800;">RAÍZ 11 // MEMORIA CANÓNICA</div>
            <h4 style="color: #fff; font-size: 1.05rem; margin: 4px 0 8px 0;"><a href="${langPrefix}canon/index.html" style="color: #fff; text-decoration: none;">📚 11. Biblioteca Canon 37 TXT & Prompt Maestro</a></h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px;">
              <a href="${langPrefix}canon/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 11.1 Buscador Canon 37 TXT</a>
              <a href="${langPrefix}prompt-maestro/index.html" style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; font-size: 0.82rem; color: #cbd5e1; text-decoration: none; border: 1px solid rgba(255,255,255,0.06);">↳ 11.2 Mega-Prompt de Ingeniería</a>
            </div>
          </div>

        </div>

      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const closeBtn = document.getElementById('btn-close-tree-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    // Real-time search filter
    const searchInput = document.getElementById('tree-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const items = modal.querySelectorAll('.tree-root-item');
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          const keywords = item.getAttribute('data-keywords') || '';
          if (!query || text.includes(query) || keywords.includes(query)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    }

    return modal;
  }

  function initControlCenter() {
    const openBtns = document.querySelectorAll('#btn-open-control-center, .btn-open-tree-menu');
    const closeBtn = document.getElementById('btn-close-control-center');
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = ensureMasterTreeModal();
        modal.style.display = 'flex';
        const searchInput = document.getElementById('tree-search-input');
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
          const items = modal.querySelectorAll('.tree-root-item');
          items.forEach(item => item.style.display = 'block');
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.appState.isDrawerOpen = false;
      });
    }
  }

  // ==========================================================================
  // 9. INTERACTIVE SIMULATORS (OCR Ticket Scanner & YOD Niche Wizard)
  // ==========================================================================
  function initInteractiveSimulators() {
    // OCR Ticket Scanner Simulator (Luna Comercial Page)
    const btnSimulateOcr = document.getElementById('btn-simulate-ocr');
    const ocrLedgerBody = document.getElementById('ocr-live-ledger-body');
    if (btnSimulateOcr && ocrLedgerBody) {
      btnSimulateOcr.addEventListener('click', () => {
        btnSimulateOcr.textContent = '⚡ Escaneando Factura con IA...';
        btnSimulateOcr.disabled = true;

        setTimeout(() => {
          const sampleSkus = ['PACK_PRO_ANUAL', 'REEL_TEMPLATE_V3', 'CONSULTING_HOUR', 'MASTER_LICENSE'];
          const sampleChannels = ['WhatsApp Business', 'MercadoLibre Pro', 'Shopify Store', 'POS Directo'];
          const randomSku = sampleSkus[Math.floor(Math.random() * sampleSkus.length)];
          const randomChannel = sampleChannels[Math.floor(Math.random() * sampleChannels.length)];
          const randomAmount = (Math.random() * 800 + 150).toFixed(2);
          
          const newRow = document.createElement('tr');
          newRow.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
          newRow.style.color = '#e2e8f0';
          newRow.innerHTML = `
            <td style="padding: 14px;"><span style="color: #38bdf8;">auto_ocr_${Date.now().toString().slice(-4)}</span></td>
            <td>Video 9:16 (Reels)</td>
            <td>${randomChannel}</td>
            <td><strong>1 orden</strong></td>
            <td><strong style="color: #30d158;">$${randomAmount}</strong></td>
            <td><span style="color: #fef08a; background: rgba(212,175,55,0.15); padding: 2px 6px; border-radius: 4px;">+1,120%</span></td>
            <td><span style="color: #30d158;">● Verificado OCR</span></td>
          `;
          ocrLedgerBody.prepend(newRow);
          
          btnSimulateOcr.textContent = '✅ ¡Factura Procesada y Registrada!';
          setTimeout(() => {
            btnSimulateOcr.textContent = '📸 Simular Foto de Factura / Ticket OCR';
            btnSimulateOcr.disabled = false;
          }, 2000);
        }, 800);
      });
    }

    // YOD Niche Diagnostic Simulator (Branding Method Page)
    const btnRunDiagnostic = document.getElementById('btn-run-yod-diagnostic');
    const diagnosticOutput = document.getElementById('yod-diagnostic-output');
    if (btnRunDiagnostic && diagnosticOutput) {
      btnRunDiagnostic.addEventListener('click', () => {
        btnRunDiagnostic.textContent = '⚡ Procesando Tesis de Nicho con YOD...';
        btnRunDiagnostic.disabled = true;

        setTimeout(() => {
          diagnosticOutput.style.display = 'block';
          diagnosticOutput.scrollIntoView({ behavior: 'smooth' });
          btnRunDiagnostic.textContent = '✅ Diagnóstico Generado con Éxito';
          setTimeout(() => {
            btnRunDiagnostic.textContent = '🧭 Ejecutar Diagnóstico Estratégico YOD';
            btnRunDiagnostic.disabled = false;
          }, 2500);
        }, 1000);
      });
    }
  }

  // ==========================================================================
  // 10. INITIALIZE ON DOM READY
  // ==========================================================================
  function startEngine() {
    initPreloader();
    initParticleBrain();
    initMouseSpotlight();
    initArchitectWidget();
    initControlCenter();
    initInteractiveSimulators();

    document.querySelectorAll('.format-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const formatId = btn.getAttribute('data-format');
        if (formatId) window.appState.activeFormat = formatId;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEngine);
  } else {
    startEngine();
  }

})();

// Global Interactive Card Expand Handler
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.card-expand-btn');
  if (btn) {
    const card = btn.closest('.spotlight-card, .highlight-card, .bento-card, .bento-box, [style*="position: relative"], details');
    if (card) {
      const drawer = card.querySelector('.card-deepdive-drawer');
      if (drawer) {
        const isOpen = drawer.classList.toggle('open');
        btn.classList.toggle('active', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
      }
    }
  }
});
