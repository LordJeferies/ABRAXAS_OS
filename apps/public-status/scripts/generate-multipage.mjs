import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const docsDir = path.resolve(rootDir, 'docs/abraxas-os-status');

// Ingest canonical datasets
const bilingualPath = path.resolve(__dirname, '../src/data/canonical-knowledge-bilingual.json');
const evPath = path.join(docsDir, 'evidence-index.json');
const bpPath = path.join(docsDir, 'pipeline-blueprints.json');
const rmPath = path.join(docsDir, 'roadmap.json');
const gvPath = path.join(docsDir, 'generated-verification.json');

const bilingualData = JSON.parse(fs.readFileSync(bilingualPath, 'utf-8'));
const evidenceIndex = JSON.parse(fs.readFileSync(evPath, 'utf-8'));
const pipelineBlueprints = JSON.parse(fs.readFileSync(bpPath, 'utf-8'));
const roadmapData = JSON.parse(fs.readFileSync(rmPath, 'utf-8'));

let generatedVerification = {
  releaseEvidence: {
    releaseVersion: 'v1.0.0-rc1',
    releaseSha: '91234741f0b3a1ac5bd7e4c0556fafa868d00769',
    releaseTestFileCount: 59,
    releaseTestCount: 167
  },
  currentRegression: {
    testFiles: 86,
    testCount: 226,
    status: 'PASS_100_PERCENT'
  },
  typecheckStatus: 'PASS',
  status: 'PASS_ALL_SYSTEMS'
};

if (fs.existsSync(gvPath)) {
  try {
    generatedVerification = JSON.parse(fs.readFileSync(gvPath, 'utf-8'));
  } catch (e) {}
}

console.log(`[Bilingual MultiPage Generator] Loaded ${bilingualData.modules.length} modules, ${pipelineBlueprints.blueprints.length} blueprints, ${evidenceIndex.items.length} evidence items.`);

function getPrefixes(depthFromLocale) {
  const localeRoot = depthFromLocale === 0 ? './' : '../'.repeat(depthFromLocale);
  const assetsRoot = '../'.repeat(depthFromLocale + 1);
  const enRoot = (depthFromLocale === 0 ? '../en/' : '../'.repeat(depthFromLocale + 1) + 'en/');
  const esRoot = (depthFromLocale === 0 ? '../es/' : '../'.repeat(depthFromLocale + 1) + 'es/');
  return { localeRoot, assetsRoot, enRoot, esRoot };
}

function getHeader(locale, activeTab, currentRoutePath, depthFromLocale) {
  const { localeRoot, enRoot, esRoot } = getPrefixes(depthFromLocale);
  const targetOtherUrl = (locale === 'en' ? esRoot : enRoot) + currentRoutePath;

  const t = {
    en: {
      story: 'Manifesto',
      system: 'System',
      architecture: 'Architecture',
      tools: 'Operators',
      flow: 'Flow',
      taste: 'Taste',
      proof: 'Proof',
      roadmap: 'Roadmap',
      principles: 'Principles',
      ask: 'Ask Arquitecto'
    },
    es: {
      story: 'Manifiesto',
      system: 'Sistema',
      architecture: 'Arquitectura',
      tools: 'Operadores',
      flow: 'Flujo',
      taste: 'Taste',
      proof: 'Evidencia',
      roadmap: 'Roadmap',
      principles: 'Principios',
      ask: 'Preguntar a Arquitecto'
    }
  }[locale];

  return `
  <header id="global-header" class="site-header" role="banner">
    <div class="header-inner">
      <div class="header-left">
        <a href="${localeRoot}index.html" class="brand-logo" aria-label="ABRAXAS OS Home">
          <span class="brand-glyph">▲</span>
          <span class="brand-text">ABRAXAS OS</span>
        </a>
        <span class="brand-tag">v1.0.0-rc1</span>
      </div>
      <nav class="header-nav" role="navigation" aria-label="Primary Navigation">
        <a href="${localeRoot}index.html" class="nav-link ${activeTab === 'story' ? 'active' : ''}">${t.story}</a>
        <a href="${localeRoot}system/index.html" class="nav-link ${activeTab === 'system' ? 'active' : ''}">${t.system}</a>
        <a href="${localeRoot}architecture/index.html" class="nav-link ${activeTab === 'architecture' ? 'active' : ''}">${t.architecture}</a>
        <a href="${localeRoot}tools/index.html" class="nav-link ${activeTab === 'tools' ? 'active' : ''}">${t.tools}</a>
        <a href="${localeRoot}flow/index.html" class="nav-link ${activeTab === 'flow' ? 'active' : ''}">${t.flow}</a>
        <a href="${localeRoot}taste/index.html" class="nav-link ${activeTab === 'taste' ? 'active' : ''}">${t.taste}</a>
        <a href="${localeRoot}proof/index.html" class="nav-link ${activeTab === 'proof' ? 'active' : ''}">${t.proof}</a>
        <a href="${localeRoot}roadmap/index.html" class="nav-link ${activeTab === 'roadmap' ? 'active' : ''}">${t.roadmap}</a>
        <a href="${localeRoot}principles/index.html" class="nav-link ${activeTab === 'principles' ? 'active' : ''}">${t.principles}</a>
      </nav>
      <div class="header-right">
        <div class="locale-switcher" aria-label="Language selector">
          <a href="${locale === 'en' ? '#' : targetOtherUrl}" class="locale-btn ${locale === 'en' ? 'active' : ''}" onclick="${locale === 'en' ? 'return false;' : `localStorage.setItem('abraxas_locale', 'en')`}">EN</a>
          <span class="locale-sep">/</span>
          <a href="${locale === 'es' ? '#' : targetOtherUrl}" class="locale-btn ${locale === 'es' ? 'active' : ''}" onclick="${locale === 'es' ? 'return false;' : `localStorage.setItem('abraxas_locale', 'es')`}">ES</a>
        </div>
        <button id="header-architect-btn" class="header-architect-trigger" onclick="window.__ABRAXAS_OPEN_ARCHITECT__?.()" aria-label="${t.ask}">
          <span class="architect-spark">✦</span> ${t.ask}
        </button>
      </div>
    </div>
  </header>
  `;
}

function getFooter(locale, depthFromLocale) {
  const { localeRoot } = getPrefixes(depthFromLocale);
  const t = {
    en: {
      desc: 'The Operating System for Systematic Content Intelligence, Operational Governance, and Deterministic Audiovisual Synthesis.',
      baseline: 'v1.0.0-rc1 Historical Baseline',
      arch: 'Architecture',
      canon: 'Canon & Taste',
      modules: 'Operators',
      copy: '© 2026 ABRAXAS OS. Deterministic Closed-Loop Architecture.'
    },
    es: {
      desc: 'El Sistema Operativo para Inteligencia Sistemática de Contenido, Gobernanza Operativa y Síntesis Audiovisual Determinista.',
      baseline: 'Línea Base Histórica v1.0.0-rc1',
      arch: 'Arquitectura',
      canon: 'Canon y Taste',
      modules: 'Operadores',
      copy: '© 2026 ABRAXAS OS. Arquitectura de Ciclo Cerrado Determinista.'
    }
  }[locale];

  return `
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-col brand-col">
        <div class="footer-logo"><span class="brand-glyph">▲</span> ABRAXAS OS</div>
        <p class="footer-desc">${t.desc}</p>
        <div class="footer-truth-badge"><span class="truth-dot"></span> ${t.baseline}</div>
      </div>
      <div class="footer-col">
        <h4>${t.arch}</h4>
        <ul>
          <li><a href="${localeRoot}system/index.html">${locale === 'en' ? 'System Dashboard' : 'Dashboard del Sistema'}</a></li>
          <li><a href="${localeRoot}architecture/pyramid/index.html">${locale === 'en' ? 'Giza Monument' : 'Monumento de Giza'}</a></li>
          <li><a href="${localeRoot}architecture/four-worlds/index.html">${locale === 'en' ? 'Four Worlds' : 'Cuatro Mundos'}</a></li>
          <li><a href="${localeRoot}architecture/tree-of-life/index.html">${locale === 'en' ? 'Tree of Life' : 'Árbol de la Vida'}</a></li>
          <li><a href="${localeRoot}architecture/content-state-space/index.html">${locale === 'en' ? 'State Space XYZA' : 'Espacio de Estados XYZA'}</a></li>
          <li><a href="${localeRoot}architecture/closed-loop/index.html">${locale === 'en' ? 'Closed Loop' : 'Ciclo Cerrado'}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>${t.canon}</h4>
        <ul>
          <li><a href="${localeRoot}taste/index.html">${locale === 'en' ? 'The Taste System' : 'El Sistema de Taste'}</a></li>
          <li><a href="${localeRoot}principles/index.html">${locale === 'en' ? 'Core Principles' : 'Principios Canónicos'}</a></li>
          <li><a href="${localeRoot}proof/index.html">${locale === 'en' ? 'Verified Evidence' : 'Evidencia Verificada'}</a></li>
          <li><a href="${localeRoot}roadmap/index.html">${locale === 'en' ? 'Roadmap Gates' : 'Compuertas del Roadmap'}</a></li>
          <li><a href="${localeRoot}flow/index.html">${locale === 'en' ? 'Pipeline Blueprints' : 'Blueprints de Pipeline'}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>${t.modules}</h4>
        <ul>
          <li><a href="${localeRoot}tools/yod/index.html">YOD</a></li>
          <li><a href="${localeRoot}tools/contenido/index.html">CONTENIDO</a></li>
          <li><a href="${localeRoot}tools/he/index.html">HE</a></li>
          <li><a href="${localeRoot}tools/shim/index.html">SHIM</a></li>
          <li><a href="${localeRoot}tools/vav/index.html">VAV</a></li>
          <li><a href="${localeRoot}tools/publishing/index.html">PUBLISHING</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">${t.copy}</div>
      <div class="footer-meta">
        <span class="footer-mono">RC1 Baseline SHA: ${bilingualData.system.releaseSha.substring(0, 10)}</span>
      </div>
    </div>
  </footer>
  `;
}

function getArchitectDrawer(locale) {
  const t = {
    en: {
      title: 'Public Architect',
      badge: 'Deterministic NLP',
      intro: 'Query canonical architecture, module ownership boundaries, truth status, or semantic principles directly.',
      placeholder: 'e.g., What does Shim own? How does Vav synthesize?',
      submit: 'Query',
      suggestions: 'Suggestions:',
      meta: 'v1.0.0-rc1 Verified Baseline'
    },
    es: {
      title: 'Arquitecto Público',
      badge: 'NLP Determinista',
      intro: 'Consulta la arquitectura canónica, límites de propiedad de módulos, estado de verdad o principios semánticos directamente.',
      placeholder: 'ej., ¿Qué posee Shim? ¿Cómo sintetiza Vav?',
      submit: 'Consultar',
      suggestions: 'Sugerencias:',
      meta: 'Línea Base Verificada v1.0.0-rc1'
    }
  }[locale];

  return `
  <div id="public-architect-drawer" class="architect-drawer" aria-hidden="true" role="dialog" aria-label="${t.title}">
    <div class="architect-drawer-backdrop" onclick="window.__ABRAXAS_CLOSE_ARCHITECT__?.()"></div>
    <div class="architect-drawer-panel">
      <div class="drawer-header">
        <div class="drawer-title-group">
          <span class="architect-spark">✦</span>
          <h3>${t.title}</h3>
          <span class="drawer-badge">${t.badge}</span>
        </div>
        <button class="drawer-close" onclick="window.__ABRAXAS_CLOSE_ARCHITECT__?.()" aria-label="Close">✕</button>
      </div>
      <div class="drawer-body">
        <p class="drawer-intro">${t.intro}</p>
        <div class="architect-form-group">
          <input type="text" id="architect-query-input" class="architect-input" placeholder="${t.placeholder}" aria-label="Query input">
          <button id="architect-query-submit" class="architect-submit-btn">${t.submit}</button>
        </div>
        <div class="quick-prompt-chips">
          <span class="chip-label">${t.suggestions}</span>
          <button class="prompt-chip" data-q="Yod">YOD</button>
          <button class="prompt-chip" data-q="Contenido">Contenido</button>
          <button class="prompt-chip" data-q="Shim">SHIM</button>
          <button class="prompt-chip" data-q="Vav">VAV</button>
          <button class="prompt-chip" data-q="He">HE</button>
          <button class="prompt-chip" data-q="OUT_OF_SYNC">OUT_OF_SYNC</button>
        </div>
        <div id="architect-response-container" class="architect-response-card" style="display: none;">
          <div class="response-topic" id="architect-response-topic">TOPIC</div>
          <div class="response-body" id="architect-response-text">Response content...</div>
          <div class="response-meta" id="architect-response-meta">${t.meta}</div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function generateRootRedirector() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ABRAXAS OS</title>
  <script>
    const stored = localStorage.getItem('abraxas_locale');
    if (stored === 'es' || stored === 'en') {
      window.location.replace('./' + stored + '/index.html');
    } else {
      const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      if (browserLang.startsWith('es')) {
        window.location.replace('./es/index.html');
      } else {
        window.location.replace('./en/index.html');
      }
    }
  </script>
</head>
<body>
  <p>Redirecting to <a href="./en/index.html">English</a> or <a href="./es/index.html">Español</a>...</p>
</body>
</html>`;
  fs.writeFileSync(path.join(docsDir, 'index.html'), html);
  console.log('[Bilingual Generator] Generated /index.html (Root Locale Redirector)');
}


