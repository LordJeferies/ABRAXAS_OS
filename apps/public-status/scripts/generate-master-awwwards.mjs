
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

function getPreloaderHTML() { return ""; }

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
        <a href="#tools" class="localnav-a" style="color: #d4af37;">🔧 Herramientas</a>
        <a href="#leyes" class="localnav-a" style="color: #fef08a;">📜 Leyes</a>
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
    { label: '🔧 16 Herramientas', href: '#tools' },
    { label: '📜 Leyes Editoriales', href: '#leyes' },
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

    <!-- 2. SECTION: COSMOGONÍA SOLAR — LOS 6 PASOS DE LA CREACIÓN -->
    <section id="cosmogonia" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #fef08a;">COSMOGONÍA SOLAR // LOS 6 PASOS DE LA CREACIÓN</span>
        <h2 class="h2">${isEs ? 'De la Nada Cósmica al Bucle de Aprendizaje Infinito' : 'From the Cosmic Void to the Infinite Learning Loop'}</h2>
        <p class="p">${isEs ? 'La geología mística de amatista y oro que modela cada decisión del sistema. Cada paso cosmogónico tiene una herramienta de software real detrás.' : 'The mystical geology of amethyst and gold behind every system decision. Each cosmogonic step maps to real software.'}</p>
      </div>

      <div class="bento-grid">
        <!-- PASO 1: Los Dos Soles -->
        <div class="spotlight-card col-4" style="background: #090a10; border-left: 4px solid #fef08a; position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">PASO 1 // ATZILUTH</span>
          <h3 class="card-h3">${isEs ? 'El Sol Negro Preexistente y el Sol Blanco de la Marca' : 'The Pre-existing Black Sun & The Brand White Sun'}</h3>
          <p class="card-desc">${isEs ? 'El Sol Negro (software + sabiduría editorial ABRAXAS) eclipsa y comprime la luz viva del Sol Blanco (la marca del cliente vía Branding Method).' : 'The Black Sun (software + ABRAXAS editorial wisdom) eclipses and compresses the White Sun (client brand via Branding Method).'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">KETER → CHOKHMAH — HERRAMIENTA: YOD BRAND CORE</span>
            <p><strong>Cosmogonía:</strong> Antes de que exista un cliente, el <strong>Sol Negro</strong> de ABRAXAS ya preexiste conteniendo la infraestructura de software dura Y toda la sabiduría editorial pre-hecha (estructuras de 4 tiempos, calidad de copies, formas de crear mejor y las 4 campañas prediseñadas). Cuando el cliente llega, se enciende el <strong>Sol Blanco</strong>, que se llena con la información viva, voz, números, axiomas y dolor de nicho de su marca mediante el Branding Method. Ninguno habita en Keter: son el criterio de fondo pre-sefirótico. El Sol Negro eclipsa al Sol Blanco comprimiendo la luz de la marca con su gravedad y sabiduría.</p>
            <p><strong>Herramienta Real:</strong> <em>YOD Brand Core & Axiom Vault</em> — Ingesta de la voz de marca, axiomas inmutables y tesis fundacionales. La IA NO puede contradecir ni inventar nada que no esté en el Brand Core. Esto elimina el «AI-slop» (clichés genéricos sin sustancia).</p>
            <p><strong>YOD Niche Opportunity Engine:</strong> Escanea los 3 dogmas más repetidos en tu industria y genera ganchos de confrontación directa, curiosidad intelectual e historia práctica. Fórmula Hook Score: (Tensión × 0.4) + (Claridad × 0.3) + (Autoridad × 0.3). Score mínimo obligatorio: ≥ 85/100.</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/yod/index.html" style="color: #d4af37; font-weight: 700;">🔗 Abrir YOD en Detalle ➔</a></p>
          </div></div>
        </div>

        <!-- PASO 2: El Rayo y la Pirámide -->
        <div class="spotlight-card col-4" style="background: #090a10; border-left: 4px solid #d4af37; position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">PASO 2 // KAV</span>
          <h3 class="card-h3">${isEs ? 'El Rayo del Eclipse y la Pirámide Negra' : 'The Eclipse Ray & The Black Pyramid'}</h3>
          <p class="card-desc">${isEs ? 'Del vórtice del eclipse se dispara el Rayo (Kav) enviando una Pirámide Negra a la Tierra, que al chocar es elevada por cristales gigantescos.' : 'From the eclipse vortex, the Ray fires sending a Black Pyramid to Earth, lifted skyward by giant crystals upon impact.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">BINAH (ESFERA 03) — HERRAMIENTA: LIENZO MERKLE-DAG</span>
            <p><strong>Cosmogonía:</strong> Del vórtice del eclipse se dispara el Rayo de Manifestación (Kav) enviando a la Tierra una <strong>Pirámide Negra</strong>. Al impactar en el plano físico (Assiah), del suelo brotan cristales gigantescos facetados (el Árbol de la Vida) que crecen desde la tierra y elevan la pirámide hacia lo alto.</p>
            <p><strong>Herramienta Real:</strong> <em>LIENZO — Eje de Continuidad Merkle-DAG.</em> Cada pieza de contenido vive en un objeto inmutable con 6 bloques: metadata, thesis_intent, observed_audio, derivatives, coach_audit y commerce_telemetry. Versionado criptográfico SHA-256. La estructura del guion sigue los 4 tiempos: Hook → Tesis → Mecanismo → Payoff.</p>
            <p><strong>CAS (Content Addressable Storage):</strong> Almacenamiento direccionado por hash. Imposible perder archivos o generar «Media Offline». Mismas entradas producen idénticos hashes — determinismo puro.</p>
          </div></div>
        </div>

        <!-- PASO 3: La Geoda de Amatista -->
        <div class="spotlight-card col-4" style="background: #090a10; border-left: 4px solid #bf5af2; position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">PASO 3 // GEODA</span>
          <h3 class="card-h3">${isEs ? 'La Pirámide de Bloque Negro y la Punta de Oro' : 'The Black Block Pyramid & The Gold Capstone'}</h3>
          <p class="card-desc">${isEs ? 'Alrededor de los cristales se consolida la pirámide de bloque negro monumental (estilo Egipto, textura Space Black refinada). Al completarse la forma, su punta se vuelve totalmente dorada.' : 'Around the crystals, the black block pyramid consolidates. Upon completion, the capstone turns pure solid gold (YOD).'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">DA'AT: CONCIENCIA ACTIVA — HERRAMIENTA: SHIM REALITY METROLOGY GATE</span>
    <p><strong>Cosmogonía:</strong> Alrededor de los cristales que elevan la estructura se consolida la <strong>Pirámide de Bloque Negro Monumental</strong> (piedra negra con relieve y textura mineral Space Black, no un negro plano muerto) que da soporte a todo. Una vez erigida la pirámide, <strong>la punta se vuelve totalmente dorada</strong> (el piramidión de oro macizo, asiento del motor YOD).</p>
    <p><strong>Da'at no es un abismo pasivo:</strong> Es la conciencia despierta que salta a la acción (fuego de Shin). Rige el principio <code>PLANNED != OBSERVED != RESOLVED</code>, confrontando lo planificado con lo observado.</p>
            <p><strong>Herramienta Real:</strong> <em>SHIM (ש) — Reality Metrology Gate.</em> Auditoría fonética en vivo durante la grabación con Whisper Large V3 local (< 40ms latencia). Live Teleprompter inteligente: si una frase del guion se omite, la pantalla parpadea en ámbar y sugiere re-grabación quirúrgica.</p>
            <p><strong>Bloqueo de Exportación:</strong> Si la distancia Levenshtein GAP > 0.00%, el sistema bloquea la exportación hasta que se corrija la discrepancia. Cero desvíos no autorizados entre plan y audio grabado.</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/shim/index.html" style="color: #2997ff; font-weight: 700;">🔗 Abrir SHIM en Detalle ➔</a></p>
          </div></div>
        </div>

        <!-- PASO 4: El Árbol de la Vida -->
        <div class="spotlight-card col-4" style="background: #090a10; border-left: 4px solid #2997ff; position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">PASO 4 // ÁRBOL</span>
          <h3 class="card-h3">${isEs ? 'El Árbol de la Vida: 10 Esferas y 22 Senderos' : 'Tree of Life: 10 Spheres & 22 Paths'}</h3>
          <p class="card-desc">${isEs ? 'En la base de la pirámide, los cristales crecen formando las 10 Sephiroth como canales de datos del contenido.' : '10 Sephiroth grow at the pyramid base as physical data conduits for content.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">LOS 4 MUNDOS = LAS 4 CARAS DE LA PIRÁMIDE (MODELO HOLOGRÁFICO DION FORTUNE)</span>
    <p><strong>Doctrina de las 4 Caras (No se separan por pisos):</strong> La pirámide posee 4 caras exteriores que corresponden a los 4 Mundos tradicionales, y <strong>cada mundo contiene un Árbol de la Vida completo con sus 10 Sephiroth</strong>:</p>
    <ol style="color: #cbd5e1; font-size: 0.82rem; margin: 8px 0; padding-left: 1.2rem; line-height: 1.6;">
      <li><strong>Cara Sur — Atziluth (Emanación / YOD / Fuego):</strong> El Árbol de la Intención. Define la tesis, los axiomas y el Brand Purpose inmaterial (YOD Engine).</li>
      <li><strong>Cara Occidente — Briah (Creación / HE / Agua):</strong> El Árbol de la Arquitectura. Estructura el Merkle-DAG inmutable en CAS SHA-256, ramifica de 1 a 8 en CONTENIDO y audita las 6 compuertas de HE.</li>
      <li><strong>Cara Oriente — Yetzirah (Formación / VAV / Aire):</strong> El Árbol de la Forja Audiovisual. SHIM audita en set a 0.00% GAPs (Da'at), y VAV Engine forja la pieza en 18s por FFT a -38 dBFS con los 7 motions fijos y EBU R128.</li>
      <li><strong>Cara Norte — Assiah (Acción / Segunda HE / Tierra):</strong> El Árbol de la Manifestación y Retorno Comercial. Despacho adaptativo a 8 redes (Luna 1), analítica de retención (Luna 2) y facturación OCR en SQLite con ROI real (Luna 3).</li>
    </ol>
    <p>El Malkut de cada mundo superior toca y activa el Keter del mundo inferior, cerrando el bucle: <strong>S(t+1) = S(t) + A(t)</strong>.</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}flujo/index.html" style="color: #2997ff; font-weight: 700;">🔗 Ver Ciclo de Vida Completo ➔</a></p>
          </div></div>
        </div>

        <!-- PASO 5: El Ojo Digital 3D -->
        <div class="spotlight-card col-4" style="background: #090a10; border-left: 4px solid #38bdf8; position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">PASO 5 // OJO 3D</span>
          <h3 class="card-h3">${isEs ? 'El Ojo Digital 3D del Arquitecto' : 'The 3D Digital Eye of the Architect'}</h3>
          <p class="card-desc">${isEs ? 'En la punta de oro se abre un micro agujero negro que reorganiza la luz en un Ojo 3D suspendido entre nubes volumétricas.' : 'A micro black hole at the gold apex reorganizes light into a 3D Eye floating in volumetric clouds.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">HERRAMIENTA: ARQUITECTO — COGNICIÓN & TOTAL PRODUCTION COACH</span>
            <p><strong>Cosmogonía:</strong> En la punta de oro se abre un micro agujero negro que absorbe la luz cósmica y la reorganiza en un Ojo Digital 3D suspendido entre nubes volumétricas 3D. El Ojo canaliza la energía de los dos soles y proyecta 3 cristales hacia la estratosfera: las Tres Lunas Orbitales.</p>
            <p><strong>Herramienta Real:</strong> <em>ARQUITECTO — Cognición, Asistencia & Total Production Coach.</em> El Ojo es la inteligencia que supervisa toda la cadena de producción con 4 roles simultáneos:</p>
            <ul style="color: #cbd5e1; font-size: 0.82rem; margin: 8px 0; padding-left: 1.2rem; line-height: 1.6;">
              <li><strong>Coach Exigente:</strong> Audita ritmo, cortes J/L, densidad y coherencia narrativa.</li>
              <li><strong>Asistente Infatigable:</strong> Ejecuta tareas repetitivas sin fatiga ni errores.</li>
              <li><strong>Guía 4D:</strong> Navega las 10 esferas y sugiere el camino óptimo para cada pieza.</li>
              <li><strong>Auditor de Sistema:</strong> Verifica integridad SHA-256, safe zones y mastering final.</li>
            </ul>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/arquitecto/index.html" style="color: #38bdf8; font-weight: 700;">🔗 Abrir ARQUITECTO en Detalle ➔</a></p>
          </div></div>
        </div>

        <!-- PASO 6: Las 3 Lunas Orbitales -->
        <div class="spotlight-card col-4" style="background: #090a10; border-left: 4px solid #30d158; position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">PASO 6 // 3 LUNAS</span>
          <h3 class="card-h3">${isEs ? 'Las 3 Lunas Orbitales y el Bucle Cerrado' : 'The 3 Orbital Moons & Closed Loop'}</h3>
          <p class="card-desc">${isEs ? 'Publicar, medir retención y facturar. La Tierra devuelve datos cerrando el bucle evolutivo S(t+1) = S(t) + A(t).' : 'Publish, measure retention, invoice. Earth returns data closing the evolutionary loop.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">LAS TRES LUNAS: SATÉLITES ORBITALES EXTERIORES (NO SON SEPHIROTH)</span>
    <p><strong>Directiva Canónica:</strong> Las Tres Lunas no son Sephiroth ni habitan dentro de la pirámide. Orbitan en la ionosfera proyectadas por el Ojo 3D de Arquitecto:</p>
    <p><strong>Luna 1 — El Publicador Multicanal:</strong> Satélite de distribución que adapta y emite a las 8 plataformas respetando Safe Zones 9:16 (280px inferiores y 120px derechos libres).</p>
    <p><strong>Luna 2 — Analizador de Retención:</strong> Satélite sensorial que audita APV y drop-off a los 3s; si la retención cae de 60%, penaliza con -25 puntos al Hook Score de YOD.</p>
    <p><strong>Luna 3 — La Luna Comercial:</strong> Satélite de recolección física con escáner OCR on-device en Python que lee facturas y comprobantes, registrando el dinero en SQLite (metrics.db) y calculando el ROI matemático exacto.</p>
    <p><strong>Cierre del Bucle Continuo:</strong> La telemetría de las lunas nutre la base de la pirámide y asciende a YOD: <strong>S(t+1) = S(t) + A(t)</strong>.</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}luna-comercial/index.html" style="color: #30d158; font-weight: 700;">🔗 Abrir Luna Comercial ➔</a></p>
          </div></div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <a href="${langPrefix}cosmogonia/index.html" class="btn-apple-cta" style="background: rgba(254,240,138,0.2); border: 1px solid #fef08a;">${isEs ? '☀️ Leer la Cosmogonía Solar Completa ➔' : '☀️ Read the Full Solar Cosmology ➔'}</a>
      </div>
    </section>

    <!-- 3. SECTION: INTERACTIVE 8-IN-1 FORMAT VIEWER -->
    <section id="viewer" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #2997ff;">ECOSISTEMA 8-EN-1 // MULTI-PLATAFORMA</span>
        <h2 class="h2">${isEs ? 'Una Sola Idea. Ocho Formatos Vivos.' : 'One Core Idea. Eight Living Formats.'}</h2>
        <p class="p">${isEs ? 'Herramienta CONTENIDO (Chesed, Esfera 05): de 1 semilla validada se derivan 8 formatos sincronizados en cascada Merkle-DAG. Editar una frase actualiza los 8 automáticamente.' : 'CONTENIDO tool (Chesed, Sphere 05): from 1 validated seed, 8 formats cascade-sync via Merkle-DAG.'}</p>
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
          <p class="viewer-p" id="viewer-active-desc">${isEs ? 'Herramienta VAV CUTS genera auto-corte en 18s. VAV CAPTIONS sincroniza subtítulos palabra por palabra con Whisper. VAV MOTIONS aplica 13 familias de motion y VAV MASTERING normaliza a -14 LUFS.' : 'VAV CUTS auto-edit in 18s. VAV CAPTIONS syncs word-by-word subtitles. VAV MOTIONS applies 13 motion families. VAV MASTERING normalizes to -14 LUFS.'}</p>
          <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); margin-top: 1.5rem;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: #d4af37; font-weight: 700;">VELOCIDAD DE SÍNTESIS:</span>
            <div id="viewer-active-speed" style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-top: 4px;">18s auto-corte</div>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <a href="${langPrefix}ecosistema/index.html" class="btn-apple-cta" style="background: rgba(41,151,255,0.15); border: 1px solid #2997ff;">${isEs ? '⚡ Explorar Ecosistema 8-en-1 ➔' : '⚡ Explore 8-in-1 Ecosystem ➔'}</a>
        <a href="${langPrefix}tools/contenido/index.html" class="btn-control-center" style="font-size: 0.9rem; padding: 12px 22px; margin-left: 12px;">${isEs ? '📄 Herramienta CONTENIDO' : '📄 CONTENIDO Tool'}</a>
      </div>
    </section>

    <!-- 4. SECTION: LAS TRES LUNAS & TELEMETRÍA COMERCIAL -->
    <section id="tres-lunas" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #30d158;">COMMERCE TELEMETRY // LAS TRES LUNAS DE RETORNO</span>
        <h2 class="h2">${isEs ? 'El Bucle de Tres Lunas: De Vistas a Ventas' : 'The Three Moons: From Views to Revenue'}</h2>
        <p class="p">${isEs ? 'Tres herramientas orbitales que cierran el ciclo: publicar a 8 canales (Luna 1), medir retención segundo a segundo (Luna 2) y atribuir ventas reales por OCR (Luna 3).' : 'Three orbital tools closing the loop: publish to 8 channels, measure retention per second, attribute real sales via OCR.'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-4" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">LUNA 01 // PUBLICADOR</span>
          <h4 class="card-h3">${isEs ? 'Herramienta: LUNA 1 — Distribución a 8 Canales' : 'Tool: LUNA 1 — 8-Channel Dispatch'}</h4>
          <p class="card-desc">${isEs ? 'Esfera Netzach (08). Empaquetado adaptativo con metadatos optimizados por canal: resolución nativa, hashtags, thumbnails y scheduling.' : 'Netzach Sphere (08). Adaptive packaging with per-channel metadata.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">LUNA 1 — NETZACH (ESFERA 08) — DESPACHO MULTICANAL</span>
            <p><strong>Función:</strong> Empaquetado y distribución automática a las 8 plataformas sociales con metadatos optimizados por canal.</p>
            <p><strong>Adaptadores nativos:</strong> TikTok API, Instagram Graph API, YouTube Data API v3, X/Twitter API, Substack, Spotify for Podcasters, LinkedIn Newsletter, Beehiiv.</p>
            <p><strong>Cada paquete incluye:</strong> Resolución nativa (9:16, 4:5, 16:9), hashtags optimizados, thumbnail personalizado, descripción SEO-ready y scheduling programado.</p>
          </div></div>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">LUNA 02 // RETENCIÓN</span>
          <h4 class="card-h3">${isEs ? 'Herramienta: LUNA 2 — Retención Segundo a Segundo' : 'Tool: LUNA 2 — Per-Second Retention'}</h4>
          <p class="card-desc">${isEs ? 'Esfera Hod (09). Ingesta de curvas de drop-off y re-alimentación directa al radar de ganchos de YOD.' : 'Hod Sphere (09). Drop-off curve ingestion that feeds back into YOD hook radar.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">LUNA 2 — HOD (ESFERA 09) — BUCLE CERRADO</span>
            <p><strong>Operador de Aprendizaje:</strong> S(t+1) = S(t) + A(t). El estado del sistema en el siguiente ciclo es igual al estado actual más las acciones correctivas derivadas de la telemetría.</p>
            <p><strong>Ingesta de datos:</strong> Curvas de drop-off segundo a segundo, Average Percentage Viewed (APV), tasa de guardado, compartidos y ratio de comentarios sobre vistas.</p>
            <p><strong>Penalización YOD:</strong> Si la retención cae más del 30% en los primeros 3 segundos, YOD descarta automáticamente esa estructura de gancho y genera 3 alternativas dialécticas.</p>
          </div></div>
        </div>

        <div class="spotlight-card col-4" style="position: relative; border-color: rgba(48,209,88,0.4);">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">LUNA 03 // VENTAS & OCR</span>
          <h4 class="card-h3">${isEs ? 'Herramienta: LUNA 3 — Libro Contable & Closers' : 'Tool: LUNA 3 — Sales Ledger & Closers'}</h4>
          <p class="card-desc">${isEs ? 'Esfera Malkhut (10). Escáner OCR de facturas, atribución de ventas por contentId y cálculo matemático de ROI.' : 'Malkhut Sphere (10). OCR invoice scanner, per-contentId attribution and ROI calculation.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">LUNA 3 — MALKHUT (ESFERA 10) — COMERCIO Y GERENCIA</span>
            <p><strong>Escáner OCR de Facturas:</strong> Toma una foto de la factura física, captura de MercadoLibre, comprobante de transferencia o ticket POS. El motor extrae: Monto, Fecha, SKU/Producto, Nombre de Comprador y Canal.</p>
            <p><strong>Libro Contable por Pieza:</strong> Cada contenido (contentId) mantiene un registro vivo de cuántas unidades vendió y cuántos dólares generó.</p>
            <p><strong>Panel de Closers:</strong> Telemetría de vendedores — leads atendidos, ventas cerradas, ratio de conversión y comisiones calculadas.</p>
            <p><strong>Ecuación de ROI:</strong> ROI = ((Facturación Atribuida - Costos) / Costos) × 100%. Con ABRAXAS en Apple Silicon, el costo de producción tiende a cero.</p>
          </div></div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 2rem;">
        <a href="${langPrefix}luna-comercial/index.html" class="btn-apple-cta" style="background: rgba(48,209,88,0.15); border: 1px solid #30d158;">${isEs ? '🌙 Explorar Luna Comercial & OCR ➔' : '🌙 Explore Sales Moon & OCR ➔'}</a>
      </div>
    </section>

    <!-- 5. SECTION: BRANDING & CAMPAÑAS YOD -->
    <section id="branding" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #bf5af2;">ATZILUTH STRATEGY // YOD CAMPAIGN ENGINE</span>
        <h2 class="h2">${isEs ? 'El ABRAXAS Branding Method & Diagnóstico' : 'ABRAXAS Branding Method & Diagnostic'}</h2>
        <p class="p">${isEs ? 'La matriz de 4 vectores estratégicos convierte dolores fundacionales en autoridad de mercado. Herramienta: YOD Niche Opportunity Engine.' : 'The 4-vector strategic matrix mapping origin to authority. Tool: YOD Niche Opportunity Engine.'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag ruby">1. ORIGEN (DOLOR)</span>
          <h4 class="card-h3">${isEs ? 'De Dónde Vienes' : 'Where You Come From'}</h4>
          <p class="card-desc">${isEs ? 'Cuellos de botella, dependencia de agencias lentas y mensajes desconectados.' : 'Bottlenecks, agency dependency and disconnected messaging.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VECTOR 1 — DIAGNÓSTICO DE DOLOR</span>
            <p><strong>Preguntas clave:</strong> ¿Cuánto dinero y tiempo pierdes al mes en agencias externas? ¿Cuántos contenidos produces vs. cuántos necesitas? ¿Tienes control real sobre tu mensaje?</p>
            <p><strong>Fricciones típicas:</strong> Dependencia de editores lentos, mensajes desconectados entre redes, cero atribución de ventas al contenido, fatiga creativa del fundador.</p>
            <p><strong>Resultado:</strong> Un mapa de cuellos de botella cuantificados con impacto directo en facturación perdida.</p>
          </div></div>
        </div>
        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">2. DESTINO (VISIÓN)</span>
          <h4 class="card-h3">${isEs ? 'A Dónde Quieres Ir' : 'Where You Want to Go'}</h4>
          <p class="card-desc">${isEs ? 'Metas de facturación, soberanía productiva y liderazgo de categoría medible.' : 'Revenue targets, production sovereignty, and measurable category leadership.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VECTOR 2 — VISIÓN DE DESTINO</span>
            <p><strong>Definición precisa:</strong> Metas de facturación mensual, número de activos por semana, soberanía técnica (cero costos recurrentes de API o cloud), liderazgo de categoría medible.</p>
            <p><strong>Escalabilidad soberana:</strong> Operación 100% local en Apple Silicon. Sin servidores, sin suscripciones mensuales, sin dependencia de terceros. Tu MacBook Pro ES tu estudio de producción completo.</p>
          </div></div>
        </div>
        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">3. IDENTIDAD ACTUAL</span>
          <h4 class="card-h3">${isEs ? 'Quién Eres Ahora' : 'Who You Are Now'}</h4>
          <p class="card-desc">${isEs ? 'Axiomas inmutables de marca, ventajas competitivas y casos de éxito reales.' : 'Immutable brand axioms, competitive advantages, real success cases.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VECTOR 3 — AXIOMAS DE MARCA INMUTABLES</span>
            <p><strong>YOD Brand Core & Axiom Vault:</strong> Ingesta de la voz de marca, verdades innegociables, ventajas competitivas reales y casos de éxito verificables. Se almacenan en el Lienzo como bloque inmutable.</p>
            <p><strong>Anti-alucinación:</strong> Ningún agente de IA puede contradecir ni inventar información que no esté en el Brand Core. Esto elimina el «AI-slop».</p>
          </div></div>
        </div>
        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">4. POTENCIAL EXPANDIDO</span>
          <h4 class="card-h3">${isEs ? 'Quién Puedes Llegar a Ser' : 'Who You Could Become'}</h4>
          <p class="card-desc">${isEs ? 'Tesis de nicho contraria calificada de 0 a 100 que elimina la competencia por precio.' : 'Contrary niche thesis scored 0-100 that eliminates price competition.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VECTOR 4 — TESIS DE NICHO + 4 CAMPAÑAS PRE-DISEÑADAS</span>
            <p><strong>YOD Niche Opportunity Engine:</strong> Escanea los 3 dogmas más repetidos en tu industria y genera una tesis contraria calificada de 0 a 100.</p>
            <p><strong>Fórmula Hook Score:</strong> (Tensión × 0.4) + (Claridad × 0.3) + (Autoridad × 0.3). Score mínimo obligatorio: 85/100.</p>
            <p><strong>4 Campañas Pre-diseñadas:</strong></p>
            <ol style="color: #cbd5e1; font-size: 0.82rem; margin: 8px 0; padding-left: 1.2rem; line-height: 1.6;">
              <li><strong>Conquista de Nicho:</strong> Deconstrucción de los 3 mitos más repetidos en la industria.</li>
              <li><strong>Reactivación WhatsApp:</strong> Reactivación de bases de datos frías mediante caso de estudio real.</li>
              <li><strong>Gran Monumento YouTube:</strong> Manifiesto visual y técnico de 15 minutos que establece el estándar de oro.</li>
              <li><strong>Cierre High-Ticket:</strong> Serie de 3 piezas de ultra-especificación orientada a directores y decisores.</li>
            </ol>
          </div></div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <a href="${langPrefix}branding-method/index.html" class="btn-apple-cta" style="background: rgba(191,90,242,0.15); border: 1px solid #bf5af2;">${isEs ? '🎯 Explorar Branding Method ➔' : '🎯 Explore Branding Method ➔'}</a>
      </div>
    </section>

    <!-- 6. SECTION: LAS 16 HERRAMIENTAS & MOTOR VAV COMPLETO -->
    <section id="tools" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #d4af37;">INVENTARIO COMPLETO // 16 HERRAMIENTAS DE PRODUCCIÓN</span>
        <h2 class="h2">${isEs ? 'Las 16 Herramientas del Sistema ABRAXAS' : 'The 16 ABRAXAS System Tools'}</h2>
        <p class="p">${isEs ? 'Cada módulo es una herramienta de software real con especificaciones técnicas verificables, no una metáfora. Haz clic en + para ver los detalles.' : 'Each module is a real software tool with verifiable specs, not a metaphor. Click + for details.'}</p>
      </div>

      <div class="bento-grid">
        <!-- VAV CUTS -->
        <div class="spotlight-card col-4" style="position: relative; border-left: 3px solid #d4af37;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">05. VAV CUTS (ו)</span>
          <h4 class="card-h3">${isEs ? 'Auto-Edición en 18 Segundos' : '18-Second Auto-Edit'}</h4>
          <p class="card-desc">${isEs ? 'Tiferet, Esfera 07. Detección de silencios RMS por ventana FFT de 10ms a -38 dBFS con respiraciones orgánicas de 80ms.' : 'Tiferet, Sphere 07. RMS silence detection via 10ms FFT at -38 dBFS.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VAV CUTS — AUTO-CORTE RMS</span>
            <p><strong>Algoritmo:</strong> Ventana FFT de 10ms con umbral RMS a -38 dBFS. Todo silencio > 120ms se elimina quirúrgicamente. Pre/post-padding de 80ms con micro-fades parabólicos de 5ms.</p>
            <p><strong>3 Niveles de Densidad:</strong> 1) Cinematic Minimal: cortes cada 10-15s (CEOs, ensayos YouTube). 2) Dynamic Authority: cada 3-5s (Reels, Instagram). 3) Hyper-Retention Rush: cada 1.5-2.5s (TikTok, Shorts).</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/vav/cuts/index.html" style="color: #d4af37; font-weight: 700;">🔗 Abrir VAV CUTS ➔</a></p>
          </div></div>
        </div>

        <!-- VAV CAPTIONS -->
        <div class="spotlight-card col-4" style="position: relative; border-left: 3px solid #2997ff;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">06. VAV CAPTIONS</span>
          <h4 class="card-h3">${isEs ? 'Subtítulos Cinéticos Whisper' : 'Kinetic Whisper Captions'}</h4>
          <p class="card-desc">${isEs ? '4 estilos: Viral Gold, Cyber Neon, Clean Minimal, Kinetic Impact. Sincronización palabra por palabra por microsegundos.' : '4 styles: Viral Gold, Cyber Neon, Clean Minimal, Kinetic Impact. Word-by-word microsecond sync.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VAV CAPTIONS — SUBTÍTULOS CINÉTICOS</span>
            <p><strong>4 Estilos:</strong> Viral Gold (dorado brillante, sombra proyectada), Cyber Neon (futurista con glow), Clean Minimal (SF Pro blanco limpio), Kinetic Impact (tipografía que impacta con rebote spring).</p>
            <p><strong>Sincronización:</strong> Palabra por palabra con timestamps de microsegundos extraídos de Whisper Large V3 local. Safe Zone OCR en 9:16 y 4:5.</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/vav/captions/index.html" style="color: #2997ff; font-weight: 700;">🔗 Abrir VAV CAPTIONS ➔</a></p>
          </div></div>
        </div>

        <!-- VAV MOTIONS -->
        <div class="spotlight-card col-4" style="position: relative; border-left: 3px solid #bf5af2;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">07. VAV MOTIONS</span>
          <h4 class="card-h3">${isEs ? '13 Familias de Motion Remotion' : '13 Motion Families (Remotion)'}</h4>
          <p class="card-desc">${isEs ? 'Física de resortes elásticos: mass 0.5, damping 12, stiffness 100. Zoom, Push, Pan, Parallax, Whip y más.' : 'Spring physics: mass 0.5, damping 12, stiffness 100. Zoom, Push, Pan, Parallax, Whip.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VAV MOTIONS — 13 FAMILIAS CINÉTICAS</span>
            <p><strong>Familias:</strong> Zoom In, Zoom Out, Push In, Pull Out, Pan Left, Pan Right, Scale, Translate, Fade In, Fade Out, Wipe, Parallax, Whip Transition.</p>
            <p><strong>Física de Resortes Elásticos:</strong> Cada motion usa mass: 0.5, damping: 12, stiffness: 100. El resultado es movimiento orgánico que evita la rigidez lineal.</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/vav/motions/index.html" style="color: #bf5af2; font-weight: 700;">🔗 Abrir 13 Motions ➔</a></p>
          </div></div>
        </div>

        <!-- VAV VFX -->
        <div class="spotlight-card col-4" style="position: relative; border-left: 3px solid #38bdf8;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">08. VAV VFX</span>
          <h4 class="card-h3">${isEs ? 'Efectos Ópticos & Mapa de Profundidad' : 'Optical FX & Depth Map'}</h4>
          <p class="card-desc">${isEs ? 'Zooms ópticos progresivos de 1.0x a 1.35x en picos de tensión. Blur selectivo para aislar al orador.' : 'Progressive optical zooms 1.0x→1.35x at tension peaks. Selective depth blur to isolate speaker.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VAV VFX — MOTOR DE EFECTOS ÓPTICOS</span>
            <p><strong>Zooms ópticos:</strong> Progresivos del 1.0x al 1.35x en picos de tensión narrativa.</p>
            <p><strong>Depth Map Blur:</strong> Mapa de profundidad selectivo para aislar al orador y crear fondo cinematográfico.</p>
            <p><strong>Directiva del Coach:</strong> Cero efectos decorativos gratuitos sin anclaje en el guion.</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/vav/vfx/index.html" style="color: #38bdf8; font-weight: 700;">🔗 Abrir VAV VFX ➔</a></p>
          </div></div>
        </div>

        <!-- VAV FRAMING -->
        <div class="spotlight-card col-4" style="position: relative; border-left: 3px solid #30d158;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">09. VAV FRAMING</span>
          <h4 class="card-h3">${isEs ? 'Multi-Cámara desde 1 Sola Toma' : 'Multi-Camera from 1 Single Take'}</h4>
          <p class="card-desc">${isEs ? 'Transforma un video estático 4K en producción multi-ángulo: Close-Up 1.35x, Ángulo 45°, Picado y Contrapicado.' : 'Transforms static 4K into multi-angle production: Close-Up 1.35x, 45° Angle, High/Low Angle.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VAV FRAMING — MULTI-CÁMARA DINÁMICA</span>
            <p><strong>Planos Básicos:</strong> Plano Medio Frontal (1.0x), Close-Up Emocional (1.35x), Ángulo 45° Desplazado (Regla de Tercios).</p>
            <p><strong>Planos Experimentales:</strong> Ángulo Picado (High Angle), Contrapicado de Autoridad (Low Angle), Dutch Angle (Inclinación 4°).</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/vav/framing/index.html" style="color: #30d158; font-weight: 700;">🔗 Abrir VAV FRAMING ➔</a></p>
          </div></div>
        </div>

        <!-- VAV CAROUSEL -->
        <div class="spotlight-card col-4" style="position: relative; border-left: 3px solid #d4af37;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">10. VAV CAROUSEL</span>
          <h4 class="card-h3">${isEs ? 'Tipografía Inteligente & Capas PNG' : 'Smart Typography & PNG Layers'}</h4>
          <p class="card-desc">${isEs ? 'Auto-montaje de carruseles desde fotos limpias. Animaciones Typewriter, Elastic Pop, Block Fade y Paper-Cut overlay.' : 'Auto-assembly from clean photos. Typewriter, Elastic Pop, Block Fade animations & Paper-Cut overlay.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VAV CAROUSEL — TIPOGRAFÍA & CAPAS</span>
            <p><strong>Auto-montaje:</strong> Desde fotos limpias sin texto guardadas en la carpeta del proyecto.</p>
            <p><strong>Animaciones:</strong> Typewriter (letra a letra, 25-60ms), Kinetic Elastic Pop (palabra con rebote spring), Smooth Block Fade (oraciones completas).</p>
            <p><strong>Paper-Cut:</strong> Superposición de PNGs con caída con sombra realista, difuminado suave o flotación senoidal.</p>
            <p><strong>Modos:</strong> 100% automatizado con agentes de IA o 100% manual con control tipográfico.</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/vav/carousel/index.html" style="color: #d4af37; font-weight: 700;">🔗 Abrir VAV CAROUSEL ➔</a></p>
          </div></div>
        </div>

        <!-- VAV MASTERING -->
        <div class="spotlight-card col-4" style="position: relative; border-left: 3px solid #ff6b6b;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag ruby">11. VAV MASTERING</span>
          <h4 class="card-h3">${isEs ? 'Ingeniería Acústica de Broadcast' : 'Broadcast Acoustic Engineering'}</h4>
          <p class="card-desc">${isEs ? 'Normalización a -14.0 LUFS Integrated / -1.0 dBTP Peak. High-pass 80Hz, EQ dinámico 350Hz, de-esser 6.5kHz.' : '-14.0 LUFS / -1.0 dBTP. High-pass 80Hz, dynamic EQ 350Hz, de-esser 6.5kHz.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">VAV MASTERING — CADENA ACÚSTICA COMPLETA</span>
            <p><strong>Cadena de Mastering:</strong></p>
            <ol style="color: #cbd5e1; font-size: 0.82rem; margin: 8px 0; padding-left: 1.2rem; line-height: 1.6;">
              <li>High-pass filter a 80Hz (elimina rumble y vibraciones mecánicas).</li>
              <li>Ecualizador dinámico a 350Hz (reduce nasalidad y mud).</li>
              <li>De-esser a 6.5kHz (controla sibilancias sin apagar la presencia vocal).</li>
              <li>Limitador Brickwall en la salida final.</li>
              <li>Normalización a -14.0 LUFS Integrated / -1.0 dBTP Peak.</li>
            </ol>
          </div></div>
        </div>

        <!-- HE Operations Desk -->
        <div class="spotlight-card col-4" style="position: relative; border-left: 3px solid #bf5af2;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">12. HE (ה) KANBAN</span>
          <h4 class="card-h3">${isEs ? 'Ventana Operativa & 50 Lotes macOS' : 'Operations Desk & 50 Batch macOS'}</h4>
          <p class="card-desc">${isEs ? 'Gevurah, Esfera 06. 6 compuertas de calidad inmutables. Tablero Kanban nativo gobernado en 1 tarde por 1 operador.' : 'Gevurah, Sphere 06. 6 immutable quality gates. Native Kanban governed in 1 afternoon.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">HE — 6 COMPUERTAS INMUTABLES</span>
            <p><strong>Las 6 Compuertas:</strong></p>
            <ol style="color: #cbd5e1; font-size: 0.82rem; margin: 8px 0; padding-left: 1.2rem; line-height: 1.6;">
              <li>Verificación fonética SHIM 0% GAPs.</li>
              <li>Safe zones de 9:16 probadas contra UI de Instagram y TikTok.</li>
              <li>Directiva no_sfx_needed aplicada.</li>
              <li>Sidechain ducking de música a -18dB.</li>
              <li>Formatos derivados Merkle-DAG sincronizados.</li>
              <li>Aprobación final con firma criptográfica SHA-256.</li>
            </ol>
            <p><strong>Base de datos:</strong> SQLite local 'metrics.db' con tablas: assets, renders, discrepancies, sales_ledger y closers_performance.</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/he/index.html" style="color: #bf5af2; font-weight: 700;">🔗 Abrir HE en Detalle ➔</a></p>
          </div></div>
        </div>

        <!-- ARQUITECTO -->
        <div class="spotlight-card col-4" style="position: relative; border-left: 3px solid #38bdf8;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">13. ARQUITECTO</span>
          <h4 class="card-h3">${isEs ? 'Total Production Coach & Cognición' : 'Total Production Coach & Cognition'}</h4>
          <p class="card-desc">${isEs ? '4 Roles: Coach Exigente, Asistente Infatigable, Guía 4D y Auditor de Sistema. Supervisa toda la cadena.' : '4 Roles: Demanding Coach, Tireless Assistant, 4D Guide, System Auditor.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">ARQUITECTO — TOTAL PRODUCTION COACH</span>
            <p><strong>Editing Coach:</strong> Cortes J y L (audio entra 300ms antes/después del corte visual). Prohibición de saltos de corte sin justificación narrativa.</p>
            <p><strong>SFX Coach:</strong> Directiva 'no_sfx_needed'. Si un efecto sonoro no tiene anclaje visual o emocional en el guion, se silencia. Cero whooshes decorativos.</p>
            <p><strong>Music Coach:</strong> Sidechain ducking a -18dB cuando habla la voz. Compresión sobre frecuencia vocal (85Hz-8kHz), ratio 4:1, attack 5ms, release 200ms.</p>
            <p style="margin-top: 8px;"><a href="${langPrefix}tools/arquitecto/index.html" style="color: #38bdf8; font-weight: 700;">🔗 Abrir ARQUITECTO ➔</a></p>
          </div></div>
        </div>
      </div>
    </section>

    <!-- 7. SECTION: LEYES EDITORIALES & DIRECCIÓN DE ARTE -->
    <section id="leyes" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #fef08a;">CANON DE GUSTOS // LEYES EDITORIALES & DIRECCIÓN DE ARTE</span>
        <h2 class="h2">${isEs ? 'Las 3 Leyes Editoriales y la Dirección de Arte Apple 2026' : '3 Editorial Laws & Apple 2026 Art Direction'}</h2>
        <p class="p">${isEs ? 'Reglas innegociables que gobiernan la dignidad del contenido y la estética visual del sistema.' : 'Non-negotiable rules governing content dignity and system visual aesthetics.'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-4" style="position: relative; border-left: 4px solid #fef08a;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">LEY 01</span>
          <h4 class="card-h3">${isEs ? 'Tema ≠ Idea' : 'Topic ≠ Idea'}</h4>
          <p class="card-desc">${isEs ? '«Productividad» es un tema hueco. Una idea es una afirmación dialéctica comprobable que abre deuda narrativa.' : '"Productivity" is a hollow topic. An idea is a provable dialectical assertion.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">LEY EDITORIAL #1 — TEMA ≠ IDEA</span>
            <p>Un <strong>tema</strong> es una categoría amplia y hueca: «Productividad», «Liderazgo», «Marketing digital». No genera tensión, ni curiosidad, ni argumento.</p>
            <p>Una <strong>idea</strong> es una afirmación dialéctica concreta y comprobable: «Los 3 motivos por los que el 85% de los fundadores pierden dinero en editores de video que no entienden su negocio.» Abre una deuda narrativa que el contenido debe pagar.</p>
            <p><strong>Regla ABRAXAS:</strong> YOD rechaza automáticamente semillas que contengan solo un tema sin tesis concreta. Hook Score = 0.</p>
          </div></div>
        </div>

        <div class="spotlight-card col-4" style="position: relative; border-left: 4px solid #bf5af2;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">LEY 02</span>
          <h4 class="card-h3">${isEs ? 'Deuda Narrativa Obligatoria' : 'Mandatory Narrative Debt'}</h4>
          <p class="card-desc">${isEs ? 'El gancho abre una promesa que el cuerpo y cierre pagan exactamente. Si no la pagas, pierdes autoridad.' : 'The hook opens a promise that the body and close must pay exactly.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">LEY EDITORIAL #2 — DEUDA NARRATIVA</span>
            <p>Cada pieza de contenido funciona como un préstamo de atención: el <strong>Hook</strong> abre una promesa implícita (la deuda), el <strong>cuerpo</strong> construye la evidencia, y el <strong>Payoff</strong> la paga con creces.</p>
            <p><strong>Si la deuda no se paga:</strong> El espectador siente frustración subliminal, el APV cae y Luna 2 registra la caída de retención como penalización en YOD.</p>
            <p><strong>Estructura del Lienzo:</strong> Hook → Tesis → Mecanismo → Payoff. Los 4 tiempos son obligatorios.</p>
          </div></div>
        </div>

        <div class="spotlight-card col-4" style="position: relative; border-left: 4px solid #ff6b6b;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag ruby">LEY 03</span>
          <h4 class="card-h3">${isEs ? 'Prohibición de AI-Slop' : 'AI-Slop Prohibition'}</h4>
          <p class="card-desc">${isEs ? 'Cero clichés genéricos. Solo mecanismos y números reales. YOD Brand Core bloquea alucinaciones de IA.' : 'Zero generic clichés. Only real mechanisms and numbers. YOD blocks AI hallucinations.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">LEY EDITORIAL #3 — ANTI AI-SLOP</span>
            <p><strong>AI-Slop:</strong> Contenido generado por IA que es correcto gramaticalmente pero vacío de sustancia: clichés, frases motivacionales genéricas, conclusiones sin datos.</p>
            <p><strong>Protección ABRAXAS:</strong> El YOD Brand Core & Axiom Vault contiene las verdades verificables de la marca. Ningún agente de IA puede generar frases que no estén respaldadas por datos, casos reales o axiomas del vault.</p>
            <p><strong>Métrica de Coherencia:</strong> Coherencia(A, B) = (A · B) / (||A|| ||B||) ≥ 0.88. Si cae por debajo, se marca como AI-slop y exige reformulación humana.</p>
          </div></div>
        </div>
      </div>

      <div class="bento-grid" style="margin-top: 1.5rem;">
        <div class="spotlight-card col-12" style="position: relative; border: 1px solid rgba(212,175,55,0.3); background: linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(9,10,16,0.95) 100%);">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">DIRECCIÓN DE ARTE APPLE 2026</span>
          <h4 class="card-h3">${isEs ? 'Canon Visual: Negro OLED, Amatista & Oro' : 'Visual Canon: OLED Black, Amethyst & Gold'}</h4>
          <p class="card-desc">${isEs ? 'Fondo Negro Puro (#000), Chassis Space Black, acentos Saffron Gold / Electric Iris / Emerald / Cyan, 3% Film Grain 35mm, tipografía SF Pro.' : 'Pure Black (#000), Space Black chassis, Saffron/Iris/Emerald/Cyan accents, 3% Film Grain 35mm, SF Pro typography.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">DIRECCIÓN DE ARTE — ESPECIFICACIÓN COMPLETA</span>
            <p><strong>Paleta de Colores:</strong></p>
            <ul style="color: #cbd5e1; font-size: 0.82rem; margin: 8px 0; padding-left: 1.2rem; line-height: 1.6;">
              <li>Fondo: Negro Puro OLED (#000000)</li>
              <li>Chasis Space Black: #0b0b0f, #161617, #1d1d1f, #2d2d2f</li>
              <li>Saffron Gold: #d4af37 — Acento principal de lujo</li>
              <li>Electric Iris: #bf5af2 — Creatividad y profundidad</li>
              <li>Emerald: #30d158 — Éxito y retorno comercial</li>
              <li>Cyan: #2997ff — Tecnología y precisión</li>
            </ul>
            <p><strong>Textura:</strong> 3% Film Grain dinámico en 35mm sobre todo el viewport.</p>
            <p><strong>Tipografía:</strong> SF Pro Display para headlines, SF Pro Text para body, SF Mono para datos técnicos y código.</p>
            <p><strong>Interactividad:</strong> Botón '+' estilo Apple en la esquina de cada cuadro que rota 45° a '✕' y despliega el drawer técnico con especificaciones completas.</p>
          </div></div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <a href="${langPrefix}gustos-canon/index.html" class="btn-apple-cta" style="background: rgba(254,240,138,0.15); border: 1px solid #fef08a;">${isEs ? '🎨 Ver Canon de Gustos Completo ➔' : '🎨 View Full Taste Canon ➔'}</a>
      </div>
    </section>

    <!-- 8. SECTION: HARDWARE & RENDIMIENTO M-SERIES -->
    <section id="performance" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #2997ff;">SILICON ARCHITECTURE // ACCELERATION & ZERO LATENCY</span>
        <h2 class="h2">${isEs ? 'Aceleración Nativa en Apple Silicon (M-Series)' : 'Native Apple Silicon M-Series Acceleration'}</h2>
        <p class="p">${isEs ? 'Aprovechamiento determinista de los motores de hardware ProRes, Neural Engine de 16 núcleos y arquitectura de memoria unificada UMA. Soberanía local absoluta.' : 'Deterministic hardware acceleration via ProRes engines, 16-core Neural Engine and UMA memory. Absolute local sovereignty.'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-4" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">MEDIA ENGINE</span>
          <h4 class="card-h3">VideoToolbox ProRes & HEVC</h4>
          <p class="card-desc">${isEs ? 'Renderizado de videos en tiempo récord mediante aceleradores de hardware sin saturar la CPU.' : 'Record-breaking video rendering via hardware accelerators without CPU saturation.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">ESPECIFICACIÓN HARDWARE</span>
            <p>Pipelines directos con ffmpeg compilado para Apple Silicon con soporte VideoToolbox hwaccel. Cero caídas de cuadros y latencia de transcodificación inferior a 3.2 segundos por minuto de video 4K.</p>
            <p><strong>Soberanía Total:</strong> Tu MacBook Pro ES tu estudio de producción. Cero servidores, cero suscripciones, cero costos de API recurrentes.</p>
          </div></div>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">NEURAL ENGINE</span>
          <h4 class="card-h3">Whisper Large V3 On-Device</h4>
          <p class="card-desc">${isEs ? 'Transcripción fonética continua a 40ms sin enviar un byte de audio a servidores externos.' : 'Continuous phonetic transcription at 40ms latency, zero bytes sent externally.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">PRIVACIDAD & SOBERANÍA</span>
            <p>Modelos cuantizados CoreML ejecutados en el Apple Neural Engine (ANE) de 16 núcleos. Tu voz, estrategias y borradores permanecen 100% soberanos y confidenciales dentro de tu máquina.</p>
          </div></div>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">UMA MEMORY</span>
          <h4 class="card-h3">${isEs ? 'Almacenamiento CAS Cero-Copia' : 'Zero-Copy CAS Storage'}</h4>
          <p class="card-desc">${isEs ? 'Transmisión de texturas y clips entre CPU, GPU y Neural Engine sin cuellos de botella de bus.' : 'Texture and clip transfer between CPU, GPU and Neural Engine without bus bottlenecks.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">RENDIMIENTO CRIPTOGRÁFICO</span>
            <p>Almacenamiento direccionado por contenido (CAS) con hashes SHA-256 calculados directamente en registros ARMv8 Crypto Extensions. Determinismo puro: mismas entradas = idénticos hashes.</p>
          </div></div>
        </div>
      </div>
    </section>

    <!-- 9. SECTION: GOBERNANZA & ALTA DIRECCIÓN HE -->
    <section id="governance" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #bf5af2;">OPERATIONS DESK // VENTANA HE EN MACOS</span>
        <h2 class="h2">${isEs ? 'Gobernanza de 50 Activos al Mes en una Sola Tarde' : '50 Monthly Assets Governed in One Afternoon'}</h2>
        <p class="p">${isEs ? 'Herramienta HE (Gevurah, Esfera 06). Un solo operador con criterio comanda una fábrica de contenido entera con persistencia SQLite soberana.' : 'HE Tool (Gevurah, Sphere 06). A single operator commands an entire content factory with sovereign SQLite persistence.'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">KANBAN NATIVO</span>
          <h4 class="card-h3">${isEs ? 'Flujo de 6 Compuertas Inmutables' : '6 Immutable Quality Gates'}</h4>
          <p class="card-desc">${isEs ? 'De SEMILLA a PUBLISHED: cada activo supera auditorías de audio, márgenes WCAG, directiva no_sfx y firma SHA-256.' : 'From SEED to PUBLISHED: each asset passes audio audits, WCAG margins, no_sfx directive, SHA-256 signature.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">LAS 6 COMPUERTAS DE HE</span>
            <p>1) Verificación fonética SHIM 0% GAPs.<br/>2) Safe zones de 9:16 probadas contra UI de Instagram y TikTok.<br/>3) Directiva no_sfx_needed aplicada.<br/>4) Sidechain ducking de música a -18dB.<br/>5) Formatos derivados Merkle-DAG sincronizados.<br/>6) Aprobación final con firma criptográfica SHA-256.</p>
            <p><strong>Estados del Lienzo:</strong> PLANNED → OBSERVED → RESOLVED → PRODUCTION → PUBLISHED → LEARNING.</p>
          </div></div>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">COST TELEMETRY</span>
          <h4 class="card-h3">${isEs ? 'Base de Datos SQLite metrics.db' : 'SQLite metrics.db Database'}</h4>
          <p class="card-desc">${isEs ? 'Control exacto de costos, tiempo de producción y cálculo de ROI sin suscripciones mensuales.' : 'Exact cost control, production time and ROI calculation without monthly subscriptions.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">SCHEMA RELACIONAL</span>
            <p>Tablas inmutables: <code>assets</code>, <code>renders</code>, <code>discrepancies</code>, <code>sales_ledger</code> y <code>closers_performance</code>. Reportes automáticos exportables en CSV, JSON y PDF.</p>
            <p><strong>ROI:</strong> ((Facturación Atribuida - Costos) / Costos) × 100%. Con ABRAXAS en Apple Silicon, el costo de producción tiende a cero.</p>
          </div></div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2rem;">
        <a href="${langPrefix}gerencia/index.html" class="btn-apple-cta" style="background: rgba(191,90,242,0.15); border: 1px solid #bf5af2;">${isEs ? '💼 Ver Gobernanza & ROI ➔' : '💼 View Governance & ROI ➔'}</a>
      </div>
    </section>

    <!-- 10. SECTION: CÁTEDRA FORMAL 165 IQ -->
    <section id="catedra" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #38bdf8;">FORMAL EPISTEMOLOGY // TRATADO DE INGENIERÍA 165 IQ</span>
        <h2 class="h2">${isEs ? 'La Cátedra Formal: Del Juicio Estético al Álgebra' : 'The Formal Lecture: Aesthetic Judgment to Algebra'}</h2>
        <p class="p">${isEs ? 'Fundamentación matemática rigurosa: máquinas de estado finitas δ(s, e), espacios de Hilbert y teoría de la información aplicadas al contenido.' : 'Rigorous mathematical foundation: state machines δ(s,e), Hilbert spaces, information theory.'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">MÁQUINA DE ESTADOS</span>
          <h4 class="card-h3">${isEs ? 'Transiciones Deterministas δ(s, e)' : 'Deterministic Transitions δ(s, e)'}</h4>
          <p class="card-desc">${isEs ? 'El contenido evoluciona a través de estados formalmente definidos. Sin saltos caóticos ni excepciones no registradas.' : 'Content evolves through formally defined states. No chaotic jumps.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">AUTÓMATA FINITO DETERMINISTA</span>
            <p>Transición de estados: PLANNED → OBSERVED → RESOLVED → PRODUCTION → PUBLISHED → LEARNING. Ninguna pieza puede saltarse compuertas sin registrar una excepción firmada.</p>
            <p><strong>Función de Transición:</strong> δ(s, e) = s' donde s es el estado actual, e es el evento (auditoría aprobada, grabación completada, etc.) y s' es el estado siguiente verificable.</p>
          </div></div>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">MÉTRICA DE COHERENCIA</span>
          <h4 class="card-h3">${isEs ? 'Espacios de Hilbert y Producto Punto' : 'Hilbert Spaces & Dot Product'}</h4>
          <p class="card-desc">${isEs ? 'La coherencia entre Brand Core y frases generadas se mide mediante distancia de cosenos ≥ 0.88.' : 'Coherence between Brand Core and generated phrases measured via cosine distance ≥ 0.88.'}</p>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">ECUACIÓN EPISTÉMICA</span>
            <p>Coherencia(A, B) = (A · B) / (||A|| ||B||) ≥ 0.88. Si la similitud cae por debajo de 0.88, el radar YOD marca la semilla como AI-slop y exige reformulación humana.</p>
            <p><strong>Tesis Fundacional:</strong> «ABRAXAS convierte criterio en infraestructura.» La IA es un proveedor utilitario subordinado. Lo que hace soberano al sistema es que codifica las leyes del criterio humano de élite en reglas matemáticas deterministas.</p>
          </div></div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 2rem;">
        <a href="${langPrefix}catedra/index.html" class="btn-apple-cta" style="background: rgba(56,189,248,0.2); border: 1px solid var(--color-cyan);">${isEs ? '🏛️ Leer Tratado Completo de la Cátedra ➔' : '🏛️ Read Complete Formal Lecture ➔'}</a>
      </div>
    </section>

    <!-- 11. SECTION: SCRUM BACKLOG 0 A 100% -->
    <section id="scrum" class="section-wrap" style="padding-top: 80px;">
      <div class="section-head" style="text-align: center;">
        <span class="tag" style="color: #d4af37;">SCRUM ROADMAP // DE PASO 0 A 100% FUNCIONAL</span>
        <h2 class="h2">${isEs ? 'Plan de Ingeniería Scrum: 1 Semana vs 1 Mes' : 'Scrum Engineering Plan: 1 Week vs 1 Month'}</h2>
        <p class="p">${isEs ? 'El camino riguroso paso a paso para construir, validar y desplegar ABRAXAS OS en tu Mac. Cada día mapea herramientas reales.' : 'Step-by-step rigorous path to build, validate and deploy ABRAXAS OS on your Mac.'}</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-6" style="position: relative; border-left: 4px solid #d4af37;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">SPRINT 1 SEMANA (MVP)</span>
          <h3 class="card-h3">${isEs ? 'De Cero a 50 Activos en 7 Días' : 'From Zero to 50 Assets in 7 Days'}</h3>
          <p class="card-desc">${isEs ? 'Despliegue ultrarrápido enfocado en los tres pilares críticos de producción y monetización.' : 'Ultra-fast deployment focused on core production & monetization.'}</p>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; color: #cbd5e1; margin-top: 1rem;">
            <li>⚡ <strong>Día 1:</strong> Estructura de contratos TypeScript y almacenamiento CAS SHA-256.</li>
            <li>⚡ <strong>Día 2:</strong> Motor YOD y radar de ganchos dialécticos (Hook Score ≥ 85/100).</li>
            <li>⚡ <strong>Día 3:</strong> Metrología SHIM en set con Whisper local a 0.00% GAPs.</li>
            <li>⚡ <strong>Día 4:</strong> Motor VAV de cortes en 18s y subtítulos cinéticos Whisper.</li>
            <li>⚡ <strong>Día 5:</strong> 13 Familias de motion Remotion, VAV VFX y VAV Framing.</li>
            <li>⚡ <strong>Día 6:</strong> VAV Carousel, Luna Comercial OCR de facturas y panel de closers.</li>
            <li>⚡ <strong>Día 7:</strong> Tablero Kanban HE en macOS y primer lote de 50 activos.</li>
          </ul>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">CRITERIO DE SALIDA (DoD MVP)</span>
            <p>El sprint MVP se considera completado únicamente cuando un solo operador puede grabar una semilla en SHIM, generar 8 formatos vivos en 18s y registrar una venta simulada por OCR con ROI matemático.</p>
          </div></div>
        </div>

        <div class="spotlight-card col-6" style="position: relative; border-left: 4px solid #30d158;">
          <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">ROLLOUT 1 MES (ENTERPRISE)</span>
          <h3 class="card-h3">${isEs ? 'Infraestructura Definitiva de Soberanía' : 'Definitive Enterprise Sovereignty'}</h3>
          <p class="card-desc">${isEs ? 'Consolidación de grado corporativo con aceleración hardware y base de conocimiento inmutable.' : 'Enterprise-grade consolidation with hardware acceleration & knowledge canon.'}</p>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; color: #cbd5e1; margin-top: 1rem;">
            <li>🛡️ <strong>Semana 1:</strong> Núcleo determinista, persistencia SQLite metrics.db y los 37 dossiers canónicos.</li>
            <li>🛡️ <strong>Semana 2:</strong> Aceleración Apple VideoToolbox (ProRes/HEVC), de-esser 6.5kHz y mastering -14 LUFS.</li>
            <li>🛡️ <strong>Semana 3:</strong> Total Production Coach, bucle cerrado S(t+1)=S(t)+A(t) y telemetría de ventas.</li>
            <li>🛡️ <strong>Semana 4:</strong> Empaquetado en instalador DMG firmado para macOS y pruebas de estrés de 200 videos continuos.</li>
          </ul>
          <div class="card-deepdive-drawer"><div class="deepdive-content-box">
            <span class="deepdive-tag">CRITERIO DE SALIDA (DoD ENTERPRISE)</span>
            <p>Auditoría de 0.00% GAPs en 200 renders consecutivos, persistencia SQLite íntegra, respaldo criptográfico SHA-256 verificado e instalador DMG listo para distribución soberana.</p>
          </div></div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 2.5rem; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
        <a href="${langPrefix}scrum/index.html" class="btn-apple-cta" style="background: var(--color-gold); color: #000; font-weight: 700; padding: 12px 28px;">${isEs ? '📋 Abrir Backlog Scrum Completo ➔' : '📋 Open Complete Scrum Backlog ➔'}</a>
        <a href="${langPrefix}criterios-roadmap/index.html" class="btn-control-center" style="font-size: 0.9rem; padding: 12px 22px;">${isEs ? '🗺️ Ver Criterios & Roadmap Integral' : '🗺️ View Criteria & Master Roadmap'}</a>
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
