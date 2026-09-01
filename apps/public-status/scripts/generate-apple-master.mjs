import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const docsDir = path.resolve(rootDir, 'docs/abraxas-os-status');

// Ingest canonical datasets
const bilingualPath = path.resolve(__dirname, '../src/data/canonical-knowledge-bilingual.json');
const corpusPath = path.resolve(__dirname, '../src/data/canonical-corpus-files.json');

const bilingualData = JSON.parse(fs.readFileSync(bilingualPath, 'utf-8'));
const corpusFiles = JSON.parse(fs.readFileSync(corpusPath, 'utf-8'));

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const fileSummaries = {
  "00_LEEME_PRIMERO": {
    es: "El Checksum Conceptual. Establece la ley anti-confusión: El Árbol describe qué le pasa al Contenido (estados); los 13 Módulos describen qué hace ABRAXAS (verbos).",
    en: "Conceptual Checksum. Defines the anti-confusion law: Tree describes what happens to Content (states); Modules describe what ABRAXAS does (verbs)."
  },
  "01_CAPAS_HISTORICAS_Y_METODO": {
    es: "Diferenciación rigurosa de fuentes: Cábala Judía (Luria/Cordovero), Cristiana (Reuchlin), Hermética (Dion Fortune) y síntesis propia de software.",
    en: "Rigorous source differentiation: Jewish Kabbalah, Christian Cabala, Hermetic Qabalah (Dion Fortune), and ABRAXAS software synthesis."
  },
  "02_CUATRO_MUNDOS_Y_TETRAGRAMATON": {
    es: "Los 4 Mundos como grados de condensación: Atziluth (Emanación/YOD), Beri'ah (Creación/HE I), Yetzirah (Formación/VAV), Assiah (Acción/HE II).",
    en: "The Four Worlds as data condensation grades: Atziluth (Emanation), Beri'ah (Creation), Yetzirah (Formation), Assiah (Action/Media)."
  },
  "03_ARBOL_SEFIROT_PILARES_PATHS": {
    es: "Las 10 Sefirot y 22 Senderos como red de enrutamiento y balance entre Expansión (Chesed) y Restricción (Gevurah).",
    en: "The 10 Sephirot and 22 Paths as routing topology and dialectic balance between Expansion (Chesed) and Restriction (Gevurah)."
  },
  "04_DAAT_ABISMO_SHIM": {
    es: "Da'at como umbral de metrología lúcida. SHIM verifica que lo grabado coincida con lo planeado (0.00% GAPs).",
    en: "Da'at as awakened metrology threshold. SHIM verifies recorded media against planned script with 0.00% GAPs."
  },
  "05_YHSHVH_SHIN_CABALA_CRISTIANA": {
    es: "El Pentagramatón YHSHVH: inserción del fuego de Shin (ש) en el cuerpo físico, materializado en el sellado inmutable CAS SHA-256.",
    en: "The Pentagrammaton YHSHVH: inserting Shin flame into physical form, materialized via immutable CAS SHA-256 sealing."
  },
  "06_DION_FORTUNE_QABALAH_OCCIDENTAL": {
    es: "Traducción de correspondencias planetarias a esquemas relacionales JSON-Schema, índices SQL y auditoría de software.",
    en: "Translating planetary glyphs into relational JSON-Schema tables, SQLite indexes, and auditable production telemetry."
  },
  "07_XYZA_STATE_SPACE": {
    es: "El hiperespacio 4D: Polaridad X, Manifestación Y, Contexto Z y la meta-dimensión A (Memoria cognitiva acumulada).",
    en: "The 4D state-space: Polarity X, Manifestation Y, Context Z, and meta-dimension A (Adaptive Intelligence & Lineage)."
  },
  "08_MODULOS_MUNDOS_OPERADORES": {
    es: "Definición de los 13 operadores de software (YOD, HE, SHIM, VAV, ARQUITECTO, etc.) y su dominio funcional.",
    en: "Definition of the 13 software operators (YOD, HE, SHIM, VAV, ARQUITECTO, etc.) and their functional operational domains."
  },
  "09_CONTENIDO_CRISTAL_CONTINUITY_AXIS": {
    es: "Identidad persistente de pieza única: Merkle-DAG sobre SHA-256 anclado al Eje de Continuidad vertical.",
    en: "Single-piece persistent identity: Merkle-DAG over SHA-256 anchored to the vertical sapphire Continuity Axis."
  },
  "10_ATZILUTH_CAMARA_DORADA": {
    es: "Cámara de emanación pura donde se definen las tesis y los axiomas de marca inmutables.",
    en: "Pure emanation chamber defining thesis and unshakeable brand voice axioms prior to project instantiation."
  },
  "11_ARQUITECTO_SOL_OJO_LUNA": {
    es: "La tríada de observabilidad: Sol Primordial (potencial), Ojo de la Pirámide (telemetría en vivo) y Luna (retorno telemétrico).",
    en: "The observability triad: Primordial Sun (potential), Pyramid Eye (live telemetry), and Moon (telemetric return)."
  },
  "12_DIMENSION_A_MEMORIA_CRITERIO_OPTIMIZACION": {
    es: "La ecuación de aprendizaje: S(t+1) = S(t) + A(t). Memoria de linaje, procedencia forense y optimización de ganchos.",
    en: "The learning equation: S(t+1) = S(t) + A(t). Lineage memory, forensic provenance, and automated hook refinement."
  },
  "13_FLUJO_COMPLETO_EJEMPLOS": {
    es: "Casos de uso reales de extremo a extremo desde el radar de nicho hasta la exportación y análisis de retención.",
    en: "End-to-end real production walkthroughs from niche radar to multi-channel batch export and retention analysis."
  },
  "14_ARQUITECTURA_ESPACIAL_FISICA": {
    es: "Dimensiones físicas y geometría del monumento piramidal de basalto (base 500m, pendiente 51.8487°).",
    en: "Physical geometry and layout of the 500m basalt monument (slope 51.8487°, 4 physical stepped world tiers)."
  },
  "15_REGLAS_CANONICAS_ANTI_CONFUSION": {
    es: "Axiomas inmutables de producto: Verdad de producto por encima de belleza simbólica. Cero alucinaciones.",
    en: "Unshakeable product axioms: Product truth above symbolic elegance. Zero hallucination tolerance."
  },
  "16_GLOSARIO": {
    es: "Definiciones exactas de todos los términos técnicos y ontológicos de ABRAXAS OS.",
    en: "Exact definitions for all technical and ontological terms across ABRAXAS OS."
  },
  "17_FUENTES_Y_BIBLIOGRAFIA": {
    es: "Bibliografía académica e histórica completa que fundamenta la arquitectura simbólica.",
    en: "Complete academic, historical, and mathematical bibliography underpinning the symbolic architecture."
  },
  "18_CONTEXTO_CORTO_PARA_OTROS_CHATS": {
    es: "Resumen ejecutivo ultracompacto para transferir contexto a otros modelos o desarrolladores.",
    en: "Ultra-compact executive prompt packet to bootstrap new AI models and engineering sessions."
  },
  "19_MAPAS_ASCII": {
    es: "Diagramas topológicos y mapas de flujo en texto ASCII para inspección rápida.",
    en: "Topology diagrams, tree cutaways, and ASCII state-space maps for fast terminal inspection."
  },
  "20_SISTEMA_MOTION_100_KEYFRAMES": {
    es: "El sistema de 10 secuencias x 10 keyframes con encadenamiento causal estricto para eliminar el drift de IA.",
    en: "The 10 sequences x 10 keyframes system with strict causal chaining to eliminate AI generative drift."
  },
  "21_PROMPTS_SEQ01_MASTER_HERO_ORIGIN": {
    es: "10 prompts cinematográficos para la Secuencia 01: El Sol Primordial, el Ojo y el Descenso a Atziluth.",
    en: "10 cinematic prompts for Sequence 01: Primordial Sun, Eye, and Atziluth golden emanation chamber."
  },
  "22_PROMPTS_SEQ02_EXTERIOR_CLOSED_LOOP": {
    es: "10 prompts cinematográficos para la Secuencia 02: El Bucle Exterior, la Luna y las Ondas Telemétricas.",
    en: "10 cinematic prompts for Sequence 02: Exterior Closed Loop, Celestial Moon, and Telemetric Waves."
  },
  "23_PROMPTS_SEQ03_EDITORIAL_INGRESS_BERIAH": {
    es: "10 prompts cinematográficos para la Secuencia 03: Ingreso Editorial a Beri'ah y el Eje de Continuidad.",
    en: "10 cinematic prompts for Sequence 03: Editorial Ingress to Beri'ah and Sapphire Continuity Axis."
  },
  "24_PROMPTS_SEQ04_CUTAWAY_FOUR_WORLDS_TREE": {
    es: "10 prompts cinematográficos para la Secuencia 04: Corte transversal del Árbol de la Vida y las Cámaras.",
    en: "10 cinematic prompts for Sequence 04: Architectural cutaway of the Tree of Life chambers."
  },
  "25_PROMPTS_SEQ05_SHIM_DAAT_METROLOGY": {
    es: "10 prompts cinematográficos para la Secuencia 05: El Umbral de Da'at, la Amatista Negra y el Escáner SHIM.",
    en: "10 cinematic prompts for Sequence 05: Da'at Threshold, Black Amethyst, and SHIM Metrology Scanner."
  },
  "26_PROMPTS_SEQ06_VAV_YETZIRAH_PRODUCTION": {
    es: "10 prompts cinematográficos para la Secuencia 06: La Catedral de Síntesis VAV y los 3 Rieles Industriales.",
    en: "10 cinematic prompts for Sequence 06: VAV Synthesis Cathedral, 3 Industrial Rails, and Gold Typography."
  },
  "27_PROMPTS_SEQ07_OPTICAL_PORT_ARQUITECTO_A": {
    es: "10 prompts cinematográficos para la Secuencia 07: El Puerto Óptico, la Inspección XYZA y la Estratigrafía.",
    en: "10 cinematic prompts for Sequence 07: Optical Port, XYZA Volumetric Matrix, and Stratigraphy."
  },
  "28_PROMPTS_SEQ08_HE_ASSIAH_OPERATIONS": {
    es: "10 prompts cinematográficos para la Secuencia 08: El Despacho de Basalto de HE y el Silicio M-Series.",
    en: "10 cinematic prompts for Sequence 08: HE Basalt Operations Desk and Apple Silicon hardware clusters."
  },
  "29_PROMPTS_SEQ09_DASHBOARD_XYZA_AWARE": {
    es: "10 prompts cinematográficos para la Secuencia 09: El Dashboard Táctico sin UI Ocultista.",
    en: "10 cinematic prompts for Sequence 09: Tactical System Dashboard and Live Hardware Telemetry HUD."
  },
  "30_PROMPTS_SEQ10_MOON_METRICS_A_HELIX": {
    es: "10 prompts cinematográficos para la Secuencia 10: La Hélice de Aprendizaje y el Retorno Infinito a YOD.",
    en: "10 cinematic prompts for Sequence 10: Closed-Loop Moon Return Helix and YOD re-ignition."
  },
  "31_MAPA_NARRATIVO_100_IMAGENES": {
    es: "El storyboard director de arte para interpolación de scroll, transiciones Three.js y parallax.",
    en: "Art direction storyboard for continuous scroll interpolation, Three.js transitions, and parallax."
  },
  "32_QA_100_IMAGENES": {
    es: "Protocolo de control de calidad fotográfica: lentes 65mm, cero estética cyberpunk y consistencia de basalto.",
    en: "Photographic QA protocol: 65mm anamorphic lenses, anti-cyberpunk slop, and basalt consistency."
  },
  "33_COMO_USAR_LOS_PROMPTS": {
    es: "Manual operativo para generar imágenes consistentes en Midjourney v6 y generadores de video.",
    en: "Operational manual to generate high-coherence visual assets in Midjourney v6 and video models."
  },
  "34_MASTER_100_IMAGE_PROMPTS_ALL_IN_ONE": {
    es: "Compendio maestro consolidado de 285KB con todos los 100 prompts organizados en un solo archivo.",
    en: "Consolidated 285KB master compendium with all 100 cinematic prompts in one file."
  },
  "35_INDICE_DE_ARCHIVOS": {
    es: "Índice de navegación y estructura de carpetas del paquete de prompts.",
    en: "Navigation directory and folder hierarchy of the prompt package."
  },
  "36_SHA256_MANIFEST": {
    es: "Registro de firmas criptográficas SHA-256 de cada archivo para garantizar inmutabilidad.",
    en: "Cryptographic SHA-256 provenance manifest certifying file integrity and immutability."
  }
};

