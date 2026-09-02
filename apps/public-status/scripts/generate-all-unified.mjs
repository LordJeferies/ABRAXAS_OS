import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const docsDir = path.join(rootDir, 'docs/abraxas-os-status');

function getRootPrefix(depth) {
  if (depth === 0) return '';
  return '../'.repeat(depth);
}

function getUniversalHeader(locale, activePage, depth = 0) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;
  const otherLocale = isEs ? 'en' : 'es';
  const switchLangHref = `${root}${otherLocale}/index.html`;

  return `
  <!-- Film Grain Overlay (Principle 17) -->
  <div class="film-grain-overlay"></div>

  <!-- Master Sticky Localnav (Principle 26) -->
  <nav class="apple-localnav" aria-label="Local Navigation">
    <div class="localnav-inner">
      <a href="${root}index.html" class="localnav-brand">
        <span>ABRAXAS OS</span>
        <span class="tag">v3.0 PRO</span>
      </a>
      <div class="localnav-items">
        <a href="${root}index.html" class="localnav-a ${activePage === 'home' ? 'active' : ''}">${isEs ? 'Inicio' : 'Home'}</a>
        <a href="${root}v3/index.html" class="localnav-a ${activePage === 'v3' ? 'active' : ''}">🍎 v3 MacBook Pro</a>
        <a href="${langPrefix}luna-comercial/index.html" class="localnav-a ${activePage === 'luna-comercial' ? 'active' : ''}" style="color: #30d158; font-weight: 700;">🌙 ${isEs ? 'Luna de Ventas & ROI' : 'Sales Moon & ROI'}</a>
        <a href="${langPrefix}branding-method/index.html" class="localnav-a ${activePage === 'branding-method' ? 'active' : ''}" style="color: #bf5af2;">🎯 ${isEs ? 'Branding YOD' : 'Branding YOD'}</a>
        <a href="${langPrefix}abraxas-core-example/index.html" class="localnav-a ${activePage === 'abraxas-core-example' ? 'active' : ''}" style="color: #d4af37;">💎 ${isEs ? 'Caso Core' : 'Core Case'}</a>
        <a href="${langPrefix}criterios-roadmap/index.html" class="localnav-a ${activePage === 'criterios-roadmap' ? 'active' : ''}">🗺️ ${isEs ? 'Roadmap' : 'Roadmap'}</a>
        <a href="${langPrefix}ecosistema/index.html" class="localnav-a ${activePage === 'ecosistema' ? 'active' : ''}">${isEs ? '⚡ Ecosistema 8-en-1' : '⚡ 8-in-1 Ecosystem'}</a>
        <a href="${langPrefix}gerencia/index.html" class="localnav-a ${activePage === 'gerencia' ? 'active' : ''}">${isEs ? '💼 Gerencia & ROI' : '💼 Governance & ROI'}</a>
        <a href="${langPrefix}flujo/index.html" class="localnav-a ${activePage === 'flujo' ? 'active' : ''}">${isEs ? '🔄 Ciclo de Vida' : '🔄 Lifecycle Flow'}</a>
        <a href="${langPrefix}tools/vav/motions/index.html" class="localnav-a ${activePage === 'motions' ? 'active' : ''}">🎬 Motions</a>
        <a href="${langPrefix}tools/vav/captions/index.html" class="localnav-a ${activePage === 'captions' ? 'active' : ''}">💬 Captions</a>
        <a href="${langPrefix}tools/vav/cuts/index.html" class="localnav-a ${activePage === 'cuts' ? 'active' : ''}">✂️ Cuts 18s</a>
        <a href="${langPrefix}tools/shim/index.html" class="localnav-a ${activePage === 'shim' ? 'active' : ''}">🔍 SHIM (0% GAPs)</a>
        <a href="${langPrefix}tools/arquitecto/index.html" class="localnav-a ${activePage === 'arquitecto' ? 'active' : ''}">👁️ Arquitecto</a>
        <a href="${langPrefix}canon/index.html" class="localnav-a ${activePage === 'canon' ? 'active' : ''}" style="color: #d4af37;">📚 Canon 37 TXT</a>
        <a href="${langPrefix}backup/index.html" class="localnav-a ${activePage === 'backup' ? 'active' : ''}">🏛️ Backup</a>
      </div>
      <div class="localnav-right">
        <a href="${switchLangHref}" class="localnav-a" style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${isEs ? 'EN' : 'ES'}</a>
        <button id="btn-open-control-center" class="btn-control-center">
          <span>🌳 Árbol / Menú</span>
        </button>
        <a href="${root}index.html" class="btn-apple-cta">${isEs ? 'Abrir Sistema' : 'Launch OS'}</a>
      </div>
    </div>
  </nav>
  `;
}

