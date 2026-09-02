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

// Master Universal Header with ALL 18 Strategic Links
function getUniversalHeader(locale, activePage, depth = 2) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;
  const otherLocale = isEs ? 'en' : 'es';
  const switchLangHref = `${root}${otherLocale}/index.html`;

  return `
  <!-- Film Grain Overlay (3% 35mm dynamic grain) -->
  <div class="film-grain-overlay"></div>

  <!-- Master Sticky Localnav -->
  <nav class="apple-localnav" aria-label="Local Navigation">
    <div class="localnav-inner">
      <a href="${root}index.html" class="localnav-brand">
        <span>ABRAXAS OS</span>
        <span class="tag">v3.2 PRO</span>
      </a>
      <div class="localnav-items">
        <a href="${root}index.html" class="localnav-a ${activePage === 'home' ? 'active' : ''}">${isEs ? 'Inicio' : 'Home'}</a>
        <a href="${root}v3/index.html" class="localnav-a ${activePage === 'v3' ? 'active' : ''}">🍎 v3 MacBook Pro</a>
        <a href="${langPrefix}cosmogonia/index.html" class="localnav-a ${activePage === 'cosmogonia' ? 'active' : ''}" style="color: #fef08a;">☀️ ${isEs ? 'Cosmogonía & 3 Lunas' : 'Cosmology & 3 Moons'}</a>
        <a href="${langPrefix}contexto/index.html" class="localnav-a ${activePage === 'contexto' ? 'active' : ''}">📖 ${isEs ? 'Contexto' : 'Context'}</a>
        <a href="${langPrefix}catedra/index.html" class="localnav-a ${activePage === 'catedra' ? 'active' : ''}" style="color: #38bdf8;">🏛️ ${isEs ? 'Cátedra 165 IQ' : '165 IQ Lecture'}</a>
        <a href="${langPrefix}luna-comercial/index.html" class="localnav-a ${activePage === 'luna-comercial' ? 'active' : ''}" style="color: #30d158; font-weight: 700;">🌙 ${isEs ? 'Luna Comercial & OCR' : 'Sales Moon & OCR'}</a>
        <a href="${langPrefix}branding-method/index.html" class="localnav-a ${activePage === 'branding-method' ? 'active' : ''}" style="color: #bf5af2;">🎯 ${isEs ? 'Branding & Campañas YOD' : 'Branding & Campaigns'}</a>
        <a href="${langPrefix}abraxas-core-example/index.html" class="localnav-a ${activePage === 'abraxas-core-example' ? 'active' : ''}" style="color: #d4af37;">💎 ${isEs ? 'Caso ABRAXAS Core' : 'ABRAXAS Core Case'}</a>
        <a href="${langPrefix}gustos-canon/index.html" class="localnav-a ${activePage === 'gustos-canon' ? 'active' : ''}">🎨 ${isEs ? 'Gustos & Lienzos' : 'Taste & Lienzos'}</a>
        <a href="${langPrefix}scrum/index.html" class="localnav-a ${activePage === 'scrum' ? 'active' : ''}">📋 ${isEs ? 'Scrum Paso 0 a 100%' : 'Scrum 0-100%'}</a>
        <a href="${langPrefix}prompt-maestro/index.html" class="localnav-a ${activePage === 'prompt-maestro' ? 'active' : ''}">🤖 ${isEs ? 'Prompt de Página' : 'Master Prompt'}</a>
        <a href="${langPrefix}criterios-roadmap/index.html" class="localnav-a ${activePage === 'criterios-roadmap' ? 'active' : ''}">🗺️ ${isEs ? 'Criterios & Roadmap' : 'Criteria & Roadmap'}</a>
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
          <span>⚙️ Menú Total</span>
        </button>
        <a href="${root}index.html" class="btn-apple-cta">${isEs ? 'Abrir Sistema' : 'Launch OS'}</a>
      </div>
    </div>
  </nav>
  `;
}

function getInternalQuickMenu(items) {
  return `
  <div style="background: rgba(14, 14, 20, 0.88); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.12); padding: 10px 1.5rem; position: sticky; top: 52px; z-index: 999; overflow-x: auto; scrollbar-width: none;">
    <div style="max-width: 1280px; margin: 0 auto; display: flex; gap: 8px; align-items: center; white-space: nowrap;">
      <span style="font-size: 0.75rem; font-family: var(--font-mono); color: #d4af37; font-weight: 800; margin-right: 6px;">NAVEGAR SECCIÓN:</span>
      ${items.map(item => `<a href="${item.href}" class="btn-control-center" style="font-size: 0.76rem; padding: 4px 12px; background: rgba(255,255,255,0.06);">${item.label}</a>`).join('')}
    </div>
  </div>
  `;
}