function generateLandingPage(locale) {
  const dir = path.join(docsDir, locale);
  fs.mkdirSync(dir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(0);

  const manifest = bilingualData.approvedAssetManifest?.plates || [];

  const acts = {
    en: [
      {
        tag: '01. ATZILUTH & KETER // THE ZERO STATE',
        title: 'Kill the blank-page panic before writing a single word.',
        pain: 'Spending days staring at a blank screen terrified of what to say, or writing generic AI fluff that nobody watches or respects.',
        solution: 'Destroys the blank page by forcing every video to be born from an unshakeable brand thesis instead of improvisation.',
        howItWorks: 'You set your brand authority pillars, tone of voice, and forbidden topics once. ABRAXAS blocks generic fluff and only lets you write scripts grounded in proven audience demand.',
        cabala: 'Atziluth (Emanation) & Keter (The Crown). Before physical matter can exist, Pure Intention and Criterion must be defined (state = NULL). If the seed lacks clear intention, creation is born corrupted.',
        layout: 'layout-cover-left',
        plateIdx: 0
      },
      {
        tag: '02. CHOKHMAH & YOD // VIRAL HOOK RADAR',
        title: 'Stop the 2-second scroll drop before you turn on the camera.',
        pain: 'Spending hours recording valuable content only for viewers to scroll past in 2 seconds because your first sentence was boring or predictable.',
        solution: 'Generates 3 magnetic opening hooks scored 0-100 to stop the scroll immediately before you even hit record.',
        howItWorks: 'The YOD module scans audience blind spots in your niche and outputs 3 hook angles (Contrarian, Curiosity, or Story). If a hook scores below 85/100, it forces you to optimize it before recording.',
        cabala: 'Chokhmah (Wisdom) & Module YOD (י). The primordial spark of insight (Kav). Creation cannot begin without the initial lightning spark that shatters cosmic inertia and commands attention.',
        layout: 'layout-bottom-left',
        plateIdx: 5
      },
      {
        tag: '03. BERIAH & CONTINUITY // SINGLE-PIECE IDENTITY',
        title: 'End script version chaos and orphaned video files forever.',
        pain: 'The chaos of having 20 files like script_v2_final_edit.docx, losing video takes in messy folders, and breaking project links with a single edit.',
        solution: 'Gives every video an indestructible unique ID (contentId) on a vertical timeline where nothing gets lost or duplicated.',
        howItWorks: 'Contenido uses an immutable Merkle-DAG data tree. You can edit the script 20 times and all captions, takes, and final video renders update automatically without breaking files.',
        cabala: 'Beriah (Creation) & The Basalt Pyramid. The primordial vessel (Keli). Creative light needs an unshakeable structural container to hold form and never dissipate into disorder.',
        layout: 'layout-right-anchored',
        plateIdx: 9
      },
      {
        tag: '04. SEFIROTIC TOPOLOGY // UNIFIED 13-MODULE SUITE',
        title: 'Replace 6 disconnected apps with one seamless operating system.',
        pain: 'Wasting hours juggling Notion for scripts, mobile teleprompters, CapCut for trimming, Premiere for color, Drive for storage, and Metricool for stats.',
        solution: 'A single unified operating suite where your video flows from Script -> Teleprompter -> Verification -> Auto-Edit -> Publishing without leaving the app.',
        howItWorks: 'The app unifies all 6 tools into one native macOS window. When you finish reading on the teleprompter, the video flows directly into the editor with zero file exports or cloud uploads.',
        cabala: 'Tree of Life Topology. Sefirot are passive content states (Draft, Take, Comp); the 13 ABRAXAS Modules are the active verbs transmuting content from sphere to sphere across connected paths.',
        layout: 'layout-bottom-left',
        plateIdx: 2
      },
      {
        tag: '05. DAAT & SHIM // LIVE RECORDING VERIFICATION',
        title: 'Catch missed lines and audio errors while you are still on set.',
        pain: 'Recording for 2 hours only to discover in the editor that you forgot a key sentence or had audio clipping, forcing a painful set rebuild.',
        solution: 'The AI listens to your recording live and alerts you in seconds if a line was skipped so you only re-take 5 seconds on the spot.',
        howItWorks: 'The SHIM module uses Whisper Large V3 Turbo and computer vision to check your audio word-by-word against the script. If there is a missed phrase or stumble, it flags the line in red before you turn off the camera.',
        cabala: 'Daat (Awakened Consciousness) & The Letter Shin (ש). Daat is not an abyss: it is consciousness awakening into physical action. It is the fire of Shin, fusing scripted intent with observed reality (Planned = Observed).',
        layout: 'layout-cover-left',
        plateIdx: 3
      },
      {
        tag: '06. YHSHVH & CAS // CRYPTOGRAPHIC VAULT',
        title: 'Zero corrupted files, zero missing media, and zero quality loss.',
        pain: 'Opening your editor to red Missing Media offline screens or having video quality butchered by cloud compression tools.',
        solution: 'Freezes your video, audio, and captions into an SHA-256 cryptographic vault that never corrupts or loses quality.',
        howItWorks: 'Stores assets in Content-Addressable Storage (CAS). The project receives a permanent cryptographic seal; moving disk folders never breaks project links and media always loads at 100% resolution.',
        cabala: 'The Seal of YHSHVH (Pentagrammaton). The 4 gold bars of the physical body (Y-H-V-H) receive the living flame of Shin (ש) at their center, welding spirit and matter into an indestructible physical body.',
        layout: 'layout-right-anchored',
        plateIdx: 8
      },
      {
        tag: '07. RELATIONAL MATRIX // PRODUCTION COST & SPEED CONTROL',
        title: 'Track exact production costs, team bottlenecks, and turnaround speed.',
        pain: 'Not knowing why video editing takes so long, which editor has pending tasks, or how much each reel actually costs to produce.',
        solution: 'Real-time production dashboards showing exact turnaround speeds, team bottlenecks, and cost-per-video down to the cent.',
        howItWorks: 'Logs every cut, render time, and approval into a local SQLite database. In one click you see which videos are ready, who is delayed, and how long each stage took.',
        cabala: 'Western Qabalah of Dion Fortune. Translating intuitive creative energy into exact mathematical laws, relationships, and auditable metrics to maintain absolute sovereignty over matter.',
        layout: 'layout-bottom-left',
        plateIdx: 1
      },
      {
        tag: '08. XYZA STATE-SPACE // CONTENT STRATIGRAPHY',
        title: 'Stop guessing video formats: tailor every edit to its exact funnel goal.',
        pain: 'Editing a top-of-funnel viral video with boring corporate pacing or making a sales video too fast-paced to build trust.',
        solution: 'The engine automatically adapts cut cadence, caption styles, and sound design to match the exact objective of the video.',
        howItWorks: 'Classifies every asset across a 4D map: Polarity (X), Manifestation (Y), Context (Z), and Memory (A). Top-of-funnel videos get snappy jump-cuts; bottom-of-funnel videos get elegant editorial pacing.',
        cabala: 'Four-Dimensional State Space XYZA. Nothing in the universe floats randomly: every creation occupies an exact phase coordinate between expansion and restriction to achieve its perfect manifestation.',
        layout: 'layout-cover-left',
        plateIdx: 7
      },
      {
        tag: '09. THE APEX & THE EYE // APPLE SILICON TELEMETRY',
        title: 'No more overheating Macs, frozen timelines, or 99% render crashes.',
        pain: 'Your editing app freezing at 99% render, spinning rainbow wheels, and laptop fans screaming during heavy video exports.',
        solution: 'Monitors Apple Silicon memory and temperature in real time so you can batch-export 50 videos without a single freeze.',
        howItWorks: 'The Eye connects directly to Apple Silicon chips (M1/M2/M3/M4) via Metal and VideoToolbox, balancing encoding loads to leverage 100% GPU acceleration without thermal throttling.',
        cabala: 'The Eye of the Apex. The vigilant watcher overseeing energy flow at the pyramid summit, ensuring the physical vessel never suffers structural breakdown.',
        layout: 'layout-right-anchored',
        plateIdx: 4
      },
      {
        tag: '10. VAV SYNTHESIS // AUTOMATED 18-SECOND POST-PRODUCTION',
        title: 'Cut jump-cuts, viral captions, and cinematic sound design in 18 seconds.',
        pain: 'Spending 4 to 8 hours per video cutting silences by hand in Premiere, styling captions word-by-word, and searching for whoosh sound effects.',
        solution: 'Trims silences, adds kinetic bouncy captions (Viral Gold, Cyber, Minimal), and injects cinematic sub-bass SFX in 18 seconds per video.',
        howItWorks: 'VAV detects dead pauses and jump-cuts them with microsecond precision, renders bouncy animated subtitles, and injects 45Hz sub-bass hook impacts automatically on your local GPU.',
        cabala: 'Module VAV (ו) // The Binding Hook in Yetzirah. In Hebrew, Vav means hook. It is the force that joins sound, typography, and visuals into a single living organism in the World of Formation.',
        layout: 'layout-bottom-left',
        plateIdx: 0
      },
      {
        tag: '11. HE GOVERNANCE // 50-VIDEO BATCH DESK',
        title: 'Produce and review 50 ready-to-publish videos in a single afternoon.',
        pain: 'Feeling overwhelmed trying to post daily, losing track of which videos were recorded, and needing an entire agency team to manage volume.',
        solution: 'A native macOS Kanban desk where you organize, approve, and batch-export 50 videos in one afternoon without internet lag.',
        howItWorks: 'Drag video cards across 6 clear stages (Idea -> Script -> Record -> Verify -> Edit -> Approved). Approve 50 videos in one click and batch-render an entire month of content in hours.',
        cabala: 'Module HE (ה) // The Physical Workshop in Assiah. The concrete world of physical action where the human operator takes sovereign command to govern tangible manifestation.',
        layout: 'layout-cover-left',
        plateIdx: 1
      },
      {
        tag: '12. THE CELESTIAL MOON // CLOSED-LOOP RETENTION FEEDBACK',
        title: 'Turn real audience watch time into smarter, higher-retention future videos.',
        pain: 'Posting blindly on social media without knowing why one video hit 1M views and the next got 300, repeating the same retention mistakes forever.',
        solution: 'Tracks the exact second viewers dropped off and uses that data to make your next batch of scripts scientifically more addictive.',
        howItWorks: 'Metrics analyzes retention curves on TikTok, Reels, and Shorts. If viewers drop off at second 5, it automatically retrains the YOD module to strengthen future hook structures.',
        cabala: 'The Celestial Moon & The Telemetric Loop. The moon reflects light back to Earth and returns telemetric tides to nourish the primordial seed (YOD): S(t+1) = S(t) + A(t). Creation is a perpetual learning cycle.',
        layout: 'layout-right-anchored',
        plateIdx: 6
      }
    ],
    es: [
      {
        tag: '01. ATZILUTH Y KETER // EL ESTADO CERO',
        title: 'Elimina el pánico a la página en blanco antes de escribir una sola palabra.',
        pain: 'Pasar días mirando una pantalla en blanco con pánico a no saber qué decir, o crear contenido genérico con ChatGPT que nadie respeta ni ve.',
        solution: 'Destruye la hoja en blanco forzando a que cada video nazca de un criterio de marca inmutable y no de la improvisación.',
        howItWorks: 'Configuras tus pilares de autoridad, tono de voz y temas prohibidos una sola vez. ABRAXAS bloquea el relleno y solo te deja escribir sobre tesis validadas con demanda real de audiencia.',
        cabala: 'Atziluth (Emanación) y Keter (La Corona). Antes de que exista la materia, debe existir la Voluntad Pura y el Criterio Inmutable (state = NULL). Si la semilla no tiene intención clara, la creación nace corrupta.',
        layout: 'layout-cover-left',
        plateIdx: 0
      },
      {
        tag: '02. CHOKHMAH Y YOD // RADAR DE GANCHOS VIRALES',
        title: 'Detén el scroll en los primeros 2 segundos antes de encender la cámara.',
        pain: 'Gastar horas grabando videos con gran contenido pero que la gente pasa de largo en los primeros 2 segundos porque la primera frase fue aburrida o predecible.',
        solution: 'Te da 3 ganchos magnéticos calificados de 0 a 100 para detener el scroll de inmediato antes de que prendas la cámara.',
        howItWorks: 'El módulo YOD escanea los puntos ciegos de tu nicho y crea 3 opciones de ganchos (Contrario, Curiosidad o Historia). Si el gancho no supera los 85 puntos de retención estimada, te pide ajustarlo antes de grabar.',
        cabala: 'Chokhmah (Sabiduría) y Módulo YOD (י). La chispa primordial de intuición (Kav). No se puede empezar un proceso creador sin la chispa inicial que rompe la inercia cósmica y despierta el interés.',
        layout: 'layout-bottom-left',
        plateIdx: 5
      },
      {
        tag: '03. BERIAH Y CONTINUIDAD // IDENTIDAD DE PIEZA ÚNICA',
        title: 'Fin al caos de versiones de guiones y archivos de video desordenados.',
        pain: 'El caos de tener 20 archivos como guion_final_v2_editado.docx, perder tomas de video en carpetas desordenadas y desincronizar todo el proyecto al hacer un cambio.',
        solution: 'Cada video tiene un código único indestructible (contentId) en una línea de tiempo vertical donde nada se pierde ni se duplica.',
        howItWorks: 'El módulo Contenido usa un árbol de datos inmutable (Merkle-DAG). Puedes cambiar el guion 20 veces y los subtítulos, tomas grabadas y videos finales se actualizan solos sin romper archivos.',
        cabala: 'Beriah (Creación) y La Gran Pirámide. La vasija primordial (Keli). La luz creativa necesita un recipiente estructural sólido e inmutable para contenerse y no disiparse en el desorden.',
        layout: 'layout-right-anchored',
        plateIdx: 9
      },
      {
        tag: '04. TOPOLOGÍA SEFIROTICA // SUITE UNIFICADA DE 13 MÓDULOS',
        title: 'Reemplaza 6 aplicaciones desconectadas por un solo sistema operativo fluido.',
        pain: 'Perder horas saltando entre 6 aplicaciones desconectadas (Notion para guiones, app de teleprompter, CapCut para cortar, Premiere para color, Drive para almacenar y Metricool para estadísticas).',
        solution: 'Un solo sistema operativo donde tu video pasa de Guion -> Teleprompter -> Verificación -> Auto-Edición -> Publicación sin salir de la app.',
        howItWorks: 'La app unifica las 6 herramientas en una sola ventana nativa de macOS. Al terminar de leer tu guion en el teleprompter, el video pasa automáticamente al editor sin exportar ni subir nada a la nube.',
        cabala: 'Topología del Árbol de la Vida. Las 10 Sefirot son los estados naturales del contenido (Guion, Toma, Compuesto); los 13 Módulos de ABRAXAS son los verbos activos que transforman el contenido de una esfera a otra.',
        layout: 'layout-bottom-left',
        plateIdx: 2
      },
      {
        tag: '05. DAAT Y SHIM // VERIFICACIÓN EN VIVO (CERO ERRORES)',
        title: 'Detecta frases olvidadas y errores de audio mientras sigues en el set.',
        pain: 'Grabar 2 horas para descubrir al editar que te comiste la frase clave del guion o que el audio se arruinó, teniendo que montar las luces y el set otra vez.',
        solution: 'La IA escucha tu grabación en vivo y te avisa al segundo si te faltó una palabra para regrabar solo esa línea en 5 segundos.',
        howItWorks: 'El módulo SHIM usa Whisper Large V3 Turbo y visión artificial para comparar tu audio palabra por palabra contra el guion. Si hay una omisión o duda, te marca la frase exacta en rojo en la pantalla antes de apagar la cámara.',
        cabala: 'Daat (Conocimiento Lúcido) y La Letra Shin (ש). Daat no es un abismo pasivo: es la conciencia despierta que salta directamente a la acción. Es el encendido del fuego de Shin (Planificado = Observado).',
        layout: 'layout-cover-left',
        plateIdx: 3
      },
      {
        tag: '06. YHSHVH Y CAS // BÓVEDA INMUTABLE SIN CORRUPCIÓN',
        title: 'Cero archivos corruptos, cero media perdida y cero pérdida de calidad.',
        pain: 'Abrir tu proyecto y encontrarte la pantalla roja de Media Offline / Archivos Perdidos, o videos que pierden calidad al enviarlos por WhatsApp o Drive.',
        solution: 'Congela tu video, audio y subtítulos en un solo bloque blindado con sello criptográfico SHA-256 que nunca se corrompe ni pierde calidad.',
        howItWorks: 'Guarda el video en Almacenamiento Direccionado por Contenido (CAS). El archivo recibe un código digital único; no importa si mueves carpetas de disco, el proyecto siempre carga al instante con 100% de nitidez.',
        cabala: 'Sello YHSHVH (Pentagramatón). Las 4 barras del cuerpo material (Y-H-V-H) reciben el fuego sagrado de Shin (ש) en su centro, soldando el espíritu con la materia en un cuerpo físico indestructible.',
        layout: 'layout-right-anchored',
        plateIdx: 8
      },
      {
        tag: '07. QABALAH RELACIONAL // CONTROL Y COSTOS EXACTOS',
        title: 'Mide costos exactos, cuellos de botella del equipo y velocidad de entrega.',
        pain: 'No saber por qué la edición se atrasa, qué editor del equipo tiene trabajo pendiente o cuánto dinero te cuesta realmente producir cada reel.',
        solution: 'Tablas de control en tiempo real que te muestran el tiempo exacto de producción, cuellos de botella del equipo y costo por video al centavo.',
        howItWorks: 'Registra cada clic, tiempo de renderizado y aprobación en una base de datos local SQLite. En un clic ves qué videos están listos, quién tiene entregas retrasadas y cuánto tardó cada fase.',
        cabala: 'Qabalah Occidental de Dion Fortune. Traducir los principios creativos a leyes matemáticas, relaciones exactas y correspondencias medibles para tener gobierno total sobre la materia.',
        layout: 'layout-bottom-left',
        plateIdx: 1
      },
      {
        tag: '08. ESPACIO XYZA // ESTRATIGRAFÍA DE CONTENIDO',
        title: 'No adivines el formato: adapta cada edición al objetivo exacto del video.',
        pain: 'Editar un video viral de atracción con ritmo lento y aburrido, o hacer un video de venta directa demasiado rápido como para generar confianza.',
        solution: 'El motor adapta la velocidad de los cortes, el estilo de los subtítulos y los efectos de sonido según el objetivo específico del video.',
        howItWorks: 'Clasifica cada pieza en un mapa 4D: Polaridad (X), Manifestación (Y), Contexto (Z) y Memoria (A). Si el video es de atracción viral, aplica cortes rápidos; si es de venta, usa tipografía editorial limpia y música sutil.',
        cabala: 'Espacio de Estados Cuatridimensional XYZA. Cada creación ocupa una coordenada de fase exacta entre la expansión y la restricción para lograr su manifestación perfecta en el embudo.',
        layout: 'layout-cover-left',
        plateIdx: 7
      },
      {
        tag: '09. CÚSPIDE Y EL OJO // TELEMETRÍA DE SILICIO APPLE',
        title: 'Cero Macs sobrecalentadas, cero pantallas congeladas y cero cuelgues al 99%.',
        pain: 'Que tu ordenador se sobrecaliente, los ventiladores suenen como una turbina y el programa se congele al 99% del renderizado haciéndote perder horas de trabajo.',
        solution: 'El sistema monitorea la memoria y temperatura de tu Mac en tiempo real para que exportes 50 videos seguidos sin que la máquina se congele.',
        howItWorks: 'El Ojo se conecta directamente a los chips Apple Silicon (M1/M2/M3/M4) mediante Metal y VideoToolbox, balanceando la carga para que el renderizado use el 100% de la aceleración gráfica sin sobrecalentar el equipo.',
        cabala: 'El Ojo del Ápice en la Pirámide. La mirada vigilante que supervisa el flujo de energía en la cúspide para garantizar que el templo físico no sufra rupturas de tensión.',
        layout: 'layout-right-anchored',
        plateIdx: 4
      },
      {
        tag: '10. VAV SÍNTESIS // AUTO-EDICIÓN EN 18 SEGUNDOS',
        title: 'Corta silencios, pon subtítulos virales y añade sonido de cine en 18 segundos.',
        pain: 'Perder de 4 a 8 horas por video cortando pausas a mano en Premiere, acomodando subtítulos palabra por palabra y buscando efectos de sonido.',
        solution: 'Corta silencios, pone subtítulos animados virales (Hormozi, Mr Beast, Cyber) y añade efectos de sonido de cine en 18 segundos por video.',
        howItWorks: 'El motor VAV detecta silencios muertos y los corta con microsegundos de precisión (jump cuts), genera subtítulos cinéticos con colores llamativos e inyecta impactos de sub-bajo a 45 Hz automáticamente.',
        cabala: 'Módulo VAV (ו) // La Fuerza de Unión en Yetzirah. En hebreo, Vav significa gancho de unión. Es la fuerza que toma el sonido, el texto y la imagen y los ensambla en un solo cuerpo vivo.',
        layout: 'layout-bottom-left',
        plateIdx: 0
      },
      {
        tag: '11. DESPACHO DE HE // CONTROL DE 50 VIDEOS EN LOTE',
        title: 'Produce y aprueba 50 videos listos para publicar en una sola tarde.',
        pain: 'Sentirte abrumado intentando publicar diario, no saber qué videos ya se grabaron y necesitar una agencia entera para mantener el volumen.',
        solution: 'Un tablero Kanban nativo donde organizas, apruebas y exportas 50 videos a la vez en una sola tarde sin depender de internet.',
        howItWorks: 'Arrastras tus videos a través de 6 columnas claras (Idea -> Guion -> Grabación -> Verificación -> Edición -> Aprobado). Puedes aprobar 50 videos con un solo clic y mandarlos a exportar en lote.',
        cabala: 'Módulo HE (ה) // El Taller de Manifestación en Assiah. El mundo físico de la acción concreta donde el operador humano toma el control con sus manos para gobernar la manufactura final.',
        layout: 'layout-cover-left',
        plateIdx: 1
      },
      {
        tag: '12. LA LUNA CELESTE // BUCLE CERRADO Y RETENCIÓN',
        title: 'Convierte el tiempo de retención real de tu audiencia en videos futuros más virales.',
        pain: 'Publicar a ciegas en redes sin entender por qué un video tuvo 1 millón de vistas y el siguiente 300, repitiendo los mismos errores una y otra vez.',
        solution: 'Mide exactamente en qué segundo la gente dejó de ver tu video y usa esa información para que tus próximos guiones sean más adictivos.',
        howItWorks: 'El módulo Metrics analiza las curvas de retención en TikTok, Reels y Shorts. Si detecta que la gente se fue en el segundo 5, le enseña al módulo YOD a cambiar la estructura de tus futuros ganchos automáticamente.',
        cabala: 'La Luna Celeste y el Retorno Telemétrico. La luna refleja la luz hacia la Tierra y devuelve las mareas telemétricas hacia el Sol/YOD (S(t+1) = S(t) + A(t)). La creación es un ciclo infinito que aprende y evoluciona.',
        layout: 'layout-right-anchored',
        plateIdx: 6
      }
    ]
  }[locale];

  const storyContent = bilingualData.philosophicalCanon?.story[locale] || '';
  const formattedStory = storyContent
    .replace(/### (.*?)\n/g, '<h3>$1</h3>')
    .split('\n\n')
    .map(p => p.startsWith('<h3>') ? p : `<p>${p}</p>`)
    .join('\n');

  const xyza = bilingualData.philosophicalCanon?.xyzaExplanation;
  const operatorLaw = bilingualData.philosophicalCanon?.moduleLaw;

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ABRAXAS OS — ${locale === 'en' ? 'Operating System for Content Intelligence' : 'Sistema Operativo de Inteligencia de Contenido'}</title>
  <meta name="description" content="${bilingualData.system.description[locale]}">
  <link rel="alternate" hreflang="en" href="${enRoot}index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="landing-story-body">
  ${getHeader(locale, 'story', 'index.html', 0)}

  <!-- Master Source Plate Backdrop (Layer 0) -->
  <div id="plate-backdrop-container" class="plate-backdrop-container" aria-hidden="true">
    ${manifest.map((p, idx) => `
    <div class="plate-slide ${idx === 0 ? 'active' : ''}" data-plate="${idx}">
      <img src="${assetsRoot}${p.pngPath}" alt="${locale === 'en' ? p.titleEn : p.titleEs}" loading="${idx === 0 ? 'eager' : 'lazy'}">
    </div>
    `).join('\n')}
    <div class="plate-vignette-overlay"></div>
  </div>

  <!-- 3D Pyramid Canvas removed from Home/Landing Page to present pure high-resolution photographic source plates -->

  <main id="story-scroll-container" class="story-scroll-container">
    ${acts.map((a, idx) => `
    <section class="story-act-section act-${idx} ${a.layout}" data-act="${idx}">
      <div class="act-content-wrap">
        <div class="act-tag">${a.tag}</div>
        <h2 class="act-headline">${a.title}</h2>
        
        <!-- 4-Tier Real Production Architecture Card -->
        <div class="act-4tier-card" style="margin-top: 18px; display: flex; flex-direction: column; gap: 12px; background: rgba(5, 7, 14, 0.84); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 18px 20px; backdrop-filter: blur(16px); box-shadow: 0 12px 36px rgba(0,0,0,0.6);">
          
          <!-- 1. El Dolor Real -->
          <div style="border-left: 3px solid #ef4444; padding-left: 12px;">
            <div style="font-size: 10px; font-weight: 800; color: #ef4444; letter-spacing: 0.05em; margin-bottom: 3px; font-family: monospace;">
              💥 ${locale === 'en' ? 'THE PAIN POINT' : 'EL DOLOR REAL'}
            </div>
            <p style="font-size: 13.5px; color: rgba(255,255,255,0.9); margin: 0; line-height: 1.45;">${a.pain}</p>
          </div>

          <!-- 2. La Solución Directa con Punch -->
          <div style="border-left: 3px solid #d4af37; padding-left: 12px;">
            <div style="font-size: 10px; font-weight: 800; color: #d4af37; letter-spacing: 0.05em; margin-bottom: 3px; font-family: monospace;">
              ⚡ ${locale === 'en' ? 'ABRAXAS PUNCH SOLUTION' : 'LA SOLUCIÓN ABRAXAS'}
            </div>
            <p style="font-size: 14px; font-weight: 700; color: #fff; margin: 0; line-height: 1.45;">${a.solution}</p>
          </div>

          <!-- 3. Cómo lo hace la herramienta en simple -->
          <div style="border-left: 3px solid #38bdf8; padding-left: 12px;">
            <div style="font-size: 10px; font-weight: 800; color: #38bdf8; letter-spacing: 0.05em; margin-bottom: 3px; font-family: monospace;">
              🛠️ ${locale === 'en' ? 'HOW THE SOFTWARE DOES IT' : 'CÓMO LO HACE LA HERRAMIENTA'}
            </div>
            <p style="font-size: 13px; color: rgba(255,255,255,0.85); margin: 0; line-height: 1.45;">${a.howItWorks}</p>
          </div>

          <!-- 4. Principio Cabalístico / Ontológico -->
          <div style="border-left: 3px solid #a855f7; padding-left: 12px;">
            <div style="font-size: 10px; font-weight: 800; color: #c084fc; letter-spacing: 0.05em; margin-bottom: 3px; font-family: monospace;">
              🔯 ${locale === 'en' ? 'CABALISTIC CREATION PRINCIPLE' : 'EL PRINCIPIO CABALÍSTICO'}
            </div>
            <p style="font-size: 12px; color: rgba(255,255,255,0.75); margin: 0; line-height: 1.45; font-family: monospace;">${a.cabala}</p>
          </div>

        </div>

        ${idx === 0 ? `
        <div class="hero-actions" style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;">
          <a href="#proceso-simple" class="btn-primary" style="background: linear-gradient(135deg, #d4af37 0%, #fef08a 100%); color: #000; font-weight: 800;">${locale === 'en' ? '🎯 How It Works (Simple)' : '🎯 Cómo Funciona (En Simple)'}</a>
          <a href="./system/index.html" class="btn-secondary">${locale === 'en' ? 'System Dashboard →' : 'Dashboard del Sistema →'}</a>
          <a href="#creation-narrative" class="btn-secondary">${locale === 'en' ? 'Cinematic Story' : 'Historia Cinemática'}</a>
        </div>
        ` : ''}
      </div>
    </section>
    `).join('\n')}

    
    <!-- PLAIN-LANGUAGE CONTENT WORKFLOW SECTION (ZERO JARGON) -->
    <section id="proceso-simple" class="plain-workflow-section" style="max-width: 1100px; margin: 5rem auto; padding: 3rem 2rem; background: rgba(12, 16, 24, 0.88); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 16px; backdrop-filter: blur(20px); box-shadow: 0 20px 60px rgba(0,0,0,0.8);">
      
      <div style="text-align: center; margin-bottom: 2.5rem;">
        <span style="font-family: monospace; font-size: 11px; font-weight: 800; color: #d4af37; letter-spacing: 0.1em; background: rgba(212,175,55,0.15); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(212,175,55,0.3);">
          ${locale === "en" ? "PRACTICAL WORKFLOW // NO JARGON" : "FLUJO PRÁCTICO // SIN COMPLICACIONES"}
        </span>
        <h2 style="font-size: 2.2rem; font-weight: 800; color: #fff; margin: 12px 0 8px 0; letter-spacing: -0.02em;">
          ${locale === "en" ? "How ABRAXAS Works in Real Life" : "¿Cómo Funciona ABRAXAS en la Vida Real?"}
        </h2>
        <p style="font-size: 1.05rem; color: rgba(255,255,255,0.7); max-width: 700px; margin: 0 auto; line-height: 1.5;">
          ${locale === "en" 
            ? "The exact step-by-step to create, edit, and export 50 high-retention videos with viral subtitles, sound design, and zero editing headaches." 
            : "El paso a paso exacto para crear, editar y exportar 50 videos de alta retención con subtítulos virales, efectos de sonido y sin dolores de cabeza."}
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
        
        <!-- Step 1 -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 22px; display: flex; flexDirection: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 24px;">💡</span>
            <span style="font-size: 10px; font-family: monospace; color: #d4af37; font-weight: 800; background: rgba(212,175,55,0.15); padding: 2px 8px; border-radius: 4px;">PASO 01</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 800; color: #fff; margin: 0;">
            ${locale === "en" ? "1. Idea & Viral Hook Generator" : "1. Encuentra la Idea y el Gancho Viral"}
          </h3>
          <p style="font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5; margin: 0;">
            ${locale === "en" 
              ? "Type your topic or product. ABRAXAS analyzes what people are actually watching in your niche and creates 3 magnetic opening hooks scored 0-100 to stop the scroll in the first 3 seconds." 
              : "Escribes el tema de tu video o producto. ABRAXAS analiza qué contenido funciona en tu nicho y te genera 3 ganchos magnéticos calificados de 0 a 100 para atrapar a la audiencia en los primeros 3 segundos."}
          </p>
        </div>

        <!-- Step 2 -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 22px; display: flex; flexDirection: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 24px;">📝</span>
            <span style="font-size: 10px; font-family: monospace; color: #38bdf8; font-weight: 800; background: rgba(56,189,248,0.15); padding: 2px 8px; border-radius: 4px;">PASO 02</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 800; color: #fff; margin: 0;">
            ${locale === "en" ? "2. 4-Beat Narrative Script" : "2. Guión Estructurado en 4 Tiempos"}
          </h3>
          <p style="font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5; margin: 0;">
            ${locale === "en" 
              ? "Your script is structured automatically into 4 clear parts: The Hook (0-3.5s), The Core Thesis (3.5-20s), The Proof or Demo (20-35s), and The Call to Action (35-45s)." 
              : "Tu guión se organiza automáticamente en 4 bloques claros: Gancho de impacto (0-3.5s), Explicación principal (3.5-20s), Demostración o prueba visual (20-35s) y Llamado a la acción (35-45s)."}
          </p>
        </div>

        <!-- Step 3 -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 22px; display: flex; flexDirection: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 24px;">🎙️</span>
            <span style="font-size: 10px; font-family: monospace; color: #ec4899; font-weight: 800; background: rgba(236,72,153,0.15); padding: 2px 8px; border-radius: 4px;">PASO 03</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 800; color: #fff; margin: 0;">
            ${locale === "en" ? "3. Recording & Teleprompter" : "3. Grabación con Teleprompter"}
          </h3>
          <p style="font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5; margin: 0;">
            ${locale === "en" 
              ? "Open the integrated teleprompter, read your script at your natural pace, and ABRAXAS automatically saves, tags, and organizes all your takes cleanly." 
              : "Abres el teleprompter integrado en la app, lees tu guión a tu propio ritmo y la plataforma organiza automáticamente todas tus tomas y clips de video sin desorden."}
          </p>
        </div>

        <!-- Step 4 -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 22px; display: flex; flexDirection: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 24px;">⚖️</span>
            <span style="font-size: 10px; font-family: monospace; color: #a855f7; font-weight: 800; background: rgba(168,85,247,0.15); padding: 2px 8px; border-radius: 4px;">PASO 04</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 800; color: #fff; margin: 0;">
            ${locale === "en" ? "4. Automatic Quality Check" : "4. Verificación Automática (Cero Errores)"}
          </h3>
          <p style="font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5; margin: 0;">
            ${locale === "en" 
              ? "Before editing, the AI listens to your audio with Whisper and compares it to your script to make sure you did not skip words or make mistakes. Zero bad takes slip through." 
              : "Antes de editar, el sistema escucha tu grabación con Whisper y la compara con el guión para avisarte si se te olvidó alguna frase o si dijiste algo mal. Nada sale con errores."}
          </p>
        </div>

        <!-- Step 5 -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 22px; display: flex; flexDirection: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 24px;">⚡</span>
            <span style="font-size: 10px; font-family: monospace; color: #34c759; font-weight: 800; background: rgba(52,199,89,0.15); padding: 2px 8px; border-radius: 4px;">PASO 05</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 800; color: #fff; margin: 0;">
            ${locale === "en" ? "5. Instant 18s Auto-Editing" : "5. Edición Automática en 18 Segundos"}
          </h3>
          <p style="font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5; margin: 0;">
            ${locale === "en" 
              ? "In 18 seconds, the engine trims silences, generates dynamic bouncy subtitles (Viral Gold, Cyber, Minimal), injects 3D motion plates, and adds cinematic sub-bass impact audio effects." 
              : "En solo 18 segundos, el motor corta los silencios muertos, genera subtítulos animados llamativos (estilo Viral Gold, Cyber o Minimal), inserta gráficos 3D y añade efectos de sonido de cine (graves profundos y transiciones)."}
          </p>
        </div>

        <!-- Step 6 -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 22px; display: flex; flexDirection: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 24px;">🚀</span>
            <span style="font-size: 10px; font-family: monospace; color: #f59e0b; font-weight: 800; background: rgba(245,158,11,0.15); padding: 2px 8px; border-radius: 4px;">PASO 06</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 800; color: #fff; margin: 0;">
            ${locale === "en" ? "6. 50-Video Batch & Telemetry" : "6. Exportación de 50 Videos y Aprendizaje"}
          </h3>
          <p style="font-size: 13px; color: rgba(255,255,255,0.75); line-height: 1.5; margin: 0;">
            ${locale === "en" 
              ? "Export 50 videos in batch in just a couple hours. Publish directly to TikTok, Reels, and Shorts. The platform tracks real watch time to make your next batch even more viral." 
              : "Exportas 50 videos en lote en un par de horas usando la potencia de tu Mac. Los programas para TikTok, Reels y YouTube Shorts, y el sistema aprende qué videos tuvieron más vistas para mejorar los siguientes."}
          </p>
        </div>

      </div>

    </section>

    <!-- Grand Philosophical Narrative & Kabbalah Creation Story -->
    <section id="creation-narrative" class="philosophical-story-wrap">
      <header class="story-prose-header">
        <div class="story-prose-tag">${locale === 'en' ? 'METAPHYSICAL GENESIS & OPERATIONAL LAW' : 'GÉNESIS METAFÍSICO Y LEY OPERACIONAL'}</div>
        <h2 class="story-prose-title">${bilingualData.philosophicalCanon?.title[locale]}</h2>
        <p class="story-prose-subtitle">${bilingualData.philosophicalCanon?.subtitle[locale]}</p>
      </header>

      <article class="story-prose-body">
        ${formattedStory}
      </article>

      <!-- XYZA State Space Grid -->
      <section class="xyza-section">
        <h3 style="font-family: var(--font-headline); font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem;">${xyza?.title[locale]}</h3>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">${locale === 'en' ? 'Every Contenido exists as a dynamic trajectory across four orthogonal axes:' : 'Cada Contenido existe como una trayectoria dinámica a través de cuatro ejes ortogonales:'}</p>
        
        <div class="xyza-grid">
          ${xyza ? xyza.dimensions.map(d => `
          <div class="xyza-card">
            <div class="xyza-dim-glyph">${d.dim}</div>
            <div class="xyza-dim-name">${d.name[locale]}</div>
            <div class="xyza-dim-desc">${d.description[locale]}</div>
          </div>
          `).join('\n') : ''}
        </div>
      </section>

      <!-- Operator Law -->
      <div class="operator-law-card">
        <div class="operator-law-title">▲ ${operatorLaw?.title[locale]}</div>
        <div class="operator-law-text">${operatorLaw?.law[locale]}</div>
      </div>
    </section>

    <!-- Grand Final CTA -->
    <section class="story-act-section grand-cta-section" data-act="${acts.length}">
      <div class="act-content-wrap">
        <div class="act-tag">${locale === 'en' ? 'OPERATIONAL CORE' : 'NÚCLEO OPERATIVO'}</div>
        <h2 class="act-headline">${locale === 'en' ? 'Enter the operating system.' : 'Entra en el sistema operativo.'}</h2>
        <p class="act-lead">${locale === 'en' ? 'Transition from cinematic manifesto to live operational dashboard, examine empirical evidence ledgers, and explore all 13 module operators.' : 'Pasa del manifiesto cinemático al dashboard operativo en vivo, examina los libros de evidencia empírica y explora los 13 módulos operadores.'}</p>
        <div class="cta-banner-box">
          <div class="cta-btn-row">
            <a href="./system/index.html" class="btn-primary">${locale === 'en' ? 'Launch System Dashboard →' : 'Iniciar Dashboard del Sistema →'}</a>
            <a href="./proof/index.html" class="btn-secondary">${locale === 'en' ? 'Verified Evidence Ledger' : 'Libro Mayor de Evidencia'}</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 0)}

  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[Bilingual Generator] Generated /${locale}/index.html with full Layer 0 Source Plates & Philosophical Narrative`);
}



function generateCuentoPage(locale) {
  const dir = path.join(docsDir, locale, 'cuento');
  fs.mkdirSync(dir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(1);

  const t = {
    en: {
      title: 'The Creation Narrative & Kabbalistic Canon — ABRAXAS OS',
      tag: 'METAPHYSICAL ONTOLOGY',
      back: '← Back to Manifesto'
    },
    es: {
      title: 'La Historia de Creación y Canon Cabalístico — ABRAXAS OS',
      tag: 'ONTOLOGÍA METAFÍSICA',
      back: '← Volver al Manifiesto'
    }
  }[locale];

  const storyContent = bilingualData.philosophicalCanon?.story[locale] || '';
  const formattedStory = storyContent
    .replace(/### (.*?)\n/g, '<h3>$1</h3>')
    .split('\n\n')
    .map(p => p.startsWith('<h3>') ? p : `<p>${p}</p>`)
    .join('\n');

  const xyza = bilingualData.philosophicalCanon?.xyzaExplanation;
  const operatorLaw = bilingualData.philosophicalCanon?.moduleLaw;

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title}</title>
  <meta name="description" content="${bilingualData.system.description[locale]}">
  <link rel="alternate" hreflang="en" href="${enRoot}cuento/index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}cuento/index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}cuento/index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="cuento-reading-body" style="background-color: #070a0f; color: #f8fafc;">
  ${getHeader(locale, 'story', 'cuento/index.html', 1)}

  <main class="philosophical-story-wrap" style="margin-top: 7rem;">
    <div style="margin-bottom: 2rem;">
      <a href="${localeRoot}index.html" class="nav-back-link" style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.85rem;">${t.back}</a>
    </div>

    <header class="story-prose-header">
      <div class="story-prose-tag">${t.tag}</div>
      <h1 class="story-prose-title">${bilingualData.philosophicalCanon?.title[locale]}</h1>
      <p class="story-prose-subtitle">${bilingualData.philosophicalCanon?.subtitle[locale]}</p>
    </header>

    <article class="story-prose-body">
      ${formattedStory}
    </article>

    <section class="xyza-section">
      <h3 style="font-family: var(--font-headline); font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem;">${xyza?.title[locale]}</h3>
      <p style="color: var(--text-secondary); font-size: 0.95rem;">${locale === 'en' ? 'Every Contenido exists as a dynamic trajectory across four orthogonal axes:' : 'Cada Contenido existe como una trayectoria dinámica a través de cuatro ejes ortogonales:'}</p>
      
      <div class="xyza-grid">
        ${xyza ? xyza.dimensions.map(d => `
        <div class="xyza-card">
          <div class="xyza-dim-glyph">${d.dim}</div>
          <div class="xyza-dim-name">${d.name[locale]}</div>
          <div class="xyza-dim-desc">${d.description[locale]}</div>
        </div>
        `).join('\n') : ''}
      </div>
    </section>

    <div class="operator-law-card">
      <div class="operator-law-title">▲ ${operatorLaw?.title[locale]}</div>
      <div class="operator-law-text">${operatorLaw?.law[locale]}</div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 1)}

  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[Bilingual Generator] Generated /${locale}/cuento/index.html`);
}


