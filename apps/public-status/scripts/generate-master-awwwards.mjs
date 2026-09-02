
function getUniversalWidgets(locale, depth = 0) {
  const isEs = locale === 'es';
  const root = depth === 0 ? '' : '../'.repeat(depth);
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

function getUniversalFooter(locale, depth = 0) {
  const isEs = locale === 'es';
  const root = depth === 0 ? '' : '../'.repeat(depth);
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

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const docsDir = path.join(rootDir, 'docs/abraxas-os-status');

// Load canonical dossiers from disk
const canonDir = path.join(rootDir, '00_START_HERE/CANON_37_TXT');
let canonFiles = [];
try {
  canonFiles = fs.readdirSync(canonDir).filter(f => f.endsWith('.txt')).sort();
} catch (e) {
  canonFiles = [];
}

const canonDossiersData = canonFiles.map((filename, idx) => {
  const num = filename.split('_')[0];
  const title = filename.replace('.txt', '').replace(/_/g, ' ');
  let content = '';
  try {
    content = fs.readFileSync(path.join(canonDir, filename), 'utf-8');
  } catch (err) {
    content = 'Dossier canónico protegido.';
  }
  return { id: `dossier-${num}`, num, title, filename, content };
});

function getPreloaderHTML() {
  return `
  <div id="preloader">
    <div class="preloader-glyph">▲</div>
    <div class="preloader-count" id="preloader-counter">0%</div>
    <div class="preloader-bar-wrap">
      <div class="preloader-bar" id="preloader-bar"></div>
    </div>
  </div>
  `;
}

function getLocalnavHTML(locale, activeTab, depth = 0) {
  const isEs = locale === 'es';
  const root = depth === 0 ? '' : '../'.repeat(depth);
  const langPrefix = `${root}${locale}/`;
  const otherLocale = isEs ? 'en' : 'es';
  const switchLangHref = `${root}${otherLocale}/index.html`;

  return `
  <!-- Film Grain Overlay -->
  <div class="film-grain-overlay"></div>

  <!-- Master Sticky Localnav -->
  <nav class="apple-localnav" aria-label="Local Navigation">
    <div class="localnav-inner">
      <a href="${root}index.html" class="localnav-brand">
        <span>ABRAXAS OS</span>
        <span class="tag">v3.3 ALL-IN-ONE MASTER</span>
      </a>
      <div class="localnav-items">
        <a href="#welcome" class="localnav-a active">${isEs ? 'Inicio' : 'Home'}</a>
        <a href="#cosmogonia" class="localnav-a" style="color: #fef08a;">☀️ Cosmogonía</a>
        <a href="#viewer" class="localnav-a">⚡ Ecosistema 8-en-1</a>
        <a href="#tres-lunas" class="localnav-a" style="color: #30d158;">🌙 3 Lunas & Ventas</a>
        <a href="#branding" class="localnav-a" style="color: #bf5af2;">🎯 Branding YOD</a>
        <a href="#coach" class="localnav-a">👁️ Production Coach</a>
        <a href="#performance" class="localnav-a">🚀 Rendimiento</a>
        <a href="#governance" class="localnav-a">💼 Gerencia</a>
        <a href="#catedra" class="localnav-a" style="color: #38bdf8;">🏛️ Cátedra 165 IQ</a>
        <a href="#scrum" class="localnav-a">📋 Scrum 0-100%</a>
        <a href="#canon-library" class="localnav-a" style="color: #d4af37;">📚 Canon 37 TXT</a>
        <a href="#backup" class="localnav-a">🏛️ Backup SHA-256</a>
        <a href="${langPrefix}tools/vav/motions/index.html" class="localnav-a">🎬 Motions</a>
        <a href="${langPrefix}tools/shim/index.html" class="localnav-a">🔍 SHIM</a>
      </div>
      <div class="localnav-right">
        <a href="${switchLangHref}" class="localnav-a" style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${isEs ? 'EN' : 'ES'}</a>
        <button id="btn-open-control-center" class="btn-control-center">
          <span>⚙️ Menú Total</span>
        </button>
        <a href="#viewer" class="btn-apple-cta">${isEs ? 'Explorar Sistema' : 'Explore System'}</a>
      </div>
    </div>
  </nav>
  `;
}

function getMasterUnifiedPage(locale, depth = 0) {
  const isEs = locale === 'es';
  const root = depth === 0 ? '' : '../'.repeat(depth);
  const langPrefix = `${root}${locale}/`;

  const quickJumpItems = [
    { label: '⚡ En 30s', href: '#welcome' },
    { label: '☀️ Cosmogonía Solar', href: '#cosmogonia' },
    { label: '🎛️ Visor 8-en-1', href: '#viewer' },
    { label: '🌙 Las 3 Lunas & OCR', href: '#tres-lunas' },
    { label: '🎯 Branding & Campañas', href: '#branding' },
    { label: '👁️ Total Production Coach', href: '#coach' },
    { label: '🚀 Chips M-Series', href: '#performance' },
    { label: '💼 Alta Dirección & ROI', href: '#governance' },
    { label: '🏛️ Cátedra 165 IQ', href: '#catedra' },
    { label: '📋 Scrum Backlog', href: '#scrum' },
    { label: '📚 Buscador Canon 37 TXT', href: '#canon-library' },
    { label: '🏛️ Bóveda de Respaldo', href: '#backup' }
  ];

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'ABRAXAS OS: La Experiencia Maestra Total Unificada (v3.3 All-In-One)' : 'ABRAXAS OS: The Master Unified Experience (v3.3 All-In-One)'}</title>
  <meta name="description" content="${isEs ? 'Todas las versiones, módulos, cosmogonía solar, 3 lunas, diagnóstico YOD, metrología SHIM 0% GAPs, 13 motions, 37 dossiers y bóveda de respaldo unificados en una sola experiencia monumental.' : 'All versions, modules, solar cosmology, 3 moons, YOD diagnostic, SHIM metrology, 13 motions, 37 dossiers, and legacy vault unified in one master experience.'}">
  
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">

  ${getPreloaderHTML()}
  ${getLocalnavHTML(locale, 'overview', depth)}

  <!-- Sticky Quick Jump TOC Bar -->
  <div style="background: rgba(14, 14, 20, 0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.12); padding: 10px 1.5rem; position: sticky; top: 52px; z-index: 999; overflow-x: auto; scrollbar-width: none;">
    <div style="max-width: 1280px; margin: 0 auto; display: flex; gap: 8px; align-items: center; white-space: nowrap;">
      <span style="font-size: 0.75rem; font-family: var(--font-mono); color: #d4af37; font-weight: 800; margin-right: 6px;">TODAS LAS VERSIONES:</span>
      ${quickJumpItems.map(item => `<a href="${item.href}" class="btn-control-center" style="font-size: 0.76rem; padding: 4px 12px; background: rgba(255,255,255,0.06);">${item.label}</a>`).join('')}
    </div>
  </div>

  <!-- Interactive HTML5 Canvas Particle Brain -->
  <canvas id="brain-canvas"></canvas>

  <main>

    <!-- 1. SECTION: HERO / WELCOME -->
    <section id="welcome" class="section-welcome" style="position: relative; padding-top: 60px;">
      <div class="product-eyebrow">
        ${isEs ? 'MACBOOK PRO 2026 // ABRAXAS OS ALL-IN-ONE MASTER EDITION' : 'MACBOOK PRO 2026 // ABRAXAS OS ALL-IN-ONE MASTER EDITION'}
      </div>
      <h1 class="headline-gradient">
        ${isEs ? 'Mente abierta.<br/>Poder total.' : 'Mind-blowing.<br/>Head-turning.'}
      </h1>
      <p class="subhead">
        ${isEs 
          ? 'Una sola semilla de marca. Ocho formatos vivos. Cero margen de error. ABRAXAS une cosmogonía, inteligencia estratégica, síntesis de video en 18s y telemetría comercial de 3 lunas en una sola arquitectura determinista en Apple Silicon.'
          : 'One core brand seed. Eight living formats. Zero error margin. ABRAXAS unifies cosmology, strategic intelligence, 18s video synthesis, and 3-moon sales telemetry.'}
      </p>

      <div class="hero-actions">
        <a href="#cosmogonia" class="btn-pill-primary">☀️ ${isEs ? 'Ver Cosmogonía Solar' : 'Explore Solar Cosmology'}</a>
        <a href="#tres-lunas" class="btn-pill-secondary">🌙 ${isEs ? 'Luna Comercial & Ventas' : 'Sales Moon & ROI'}</a>
        <a href="#canon-library" class="btn-pill-secondary">📚 ${isEs ? 'Biblioteca Canon 37 TXT' : 'Canon 37 TXT'}</a>
        <a href="#backup" class="btn-pill-secondary">🏛️ ${isEs ? 'Bóveda de Respaldo' : 'Backup Vault'}</a>
      </div>

      <!-- Master Hardware Chassis (Aspect-ratio 16:9, Zero CLS) -->
      <div class="hero-hardware-chassis">
        <div class="hardware-bezel">
          <div class="hardware-screen">
            <img src="${root}assets/plates/plate_01_hero.webp" alt="ABRAXAS OS Hardware Chamber" loading="eager" width="1920" height="1080">
            <div class="hardware-notch-badge">
              ◈ ATZILUTH CORE CHAMBER // SILICON SOBERANÍA 2026
            </div>
          </div>
        </div>
      </div>

      <!-- 4-Stat Ribbon -->
      <div class="highlights-grid" style="margin-top: 3.5rem;">
        <div class="highlight-card" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <div class="highlight-stat gold">18s</div>
          <div class="highlight-label">${isEs ? 'Auto-edición quirúrgica y síntesis en Apple Silicon' : 'Surgical auto-cut & synthesis on Apple Silicon'}</div>
          <div class="card-deepdive-drawer">
            <div class="deepdive-content-box">
              <span class="deepdive-tag">ESPECIFICACIÓN COMPLETA 18S</span>
              <p><strong>Algoritmo de detección de silencios:</strong> Ventana FFT de 10ms con umbral RMS a -38 dBFS. Todo silencio mayor a 120ms se elimina quirúrgicamente preservando micro-respiraciones orgánicas de 80ms con fades parabólicos de 5ms en cada borde.</p>
              <p><strong>3 Niveles de Densidad de Corte:</strong></p>
              <ul style="color: #cbd5e1; font-size: 0.85rem; margin: 8px 0; padding-left: 1.2rem;">
                <li><strong>Nivel 1 — Cinematic Minimal:</strong> Cortes cada 10-15s (ensayos YouTube 16:9, CEOs).</li>
                <li><strong>Nivel 2 — Dynamic Authority:</strong> Cortes cada 3-5s (Reels, Instagram, LinkedIn).</li>
                <li><strong>Nivel 3 — Hyper-Retention Rush:</strong> Cortes cada 1.5-2.5s (TikTok, Shorts).</li>
              </ul>
              <p><strong>Mastering final:</strong> Normalización a -14.0 LUFS Integrated / -1.0 dBTP Peak. High-pass 80Hz, EQ dinámico 350Hz, de-esser 6.5kHz y limitador Brickwall.</p>
            </div>
          </div>
        </div>

        <div class="highlight-card" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <div class="highlight-stat cyan">1➔8</div>
          <div class="highlight-label">${isEs ? 'Multiplicación de formatos desde una sola idea' : 'Living format multiplication from 1 seed'}</div>
          <div class="card-deepdive-drawer">
            <div class="deepdive-content-box">
              <span class="deepdive-tag">MERKLE-DAG CASCADE — EJE DE CONTINUIDAD</span>
              <p><strong>Objeto Lienzo Inmutable:</strong> Cada pieza de contenido vive en un Merkle-DAG con 6 bloques: metadata, thesis_intent, observed_audio, derivatives, coach_audit y commerce_telemetry. Versionado SHA-256.</p>
              <p><strong>Los 8 Formatos Derivados:</strong> 1) Reels 9:16, 2) Carruseles 4:5, 3) Hilos X, 4) Newsletters, 5) Podcasts, 6) YouTube 16:9, 7) Infografías, 8) Artículos.</p>
              <p><strong>Sincronización en cascada:</strong> Editar una sola frase en el guion principal actualiza automáticamente los 8 derivados sin pérdida de contexto. Almacenamiento CAS (Content Addressable Storage) sin «Media Offline».</p>
              <p><strong>Esfera correspondiente:</strong> Chesed (Esfera 05) — Expansión y ramificación desde 1 semilla validada.</p>
            </div>
          </div>
        </div>

        <div class="highlight-card" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <div class="highlight-stat iris">50</div>
          <div class="highlight-label">${isEs ? 'Activos gobernados al mes en una sola tarde' : 'Assets governed per month in 1 afternoon'}</div>
          <div class="card-deepdive-drawer">
            <div class="deepdive-content-box">
              <span class="deepdive-tag">GOBERNANZA BATCH — VENTANA OPERATIVA HE</span>
              <p><strong>HE (ה) — Kanban de 50 Lotes:</strong> Tablero macOS nativo con 6 compuertas de calidad inmutables. Un solo operador gobierna 50 activos en una tarde.</p>
              <p><strong>Las 6 Compuertas:</strong> 1) Safe Zones WCAG AAA, 2) Directiva no_sfx_needed, 3) Contraste de texto, 4) Dignidad de marca, 5) Ducking correcto, 6) Metrología SHIM aprobada.</p>
              <p><strong>Base de datos:</strong> SQLite local 'metrics.db' con persistencia soberana. Cero dependencia de servidores cloud.</p>
              <p><strong>Esfera correspondiente:</strong> Gevurah (Esfera 06) — Rigor y restricción.</p>
            </div>
          </div>
        </div>

        <div class="highlight-card" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <div class="highlight-stat emerald">0.00%</div>
          <div class="highlight-label">${isEs ? 'Margen de error con Metrología SHIM Daat' : 'Error margin with SHIM Daat Metrology'}</div>
          <div class="card-deepdive-drawer">
            <div class="deepdive-content-box">
              <span class="deepdive-tag">LEVENSHTEIN ACCURACY — METROLOGÍA SHIM</span>
              <p><strong>SHIM (ש) — Da'at / Esfera 04:</strong> Auditoría fonética en vivo durante la grabación con Whisper Large V3 local (&lt; 40ms latencia).</p>
              <p><strong>Live Teleprompter inteligente:</strong> Detecta omisiones en caliente. Si una frase del guion se omite, la pantalla parpadea en ámbar y el sistema sugiere re-grabación quirúrgica de esa frase específica.</p>
              <p><strong>Bloqueo de exportación:</strong> Si la distancia Levenshtein GAP &gt; 0.00%, el sistema bloquea la exportación hasta que se corrija la discrepancia. Cero desvíos no autorizados entre plan y audio grabado.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. SECTION: COSMOGONÍA SOLAR & LA PIRÁMIDE -->
    <section id="cosmogonia" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #fef08a;">COSMOGONÍA SOLAR // EL PROCESO DE CREACIÓN</span>
        <h2 class="h2">${isEs ? 'La Gran Pirámide, el Ojo 3D y los Dos Soles' : 'The Golden Pyramid, 3D Eye & Dual Suns'}</h2>
        <p class="p">${isEs ? 'De la nada cósmica al Rayo de Manifestación: la geología mística de amatista y oro que modela el flujo de contenidos.' : 'From the primordial spark to the 3-Moon closed feedback loop.'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-6" style="background: #090a10; border-left: 4px solid #fef08a; position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">LOS DOS SOLES</span>
          <h3 class="card-h3">${isEs ? 'El Sol Primordial y el Sol Negro' : 'The Primordial Spark & Black Sun'}</h3>
          <p class="card-desc">${isEs ? 'El Sol de Luz Pura crea la intención infinita, mientras el Sol Negro la eclipsa para concentrar la energía en un punto focal hiperdenso (YOD).' : 'Infinite intention focused by gravitational eclipse.'}</p>
          <div class="card-deepdive-drawer">
            <div class="deepdive-content-box">
              <span class="deepdive-tag">ATZILUTH ➔ CHOKHMAH — COSMOGONÍA COMPLETA</span>
              <p><strong>Paso 1 — El Sol Primordial:</strong> En el vacío primordial, un Sol de Luz Pura se crea de la nada representando la Voluntad Absoluta e Intención Infinita (Keter / Atziluth).</p>
              <p><strong>Paso 2 — El Sol Negro:</strong> Para evitar dispersión caótica, un Sol Negro gravitacional se superpone en eclipse perfecto, creando un punto focal hiperdenso (Chokhmah / YOD).</p>
              <p><strong>Paso 3 — El Rayo de Manifestación (Kav):</strong> Del vórtice del eclipse se dispara hacia la Tierra, portando la Gran Pirámide Dorada.</p>
              <p><strong>Paso 4 — La Geoda de Amatista:</strong> Al impactar, del subsuelo brotan cristales geológicos gigantescos que elevan la pirámide. Se recubren de roca y se transforman en amatista púrpura imperial con cúspide de oro macizo puro.</p>
            </div>
          </div>
        </div>

        <div class="spotlight-card col-6" style="background: #090a10; border-left: 4px solid #bf5af2; position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">LA PIRÁMIDE DE AMATISTA</span>
          <h3 class="card-h3">${isEs ? 'Cúspide de Oro & Árbol de la Vida' : 'Gold Capstone & Tree of Life'}</h3>
          <p class="card-desc">${isEs ? 'La pirámide es elevada por cristales que se transforman en amatista, con la cúspide en oro macizo y canales sefiróticos de flujo de datos.' : 'Amethyst geode with solid gold capstone and sephirot conduits.'}</p>
          <div class="card-deepdive-drawer">
            <div class="deepdive-content-box">
              <span class="deepdive-tag">ÁRBOL DE LA VIDA — 10 ESFERAS DEL CONTENIDO</span>
              <p><strong>Estructura:</strong> En la base de la pirámide, los cristales crecen formando exactamente la estructura del Árbol de la Vida: 10 Sephiroth y 22 senderos conectores como canales físicos de datos.</p>
              <p><strong>Las 10 Esferas del Ciclo de Vida:</strong></p>
              <ol style="color: #cbd5e1; font-size: 0.82rem; margin: 8px 0; padding-left: 1.2rem; line-height: 1.6;">
                <li><strong>Keter (Corona):</strong> YOD Brand Core — Voluntad pura de marca.</li>
                <li><strong>Chokhmah (Sabiduría):</strong> YOD Radar — Ganchos dialécticos (Hook Score ≥ 85/100).</li>
                <li><strong>Binah (Entendimiento):</strong> LIENZO — Estructura de 4 tiempos en Merkle-DAG.</li>
                <li><strong>Da'at (Conocimiento):</strong> SHIM — Metrología lúcida 0.00% GAPs.</li>
                <li><strong>Chesed (Expansión):</strong> CONTENIDO — Ramificación 1→8 formatos.</li>
                <li><strong>Gevurah (Rigor):</strong> HE — 6 compuertas de calidad.</li>
                <li><strong>Tiferet (Belleza):</strong> VAV — Catedral de síntesis audiovisual.</li>
                <li><strong>Netzach (Victoria):</strong> LUNA 1 — Despacho multicanal.</li>
                <li><strong>Hod (Resonancia):</strong> LUNA 2 — Análisis de retención.</li>
                <li><strong>Malkhut (Reino):</strong> LUNA 3 — Comercio, OCR y gerencia.</li>
              </ol>
              <p><strong>El Ojo 3D:</strong> En la punta de oro se abre un micro agujero negro que reorganiza la luz en un Ojo Digital 3D suspendido entre nubes volumétricas, proyectando las 3 Lunas Orbitales.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. SECTION: INTERACTIVE 8-IN-1 FORMAT VIEWER -->
    <section id="viewer" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #2997ff;">ECOSISTEMA 8-EN-1 // MULTI-PLATAFORMA</span>
        <h2 class="h2">${isEs ? 'Una Sola Idea. Ocho Formatos Vivos.' : 'One Core Idea. Eight Living Formats.'}</h2>
        <p class="p">${isEs ? 'Selecciona un formato para ver su especificación de velocidad y su render de alta definición:' : 'Select a format to preview live specs and 8K visual rendering:'}</p>
      </div>

      <div class="format-pills-row">
        <button class="format-pill-btn active" data-format="reels">🎬 Videos Cortos (9:16)</button>
        <button class="format-pill-btn" data-format="carousels">📑 Carruseles 4:5</button>
        <button class="format-pill-btn" data-format="threads">🧵 Hilos de Autoridad</button>
        <button class="format-pill-btn" data-format="newsletters">✉️ Newsletters</button>
        <button class="format-pill-btn" data-format="podcasts">🎙️ Micro-Podcasts</button>
        <button class="format-pill-btn" data-format="youtube">📺 YouTube 16:9</button>
      </div>

      <div class="viewer-display-card">
        <div class="viewer-media-col">
          <div class="viewer-photo-wrap">
            <img id="viewer-active-photo" src="${root}assets/plates/plate_05_vav_cathedral.webp" alt="Formato Activo" loading="lazy" width="1080" height="1080">
          </div>
        </div>
        <div class="viewer-info-col">
          <div class="viewer-spec-pill" id="viewer-active-tag">TikTok / Reels / Shorts</div>
          <h3 class="viewer-h3" id="viewer-active-title">Videos Cortos (9:16)</h3>
          <p class="viewer-p" id="viewer-active-desc">Subtítulos cinéticos Whisper palabra por palabra con 13 familias de motion y masterización a -14 LUFS.</p>
          <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); margin-top: 1.5rem;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: #d4af37; font-weight: 700;">VELOCIDAD DE SÍNTESIS:</span>
            <div id="viewer-active-speed" style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-top: 4px;">18s auto-corte</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. SECTION: LAS TRES LUNAS & TELEMETRÍA COMERCIAL -->
    <section id="tres-lunas" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #30d158;">COMMERCE TELEMETRY // LAS TRES LUNAS DE RETORNO</span>
        <h2 class="h2">${isEs ? 'El Bucle de Tres Lunas: De Vistas a Ventas' : 'The Three Moons: From Views to Revenue'}</h2>
        <p class="p">${isEs ? 'Publicación multicanal, análisis de retención segundo a segundo y libro contable de ventas con escáner OCR de facturas.' : 'Multi-channel dispatch, retention curves, and sales attribution with OCR invoice scanning.'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-4" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">LUNA 01 // PUBLICADOR</span>
          <h4 class="card-h3">Distribución a 8 Canales</h4>
          <p class="card-desc">Despacho adaptativo con metadatos optimizados para cada red social.</p>
          <div class="card-deepdive-drawer">
            <div class="deepdive-content-box">
              <span class="deepdive-tag">LUNA 1 — NETZACH (ESFERA 08) — DESPACHO MULTICANAL</span>
              <p><strong>Función:</strong> Empaquetado y distribución automática a las 8 plataformas sociales con metadatos optimizados por canal.</p>
              <p><strong>Adaptadores nativos:</strong> TikTok API, Instagram Graph API, YouTube Data API v3, X/Twitter API, Substack, Spotify for Podcasters, LinkedIn Newsletter, Beehiiv.</p>
              <p><strong>Cada paquete incluye:</strong> Resolución nativa (9:16, 4:5, 16:9), hashtags optimizados, thumbnail personalizado, descripción SEO-ready y scheduling programado.</p>
            </div>
          </div>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">LUNA 02 // RETENCIÓN</span>
          <h4 class="card-h3">Watch-Time Segundo a Segundo</h4>
          <p class="card-desc">Ingesta de curvas de drop-off para re-alimentar la formulación de ganchos en YOD.</p>
          <div class="card-deepdive-drawer">
            <div class="deepdive-content-box">
              <span class="deepdive-tag">LUNA 2 — HOD (ESFERA 09) — BUCLE CERRADO</span>
              <p><strong>Operador de Aprendizaje:</strong> S(t+1) = S(t) + A(t). El estado del sistema en el siguiente ciclo es igual al estado actual más las acciones correctivas derivadas de la telemetría.</p>
              <p><strong>Ingesta de datos:</strong> Curvas de drop-off segundo a segundo, Average Percentage Viewed (APV), tasa de guardado, compartidos y ratio de comentarios sobre vistas.</p>
              <p><strong>Penalización YOD:</strong> Si la retención cae más del 30% en los primeros 3 segundos, YOD descarta automáticamente esa estructura de gancho y genera 3 alternativas dialécticas.</p>
            </div>
          </div>
        </div>

        <div class="spotlight-card col-4" style="position: relative; border-color: rgba(48,209,88,0.4);">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">LUNA 03 // VENTAS & OCR</span>
          <h4 class="card-h3">Libro Contable & Closers</h4>
          <p class="card-desc">Atribución de compras por WhatsApp y MercadoLibre con cálculo matemático de ROI.</p>
          <div class="card-deepdive-drawer">
            <div class="deepdive-content-box">
              <span class="deepdive-tag">LUNA 3 — MALKHUT (ESFERA 10) — COMERCIO Y GERENCIA</span>
              <p><strong>Escáner OCR de Facturas:</strong> Toma una foto de la factura física, captura de MercadoLibre, comprobante de transferencia o ticket POS. El motor extrae automáticamente: Monto, Fecha, SKU/Producto, Nombre de Comprador y Canal.</p>
              <p><strong>Libro Contable por Pieza:</strong> Cada contenido (contentId) mantiene un registro vivo de cuántas unidades vendió y cuántos dólares generó.</p>
              <p><strong>Panel de Closers:</strong> Telemetría de vendedores — leads atendidos, ventas cerradas, ratio de conversión y comisiones calculadas.</p>
              <p><strong>Ecuación de ROI:</strong> ROI = ((Facturación Atribuida - Costo de Producción - Pauta) / (Costo de Producción + Pauta)) × 100%. Con ABRAXAS en Apple Silicon, el costo de producción tiende a cero.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. SECTION: BRANDING & CAMPAÑAS YOD -->
    <section id="branding" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #bf5af2;">ATZILUTH STRATEGY // YOD CAMPAIGN ENGINE</span>
        <h2 class="h2">${isEs ? 'El ABRAXAS Branding Method & Diagnóstico' : 'ABRAXAS Branding Method & Diagnostic'}</h2>
        <p class="p">${isEs ? 'La matriz de 4 vectores que convierte dolores fundacionales en autoridad de mercado incontestable:' : 'The 4-vector matrix mapping origin, destination, identity, and market authority:'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag ruby">1. ORIGEN (DOLOR)</span>
          <h4 class="card-h3">De Dónde Vienes</h4>
          <p class="card-desc">Cuellos de botella, dependencia de agencias lentas y mensajes desconectados.</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
    <span class="deepdive-tag">VECTOR 1 — DIAGNÓSTICO DE DOLOR</span>
    <p><strong>Preguntas clave:</strong> ¿Cuánto dinero y tiempo pierdes al mes en agencias externas? ¿Cuántos contenidos produces vs. cuántos necesitas? ¿Tienes control real sobre tu mensaje o lo delega alguien que no entiende tu negocio?</p>
    <p><strong>Fricciones típicas:</strong> Dependencia de editores lentos, mensajes desconectados entre redes, cero atribución de ventas al contenido, fatiga creativa del fundador.</p>
    <p><strong>Resultado:</strong> Un mapa de cuellos de botella cuantificados con impacto directo en facturación perdida.</p>
  </div></div>
        </div>
        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">2. DESTINO (VISIÓN)</span>
          <h4 class="card-h3">A Dónde Quieres Ir</h4>
          <p class="card-desc">Metas de facturación, soberanía productiva y liderazgo de categoría.</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
    <span class="deepdive-tag">VECTOR 2 — VISIÓN DE DESTINO</span>
    <p><strong>Definición precisa:</strong> Metas de facturación mensual, número de activos por semana, soberanía técnica (cero costos recurrentes de API o cloud), liderazgo de categoría medible.</p>
    <p><strong>Escalabilidad soberana:</strong> Operación 100% local en Apple Silicon. Sin servidores, sin suscripciones mensuales, sin dependencia de terceros. Tu MacBook Pro ES tu estudio de producción completo.</p>
    <p><strong>Resultado:</strong> KPIs concretos con timeline de 1 semana (MVP) o 1 mes (Enterprise).</p>
  </div></div>
        </div>
        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">3. IDENTIDAD ACTUAL</span>
          <h4 class="card-h3">Quién Eres Ahora</h4>
          <p class="card-desc">Axiomas inmutables de marca, ventajas competitivas y casos de éxito reales.</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
    <span class="deepdive-tag">VECTOR 3 — AXIOMAS DE MARCA INMUTABLES</span>
    <p><strong>YOD Brand Core & Axiom Vault:</strong> Ingesta de la voz de marca, verdades innegociables, ventajas competitivas reales y casos de éxito verificables. Se almacenan en el Lienzo como bloque inmutable.</p>
    <p><strong>Anti-alucinación:</strong> Ningún agente de IA puede contradecir ni inventar información que no esté en el Brand Core. Esto elimina el «AI-slop» (clichés genéricos sin sustancia).</p>
    <p><strong>Ley Editorial:</strong> Tema ≠ Idea. "Productividad" es un tema hueco; una idea es una afirmación dialéctica comprobable que abre deuda narrativa.</p>
  </div></div>
        </div>
        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">4. POTENCIAL EXPANDIDO</span>
          <h4 class="card-h3">Quién Puedes Llegar a Ser</h4>
          <p class="card-desc">Tesis de nicho contraria calificada de 0 a 100 que elimina la competencia por precio.</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
    <span class="deepdive-tag">VECTOR 4 — TESIS DE NICHO CONTRARIA</span>
    <p><strong>YOD Niche Opportunity Engine:</strong> Escanea los 3 dogmas más repetidos en tu industria y genera una tesis contraria calificada de 0 a 100 que elimina la competencia por precio.</p>
    <p><strong>Fórmula Hook Score:</strong> (Tensión × 0.4) + (Claridad × 0.3) + (Autoridad × 0.3). Score mínimo obligatorio: 85/100.</p>
    <p><strong>4 Campañas Pre-diseñadas:</strong> 1) Conquista de Nicho (deconstrucción de mitos), 2) Reactivación WhatsApp (bases frías), 3) Gran Monumento YouTube (manifiesto 15min), 4) Cierre High-Ticket (serie para directores).</p>
  </div></div>
        </div>
      </div>
    </section>

    <!-- 6. SECTION: TOTAL PRODUCTION COACH -->
    <section id="coach" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #d4af37;">FORENSIC CRITERIA // TOTAL PRODUCTION COACH</span>
        <h2 class="h2">${isEs ? 'Las 5 Reglas del Total Production Coach' : 'Total Production Coach Rules'}</h2>
        <p class="p">${isEs ? 'Auditoría estricta de edición, efectos, audio, música y motion para evitar la degradación estética:' : 'Forensic rules governing editing, VFX, SFX, music, and motion:'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-4" style="position: relative;"><button class="card-expand-btn" title="Expandir">+</button><span class="card-pill-tag gold">EDITING COACH</span><h4 class="card-h3">Cortes J y L</h4><p class="card-desc">El audio de la siguiente toma entra 300ms antes del corte visual para fluidez cinematográfica.</p><div class="card-deepdive-drawer"><div class="deepdive-content-box">
    <span class="deepdive-tag">EDITING COACH — REGLAS DE CORTE</span>
    <p><strong>Corte J:</strong> El audio de la siguiente toma entra 300ms antes del corte visual — crea fluidez cinematográfica y suaviza transiciones.</p>
    <p><strong>Corte L:</strong> El audio de la toma actual continúa 300ms después del corte visual — mantiene continuidad narrativa.</p>
    <p><strong>Prohibición estricta:</strong> Cero saltos de corte sin justificación de cambio de idea. Cada corte debe tener un propósito narrativo, emocional o rítmico verificable.</p>
  </div></div></div>
        <div class="spotlight-card col-4" style="position: relative;"><button class="card-expand-btn" title="Expandir">+</button><span class="card-pill-tag cyan">SFX COACH</span><h4 class="card-h3">no_sfx_needed</h4><p class="card-desc">Si un efecto sonoro no tiene anclaje visual o emocional directo, la directiva es silenciarlo.</p><div class="card-deepdive-drawer"><div class="deepdive-content-box">
    <span class="deepdive-tag">SFX COACH — DIRECTIVA no_sfx_needed</span>
    <p><strong>Regla absoluta:</strong> Si un efecto sonoro no tiene anclaje visual o emocional directo en el guion, la directiva es silenciarlo completamente.</p>
    <p><strong>Ejemplos prohibidos:</strong> Whooshes decorativos, risers genéricos, impacts sin correspondencia visual, notification sounds sintéticos.</p>
    <p><strong>Filosofía:</strong> El silencio selectivo es más poderoso que el ruido decorativo. La percepción de lujo requiere austeridad sonora disciplinada.</p>
  </div></div></div>
        <div class="spotlight-card col-4" style="position: relative;"><button class="card-expand-btn" title="Expandir">+</button><span class="card-pill-tag iris">MUSIC COACH</span><h4 class="card-h3">Ducking a -18dB</h4><p class="card-desc">La música de fondo se atenúa automáticamente para que la voz mantenga el 100% de inteligibilidad.</p><div class="card-deepdive-drawer"><div class="deepdive-content-box">
    <span class="deepdive-tag">MUSIC COACH — SIDECHAIN DUCKING</span>
    <p><strong>Ducking a -18dB:</strong> La música de fondo se atenúa automáticamente cuando habla la voz para mantener el 100% de inteligibilidad.</p>
    <p><strong>Técnica:</strong> Compresión sidechain calibrada sobre la frecuencia vocal humana (85Hz-8kHz). Ratio 4:1, attack 5ms, release 200ms.</p>
    <p><strong>Mastering final:</strong> Normalización -14.0 LUFS Integrated / -1.0 dBTP Peak. High-pass 80Hz, EQ dinámico 350Hz, de-esser 6.5kHz y limitador Brickwall.</p>
  </div></div></div>
      </div>
    </section>

    <!-- 7. SECTION: CANON 37 TXT LIVE SEARCH & READER -->
    <section id="canon-library" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #d4af37;">CANONICAL CORPUS // BIBLIOTECA 37 TXT</span>
        <h2 class="h2">${isEs ? 'El Canon Completo de 37 Dossiers' : 'The Complete 37 Dossiers Canon'}</h2>
        <p class="p">${isEs ? 'Busca, filtra y lee el texto fundacional completo directamente en tu navegador con evidencia SHA-256:' : 'Search, filter, and read all 37 foundational dossiers in real time:'}</p>
      </div>

      <div class="spotlight-card col-12" style="background: #090a10; border: 1px solid var(--border-gold); padding: 2rem;">
        <input type="text" id="canon-search-input" placeholder="🔍 Buscar en los 37 dossiers (ej. Daat, Merkle, VAV, 18s, ROI, YOD)..." style="width: 100%; padding: 14px 18px; border-radius: 10px; background: #000; color: #fff; border: 1px solid rgba(255,255,255,0.2); font-size: 0.95rem; outline: none; margin-bottom: 1.5rem;">
        
        <div id="canon-dossiers-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; max-height: 400px; overflow-y: auto;">
          ${canonDossiersData.map(d => `
            <div class="dossier-item-card" data-title="${d.title.toLowerCase()}" style="background: rgba(255,255,255,0.04); padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); cursor: pointer;" onclick="document.getElementById('canon-modal-${d.id}').style.display='block'">
              <span style="font-family: var(--font-mono); color: #d4af37; font-size: 0.75rem; font-weight: 800;">DOSSIER ${d.num}</span>
              <h5 style="color: #fff; font-size: 0.92rem; margin: 4px 0;">${d.title}</h5>
              <span style="color: #94a3b8; font-size: 0.78rem;">📄 ${d.filename}</span>
            </div>
            <div id="canon-modal-${d.id}" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 10000; padding: 2rem; overflow-y: auto;">
              <div style="max-width: 860px; margin: 2rem auto; background: #0c0d14; border: 1px solid rgba(212,175,55,0.4); border-radius: 16px; padding: 2.5rem; position: relative;">
                <button onclick="document.getElementById('canon-modal-${d.id}').style.display='none'" style="position: absolute; top: 18px; right: 18px; background: none; border: none; color: #fff; font-size: 1.4rem; cursor: pointer;">✕</button>
                <span style="color: #d4af37; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800;">DOSSIER ${d.num} // CANON OFICIAL</span>
                <h3 style="color: #fff; font-size: 1.6rem; margin: 8px 0 1.5rem 0;">${d.title}</h3>
                <pre style="background: #000; padding: 18px; border-radius: 10px; font-family: var(--font-mono); font-size: 0.82rem; color: #cbd5e1; white-space: pre-wrap; max-height: 500px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.1);">${d.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- 8. SECTION: BÓVEDA DE RESPALDO & SHA-256 -->
    <section id="backup" class="section-wrap" style="padding-top: 80px; padding-bottom: 80px;">
      <div class="spotlight-card col-12" style="background: linear-gradient(180deg, rgba(212,175,55,0.08) 0%, rgba(9,10,16,0.95) 100%); border: 1px solid rgba(212,175,55,0.35); text-align: center; padding: 3rem;">
        <span class="card-pill-tag gold">HISTORICAL SNAPSHOT // BÓVEDA DE RESPALDO</span>
        <h3 class="card-h3" style="font-size: 2rem;">Evidencia Criptográfica y Respaldo de Continuidad</h3>
        <p class="card-desc" style="max-width: 800px; margin: 0 auto 1.5rem auto;">
          Todo el conocimiento histórico, versiones anteriores, manuales y datasets canónicos están respaldados y sellados con hash criptográfico SHA-256.
        </p>
        <div style="font-family: var(--font-mono); font-size: 0.9rem; color: #d4af37; background: #000; padding: 12px 24px; border-radius: 10px; display: inline-block; border: 1px solid rgba(212,175,55,0.3);">
          SHA-256: 91234741f0b3a1ac5bd7e4c0556fafa868d00769
        </div>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  <script>
    // Live Canon Search Filter
    document.getElementById('canon-search-input')?.addEventListener('input', function(e) {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.dossier-item-card').forEach(card => {
        const title = card.getAttribute('data-title') || '';
        card.style.display = title.includes(q) ? 'block' : 'none';
      });
    });
  </script>
  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;
}

function compileMasterAwwwardsUnified() {
  fs.writeFileSync(path.join(docsDir, 'index.html'), getMasterUnifiedPage('es', 0), 'utf8');
  fs.writeFileSync(path.join(docsDir, 'es/index.html'), getMasterUnifiedPage('es', 1), 'utf8');
  fs.writeFileSync(path.join(docsDir, 'en/index.html'), getMasterUnifiedPage('en', 1), 'utf8');
  console.log('✨ [Master Unified Engine] Root /index.html and /es/ /en/ compiled with complete All-In-One experience!');
}

compileMasterAwwwardsUnified();