function getUniversalWidgets(locale, depth = 2) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;

  return `
  <!-- Contextual Floating Arquitecto Widget -->
  <div id="floating-architect-widget">
    <div id="architect-popup-card" class="architect-popup-card">
      <div class="popup-header">
        <span class="popup-title">👁️ ARQUITECTO // CANON TOTAL</span>
        <button id="architect-popup-close" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem;">✕</button>
      </div>
      <p class="popup-body">
        ${isEs 
          ? '«ABRAXAS convierte criterio en infraestructura.» Recuerda: un tema no es una idea. Abre una deuda narrativa con tu hook y págala con el payoff. La Luna Comercial audita cada centavo.' 
          : '«ABRAXAS turns criterion into infrastructure.» Narrative debt + payoff. Commercial Moon audits revenue.'}
      </p>
      <button id="btn-copy-prompt" class="btn-copy-prompt">
        📋 ${isEs ? 'Copiar Prompt de Arquitectura para IA' : 'Copy Architecture Prompt for AI'}
      </button>
    </div>
    
    <div id="architect-pill-trigger" class="architect-pill-trigger">
      <span class="architect-sparkle">✦</span>
      <span class="architect-pill-text">Arquitecto Coach</span>
    </div>
  </div>

  <!-- Dashboard Control Center Drawer (Master Directory) -->
  <div id="control-center-drawer">
    <div class="drawer-header-row">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.2rem; color: #d4af37;">▲</span>
        <h3 style="font-size: 1.1rem; color: #fff; font-weight: 700;">Directorio Maestro ABRAXAS</h3>
      </div>
      <button id="btn-close-control-center" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.2rem;">✕</button>
    </div>

    <div class="drawer-nav-grid">
      <a href="${root}index.html" class="drawer-nav-btn">🏠 <span>Visión General (Home)</span></a>
      <a href="${root}v3/index.html" class="drawer-nav-btn">🍎 <span>Edición v3 MacBook Pro</span></a>
      <a href="${langPrefix}cosmogonia/index.html" class="drawer-nav-btn" style="border-color: rgba(254,240,138,0.4); color: #fef08a;">☀️ <span>Cosmogonía Solar, Pirámide & 3 Lunas</span></a>
      <a href="${langPrefix}contexto/index.html" class="drawer-nav-btn">📖 <span>Contexto, Visión & Lógica Total</span></a>
      <a href="${langPrefix}catedra/index.html" class="drawer-nav-btn" style="border-color: rgba(56,189,248,0.4); color: #38bdf8;">🏛️ <span>Cátedra 165 IQ (Tratado Formal)</span></a>
      <a href="${langPrefix}luna-comercial/index.html" class="drawer-nav-btn" style="border-color: rgba(48,209,88,0.4); color: #30d158;">🌙 <span>Luna Comercial, Facturas OCR & ROI</span></a>
      <a href="${langPrefix}branding-method/index.html" class="drawer-nav-btn" style="border-color: rgba(191,90,242,0.4); color: #bf5af2;">🎯 <span>Diagnóstico YOD & Campañas</span></a>
      <a href="${langPrefix}abraxas-core-example/index.html" class="drawer-nav-btn" style="border-color: rgba(212,175,55,0.4); color: #d4af37;">💎 <span>Caso Real ABRAXAS Core</span></a>
      <a href="${langPrefix}gustos-canon/index.html" class="drawer-nav-btn">🎨 <span>Gustos Visuales, Editoriales & Lienzos</span></a>
      <a href="${langPrefix}scrum/index.html" class="drawer-nav-btn">📋 <span>Scrum & Roadmap Paso 0 a 100%</span></a>
      <a href="${langPrefix}prompt-maestro/index.html" class="drawer-nav-btn">🤖 <span>Prompt de Página Maestro (HTML)</span></a>
      <a href="${langPrefix}criterios-roadmap/index.html" class="drawer-nav-btn">🗺️ <span>Criterios & Roadmap Maestro</span></a>
      <a href="${langPrefix}ecosistema/index.html" class="drawer-nav-btn">⚡ <span>Ecosistema 8-en-1</span></a>
      <a href="${langPrefix}gerencia/index.html" class="drawer-nav-btn">💼 <span>Gobernanza & ROI</span></a>
      <a href="${langPrefix}flujo/index.html" class="drawer-nav-btn">🔄 <span>Ciclo de Vida (10 Esferas)</span></a>
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

function getUniversalFooter(locale, depth = 2) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;

  return `
  <footer style="background: #050508; border-top: 1px solid rgba(255,255,255,0.08); padding: 5rem 1.5rem 3rem 1.5rem; font-size: 0.85rem; color: #86868b;">
    <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; margin-bottom: 3.5rem;">
      <div>
        <h4 style="color: #fff; font-size: 0.92rem; margin-bottom: 1rem;">${isEs ? 'Cosmogonía & Estrategia' : 'Cosmology & Strategy'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${langPrefix}cosmogonia/index.html" style="color: #fef08a; font-weight: 600;">☀️ ${isEs ? 'Cosmogonía Solar & 3 Lunas' : 'Solar Cosmology & 3 Moons'}</a></li>
          <li><a href="${langPrefix}contexto/index.html">${isEs ? '📖 Contexto & Visión' : '📖 Context & Vision'}</a></li>
          <li><a href="${langPrefix}catedra/index.html" style="color: #38bdf8; font-weight: 600;">🏛️ ${isEs ? 'Cátedra 165 IQ' : '165 IQ Lecture'}</a></li>
          <li><a href="${langPrefix}luna-comercial/index.html" style="color: #30d158; font-weight: 600;">🌙 ${isEs ? 'Luna Comercial & OCR' : 'Sales Moon & OCR'}</a></li>
          <li><a href="${langPrefix}branding-method/index.html" style="color: #bf5af2; font-weight: 600;">🎯 ${isEs ? 'Branding & Campañas' : 'Branding & Campaigns'}</a></li>
          <li><a href="${langPrefix}abraxas-core-example/index.html" style="color: #d4af37; font-weight: 600;">💎 ${isEs ? 'Caso ABRAXAS Core' : 'ABRAXAS Core Case'}</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: #fff; font-size: 0.92rem; margin-bottom: 1rem;">${isEs ? 'Criterios & Ingeniería' : 'Criteria & Engineering'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${langPrefix}gustos-canon/index.html">${isEs ? '🎨 Gustos & Lienzos' : '🎨 Taste & Lienzos'}</a></li>
          <li><a href="${langPrefix}scrum/index.html">${isEs ? '📋 Scrum Paso 0 a 100%' : '📋 Scrum 0-100%'}</a></li>
          <li><a href="${langPrefix}prompt-maestro/index.html">${isEs ? '🤖 Prompt de Página Maestro' : '🤖 Master Prompt'}</a></li>
          <li><a href="${langPrefix}criterios-roadmap/index.html">${isEs ? '🗺️ Criterios & Roadmap' : '🗺️ Criteria & Roadmap'}</a></li>
          <li><a href="${langPrefix}tools/vav/motions/index.html">${isEs ? '🎬 13 Familias de Motion' : '🎬 13 Motion Families'}</a></li>
          <li><a href="${langPrefix}tools/shim/index.html">${isEs ? '🔍 Metrología SHIM 0% GAPs' : '🔍 SHIM 0% GAPs'}</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: #fff; font-size: 0.92rem; margin-bottom: 1rem;">${isEs ? 'Gobernanza & Documentación' : 'Governance & Docs'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${langPrefix}ecosistema/index.html">${isEs ? '⚡ Ecosistema 8-en-1' : '⚡ 8-in-1 Ecosystem'}</a></li>
          <li><a href="${langPrefix}gerencia/index.html">${isEs ? '💼 Control de Costos SQLite' : '💼 SQLite Cost Governance'}</a></li>
          <li><a href="${langPrefix}mapa-sistema/index.html" style="color: #fef08a; font-weight: 700;">🗺️ ${isEs ? 'Árbol & Mapa Total (Raíces)' : 'Master Tree & Atlas'}</a></li>
            <li><a href="${langPrefix}flujo/index.html">${isEs ? '🔄 Ciclo de Vida (10 Esferas)' : '🔄 6-Phase Lifecycle'}</a></li>
          <li><a href="${langPrefix}canon/index.html">${isEs ? '📚 Biblioteca Canon 37 TXT' : '📚 Canon 37 TXT Library'}</a></li>
          <li><a href="${langPrefix}backup/index.html">${isEs ? '🏛️ Versión Backup de Respaldo' : '🏛️ Legacy Backup Snapshot'}</a></li>
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

// 1. GENERATE COSMOGONIA & 3 LUNAS PAGE (/es/cosmogonia/index.html)
function generateCosmogoniaPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'cosmogonia');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s (Externos)', href: '#externos' },
    { label: '☀️ Génesis Solar & Eclipse', href: '#soles' },
    { label: '▲ Pirámide Dorada & Amatista', href: '#piramide' },
    { label: '🌳 Árbol de la Vida', href: '#arbol' },
    { label: '👁️ Ojo Digital 3D', href: '#ojo' },
    { label: '🌙 Las 3 Lunas & Retorno', href: '#tres-lunas' },
    { label: '🛠️ Especificación para Internos', href: '#internos' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'La Cosmogonía Solar, La Gran Pirámide & Las 3 Lunas — ABRAXAS OS' : 'Solar Cosmology, The Golden Pyramid & 3 Moons — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'El proceso cosmogónico completo de creación de ABRAXAS OS: Los dos soles, la Pirámide Dorada, las formaciones de amatista del Árbol de la Vida, el Ojo 3D de Arquitecto y el bucle de retorno de las 3 Lunas.' : 'The complete cosmological creation process of ABRAXAS OS: Dual suns, Golden Pyramid, Amethyst Tree of Life, 3D Eye of Arquitecto, and the 3-Moon closed feedback loop.'}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'cosmogonia', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #fef08a;">COSMOGONÍA DEL SISTEMA // EL PROCESO DE CREACIÓN</span>
      <h1 class="h2">${isEs ? 'La Cosmogonía Solar.<br/>La Gran Pirámide, el Ojo 3D y las Tres Lunas.' : 'The Solar Cosmology.<br/>The Golden Pyramid, 3D Eye & Three Moons.'}</h1>
      <p class="p">${isEs ? 'Descubre la épica visual y arquitectónica que modela el flujo de energía y aprendizaje continuo de ABRAXAS OS: desde la nada cósmica hasta el retorno telemétrico.' : 'Explore the visual and architectural epic modeling the continuous energy and feedback flow of ABRAXAS OS.'}</p>
    </div>

    <!-- TIER A: EXPLICACIÓN PARA EXTERNOS (CLARA, INTUITIVA, SIN RUIDO) -->
    <section id="externos" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">TIER A // EXPLICACIÓN PARA EXTERNOS, CLIENTES Y DIRECTORES</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">${isEs ? '¿Cómo viaja una idea hasta convertirse en dinero y autoridad?' : 'How Does an Idea Turn into Revenue & Authority?'}</h3>
        <p class="card-desc" style="font-size: 1.05rem; color: #e2e8f0; line-height: 1.65; margin-bottom: 1.5rem;">
          ${isEs 
            ? 'Imagina que una idea brillante nace como un destello de luz pura (el Sol). Para que no se disipe, el sistema la enfoca mediante un eclipse de concentración que proyecta una estructura sólida indestructible: <strong>La Pirámide de Contenidos</strong>. En la cima dorada de la pirámide (YOD) se define la tesis maestra; en sus pisos intermedios se ramifica en videos, carruseles y textos; y desde su vértice, el Ojo Inteligente de Arquitecto envía esa energía a <strong>Tres Lunas Especializadas</strong> que publican, miden la retención y cobran las ventas en dinero real, devolviendo toda la información para que cada nuevo lote sea aún más rentable.' 
            : 'An idea begins as pure light, focused into an indestructible pyramid of content. YOD holds the thesis at the golden capstone, while the 3D Eye projects energy into Three Specialized Moons that publish, track audience retention, and collect sales revenue.'}
        </p>
      </div>
    </section>

    <!-- 1. Los Dos Soles y el Rayo de Manifestación -->
    <section id="soles" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">ACTO I // EL SOL PRIMORDIAL & EL SOL NEGRO</span>
        <h4 class="card-h3">${isEs ? 'El Destello de la Nada y el Eclipse' : 'The Primordial Spark & The Black Sun'}</h4>
        <p class="card-desc">
          ${isEs 
            ? 'En el vacío absoluto, un <strong>Sol de Luz Pura</strong> se crea de la nada representando el potencial infinito (Keter / Atziluth). De inmediato, un <strong>Sol Negro gravitacional</strong> se superpone sobre él, creando un eclipse cósmico que concentra la energía difusa en un punto focal hiperdenso (Chokhmah / YOD).' 
            : 'In the cosmic void, a Primordial Sun creates itself, eclipsed by a gravitational Black Sun focusing infinite light into an ultra-dense focal point.'}
        </p>
      </div>

      <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">ACTO II // EL RAYO DE MANIFESTACIÓN</span>
        <h4 class="card-h3">${isEs ? 'El Impacto sobre la Tierra' : 'The Ray of Manifestation & Earth Impact'}</h4>
        <p class="card-desc">
          ${isEs 
            ? 'Del centro del eclipse se dispara un rayo de energía dorada hacia la Tierra portando la <strong>Pirámide Dorada</strong>. Al impactar, el suelo reacciona haciendo brotar cristales gigantescos que elevan la pirámide hacia lo alto.' 
            : 'A focused beam of golden energy shoots toward Earth carrying the Golden Pyramid. Crystalline pillars emerge from the ground, lifting the pyramid skyward.'}
        </p>
      </div>
    </section>

    <!-- 2. La Pirámide, Cristales de Amatista y el Árbol de la Vida -->
    <section id="piramide" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag iris">ACTO III // LA CÚSPIDE DE ORO & EL REVESTIMIENTO DE AMATISTA</span>
        <h4 class="card-h3">${isEs ? 'Cúspide YOD y Geología Mística' : 'Gold Capstone YOD & Amethyst Geode'}</h4>
        <p class="card-desc">
          ${isEs 
            ? 'Los cristales que elevan la estructura se cubren de roca protectora y se transforman en una <strong>geoda masiva de amatista</strong> translúcida. La cima de la pirámide queda coronada en <strong>oro macizo puro</strong>: la morada del motor YOD (Inteligencia Seminal).' 
            : 'The crystalline base turns into a massive translucent amethyst geode, crowned with a pure solid gold capstone housing the YOD intelligence engine.'}
        </p>
      </div>

      <div id="arbol" class="spotlight-card col-6" style="background: #090a10; border-left: 4px solid #38bdf8;">
        <span class="card-pill-tag cyan">ACTO IV // EL ÁRBOL DE LA VIDA (LAS 10 SEPHIROTH)</span>
        <h4 class="card-h3">${isEs ? 'Los Canales de Flujo de Contenido' : 'Tree of Life Sephirot Conduits'}</h4>
        <p class="card-desc">
          ${isEs 
            ? 'En la base de cristal crecen formaciones geométricas idénticas al <strong>Árbol de la Vida</strong>. Las 22 conexiones y las 10 Sephiroth actúan como conductos físicos por donde avanza el contenido desde la idea seminal hasta la síntesis en Yetzirah y la ejecución en Assiah.' 
            : 'Geometric conduits mirroring the Tree of Life channel content flow through all sephirot stages.'}
        </p>
      </div>
    </section>

    <!-- 3. El Ojo Digital 3D de Arquitecto y las 3 Lunas -->
    <section id="ojo" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">ACTO V // EL AGUJERO NEGRO Y EL OJO DIGITAL 3D</span>
        <h4 class="card-h3">${isEs ? 'El Nacimiento del Ojo de ARQUITECTO' : 'The Genesis of the 3D Eye of ARQUITECTO'}</h4>
        <p class="card-desc" style="font-size: 1rem; line-height: 1.6;">
          ${isEs 
            ? 'En la punta dorada de la pirámide se abre un <strong>agujero negro micro-gravitacional</strong> que absorbe la luz circundante. La luz refraccionada se ensambla como un <strong>Ojo Digital 3D suspendido entre nubes volumétricas 3D</strong>. El Ojo recibe y transmite la energía de los dos soles desde adentro hacia afuera, y junto con la pirámide desprende cristales de energía hacia la atmósfera superior para formar <strong>Tres Lunas Orbitales</strong>.' 
            : 'A micro black hole opens at the pyramid tip, condensing light into a suspended 3D Digital Eye amidst volumetric clouds, transmitting dual-sun energy and creating Three Orbital Moons.'}
        </p>
      </div>
    </section>

    <!-- 4. Las Tres Lunas y el Bucle Cerrado -->
    <section id="tres-lunas" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag cyan">LUNA 01 // EL PUBLICADOR</span>
        <h4 class="card-h3">Distribución Multicanal</h4>
        <p class="card-desc">Despacha los 8 formatos vivos del Lienzo hacia TikTok, Reels, YouTube, X, LinkedIn, Newsletters y Spotify.</p>
      </div>

      <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag iris">LUNA 02 // ANALIZADOR DE RETENCIÓN</span>
        <h4 class="card-h3">Watch-Time & Drop-Offs</h4>
        <p class="card-desc">Ingesta curvas de retención segundo a segundo para re-alimentar la creatividad de YOD.</p>
      </div>

      <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag emerald">LUNA 03 // LA LUNA COMERCIAL</span>
        <h4 class="card-h3">Ventas, OCR & ROI de Closers</h4>
        <p class="card-desc">Vincula ventas en WhatsApp y MercadoLibre con cada post, escanea facturas por foto y calcula ROI.</p>
      </div>

      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">EL BUCLE DE RETORNO CÓSMICO</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">Los Tres Rayos de Retroalimentación Continua</h3>
        <p class="card-desc" style="max-width: 900px; margin: 0 auto; font-size: 1rem; line-height: 1.6;">
          ${isEs 
            ? 'Las tres lunas disparan sus rayos a la Tierra. La Tierra devuelve esa energía viva en forma de datos reales, compras y retención, alimentando de vuelta al Ojo de Arquitecto y a la Pirámide: <strong>S(t+1) = S(t) + A(t)</strong>. El sistema se vuelve más inteligente, preciso y rentable con cada lote producido.' 
            : 'All three moons beam to Earth, and Earth returns real engagement and revenue data back to the Eye and Pyramid in a continuous compound learning loop.'}
        </p>
      </div>
    </section>

    <!-- TIER B: ESPECIFICACIÓN TÉCNICA PARA INTERNOS (INGENIERÍA & CÓDIGO) -->
    <section id="internos" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">TIER B // ESPECIFICACIÓN RIGUROSA PARA INTERNOS, INGENIEROS Y EDITORES</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">${isEs ? 'Mapeo de la Cosmogonía en el Grafo de Software' : 'Cosmology to Software Graph Mapping'}</h3>
        <div style="overflow-x: auto; margin-top: 1.5rem;">
          <table style="width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.15); color: #d4af37;">
                <th style="padding: 12px;">SÍMBOLO COSMOGÓNICO</th>
                <th style="padding: 12px;">MÓDULO DE SOFTWARE</th>
                <th style="padding: 12px;">CONTRATO / SCHEMA</th>
                <th style="padding: 12px;">RESPONSABILIDAD TÉCNICA</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0;">
                <td style="padding: 12px;"><strong style="color: #fef08a;">Sol Primordial + Sol Negro</strong></td>
                <td>YOD Client Core</td>
                <td><code>ClientCoreContract.ts</code></td>
                <td>Inyección de axiomas de marca y delimitación de restricciones dialécticas.</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0;">
                <td style="padding: 12px;"><strong style="color: #d4af37;">Pirámide Dorada (Vértice)</strong></td>
                <td>YOD Opportunity Engine</td>
                <td><code>YodOpportunityPlan.ts</code></td>
                <td>Formulación de tesis semántica y calificación de ganchos (0-100).</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0;">
                <td style="padding: 12px;"><strong style="color: #bf5af2;">Geoda de Amatista & Sephirot</strong></td>
                <td>Lienzo Merkle-DAG</td>
                <td><code>LienzoStateSpace.ts</code></td>
                <td>Ramificación inmutable a los 8 formatos derivados en el Eje de Continuidad.</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0;">
                <td style="padding: 12px;"><strong style="color: #38bdf8;">Ojo Digital 3D en Nubes</strong></td>
                <td>ARQUITECTO Runtime</td>
                <td><code>ArchitectContextModel.ts</code></td>
                <td>Supervisión transversal, Total Production Coach y auditoría forense.</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0;">
                <td style="padding: 12px;"><strong style="color: #30d158;">Luna 3 (Comercial OCR)</strong></td>
                <td>Commerce Telemetry</td>
                <td><code>CommerceLedger.ts</code></td>
                <td>Ingesta de facturas, atribución a contentId, closers y ROI de campaña.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Total Masterpiece] Generated /${locale}/cosmogonia/index.html`);
}

// 2. GENERATE CONTEXTO PAGE (/es/contexto/index.html)
function generateContextoPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'contexto');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s (Externos)', href: '#externos' },
    { label: '🧭 La Visión del Creador', href: '#vision' },
    { label: '🏗️ Arquitectura de la Plataforma', href: '#plataforma' },
    { label: '🔄 El Proceso de Creación', href: '#proceso' },
    { label: '🛠️ Especificación para Internos', href: '#internos' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Contexto, Visión & Lógica del Sistema — ABRAXAS OS' : 'System Context, Vision & Architecture — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'El contexto fundacional de ABRAXAS OS: por qué nació la herramienta, cómo resuelve el cuello de botella de la creación y cómo opera su lógica interna.' : 'Foundational context and complete vision of ABRAXAS OS.'}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'contexto', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #38bdf8;">FOUNDATIONAL CONTEXT // VISIÓN & LÓGICA</span>
      <h1 class="h2">${isEs ? 'Contexto y Filosofía del Sistema.<br/>Por qué ABRAXAS Existe.' : 'System Context & Philosophy.<br/>Why ABRAXAS Exists.'}</h1>
      <p class="p">${isEs ? 'La explicación completa de la visión del creador, la estructura modular de la herramienta y la superación definitiva del caos operativo en agencias de contenido.' : 'The complete architectural vision and operating logic of ABRAXAS OS.'}</p>
    </div>

    <!-- TIER A: PARA EXTERNOS -->
    <section id="externos" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag cyan">TIER A // EXPLICACIÓN PARA EXTERNOS Y DIRECTORES</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">${isEs ? 'El Problema que Resuelve ABRAXAS en 3 Puntos' : 'The Problem ABRAXAS Solves'}</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; font-size: 0.95rem; color: #e2e8f0; line-height: 1.6;">
          <div>
            <strong style="color: #ff453a; display: block; margin-bottom: 6px;">1. El Agotamiento Creativo:</strong>
            <p style="color: #94a3b8;">Intentar escribir por separado para TikTok, carruseles de Instagram, hilos de Twitter, correos y podcasts consume 40 horas semanales y genera mensajes desordenados.</p>
          </div>
          <div>
            <strong style="color: #fef08a; display: block; margin-bottom: 6px;">2. La Trampa de la IA Genérica:</strong>
            <p style="color: #94a3b8;">Los chatbots genéricos producen textos trillados que hunden la autoridad de tu marca y carecen de conexión con tu inventario de ventas real.</p>
          </div>
          <div>
            <strong style="color: #30d158; display: block; margin-bottom: 6px;">3. La Solución Determinista:</strong>
            <p style="color: #94a3b8;">ABRAXAS toma una sola tesis de autoridad y genera automáticamente los 8 formatos con auto-edición en 18s, metrología de cero errores y telemetría de ventas.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TIER B: PARA INTERNOS -->
    <section id="internos" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">TIER B // EXPLICACIÓN TÉCNICA PARA INTERNOS</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">${isEs ? 'Principios de Diseño de Software y Aislamiento Modular' : 'Software Design Principles & Modular Isolation'}</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 14px; font-size: 0.95rem; color: #cbd5e1; line-height: 1.6; margin-top: 1.5rem;">
          <li>🔒 <strong>Aislamiento de Fallos:</strong> Si el módulo de renderizado VAV experimenta un error de sintaxis en un shader, el árbol de Lienzo y la base de datos SQLite permanecen 100% intactos.</li>
          <li>🌳 <strong>Inmutabilidad Criptográfica:</strong> Cada cambio en un guion o archivo multimedia genera un hash SHA-256 en el Content Addressable Storage (CAS), impidiendo la corrupción silenciosa de datos.</li>
          <li>🍎 <strong>Soberanía Local M-Series:</strong> El sistema prioriza binarios nativos optimizados para Apple Neural Engine (ANE) y VideoToolbox para ejecutar inferencias y renders con cero coste de servidores en la nube.</li>
        </ul>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Total Masterpiece] Generated /${locale}/contexto/index.html`);
}