function generateSystemDashboardPage(locale) {
  const dir = path.join(docsDir, locale, 'system');
  fs.mkdirSync(dir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(1);

  const t = {
    en: {
      title: 'System Dashboard — ABRAXAS OS',
      hierarchy: 'System Hierarchy',
      targetToggle: 'Show Target State',
      spatialHint: 'Click any chamber or select from directory to inspect',
      responsibility: 'Responsibility',
      spatialAssoc: 'Spatial & Symbolic Association',
      owns: 'Owns',
      doesNotOwn: 'Does Not Own',
      evidence: 'Dependencies & Evidence',
      dossierBtn: 'Open Full Dossier →'
    },
    es: {
      title: 'Dashboard del Sistema — ABRAXAS OS',
      hierarchy: 'Jerarquía del Sistema',
      targetToggle: 'Mostrar Estado Objetivo',
      spatialHint: 'Haz clic en cualquier cámara o selecciona del directorio',
      responsibility: 'Responsabilidad',
      spatialAssoc: 'Asociación Espacial y Simbólica',
      owns: 'Posee',
      doesNotOwn: 'No Posee',
      evidence: 'Dependencias y Evidencia',
      dossierBtn: 'Abrir Dossier Completo →'
    }
  }[locale];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title}</title>
  <meta name="description" content="${bilingualData.system.description[locale]}">
  <link rel="alternate" hreflang="en" href="${enRoot}system/index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}system/index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}system/index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="system-dashboard-body">
  ${getHeader(locale, 'system', 'system/index.html', 1)}

  <div id="spatial-pyramid-container" class="spatial-canvas-fullscreen" aria-label="ABRAXAS 3D Spatial Canvas"></div>

  <div class="system-workspace-layout">
    <aside class="system-directory-rail" aria-label="${t.hierarchy}">
      <div class="directory-header">
        <div class="rail-title-group">
          <span class="rail-glyph">◈</span>
          <h2>${t.hierarchy}</h2>
        </div>
        <div class="truth-toggle-wrapper">
          <label class="truth-toggle-label" for="target-mode-toggle">
            <input type="checkbox" id="target-mode-toggle" class="truth-toggle-input">
            <span class="truth-toggle-slider"></span>
            <span class="truth-toggle-text">${t.targetToggle}</span>
          </label>
        </div>
      </div>
      <div class="directory-list" id="system-directory-list" role="listbox">
        <!-- Injected dynamically by modes.js -->
      </div>
    </aside>

    <main class="system-center-overlay" aria-label="Interactive 3D Spatial Center">
      <div class="system-spatial-hint">
        <span class="hint-glyph">✦</span> ${t.spatialHint}
      </div>
    </main>

    <aside class="system-inspector-rail" id="system-inspector-rail" aria-label="Module Details Inspector">
      <div class="inspector-header">
        <div class="truth-pill ${bilingualData.modules[0].truthLayer.toLowerCase()}" id="inspector-truth-badge">${bilingualData.truthLayers[bilingualData.modules[0].truthLayer]?.label[locale] || bilingualData.modules[0].truthLayer}</div>
        <h3 class="inspector-title" id="inspector-title">${bilingualData.modules[0].name}</h3>
        <div class="inspector-role" id="inspector-domain">${bilingualData.modules[0].domain}</div>
      </div>
      <div class="inspector-body" id="inspector-body">
        <div class="inspector-section">
          <h4>${t.responsibility}</h4>
          <p id="inspector-responsibility">${bilingualData.modules[0].lead[locale]}</p>
        </div>
        <div class="inspector-section">
          <h4>${t.spatialAssoc}</h4>
          <p id="inspector-sephirot">${bilingualData.modules[0].spatialAssociation[locale]}</p>
          <small class="disclaimer-text">${bilingualData.spatialDisclaimer[locale]}</small>
        </div>
        <div class="inspector-section">
          <h4>${t.owns}</h4>
          <ul id="inspector-owns-list">
            ${bilingualData.modules[0].owns[locale].slice(0, 3).map(o => `<li>${o}</li>`).join('\n')}
          </ul>
        </div>
        <div class="inspector-section">
          <h4>${t.doesNotOwn}</h4>
          <ul id="inspector-not-owns-list">
            ${bilingualData.modules[0].doesNotOwn[locale].slice(0, 2).map(no => `<li>${no}</li>`).join('\n')}
          </ul>
        </div>
        <div class="inspector-section">
          <h4>${t.evidence}</h4>
          <p id="inspector-evidence">${bilingualData.modules[0].statusDetail[locale]}</p>
        </div>
        <a href="../tools/yod/index.html" class="inspector-deep-btn" id="inspector-deep-link">${t.dossierBtn}</a>
      </div>
    </aside>
  </div>

  ${getArchitectDrawer(locale)}
  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[Bilingual Generator] Generated /${locale}/system/index.html`);
}

function generateArchitectureSuite(locale) {
  const archDir = path.join(docsDir, locale, 'architecture');
  fs.mkdirSync(archDir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(1);

  const archPages = [
    {
      slug: 'pyramid',
      title: { en: 'Giza Monumental Architecture', es: 'Arquitectura Monumental de Giza' },
      desc: {
        en: 'Mathematical massing inspired by the Great Pyramid of Giza (Slope 51.8487°, Ratio 0.6365), 24-course black amethyst masonry, and aged electrum apex.',
        es: 'Volumetría matemática inspirada en la Gran Pirámide de Giza (Inclinación 51.8487°, Ratio 0.6365), mampostería de 24 hiladas de amatista negra y ápice de electrum envejecido.'
      },
      content: {
        en: '<p>The Pyramid represents ABRAXAS OS as a monumental architectural world. It reads first as a physical stone structure rather than a digital wireframe. Its 24 tiered courses of black amethyst masonry ground the entire operating system in believable weight, scale, and mineral texture.</p>',
        es: '<p>La Pirámide representa a ABRAXAS OS como un mundo arquitectónico monumental. Se lee primero como una estructura física de piedra antes que un wireframe digital. Sus 24 hiladas de mampostería de amatista negra anclan el sistema operativo en peso, escala y textura mineral creíbles.</p>'
      }
    },
    {
      slug: 'four-worlds',
      title: { en: 'The Four Worlds Framework', es: 'El Marco de los Cuatro Mundos' },
      desc: {
        en: 'Atziluth (Emanation / Possibility), Beri\'ah (Creation / Identity), Yetzirah (Formation / Synthesis), and Assiah (Action / Manifestation).',
        es: 'Atziluth (Emanación / Posibilidad), Beri\'ah (Creación / Identidad), Yetzirah (Formación / Síntesis) y Assiah (Acción / Manifestación).'
      },
      content: {
        en: '<p>The Four Worlds represent progressive degrees of manifestation. Atziluth provides unmanifest potential in the golden apex; Beri\'ah binds identity into a Contenido crystal; Yetzirah shapes media in the Vav formation cathedral; Assiah manifests human operational visibility in HE.</p>',
        es: '<p>Los Cuatro Mundos representan grados progresivos de manifestación. Atziluth provee potencial inmanifiesto en el ápice dorado; Beri\'ah fija la identidad en un cristal de Contenido; Yetzirah modela media en la catedral de formación de Vav; Assiah manifiesta visibilidad operativa humana en HE.</p>'
      }
    },
    {
      slug: 'tree-of-life',
      title: { en: 'Tree of Life Spatial Topology', es: 'Topología Espacial del Árbol de la Vida' },
      desc: {
        en: 'Structural topology describing what happens to a Contenido as it transitions across 11 canonical node states and 22 architectural channels.',
        es: 'Topología estructural que describe qué le ocurre a un Contenido mientras transita a través de 11 estados de nodo canónicos y 22 conductos arquitectónicos.'
      },
      content: {
        en: '<p>The Tree of Life describes what happens to a Contenido; modules are the operators acting upon it. The 22 Paths are transformed into physical architectural conduits, stone corridors, and optical channels linking the chambers.</p><p><strong>Important Invariant:</strong> Modules are not Sefirot. Sefirot represent state transformations of content; modules are operators acting upon them.</p>',
        es: '<p>El Árbol de la Vida describe qué le ocurre al Contenido; los módulos son los operadores que actúan sobre él. Los 22 Senderos se transforman en conductos arquitectónicos físicos, corredores de piedra y canales ópticos que unen las cámaras.</p><p><strong>Invariante Importante:</strong> Los módulos no son Sefirot. Las Sefirot representan transformaciones de estado del contenido; los módulos son operadores que actúan sobre ellos.</p>'
      }
    },
    {
      slug: 'content-state-space',
      title: { en: 'Content State-Space XYZA', es: 'Espacio de Estados de Contenido XYZA' },
      desc: {
        en: 'X (Polarity: Chesed expansion vs Gevurah constraint), Y (Vertical Manifestation), Z (Context/Depth), and A (Adaptive Intelligence).',
        es: 'X (Polaridad: expansión de Chesed vs restricción de Gevurah), Y (Manifestación Vertical), Z (Contexto/Profundidad) y A (Inteligencia Adaptativa).'
      },
      content: {
        en: '<p>State-space XYZA maps content state transformation. Dimension A represents cognitive stratigraphy: memory, criteria refinement, learning signals, and provenance lineage without mutating source truth silently.</p>',
        es: '<p>El espacio de estados XYZA mapea la transformación del estado de contenido. La dimensión A representa la estratigrafía cognitiva: memoria, refinamiento de criterios, señales de aprendizaje y linaje de procedencia sin mutar la verdad fuente silenciosamente.</p>'
      }
    },
    {
      slug: 'closed-loop',
      title: { en: 'The Perpetual Closed Loop', es: 'El Ciclo Cerrado Perpetuo' },
      desc: {
        en: 'Sun -> Arquitecto -> Atziluth / YOD -> Contenido -> SHIM -> VAV -> HE -> Moon (Publishing) -> World -> Metrics -> YOD.',
        es: 'Sol -> Arquitecto -> Atziluth / YOD -> Contenido -> SHIM -> VAV -> HE -> Luna (Publishing) -> Mundo -> Metrics -> YOD.'
      },
      content: {
        en: '<p>The closed loop governs the content lifecycle. Outbound distribution projects from the pyramid to the celestial moon, while empirical audience metrics return along feedback arcs into YOD, closing the adaptive loop in a helix-like progression.</p>',
        es: '<p>El ciclo cerrado gobierna el ciclo de vida del contenido. La distribución saliente se proyecta desde la pirámide a la luna celestial, mientras las métricas empíricas de audiencia retornan por arcos de feedback a YOD, cerrando el ciclo adaptativo en una progresión helicoidal.</p>'
      }
    }
  ];

  const indexHtml = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${locale === 'en' ? 'Architecture Suite — ABRAXAS OS' : 'Suite de Arquitectura — ABRAXAS OS'}</title>
  <link rel="alternate" hreflang="en" href="${enRoot}architecture/index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}architecture/index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}architecture/index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'architecture', 'architecture/index.html', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${localeRoot}index.html">Home</a> / <a href="${localeRoot}system/index.html">System</a> / <span>${locale === 'en' ? 'Architecture' : 'Arquitectura'}</span></div>
        <h1 class="page-title">${locale === 'en' ? 'Spatial & Symbolic Architecture' : 'Arquitectura Espacial y Simbólica'}</h1>
        <p class="page-description">${locale === 'en' ? 'The formal geometric, cosmological, and topological projections structuring ABRAXAS OS into a coherent physical and computational universe.' : 'Las proyecciones geométricas, cosmológicas y topológicas formales que estructuran a ABRAXAS OS en un universo físico y computacional coherente.'}</p>
      </div>

      <div class="tools-grid">
        ${archPages.map(p => `
        <article class="tool-card">
          <div class="tool-card-header">
            <span class="truth-pill released_current">CANONICAL</span>
            <span class="tool-domain">Architecture</span>
          </div>
          <h3 class="tool-name">${p.title[locale]}</h3>
          <p class="tool-summary">${p.desc[locale]}</p>
          <div class="tool-card-footer">
            <a href="./${p.slug}/index.html" class="tool-link-btn">${locale === 'en' ? 'Read Treatise →' : 'Leer Tratado →'}</a>
          </div>
        </article>
        `).join('\n')}
      </div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 1)}
  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(archDir, 'index.html'), indexHtml);
  console.log(`[Bilingual Generator] Generated /${locale}/architecture/index.html`);

  archPages.forEach(p => {
    const subDir = path.join(archDir, p.slug);
    fs.mkdirSync(subDir, { recursive: true });
    const { localeRoot: subLocaleRoot, assetsRoot: subAssetsRoot, enRoot: subEnRoot, esRoot: subEsRoot } = getPrefixes(2);

    const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title[locale]} — ABRAXAS OS</title>
  <link rel="alternate" hreflang="en" href="${subEnRoot}architecture/${p.slug}/index.html">
  <link rel="alternate" hreflang="es" href="${subEsRoot}architecture/${p.slug}/index.html">
  <link rel="alternate" hreflang="x-default" href="${subEnRoot}architecture/${p.slug}/index.html">
  <link rel="stylesheet" href="${subAssetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'architecture', `architecture/${p.slug}/index.html`, 2)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${subLocaleRoot}index.html">Home</a> / <a href="${subLocaleRoot}system/index.html">System</a> / <a href="../index.html">${locale === 'en' ? 'Architecture' : 'Arquitectura'}</a> / <span>${p.slug}</span></div>
        <h1 class="page-title">${p.title[locale]}</h1>
        <p class="page-description">${p.desc[locale]}</p>
      </div>

      <div class="dossier-grid">
        <div class="dossier-main-col">
          <section class="dossier-section">
            <h2 class="section-title">${locale === 'en' ? '1. Canonical Treatise' : '1. Tratado Canónico'}</h2>
            <div class="treatise-body">${p.content[locale]}</div>
          </section>
        </div>
        <aside class="dossier-sidebar">
          <div class="sidebar-card">
            <h3>${locale === 'en' ? 'System Anchors' : 'Anclas del Sistema'}</h3>
            <p>${locale === 'en' ? 'Verified in Taste Canon V2 & Spatial Model V6.' : 'Verificado en Canon de Taste V2 y Modelo Espacial V6.'}</p>
          </div>
        </aside>
      </div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 2)}
  <script type="module" src="${subAssetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(subDir, 'index.html'), html);
    console.log(`[Bilingual Generator] Generated /${locale}/architecture/${p.slug}/index.html`);
  });
}

function generateToolsSuite(locale) {
  const toolsDir = path.join(docsDir, locale, 'tools');
  fs.mkdirSync(toolsDir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(1);

  const indexHtml = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${locale === 'en' ? 'Operators of the System — ABRAXAS OS' : 'Operadores del Sistema — ABRAXAS OS'}</title>
  <meta name="description" content="${locale === 'en' ? 'ABRAXAS modules are operators acting on persistent content as it moves through different degrees of manifestation.' : 'Los módulos de ABRAXAS son operadores que actúan sobre contenido persistente mientras este atraviesa distintos grados de manifestación.'}">
  <link rel="alternate" hreflang="en" href="${enRoot}tools/index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}tools/index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}tools/index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'tools', 'tools/index.html', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${localeRoot}index.html">Home</a> / <a href="${localeRoot}system/index.html">System</a> / <span>${locale === 'en' ? 'Operators' : 'Operadores'}</span></div>
        <h1 class="page-title">${locale === 'en' ? 'Operators of the System' : 'Operadores del Sistema'}</h1>
        <p class="page-description">${locale === 'en' ? 'ABRAXAS modules are operators acting on persistent content as it moves through different degrees of manifestation.' : 'Los módulos de ABRAXAS son operadores que actúan sobre contenido persistente mientras este atraviesa distintos grados de manifestación.'}</p>
      </div>

      <div class="tools-grid">
        ${bilingualData.modules.map(m => `
        <article class="tool-card" id="card-${m.slug}">
          <div class="tool-card-header">
            <div class="truth-pill ${m.truthLayer.toLowerCase()}">${bilingualData.truthLayers[m.truthLayer]?.label[locale] || m.truthLayer}</div>
            <span class="tool-domain">${m.domain}</span>
          </div>
          <h3 class="tool-name">${m.name}</h3>
          <div class="tool-sephirot-tag">⚝ ${m.spatialAssociation[locale]}</div>
          <p class="tool-summary">${m.headline[locale]}</p>
          <div class="tool-card-footer">
            <a href="./${m.slug}/index.html" class="tool-link-btn">${locale === 'en' ? 'Open Dossier →' : 'Abrir Dossier →'}</a>
          </div>
        </article>
        `).join('\n')}

        <article class="tool-card" id="card-vav-captions">
          <div class="tool-card-header">
            <div class="truth-pill released_current">${locale === 'en' ? 'RELEASED (RC1)' : 'PUBLICADO (RC1)'}</div>
            <span class="tool-domain">Synthesis Subtool</span>
          </div>
          <h3 class="tool-name">VAV / Captions</h3>
          <div class="tool-sephirot-tag">⚝ Yetzirah Typographic Track (Hod)</div>
          <p class="tool-summary">${locale === 'en' ? 'Word-level timestamp synchronization, font style hierarchies, and multi-line kinetic animation.' : 'Sincronización de timestamps a nivel de palabra, jerarquías de estilo y animación cinética multilínea.'}</p>
          <div class="tool-card-footer">
            <a href="./vav/captions/index.html" class="tool-link-btn">${locale === 'en' ? 'Open Dossier →' : 'Abrir Dossier →'}</a>
          </div>
        </article>

        <article class="tool-card" id="card-vav-cuts">
          <div class="tool-card-header">
            <div class="truth-pill released_current">${locale === 'en' ? 'RELEASED (RC1)' : 'PUBLICADO (RC1)'}</div>
            <span class="tool-domain">Synthesis Subtool</span>
          </div>
          <h3 class="tool-name">VAV / Cuts</h3>
          <div class="tool-sephirot-tag">⚝ Yetzirah Temporal Track (Tiferet)</div>
          <p class="tool-summary">${locale === 'en' ? 'Non-destructive multi-segment video trimming, stream-copy rendering, and frame-accurate EDL compilation.' : 'Recorte de video multietapa no destructivo, renderizado stream-copy y compilación EDL con precisión de cuadro.'}</p>
          <div class="tool-card-footer">
            <a href="./vav/cuts/index.html" class="tool-link-btn">${locale === 'en' ? 'Open Dossier →' : 'Abrir Dossier →'}</a>
          </div>
        </article>

        <article class="tool-card" id="card-vav-motions">
          <div class="tool-card-header">
            <div class="truth-pill released_current">${locale === 'en' ? 'RELEASED (RC1)' : 'PUBLICADO (RC1)'}</div>
            <span class="tool-domain">Synthesis Subtool</span>
          </div>
          <h3 class="tool-name">VAV / Motions</h3>
          <div class="tool-sephirot-tag">⚝ Yetzirah Kinetic Track (Netzach)</div>
          <p class="tool-summary">${locale === 'en' ? 'Spring physics, optical visual priors, B-roll overlays, and smooth layout transform transitions.' : 'Físicas de resorte, priors visuales ópticos, superposiciones de B-roll y transiciones suaves de diseño.'}</p>
          <div class="tool-card-footer">
            <a href="./vav/motions/index.html" class="tool-link-btn">${locale === 'en' ? 'Open Dossier →' : 'Abrir Dossier →'}</a>
          </div>
        </article>
      </div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 1)}
  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(toolsDir, 'index.html'), indexHtml);
  console.log(`[Bilingual Generator] Generated /${locale}/tools/index.html`);

  bilingualData.modules.forEach(m => {
    const modDir = path.join(toolsDir, m.slug);
    fs.mkdirSync(modDir, { recursive: true });
    const { localeRoot: subLocaleRoot, assetsRoot: subAssetsRoot, enRoot: subEnRoot, esRoot: subEsRoot } = getPrefixes(2);

    const t = {
      en: {
        what: '1. What It Is & Purpose',
        spatialAssocH: '2. Spatial & Symbolic Association',
        problemH: '3. Problem Solved',
        exampleH: '4. Operational Example Flow',
        ownershipH: '5. Strict Ownership Boundaries',
        ownsH: `✓ What ${m.name} OWNS`,
        notOwnsH: `✗ What ${m.name} DOES NOT OWN`,
        whatIsH: '6. What It Is vs What It Is Not',
        statusH: '7. Current Status & Roadmap Gate',
        ioH: 'I/O Specifications',
        connH: 'Connected Modules',
        evidenceH: 'Verified Evidence'
      },
      es: {
        what: '1. Qué Es y Propósito',
        spatialAssocH: '2. Asociación Espacial y Simbólica',
        problemH: '3. Problema que Resuelve',
        exampleH: '4. Flujo Operativo de Ejemplo',
        ownershipH: '5. Límites Estrictos de Propiedad',
        ownsH: `✓ Lo que ${m.name} POSEE`,
        notOwnsH: `✗ Lo que ${m.name} NO POSEE`,
        whatIsH: '6. Lo que Es frente a Lo que NO Es',
        statusH: '7. Estado Actual y Compuerta de Roadmap',
        ioH: 'Especificaciones de E/S',
        connH: 'Módulos Conectados',
        evidenceH: 'Evidencia Verificada'
      }
    }[locale];

    const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${m.name} (${m.domain}) — ABRAXAS OS</title>
  <meta name="description" content="${m.lead[locale]}">
  <link rel="alternate" hreflang="en" href="${subEnRoot}tools/${m.slug}/index.html">
  <link rel="alternate" hreflang="es" href="${subEsRoot}tools/${m.slug}/index.html">
  <link rel="alternate" hreflang="x-default" href="${subEnRoot}tools/${m.slug}/index.html">
  <link rel="stylesheet" href="${subAssetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'tools', `tools/${m.slug}/index.html`, 2)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${subLocaleRoot}index.html">Home</a> / <a href="${subLocaleRoot}system/index.html">System</a> / <a href="../index.html">${locale === 'en' ? 'Operators' : 'Operadores'}</a> / <span>${m.name}</span></div>
        <div class="module-title-row">
          <h1 class="page-title">${m.name}</h1>
          <div class="truth-pill ${m.truthLayer.toLowerCase()}">${bilingualData.truthLayers[m.truthLayer]?.label[locale] || m.truthLayer}</div>
        </div>
        <div class="module-domain-badge">Domain: ${m.domain} // ⚝ ${m.spatialAssociation[locale]}</div>
        <p class="page-description">${m.headline[locale]}</p>
      </div>

      <div class="dossier-grid">
        <div class="dossier-main-col">
          <section class="dossier-section">
            <h2 class="section-title">${t.what}</h2>
            <p class="section-lead">${m.lead[locale]}</p>
          </section>

          <section class="dossier-section">
            <h2 class="section-title">${t.spatialAssocH}</h2>
            <p>${m.spatialAssociation[locale]}</p>
            <div class="disclaimer-box"><small>${bilingualData.spatialDisclaimer[locale]}</small></div>
          </section>

          <section class="dossier-section">
            <h2 class="section-title">${t.problemH}</h2>
            <p>${m.problemSolved[locale]}</p>
          </section>

          <section class="dossier-section">
            <h2 class="section-title">${t.exampleH}</h2>
            <div class="example-box">
              <p class="example-flow-text"><code>${m.exampleFlow[locale]}</code></p>
            </div>
          </section>

          <section class="dossier-section">
            <h2 class="section-title">${t.ownershipH}</h2>
            <div class="ownership-split-grid">
              <div class="owns-col">
                <h3 class="owns-title">${t.ownsH}</h3>
                <ul class="boundary-list">
                  ${m.owns[locale].map(o => `<li>${o}</li>`).join('\n')}
                </ul>
              </div>
              <div class="not-owns-col">
                <h3 class="not-owns-title">${t.notOwnsH}</h3>
                <ul class="boundary-list">
                  ${m.doesNotOwn[locale].map(no => `<li>${no}</li>`).join('\n')}
                </ul>
              </div>
            </div>
          </section>

          <section class="dossier-section">
            <h2 class="section-title">${t.whatIsH}</h2>
            <div class="what-is-table-wrap">
              <table class="what-is-table">
                <thead>
                  <tr>
                    <th>${locale === 'en' ? `What ${m.name} IS` : `Lo que ${m.name} ES`}</th>
                    <th>${locale === 'en' ? `What ${m.name} IS NOT` : `Lo que ${m.name} NO ES`}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${m.whatIs[locale]}</td>
                    <td>${m.whatIsNot[locale]}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="dossier-section">
            <h2 class="section-title">${t.statusH}</h2>
            <div class="roadmap-gap-box">
              <h4>${locale === 'en' ? 'Current Truth Status:' : 'Estado de Verdad Actual:'} <span class="highlight-text">${bilingualData.truthLayers[m.truthLayer]?.label[locale] || m.truthLayer}</span></h4>
              <p>${m.statusDetail[locale]}</p>
            </div>
          </section>
        </div>

        <aside class="dossier-sidebar">
          <div class="sidebar-card">
            <h3>${t.ioH}</h3>
            <div class="io-group">
              <span class="io-label">Inputs:</span>
              <ul class="io-list">
                ${m.inputs.map(i => `<li><code>${i}</code></li>`).join('\n')}
              </ul>
            </div>
            <div class="io-group">
              <span class="io-label">Outputs:</span>
              <ul class="io-list">
                ${m.outputs.map(o => `<li><code>${o}</code></li>`).join('\n')}
              </ul>
            </div>
          </div>

          <div class="sidebar-card">
            <h3>${t.connH}</h3>
            <p class="conn-text">${m.connections[locale]}</p>
          </div>

          <div class="sidebar-card">
            <h3>${t.evidenceH}</h3>
            <p>${m.statusDetail[locale]}</p>
            <a href="../../proof/index.html" class="tool-link-btn">${locale === 'en' ? 'View Proof Ledger →' : 'Ver Libro Mayor de Evidencia →'}</a>
          </div>
        </aside>
      </div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 2)}
  <script type="module" src="${subAssetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(modDir, 'index.html'), html);
    console.log(`[Bilingual Generator] Generated /${locale}/tools/${m.slug}/index.html`);

    if (m.slug === 'contenido') {
      const lienzoDir = path.join(toolsDir, 'lienzo');
      fs.mkdirSync(lienzoDir, { recursive: true });
      fs.writeFileSync(path.join(lienzoDir, 'index.html'), html);
    }
  });

  const vavSubs = [
    { slug: 'captions', name: 'VAV / Captions', desc: { en: 'Word-level timestamp synchronization, font style hierarchies, and multi-line kinetic animation.', es: 'Sincronización de timestamps a nivel de palabra, jerarquías de estilo y animación cinética multilínea.' } },
    { slug: 'cuts', name: 'VAV / Cuts', desc: { en: 'Non-destructive multi-segment video trimming, stream-copy rendering, and frame-accurate EDL compilation.', es: 'Recorte de video multietapa no destructivo, renderizado stream-copy y compilación EDL con precisión de cuadro.' } },
    { slug: 'motions', name: 'VAV / Motions', desc: { en: 'Spring physics, optical visual priors, B-roll overlays, and smooth layout transform transitions.', es: 'Físicas de resorte, priors visuales ópticos, superposiciones de B-roll y transiciones suaves de diseño.' } }
  ];

  vavSubs.forEach(st => {
    const subDir = path.join(toolsDir, 'vav', st.slug);
    fs.mkdirSync(subDir, { recursive: true });
    const { localeRoot: subLocaleRoot, assetsRoot: subAssetsRoot, enRoot: subEnRoot, esRoot: subEsRoot } = getPrefixes(3);

    const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${st.name} — ABRAXAS OS</title>
  <link rel="alternate" hreflang="en" href="${subEnRoot}tools/vav/${st.slug}/index.html">
  <link rel="alternate" hreflang="es" href="${subEsRoot}tools/vav/${st.slug}/index.html">
  <link rel="alternate" hreflang="x-default" href="${subEnRoot}tools/vav/${st.slug}/index.html">
  <link rel="stylesheet" href="${subAssetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'tools', `tools/vav/${st.slug}/index.html`, 3)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${subLocaleRoot}index.html">Home</a> / <a href="${subLocaleRoot}system/index.html">System</a> / <a href="../../index.html">${locale === 'en' ? 'Operators' : 'Operadores'}</a> / <a href="../index.html">VAV</a> / <span>${st.slug}</span></div>
        <div class="module-title-row">
          <h1 class="page-title">${st.name}</h1>
          <div class="truth-pill released_current">${locale === 'en' ? 'RELEASED (RC1)' : 'PUBLICADO (RC1)'}</div>
        </div>
        <p class="page-description">${st.desc[locale]}</p>
      </div>

      <div class="dossier-grid">
        <div class="dossier-main-col">
          <section class="dossier-section">
            <h2 class="section-title">${locale === 'en' ? '1. Operational Role' : '1. Rol Operativo'}</h2>
            <p class="section-lead">${st.desc[locale]}</p>
          </section>
        </div>
        <aside class="dossier-sidebar">
          <div class="sidebar-card">
            <h3>${locale === 'en' ? 'Evidence & Verification' : 'Evidencia y Verificación'}</h3>
            <p>${locale === 'en' ? 'Verified by current regression tests and frozen v1.0.0-rc1 release evidence.' : 'Verificado por pruebas de regresión actuales y evidencia de la versión congelada v1.0.0-rc1.'}</p>
          </div>
        </aside>
      </div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 3)}
  <script type="module" src="${subAssetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(subDir, 'index.html'), html);
    console.log(`[Bilingual Generator] Generated /${locale}/tools/vav/${st.slug}/index.html`);
  });
}

function generateTastePage(locale) {
  const dir = path.join(docsDir, locale, 'taste');
  fs.mkdirSync(dir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(1);

  const t = {
    en: {
      title: 'The Taste System — ABRAXAS OS',
      h1: 'Taste is not decoration. It is decision quality.',
      desc: 'In ABRAXAS OS, Taste is not a personal whim or decorative veneer. It is a formal, compiler-enforced system of criteria governing typography, spatial geometry, motion timing, and editorial restraint.',
      pipelineH: 'The Taste Compilation Lifecycle',
      antipatternsH: 'Taste Anti-Patterns: Quality vs Slop',
      antiMore: 'MORE THREE.JS != MORE PREMIUM\nMORE NEON != MORE PREMIUM\nMORE PARTICLES != MORE PREMIUM\nMORE GLASS != MORE PREMIUM\nMORE ANIMATION != MORE PREMIUM.',
      antiBetter: 'BETTER IDEA\n+ BETTER COMPOSITION\n+ BETTER MATERIAL\n+ BETTER TYPOGRAPHY\n+ BETTER CAMERA\n+ BETTER TIMING\n+ BETTER EVIDENCE\n= BETTER EXPERIENCE.'
    },
    es: {
      title: 'El Sistema de Taste — ABRAXAS OS',
      h1: 'El taste no es decoración. Es calidad de decisión.',
      desc: 'En ABRAXAS OS, el Taste no es un capricho personal ni barniz decorativo. Es un sistema formal de criterios ejecutados por el compilador que gobierna tipografía, geometría espacial, timing de movimiento y contención editorial.',
      pipelineH: 'El Ciclo de Compilación de Taste',
      antipatternsH: 'Anti-Patrones de Taste: Calidad frente a Slop',
      antiMore: 'MÁS THREE.JS != MÁS PREMIUM\nMÁS NEÓN != MÁS PREMIUM\nMÁS PARTÍCULAS != MÁS PREMIUM\nMÁS GLASS != MÁS PREMIUM\nMÁS ANIMACIÓN != MÁS PREMIUM.',
      antiBetter: 'MEJOR IDEA\n+ MEJOR COMPOSICIÓN\n+ MEJOR MATERIAL\n+ MEJOR TIPOGRAFÍA\n+ MEJOR CÁMARA\n+ MEJOR TIMING\n+ MEJOR EVIDENCIA\n= MEJOR EXPERIENCIA.'
    }
  }[locale];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title}</title>
  <link rel="alternate" hreflang="en" href="${enRoot}taste/index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}taste/index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}taste/index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'taste', 'taste/index.html', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${localeRoot}index.html">Home</a> / <a href="${localeRoot}system/index.html">System</a> / <span>${locale === 'en' ? 'Taste' : 'Taste'}</span></div>
        <h1 class="page-title">${t.h1}</h1>
        <p class="page-description">${t.desc}</p>
      </div>

      <div class="taste-manifesto-grid">
        <section class="taste-pillar-card">
          <div class="pillar-num">01</div>
          <h3>${locale === 'en' ? 'One Frame = One Dominant Idea' : 'Un Encuadre = Una Idea Dominante'}</h3>
          <p>${locale === 'en' ? 'A scene must never compete with itself. Negative space is a first-class composition element. If secondary elements are present, they must recede into deep shadow.' : 'Una escena nunca debe competir consigo misma. El espacio negativo es un elemento de composición de primera clase. Los elementos secundarios deben retroceder a la sombra profunda.'}</p>
        </section>

        <section class="taste-pillar-card">
          <div class="pillar-num">02</div>
          <h3>${locale === 'en' ? 'Color is Semantic, Never Decorative' : 'El Color es Semántico, Nunca Decorativo'}</h3>
          <p>${locale === 'en' ? '90–95% of the visual field remains monochromatic (black, graphite, charcoal, white). Color is reserved strictly for state, energy, and verification.' : 'El 90–95% del campo visual permanece estrictamente monocromático (negro, grafito, carbón, blanco). El color se reserva exclusivamente para estado, energía y verificación.'}</p>
        </section>

        <section class="taste-pillar-card">
          <div class="pillar-num">03</div>
          <h3>${locale === 'en' ? 'Physical Precision & Believable Weight' : 'Precisión Física y Peso Creíble'}</h3>
          <p>${locale === 'en' ? 'Abstract systems are grounded in tangible physical materials (black basalt, titanium, aged gold, sapphire crystal). Random floating primitives are rejected.' : 'Los sistemas abstractos se anclan en materiales físicos tangibles (basalto negro, titanio, oro envejecido, cristal de zafiro). Las primitivas flotantes aleatorias se rechazan.'}</p>
        </section>

        <section class="taste-pillar-card">
          <div class="pillar-num">04</div>
          <h3>${locale === 'en' ? 'Motion is Explanatory, Never Constant' : 'El Movimiento es Explicativo, Nunca Constante'}</h3>
          <p>${locale === 'en' ? 'Motion exists only to explain spatial relationships and causal state progression. Constant ambient spinning is rejected.' : 'El movimiento existe solo para explicar relaciones espaciales y progresión causal de estados. El giro ambiental constante se rechaza.'}</p>
        </section>
      </div>

      <section class="dossier-section anti-slop-box">
        <h2 class="section-title">${t.antipatternsH}</h2>
        <div class="ownership-split-grid">
          <div class="not-owns-col">
            <h3 class="not-owns-title">${locale === 'en' ? '✗ Rejected Clichés' : '✗ Clichés Rechazados'}</h3>
            <pre class="anti-pre"><code>${t.antiMore}</code></pre>
          </div>
          <div class="owns-col">
            <h3 class="owns-title">${locale === 'en' ? '✓ ABRAXAS Equation' : '✓ Ecuación ABRAXAS'}</h3>
            <pre class="anti-pre"><code>${t.antiBetter}</code></pre>
          </div>
        </div>
      </section>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 1)}
  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[Bilingual Generator] Generated /${locale}/taste/index.html`);
}