function getInternalQuickMenu(items) {
  return `
  <div style="background: rgba(14, 14, 20, 0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 10px 1.5rem; position: sticky; top: 52px; z-index: 999; overflow-x: auto; scrollbar-width: none;">
    <div style="max-width: 1280px; margin: 0 auto; display: flex; gap: 8px; align-items: center; white-space: nowrap;">
      <span style="font-size: 0.75rem; font-family: var(--font-mono); color: #d4af37; font-weight: 800; margin-right: 6px;">IR A:</span>
      ${items.map(item => `<a href="${item.href}" class="btn-control-center" style="font-size: 0.76rem; padding: 4px 12px; background: rgba(255,255,255,0.06);">${item.label}</a>`).join('')}
    </div>
  </div>
  `;
}

function getUniversalWidgets(locale, depth = 0) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;

  return `
  <!-- Contextual Floating Arquitecto Widget (Principle 30) -->
  <div id="floating-architect-widget">
    <div id="architect-popup-card" class="architect-popup-card">
      <div class="popup-header">
        <span class="popup-title">👁️ ARQUITECTO // COACH & ASISTENTE</span>
        <button id="architect-popup-close" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem;">✕</button>
      </div>
      <p class="popup-body">
        ${isEs 
          ? '«ABRAXAS convierte criterio en infraestructura.» Recuerda: un tema no es una idea. Abre una deuda narrativa con tu hook y págala exactamente con el payoff.' 
          : '«ABRAXAS turns criterion into infrastructure.» A topic is not an idea. Open a narrative debt with your hook and pay it with your payoff.'}
      </p>
      <button id="btn-copy-prompt" class="btn-copy-prompt">
        📋 ${isEs ? 'Preparar pregunta para IA' : 'Copy Optimized AI Prompt'}
      </button>
    </div>
    
    <div id="architect-pill-trigger" class="architect-pill-trigger">
      <span class="architect-sparkle">✦</span>
      <span class="architect-pill-text">Arquitecto Coach</span>
    </div>
  </div>

  <!-- Dashboard Control Center Drawer (Principle 26) -->
  <div id="control-center-drawer">
    <div class="drawer-header-row">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.2rem; color: #d4af37;">▲</span>
        <h3 style="font-size: 1.1rem; color: #fff; font-weight: 700;">Panel de Control Central</h3>
      </div>
      <button id="btn-close-control-center" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.2rem;">✕</button>
    </div>

    <div class="drawer-nav-grid">
      <a href="${root}index.html" class="drawer-nav-btn">🏠 <span>Visión General (Home)</span></a>
      <a href="${root}v3/index.html" class="drawer-nav-btn">🍎 <span>Edición Oficial v3 MacBook Pro</span></a>
      <a href="${langPrefix}ecosistema/index.html" class="drawer-nav-btn">⚡ <span>Ecosistema 8-en-1</span></a>
      <a href="${langPrefix}gerencia/index.html" class="drawer-nav-btn">💼 <span>Gobernanza & ROI</span></a>
      <a href="${langPrefix}flujo/index.html" class="drawer-nav-btn">🔄 <span>Ciclo de Vida (6 Fases)</span></a>
      <a href="${langPrefix}tools/vav/motions/index.html" class="drawer-nav-btn">🎬 <span>13 Familias de Motion</span></a>
      <a href="${langPrefix}tools/vav/captions/index.html" class="drawer-nav-btn">💬 <span>Subtítulos Cinéticos Whisper</span></a>
      <a href="${langPrefix}tools/vav/cuts/index.html" class="drawer-nav-btn">✂️ <span>Cortes en 18s & RMS</span></a>
      <a href="${langPrefix}tools/shim/index.html" class="drawer-nav-btn">🔍 <span>Metrología SHIM 0.00% GAPs</span></a>
      <a href="${langPrefix}tools/arquitecto/index.html" class="drawer-nav-btn">👁️ <span>ARQUITECTO (Coach & Asistente)</span></a>
      <a href="${langPrefix}canon/index.html" class="drawer-nav-btn" style="border-color: rgba(212,175,55,0.4);">📚 <span>Biblioteca Canon 37 TXT</span></a>
      <a href="${langPrefix}backup/index.html" class="drawer-nav-btn">🏛️ <span>Respaldo / Backup Completo</span></a>
    </div>

    <div style="margin-top: 2.5rem; padding: 18px; background: rgba(212,175,55,0.08); border-radius: 14px; border: 1px solid rgba(212,175,55,0.25);">
      <span style="font-size: 0.72rem; font-family: var(--font-mono); color: #d4af37; font-weight: 800;">LÍNEA BASE CERTIFICADA</span>
      <p style="font-size: 0.82rem; color: #cbd5e1; margin-top: 4px;">SHA-256: <code>91234741f0b3a1ac5bd7e4c0556fafa868d00769</code></p>
    </div>
  </div>
  `;
}