// 3. GENERATE CATEDRA 165 IQ PAGE (/es/catedra/index.html)
function generateCatedraPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'catedra');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s (Externos)', href: '#externos' },
    { label: '🎓 Postulado Epistemológico', href: '#postulado' },
    { label: '📐 Formalismo Matemático', href: '#formalismo' },
    { label: '🔬 Topología de Estados', href: '#topologia' },
    { label: '🛠️ Especificación para Internos', href: '#internos' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Cátedra Formal 165 IQ: Teoría General de Medios Deterministas — ABRAXAS OS' : '165 IQ Formal Lecture: Deterministic Media Theory — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Exposición académica formal de nivel doctoral sobre la máquina de estados de ABRAXAS OS, el álgebra de Lienzos y la topología de Hilbert de activos discretos.' : 'Doctoral-level formal treatise on ABRAXAS OS state space topology and deterministic media theory.'}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'catedra', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #38bdf8;">ACADEMIC AMPHITHEATER // FORMAL DOCTORAL TREATISE</span>
      <h1 class="h2">${isEs ? 'Cátedra de Arquitectura Formal.<br/>Teoría General de Medios Deterministas.' : 'Formal Architecture Lecture.<br/>General Theory of Deterministic Media.'}</h1>
      <p class="p">${isEs ? 'Una disertación epistemológica y matemática sobre la transformación del criterio creativo humano en un autómata celular determinista sobre silicio.' : 'An epistemological and mathematical treatise on turning human criterion into a deterministic automaton.'}</p>
    </div>

    <!-- TIER A: PARA EXTERNOS -->
    <section id="externos" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag cyan">TIER A // EXPLICACIÓN SINTÉTICA PARA AUDIENCIAS GENERALES</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">${isEs ? '¿Qué significa que ABRAXAS sea «Determinista»?' : 'What Does «Deterministic» Mean?'}</h3>
        <p class="card-desc" style="font-size: 1.05rem; color: #e2e8f0; line-height: 1.65;">
          ${isEs 
            ? 'En la mayoría de programas de diseño, el resultado depende del azar o de pulsar botones a ciegas. En ABRAXAS, la creación sigue leyes matemáticas exactas: una misma tesis de entrada produce siempre el mismo árbol sincronizado de 8 formatos, con la misma cadencia de corte y el mismo nivel acústico de -14 LUFS, garantizando calidad industrial predecible.' 
            : 'Traditional software relies on randomness. ABRAXAS applies mathematical certainty: identical inputs produce identical synchronized 8-format outputs with zero drift.'}
        </p>
      </div>
    </section>

    <!-- TIER B: TRATADO MATEMÁTICO RIGUROSO -->
    <section id="formalismo" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">TIER B // TRATADO MATEMÁTICO RIGUROSO (165 IQ AMPHITHEATER)</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">1. Formalización de la Máquina de Estados Finitos</h3>
        <p class="card-desc" style="font-size: 1rem; color: #cbd5e1; line-height: 1.7; margin-bottom: 1.5rem;">
          Sea $\\mathcal{S} = \\{ \\text{PLANNED}, \\text{OBSERVED}, \\text{RESOLVED}, \\text{PRODUCTION}, \\text{PUBLICATION}, \\text{LEARNING} \\}$ el conjunto finito de estados ontológicos de un Lienzo $\\mathcal{L}$. La función de transición $\\delta: \\mathcal{S} \\times \\Sigma \\to \\mathcal{S}$ está condicionada estrictamente por el operador de metrología $\\mathcal{M}_{\\text{SHIM}}$:
          \\[
            \\delta(s_t, e_t) = 
            \\begin{cases} 
              s_{t+1}, & \\text{si } \\mathcal{M}_{\\text{SHIM}}(e_t) = 0.00\\% \\text{ GAPs} \\\\
              \\text{LOCKED}, & \\text{si } \\mathcal{M}_{\\text{SHIM}}(e_t) > 0.00\\% \\text{ GAPs}
            \\end{cases}
          \\]
        </p>

        <h3 class="card-h3" style="font-size: 1.8rem; margin-top: 2rem;">2. El Operador de Memoria Compuesta en la Dimensión A</h3>
        <p class="card-desc" style="font-size: 1rem; color: #cbd5e1; line-height: 1.7;">
          La evolución del conocimiento acumulativo de la marca entre lotes discretos $k \\in \\mathbb{N}$ satisface:
          \\[
            S_{k+1} = S_k \\oplus \\left( \\alpha \\cdot \\nabla \\mathcal{R}_{\\text{retención}} + \\beta \\cdot \\nabla \\mathcal{V}_{\\text{facturación}} \\right)
          \\]
          donde $\\alpha$ parametriza el gradiente de retención de la Luna 2 y $\\beta$ parametriza el gradiente de ingresos atribuidos por la Luna Comercial 3.
        </p>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Total Masterpiece] Generated /${locale}/catedra/index.html`);
}

// 4. GENERATE SCRUM & ROADMAP 0-100% PAGE (/es/scrum/index.html)
function generateScrumPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'scrum');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s (Externos)', href: '#externos' },
    { label: '🏃 Sprints F0 a F12', href: '#sprints' },
    { label: '🍎 Parámetros Mac M-Series', href: '#mac-params' },
    { label: '🔒 Aislamiento Modular', href: '#aislamiento' },
    { label: '🛠️ Especificación para Internos', href: '#internos' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Scrum & Backlog Maestro: De Paso 0 a 100% Funcional — ABRAXAS OS' : 'Scrum & Master Backlog: Step 0 to 100% — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'El backlog de ingeniería Scrum completo para ensamblar y desplegar ABRAXAS OS de forma modular en macOS con calidad certificada.' : 'The complete engineering Scrum backlog from Step 0 to 100% macOS certified production.'}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'scrum', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #30d158;">SCRUM MASTER BACKLOG // DESPLIEGUE MODULAR 0 A 100%</span>
      <h1 class="h2">${isEs ? 'Scrum y Roadmap de Ingeniería.<br/>De Paso 0 al Despliegue Mac 100% Funcional.' : 'Engineering Scrum & Backlog.<br/>Step 0 to 100% Native Mac Production.'}</h1>
      <p class="p">${isEs ? 'La guía meticulosa y modular de tareas de desarrollo para construir, verificar y reparar cada módulo de ABRAXAS OS sin romper dependencias existentes.' : 'The meticulous engineering backlog to assemble ABRAXAS OS from scratch on macOS.'}</p>
    </div>

    <!-- TIER A: PARA EXTERNOS -->
    <section id="externos" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag emerald">TIER A // RESUMEN PARA LÍDERES DE PROYECTO</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">${isEs ? 'El Plan de Construcción en 5 Fases Claras' : '5-Phase Construction Roadmap'}</h3>
        <p class="card-desc" style="font-size: 1.05rem; color: #e2e8f0; line-height: 1.65;">
          ${isEs 
            ? 'Construimos ABRAXAS OS como un edificio modular: <strong>Fase 1:</strong> Cimientos de datos inmutables y contratos. <strong>Fase 2:</strong> Inteligencia YOD y ventana operativa HE. <strong>Fase 3:</strong> Motores de auto-edición VAV y metrología SHIM. <strong>Fase 4:</strong> Bucle telemétrico de 3 lunas y OCR de facturas. <strong>Fase 5:</strong> Empaquetado firmado para macOS.' 
            : 'Modular phased rollout: 1. Immutable schemas, 2. YOD & HE desk, 3. VAV auto-cut & SHIM metrology, 4. 3-Moon telemetry & OCR, 5. Certified macOS packaging.'}
        </p>
      </div>
    </section>

    <!-- TIER B: BACKLOG DETALLADO DE SPRINTS -->
    <section id="sprints" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">TIER B // BACKLOG DE INGENIERÍA SCRUM (HISTORIAS & CRITERIOS DE ACEPTACIÓN)</span>
        
        <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 1.5rem;">
          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 14px; border-left: 4px solid #d4af37;">
            <strong style="color: #fff; font-size: 1.15rem; display: block; margin-bottom: 6px;">Sprint 01 (F0–F2): Contratos y Esquemas TypeScript</strong>
            <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5;">Congelar <code>ClientCoreContract.ts</code>, <code>LienzoSchema.ts</code> y árbol Merkle-DAG. Criterio de aceptación: 100% de tests unitarios pasan sin advertencias de tipos.</p>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 14px; border-left: 4px solid #38bdf8;">
            <strong style="color: #fff; font-size: 1.15rem; display: block; margin-bottom: 6px;">Sprint 02 (F3–F5): Inteligencia YOD, Ventana HE y Metrología SHIM</strong>
            <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5;">Implementar radar de puntos ciegos (0-100 hooks), Kanban nativo de 50 lotes y detector fonético Whisper de 0.00% GAPs.</p>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 14px; border-left: 4px solid #bf5af2;">
            <strong style="color: #fff; font-size: 1.15rem; display: block; margin-bottom: 6px;">Sprint 03 (F6–F7): Motor VAV de 18s y 13 Familias de Motion</strong>
            <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5;">Auto-recorte RMS a 60 FPS, subtítulos cinéticos con Whisper Large V3 y física de resortes en Remotion.</p>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 14px; border-left: 4px solid #30d158;">
            <strong style="color: #fff; font-size: 1.15rem; display: block; margin-bottom: 6px;">Sprint 04 (F8–F10): ARQUITECTO, Luna 2 y Luna Comercial OCR</strong>
            <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5;">Total Production Coach, curvas de retención segundo a segundo, escáner OCR de facturas y libro contable de ventas.</p>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 14px; border-left: 4px solid #fef08a;">
            <strong style="color: #fff; font-size: 1.15rem; display: block; margin-bottom: 6px;">Sprint 05 (F11–F12): Aceleración Metal GPU & Release Candidate</strong>
            <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5;">Optimización para Apple Silicon M-Series, puente LLM local offline y empaquetado en DMG firmado.</p>
          </div>
        </div>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Total Masterpiece] Generated /${locale}/scrum/index.html`);
}