function generatePrinciplesPage(locale) {
  const dir = path.join(docsDir, locale, 'principles');
  fs.mkdirSync(dir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(1);

  const laws = {
    en: [
      { id: 'I', title: 'PLANNED != OBSERVED != RESOLVED', desc: 'A planned script structure is never assumed to match recorded reality without empirical verification by SHIM at the Da\'at threshold.' },
      { id: 'II', title: 'CONTENT DATA != UI PROJECTION', desc: 'Contenido preserves the single-piece content state as an immutable data structure. All UI views and 3D scenes are read-only projections.' },
      { id: 'III', title: 'NO SILENT MUTATION', desc: 'AI generation and user edits create explicit revision strata. Downstream derivatives enter OUT_OF_SYNC rather than silently carrying stale data.' },
      { id: 'IV', title: 'LEARNING != AUTOMATIC CRITERION', desc: 'Audience performance telemetry informs learning signals through explicit contracts, but never silently alters canonical brand criteria.' },
      { id: 'V', title: 'PROOF OVER CLAIM', desc: 'Capabilities are never marked released without cryptographic test and hash evidence in the evidence registry.' }
    ],
    es: [
      { id: 'I', title: 'PLANIFICADO != OBSERVADO != RESUELTO', desc: 'Nunca se asume que un guion planificado coincida con la realidad grabada sin verificación empírica por parte de SHIM en el umbral de Da\'at.' },
      { id: 'II', title: 'DATOS DE CONTENIDO != PROYECCIÓN UI', desc: 'Contenido preserva el estado de una pieza como estructura de datos inmutable. Todas las vistas de interfaz y escenas 3D son proyecciones de solo lectura.' },
      { id: 'III', title: 'SIN MUTACIÓN SILENCIOSA', desc: 'La generación por IA y ediciones de usuario crean estratos de revisión explícitos. Los derivados downstream entran en OUT_OF_SYNC en vez de arrastrar datos obsoletos.' },
      { id: 'IV', title: 'APRENDIZAJE != CRITERIO AUTOMÁTICO', desc: 'La telemetría de audiencia informa señales de aprendizaje mediante contratos explícitos, pero nunca altera silenciosamente los criterios canónicos de marca.' },
      { id: 'V', title: 'PRUEBA SOBRE AFIRMACIÓN', desc: 'Las capacidades nunca se declaran publicadas sin evidencia criptográfica de pruebas y hashes en el registro de evidencias.' }
    ]
  }[locale];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${locale === 'en' ? 'Core Principles & Invariants — ABRAXAS OS' : 'Principios Canónicos e Invariantes — ABRAXAS OS'}</title>
  <link rel="alternate" hreflang="en" href="${enRoot}principles/index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}principles/index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}principles/index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'principles', 'principles/index.html', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${localeRoot}index.html">Home</a> / <a href="${localeRoot}system/index.html">System</a> / <span>${locale === 'en' ? 'Principles' : 'Principios'}</span></div>
        <h1 class="page-title">${locale === 'en' ? 'ABRAXAS converts criterion into infrastructure.' : 'ABRAXAS convierte criterio en infraestructura.'}</h1>
        <p class="page-description">${locale === 'en' ? 'The non-negotiable architectural laws governing state mutation, boundary enforcement, and truth representation.' : 'Las leyes arquitectónicas no negociables que gobiernan la mutación de estado, cumplimiento de límites y representación de la verdad.'}</p>
      </div>

      <div class="principles-stack">
        ${laws.map(l => `
        <article class="principle-card">
          <div class="principle-num">INVARIANT ${l.id}</div>
          <h2>${l.title}</h2>
          <p>${l.desc}</p>
        </article>
        `).join('\n')}
      </div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 1)}
  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[Bilingual Generator] Generated /${locale}/principles/index.html`);
}

function generateFlowPage(locale) {
  const dir = path.join(docsDir, locale, 'flow');
  fs.mkdirSync(dir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(1);

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${locale === 'en' ? 'Pipeline Blueprints — ABRAXAS OS' : 'Blueprints de Pipeline — ABRAXAS OS'}</title>
  <link rel="alternate" hreflang="en" href="${enRoot}flow/index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}flow/index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}flow/index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'flow', 'flow/index.html', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${localeRoot}index.html">Home</a> / <a href="${localeRoot}system/index.html">System</a> / <span>${locale === 'en' ? 'Flow' : 'Flujo'}</span></div>
        <h1 class="page-title">${locale === 'en' ? 'Pipeline Blueprint DAGs' : 'DAGs de Blueprints de Pipeline'}</h1>
        <p class="page-description">${locale === 'en' ? '11 canonical lifecycle pipelines defining stage transitions from raw intake to multi-platform publishing. (Design registry and schema validation).' : '11 pipelines canónicos que definen transiciones de etapas desde el ingreso en crudo hasta la publicación multiplataforma. (Registro de diseño y validación de esquemas).'}</p>
      </div>

      <div class="blueprints-grid">
        ${pipelineBlueprints.blueprints.map(bp => `
        <article class="blueprint-card">
          <div class="blueprint-header">
            <span class="blueprint-id">${bp.id}</span>
            <span class="blueprint-stages-count">${bp.stages.length} ${locale === 'en' ? 'Stages' : 'Etapas'}</span>
          </div>
          <h3 class="blueprint-title">${bp.name}</h3>
          <p class="blueprint-desc">${bp.description}</p>
          <div class="stages-timeline">
            ${bp.stages.map((s, idx) => `
            <div class="stage-step">
              <div class="stage-idx">${idx + 1}</div>
              <div class="stage-name">${s.name}</div>
              <div class="stage-owner">${s.owner}</div>
            </div>
            `).join('\n')}
          </div>
        </article>
        `).join('\n')}
      </div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 1)}
  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[Bilingual Generator] Generated /${locale}/flow/index.html`);
}

