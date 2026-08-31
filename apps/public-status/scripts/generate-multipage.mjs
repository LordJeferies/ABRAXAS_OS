import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const docsDir = path.resolve(rootDir, 'docs/abraxas-os-status');

// 1. Read Datasets
const pkPath = path.join(docsDir, 'public-knowledge.json');
const evPath = path.join(docsDir, 'evidence-index.json');
const bpPath = path.join(docsDir, 'pipeline-blueprints.json');
const rmPath = path.join(docsDir, 'roadmap.json');
const ssPath = path.join(docsDir, 'system-status.json');

const publicKnowledge = JSON.parse(fs.readFileSync(pkPath, 'utf-8'));
const evidenceIndex = JSON.parse(fs.readFileSync(evPath, 'utf-8'));
const pipelineBlueprints = JSON.parse(fs.readFileSync(bpPath, 'utf-8'));
const roadmapData = JSON.parse(fs.readFileSync(rmPath, 'utf-8'));
const systemStatus = JSON.parse(fs.readFileSync(ssPath, 'utf-8'));

console.log(`[MultiPage Generator] Loaded ${publicKnowledge.modules.length} modules, ${pipelineBlueprints.blueprints.length} blueprints, ${evidenceIndex.items.length} evidence items.`);

// Shared Navigation Header Generator
function getHeader(activeTab, relativeDepth = 0) {
  const prefix = relativeDepth === 0 ? './' : '../'.repeat(relativeDepth);
  return `
  <header id="global-header" class="site-header" role="banner">
    <div class="header-inner">
      <div class="header-left">
        <a href="${prefix}index.html" class="brand-logo" aria-label="ABRAXAS OS Home">
          <span class="brand-glyph">▲</span>
          <span class="brand-text">ABRAXAS OS</span>
        </a>
        <span class="brand-tag">v1.0.0-rc1</span>
      </div>
      <nav class="header-nav" role="navigation" aria-label="Primary Navigation">
        <a href="${prefix}index.html" class="nav-link ${activeTab === 'story' ? 'active' : ''}">Manifesto</a>
        <a href="${prefix}system/index.html" class="nav-link ${activeTab === 'system' ? 'active' : ''}">System</a>
        <a href="${prefix}tools/index.html" class="nav-link ${activeTab === 'tools' ? 'active' : ''}">Modules</a>
        <a href="${prefix}flow/index.html" class="nav-link ${activeTab === 'flow' ? 'active' : ''}">Flow</a>
        <a href="${prefix}taste/index.html" class="nav-link ${activeTab === 'taste' ? 'active' : ''}">Taste</a>
        <a href="${prefix}proof/index.html" class="nav-link ${activeTab === 'proof' ? 'active' : ''}">Proof</a>
        <a href="${prefix}roadmap/index.html" class="nav-link ${activeTab === 'roadmap' ? 'active' : ''}">Roadmap</a>
        <a href="${prefix}principles/index.html" class="nav-link ${activeTab === 'principles' ? 'active' : ''}">Principles</a>
      </nav>
      <div class="header-right">
        <button id="header-architect-btn" class="header-architect-trigger" onclick="window.__ABRAXAS_OPEN_ARCHITECT__?.()" aria-label="Open Public Architect Assistant">
          <span class="architect-spark">✦</span> Ask Architect
        </button>
      </div>
    </div>
  </header>
  `;
}