function getUniversalFooter(locale, depth = 0) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;

  return `
  <footer style="background: #050508; border-top: 1px solid rgba(255,255,255,0.08); padding: 5rem 1.5rem 3rem 1.5rem; font-size: 0.85rem; color: #86868b;">
    <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; margin-bottom: 3.5rem;">
      <div>
        <h4 style="color: #fff; font-size: 0.92rem; margin-bottom: 1rem;">${isEs ? 'Herramientas de Síntesis' : 'Synthesis Tools'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${langPrefix}tools/vav/motions/index.html">${isEs ? '13 Familias de Motion' : '13 Motion Families'}</a></li>
          <li><a href="${langPrefix}tools/vav/captions/index.html">${isEs ? 'Subtítulos Cinéticos' : 'Kinetic Captions'}</a></li>
          <li><a href="${langPrefix}tools/vav/cuts/index.html">${isEs ? 'Cortes en 18s' : '18s Auto-Cuts'}</a></li>
          <li><a href="${langPrefix}tools/shim/index.html">${isEs ? 'Metrología 0.00% GAPs' : '0.00% GAP Metrology'}</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: #fff; font-size: 0.92rem; margin-bottom: 1rem;">${isEs ? 'Inteligencia & Orquestación' : 'Intelligence'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${langPrefix}tools/arquitecto/index.html">${isEs ? 'ARQUITECTO Coach' : 'ARQUITECTO Coach'}</a></li>
          <li><a href="${langPrefix}tools/yod/index.html">${isEs ? 'YOD (Radar de Nicho)' : 'YOD Intelligence'}</a></li>
          <li><a href="${langPrefix}tools/contenido/index.html">${isEs ? 'CONTENIDO (Merkle-DAG)' : 'CONTENIDO Merkle-DAG'}</a></li>
          <li><a href="${langPrefix}tools/he/index.html">${isEs ? 'HE (Despacho de 50 Lotes)' : 'HE Batch Operations'}</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: #fff; font-size: 0.92rem; margin-bottom: 1rem;">${isEs ? 'Gobernanza & Documentación' : 'Governance & Docs'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${langPrefix}mapa-sistema/index.html" style="color: #fef08a; font-weight: 700;">🗺️ ${isEs ? 'Árbol & Mapa Total (Raíces)' : 'Master Tree & Atlas'}</a></li>
            <li><a href="${langPrefix}flujo/index.html">${isEs ? 'Ciclo de Vida de 6 Fases' : '6-Phase Lifecycle'}</a></li>
          <li><a href="${langPrefix}gerencia/index.html">${isEs ? 'Control de Costos SQLite' : 'SQLite Cost Governance'}</a></li>
          <li><a href="${langPrefix}canon/index.html">${isEs ? 'Biblioteca Canon 37 TXT' : 'Canon 37 TXT Library'}</a></li>
          <li><a href="${langPrefix}backup/index.html">${isEs ? 'Versión Backup de Respaldo' : 'Legacy Backup Snapshot'}</a></li>
        </ul>
      </div>
    </div>
    <div style="max-width: 1240px; margin: 0 auto; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <p>Copyright © 2026 ABRAXAS OS. ${isEs ? 'Todos los derechos reservados. Arquitectura Determinista en Apple Silicon.' : 'All rights reserved. Deterministic Architecture on Apple Silicon.'}</p>
      <p style="font-family: var(--font-mono); color: #d4af37; font-size: 0.78rem;">SHA-256: <code>91234741f0b3a1ac5bd7e4c0556fafa868d00769</code></p>
    </div>
  </footer>
  `;
}