// Global Apple Header Component
function getAppleHeader(locale, activePage, depth = 0) {
  const isEs = locale === 'es';
  const prefix = depth === 0 ? './' : depth === 1 ? '../' : '../../';
  const esPrefix = depth === 0 ? 'es/' : depth === 1 ? '../es/' : '../../es/';
  const enPrefix = depth === 0 ? 'en/' : depth === 1 ? '../en/' : '../../en/';

  const navItems = [
    { id: 'overview', label: isEs ? 'Visión General' : 'Overview', link: isEs ? `${prefix}index.html` : `${prefix}index.html` },
    { id: 'gerencia', label: isEs ? '💼 Gerencia & Negocio' : '💼 Executive Suite', link: `${prefix}gerencia/index.html` },
    { id: 'ecosistema', label: isEs ? '⚡ Ecosistema 8-en-1' : '⚡ 8-in-1 Ecosystem', link: `${prefix}ecosistema/index.html` },
    { id: 'herramientas', label: isEs ? '🛠️ 13 Herramientas' : '🛠️ 13 Modular Tools', link: `${prefix}herramientas/index.html` },
    { id: 'arquitectura', label: isEs ? '🔯 Cábala & 4D' : '🔯 Kabbalah & 4D', link: `${prefix}arquitectura/index.html` },
    { id: 'canon', label: isEs ? '📚 Canon 37 TXT' : '📚 Canon 37 TXT', link: `${prefix}canon/index.html` },
    { id: 'guia', label: isEs ? '🧭 Guía Rápida' : '🧭 Quick Guide', link: `${prefix}guia/index.html` },
    { id: 'backup', label: isEs ? '🏛️ Versión Backup' : '🏛️ Backup Legacy', link: `${prefix}backup/index.html` }
  ];

  return `
  <!-- Apple Global Glass Header -->
  <header class="apple-global-nav">
    <div class="apple-nav-wrapper">
      
      <!-- Brand Logo -->
      <a href="${prefix}index.html" class="apple-brand-logo">
        <span class="apple-logo-glyph">▲</span>
        <span class="apple-logo-text">ABRAXAS <span class="apple-logo-badge">OS</span></span>
      </a>

      <!-- Desktop Nav Links -->
      <nav class="apple-nav-links">
        ${navItems.map(item => `
          <a href="${item.link}" class="apple-nav-item ${activePage === item.id ? 'active' : ''}">
            ${item.label}
          </a>
        `).join('')}
      </nav>

      <!-- Right Controls: Locale & CTA -->
      <div class="apple-nav-right">
        <div class="apple-locale-pill">
          <a href="${depth === 0 ? 'es/index.html' : isEs ? '#' : `${esPrefix}${activePage === 'overview' ? 'index.html' : `${activePage}/index.html`}`}" class="apple-locale-btn ${isEs ? 'active' : ''}">ES</a>
          <span class="apple-locale-sep">/</span>
          <a href="${depth === 0 ? 'en/index.html' : !isEs ? '#' : `${enPrefix}${activePage === 'overview' ? 'index.html' : `${activePage}/index.html`}`}" class="apple-locale-btn ${!isEs ? 'active' : ''}">EN</a>
        </div>
        <a href="${prefix}ecosistema/index.html" class="apple-nav-cta">
          ${isEs ? 'Explorar OS' : 'Explore OS'}
        </a>
      </div>

    </div>
  </header>
  `;
}

// Global Apple Footer Component
function getAppleFooter(locale, depth = 0) {
  const isEs = locale === 'es';
  const prefix = depth === 0 ? './' : depth === 1 ? '../' : '../../';

  return `
  <footer class="apple-global-footer">
    <div class="apple-footer-inner">
      <div class="apple-footer-top">
        <div class="apple-footer-col">
          <h4>${isEs ? 'Ecosistema de Contenido' : 'Content Ecosystem'}</h4>
          <ul>
            <li><a href="${prefix}ecosistema/index.html">${isEs ? 'Videos Cortos (9:16)' : 'Short-Form Video (9:16)'}</a></li>
            <li><a href="${prefix}ecosistema/index.html">${isEs ? 'Carruseles Visuales (4:5)' : 'Visual Carousels (4:5)'}</a></li>
            <li><a href="${prefix}ecosistema/index.html">${isEs ? 'Hilos de Autoridad X/LinkedIn' : 'Authority Threads X/LinkedIn'}</a></li>
            <li><a href="${prefix}ecosistema/index.html">${isEs ? 'Newsletters y Correos' : 'Newsletters & Email'}</a></li>
            <li><a href="${prefix}ecosistema/index.html">${isEs ? 'Audio y Podcasts' : 'Audio & Podcasts'}</a></li>
          </ul>
        </div>
        <div class="apple-footer-col">
          <h4>${isEs ? 'Suite de 13 Herramientas' : '13 Modular Tools'}</h4>
          <ul>
            <li><a href="${prefix}herramientas/index.html">YOD // Inteligencia de Nicho</a></li>
            <li><a href="${prefix}herramientas/index.html">CONTENIDO // Eje de Continuidad</a></li>
            <li><a href="${prefix}herramientas/index.html">SHIM // Metrología 0.00% GAPs</a></li>
            <li><a href="${prefix}herramientas/index.html">VAV // Auto-Síntesis en 18s</a></li>
            <li><a href="${prefix}herramientas/index.html">HE // Despacho Kanban</a></li>
          </ul>
        </div>
        <div class="apple-footer-col">
          <h4>${isEs ? 'Gobernanza & Alta Dirección' : 'Executive Governance'}</h4>
          <ul>
            <li><a href="${prefix}gerencia/index.html">${isEs ? 'Custodia Inmutable de Marca' : 'Immutable Brand Custody'}</a></li>
            <li><a href="${prefix}gerencia/index.html">${isEs ? 'Auditoría de Costos al Centavo' : 'Cost & Bottleneck Telemetry'}</a></li>
            <li><a href="${prefix}gerencia/index.html">${isEs ? 'Apalancamiento 1 Operador = 10' : '1 Operator = 10 Leverage'}</a></li>
            <li><a href="${prefix}gerencia/index.html">${isEs ? '6 Compuertas de Control' : '6 Executive Quality Gates'}</a></li>
            <li><a href="${prefix}gerencia/index.html">${isEs ? 'Soberanía Apple Silicon' : 'Apple Silicon Sovereignty'}</a></li>
          </ul>
        </div>
        <div class="apple-footer-col">
          <h4>${isEs ? 'Base de Conocimiento' : 'Knowledge Base'}</h4>
          <ul>
            <li><a href="${prefix}canon/index.html">${isEs ? 'Biblioteca Canon 37 TXT' : 'Canon 37 TXT Library'}</a></li>
            <li><a href="${prefix}arquitectura/index.html">${isEs ? 'Los 4 Mundos y el Árbol' : 'Four Worlds & Tree of Life'}</a></li>
            <li><a href="${prefix}guia/index.html">${isEs ? 'En 2 Minutos (Principiantes)' : 'In 2 Minutes (Beginners)'}</a></li>
            <li><a href="${prefix}backup/index.html">${isEs ? '🏛️ Versión Backup / Legacy' : '🏛️ Legacy Backup Version'}</a></li>
          </ul>
        </div>
      </div>
      <div class="apple-footer-bottom">
        <p>Copyright © 2026 ABRAXAS OS. ${isEs ? 'Todos los derechos reservados. Arquitectura de Alta Fidelidad en Silicio Local.' : 'All rights reserved. High-Fidelity Local Silicon Architecture.'}</p>
        <p class="apple-footer-hash">SHA-256: <code>91234741f0b3a1ac5bd7e4c0556fafa868d00769</code></p>
      </div>
    </div>
  </footer>
  `;
}

// 1. Root Locale Redirector
function generateRootRedirector() {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=./es/index.html">
  <title>ABRAXAS OS — Loading Experience...</title>
  <script>
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang && userLang.startsWith('en')) {
      window.location.replace('./en/index.html');
    } else {
      window.location.replace('./es/index.html');
    }
  </script>
</head>
<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
  <p>Cargando ABRAXAS OS...</p>