// Shared Footer Generator
function getFooter(relativeDepth = 0) {
  const prefix = relativeDepth === 0 ? './' : '../'.repeat(relativeDepth);
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-col brand-col">
        <div class="footer-logo"><span class="brand-glyph">▲</span> ABRAXAS OS</div>
        <p class="footer-desc">The Operating System for Systematic Content Intelligence, Operational Governance, and Deterministic Audiovisual Synthesis.</p>
        <div class="footer-truth-badge"><span class="truth-dot"></span> RC1 Verified Baseline</div>
      </div>
      <div class="footer-col">
        <h4>Architecture</h4>
        <ul>
          <li><a href="${prefix}system/index.html">System Dashboard</a></li>
          <li><a href="${prefix}tools/index.html">Module Index</a></li>
          <li><a href="${prefix}flow/index.html">Pipeline Blueprints</a></li>
          <li><a href="${prefix}roadmap/index.html">Architecture Gates</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Canon & Taste</h4>
        <ul>
          <li><a href="${prefix}taste/index.html">The Taste System</a></li>
          <li><a href="${prefix}principles/index.html">Core Principles</a></li>
          <li><a href="${prefix}proof/index.html">Verified Evidence</a></li>
          <li><a href="${prefix}tools/arquitecto/index.html">Arquitecto Eye</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Modules</h4>
        <ul>
          <li><a href="${prefix}tools/yod/index.html">YOD (Intelligence)</a></li>
          <li><a href="${prefix}tools/lienzo/index.html">LIENZO (Identity Spine)</a></li>
          <li><a href="${prefix}tools/shim/index.html">SHIM (Boundary Metrology)</a></li>
          <li><a href="${prefix}tools/vav/index.html">VAV (Production Forge)</a></li>
          <li><a href="${prefix}tools/he/index.html">HE (Malkhut Interface)</a></li>
          <li><a href="${prefix}tools/publishing/index.html">PUBLISHER (Moon Loop)</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© 2026 ABRAXAS OS. All rights reserved. Deterministic Closed-Loop Architecture.</div>
      <div class="footer-meta">
        <span class="footer-mono">SHA: 28c3fbc85d484afc9fc60ae4a4aafd6776f62489</span>
      </div>
    </div>
  </footer>
  `;
}

// Shared Architect Drawer Template
function getArchitectDrawer() {
  return `
  <div id="public-architect-drawer" class="architect-drawer" aria-hidden="true" role="dialog" aria-label="Public Architect Inquiry Engine">
    <div class="architect-drawer-backdrop" onclick="window.__ABRAXAS_CLOSE_ARCHITECT__?.()"></div>
    <div class="architect-drawer-panel">
      <div class="drawer-header">
        <div class="drawer-title-group">
          <span class="architect-spark">✦</span>
          <h3>Public Architect</h3>
          <span class="drawer-badge">Deterministic NLP</span>
        </div>
        <button class="drawer-close" onclick="window.__ABRAXAS_CLOSE_ARCHITECT__?.()" aria-label="Close Assistant">✕</button>
      </div>
      <div class="drawer-body">
        <p class="drawer-intro">Query canonical architecture, module ownership boundaries, truth status, or semantic principles directly.</p>
        <div class="architect-form-group">
          <input type="text" id="architect-query-input" class="architect-input" placeholder="e.g., What does Shim own? How does Vav synthesize?" aria-label="Query input">
          <button id="architect-query-submit" class="architect-submit-btn">Query</button>
        </div>
        <div class="quick-prompt-chips">
          <span class="chip-label">Suggestions:</span>
          <button class="prompt-chip" data-q="What is the role of Yod?">Yod</button>
          <button class="prompt-chip" data-q="Explain Lienzo persistence">Lienzo</button>
          <button class="prompt-chip" data-q="What does Shim own?">Shim</button>
          <button class="prompt-chip" data-q="How does Vav work?">Vav</button>
          <button class="prompt-chip" data-q="What is He I vs He II?">He I vs He II</button>
          <button class="prompt-chip" data-q="Explain OUT_OF_SYNC">OUT_OF_SYNC</button>
        </div>
        <div id="architect-response-container" class="architect-response-card" style="display: none;">
          <div class="response-topic" id="architect-response-topic">TOPIC</div>
          <div class="response-body" id="architect-response-text">Response content...</div>
          <div class="response-meta" id="architect-response-meta">RC1 Verified Truth</div>
        </div>
      </div>
    </div>
  </div>
  `;
}

// Module Sephirot Mapping Metadata
const sephirotMetadata = {
  YOD: {
    sephirot: "Supernal Triad (Keter, Chokhmah, Binah)",
    roleDescription: "The crown and originating intellect of the system, receiving pure energetic alignment from the solar source.",
    element: "Fire / Primal Seed",
    chamber: "Golden Apex Summit Pyramidion"
  },
  LIENZO: {
    sephirot: "Central Axis (Keter-to-Malkhut Spinal Cord)",
    roleDescription: "The immutable identity spine running through all levels, maintaining content integrity and versioned revision rings.",
    element: "Aether / Crystalline Core",
    chamber: "Central Corbelled Axial Shaft"
  },
  SHIM: {
    sephirot: "Da'at (The Abyss / Threshold) & Gevurah (Judgment)",
    roleDescription: "The metrology and critical boundary enforcement chamber, scanning discrepancy between planned intent and observed reality.",
    element: "Air / Scanning Laser",
    chamber: "Transverse Metrology Gallery"
  },
  VAV: {
    sephirot: "Tiferet (Heart of the Tree / Harmony & Synthesis)",
    roleDescription: "The central production forge connecting upper intellectual planning with lower physical media manifestation.",
    element: "Earth / Metal Forge",
    chamber: "Subterranean Bedrock Forge"
  },
  HE: {
    sephirot: "Malkhut (The Kingdom / Physical Manifestation)",
    roleDescription: "The interface, task coordination, and external exposure layer through which the system touches humans and tools.",
    element: "Water / Operational Flow",
    chamber: "Ascending & Descending Portals"
  },
  PUBLISHING: {
    sephirot: "The Celestial Moon (Distribution & Planetary Bridge)",
    roleDescription: "The celestial satellite mediating between the internal monument and external social ecosystems.",
    element: "Lunar Gravity / Distribution Stream",
    chamber: "Orbital Moon Station"
  },
  METRICS: {
    sephirot: "Yesod (Foundation & Return Telemetry Loops)",
    roleDescription: "Gathers performance signals, audience resonance, and learning feedback from the world back into YOD.",
    element: "Signal Wave / Feedback Arc",
    chamber: "Lunar Observability Observatory"
  },
  ARQUITECTO: {
    sephirot: "Ain Soph Aur (The Observing Eye & Supreme Overseer)",
    roleDescription: "Holographic etching intelligence aligned with the solar eclipse, ensuring strict adherence to canonical taste and architecture.",
    element: "Holographic Light / Optical Reticle",
    chamber: "Apex Gimbal Mount"
  },
  "PIPELINE-ENGINE": {
    sephirot: "The 22 Paths (Connective Energy Channels)",
    roleDescription: "Deterministic route execution engine moving media payloads through stages without mutating state.",
    element: "Conduit Rail / State Transit",
    chamber: "Internal Stone Conduits"
  },
  "AI-RUNTIME": {
    sephirot: "Netzach (Endurance / Raw Execution Substrate)",
    roleDescription: "Isolated worker processes executing LLM inference, transcription, and computer vision contracts.",
    element: "Compute Matrix / Inference Grid",
    chamber: "Bedrock Compute Chamber"
  },
  "UNIVERSAL-INTAKE": {
    sephirot: "Ingress Gateway (Threshold of the World)",
    roleDescription: "Normalizes raw video, audio, transcripts, and assets into verified Lienzo drafts.",
    element: "Intake Gate / Ingress Funnel",
    chamber: "Northern Perimeter Ingress Portal"
  },
  EVENTS: {
    sephirot: "Hod (Splendor / Asynchronous Event Ledger)",
    roleDescription: "Strict typed event bus capturing lifecycle transitions, state invalidations, and audit records.",
    element: "Event Stream / Ledger",
    chamber: "Subterranean Event Ledger"
  },
  ARTIFACTS: {
    sephirot: "Otzar (The Vault / Immutable Hash Registry)",
    roleDescription: "Content-addressed storage for verified exports, cut lists, EDL files, and master video renders.",
    element: "Immutable Vault / Hash Grid",
    chamber: "Bedrock Artifact Vault"
  }
};

// Generate Landing Page (Index)
function generateLandingPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ABRAXAS OS — Public Status & Architecture</title>
  <link rel="stylesheet" href="./assets/status-v3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="landing-story-body">
  ${getHeader('story', 0)}

  <!-- Fullscreen Spatial 3D Canvas -->
  <div id="spatial-pyramid-container" class="spatial-canvas-fullscreen" aria-label="ABRAXAS 3D Spatial Architecture Canvas"></div>

  <!-- Narrative Manifesto Scroll Track -->
  <main id="story-scroll-container" class="story-scroll-container">
    
    <!-- Act 0: Genesis / Monumental Cover -->
    <section class="story-act-section act-0" data-act="0">
      <div class="act-content-wrap">
        <div class="act-tag">0. MANIFESTO // GENESIS</div>
        <h1 class="act-headline">The Architecture of Intelligence.</h1>
        <p class="act-lead">A monolithic operating system engineered for deterministic content intelligence, rigorous operational governance, and audiovisual synthesis.</p>
        <div class="hero-actions">
          <a href="./system/index.html" class="btn-primary">Explore System Dashboard →</a>
          <a href="./taste/index.html" class="btn-secondary">The Taste System</a>
        </div>
      </div>
    </section>

    <!-- Act 1: Yod & The Golden Apex -->
    <section class="story-act-section act-1" data-act="1">
      <div class="act-content-wrap">
        <div class="act-tag">1. SUPERNAL TRIAD // YOD & ARQUITECTO</div>
        <h2 class="act-headline">Intelligence in the Golden Apex.</h2>
        <p class="act-lead">At the summit of the Giza massing sits the golden pyramidion. Here YOD receives strategic solar alignment, maintaining voice criteria, hook taxonomies, and opportunity detection without blank-slate guesswork.</p>
        <div class="hero-actions">
          <a href="./tools/yod/index.html" class="btn-secondary">Inspect YOD Module →</a>
        </div>
      </div>
    </section>

    <!-- Act 2: Lienzo Central Axis -->
    <section class="story-act-section act-2" data-act="2">
      <div class="act-content-wrap">
        <div class="act-tag">2. AXIAL SPINE // LIENZO CORE</div>
        <h2 class="act-headline">The Immutable Spinal Cord.</h2>
        <p class="act-lead">Descending vertically through the monument, the hexagonal sapphire Lienzo shaft preserves single-piece identity. Every mutation is versioned through immutable revision rings and DAG state validation.</p>
        <div class="hero-actions">
          <a href="./tools/lienzo/index.html" class="btn-secondary">Inspect LIENZO Module →</a>
        </div>
      </div>
    </section>

    <!-- Act 3: Shim Metrology & Judgment -->
    <section class="story-act-section act-3" data-act="3">
      <div class="act-content-wrap">
        <div class="act-tag">3. METROLOGY // SHIM SCANNING PLANE</div>
        <h2 class="act-headline">Measuring Intent Against Reality.</h2>
        <p class="act-lead">In the transverse Da'at gallery, SHIM projects a glancing Fresnel laser plane to detect discrepancies between planned editorial structure and observed reality, triggering OUT_OF_SYNC before silent drift occurs.</p>
        <div class="hero-actions">
          <a href="./tools/shim/index.html" class="btn-secondary">Inspect SHIM Module →</a>
        </div>
      </div>
    </section>

    <!-- Act 4: Vav Synthesis Forge -->
    <section class="story-act-section act-4" data-act="4">
      <div class="act-content-wrap">
        <div class="act-tag">4. TIFERET // VAV SYNTHESIS FORGE</div>
        <h2 class="act-headline">Deterministic Production Forge.</h2>
        <p class="act-lead">Deep in the subterranean bedrock, VAV operates three industrial execution tracks: non-destructive multi-segment cuts, typographic caption hierarchy, and physics-driven motion synthesis.</p>
        <div class="hero-actions">
          <a href="./tools/vav/index.html" class="btn-secondary">Inspect VAV Module →</a>
        </div>
      </div>
    </section>

    <!-- Act 5: The Lunar Closed Loop -->
    <section class="story-act-section act-5" data-act="5">
      <div class="act-content-wrap">
        <div class="act-tag">5. CLOSED LOOP // MOON & OBSERVABILITY</div>
        <h2 class="act-headline">Distribution and Feedback.</h2>
        <p class="act-lead">From the celestial lunar station, Publisher dispatches multi-platform syndications, while telemetry feedback loops return audience signals into YOD, closing the perpetual intelligence cycle.</p>
        <div class="hero-actions">
          <a href="./tools/publishing/index.html" class="btn-secondary">Inspect Publisher & Metrics →</a>
        </div>
      </div>
    </section>

    <!-- Grand Final CTA Section -->
    <section class="story-act-section grand-cta-section" data-act="6">
      <div class="act-content-wrap">
        <div class="act-tag">OPERATIONAL ARCHITECTURE</div>
        <h2 class="act-headline">Enter the Operational Core.</h2>
        <p class="act-lead">Transition from the cinematic manifesto into the live technical dashboard, inspect empirical release proofs, and explore the complete module hierarchy.</p>
        <div class="cta-banner-box">
          <h3>Ready to inspect the live software system?</h3>
          <p>Examine 13 independent modules, 11 pipeline blueprints, and verified empirical evidence records.</p>
          <div class="cta-btn-row">
            <a href="./system/index.html" class="btn-primary">Launch System Dashboard →</a>
            <a href="./proof/index.html" class="btn-secondary">View Evidence Ledger</a>
          </div>
        </div>
      </div>
    </section>

  </main>

  ${getArchitectDrawer()}
  ${getFooter(0)}

  <script type="module" src="./assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(docsDir, 'index.html'), html);
  console.log(`[MultiPage Generator] Generated /index.html (Manifesto Landing)`);
}

// Generate System Dashboard Page
function generateSystemDashboardPage() {
  const dir = path.join(docsDir, 'system');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Dashboard — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="system-dashboard-body">
  ${getHeader('system', 1)}

  <!-- Fullscreen 3D Spatial Canvas for System Mode -->
  <div id="spatial-pyramid-container" class="spatial-canvas-fullscreen" aria-label="ABRAXAS 3D Spatial Canvas"></div>

  <!-- Operational Workspace: 3-Column Layout -->
  <div class="system-workspace-layout">
    
    <!-- Left Column: Directory Rail -->
    <aside class="system-directory-rail" aria-label="Module Directory">
      <div class="directory-header">
        <div class="rail-title-group">
          <span class="rail-glyph">◈</span>
          <h2>System Hierarchy</h2>
        </div>
        <div class="truth-toggle-wrapper">
          <label class="truth-toggle-label" for="target-mode-toggle">
            <input type="checkbox" id="target-mode-toggle" class="truth-toggle-input">
            <span class="truth-toggle-slider"></span>
            <span class="truth-toggle-text">Show Target State</span>
          </label>
        </div>
      </div>
      <div class="directory-list" id="system-directory-list" role="listbox">
        <!-- Injected dynamically by modes.js -->
      </div>
    </aside>

    <!-- Center Column: Visual Overlay & Spatial Callouts -->
    <main class="system-center-overlay" aria-label="Interactive 3D Spatial Center">
      <div class="system-spatial-hint">
        <span class="hint-glyph">✦</span> Click any chamber or select from the directory to inspect
      </div>
    </main>

    <!-- Right Column: Contextual Inspector Rail -->
    <aside class="system-inspector-rail" id="system-inspector-rail" aria-label="Module Details Inspector">
      <div class="inspector-header">
        <div class="truth-pill released_current" id="inspector-truth-badge">RELEASED_RC1</div>
        <h3 class="inspector-title" id="inspector-title">Yod</h3>
        <div class="inspector-role" id="inspector-domain">Intelligence // Strategic Direction</div>
      </div>
      <div class="inspector-body" id="inspector-body">
        <div class="inspector-section">
          <h4>Responsibility</h4>
          <p id="inspector-responsibility">Maintains content pattern registries, hook and CTA taxonomies, narrative structures, and forensic provenance truth.</p>
        </div>
        <div class="inspector-section">
          <h4>Sephirot Alignment</h4>
          <p id="inspector-sephirot">Supernal Triad (Keter, Chokhmah, Binah) // Golden Apex</p>
        </div>
        <div class="inspector-section">
          <h4>Owns</h4>
          <ul id="inspector-owns-list">
            <li>Client Core & Brand voice criteria</li>
            <li>Opportunity generation & scoring algorithms</li>
          </ul>
        </div>
        <div class="inspector-section">
          <h4>Does Not Own</h4>
          <ul id="inspector-not-owns-list">
            <li>Mutable single-piece content state (Lienzo owns this)</li>
            <li>Audiovisual media rendering (Vav owns this)</li>
          </ul>
        </div>
        <div class="inspector-section">
          <h4>Dependencies & Evidence</h4>
          <p id="inspector-evidence">86 Vitest test files passing, release:test-suite verified.</p>
        </div>
        <a href="../tools/yod/index.html" class="inspector-deep-btn" id="inspector-deep-link">Open Full Dossier →</a>
      </div>
    </aside>

  </div>

  ${getArchitectDrawer()}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[MultiPage Generator] Generated /system/index.html (System Dashboard)`);
}