// 1. GENERATE ECOSISTEMA PAGE (/es/ecosistema/index.html)
function generateEcosistemaPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'ecosistema');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s', href: '#resumen' },
    { label: '🎬 Reels (9:16)', href: '#reels' },
    { label: '📑 Carruseles (4:5)', href: '#carousels' },
    { label: '🧵 Hilos X', href: '#threads' },
    { label: '✉️ Newsletters', href: '#newsletters' },
    { label: '🎙️ Podcasts', href: '#podcasts' },
    { label: '📺 YouTube (16:9)', href: '#youtube' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Ecosistema de Contenidos 8-en-1 — ABRAXAS OS' : '8-in-1 Content Ecosystem — ABRAXAS OS'}</title>
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'ecosistema', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag">BERI'AH CREATION // MERKLE-DAG MULTIPLICATION</span>
      <h1 class="h2">${isEs ? 'El Ecosistema 8-en-1.<br/>Una Sola Semilla. Ocho Formatos Vivos.' : 'The 8-in-1 Ecosystem.<br/>One Living Seed. Eight Formats.'}</h1>
      <p class="p">${isEs ? 'Descubre cómo una sola tesis de autoridad se transforma simultáneamente en videos cortos, carruseles, hilos, newsletters, podcasts y ensayos largos sin rehacer el trabajo a mano.' : 'Discover how one master thesis branches into 8 synchronized derivatives.'}</p>
    </div>

    <!-- Resumen Ejecutivo -->
    <div id="resumen" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button> style="background: rgba(212,175,55,0.08); border-color: rgba(212,175,55,0.35);">
        <span class="card-pill-tag gold">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 class="card-h3">${isEs ? '¿Por qué la Multiplicación 1 a 8 Multiplica tu Autoridad?' : 'Why 1-to-8 Multiplication Amplifies Authority?'}</h3>
        <p class="card-desc" style="color: #e2e8f0; font-size: 1rem;">
          ${isEs 
            ? 'La mayoría de creadores se queman intentando redactar por separado para cada red social. En ABRAXAS introduces una tesis central (YOD), y el motor Merkle-DAG genera automáticamente los 8 derivados adaptados al lenguaje nativo de cada plataforma.' 
            : 'Traditional creators burn out writing separately for each platform. In ABRAXAS, one master thesis branches deterministically into 8 native formats.'}
        </p>
      </div>
    </div>

    <!-- The 8 Formats Breakdown -->
    <div class="bento-grid">
      
      <div id="reels" class="spotlight-card col-6">
        <span class="card-pill-tag gold">01 // VIDEOS CORTOS (9:16)</span>
        <h3 class="card-h3">TikTok, Reels y YouTube Shorts</h3>
        <p class="card-desc">Auto-edición en 18s con eliminación de silencios, subtítulos cinéticos Whisper y 13 familias de motion.</p>
        <div class="card-aspect-media">
          <img src="${root}assets/plates/plate_05_vav_cathedral.webp" alt="Reels 9:16" loading="lazy" width="800" height="450">
        </div>
      </div>

      <div id="carousels" class="spotlight-card col-6">
        <span class="card-pill-tag cyan">02 // CARRUSELES (4:5)</span>
        <h3 class="card-h3">Instagram y LinkedIn PDF</h3>
        <p class="card-desc">Estructura editorial de 8 diapositivas con jerarquía visual de alto impacto y copy diseñado para guardados.</p>
        <div class="card-aspect-media">
          <img src="${root}assets/plates/plate_08_contenido_portal.webp" alt="Carousels 4:5" loading="lazy" width="800" height="450">
        </div>
      </div>

      <div id="threads" class="spotlight-card col-6">
        <span class="card-pill-tag iris">03 // HILOS DE AUTORIDAD</span>
        <h3 class="card-h3">X (Twitter) & LinkedIn Posts</h3>
        <p class="card-desc">Cadena de 7 tweets conectados aplicando dialéctica Tesis-Antítesis-Síntesis para máxima viralidad.</p>
        <div class="card-aspect-media">
          <img src="${root}assets/plates/plate_03_continuity_axis.webp" alt="Threads" loading="lazy" width="800" height="450">
        </div>
      </div>

      <div id="newsletters" class="spotlight-card col-6">
        <span class="card-pill-tag emerald">04 // NEWSLETTERS & EMAIL</span>
        <h3 class="card-h3">Substack, Beehiiv & Broadcasts</h3>
        <p class="card-desc">Ensayo profundo en Markdown con gancho de retención de correo y llamado a la acción comercial directo.</p>
        <div class="card-aspect-media">
          <img src="${root}assets/plates/plate_07_moon_loop.webp" alt="Newsletters" loading="lazy" width="800" height="450">
        </div>
      </div>

      <div id="podcasts" class="spotlight-card col-6">
        <span class="card-pill-tag gold">05 // AUDIO & PODCASTS</span>
        <h3 class="card-h3">Spotify & Apple Podcasts</h3>
        <p class="card-desc">Masterización a -14 LUFS con balance a 45Hz y micro-cortes para episodios impecables.</p>
        <div class="card-aspect-media">
          <img src="${root}assets/plates/plate_04_shim_metrology.webp" alt="Podcasts" loading="lazy" width="800" height="450">
        </div>
      </div>

      <div id="youtube" class="spotlight-card col-6">
        <span class="card-pill-tag cyan">06 // ENSAYOS LARGOS (16:9)</span>
        <h3 class="card-h3">YouTube Video Ensayos</h3>
        <p class="card-desc">Guiones estructurados en 4 tiempos con retención superior al 60% y capítulos automáticos.</p>
        <div class="card-aspect-media">
          <img src="${root}assets/plates/plate_10_master_monument.webp" alt="YouTube Long" loading="lazy" width="800" height="450">
        </div>
      </div>

    </div>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Unified Engine] Generated /${locale}/ecosistema/index.html`);
}

// 2. GENERATE GERENCIA PAGE (/es/gerencia/index.html)
function generateGerenciaPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'gerencia');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s', href: '#resumen' },
    { label: '📊 Telemetría SQLite', href: '#telemetria' },
    { label: '🛡️ Custodia de Marca', href: '#custodia' },
    { label: '👥 Apalancamiento 1=10', href: '#leverage' },
    { label: '🍎 Apple Silicon', href: '#silicon' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Alta Dirección & ROI — ABRAXAS OS' : 'Executive Governance & ROI — ABRAXAS OS'}</title>
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'gerencia', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #d4af37;">EXECUTIVE CONTROL // ROI & GOVERNANCE</span>
      <h1 class="h2">${isEs ? 'Control Total para Directores.<br/>Gobernanza Forense y Reducción de Costos.' : 'Total Executive Governance.<br/>Forensic Cost Telemetry.'}</h1>
      <p class="p">${isEs ? 'Cómo los directores ejecutivos y líderes de marketing reducen en un 90% el costo por pieza de contenido manteniendo control inmutable sobre el mensaje de marca.' : 'How executives reduce cost per content asset by 90% with zero brand drift.'}</p>
    </div>

    <!-- Resumen Ejecutivo -->
    <div id="resumen" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button> style="background: rgba(48,209,88,0.08); border-color: rgba(48,209,88,0.35);">
        <span class="card-pill-tag emerald">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 class="card-h3">${isEs ? 'El Retorno Financiero de ABRAXAS OS' : 'The Financial ROI of ABRAXAS OS'}</h3>
        <p class="card-desc" style="color: #e2e8f0; font-size: 1rem;">
          ${isEs 
            ? 'Una agencia tradicional cobra miles de dólares por producir 10 videos al mes con tiempos de entrega de 2 semanas. Con ABRAXAS, un solo operador interno produce 50 piezas multicanal en una sola tarde con costo computacional local de 0.00 USD.' 
            : 'Traditional agencies charge thousands for 10 videos. With ABRAXAS, one in-house operator exports 50 multi-channel assets in one afternoon.'}
        </p>
      </div>
    </div>

    <div class="bento-grid">
      
      <div id="telemetria" class="spotlight-card col-6">
        <span class="card-pill-tag gold">01 // TELEMETRÍA SQLITE LOCAL</span>
        <h3 class="card-h3">${isEs ? 'Métricas de Costo y Tiempos de Render' : 'SQLite Cost & Render Telemetry'}</h3>
        <p class="card-desc">${isEs ? 'Audita tiempos de síntesis, número de piezas despachadas y costo computacional por activo en milisegundos.' : 'Audit render times, dispatched asset counts, and exact compute cost per piece.'}</p>
        <div class="card-aspect-media">
          <img src="${root}assets/plates/plate_09_system_dashboard.webp" alt="Dashboard Telemetry" loading="lazy" width="800" height="450">
        </div>
      </div>

      <div id="custodia" class="spotlight-card col-6">
        <span class="card-pill-tag cyan">02 // CUSTODIA DE MARCA</span>
        <h3 class="card-h3">${isEs ? 'Protección de Tesis Inmutables' : 'Immutable Brand Axiom Custody'}</h3>
        <p class="card-desc">${isEs ? 'Los axiomas de tu empresa quedan sellados. La IA nunca inventará claims falsos ni violará las directrices corporativas.' : 'Your company core axioms are sealed. AI never hallucinates or breaches brand guidelines.'}</p>
        <div class="card-aspect-media">
          <img src="${root}assets/plates/plate_03_continuity_axis.webp" alt="Brand Custody" loading="lazy" width="800" height="450">
        </div>
      </div>

      <div id="leverage" class="spotlight-card col-6">
        <span class="card-pill-tag iris">03 // APALANCAMIENTO 1=10</span>
        <h3 class="card-h3">${isEs ? 'Un Operador Rinde como una Agencia Entera' : '1 Operator = 10-Person Agency'}</h3>
        <p class="card-desc">${isEs ? 'El módulo HE permite a un solo líder de marketing gobernar y aprobar 50 piezas en el tablero Kanban en 4 horas.' : 'The HE module empowers one person to govern and batch-approve 50 pieces in 4 hours.'}</p>
        <div class="card-aspect-media">
          <img src="${root}assets/plates/plate_02_he_macro.webp" alt="Team Leverage" loading="lazy" width="800" height="450">
        </div>
      </div>

      <div id="silicon" class="spotlight-card col-6">
        <span class="card-pill-tag emerald">04 // SOBERANÍA EN APPLE SILICON</span>
        <h3 class="card-h3">${isEs ? 'Privacidad Total y Cero Costos de Nube' : 'Total Privacy & Zero Cloud Bills'}</h3>
        <p class="card-desc">${isEs ? 'Todo se ejecuta en tu MacBook Pro con Whisper local y VideoToolbox. Tus datos no se envían a servidores de terceros.' : 'Runs locally on Apple Silicon with Whisper and VideoToolbox. Your confidential data never leaks.'}</p>
        <div class="card-aspect-media">
          <img src="${root}assets/plates/plate_04_shim_metrology.webp" alt="Apple Silicon" loading="lazy" width="800" height="450">
        </div>
      </div>

    </div>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Unified Engine] Generated /${locale}/gerencia/index.html`);
}