// 5. GENERATE GUSTOS & LIENZOS CANON PAGE (/es/gustos-canon/index.html)
function generateGustosCanonPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'gustos-canon');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s (Externos)', href: '#externos' },
    { label: '🎨 Gustos Visuales', href: '#visuales' },
    { label: '✍️ Gustos Editoriales', href: '#editoriales' },
    { label: '📄 Anatomía del Lienzo', href: '#anatomia' },
    { label: '🛠️ Especificación para Internos', href: '#internos' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Canon de Gustos Visuales, Editoriales y Estructura de Lienzos — ABRAXAS OS' : 'Visual, Editorial & Lienzo Taste Canon — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'El canon estético oficial de ABRAXAS OS: gustos visuales de lujo, reglas editoriales de respuesta directa y cómo se organiza la información dentro de los Lienzos.' : 'Official aesthetic and editorial canon of ABRAXAS OS.'}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'gustos-canon', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #d4af37;">TASTE CANON // GUSTOS VISUALES & EDITORIALES</span>
      <h1 class="h2">${isEs ? 'El Canon de Gustos y Criterio.<br/>Estética de Lujo, Edición y Lienzos.' : 'The Taste & Criteria Canon.<br/>Luxury Visuals, Editorial & Lienzos.'}</h1>
      <p class="p">${isEs ? 'Los principios inquebrantables de dirección de arte, redacción de autoridad y arquitectura espacial de datos exigidos por el creador.' : 'The unshakeable art direction and direct-response editorial canon of ABRAXAS OS.'}</p>
    </div>

    <!-- TIER A: PARA EXTERNOS -->
    <section id="externos" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">TIER A // RESUMEN DE ESTILO DE MARCA</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">${isEs ? 'Los 3 Mandatos de Calidad de ABRAXAS' : 'The 3 Quality Mandates'}</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 1rem; color: #e2e8f0; line-height: 1.6; margin-top: 1rem;">
          <li>🖤 <strong>1. La Reducción es Lujo:</strong> Fondo negro puro (#000000), nada de degradados morados estridentes ni neones innecesarios. El vacío oscuro es un escenario cinematográfico.</li>
          <li>🎯 <strong>2. La Deuda Narrativa manda:</strong> El gancho (Hook) abre una pregunta intrigante que solo se responde al final del contenido (Payoff). Cero clickbait barato.</li>
          <li>🧩 <strong>3. El Lienzo no se reemplaza:</strong> Cada pieza de contenido es un rompecabezas que se va rellenando etapa a etapa sin rehacer archivos sueltos.</li>
        </ul>
      </div>
    </section>

    <!-- TIER B: ESPECIFICACIÓN DETALLADA -->
    <section id="anatomia" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">TIER B // ANATOMÍA DEL OBJETO LIENZO (STRUCTURE REGISTRY)</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">Los 6 Bloques de un Lienzo Vivo</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-top: 1.5rem; font-family: var(--font-mono); font-size: 0.85rem;">
          <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 10px;">
            <strong style="color: #d4af37;">1. metadata_block:</strong><br/>contentId, clientCoreId, author, createdAt, sha256_hash.
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 10px;">
            <strong style="color: #38bdf8;">2. thesis_intent_block:</strong><br/>central_thesis, dialectic_hooks[3], category_expansion.
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 10px;">
            <strong style="color: #bf5af2;">3. observed_audio_block:</strong><br/>raw_wav_hash, whisper_tokens[], gap_score_0_00.
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 10px;">
            <strong style="color: #30d158;">4. derivatives_block:</strong><br/>reel_9x16, carousel_4x5, thread_x, newsletter, podcast.
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 10px;">
            <strong style="color: #fef08a;">5. coach_audit_block:</strong><br/>editing_cuts[], vfx_plan, sfx_triggers, music_bpm.
          </div>
          <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 10px;">
            <strong style="color: #ff453a;">6. commerce_telemetry:</strong><br/>units_sold, revenue_usd, closer_id, campaign_roi.
          </div>
        </div>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Total Masterpiece] Generated /${locale}/gustos-canon/index.html`);
}

// 6. GENERATE PROMPT MAESTRO PAGE (/es/prompt-maestro/index.html)
function generatePromptMaestroPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'prompt-maestro');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s (Externos)', href: '#externos' },
    { label: '📋 El Prompt Maestro', href: '#prompt' },
    { label: '🛠️ Especificación para Internos', href: '#internos' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'El Prompt Maestro de Creación Web — ABRAXAS OS' : 'The Master Web Engineering Prompt — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'El prompt maestro exhaustivo para recrear la plataforma web de ABRAXAS OS con todos sus criterios, animaciones GSAP, Canvas y 31 principios.' : 'The complete master prompt to recreate the entire ABRAXAS OS web platform.'}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'prompt-maestro', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #bf5af2;">MASTER AI PROMPT // REPRODUCCIÓN 1:1</span>
      <h1 class="h2">${isEs ? 'El Prompt Maestro de Ingeniería.<br/>Recrea la Plataforma en Cualquier Chat.' : 'The Master Engineering Prompt.<br/>Recreate the Entire Platform.'}</h1>
      <p class="p">${isEs ? 'Copia y pega este prompt en cualquier modelo de lenguaje para generar una página web idéntica con todos los criterios y contratos de ABRAXAS.' : 'Copy and paste this master prompt to generate an identical web architecture.'}</p>
    </div>

    <!-- TIER A: PARA EXTERNOS -->
    <section id="externos" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag iris">TIER A // RESUMEN PARA USUARIOS</span>
        <h3 class="card-h3" style="font-size: 1.8rem;">${isEs ? '¿Cómo usar el Prompt Maestro?' : 'How to Use the Master Prompt?'}</h3>
        <p class="card-desc" style="font-size: 1.05rem; color: #e2e8f0; line-height: 1.65;">
          ${isEs 
            ? 'Haz clic en el botón inferior para copiar el bloque de instrucciones. Pégalo en ChatGPT, Claude o cualquier IA y automáticamente construirá el código HTML/CSS/JS con diseño Apple 2026, efecto linterna, simuladores y cero saltos de diseño.' 
            : 'Click the button below to copy the complete master engineering prompt into your clipboard.'}
        </p>
      </div>
    </section>

    <!-- TIER B: EL PROMPT MAESTRO COMPLETO -->
    <section id="prompt" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <span class="card-pill-tag gold">TIER B // PROMPT DE INGENIERÍA COMPLETO</span>
          <button id="btn-copy-master-prompt" class="btn-apple-cta" style="background: var(--color-iris); border: none; padding: 8px 18px; font-weight: 700; cursor: pointer;">
            📋 ${isEs ? 'Copiar Prompt Completo' : 'Copy Master Prompt'}
          </button>
        </div>

        <pre style="max-height: 500px; overflow-y: auto; background: #000; padding: 20px; border-radius: 12px; font-family: var(--font-mono); font-size: 0.82rem; color: #cbd5e1; line-height: 1.55; white-space: pre-wrap; border: 1px solid rgba(255,255,255,0.1);"><code id="code-master-prompt">Eres un Arquitecto de Software Principal y Diseñador Web de Élite (Nivel Awwwards / Apple HIG).
Debes generar una plataforma web completa de ABRAXAS OS en un solo archivo HTML/CSS/JS cumpliendo las siguientes 31 directrices:

1. ESTÉTICA & TOKENS:
   - Fondo negro puro (#000000) con Dynamic 35mm Film Grain (3% overlay SVG).
   - Tipografía oficial Apple SF Pro Display con jerarquía editorial de 4 niveles.
   - Efecto Linterna (Mouse Spotlight): Cada tarjeta Bento calcula --mouse-x y --mouse-y para emitir un resplandor dorado/iris.
   - Preloader Cinematográfico 0-100% con isotipo Chevron ▲.
   - Canvas interactivo de red neuronal de partículas Chevron en 60 FPS.

2. ARQUITECTURA DATA-DRIVEN & PROXIES:
   - Capa de datos desacoplada en 'window.siteConfig' en el <head>.
   - Reactividad gobernada por 'window.appState' con un JavaScript Proxy nativo.

3. SECCIONES Y PÁGINAS REQUERIDAS:
   - Apple Sticky Localnav (52px) con enlaces blindados y selector de idioma (ES/EN).
   - Sticky TOC (Menú de salto rápido interno) en cada subpágina.
   - Hero Section con chasis de hardware MacBook Pro (aspect-ratio 16:9, Zero CLS) y cinta de 4 métricas (18s, 1➔8, 50, 0.00%).
   - Cosmogonía Solar & 3 Lunas: Explicación dual (Tier A Externos / Tier B Internos) del Sol, Pirámide Dorada, Amatista, Ojo 3D y las 3 Lunas.
   - La Luna Comercial: Libro contable de ventas, simulador OCR de facturas, closers y ROI.
   - Diagnóstico YOD & Branding Method: Matriz de 4 vectores (Origen, Destino, Identidad, Potencial).
   - ARQUITECTO Total Production Coach: Reglas de Edición, VFX, SFX ('no_sfx_needed'), Música y Motion.
   - Scrum Paso 0 a 100%: Backlog de 5 sprints para macOS.
   - Biblioteca Canon 37 TXT: Buscador en vivo con lector de texto completo y botón de copiar.</code></pre>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script>
    document.getElementById('btn-copy-master-prompt')?.addEventListener('click', function() {
      const code = document.getElementById('code-master-prompt').textContent;
      navigator.clipboard.writeText(code).then(() => {
        this.textContent = '✅ ¡Prompt Copiado!';
        setTimeout(() => { this.textContent = '📋 Copiar Prompt Completo'; }, 2000);
      });
    });
  </script>
  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Total Masterpiece] Generated /${locale}/prompt-maestro/index.html`);
}

function compileTotalMasterpiece() {
  ['es', 'en'].forEach(locale => {
    generateCosmogoniaPage(locale);
    generateContextoPage(locale);
    generateCatedraPage(locale);
    generateScrumPage(locale);
    generateGustosCanonPage(locale);
    generatePromptMaestroPage(locale);
  });
  console.log('✨ [Total Masterpiece] All 6 new strategic deep-dive pages compiled successfully!');
}

compileTotalMasterpiece();