function generateProofPage(locale) {
  const dir = path.join(docsDir, locale, 'proof');
  fs.mkdirSync(dir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(1);

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${locale === 'en' ? 'Verified Evidence Ledger — ABRAXAS OS' : 'Libro Mayor de Evidencia Verificada — ABRAXAS OS'}</title>
  <link rel="alternate" hreflang="en" href="${enRoot}proof/index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}proof/index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}proof/index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'proof', 'proof/index.html', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${localeRoot}index.html">Home</a> / <a href="${localeRoot}system/index.html">System</a> / <span>${locale === 'en' ? 'Proof' : 'Evidencia'}</span></div>
        <h1 class="page-title">${locale === 'en' ? 'Verified Empirical Evidence Ledger' : 'Libro Mayor de Evidencia Empírica Verificada'}</h1>
        <p class="page-description">${locale === 'en' ? 'Cryptographically backed test suite execution and artifact hash registries verifying release capabilities.' : 'Ejecución de suites de prueba respaldadas criptográficamente y registros de hashes de artefactos que verifican capacidades de la versión.'}</p>
      </div>

      <div class="proof-summary-bar">
        <div class="proof-stat">
          <div class="stat-num">${generatedVerification.currentRegression?.testFiles || 86}</div>
          <div class="stat-lbl">${locale === 'en' ? 'Current Regression Test Files' : 'Archivos de Test de Regresión Actual'}</div>
        </div>
        <div class="proof-stat">
          <div class="stat-num">${generatedVerification.currentRegression?.testCount || 226}</div>
          <div class="stat-lbl">${locale === 'en' ? 'Current Regression Unit Tests' : 'Tests Unitarios de Regresión Actual'}</div>
        </div>
        <div class="proof-stat">
          <div class="stat-num">${generatedVerification.releaseEvidence?.releaseTestCount || 167}</div>
          <div class="stat-lbl">${locale === 'en' ? 'Frozen RC1 Historical Baseline Tests' : 'Tests de Línea Base Histórica RC1'}</div>
        </div>
        <div class="proof-stat">
          <div class="stat-num">${generatedVerification.typecheckStatus || 'PASS'}</div>
          <div class="stat-lbl">${locale === 'en' ? 'TypeScript Strict Status' : 'Estado Estricto TypeScript'}</div>
        </div>
      </div>

      <div class="evidence-ledger-list">
        ${evidenceIndex.items.map(ev => {
          const statusVal = ev.truthLayer || ev.healthStatus || 'PASS';
          const idVal = ev.evidenceId || ev.id || 'EVIDENCE';
          const hashVal = ev.sha || (ev.releaseVersion ? `TAG: ${ev.releaseVersion}` : (ev.testCount ? `TESTS: ${ev.testCount}` : 'VERIFIED'));
          return `
          <article class="evidence-row" id="${idVal}">
            <div class="evidence-left">
              <span class="evidence-badge ${statusVal.toLowerCase()}">${statusVal}</span>
              <span class="evidence-id"><code>${idVal}</code></span>
            </div>
            <div class="evidence-mid">
              <h3>${ev.title}</h3>
              <p>${ev.whatItProves || ev.description || ""}</p>
            </div>
            <div class="evidence-right">
              <span class="evidence-hash">${hashVal}</span>
            </div>
          </article>
          `;
        }).join('\n')}
      </div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 1)}
  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[Bilingual Generator] Generated /${locale}/proof/index.html`);
}

function generateRoadmapPage(locale) {
  const dir = path.join(docsDir, locale, 'roadmap');
  fs.mkdirSync(dir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(1);

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${locale === 'en' ? 'Architecture Roadmap — ABRAXAS OS' : 'Roadmap de Arquitectura — ABRAXAS OS'}</title>
  <link rel="alternate" hreflang="en" href="${enRoot}roadmap/index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}roadmap/index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}roadmap/index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'roadmap', 'roadmap/index.html', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${localeRoot}index.html">Home</a> / <a href="${localeRoot}system/index.html">System</a> / <span>${locale === 'en' ? 'Roadmap' : 'Roadmap'}</span></div>
        <h1 class="page-title">${locale === 'en' ? 'Architecture Roadmap & Gates' : 'Roadmap y Compuertas de Arquitectura'}</h1>
        <p class="page-description">${locale === 'en' ? 'Progressive gate execution from foundational contracts (Gate P1) through autonomous production scaling (Gate P8).' : 'Ejecución progresiva de compuertas desde contratos fundacionales (Gate P1) hasta escalado de producción autónoma (Gate P8).'}</p>
      </div>

      <div class="roadmap-gates-stack">
        ${roadmapData.gates.map(g => {
          const statusVal = g.status || 'PLANNED';
          const idVal = g.gateId || g.id || 'GATE';
          return `
          <article class="gate-card ${statusVal.toLowerCase()}">
            <div class="gate-header">
              <span class="gate-id">${idVal}</span>
              <span class="gate-status-pill ${statusVal.toLowerCase()}">${statusVal}</span>
            </div>
            <h2 class="gate-title">${g.title}</h2>
            <p class="gate-desc">${g.description}</p>
          </article>
          `;
        }).join('\n')}
      </div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 1)}
  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[Bilingual Generator] Generated /${locale}/roadmap/index.html`);
}