// 3. GENERATE CANON 37 TXT PAGE WITH IN-BROWSER READER (/es/canon/index.html)
function generateCanonPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'canon');
  fs.mkdirSync(targetDir, { recursive: true });

  const canonDir = path.join(rootDir, '00_START_HERE/CANON_37_TXT');
  let dossiers = [];
  try {
    const files = fs.readdirSync(canonDir).filter(f => f.endsWith('.txt')).sort();
    dossiers = files.map(file => {
      const fullPath = path.join(canonDir, file);
      const text = fs.readFileSync(fullPath, 'utf8');
      return { file, text, size: (fs.statSync(fullPath).size / 1024).toFixed(1) };
    });
  } catch (e) {
    dossiers = [];
  }

  const quickItems = [
    { label: '🔍 Buscar Dossier', href: '#canon-search-input' },
    { label: '📚 Los 37 Textos', href: '#dossier-list' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Biblioteca Canónica 37 TXT — ABRAXAS OS' : 'Canon 37 TXT Library — ABRAXAS OS'}</title>
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'canon', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #d4af37;">FOUNDATIONAL KNOWLEDGE // 37 CANONICAL TXT DOSSIERS</span>
      <h1 class="h2">${isEs ? 'La Biblioteca Canónica 37 TXT.' : 'The Canon 37 TXT Library.'}</h1>
      <p class="p">${isEs ? 'La base inmutable de conocimiento de ABRAXAS OS. Cada dossier contiene los axiomas, leyes ontológicas y reglas de ingeniería del sistema.' : 'The immutable knowledge foundation of ABRAXAS OS.'}</p>
    </div>

    <!-- Live Search Box -->
    <div style="max-width: 700px; margin: 0 auto 3rem auto;">
      <input type="text" id="canon-search-input" placeholder="🔍 ${isEs ? 'Buscar por palabra clave (ej. YOD, Metrología, Deuda, 18s)...' : 'Search by keyword...'}" style="width: 100%; background: #0c0c12; border: 1px solid var(--border-gold); color: #fff; padding: 14px 20px; border-radius: 980px; font-size: 0.95rem; outline: none;">
    </div>

    <!-- Dossier Accordion List -->
    <div id="dossier-list" style="display: flex; flex-direction: column; gap: 14px; max-width: 1100px; margin: 0 auto;">
      ${dossiers.map((d, i) => `
        <details class="spotlight-card dossier-card-item" style="padding: 1.25rem 1.75rem; border-radius: 18px; cursor: pointer;">
          <summary style="font-weight: 700; color: #fff; font-size: 1rem; display: flex; justify-content: space-between; align-items: center; list-style: none;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="color: #d4af37; font-family: var(--font-mono); font-size: 0.85rem;">📄 ${d.file}</span>
            </div>
            <span style="color: var(--color-cyan); font-size: 0.8rem; font-family: var(--font-mono);">+ VER TEXTO (${d.size} KB)</span>
          </summary>
          <div style="margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem;">
            <pre style="max-height: 420px; overflow-y: auto; background: #000; padding: 16px; border-radius: 10px; font-family: var(--font-mono); font-size: 0.82rem; color: #cbd5e1; line-height: 1.55; white-space: pre-wrap; border: 1px solid rgba(255,255,255,0.1);"><code>${d.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
          </div>
        </details>
      `).join('')}
    </div>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script>
    document.getElementById('canon-search-input')?.addEventListener('input', function(e) {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.dossier-card-item').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  </script>
  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Unified Engine] Generated /${locale}/canon/index.html`);
}

// 4. GENERATE BACKUP / RESUMEN SNAPSHOT PAGE (/es/backup/index.html)
function generateBackupPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'backup');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Respaldo Histórico de Seguridad — ABRAXAS OS' : 'Legacy Baseline Snapshot — ABRAXAS OS'}</title>
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'backup', depth)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #ff453a;">PERMANENT BACKUP // VERIFIED RC1 SNAPSHOT</span>
      <h1 class="h2">${isEs ? 'Respaldo Histórico Certificado.' : 'Certified Backup Snapshot.'}</h1>
      <p class="p">${isEs ? 'Instantánea inmutable de todas las especificaciones y contratos originales de ABRAXAS OS.' : 'Immutable snapshot of all baseline contracts.'}</p>
    </div>

    <div class="bento-grid">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button> style="background: rgba(255,69,58,0.06); border-color: rgba(255,69,58,0.35);">
        <span class="card-pill-tag ruby">EVIDENCIA DE LÍNEA BASE</span>
        <h3 class="card-h3">Compromiso Criptográfico SHA-256</h3>
        <p class="card-desc">Todos los archivos fundacionales, pruebas unitarias y contratos de software están respaldados inmutablemente con el hash <code>91234741f0b3a1ac5bd7e4c0556fafa868d00769</code>.</p>
        <div style="margin-top: 1rem;">
          <a href="${root}index.html" class="btn-apple-cta">${isEs ? 'Volver a la Versión Activa' : 'Return to Active Site'}</a>
        </div>
      </div>
    </div>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Unified Engine] Generated /${locale}/backup/index.html`);
}

function compileAll() {
  ['es', 'en'].forEach(locale => {
    generateEcosistemaPage(locale);
    generateGerenciaPage(locale);
    generateCanonPage(locale);
    generateBackupPage(locale);
  });
  console.log('✨ [Unified Engine] All ecosystem, governance, canon, and backup subpages generated successfully!');
}

compileAll();