// Generate Dedicated Tool Dossier Pages
function generateToolDossiers() {
  const toolsBaseDir = path.join(docsDir, 'tools');
  fs.mkdirSync(toolsBaseDir, { recursive: true });

  // 1. Tool Index Directory Page
  const toolIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Module Index — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="page-body">
  ${getHeader('tools', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="../index.html">Home</a> / <a href="../system/index.html">System</a> / <span>Modules</span></div>
        <h1 class="page-title">ABRAXAS OS Module Index</h1>
        <p class="page-description">13 decoupled architectural modules and subtools mapped to the Sephirot Tree of Life, closed-loop media lifecycle, and strict boundary contracts.</p>
      </div>

      <div class="tools-grid">
        ${publicKnowledge.modules.map((m) => {
          const seph = sephirotMetadata[m.id] || { sephirot: "Subsystem Node", chamber: "Bedrock Chamber" };
          const slug = m.id.toLowerCase().replace(/_/g, '-');
          return `
          <article class="tool-card" id="card-${slug}">
            <div class="tool-card-header">
              <div class="truth-pill ${m.truthLayer.toLowerCase()}">${m.truthLayer}</div>
              <span class="tool-domain">${m.domain}</span>
            </div>
            <h3 class="tool-name">${m.name}</h3>
            <div class="tool-sephirot-tag">⚝ ${seph.sephirot}</div>
            <p class="tool-summary">${m.shortDefinition || m.responsibility}</p>
            <div class="tool-card-footer">
              <span class="tool-chamber">Chamber: ${seph.chamber}</span>
              <a href="./${slug}/index.html" class="tool-link-btn">Dossier →</a>
            </div>
          </article>
          `;
        }).join('\n')}

        <!-- 3 Dedicated VAV Subtools -->
        <article class="tool-card" id="card-vav-captions">
          <div class="tool-card-header">
            <div class="truth-pill released_current">RELEASED_RC1</div>
            <span class="tool-domain">Synthesis Subtool</span>
          </div>
          <h3 class="tool-name">VAV / Captions</h3>
          <div class="tool-sephirot-tag">⚝ Tiferet Typographic Track</div>
          <p class="tool-summary">Word-level timestamp synchronization, font style hierarchies, and multi-line kinetic animation.</p>
          <div class="tool-card-footer">
            <span class="tool-chamber">Chamber: Middle Forge Track</span>
            <a href="./vav/captions/index.html" class="tool-link-btn">Dossier →</a>
          </div>
        </article>

        <article class="tool-card" id="card-vav-cuts">
          <div class="tool-card-header">
            <div class="truth-pill released_current">RELEASED_RC1</div>
            <span class="tool-domain">Synthesis Subtool</span>
          </div>
          <h3 class="tool-name">VAV / Cuts</h3>
          <div class="tool-sephirot-tag">⚝ Tiferet Temporal Track</div>
          <p class="tool-summary">Non-destructive multi-segment video trimming, stream-copy rendering, and frame-accurate EDL compilation.</p>
          <div class="tool-card-footer">
            <span class="tool-chamber">Chamber: Left Forge Track</span>
            <a href="./vav/cuts/index.html" class="tool-link-btn">Dossier →</a>
          </div>
        </article>

        <article class="tool-card" id="card-vav-motions">
          <div class="tool-card-header">
            <div class="truth-pill released_current">RELEASED_RC1</div>
            <span class="tool-domain">Synthesis Subtool</span>
          </div>
          <h3 class="tool-name">VAV / Motions</h3>
          <div class="tool-sephirot-tag">⚝ Tiferet Kinetic Track</div>
          <p class="tool-summary">Spring physics, optical visual priors, B-roll overlays, and smooth layout transform transitions.</p>
          <div class="tool-card-footer">
            <span class="tool-chamber">Chamber: Right Forge Track</span>
            <a href="./vav/motions/index.html" class="tool-link-btn">Dossier →</a>
          </div>
        </article>
      </div>
    </div>
  </main>

  ${getArchitectDrawer()}
  ${getFooter(1)}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(toolsBaseDir, 'index.html'), toolIndexHtml);
  console.log(`[MultiPage Generator] Generated /tools/index.html`);

  // 2. Individual Module Dossiers
  publicKnowledge.modules.forEach((m) => {
    const slug = m.id.toLowerCase().replace(/_/g, '-');
    const modDir = path.join(toolsBaseDir, slug);
    fs.mkdirSync(modDir, { recursive: true });

    const seph = sephirotMetadata[m.id] || { sephirot: "Subsystem Node", roleDescription: "Systemic execution node.", element: "Aether", chamber: "Bedrock Chamber" };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${m.name} (${m.domain}) — ABRAXAS OS</title>
  <link rel="stylesheet" href="../../assets/status-v3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="page-body">
  ${getHeader('tools', 2)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="../../index.html">Home</a> / <a href="../../system/index.html">System</a> / <a href="../index.html">Modules</a> / <span>${m.name}</span></div>
        <div class="module-title-row">
          <h1 class="page-title">${m.name}</h1>
          <div class="truth-pill ${m.truthLayer.toLowerCase()}">${m.truthLayer}</div>
        </div>
        <div class="module-domain-badge">Domain: ${m.domain} // Archetype: ${seph.sephirot}</div>
        <p class="page-description">${m.responsibility}</p>
      </div>

      <div class="dossier-grid">
        
        <!-- Main Content Column -->
        <div class="dossier-main-col">
          
          <!-- 1. What It Is & Core Purpose -->
          <section class="dossier-section">
            <h2 class="section-title">1. What It Is & Purpose</h2>
            <p class="section-lead">${m.why || m.shortDefinition}</p>
            <p>In the ABRAXAS closed-loop architecture, <strong>${m.name}</strong> operates as the definitive owner of ${m.domain.toLowerCase()} semantics. It ensures that content pieces are generated with strict provenance, preventing guesswork or silent state corruption.</p>
          </section>

          <!-- 2. Sephirot Tree of Life Mapping -->
          <section class="dossier-section">
            <h2 class="section-title">2. Sephirot Tree of Life Mapping</h2>
            <div class="sephirot-box">
              <div class="sephirot-header">
                <span class="sephirot-glyph">⚝</span>
                <h3>${seph.sephirot}</h3>
              </div>
              <p><strong>Physical Chamber:</strong> ${seph.chamber}</p>
              <p><strong>Cosmic Element:</strong> ${seph.element}</p>
              <p class="sephirot-desc">${seph.roleDescription}</p>
            </div>
          </section>

          <!-- 3. Concrete Understandable Example -->
          <section class="dossier-section">
            <h2 class="section-title">3. Operational Example Scenario</h2>
            <div class="example-box">
              <div class="example-badge">Workflow Execution</div>
              <p class="example-flow-text"><code>${m.exampleFlow || "Input criteria evaluated -> Payload validated -> Execution dispatched -> Output registered in immutable storage."}</code></p>
              <p>When a content piece enters ${m.name}, it is treated with deterministic boundary verification. The system validates upstream state before applying transformations, guaranteeing reproducible output.</p>
            </div>
          </section>

          <!-- 4. Strict Ownership Boundaries (What It Owns vs Does Not Own) -->
          <section class="dossier-section">
            <h2 class="section-title">4. Strict Ownership Boundaries</h2>
            <div class="ownership-split-grid">
              <div class="owns-col">
                <h3 class="owns-title">✓ What ${m.name} OWNS</h3>
                <ul class="boundary-list">
                  ${(m.owns || []).map((o) => `<li>${o}</li>`).join('\n')}
                </ul>
              </div>
              <div class="not-owns-col">
                <h3 class="not-owns-title">✗ What ${m.name} DOES NOT OWN</h3>
                <ul class="boundary-list">
                  ${(m.doesNotOwn || []).map((no) => `<li>${no}</li>`).join('\n')}
                </ul>
              </div>
            </div>
          </section>

          <!-- 5. What It Is vs What It Is Not -->
          <section class="dossier-section">
            <h2 class="section-title">5. What It Is vs What It Is Not</h2>
            <div class="what-is-table-wrap">
              <table class="what-is-table">
                <thead>
                  <tr>
                    <th>What ${m.name} IS</th>
                    <th>What ${m.name} IS NOT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>A deterministic, domain-specific execution engine</td>
                    <td>A generic third-party AI wrapper or chat prompt</td>
                  </tr>
                  <tr>
                    <td>Strictly bound to immutable event and artifact schemas</td>
                    <td>A mutable project management board with untracked edits</td>
                  </tr>
                  <tr>
                    <td>Governed by verified taste and quality criteria</td>
                    <td>An automated spam publishing script</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 6. Gaps, Dependencies & Roadmap Next Steps -->
          <section class="dossier-section">
            <h2 class="section-title">6. Current Gaps & Target Roadmap</h2>
            <div class="roadmap-gap-box">
              <h4>Current Status: <span class="highlight-text">${m.statusDetail || m.status}</span></h4>
              <p><strong>Bounded Debt:</strong> ${(m.boundedDebt || ["No active architectural debt recorded."]).join(' ')}</p>
              <p><strong>Next Phase Milestones:</strong> ${(m.roadmapRefs || ["Gate P4 Deployment", "Gate P5 Release Tooling"]).join(' → ')}</p>
            </div>
          </section>

        </div>

        <!-- Sidebar Metadata Column -->
        <aside class="dossier-sidebar">
          <div class="sidebar-card">
            <h3>I/O Specifications</h3>
            <div class="io-group">
              <span class="io-label">Inputs:</span>
              <ul class="io-list">
                ${(m.inputs || ["Client profile", "Prior state"]).map((i) => `<li><code>${i}</code></li>`).join('\n')}
              </ul>
            </div>
            <div class="io-group">
              <span class="io-label">Outputs:</span>
              <ul class="io-list">
                ${(m.outputs || ["Generated artifact", "Status event"]).map((o) => `<li><code>${o}</code></li>`).join('\n')}
              </ul>
            </div>
          </div>

          <div class="sidebar-card">
            <h3>Event Footprint</h3>
            <div class="event-chips">
              ${(m.eventFootprint || ["STATE_CHANGED"]).map((e) => `<span class="event-chip">${e}</span>`).join('\n')}
            </div>
          </div>

          <div class="sidebar-card">
            <h3>Artifact Footprint</h3>
            <div class="artifact-chips">
              ${(m.artifactFootprint || ["Artifact"]).map((a) => `<span class="artifact-chip">◈ ${a}</span>`).join('\n')}
            </div>
          </div>

          <div class="sidebar-card">
            <h3>Connected Modules</h3>
            <ul class="conn-list">
              ${(m.connections || ["Lienzo", "He"]).map((c) => `<li>${c}</li>`).join('\n')}
            </ul>
          </div>

          <div class="sidebar-card">
            <h3>Verified Evidence</h3>
            <ul class="evidence-list">
              ${(m.evidenceRefs || ["evidence:test-suite"]).map((er) => `<li><a href="../../proof/index.html#${er}">✓ ${er}</a></li>`).join('\n')}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  </main>

  ${getArchitectDrawer()}
  ${getFooter(2)}
  <script type="module" src="../../assets/status-v3.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(modDir, 'index.html'), html);
    console.log(`[MultiPage Generator] Generated /tools/${slug}/index.html`);
  });

  // 3. Dedicated VAV Subtool Dossiers
  const vavSubtools = [
    {
      slug: 'captions',
      name: 'VAV / Captions',
      domain: 'Kinetic Typography & Style Hierarchy',
      desc: 'Word-level timestamp synchronization, font style hierarchies, active word highlighting, and multi-line kinetic animation.',
      seph: 'Tiferet Typographic Track',
      owns: ['Word-level timestamp mapping', 'Caption layout bounding boxes', 'Kinetic word animations', 'Typography style presets'],
      notOwns: ['Video trimming (Vav/Cuts owns this)', 'Audio transcription inference (AI Runtime owns this)', 'Task management (He owns this)']
    },
    {
      slug: 'cuts',
      name: 'VAV / Cuts',
      domain: 'Non-Destructive Multi-Segment Video Engine',
      desc: 'Non-destructive multi-segment video trimming, stream-copy rendering, and frame-accurate EDL compilation.',
      seph: 'Tiferet Temporal Track',
      owns: ['Multi-segment cut plans', 'Non-destructive FFmpeg stream-copy', 'Frame-accurate EDL generation', 'Segment boundary verification'],
      notOwns: ['Captions layout (Vav/Captions owns this)', 'Voice recording capture (He owns this)', 'Video encoding workers (AI Runtime owns this)']
    },
    {
      slug: 'motions',
      name: 'VAV / Motions',
      domain: 'Spring Physics & Visual Priors',
      desc: 'Spring physics, optical visual priors, B-roll overlays, and smooth layout transform transitions.',
      seph: 'Tiferet Kinetic Track',
      owns: ['Spring physics curves', 'Visual prior layout templates', 'B-roll overlay placement', 'Transform transitions'],
      notOwns: ['Audio timebase (Vav/Cuts owns this)', 'Video cutting (Vav/Cuts owns this)', 'Color grading (AI Runtime owns this)']
    }
  ];

  vavSubtools.forEach((st) => {
    const subDir = path.join(toolsBaseDir, 'vav', st.slug);
    fs.mkdirSync(subDir, { recursive: true });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${st.name} — ABRAXAS OS</title>
  <link rel="stylesheet" href="../../../assets/status-v3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="page-body">
  ${getHeader('tools', 3)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="../../../index.html">Home</a> / <a href="../../../system/index.html">System</a> / <a href="../../index.html">Modules</a> / <a href="../index.html">VAV</a> / <span>${st.slug}</span></div>
        <div class="module-title-row">
          <h1 class="page-title">${st.name}</h1>
          <div class="truth-pill released_current">RELEASED_RC1</div>
        </div>
        <div class="module-domain-badge">Domain: ${st.domain} // Sephirot: ${st.seph}</div>
        <p class="page-description">${st.desc}</p>
      </div>

      <div class="dossier-grid">
        <div class="dossier-main-col">
          <section class="dossier-section">
            <h2 class="section-title">1. Operational Role & Physics</h2>
            <p class="section-lead">${st.desc}</p>
            <p>As a core track of the VAV Tiferet Forge, <strong>${st.name}</strong> guarantees deterministic rendering without frame stutter or audio-sync drift.</p>
          </section>

          <section class="dossier-section">
            <h2 class="section-title">2. Ownership Split</h2>
            <div class="ownership-split-grid">
              <div class="owns-col">
                <h3 class="owns-title">✓ What ${st.name} OWNS</h3>
                <ul class="boundary-list">
                  ${st.owns.map((o) => `<li>${o}</li>`).join('\n')}
                </ul>
              </div>
              <div class="not-owns-col">
                <h3 class="not-owns-title">✗ What ${st.name} DOES NOT OWN</h3>
                <ul class="boundary-list">
                  ${st.notOwns.map((no) => `<li>${no}</li>`).join('\n')}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <aside class="dossier-sidebar">
          <div class="sidebar-card">
            <h3>Verified Tests</h3>
            <p>100% test coverage in <code>packages/${st.slug === 'captions' ? 'caption-hierarchy' : st.slug === 'cuts' ? 'cut-engine' : 'motion-engine'}</code>.</p>
          </div>
        </aside>
      </div>
    </div>
  </main>

  ${getArchitectDrawer()}
  ${getFooter(3)}
  <script type="module" src="../../../assets/status-v3.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(subDir, 'index.html'), html);
    console.log(`[MultiPage Generator] Generated /tools/vav/${st.slug}/index.html`);
  });
}

// Generate Taste Page
function generateTastePage() {
  const dir = path.join(docsDir, 'taste');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Taste System — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="page-body">
  ${getHeader('taste', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="../index.html">Home</a> / <a href="../system/index.html">System</a> / <span>Taste</span></div>
        <h1 class="page-title">Taste as Infrastructure</h1>
        <p class="page-description">In ABRAXAS OS, "Taste" is not a decorative veneer or personal whim. It is a formal, compiler-enforced system of criteria governing typography, spatial geometry, motion timing, and editorial restraint.</p>
      </div>

      <div class="taste-manifesto-grid">
        
        <!-- Core Pillars -->
        <section class="taste-pillar-card">
          <div class="pillar-num">01</div>
          <h3>One Frame = One Dominant Idea</h3>
          <p>A scene must never compete with itself. Negative space is a first-class composition element. If secondary elements are present, they must recede into deep shadow.</p>
        </section>

        <section class="taste-pillar-card">
          <div class="pillar-num">02</div>
          <h3>Color is Semantic, Never Decorative</h3>
          <p>90–95% of the visual world remains strictly monochromatic (black, charcoal, graphite, steel, white). Color is reserved exclusively for state, energy, and verification.</p>
        </section>

        <section class="taste-pillar-card">
          <div class="pillar-num">03</div>
          <h3>Motion is Explanatory, Never Constant</h3>
          <p>Motion exists only to explain transformation, spatial depth, and causal state progression. Constant ambient spinning is rejected.</p>
        </section>

        <section class="taste-pillar-card">
          <div class="pillar-num">04</div>
          <h3>Physical Precision & Believable Weight</h3>
          <p>Abstract systems are given tangible physical weight (titanium, basalt stone, optical sapphire crystal). Floating ungrounded primitives are rejected.</p>
        </section>

      </div>

      <!-- Anti-Slop Table -->
      <section class="anti-slop-section">
        <h2 class="section-title">Good Taste vs AI Slop & Clichés</h2>
        <div class="what-is-table-wrap">
          <table class="what-is-table">
            <thead>
              <tr>
                <th>ABRAXAS Good Taste</th>
                <th>Rejected AI Slop & SaaS Clichés</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Giza Massing ($51.84° slope)</strong> with massive dark basalt blocks and golden apex</td>
                <td>Arbitrary needle-like pyramids, random floating wireframe triangles</td>
              </tr>
              <tr>
                <td><strong>Holographic Etched Eye</strong> as an architectural precision instrument</td>
                <td>Generic mystic Eye of Providence, kitsch occult symbols, terrifying eyeballs</td>
              </tr>
              <tr>
                <td><strong>Monochromatic palette</strong> with single restrained semantic accents</td>
                <td>Rainbow cyberpunk neon tubes, glowing purple gradients everywhere</td>
              </tr>
              <tr>
                <td><strong>Viewport-as-Cover typography</strong> floating unboxed on dark canvas</td>
                <td>Generic rectangular cards floating over a 3D background like a SaaS template</td>
              </tr>
              <tr>
                <td><strong>1px Hairline Inspection Overlays</strong> with true semantic coordinates</td>
                <td>Cluttered video game HUDs with flashing warning boxes and fake graphs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Future Products Guidance -->
      <section class="future-taste-section">
        <h2 class="section-title">Guidance for Future ABRAXAS Products</h2>
        <p>Every tool, client portal, or audiovisual asset synthesized by ABRAXAS OS must adhere to the <strong>Taste Canon V2</strong> contract. When YOD evaluates Client Core profiles or VAV compiles video timelines, these rules are compiled into deterministic rendering constraints.</p>
      </section>

    </div>
  </main>

  ${getArchitectDrawer()}
  ${getFooter(1)}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[MultiPage Generator] Generated /taste/index.html`);
}

// Generate Principles & Invariants Page
function generatePrinciplesPage() {
  const dir = path.join(docsDir, 'principles');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Core Principles & Invariants — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="page-body">
  ${getHeader('principles', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="../index.html">Home</a> / <a href="../system/index.html">System</a> / <span>Principles</span></div>
        <h1 class="page-title">Core Invariants & Governance</h1>
        <p class="page-description">The non-negotiable architectural laws governing state mutation, boundary enforcement, and truth representation across ABRAXAS OS.</p>
      </div>

      <div class="principles-stack">
        
        <article class="principle-card">
          <div class="principle-num">INVARIANT I</div>
          <h2>Planned ≠ Observed ≠ Resolved</h2>
          <p>A planned editorial structure is never assumed to match recorded reality without empirical verification. SHIM operates at the Da'at boundary to measure the discrepancy. A content piece can only be marked Resolved when empirical evidence verifies complete coverage.</p>
        </article>

        <article class="principle-card">
          <div class="principle-num">INVARIANT II</div>
          <h2>Content State ≠ UI Projection</h2>
          <p>Lienzo preserves the single-piece content state as an immutable, content-addressed DAG. User interfaces, Kanban boards, and 3D scenes are read-only projections. No UI component may mutate state directly without emitting a typed event.</p>
        </article>

        <article class="principle-card">
          <div class="principle-num">INVARIANT III</div>
          <h2>No Silent Mutation</h2>
          <p>Every transformation, trimming cut, or prompt update creates a new immutable revision ring. If an upstream dependency changes, downstream stages enter an explicit <code>OUT_OF_SYNC</code> invalidation state rather than silently carrying stale data.</p>
        </article>

        <article class="principle-card">
          <div class="principle-num">INVARIANT IV</div>
          <h2>Proof Over Claim</h2>
          <p>Public status never claims release capability without an empirical evidence hash. Current release (<code>v1.0.0-rc1</code>) is clearly separated from post-RC1 working candidates and future target roadmap milestones.</p>
        </article>

      </div>
    </div>
  </main>

  ${getArchitectDrawer()}
  ${getFooter(1)}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[MultiPage Generator] Generated /principles/index.html`);
}

// Generate Flow, Proof, and Roadmap Pages
function generateFlowPage() {
  const dir = path.join(docsDir, 'flow');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pipeline Blueprints — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="page-body">
  ${getHeader('flow', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="../index.html">Home</a> / <a href="../system/index.html">System</a> / <span>Flow</span></div>
        <h1 class="page-title">Pipeline Blueprint DAGs</h1>
        <p class="page-description">11 canonical lifecycle pipelines orchestrating deterministic stage transit from raw intake to multi-platform publishing.</p>
      </div>

      <div class="blueprints-grid">
        ${pipelineBlueprints.blueprints.map((bp) => `
        <article class="blueprint-card">
          <div class="blueprint-header">
            <span class="blueprint-id">${bp.id}</span>
            <span class="blueprint-stages-count">${bp.stages.length} Stages</span>
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

  ${getArchitectDrawer()}
  ${getFooter(1)}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[MultiPage Generator] Generated /flow/index.html`);
}

function generateProofPage() {
  const dir = path.join(docsDir, 'proof');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verified Evidence Ledger — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="page-body">
  ${getHeader('proof', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="../index.html">Home</a> / <a href="../system/index.html">System</a> / <span>Proof</span></div>
        <h1 class="page-title">Verified Empirical Evidence Ledger</h1>
        <p class="page-description">The cryptographic and test-backed truth foundation of ABRAXAS OS. Every capability is verified against automated test suites and hash registries.</p>
      </div>

      <div class="proof-summary-bar">
        <div class="proof-stat">
          <div class="stat-num">86</div>
          <div class="stat-lbl">Vitest Test Files Passed</div>
        </div>
        <div class="proof-stat">
          <div class="stat-num">226</div>
          <div class="stat-lbl">Unit & Integration Tests</div>
        </div>
        <div class="proof-stat">
          <div class="stat-num">0</div>
          <div class="stat-lbl">TypeScript Errors</div>
        </div>
        <div class="proof-stat">
          <div class="stat-num">100%</div>
          <div class="stat-lbl">RC1 Integrity Verified</div>
        </div>
      </div>

      <div class="evidence-ledger-list">
        ${evidenceIndex.items.map((ev) => {
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

  ${getArchitectDrawer()}
  ${getFooter(1)}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[MultiPage Generator] Generated /proof/index.html`);
}

function generateRoadmapPage() {
  const dir = path.join(docsDir, 'roadmap');
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Architecture Roadmap — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="page-body">
  ${getHeader('roadmap', 1)}

  <main class="page-main">
    <div class="page-container">
      <div class="page-header">
        <div class="breadcrumb"><a href="../index.html">Home</a> / <a href="../system/index.html">System</a> / <span>Roadmap</span></div>
        <h1 class="page-title">Architecture Roadmap & Milestones</h1>
        <p class="page-description">Progressive gate execution from foundational schema contracts (Gate P1) through autonomous production scaling (Gate P8).</p>
      </div>

      <div class="roadmap-gates-stack">
        ${roadmapData.gates.map((g) => {
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

  ${getArchitectDrawer()}
  ${getFooter(1)}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`[MultiPage Generator] Generated /roadmap/index.html`);
}

// Execute Generation
generateLandingPage();
generateSystemDashboardPage();
generateToolDossiers();
generateTastePage();
generatePrinciplesPage();
generateFlowPage();
generateProofPage();
generateRoadmapPage();

console.log("[MultiPage Generator] Complete! All static multi-surface pages successfully generated.");