</body>
</html>`;
  fs.writeFileSync(path.join(docsDir, 'index.html'), html, 'utf8');
  console.log('[Apple Builder] Generated /index.html root redirector.');
}

// 2. Master Overview Landing Page (MacBook Pro Aesthetic)
function generateAppleOverviewPage(locale) {
  const isEs = locale === 'es';
  const dir = path.join(docsDir, locale);
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'ABRAXAS OS — Sistema Operativo de Contenidos a Velocidad Industrial' : 'ABRAXAS OS — Content Intelligence & Industrial Multi-Channel Synthesis'}</title>
  <meta name="description" content="${isEs ? 'Transforma una sola tesis de marca en un ecosistema completo de 8 formatos (videos cortos, carruseles, hilos, newsletters, podcasts) a velocidad industrial.' : 'Transform one core brand seed into a full 8-format multi-channel ecosystem at industrial speed.'}">
  <link rel="stylesheet" href="../assets/apple-design-system.css">
</head>
<body>
  ${getAppleHeader(locale, 'overview', 1)}

  <!-- HERO SECTION (MacBook Pro Style) -->
  <section class="apple-hero-section">
    <div class="apple-hero-eyebrow">
      ${isEs ? 'SISTEMA OPERATIVO DE CONTENIDOS // APPLE SILICON' : 'CONTENT OPERATING SYSTEM // APPLE SILICON'}
    </div>
    <h1 class="apple-hero-headline">
      ${isEs ? 'Pro. En Todo Sentido.<br/>Tu Ecosistema de Contenidos a Velocidad Industrial.' : 'Pro. Beyond Boundaries.<br/>Your Content Ecosystem at Industrial Velocity.'}
    </h1>
    <p class="apple-hero-subhead">
      ${isEs 
        ? 'ABRAXAS no es solo un editor de video. Es una fábrica inteligente que transforma 1 sola idea en 8 formatos vivos (Reels, Carruseles, Hilos de X/LinkedIn, Newsletters y Podcasts) con 0.00% errores y telemetría de retención en lazo cerrado.'
        : 'ABRAXAS is not just a video editor. It is an intelligent factory that transforms 1 core idea into 8 living formats (Reels, Carousels, X/LinkedIn Threads, Newsletters, Podcasts) with 0.00% errors and closed-loop retention intelligence.'}
    </p>

    <div class="apple-hero-actions">
      <a href="./ecosistema/index.html" class="apple-btn-blue">${isEs ? 'Explorar el Ecosistema 8-en-1' : 'Explore the 8-in-1 Engine'}</a>
      <a href="./gerencia/index.html" class="apple-btn-secondary">${isEs ? '💼 Para Gerencia & Directores' : '💼 Executive Suite'}</a>
      <a href="./canon/index.html" class="apple-btn-secondary">${isEs ? '📚 Leer los 37 Archivos TXT' : '📚 Read 37 TXT Canon'}</a>
    </div>

    <!-- APPLE KEY METRICS RIBBON -->
    <div class="apple-metrics-ribbon">
      <div class="apple-metric-card">
        <div class="apple-metric-val gold">18s</div>
        <div class="apple-metric-lbl">${isEs ? 'Auto-edición y síntesis completa' : 'Auto-cut & synthesis speed'}</div>
      </div>
      <div class="apple-metric-card">
        <div class="apple-metric-val cyan">1 ➔ 8</div>
        <div class="apple-metric-lbl">${isEs ? 'Formatos vivos de 1 sola semilla' : 'Live formats from 1 core seed'}</div>
      </div>
      <div class="apple-metric-card">
        <div class="apple-metric-val">50</div>
        <div class="apple-metric-lbl">${isEs ? 'Activos gobernados en 1 tarde' : 'Assets governed in 1 afternoon'}</div>
      </div>
      <div class="apple-metric-card">
        <div class="apple-metric-val gold">0.00%</div>
        <div class="apple-metric-lbl">${isEs ? 'GAPs de error (Verificación SHIM)' : 'Error tolerance (SHIM AI)'}</div>
      </div>
    </div>

    <!-- HARDWARE SCREEN CHASSIS (Plate 01 Hero) -->
    <div class="apple-hardware-frame">
      <div class="apple-screen-chassis">
        <div class="apple-screen-inner">
          <img src="../assets/plates/plate_01_hero.webp" alt="ABRAXAS OS Master Chamber" loading="eager">
          <div class="apple-screen-badge">
            ◈ ATZILUTH EMISSION CHAMBER // MERKLE-DAG SEED ENGINE
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- INTERACTIVE FORMAT SWITCHER (1 Seed ➔ 8 Formats) -->
  <section class="apple-section">
    <div class="apple-section-header">
      <span class="apple-section-eyebrow">${isEs ? 'FÁBRICA MULTICANAL' : 'MULTI-CHANNEL FACTORY'}</span>
      <h2 class="apple-section-headline">${isEs ? 'Una Sola Idea. Ocho Formatos Vivos.' : 'One Core Seed. Eight Live Formats.'}</h2>
      <p class="apple-section-subhead">
        ${isEs 
          ? 'El motor de Continuidad (Merkle-DAG) toma tu tesis aprobada y genera simultáneamente todo tu despliegue multicanal. Si cambias una palabra del guion, todos los formatos se actualizan solos.' 
          : 'The Continuity Engine (Merkle-DAG) takes your approved thesis and simultaneously generates your multi-channel fleet. Edit one word, and all derivatives update automatically.'}
      </p>
    </div>

    <!-- Tabs Bar -->
    <div class="apple-format-tabs-bar">
      <button class="apple-format-tab-btn active" onclick="switchFormatTab(0, this)">🎬 ${isEs ? 'Videos Cortos (9:16)' : 'Shorts / Reels (9:16)'}</button>
      <button class="apple-format-tab-btn" onclick="switchFormatTab(1, this)">🖼️ ${isEs ? 'Carruseles (4:5)' : 'Visual Carousels (4:5)'}</button>
      <button class="apple-format-tab-btn" onclick="switchFormatTab(2, this)">✍️ ${isEs ? 'Hilos X/LinkedIn' : 'X / LinkedIn Threads'}</button>
      <button class="apple-format-tab-btn" onclick="switchFormatTab(3, this)">📧 ${isEs ? 'Newsletters & Email' : 'Newsletters & Email'}</button>
      <button class="apple-format-tab-btn" onclick="switchFormatTab(4, this)">🎙️ ${isEs ? 'Audio & Podcasts' : 'Audio & Podcasts'}</button>
      <button class="apple-format-tab-btn" onclick="switchFormatTab(5, this)">🎥 ${isEs ? 'YouTube (16:9)' : 'YouTube (16:9)'}</button>
    </div>

    <!-- Interactive Tab Content Container -->
    <div id="format-tab-display" class="apple-bento-grid">
      
      <div class="apple-bento-card apple-bento-col-8">
        <div>
          <span class="apple-card-tag gold" id="tab-card-tag">FORMAT 01 // AUDIVISUAL SYNTHESIS</span>
          <h3 class="apple-card-title" id="tab-card-title">${isEs ? 'Videos Cortos de Alta Retención (TikTok, Reels, Shorts)' : 'High-Retention Short Video (TikTok, Reels, Shorts)'}</h3>
          <p class="apple-card-desc" id="tab-card-desc">
            ${isEs 
              ? 'Auto-edición en 18 segundos con cortes quirúrgicos de silencios, subtítulos virales animados (estilo Viral Gold y Cyber), gráficos 3D en Remotion y diseño sonoro a 45Hz.' 
              : 'Auto-cut in 18s with sub-millisecond jump cuts, kinetic typography (Viral Gold & Cyber), 3D Remotion motion overlays, and 45Hz sub-bass sound design.'}
          </p>
        </div>
        <div class="apple-card-media" style="aspect-ratio: 16/9;">
          <img id="tab-card-img" src="../assets/plates/plate_05_vav_cathedral.webp" alt="Format Preview">
        </div>
      </div>

      <div class="apple-bento-card apple-bento-col-4">
        <div>
          <span class="apple-card-tag cyan">${isEs ? 'ESPECIFICACIONES DE RENDIMIENTO' : 'PERFORMANCE SPECS'}</span>
          <h3 class="apple-card-title" style="font-size: 1.3rem;">${isEs ? 'Velocidad & Metrología' : 'Speed & Metrology'}</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; margin-top: 1.5rem; font-size: 0.9rem; color: #cbd5e1;">
            <li style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">⚡ <strong>${isEs ? 'Tiempo de Render:' : 'Render Speed:'}</strong> 18s en Apple Silicon</li>
            <li style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">🎯 <strong>${isEs ? 'Gancho Viral:' : 'Viral Hook:'}</strong> Score 0-100 por YOD</li>
            <li style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">🎙️ <strong>${isEs ? 'Auditoría de Audio:' : 'Audio Metrology:'}</strong> Whisper Large V3</li>
            <li>🔒 <strong>${isEs ? 'Sellado CAS:' : 'CAS Vault:'}</strong> SHA-256 Inmutable</li>
          </ul>
        </div>
        <a href="./ecosistema/index.html" class="apple-btn-blue" style="margin-top: 2rem; text-align: center; justify-content: center;">
          ${isEs ? 'Ver los 8 Formatos →' : 'View All 8 Formats →'}
        </a>
      </div>

    </div>
  </section>

  <!-- EXECUTIVE MANAGEMENT COMMAND CENTER (Bento Grid) -->
  <section class="apple-section">
    <div class="apple-section-header">
      <span class="apple-section-eyebrow" style="color: var(--apple-cyan);">${isEs ? 'ALTA DIRECCIÓN & GOBERNANZA' : 'EXECUTIVE GOVERNANCE'}</span>
      <h2 class="apple-section-headline">${isEs ? 'Control Total para CEOs y Directores de Marketing.' : 'Total Control for CEOs & Marketing Directors.'}</h2>
      <p class="apple-section-subhead">
        ${isEs 
          ? 'ABRAXAS es el centro de comando que protege la voz de tu marca, audita los costos al centavo y multiplica la capacidad de tu equipo.' 
          : 'ABRAXAS is the enterprise command center that safeguards brand voice, audits costs down to the penny, and multiplies team leverage.'}
      </p>
    </div>

    <div class="apple-bento-grid">
      
      <!-- Card 1: Brand Custody -->
      <div class="apple-bento-card apple-bento-col-6">
        <div>
          <span class="apple-card-tag gold">🛡️ CUSTODIA INMUTABLE DE MARCA</span>
          <h3 class="apple-card-title">${isEs ? 'Cero Desviación de Criterio' : 'Zero Brand Drift'}</h3>
          <p class="apple-card-desc">
            ${isEs 
              ? 'Fijas tus pilares de autoridad, tono de voz y reglas de compliance una sola vez. Ningún colaborador o redactor puede publicar contenido que viole los axiomas de la empresa.' 
              : 'You configure authority pillars, voice tone, and compliance once. The system automatically rejects any draft violating company axioms.'}
          </p>
        </div>
        <div class="apple-card-media" style="aspect-ratio: 16/9;">
          <img src="../assets/plates/plate_03_continuity_axis.webp" alt="Brand Continuity">
        </div>
      </div>

      <!-- Card 2: Cost & Bottleneck Telemetry -->
      <div class="apple-bento-card apple-bento-col-6">
        <div>
          <span class="apple-card-tag cyan">📊 AUDITORÍA DE COSTOS Y TIEMPOS</span>
          <h3 class="apple-card-title">${isEs ? 'Telemetría Operativa al Centavo' : 'Cost & Turnaround Telemetry'}</h3>
          <p class="apple-card-desc">
            ${isEs 
              ? 'Tableros relacionales SQLite que auditan exactamente cuánto tarda cada etapa, qué colaborador está bloqueado y el costo de manufactura real por activo.' 
              : 'Relational SQLite telemetry auditing exact turnaround times, team bottlenecks, and cost-per-asset down to the penny.'}
          </p>
        </div>
        <div class="apple-card-media" style="aspect-ratio: 16/9;">
          <img src="../assets/plates/plate_09_system_dashboard.webp" alt="Telemetry Dashboard">
        </div>
      </div>

      <!-- Card 3: Team Leverage 1=10 -->
      <div class="apple-bento-card apple-bento-col-6">
        <div>
          <span class="apple-card-tag emerald">⚡ APALANCAMIENTO RADICAL (1 = 10)</span>
          <h3 class="apple-card-title">${isEs ? '1 Operador = Una Agencia Entera' : '1 Operator = A 10-Person Agency'}</h3>
          <p class="apple-card-desc">
            ${isEs 
              ? 'Reemplaza retainers mensuales de agencias de $5,000–$15,000/mes. Un solo líder de marketing gobierna y aprueba 50 a 100 piezas multicanal en una sola tarde.' 
              : 'Eliminate $5k-$15k/mo agency retainers. A single internal operator governs and approves 50-100 multi-channel assets in one afternoon.'}
          </p>
        </div>
        <div class="apple-card-media" style="aspect-ratio: 16/9;">
          <img src="../assets/plates/plate_02_he_macro.webp" alt="HE Operations Desk">
        </div>
      </div>

      <!-- Card 4: Local Apple Silicon Sovereignty -->
      <div class="apple-bento-card apple-bento-col-6">
        <div>
          <span class="apple-card-tag purple">🔒 SOBERANÍA Y PRIVACIDAD TOTAL</span>
          <h3 class="apple-card-title">${isEs ? '100% Silicio Apple Local' : '100% Local Apple Silicon Sovereignty'}</h3>
          <p class="apple-card-desc">
            ${isEs 
              ? 'Todo corre en local en tu Mac (M1/M2/M3/M4). Tus estrategias de negocio confidenciales y grabaciones jamás se suben a la nube ni entrenan modelos de terceros.' 
              : 'Runs 100% locally on Apple Silicon. Confidential company assets never leak to public cloud servers or train third-party AI.'}
          </p>
        </div>
        <div class="apple-card-media" style="aspect-ratio: 16/9;">
          <img src="../assets/plates/plate_04_shim_metrology.webp" alt="Hardware Security">
        </div>
      </div>

    </div>
  </section>

  <!-- SUITE OF 13 TOOLS OVERVIEW -->
  <section class="apple-section">
    <div class="apple-section-header">
      <span class="apple-section-eyebrow" style="color: var(--apple-gold);">${isEs ? 'SUITE MODULAR INTEGRADA' : 'INTEGRATED MODULAR SUITE'}</span>
      <h2 class="apple-section-headline">${isEs ? '13 Módulos. Un Solo Sistema Soberano.' : '13 Modules. One Sovereign Operating System.'}</h2>
      <p class="apple-section-subhead">
        ${isEs 
          ? 'Reemplaza 8 programas desconectados por un flujo continuo donde cada herramienta ejecuta una transformación matemática y determinista.' 
          : 'Replace 8 disconnected apps with one continuous pipeline where every module executes deterministic mathematical transformations.'}
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
      
      <div class="apple-bento-card" style="padding: 1.5rem;">
        <span class="apple-card-tag gold">YOD (י)</span>
        <h4 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Inteligencia de Nicho</h4>
        <p style="font-size: 0.85rem; color: #94a3b8;">Radar de ángulos ciegos y generador de ganchos dialécticos calificados 0-100.</p>
      </div>

      <div class="apple-bento-card" style="padding: 1.5rem;">
        <span class="apple-card-tag cyan">CONTENIDO</span>
        <h4 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Eje de Continuidad</h4>
        <p style="font-size: 0.85rem; color: #94a3b8;">Árbol Merkle-DAG que sincroniza 8 formatos derivados de 1 sola idea sin desincronización.</p>
      </div>

      <div class="apple-bento-card" style="padding: 1.5rem;">
        <span class="apple-card-tag purple">SHIM (ש)</span>
        <h4 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Metrología 0.00% GAPs</h4>
        <p style="font-size: 0.85rem; color: #94a3b8;">Auditoría con Whisper y visión computacional que detecta omisiones en el set al instante.</p>
      </div>

      <div class="apple-bento-card" style="padding: 1.5rem;">
        <span class="apple-card-tag emerald">VAV (ו)</span>
        <h4 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Auto-Síntesis en 18s</h4>
        <p style="font-size: 0.85rem; color: #94a3b8;">Cortes automáticos, tipografía cinética Remotion, audio a -14 LUFS y láminas de carrusel.</p>
      </div>

    </div>

    <div style="text-align: center; margin-top: 2.5rem;">
      <a href="./herramientas/index.html" class="apple-btn-secondary">${isEs ? 'Ver los 13 Módulos en Detalle →' : 'Explore All 13 Modules →'}</a>
    </div>
  </section>

  <!-- CANON 37 TXT TEASER -->
  <section class="apple-section" style="background: rgba(12, 12, 16, 0.5); border-radius: 30px; border: 1px solid var(--apple-border);">
    <div class="apple-section-header" style="margin-bottom: 2rem;">
      <span class="apple-card-tag gold">📚 BASE DE CONOCIMIENTO OFICIAL</span>
      <h2 class="apple-section-headline" style="font-size: 2.4rem;">${isEs ? 'Biblioteca Canónica: Los 37 Archivos Originales' : 'Canonical Library: All 37 Authentic Dossiers'}</h2>
      <p class="apple-section-subhead">
        ${isEs 
          ? 'Lee directamente en tu navegador los 37 documentos fuente de ABRAXAS OS: ontología, ingeniería 4D, gobernanza y los 100 prompts cinematográficos. Cero descargas.' 
          : 'Read all 37 authentic dossiers directly in your browser: ontology, 4D engineering, governance, and 100 film prompts. Zero downloads.'}
      </p>
    </div>
    <div style="text-align: center;">
      <a href="./canon/index.html" class="apple-btn-blue" style="font-size: 1.1rem; padding: 14px 28px;">
        ${isEs ? 'Abrir Lector del Canon 37 TXT →' : 'Open 37 TXT Canon Reader →'}
      </a>
    </div>
  </section>

  ${getAppleFooter(locale, 1)}

  <script>
    const tabData = [
      {
        tag: 'FORMAT 01 // AUDIVISUAL SYNTHESIS',
        title: '${isEs ? 'Videos Cortos de Alta Retención (TikTok, Reels, Shorts)' : 'High-Retention Short Video (TikTok, Reels, Shorts)'}',
        desc: '${isEs ? 'Auto-edición en 18 segundos con cortes quirúrgicos de silencios, subtítulos virales animados (estilo Viral Gold y Cyber), gráficos 3D en Remotion y diseño sonoro a 45Hz.' : 'Auto-cut in 18s with sub-millisecond jump cuts, kinetic typography (Viral Gold & Cyber), 3D Remotion motion overlays, and 45Hz sub-bass sound design.'}',
        img: '../assets/plates/plate_05_vav_cathedral.webp'
      },
      {
        tag: 'FORMAT 02 // EDITORIAL GRAPHICS',
        title: '${isEs ? 'Carruseles Visuales de Alta Conversión (Instagram / LinkedIn)' : 'High-Conversion Visual Carousels (Instagram / LinkedIn)'}',
        desc: '${isEs ? 'Diapositivas en formato 4:5 y 1:1 con tipografía editorial de impacto, densidad de información calibrada y esquemas que detienen el scroll.' : '4:5 and 1:1 slide decks with impact typography, calibrated information density, and thumb-stopping visual hierarchy.'}',
        img: '../assets/plates/plate_08_contenido_portal.webp'
      },
      {
        tag: 'FORMAT 03 // WRITTEN AUTHORITY',
        title: '${isEs ? 'Hilos de Autoridad & Posts Largos (X / LinkedIn)' : 'Authority Threads & Long Posts (X / LinkedIn)'}',
        desc: '${isEs ? 'Hilos de 6 a 10 publicaciones redactados con tensión dialéctica y listas de valor listas para publicar en X y LinkedIn.' : '6-10 post threads structured with dialectic tension, punchy bullet points, and high conversion hooks ready to publish.'}',
        img: '../assets/plates/plate_03_continuity_axis.webp'
      },
      {
        tag: 'FORMAT 04 // RETENTION & SALES',
        title: '${isEs ? 'Newsletters y Correos de Venta Sincronizados' : 'Synchronized Newsletters & Sales Emails'}',
        desc: '${isEs ? 'Correos electrónicos con narrativa envolvente y llamados a la acción comerciales sincronizados con la tesis del video.' : 'Engaging editorial emails and sales letters perfectly synchronized with the core video thesis.'}',
        img: '../assets/plates/plate_07_moon_loop.webp'
      },
      {
        tag: 'FORMAT 05 // AUDIO BROADCAST',
        title: '${isEs ? 'Snippets de Audio & Guiones de Podcast' : 'Audio Snippets & Podcast Frameworks'}',
        desc: '${isEs ? 'Pistas de audio normalizadas a -14 LUFS con reducción de ruido y resúmenes para comunidades de Telegram y Spotify.' : 'Audio tracks normalized to -14 LUFS with noise gating and executive takeaways for podcast feeds and Telegram communities.'}',
        img: '../assets/plates/plate_04_shim_metrology.webp'
      },
      {
        tag: 'FORMAT 06 // DEEP-DIVE ESSAY',
        title: '${isEs ? 'Ensayos Audiovisuales Largos (YouTube 16:9)' : 'Long-Form Video Essays (YouTube 16:9)'}',
        desc: '${isEs ? 'Estructura narrativa en 4 tiempos para videos horizontales de 8 a 15 minutos con retención continua.' : '4-beat narrative structure for 8-15 minute horizontal YouTube videos engineered for continuous watch time.'}',
        img: '../assets/plates/plate_10_master_monument.webp'
      }
    ];

    function switchFormatTab(idx, btn) {
      document.querySelectorAll('.apple-format-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const d = tabData[idx];
      document.getElementById('tab-card-tag').innerText = d.tag;
      document.getElementById('tab-card-title').innerText = d.title;
      document.getElementById('tab-card-desc').innerText = d.desc;
      document.getElementById('tab-card-img').src = d.img;
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`[Apple Builder] Generated /${locale}/index.html (Master MacBook Pro Experience)`);
}

// 3. Executive Management Page (/gerencia/index.html)
function generateAppleManagementPage(locale) {
  const isEs = locale === 'es';
  const dir = path.join(docsDir, locale, 'gerencia');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Gobernanza Gerencial y Control de Negocio — ABRAXAS OS' : 'Executive Governance & Business Command — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Cómo ABRAXAS empodera a directores de marketing, CEOs y líderes de negocio: custodia de marca, auditoría al centavo y apalancamiento 1=10.' : 'How ABRAXAS empowers marketing directors, CEOs, and agency owners with strict brand custody and cost telemetry.'}">
  <link rel="stylesheet" href="../../assets/apple-design-system.css">
</head>
<body>
  ${getAppleHeader(locale, 'gerencia', 2)}

  <main class="apple-section" style="padding-top: 100px;">
    <div class="apple-section-header">
      <span class="apple-section-eyebrow" style="color: var(--apple-cyan);">${isEs ? 'ALTA DIRECCIÓN & GOBERNANZA OPERATIVA' : 'EXECUTIVE COMMAND & OPERATIONAL GOVERNANCE'}</span>
      <h1 class="apple-section-headline">${isEs ? 'Control Total de Marca. Cero Caos Operativo.' : 'Total Brand Custody. Zero Operational Chaos.'}</h1>
      <p class="apple-section-subhead">
        ${isEs 
          ? 'Para la gerencia y los líderes de negocio, ABRAXAS no es solo un software de edición: es un centro de comando empresarial que audita costos al centavo, elimina retainers de agencias y garantiza que ningún contenido salga con errores.' 
          : 'For executives and marketing leaders, ABRAXAS is an enterprise command center auditing costs to the penny, eliminating agency retainers, and enforcing zero error tolerance.'}
      </p>
    </div>

    <!-- 4 Executive Power Pillars Bento Grid -->
    <div class="apple-bento-grid" style="margin-bottom: 4rem;">
      
      <div class="apple-bento-card apple-bento-col-6">
        <div>
          <span class="apple-card-tag gold">🛡️ PILAR 01 // CUSTODIA DE MARCA</span>
          <h3 class="apple-card-title">${isEs ? 'Criterio Inmutable y Anti-Deriva' : 'Immutable Brand Voice Custody'}</h3>
          <p class="apple-card-desc">
            ${isEs 
              ? 'La dirección define la voz de marca, temas prohibidos y promesas de venta una sola vez. Ningún copywriter, editor junior o agencia puede publicar contenido fuera de tono.' 
              : 'Management defines brand voice axioms and compliance once. No junior copywriter or freelancer can publish off-brand content.'}
          </p>
        </div>
        <div class="apple-card-media" style="aspect-ratio: 16/9;">
          <img src="../../assets/plates/plate_03_continuity_axis.webp" alt="Brand Custody">
        </div>
      </div>

      <div class="apple-bento-card apple-bento-col-6">
        <div>
          <span class="apple-card-tag cyan">📊 PILAR 02 // TELEMETRÍA DE COSTOS</span>
          <h3 class="apple-card-title">${isEs ? 'Auditoría al Centavo y Cuellos de Botella' : 'Cost & Turnaround Telemetry'}</h3>
          <p class="apple-card-desc">
            ${isEs 
              ? 'Deja de adivinar por qué la producción se retrasa. El registro de telemetría SQLite mide los tiempos de cada etapa, el costo por pieza y el rendimiento exacto del equipo.' 
              : 'Stop chasing team members for delays. SQLite telemetry measures turnaround time per stage, asset manufacturing cost, and team throughput.'}
          </p>
        </div>
        <div class="apple-card-media" style="aspect-ratio: 16/9;">
          <img src="../../assets/plates/plate_09_system_dashboard.webp" alt="Cost Telemetry">
        </div>
      </div>

      <div class="apple-bento-card apple-bento-col-6">
        <div>
          <span class="apple-card-tag emerald">⚡ PILAR 03 // APALANCAMIENTO 1 = 10</span>
          <h3 class="apple-card-title">${isEs ? '1 Operador Reemplaza una Agencia' : '1 Operator Replaces an Agency'}</h3>
          <p class="apple-card-desc">
            ${isEs 
              ? 'Ahorra $5,000–$15,000/mes en retainers de agencias lentas y nóminas infladas. Un solo operador gobierna y aprueba 50 a 100 piezas multicanal al mes en una sola tarde.' 
              : 'Save $5k-$15k/mo on slow agency retainers. A single internal operator governs and approves 50-100 multi-channel assets in one afternoon.'}
          </p>
        </div>
        <div class="apple-card-media" style="aspect-ratio: 16/9;">
          <img src="../../assets/plates/plate_02_he_macro.webp" alt="Team Leverage">
        </div>
      </div>

      <div class="apple-bento-card apple-bento-col-6">
        <div>
          <span class="apple-card-tag purple">🔒 PILAR 04 // SOBERANÍA EMPRESARIAL</span>
          <h3 class="apple-card-title">${isEs ? 'Privacidad Total en Apple Silicon Local' : 'Local Apple Silicon Sovereignty'}</h3>
          <p class="apple-card-desc">
            ${isEs 
              ? 'Todo se ejecuta en tu hardware Mac local. Tus estrategias comerciales, bases de clientes y grabaciones nunca se suben a la nube ni entrenan modelos de terceros.' 
              : 'Everything executes locally on your Mac. Proprietary business strategies and recordings never leak to third-party public AI clouds.'}
          </p>
        </div>
        <div class="apple-card-media" style="aspect-ratio: 16/9;">
          <img src="../../assets/plates/plate_04_shim_metrology.webp" alt="Local Sovereignty">
        </div>
      </div>

    </div>

    <!-- 6 Executive Quality Gates Matrix -->
    <div class="apple-bento-card apple-bento-col-12" style="background: rgba(14, 18, 28, 0.9); border: 1px solid rgba(56, 189, 248, 0.35);">
      <h3 style="font-size: 1.6rem; color: #fff; margin-bottom: 1.5rem; text-align: center;">
        🏛️ ${isEs ? 'Las 6 Compuertas de Control Ejecutivo' : 'The 6 Executive Quality Gates'}
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
        <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 12px; border-top: 3px solid #d4af37;">
          <strong style="color: #fff; font-size: 14px; display: block; margin-bottom: 6px;">1. Tesis Aprobada</strong>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Dirección valida el ángulo y oferta comercial.</p>
        </div>
        <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 12px; border-top: 3px solid #38bdf8;">
          <strong style="color: #fff; font-size: 14px; display: block; margin-bottom: 6px;">2. Guion Auditado</strong>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Revisión de afirmaciones y llamados a la acción.</p>
        </div>
        <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 12px; border-top: 3px solid #ec4899;">
          <strong style="color: #fff; font-size: 14px; display: block; margin-bottom: 6px;">3. Verificación SHIM</strong>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">IA audita audio y encuadre en el set (0 errores).</p>
        </div>
        <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 12px; border-top: 3px solid #a855f7;">
          <strong style="color: #fff; font-size: 14px; display: block; margin-bottom: 6px;">4. Control de Marca</strong>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Diseño visual según el manual de identidad.</p>
        </div>
        <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 12px; border-top: 3px solid #34c759;">
          <strong style="color: #fff; font-size: 14px; display: block; margin-bottom: 6px;">5. Firma Ejecutiva</strong>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Luz verde de la gerencia en un solo clic.</p>
        </div>
        <div style="background: rgba(255,255,255,0.04); padding: 16px; border-radius: 12px; border-top: 3px solid #f59e0b;">
          <strong style="color: #fff; font-size: 14px; display: block; margin-bottom: 6px;">6. Retorno de ROI</strong>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">Métricas de retención y ventas al negocio.</p>
        </div>
      </div>
    </div>
  </main>

  ${getAppleFooter(locale, 2)}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`[Apple Builder] Generated /${locale}/gerencia/index.html (Executive Command Page)`);
}

// 4. Multi-Channel Ecosystem Page (/ecosistema/index.html)
function generateAppleEcosystemPage(locale) {
  const isEs = locale === 'es';
  const dir = path.join(docsDir, locale, 'ecosistema');
  fs.mkdirSync(dir, { recursive: true });

  const formats = [
    {
      icon: '🎬',
      name: isEs ? 'Videos Cortos (9:16)' : 'Short-Form Video (9:16)',
      channels: 'TikTok, Instagram Reels, YouTube Shorts',
      desc: isEs ? 'Auto-edición en 18s con cortes de silencio, subtítulos cinéticos con 13 familias de movimiento en Remotion y diseño sonoro a 45Hz.' : '18s auto-cut with silent trimming, kinetic typography, 13 Remotion motion families, and 45Hz sub-bass sound design.',
      plate: '../../assets/plates/plate_05_vav_cathedral.webp'
    },
    {
      icon: '🖼️',
      name: isEs ? 'Carruseles Visuales (4:5 y 1:1)' : 'Visual Carousels (4:5 & 1:1)',
      channels: 'Instagram, LinkedIn Carousel PDF',
      desc: isEs ? 'Diapositivas de alto impacto visual con jerarquía tipográfica impecable, densidad de valor y esquemas visuales diseñados para maximizar shares y guardados.' : 'High-impact slide decks with editorial typography and information density designed for maximal saves and shares.',
      plate: '../../assets/plates/plate_08_contenido_portal.webp'
    },
    {
      icon: '✍️',
      name: isEs ? 'Hilos y Posts de Autoridad' : 'Authority Threads & Articles',
      channels: 'X (Twitter), LinkedIn Articles',
      desc: isEs ? 'Hilos de 6 a 10 publicaciones redactados con tensión dialéctica y listas de valor que posicionan tu marca como referente de autoridad en tu sector.' : '6-10 post threads structured with dialectic tension and authority bullets positioning your brand as the niche leader.',
      plate: '../../assets/plates/plate_03_continuity_axis.webp'
    },
    {
      icon: '📧',
      name: isEs ? 'Newsletters y Correos de Venta' : 'Newsletters & Sales Copy',
      channels: 'Substack, Mailchimp, Klaviyo, ActiveCampaign',
      desc: isEs ? 'Emails de alto valor editorial y venta directa sincronizados con la tesis del video para nutrir a tu lista de suscriptores y generar conversiones.' : 'Editorial emails and direct-response sales copy synchronized with the video thesis to convert subscribers into clients.',
      plate: '../../assets/plates/plate_07_moon_loop.webp'
    },
    {
      icon: '🎙️',
      name: isEs ? 'Audio Broadcast y Podcasts' : 'Audio Broadcast & Podcasts',
      channels: 'Spotify Podcasts, Telegram Audio, Voice Drops',
      desc: isEs ? 'Pistas de audio normalizadas a -14 LUFS con reducción de ruido y resúmenes ejecutivos listos para enviar a tus comunidades privadas.' : 'Mastered audio tracks normalized to -14 LUFS with noise gating and executive takeaways for podcast feeds and Telegram.',
      plate: '../../assets/plates/plate_04_shim_metrology.webp'
    },
    {
      icon: '🎥',
      name: isEs ? 'Ensayos Audiovisuales Largos (16:9)' : 'Long-Form Video Essays (16:9)',
      channels: 'YouTube Long-form, Webinars',
      desc: isEs ? 'Guiones estructurados en 4 tiempos para videos horizontales de 8 a 15 minutos que mantienen la retención de la audiencia de principio a fin.' : '4-beat narrative scripts for 8-15 minute horizontal YouTube videos engineered for continuous watch time and monetization.',
      plate: '../../assets/plates/plate_10_master_monument.webp'
    }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Ecosistema de Contenidos 8-en-1 — ABRAXAS OS' : '8-in-1 Content Ecosystem — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Descubre cómo una sola idea se transforma en 8 formatos de contenido vivos a velocidad industrial con ABRAXAS OS.' : 'Discover how one core seed transforms into 8 live content formats at industrial velocity.'}">
  <link rel="stylesheet" href="../../assets/apple-design-system.css">
</head>
<body>
  ${getAppleHeader(locale, 'ecosistema', 2)}

  <main class="apple-section" style="padding-top: 100px;">
    <div class="apple-section-header">
      <span class="apple-section-eyebrow" style="color: var(--apple-gold);">${isEs ? 'FÁBRICA MULTICANAL INDUSTRIAL' : 'INDUSTRIAL MULTI-CHANNEL ENGINE'}</span>
      <h1 class="apple-section-headline">${isEs ? '1 Sola Semilla. 8 Formatos Vivos.' : '1 Core Seed. 8 Living Formats.'}</h1>
      <p class="apple-section-subhead">
        ${isEs 
          ? 'El Módulo Contenido y el Eje de Continuidad eliminan para siempre el retrabajo manual. Una sola tesis aprobada se ramifica automáticamente en todo tu ecosistema de publicaciones.' 
          : 'The Continuity Module and Merkle-DAG eliminate manual rewriting forever. One approved thesis branches automatically across your multi-channel fleet.'}
      </p>
    </div>

    <!-- Formats Grid -->
    <div class="apple-bento-grid">
      ${formats.map(f => `
      <div class="apple-bento-card apple-bento-col-6">
        <div>
          <span class="apple-card-tag gold">${f.icon} ${f.channels}</span>
          <h3 class="apple-card-title">${f.name}</h3>
          <p class="apple-card-desc">${f.desc}</p>
        </div>
        <div class="apple-card-media" style="aspect-ratio: 16/9;">
          <img src="${f.plate}" alt="${f.name}">
        </div>
      </div>
      `).join('')}
    </div>

    <!-- Merkle-DAG Single Piece Identity Banner -->
    <div class="apple-bento-card apple-bento-col-12" style="margin-top: 3rem; background: rgba(12, 16, 24, 0.88); border: 1px solid rgba(212, 175, 55, 0.35);">
      <div style="text-align: center; max-width: 800px; margin: 0 auto;">
        <span class="apple-card-tag cyan">MERKLE-DAG & CONTINUITY AXIS</span>
        <h3 style="font-size: 2rem; color: #fff; margin: 10px 0;">${isEs ? 'Sincronización Automática en Tiempo Real' : 'Real-Time Automatic Synchronization'}</h3>
        <p style="font-size: 1rem; color: #94a3b8; line-height: 1.6;">
          ${isEs 
            ? 'Si editas una sola frase en el guion central, los subtítulos del video 9:16, las diapositivas del carrusel 4:5, el hilo de X y la newsletter se actualizan solos al unísono. Cero archivos desincronizados.' 
            : 'If you edit a single sentence in your master script, the 9:16 reel captions, 4:5 carousel slides, X thread, and newsletter update in lockstep with zero broken links.'}
        </p>
      </div>
    </div>
  </main>

  ${getAppleFooter(locale, 2)}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`[Apple Builder] Generated /${locale}/ecosistema/index.html (Ecosystem Page)`);
}

// 5. 13 Modular Tools Page (/herramientas/index.html)
function generateAppleToolsPage(locale) {
  const isEs = locale === 'es';
  const dir = path.join(docsDir, locale, 'herramientas');
  fs.mkdirSync(dir, { recursive: true });

  const tools = [
    { id: 'YOD', glyph: 'י', name: isEs ? 'YOD // Inteligencia de Nicho' : 'YOD // Creative Intelligence', desc: isEs ? 'Escanea puntos ciegos de la audiencia y genera 3 ganchos dialécticos calificados de 0 a 100.' : 'Scans audience blind spots and generates 3 contrarian hooks scored 0-100.', tag: 'ATZILUTH' },
    { id: 'CONTENIDO', glyph: '◈', name: isEs ? 'CONTENIDO // Eje de Continuidad' : 'CONTENIDO // Continuity Axis', desc: isEs ? 'Árbol Merkle-DAG con contentId inmutable que sincroniza 8 formatos derivados de 1 sola idea.' : 'Merkle-DAG data tree anchoring single-piece identity across 8 derivatives.', tag: 'BERIAH' },
    { id: 'LIENZO', glyph: '▤', name: isEs ? 'LIENZO // Compositor Espacial' : 'LIENZO // Spatial Canvas', desc: isEs ? 'Línea de tiempo multipista con zonas seguras (9:16, 4:5, 16:9) y priors visuales.' : 'Multi-track spatial timeline with safe zones (9:16, 4:5, 16:9) and layout presets.', tag: 'BERIAH' },
    { id: 'ARQUITECTO', glyph: '👁️', name: isEs ? 'ARQUITECTO // Lente Cognitivo' : 'ARQUITECTO // Cognitive Lens', desc: isEs ? 'Orquestador del sistema con consulta en lenguaje natural sobre la memoria de marca.' : 'System orchestrator with real-time natural language query over brand memory.', tag: 'ORCHESTRATOR' },
    { id: 'SHIM', glyph: 'ש', name: isEs ? 'SHIM // Metrología 0.00% GAPs' : 'SHIM // Reality Metrology', desc: isEs ? 'Auditoría con Whisper y visión computacional que detecta omisiones en el set al instante.' : 'Whisper Large V3 and computer vision auditing reality vs planned script.', tag: 'DAAT' },
    { id: 'VAV', glyph: 'ו', name: isEs ? 'VAV // Auto-Síntesis en 18s' : 'VAV // Auto-Synthesis Forge', desc: isEs ? 'Cortes precisos, tipografía cinética Remotion, audio a -14 LUFS y diapositivas de carrusel.' : 'Auto-cut jumps, Remotion kinetic typography, audio mastering, and graphic slides.', tag: 'YETZIRAH' },
    { id: 'HE', glyph: 'ה', name: isEs ? 'HE // Despacho Kanban' : 'HE // Operational Kanban Desk', desc: isEs ? 'Tablero de gobernanza para aprobar y gestionar lotes de 50 piezas de contenido en una tarde.' : 'Operational Kanban desk to govern and batch-export 50 assets in one afternoon.', tag: 'ASSIAH' },
    { id: 'INTAKE', glyph: '📥', name: isEs ? 'UNIVERSAL INTAKE' : 'UNIVERSAL INTAKE', desc: isEs ? 'Ingesta videos, notas de voz, PDFs y llamadas de Zoom, extrayendo ideas atómicas.' : 'Ingests raw video, voice memos, PDFs, and Zoom calls into atomic ideas.', tag: 'INGRESS' },
    { id: 'PIPELINE', glyph: '⚙️', name: isEs ? 'PIPELINE ENGINE' : 'PIPELINE ENGINE', desc: isEs ? 'Ejecución determinista de blueprints con tolerancia a fallos y recuperación automática.' : 'Deterministic execution of blueprint DAGs with automated fail-closed recovery.', tag: 'ENGINE' },
    { id: 'AIRUNTIME', glyph: '🧠', name: isEs ? 'AI RUNTIME' : 'AI RUNTIME', desc: isEs ? 'Inferencia LLM local y puente multiproveedor con esquemas estrictos sin alucinaciones.' : 'Local LLM inference bridge with zero hallucination schema enforcement.', tag: 'RUNTIME' },
    { id: 'PUBLISHING', glyph: '🚀', name: isEs ? 'PUBLISHING ENGINE' : 'PUBLISHING ENGINE', desc: isEs ? 'Empaquetado y distribución multicanal directa a TikTok, Reels, Shorts, X y LinkedIn.' : 'Multi-channel packaging and distribution to TikTok, Reels, Shorts, X, LinkedIn.', tag: 'DISTRIBUTION' },
    { id: 'METRICS', glyph: '📈', name: isEs ? 'METRICS TELEMETRY' : 'METRICS TELEMETRY', desc: isEs ? 'Ingesta curvas de retención segundo a segundo, tasas de lectura y clics reales.' : 'Ingests second-by-second watch time, swipe rates, and real engagement.', tag: 'TELEMETRY' },
    { id: 'DIMENSIONA', glyph: '🔄', name: isEs ? 'DIMENSIÓN A // APRENDIZAJE' : 'DIMENSION A // ADAPTIVE AI', desc: isEs ? 'Ecuación de aprendizaje S(t+1) = S(t) + A(t) que retroalimenta a YOD para el siguiente lote.' : 'Continuous learning equation S(t+1) = S(t) + A(t) compounding brand intelligence.', tag: 'LEARNING' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Las 13 Herramientas Modulares — ABRAXAS OS' : '13 Modular Tools & Operators — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Suite completa de 13 herramientas modulares para la manufactura y gobernanza de contenidos.' : 'Complete suite of 13 modular tools for content intelligence and governance.'}">
  <link rel="stylesheet" href="../../assets/apple-design-system.css">
</head>
<body>
  ${getAppleHeader(locale, 'herramientas', 2)}

  <main class="apple-section" style="padding-top: 100px;">
    <div class="apple-section-header">
      <span class="apple-section-eyebrow" style="color: var(--apple-cyan);">${isEs ? 'SUITE INTEGRADA DE 13 MÓDULOS' : 'INTEGRATED 13-MODULE SUITE'}</span>
      <h1 class="apple-section-headline">${isEs ? '13 Operadores. Un Solo Sistema.' : '13 Operators. One Sovereign OS.'}</h1>
      <p class="apple-section-subhead">
        ${isEs 
          ? 'Cada herramienta ejecuta una transformación determinista sobre tus contenidos sin depender de servicios externos.' 
          : 'Every tool executes deterministic mathematical transformations over your content without external cloud dependencies.'}
      </p>
    </div>

    <!-- Tools Grid -->
    <div class="apple-bento-grid">
      ${tools.map(t => `
      <div class="apple-bento-card apple-bento-col-4">
        <div>
          <span class="apple-card-tag gold">${t.glyph} ${t.tag}</span>
          <h3 class="apple-card-title" style="font-size: 1.25rem;">${t.name}</h3>
          <p class="apple-card-desc" style="font-size: 0.88rem;">${t.desc}</p>
        </div>
      </div>
      `).join('')}
    </div>
  </main>

  ${getAppleFooter(locale, 2)}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`[Apple Builder] Generated /${locale}/herramientas/index.html (Tools Page)`);
}

// 6. Architecture & 4D Page (/arquitectura/index.html)
function generateAppleArchitecturePage(locale) {
  const isEs = locale === 'es';
  const dir = path.join(docsDir, locale, 'arquitectura');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Cábala & Arquitectura 4D XYZA — ABRAXAS OS' : 'Kabbalah & 4D XYZA Architecture — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Los 4 Mundos, el Árbol de la Vida y el Espacio de Estados Cuatridimensional XYZA aplicados a la creación de contenidos.' : 'The Four Worlds, Tree of Life, and 4D State Space XYZA applied to content intelligence.'}">
  <link rel="stylesheet" href="../../assets/apple-design-system.css">
</head>
<body>
  ${getAppleHeader(locale, 'arquitectura', 2)}

  <main class="apple-section" style="padding-top: 100px;">
    <div class="apple-section-header">
      <span class="apple-section-eyebrow" style="color: var(--apple-purple);">${isEs ? 'ONTOLOGÍA Y ESPACIO 4D' : 'ONTOLOGY & 4D STATE-SPACE'}</span>
      <h1 class="apple-section-headline">${isEs ? 'Cábala Aplicada al Software.' : 'Kabbalah Applied to Software.'}</h1>
      <p class="apple-section-subhead">
        ${isEs 
          ? 'La Cábala en ABRAXAS no es misticismo ni religión: es el mapa matemático universal de cómo una idea abstracta se condensa en un archivo físico sin perder su pureza.' 
          : 'Kabbalah in ABRAXAS is not mysticism: it is the universal mathematical map of how abstract intent condenses into physical media without entropy.'}
      </p>
    </div>

    <!-- 4 Worlds Grid -->
    <div class="apple-bento-grid" style="margin-bottom: 3rem;">
      <div class="apple-bento-card apple-bento-col-6">
        <span class="apple-card-tag gold">1. ATZILUTH // EMANACIÓN (YOD)</span>
        <h3 class="apple-card-title">${isEs ? 'Cámara de Tesis Pura' : 'Pure Emanation Chamber'}</h3>
        <p class="apple-card-desc">${isEs ? 'Donde nace la intención y se fijan los axiomas de marca inmutables.' : 'Where pure intent is born and unshakeable brand voice axioms are fixed.'}</p>
      </div>

      <div class="apple-bento-card apple-bento-col-6">
        <span class="apple-card-tag cyan">2. BERI\\'AH // CREACIÓN (HE I)</span>
        <h3 class="apple-card-title">${isEs ? 'El Eje de Continuidad' : 'The Continuity Axis'}</h3>
        <p class="apple-card-desc">${isEs ? 'Donde la idea se estructura en guion y se ramifica en los 8 formatos.' : 'Where the idea structures into a script and branches into 8 formats.'}</p>
      </div>

      <div class="apple-bento-card apple-bento-col-6">
        <span class="apple-card-tag purple">3. YETZIRAH // FORMACIÓN (VAV)</span>
        <h3 class="apple-card-title">${isEs ? 'Catedral de Auto-Síntesis' : 'Auto-Synthesis Cathedral'}</h3>
        <p class="apple-card-desc">${isEs ? 'Donde se forjan los cortes de video, los subtítulos cinéticos y las láminas.' : 'Where video cuts, kinetic subtitles, and graphic slides are forged.'}</p>
      </div>

      <div class="apple-bento-card apple-bento-col-6">
        <span class="apple-card-tag emerald">4. ASSIAH // ACCIÓN (HE II)</span>
        <h3 class="apple-card-title">${isEs ? 'El Taller Físico y Publicación' : 'Physical Workshop & Media'}</h3>
        <p class="apple-card-desc">${isEs ? 'Donde los archivos finales se exportan y se distribuyen a las redes.' : 'Where final media renders and distributes across social networks.'}</p>
      </div>
    </div>
  </main>

  ${getAppleFooter(locale, 2)}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`[Apple Builder] Generated /${locale}/arquitectura/index.html (Architecture Page)`);
}

// 7. Dedicated Canon 37 TXT Library Page (/canon/index.html)
function generateAppleCanonPage(locale) {
  const isEs = locale === 'es';
  const dir = path.join(docsDir, locale, 'canon');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Canon 37 TXT — Biblioteca Canónica de ABRAXAS OS' : 'Canon 37 TXT — ABRAXAS OS Canonical Dossier Library'}</title>
  <meta name="description" content="${isEs ? 'Lee los 37 textos canónicos originales completos de ABRAXAS OS directamente en el navegador. Cero descargas.' : 'Read all 37 authentic dossiers directly in your browser with live search and zero downloads.'}">
  <link rel="stylesheet" href="../../assets/apple-design-system.css">
  <style>
    .canon-search-box {
      width: 100%;
      max-width: 650px;
      padding: 14px 20px;
      background: #0d0d11;
      border: 1px solid rgba(212, 175, 55, 0.4);
      border-radius: 12px;
      color: #fff;
      font-size: 15px;
      outline: none;
      transition: all 0.2s ease;
    }
    .canon-search-box:focus {
      border-color: #d4af37;
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
    }
    .canon-filter-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #94a3b8;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .canon-filter-btn.active, .canon-filter-btn:hover {
      background: rgba(212, 175, 55, 0.2);
      border-color: #d4af37;
      color: #fff;
    }
    .canon-accordion {
      background: #0d0d11;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 18px 24px;
      transition: all 0.2s ease;
    }
    .canon-accordion[open] {
      border-color: #d4af37;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
    }
    .canon-accordion summary {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      color: #fff;
      font-size: 15px;
      list-style: none;
      outline: none;
    }
    .canon-accordion summary::-webkit-details-marker {
      display: none;
    }
  </style>
</head>
<body>
  ${getAppleHeader(locale, 'canon', 2)}

  <main class="apple-section" style="padding-top: 100px;">
    
    <div class="apple-section-header">
      <span class="apple-section-eyebrow" style="color: var(--apple-gold);">${isEs ? 'BASE DE CONOCIMIENTO OFICIAL // 37 DOCUMENTOS' : 'CANONICAL KNOWLEDGE BASE // 37 DOSSIERS'}</span>
      <h1 class="apple-section-headline">${isEs ? 'Biblioteca Canónica de ABRAXAS OS' : 'ABRAXAS OS Canonical Dossier Library'}</h1>
      <p class="apple-section-subhead">
        ${isEs 
          ? 'Lee directamente en esta página el texto 100% completo y los resúmenes ejecutivos de los 37 archivos canónicos. Cero descargas requeridas.' 
          : 'Read the 100% complete authentic text and executive summaries of all 37 canonical dossiers directly in this browser window. Zero downloads required.'}
      </p>
    </div>

    <!-- Search and Controls -->
    <div style="background: #09090c; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 18px; padding: 24px; margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <input type="text" id="canon-search-input" class="canon-search-box" placeholder="${isEs ? '🔍 Buscar por nombre, concepto o módulo (ej: Whisper, Daat, Motion, Dion, Merkle)...' : '🔍 Search by name, concept, or module (e.g. Whisper, Daat, Motion, Dion)...'}" oninput="filterCanonFiles()">
        <div style="display: flex; gap: 8px;">
          <button class="canon-filter-btn" onclick="toggleAllDetails(true)">${isEs ? '➕ Expandir Todos' : '➕ Expand All'}</button>
          <button class="canon-filter-btn" onclick="toggleAllDetails(false)">${isEs ? '➖ Colapsar Todos' : '➖ Collapse All'}</button>
        </div>
      </div>

      <!-- Categories -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="canon-filter-btn active" onclick="setCategoryFilter('all', this)">${isEs ? 'Todos (37)' : 'All (37)'}</button>
        <button class="canon-filter-btn" onclick="setCategoryFilter('cat-1', this)">${isEs ? 'I. Ontología (7)' : 'I. Ontology (7)'}</button>
        <button class="canon-filter-btn" onclick="setCategoryFilter('cat-2', this)">${isEs ? 'II. Arquitectura & 4D (13)' : 'II. Architecture & 4D (13)'}</button>
        <button class="canon-filter-btn" onclick="setCategoryFilter('cat-3', this)">${isEs ? 'III. 100 Keyframes & Prompts (17)' : 'III. 100 Keyframes & Prompts (17)'}</button>
      </div>
    </div>

    <!-- Dossiers List -->
    <div id="canon-cards-container" style="display: flex; flex-direction: column; gap: 16px;">
      ${corpusFiles.map((file, idx) => {
        const summaryObj = fileSummaries[file.id] || { es: 'Documento canónico de ABRAXAS OS.', en: 'Canonical dossier of ABRAXAS OS.' };
        const summary = isEs ? summaryObj.es : summaryObj.en;
        
        let catClass = 'cat-1';
        if (file.category.includes('ARQUITECTURA')) catClass = 'cat-2';
        else if (file.category.includes('KEYFRAMES')) catClass = 'cat-3';

        return `
      <details class="canon-accordion ${catClass}" data-filename="${file.fileName.toLowerCase()}" data-category="${file.category.toLowerCase()}" data-summary="${summary.toLowerCase()}">
        <summary>
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <span style="color: #d4af37; font-family: monospace; font-size: 14px;">📄 ${file.fileName}</span>
            <span style="font-size: 11px; font-family: monospace; color: #38bdf8; background: rgba(56,189,248,0.12); padding: 3px 10px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.25);">${isEs ? file.category : file.categoryEn}</span>
          </div>
          <span style="color: #d4af37; font-size: 12px; font-family: monospace; background: rgba(212,175,55,0.12); padding: 4px 12px; border-radius: 6px;">${isEs ? '+ VER TEXTO COMPLETO' : '+ READ FULL TEXT'} (${(file.sizeBytes / 1024).toFixed(1)} KB)</span>
        </summary>
        
        <!-- Summary Box -->
        <div style="margin-top: 16px; padding: 14px 18px; background: rgba(212,175,55,0.08); border-left: 3px solid #d4af37; border-radius: 0 8px 8px 0;">
          <div style="font-size: 11px; font-weight: 800; color: #d4af37; font-family: monospace; margin-bottom: 4px;">📌 ${isEs ? 'RESUMEN EJECUTIVO:' : 'EXECUTIVE SUMMARY:'}</div>
          <p style="font-size: 13.5px; color: rgba(255,255,255,0.92); margin: 0; line-height: 1.5;">${summary}</p>
        </div>

        <!-- Full Text Box -->
        <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11.5px; font-weight: 800; color: #94a3b8; font-family: monospace;">📄 ${isEs ? 'TEXTO ORIGINAL COMPLETO (100% EN NAVEGADOR):' : 'FULL ORIGINAL TEXT (100% IN-BROWSER):'}</span>
            <button onclick="navigator.clipboard.writeText(this.closest('.canon-accordion').querySelector('code').innerText); alert('${isEs ? '¡Texto copiado al portapapeles!' : 'Text copied to clipboard!'}')" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #d4af37; font-size: 11px; padding: 4px 10px; border-radius: 6px; cursor: pointer;">📋 ${isEs ? 'Copiar' : 'Copy'}</button>
          </div>
          <pre style="max-height: 480px; overflow-y: auto; background: #030508; padding: 18px; border-radius: 10px; font-family: 'SF Mono', Menlo, monospace; font-size: 12px; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap; word-break: break-word; border: 1px solid rgba(212,175,55,0.3);"><code>${escapeHtml(file.content)}</code></pre>
        </div>
      </details>
        `;
      }).join('\n')}
    </div>

  </main>

  ${getAppleFooter(locale, 2)}

  <script>
    let currentCategory = 'all';

    function setCategoryFilter(cat, btn) {
      currentCategory = cat;
      document.querySelectorAll('.canon-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCanonFiles();
    }

    function filterCanonFiles() {
      const q = (document.getElementById('canon-search-input').value || '').toLowerCase().trim();
      const items = document.querySelectorAll('.canon-accordion');
      
      items.forEach(item => {
        const matchesCategory = (currentCategory === 'all') || item.classList.contains(currentCategory);
        const name = item.getAttribute('data-filename') || '';
        const summary = item.getAttribute('data-summary') || '';
        const matchesQuery = !q || name.includes(q) || summary.includes(q);

        if (matchesCategory && matchesQuery) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }

    function toggleAllDetails(expand) {
      document.querySelectorAll('.canon-accordion').forEach(details => {
        details.open = expand;
      });
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`[Apple Builder] Generated /${locale}/canon/index.html (Canon Library Page)`);
}

// 8. Quick Guide Page (/guia/index.html)
function generateAppleGuidePage(locale) {
  const isEs = locale === 'es';
  const dir = path.join(docsDir, locale, 'guia');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Guía Rápida en 2 Minutos y Proceso en 6 Pasos — ABRAXAS OS' : 'Quick 2-Minute Guide & 6-Step Workflow — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Entiende ABRAXAS OS en 2 minutos sin tecnicismos ni cábala. El proceso paso a paso para crear un mes de contenido multicanal.' : 'Understand ABRAXAS OS in 2 minutes without jargon or complexity.'}">
  <link rel="stylesheet" href="../../assets/apple-design-system.css">
</head>
<body>
  ${getAppleHeader(locale, 'guia', 2)}

  <main class="apple-section" style="padding-top: 100px;">
    
    <div class="apple-section-header">
      <span class="apple-section-eyebrow" style="color: var(--apple-gold);">${isEs ? 'PARA TODOS // CERO CÓDIGO // CERO COMPLICACIONES' : 'FOR EVERYONE // ZERO CODE // ZERO COMPLEXITY'}</span>
      <h1 class="apple-section-headline">${isEs ? 'ABRAXAS Explicado en 2 Minutos' : 'ABRAXAS Explained in 2 Minutes'}</h1>
      <p class="apple-section-subhead">
        ${isEs 
          ? 'Imagina una fábrica inteligente dentro de tu Mac que toma una sola idea y genera en minutos todo tu contenido para redes sociales: videos cortos, carruseles visuales, hilos de X/LinkedIn, newsletters y audios sin trabajo manual.' 
          : 'Imagine an intelligent factory inside your Mac that takes a single idea and manufactures your entire social media fleet in minutes without manual friction.'}
      </p>
    </div>

    <!-- 6 Simple Steps Grid -->
    <div class="apple-bento-grid">
      
      <div class="apple-bento-card apple-bento-col-4">
        <span class="apple-card-tag gold">PASO 01</span>
        <h3 class="apple-card-title">${isEs ? '1. Encuentra la Idea & Gancho' : '1. Idea & Viral Hook'}</h3>
        <p class="apple-card-desc">${isEs ? 'Escribes tu tema y YOD te entrega 3 ganchos magnéticos calificados de 0 a 100 para detener el scroll.' : 'Type your topic and YOD outputs 3 magnetic hooks scored 0-100 to stop the scroll.'}</p>
      </div>

      <div class="apple-bento-card apple-bento-col-4">
        <span class="apple-card-tag cyan">PASO 02</span>
        <h3 class="apple-card-title">${isEs ? '2. Ramificación en 8 Formatos' : '2. 8-Format Branching'}</h3>
        <p class="apple-card-desc">${isEs ? 'La tesis central genera a la vez: guion de video, carrusel de 8 láminas, hilo de X y newsletter.' : 'The thesis generates simultaneously: video script, 8-slide carousel, X thread, and newsletter.'}</p>
      </div>

      <div class="apple-bento-card apple-bento-col-4">
        <span class="apple-card-tag purple">PASO 03</span>
        <h3 class="apple-card-title">${isEs ? '3. Grabación con Teleprompter' : '3. Teleprompter Recording'}</h3>
        <p class="apple-card-desc">${isEs ? 'Lees tu guion a tu ritmo en la app sin preocuparte por el desorden de archivos.' : 'Read your script at your natural pace while the system neatly tags your clips.'}</p>
      </div>

      <div class="apple-bento-card apple-bento-col-4">
        <span class="apple-card-tag emerald">PASO 04</span>
        <h3 class="apple-card-title">${isEs ? '4. Verificación SHIM (0 Errores)' : '4. SHIM Quality Check'}</h3>
        <p class="apple-card-desc">${isEs ? 'La IA escucha tu audio con Whisper y te avisa si omitiste una palabra para corregir en el set.' : 'Whisper listens to your audio and alerts you if you missed words before leaving the set.'}</p>
      </div>

      <div class="apple-bento-card apple-bento-col-4">
        <span class="apple-card-tag gold">PASO 05</span>
        <h3 class="apple-card-title">${isEs ? '5. Auto-Síntesis en 18 Segundos' : '5. 18-Second Auto-Synthesis'}</h3>
        <p class="apple-card-desc">${isEs ? 'En 18s corta silencios, pone subtítulos virales animados y exporta las láminas del carrusel.' : 'In 18s it auto-cuts pauses, adds dynamic subtitles, and outputs graphic slide decks.'}</p>
      </div>

      <div class="apple-bento-card apple-bento-col-4">
        <span class="apple-card-tag cyan">PASO 06</span>
        <h3 class="apple-card-title">${isEs ? '6. Despacho de 50 Piezas y ROI' : '6. 50-Asset Batch & ROI'}</h3>
        <p class="apple-card-desc">${isEs ? 'Apruebas un mes de contenido en una tarde y el sistema aprende de la retención para el siguiente lote.' : 'Approve a month of content in one afternoon and the system learns from audience retention.'}</p>
      </div>

    </div>
  </main>

  ${getAppleFooter(locale, 2)}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`[Apple Builder] Generated /${locale}/guia/index.html (Quick Guide Page)`);
}

// 9. Legacy Backup Snapshot Page (/backup/index.html)
function generateBackupSnapshotPage(locale) {
  const isEs = locale === 'es';
  const dir = path.join(docsDir, locale, 'backup');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Versión Anterior / Snapshot de Backup — ABRAXAS OS' : 'Legacy Backup Snapshot — ABRAXAS OS'}</title>
  <link rel="stylesheet" href="../../assets/apple-design-system.css">
</head>
<body>
  ${getAppleHeader(locale, 'backup', 2)}

  <main class="apple-section" style="padding-top: 100px; text-align: center;">
    <span class="apple-card-tag gold">🏛️ INSTANTÁNEA HISTÓRICA / BACKUP</span>
    <h1 class="apple-section-headline" style="font-size: 2.8rem;">
      ${isEs ? 'Versión Anterior de Respaldo' : 'Legacy System Backup Snapshot'}
    </h1>
    <p class="apple-section-subhead" style="margin-bottom: 2rem;">
      ${isEs 
        ? 'Esta página conserva intacta la versión previa del sitio de estado de ABRAXAS OS como punto de referencia histórico y respaldo permanente.' 
        : 'This page preserves the legacy status release of ABRAXAS OS intact as a permanent reference snapshot.'}
    </p>

    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
      <a href="../index.html" class="apple-btn-blue">${isEs ? '← Volver a la Nueva Experiencia' : '← Return to New Experience'}</a>
      <a href="../canon/index.html" class="apple-btn-secondary">${isEs ? '📚 Ir al Canon 37 TXT' : '📚 Open Canon 37 TXT'}</a>
    </div>
  </main>

  ${getAppleFooter(locale, 2)}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`[Apple Builder] Generated /${locale}/backup/index.html (Backup Snapshot Page)`);
}

// Master Execution
function executeAppleGeneration() {
  generateRootRedirector();

  ['es', 'en'].forEach(locale => {
    generateAppleOverviewPage(locale);
    generateAppleManagementPage(locale);
    generateAppleEcosystemPage(locale);
    generateAppleToolsPage(locale);
    generateAppleArchitecturePage(locale);
    generateAppleCanonPage(locale);
    generateAppleGuidePage(locale);
    generateBackupSnapshotPage(locale);
  });

  console.log('✨ [Apple Builder] Complete Apple MacBook Pro Suite generated successfully!');
}

executeAppleGeneration();