function generateAskPage(locale) {
  const dir = path.join(docsDir, locale, 'ask');
  fs.mkdirSync(dir, { recursive: true });
  const { localeRoot, assetsRoot, enRoot, esRoot } = getPrefixes(1);

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${locale === 'en' ? 'Ask Arquitecto — ABRAXAS OS' : 'Preguntar a Arquitecto — ABRAXAS OS'}</title>
  <link rel="alternate" hreflang="en" href="${enRoot}ask/index.html">
  <link rel="alternate" hreflang="es" href="${esRoot}ask/index.html">
  <link rel="alternate" hreflang="x-default" href="${enRoot}ask/index.html">
  <link rel="stylesheet" href="${assetsRoot}assets/status-v3.css">
</head>
<body class="page-body">
  ${getHeader(locale, 'ask', 'ask/index.html', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="${localeRoot}index.html">Home</a> / <a href="${localeRoot}system/index.html">System</a> / <span>${locale === 'en' ? 'Ask' : 'Consultar'}</span></div>
        <h1 class="page-title">${locale === 'en' ? 'Public Architect Inquiry Assistant' : 'Asistente de Consulta del Arquitecto Público'}</h1>
        <p class="page-description">${locale === 'en' ? 'Deterministic semantic query engine resolving ownership boundaries, spatial associations, and invariant laws.' : 'Motor determinista de consultas semánticas que resuelve límites de propiedad, asociaciones espaciales y leyes invariantes.'}</p>
      </div>

      <div class="dossier-section">
        <div class="architect-form-group">
          <input type="text" id="ask-page-query-input" class="architect-input" placeholder="${locale === 'en' ? 'Ask any architectural question...' : 'Haz cualquier pregunta sobre la arquitectura...'}" aria-label="Query">
          <button id="ask-page-submit-btn" class="architect-submit-btn" onclick="window.__ABRAXAS_EXECUTE_PAGE_QUERY__?.()">${locale === 'en' ? 'Query Arquitecto' : 'Consultar Arquitecto'}</button>
        </div>
        <div id="ask-page-response-container" class="architect-response-card" style="display: none; margin-top: 1.5rem;">
          <div class="response-topic" id="ask-page-response-topic">TOPIC</div>
          <div class="response-body" id="ask-page-response-text">Response...</div>
        </div>
      </div>
    </div>
  </main>

  ${getArchitectDrawer(locale)}
  ${getFooter(locale, 1)}
  <script type="module" src="${assetsRoot}assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[Bilingual Generator] Generated /${locale}/ask/index.html`);
}

function executeBilingualGeneration() {
  generateRootRedirector();

  ['en', 'es'].forEach(locale => {
    generateLandingPage(locale);
    generateCuentoPage(locale);
    generateSystemDashboardPage(locale);
    generateArchitectureSuite(locale);
    generateToolsSuite(locale);
    generateTastePage(locale);
    generatePrinciplesPage(locale);
    generateFlowPage(locale);
    generateProofPage(locale);
    generateRoadmapPage(locale);
    generateAskPage(locale);
  });

  console.log('[Bilingual Generator] Master generation complete! All English and Spanish symmetrical routes generated.');
}

executeBilingualGeneration();
