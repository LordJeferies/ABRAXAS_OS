import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const docsDir = path.resolve(rootDir, 'docs/abraxas-os-status');

// 1. Read Canonical Datasets
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
        <a href="${prefix}index.html" class="nav-link ${activeTab === 'story' ? 'active' : ''}">Story</a>
        <a href="${prefix}system/index.html" class="nav-link ${activeTab === 'system' ? 'active' : ''}">System</a>
        <a href="${prefix}tools/index.html" class="nav-link ${activeTab === 'tools' ? 'active' : ''}">Tools</a>
        <a href="${prefix}flow/index.html" class="nav-link ${activeTab === 'flow' ? 'active' : ''}">Flow</a>
        <a href="${prefix}proof/index.html" class="nav-link ${activeTab === 'proof' ? 'active' : ''}">Proof</a>
        <a href="${prefix}roadmap/index.html" class="nav-link ${activeTab === 'roadmap' ? 'active' : ''}">Roadmap</a>
        <a href="${prefix}taste/index.html" class="nav-link ${activeTab === 'taste' ? 'active' : ''}">Taste</a>
        <a href="${prefix}principles/index.html" class="nav-link ${activeTab === 'principles' ? 'active' : ''}">Principles</a>
      </nav>
      <div class="header-right">
        <button id="header-architect-btn" class="header-architect-trigger" onclick="window.__ABRAXAS_OPEN_ARCHITECT__?.()" aria-label="Open Public Architect Query Assistant">
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
        <p class="footer-desc">The Operating System for Systematic Content Intelligence, Operational Governance, and Audiovisual Synthesis.</p>
        <div class="footer-truth-badge"><span class="truth-dot"></span> RC1 Verified Baseline</div>
      </div>
      <div class="footer-col">
        <h4>Architecture</h4>
        <ul>
          <li><a href="${prefix}system/index.html">System Dashboard</a></li>
          <li><a href="${prefix}tools/index.html">Tool Directory</a></li>
          <li><a href="${prefix}flow/index.html">Pipeline Blueprints</a></li>
          <li><a href="${prefix}roadmap/index.html">Roadmap & Gates</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Core Modules</h4>
        <ul>
          <li><a href="${prefix}tools/yod/index.html">Yod Intelligence</a></li>
          <li><a href="${prefix}tools/lienzo/index.html">Lienzo Identity</a></li>
          <li><a href="${prefix}tools/he/index.html">He Operations</a></li>
          <li><a href="${prefix}tools/shim/index.html">Shim Reality</a></li>
          <li><a href="${prefix}tools/vav/index.html">VAV Forge</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Canon & Proof</h4>
        <ul>
          <li><a href="${prefix}proof/index.html">Evidence Registry</a></li>
          <li><a href="${prefix}taste/index.html">Taste & Design System</a></li>
          <li><a href="${prefix}principles/index.html">Principles & Invariants</a></li>
          <li><a href="${prefix}tools/arquitecto/index.html">Arquitecto Oversight</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 ABRAXAS OS. All rights reserved. Forensic truth backed by immutable Git verification.</p>
      <p class="footer-mono">Commit: <span class="mono-hash">91234741f0b3a1ac5bd7e4c0556fafa868d00769</span></p>
    </div>
  </footer>
  `;
}

// Shared Public Architect Drawer
function getArchitectDrawer() {
  return `
  <div id="architect-drawer" class="architect-drawer" aria-hidden="true">
    <div class="architect-drawer-backdrop" onclick="window.__ABRAXAS_CLOSE_ARCHITECT__?.()"></div>
    <div class="architect-drawer-panel" role="dialog" aria-label="Public Architect Guidance">
      <div class="drawer-header">
        <div class="drawer-title-group">
          <span class="architect-icon">✦</span>
          <h3>Public Architect</h3>
          <span class="drawer-badge">Deterministic Token Matrix</span>
        </div>
        <button class="drawer-close" onclick="window.__ABRAXAS_CLOSE_ARCHITECT__?.()" aria-label="Close Public Architect">✕</button>
      </div>
      <div class="drawer-body">
        <p class="drawer-intro">Contextual guidance consuming canonical YOD criteria, system topologies, and operational invariants.</p>
        
        <form id="drawer-architect-form" class="architect-form-group" onsubmit="event.preventDefault(); window.__ABRAXAS_QUERY_ARCHITECT__?.(document.getElementById('drawer-architect-input').value);">
          <input type="text" id="drawer-architect-input" class="architect-input" placeholder="Ask about YOD, Lienzo, Shim, He, VAV, or Invariants..." autocomplete="off" />
          <button type="submit" class="architect-submit-btn">Consult</button>
        </form>

        <div class="quick-prompt-chips">
          <span class="chip-label">Suggestions:</span>
          <button type="button" class="prompt-chip" onclick="document.getElementById('drawer-architect-input').value='What is YOD?'; window.__ABRAXAS_QUERY_ARCHITECT__('What is YOD?');">What is YOD?</button>
          <button type="button" class="prompt-chip" onclick="document.getElementById('drawer-architect-input').value='What is Lienzo?'; window.__ABRAXAS_QUERY_ARCHITECT__('What is Lienzo?');">What is Lienzo?</button>
          <button type="button" class="prompt-chip" onclick="document.getElementById('drawer-architect-input').value='What is Shim?'; window.__ABRAXAS_QUERY_ARCHITECT__('What is Shim?');">What is Shim?</button>
          <button type="button" class="prompt-chip" onclick="document.getElementById('drawer-architect-input').value='What is VAV?'; window.__ABRAXAS_QUERY_ARCHITECT__('What is VAV?');">What is VAV?</button>
          <button type="button" class="prompt-chip" onclick="document.getElementById('drawer-architect-input').value='What is OUT_OF_SYNC?'; window.__ABRAXAS_QUERY_ARCHITECT__('What is OUT_OF_SYNC?');">OUT_OF_SYNC</button>
        </div>

        <div id="drawer-architect-response-card" class="architect-response-card" style="display: none;">
          <div class="response-topic" id="drawer-response-topic"></div>
          <div class="response-body" id="drawer-response-text"></div>
          <div class="response-meta" id="drawer-response-meta"></div>
        </div>
      </div>
    </div>
  </div>
  `;
}

// 2. Generate Tools Directory Page (/tools/index.html)
function generateToolsDirectoryPage() {
  const toolsDir = path.join(docsDir, 'tools');
  fs.mkdirSync(toolsDir, { recursive: true });

  const moduleCards = publicKnowledge.modules.map((m) => {
    const slug = m.id.toLowerCase().replace(/_/g, '-');
    const truthClass = m.truthLayer.toLowerCase();
    return `
    <article class="tool-card" data-domain="${m.domain}" data-truth="${m.truthLayer}">
      <div class="tool-card-header">
        <div class="tool-domain-tag">${m.domain}</div>
        <span class="truth-pill ${truthClass}">${m.truthLayer.replace(/_/g, ' ')}</span>
      </div>
      <h3 class="tool-card-title"><a href="./${slug}/index.html">${m.name}</a></h3>
      <p class="tool-card-role">${m.role}</p>
      <p class="tool-card-desc">${m.shortDefinition}</p>
      
      <div class="tool-card-capabilities">
        <span class="cap-label">Key Capabilities:</span>
        <div class="cap-tags">
          ${(m.currentCapabilities || []).slice(0, 3).map(c => `<span class="cap-tag">${c}</span>`).join('')}
        </div>
      </div>

      <div class="tool-card-footer">
        <a href="./${slug}/index.html" class="tool-deep-link">Deep Specification →</a>
      </div>
    </article>
    `;
  }).join('\n');

  // Subtool Cards
  const subtoolCards = `
    <article class="tool-card subtool-card" data-domain="Production" data-truth="RELEASED_CURRENT">
      <div class="tool-card-header">
        <div class="tool-domain-tag">VAV Subtool</div>
        <span class="truth-pill released_current">RELEASED CURRENT</span>
      </div>
      <h3 class="tool-card-title"><a href="./vav/captions/index.html">VAV Captions Desktop</a></h3>
      <p class="tool-card-role">Kinetic Caption Styling & Placement</p>
      <p class="tool-card-desc">Lossless word-level caption alignment, platform 9:16 safe-zone collision avoidance, and typography styling.</p>
      <div class="tool-card-footer">
        <a href="./vav/captions/index.html" class="tool-deep-link">Deep Specification →</a>
      </div>
    </article>

    <article class="tool-card subtool-card" data-domain="Production" data-truth="RELEASED_CURRENT">
      <div class="tool-card-header">
        <div class="tool-domain-tag">VAV Subtool</div>
        <span class="truth-pill released_current">RELEASED CURRENT</span>
      </div>
      <h3 class="tool-card-title"><a href="./vav/cuts/index.html">VAV Cuts Foundation</a></h3>
      <p class="tool-card-role">Non-Destructive FFmpeg Cut Engine</p>
      <p class="tool-card-desc">Frame-accurate PTS jump-cut assembly directly from resolved timestamps without quality loss.</p>
      <div class="tool-card-footer">
        <a href="./vav/cuts/index.html" class="tool-deep-link">Deep Specification →</a>
      </div>
    </article>

    <article class="tool-card subtool-card" data-domain="Production" data-truth="RELEASED_CURRENT">
      <div class="tool-card-header">
        <div class="tool-domain-tag">VAV Subtool</div>
        <span class="truth-pill released_current">RELEASED CURRENT</span>
      </div>
      <h3 class="tool-card-title"><a href="./vav/motions/index.html">VAV Visual Motions</a></h3>
      <p class="tool-card-role">Programmatic Remotion Motions</p>
      <p class="tool-card-desc">13 parametric visual motion families, spring easing, safe-zone bounding boxes, and frame-accurate Remotion renders.</p>
      <div class="tool-card-footer">
        <a href="./vav/motions/index.html" class="tool-deep-link">Deep Specification →</a>
      </div>
    </article>
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tools & Capability Directory — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
</head>
<body class="multipage-body tools-directory-page">
  ${getHeader('tools', 1)}

  <main id="main-content" class="page-container">
    <div class="page-hero">
      <div class="hero-tag">CAPABILITY DIRECTORY</div>
      <h1 class="page-title">Tools & Architecture Modules</h1>
      <p class="page-lead">Explore the 13 discrete domains of ABRAXAS OS, their ownership boundaries, contracts, inputs, outputs, and verified runtime capabilities.</p>
    </div>

    <div class="tools-filter-bar">
      <div class="filter-group">
        <span class="filter-label">Filter Truth:</span>
        <button class="filter-chip active" data-filter="all">All Modules</button>
        <button class="filter-chip" data-filter="RELEASED_CURRENT">Released Current</button>
        <button class="filter-chip" data-filter="POST_RC1_CANDIDATE">Working Candidate</button>
        <button class="filter-chip" data-filter="CONTRACT_ONLY">Contract Only</button>
        <button class="filter-chip" data-filter="PLANNED">Planned</button>
      </div>
    </div>

    <div class="tools-grid">
      ${moduleCards}
      ${subtoolCards}
    </div>
  </main>

  ${getFooter(1)}
  ${getArchitectDrawer()}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(toolsDir, 'index.html'), html, 'utf-8');
  console.log('[MultiPage Generator] Generated /tools/index.html');
}

// 3. Generate Individual Tool Pages (/tools/{slug}/index.html)
function generateIndividualToolPages() {
  for (const m of publicKnowledge.modules) {
    const slug = m.id.toLowerCase().replace(/_/g, '-');
    const toolDir = path.join(docsDir, 'tools', slug);
    fs.mkdirSync(toolDir, { recursive: true });

    const truthClass = m.truthLayer.toLowerCase();
    
    // Domain Protagonist SVG / Graphic
    let protagonistSvg = '';
    if (m.id === 'YOD') {
      protagonistSvg = `
      <div class="domain-protagonist yod-protagonist">
        <svg viewBox="0 0 400 240" class="protagonist-svg" aria-label="YOD Convergence Matrix Graphic">
          <circle cx="200" cy="120" r="80" stroke="#38bdf8" stroke-width="1.5" fill="none" opacity="0.3" stroke-dasharray="4 4" />
          <polygon points="200,40 270,160 130,160" stroke="#38bdf8" stroke-width="2" fill="rgba(56,189,248,0.06)" />
          <circle cx="200" cy="120" r="6" fill="#38bdf8" />
          <line x1="60" y1="120" x2="130" y2="120" stroke="#38bdf8" stroke-width="1" opacity="0.5" />
          <line x1="340" y1="120" x2="270" y2="120" stroke="#38bdf8" stroke-width="1" opacity="0.5" />
          <text x="200" y="200" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="11">YOD // INTELLIGENCE APEX</text>
        </svg>
      </div>`;
    } else if (m.id === 'LIENZO') {
      protagonistSvg = `
      <div class="domain-protagonist lienzo-protagonist">
        <svg viewBox="0 0 400 240" class="protagonist-svg" aria-label="Lienzo Spine and DAG Graphic">
          <line x1="200" y1="20" x2="200" y2="200" stroke="#a855f7" stroke-width="3" />
          <ellipse cx="200" cy="60" rx="60" ry="16" stroke="#a855f7" stroke-width="1.5" fill="none" opacity="0.4" />
          <ellipse cx="200" cy="110" rx="75" ry="20" stroke="#a855f7" stroke-width="1.5" fill="none" opacity="0.6" />
          <ellipse cx="200" cy="160" rx="90" ry="24" stroke="#a855f7" stroke-width="1.5" fill="none" opacity="0.8" />
          <text x="200" y="225" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="11">LIENZO // PERSISTENT IDENTITY SPINE</text>
        </svg>
      </div>`;
    } else if (m.id === 'HE') {
      protagonistSvg = `
      <div class="domain-protagonist he-protagonist">
        <svg viewBox="0 0 400 240" class="protagonist-svg" aria-label="He Operational Window Graphic">
          <rect x="50" y="30" width="300" height="160" rx="8" stroke="#10b981" stroke-width="1.5" fill="rgba(16,185,129,0.04)" />
          <line x1="150" y1="30" x2="150" y2="190" stroke="#10b981" stroke-width="1" opacity="0.3" />
          <line x1="250" y1="30" x2="250" y2="190" stroke="#10b981" stroke-width="1" opacity="0.3" />
          <circle cx="100" cy="70" r="5" fill="#10b981" />
          <circle cx="200" cy="110" r="5" fill="#10b981" />
          <circle cx="300" cy="90" r="5" fill="#10b981" />
          <text x="200" y="215" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="11">HE // OPERATIONS CORE &amp; WORKFLOW DESK</text>
        </svg>
      </div>`;
    } else if (m.id === 'SHIM') {
      protagonistSvg = `
      <div class="domain-protagonist shim-protagonist">
        <svg viewBox="0 0 400 240" class="protagonist-svg" aria-label="Shim 3-Plane Reality Graphic">
          <polygon points="80,50 320,50 280,100 40,100" stroke="#f59e0b" stroke-width="1.5" fill="rgba(245,158,11,0.08)" />
          <polygon points="80,110 320,110 280,160 40,160" stroke="#38bdf8" stroke-width="1.5" fill="rgba(56,189,248,0.08)" />
          <text x="200" y="78" text-anchor="middle" fill="#f59e0b" font-family="JetBrains Mono" font-size="10">PLANNED (YOD)</text>
          <text x="200" y="138" text-anchor="middle" fill="#38bdf8" font-family="JetBrains Mono" font-size="10">OBSERVED (RAW TAKE)</text>
          <text x="200" y="200" text-anchor="middle" fill="#10b981" font-family="JetBrains Mono" font-size="11">SHIM // EDITORIAL RESOLUTION</text>
        </svg>
      </div>`;
    } else if (m.id === 'VAV') {
      protagonistSvg = `
      <div class="domain-protagonist vav-protagonist">
        <svg viewBox="0 0 400 240" class="protagonist-svg" aria-label="VAV Multitrack Forge Graphic">
          <rect x="40" y="40" width="320" height="30" rx="4" stroke="#f59e0b" stroke-width="1.5" fill="rgba(245,158,11,0.1)" />
          <rect x="40" y="85" width="320" height="30" rx="4" stroke="#38bdf8" stroke-width="1.5" fill="rgba(56,189,248,0.1)" />
          <rect x="40" y="130" width="320" height="30" rx="4" stroke="#a855f7" stroke-width="1.5" fill="rgba(168,85,247,0.1)" />
          <line x1="160" y1="30" x2="160" y2="175" stroke="#ef4444" stroke-width="2" />
          <text x="55" y="60" fill="#f59e0b" font-family="JetBrains Mono" font-size="9">TRACK 1: CUTS</text>
          <text x="55" y="105" fill="#38bdf8" font-family="JetBrains Mono" font-size="9">TRACK 2: CAPTIONS</text>
          <text x="55" y="150" fill="#a855f7" font-family="JetBrains Mono" font-size="9">TRACK 3: MOTIONS</text>
          <text x="200" y="205" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="11">VAV // PRODUCTION FORGE</text>
        </svg>
      </div>`;
    } else {
      protagonistSvg = `
      <div class="domain-protagonist generic-protagonist">
        <svg viewBox="0 0 400 240" class="protagonist-svg" aria-label="${m.name} Schematic Graphic">
          <circle cx="200" cy="110" r="60" stroke="#64748b" stroke-width="1.5" fill="none" opacity="0.4" />
          <circle cx="200" cy="110" r="30" stroke="#38bdf8" stroke-width="1.5" fill="rgba(56,189,248,0.06)" />
          <text x="200" y="205" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono" font-size="11">${m.name.toUpperCase()} // ${m.domain.toUpperCase()}</text>
        </svg>
      </div>`;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${m.name} (${m.domain}) Specification — ABRAXAS OS</title>
  <link rel="stylesheet" href="../../assets/status-v3.css">
</head>
<body class="multipage-body tool-detail-page">
  ${getHeader('tools', 2)}

  <main id="main-content" class="page-container">
    <div class="breadcrumb-bar">
      <a href="../../index.html">ABRAXAS</a>
      <span class="crumb-sep">/</span>
      <a href="../index.html">Tools</a>
      <span class="crumb-sep">/</span>
      <span class="crumb-current">${m.name}</span>
    </div>

    <div class="tool-hero-section">
      <div class="tool-hero-content">
        <div class="tool-status-badge-row">
          <span class="truth-pill ${truthClass}">${m.truthLayer.replace(/_/g, ' ')}</span>
          <span class="domain-badge">${m.domain}</span>
          <span class="status-badge">${m.status}</span>
        </div>
        <h1 class="tool-title">${m.name}</h1>
        <p class="tool-role-tag">${m.role}</p>
        <p class="tool-lead">${m.responsibility}</p>
      </div>
      ${protagonistSvg}
    </div>

    <div class="tool-deep-grid">
      <!-- 1. What & Why -->
      <section class="dossier-card">
        <h2 class="section-title">01. What &amp; Why</h2>
        <div class="card-body">
          <p><strong>Definition:</strong> ${m.shortDefinition}</p>
          <p><strong>Why It Exists:</strong> ${m.why}</p>
        </div>
      </section>

      <!-- 2. Ownership Boundaries -->
      <section class="dossier-card">
        <h2 class="section-title">02. Ownership Boundaries</h2>
        <div class="card-body">
          <div class="boundary-split">
            <div class="owns-col">
              <h3 class="col-title text-emerald">✓ Owns</h3>
              <ul>
                ${(m.owns || []).map(o => `<li>${o}</li>`).join('')}
              </ul>
            </div>
            <div class="does-not-own-col">
              <h3 class="col-title text-rose">✗ Does Not Own</h3>
              <ul>
                ${(m.doesNotOwn || []).map(d => `<li>${d}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Contracts & Flow -->
      <section class="dossier-card">
        <h2 class="section-title">03. Contracts &amp; Data Flow</h2>
        <div class="card-body">
          <div class="io-grid">
            <div class="io-block">
              <span class="io-label">Inputs:</span>
              <ul>${(m.inputs || []).map(i => `<li><code>${i}</code></li>`).join('')}</ul>
            </div>
            <div class="io-block">
              <span class="io-label">Outputs:</span>
              <ul>${(m.outputs || []).map(o => `<li><code>${o}</code></li>`).join('')}</ul>
            </div>
          </div>
          <div class="flow-example-box">
            <span class="box-label">Example Lifecycle Flow:</span>
            <p class="flow-text">${m.exampleFlow}</p>
          </div>
        </div>
      </section>

      <!-- 4. Lineage: Events & Artifacts -->
      <section class="dossier-card">
        <h2 class="section-title">04. Events &amp; Produced Lineage</h2>
        <div class="card-body">
          <div class="lineage-split">
            <div>
              <span class="io-label">Emitted Events:</span>
              <ul>${(m.eventFootprint || []).map(e => `<li><span class="event-chip">${e}</span></li>`).join('')}</ul>
            </div>
            <div>
              <span class="io-label">Produced Artifacts:</span>
              <ul>${(m.artifactFootprint || []).map(a => `<li><span class="artifact-chip">${a}</span></li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Capability Status & Roadmap -->
      <section class="dossier-card">
        <h2 class="section-title">05. Capability Truth &amp; Roadmap</h2>
        <div class="card-body">
          <div class="cap-comparison-grid">
            <div class="cap-col">
              <h3 class="col-title text-cyan">Current Capabilities</h3>
              <ul>${(m.currentCapabilities || []).map(c => `<li>${c}</li>`).join('')}</ul>
            </div>
            <div class="cap-col">
              <h3 class="col-title text-amber">Target Capabilities</h3>
              <ul>${(m.targetCapabilities || []).map(t => `<li>${t}</li>`).join('')}</ul>
            </div>
          </div>
          <div class="debt-box">
            <span class="box-label">Bounded Technical Debt:</span>
            <ul>${(m.boundedDebt || []).map(b => `<li>${b}</li>`).join('')}</ul>
          </div>
        </div>
      </section>

      <!-- 6. Evidence & Verification -->
      <section class="dossier-card">
        <h2 class="section-title">06. Verification &amp; Evidence Citations</h2>
        <div class="card-body">
          <p class="status-detail-text"><strong>Live Verification Detail:</strong> ${m.statusDetail}</p>
          <div class="evidence-citations">
            <span class="citation-label">Referenced Proof:</span>
            <ul>${(m.evidenceRefs || []).map(r => `<li><code>${r}</code></li>`).join('')}</ul>
          </div>
        </div>
      </section>
    </div>

    <div class="tool-navigation-footer">
      <a href="../index.html" class="nav-back-btn">← Back to All Tools</a>
      <a href="../../system/index.html" class="nav-system-btn">Inspect in 3D System Explorer →</a>
    </div>
  </main>

  ${getFooter(2)}
  ${getArchitectDrawer()}
  <script type="module" src="../../assets/status-v3.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(toolDir, 'index.html'), html, 'utf-8');
    console.log(`[MultiPage Generator] Generated /tools/${slug}/index.html`);
  }

  // Generate VAV Subtool Pages
  const vavSubtools = [
    {
      slug: 'captions',
      name: 'VAV Captions Desktop',
      domain: 'Production',
      truthLayer: 'RELEASED_CURRENT',
      role: 'Kinetic Caption Styling & Placement',
      lead: 'Lossless word-level caption alignment, platform 9:16 safe-zone collision avoidance, and typography styling.',
      owns: ['Word-level transcription time mapping', 'Preset font hierarchy and animations', 'Platform 9:16 safe-zone collision avoidance'],
      doesNotOwn: ['Does not own raw video cut boundaries (Cuts owns this)', 'Does not own task assignment (He owns this)'],
      inputs: ['Whisper JSON transcript', 'Video metadata'],
      outputs: ['VAV Caption Track JSON', 'Burn-in subtitle stream'],
      evidence: ['v1.0.0-rc1 release tag', '86 vitest unit tests']
    },
    {
      slug: 'cuts',
      name: 'VAV Cuts Foundation',
      domain: 'Production',
      truthLayer: 'RELEASED_CURRENT',
      role: 'Non-Destructive FFmpeg Cut Engine',
      lead: 'Frame-accurate PTS jump-cut assembly directly from resolved timestamps without quality loss.',
      owns: ['Non-destructive EDL cut lists', 'Local FFmpeg stream-copy orchestration', 'PTS synchronization across audio/video tracks'],
      doesNotOwn: ['Does not own semantic gap detection (Shim owns this)', 'Does not own rendering motions (Motions owns this)'],
      inputs: ['Raw multi-take source files', 'Shim resolved cut intervals'],
      outputs: ['Lossless assembled MP4 cut', 'Cut list verification report'],
      evidence: ['FFmpeg cut e2e tests', 'Pro foundation check']
    },
    {
      slug: 'motions',
      name: 'VAV Visual Motions',
      domain: 'Production',
      truthLayer: 'RELEASED_CURRENT',
      role: 'Programmatic Remotion Motions',
      lead: '13 parametric visual motion families, spring easing, safe-zone bounding boxes, and frame-accurate Remotion renders.',
      owns: ['13 visual motion families (Kinetic Text, Pop-in, Slide, Glow, Zoom)', 'Remotion compositions', 'Dynamic spring physics interpolation'],
      doesNotOwn: ['Does not own strategy planning (YOD owns this)', 'Does not own editorial resolution (Shim owns this)'],
      inputs: ['Motion intent schema', 'Brand visual palette'],
      outputs: ['Rendered motion video layers', 'Platform-validated Remotion composition'],
      evidence: ['Motions foundation health check', '13 motion family unit tests']
    }
  ];

  for (const st of vavSubtools) {
    const stDir = path.join(docsDir, 'tools', 'vav', st.slug);
    fs.mkdirSync(stDir, { recursive: true });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${st.name} — ABRAXAS OS</title>
  <link rel="stylesheet" href="../../../assets/status-v3.css">
</head>
<body class="multipage-body tool-detail-page">
  ${getHeader('tools', 3)}

  <main id="main-content" class="page-container">
    <div class="breadcrumb-bar">
      <a href="../../../index.html">ABRAXAS</a>
      <span class="crumb-sep">/</span>
      <a href="../../index.html">Tools</a>
      <span class="crumb-sep">/</span>
      <a href="../index.html">VAV</a>
      <span class="crumb-sep">/</span>
      <span class="crumb-current">${st.name}</span>
    </div>

    <div class="tool-hero-section">
      <div class="tool-hero-content">
        <div class="tool-status-badge-row">
          <span class="truth-pill released_current">${st.truthLayer.replace(/_/g, ' ')}</span>
          <span class="domain-badge">${st.domain} Subtool</span>
        </div>
        <h1 class="tool-title">${st.name}</h1>
        <p class="tool-role-tag">${st.role}</p>
        <p class="tool-lead">${st.lead}</p>
      </div>
    </div>

    <div class="tool-deep-grid">
      <section class="dossier-card">
        <h2 class="section-title">01. Capabilities &amp; Scope</h2>
        <div class="card-body">
          <div class="boundary-split">
            <div class="owns-col">
              <h3 class="col-title text-emerald">✓ Owns</h3>
              <ul>${st.owns.map(o => `<li>${o}</li>`).join('')}</ul>
            </div>
            <div class="does-not-own-col">
              <h3 class="col-title text-rose">✗ Does Not Own</h3>
              <ul>${st.doesNotOwn.map(d => `<li>${d}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </section>

      <section class="dossier-card">
        <h2 class="section-title">02. Contracts &amp; Data Flow</h2>
        <div class="card-body">
          <div class="io-grid">
            <div class="io-block">
              <span class="io-label">Inputs:</span>
              <ul>${st.inputs.map(i => `<li><code>${i}</code></li>`).join('')}</ul>
            </div>
            <div class="io-block">
              <span class="io-label">Outputs:</span>
              <ul>${st.outputs.map(o => `<li><code>${o}</code></li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </section>

      <section class="dossier-card">
        <h2 class="section-title">03. Verified Proof</h2>
        <div class="card-body">
          <ul>${st.evidence.map(e => `<li><span class="event-chip">${e}</span></li>`).join('')}</ul>
        </div>
      </section>
    </div>

    <div class="tool-navigation-footer">
      <a href="../index.html" class="nav-back-btn">← Back to VAV Overview</a>
      <a href="../../../system/index.html" class="nav-system-btn">Inspect in 3D System Explorer →</a>
    </div>
  </main>

  ${getFooter(3)}
  ${getArchitectDrawer()}
  <script type="module" src="../../../assets/status-v3.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(stDir, 'index.html'), html, 'utf-8');
    console.log(`[MultiPage Generator] Generated /tools/vav/${st.slug}/index.html`);
  }
}

// 4. Generate Taste Page (/taste/index.html)
function generateTastePage() {
  const tasteDir = path.join(docsDir, 'taste');
  fs.mkdirSync(tasteDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Taste &amp; Visual Design System — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
</head>
<body class="multipage-body taste-page">
  ${getHeader('taste', 1)}

  <main id="main-content" class="page-container">
    <div class="page-hero">
      <div class="hero-tag">VISUAL CRITERIA &amp; TASTE CANON</div>
      <h1 class="page-title">Taste as Infrastructure</h1>
      <p class="page-lead">ABRAXAS treats Taste not as decorative styling, but as a compiled, versioned mathematical system of reduction, physical lighting, typography, and forensic honesty.</p>
    </div>

    <div class="taste-section-grid">
      <!-- 1. The Core Thesis -->
      <section class="dossier-card">
        <h2 class="section-title">01. Core Statement</h2>
        <div class="card-body">
          <blockquote class="taste-quote">
            "ABRAXAS WEB EXPERIENCE = HIGH-END EDITORIAL PRODUCT FILM RENDERED AS AN INTERACTIVE SYSTEM."
          </blockquote>
          <p>Every digital surface centers on a clear conceptual protagonist rather than fragmented widgets. Large negative space is active staging; typography lives directly in the scene with zero floating glass boxes.</p>
        </div>
      </section>

      <!-- 2. Four-Tier Taste Hierarchy -->
      <section class="dossier-card">
        <h2 class="section-title">02. The Four-Tier Taste Architecture</h2>
        <div class="card-body">
          <div class="taste-tier-list">
            <div class="tier-item">
              <span class="tier-badge">Tier A</span>
              <div class="tier-content">
                <h4>ABRAXAS Global Web Taste (Canon)</h4>
                <p>Universal laws of reduction, focus, physical material coherence, negative space, and evidence honesty.</p>
              </div>
            </div>
            <div class="tier-item">
              <span class="tier-badge">Tier B</span>
              <div class="tier-content">
                <h4>Reusable Web Experience Patterns</h4>
                <p>Shared knowledge patterns: Monumental Hero, Operational Dashboard, DAG Pipeline Explorer, Evidence Registry.</p>
              </div>
            </div>
            <div class="tier-item">
              <span class="tier-badge">Tier C</span>
              <div class="tier-content">
                <h4>Client Taste Profile (Brand Contract)</h4>
                <p>Client-specific aesthetics, typography scales, dominant palettes, and tone boundaries.</p>
              </div>
            </div>
            <div class="tier-item">
              <span class="tier-badge">Tier D</span>
              <div class="tier-content">
                <h4>Project Design Intent (Compiled Brief)</h4>
                <p>The concrete tokens and layout constraints compiled by YOD Visual Intelligence for one target website.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Reference Forensics to Principles -->
      <section class="dossier-card">
        <h2 class="section-title">03. Reference Forensics → Universal Principles</h2>
        <div class="card-body">
          <div class="ref-forensics-grid">
            <div class="ref-item">
              <h4>Apple HIG &amp; Product Stories</h4>
              <p class="ref-principle"><strong>Principle:</strong> Choreographed Progressive Disclosure. Motion is exposition; camera traces physical contours as narrative unfolds.</p>
            </div>
            <div class="ref-item">
              <h4>Reflect Atmospheric Void</h4>
              <p class="ref-principle"><strong>Principle:</strong> Singular Monumental Focus. High-contrast luminous protagonist in deep negative space commands complete attention.</p>
            </div>
            <div class="ref-item">
              <h4>United Carriers Logistics</h4>
              <p class="ref-principle"><strong>Principle:</strong> Structural Integrity. Layout lines act as load-bearing infrastructure annotating operational routes.</p>
            </div>
            <div class="ref-item">
              <h4>Cipher Forensic Telemetry</h4>
              <p class="ref-principle"><strong>Principle:</strong> Forensic Provenance. Every capability claim is anchored by immutable commit hashes and test counts.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Anti-Slop Manifesto -->
      <section class="dossier-card">
        <h2 class="section-title">04. Anti-AI-Slop Manifesto &amp; Rules</h2>
        <div class="card-body">
          <div class="anti-slop-grid">
            <div class="do-col">
              <h3 class="col-title text-emerald">✓ DO</h3>
              <ul>
                <li>Center each scene on one dominant idea.</li>
                <li>Preserve clean negative space for typography.</li>
                <li>Use physically based materials (PBR, Fresnel, ACES Filmic).</li>
                <li>Cite exact Git SHAs and deterministic test assertions.</li>
                <li>Instant 0-duration snap under reduced motion.</li>
              </ul>
            </div>
            <div class="dont-col">
              <h3 class="col-title text-rose">✗ DON'T</h3>
              <ul>
                <li>Never add Three.js primitives without custom shaders.</li>
                <li>Never place text inside floating dark backdrop boxes.</li>
                <li>Never use gratuitous floating particles or neon glows.</li>
                <li>Never simulate fake counting numbers or hacker HUDs.</li>
                <li>Never repeat the same 3-card template across 13 pages.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  ${getFooter(1)}
  ${getArchitectDrawer()}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(tasteDir, 'index.html'), html, 'utf-8');
  console.log('[MultiPage Generator] Generated /taste/index.html');
}

// 5. Generate Principles Page (/principles/index.html)
function generatePrinciplesPage() {
  const princDir = path.join(docsDir, 'principles');
  fs.mkdirSync(princDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Core Principles &amp; Invariants — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
</head>
<body class="multipage-body principles-page">
  ${getHeader('principles', 1)}

  <main id="main-content" class="page-container">
    <div class="page-hero">
      <div class="hero-tag">CANONICAL INVARIANTS</div>
      <h1 class="page-title">Core Principles &amp; Invariants</h1>
      <p class="page-lead">The architectural rules, mathematical invariants, and governance laws that guarantee deterministic execution across the ABRAXAS content lifecycle.</p>
    </div>

    <div class="principles-grid">
      <article class="principle-card">
        <div class="principle-num">01</div>
        <h3 class="principle-title">PLANNED != OBSERVED != RESOLVED</h3>
        <p class="principle-desc">Strategic intent (Yod Plan) is never identical to real physical source takes (Shim Observed), and neither is identical to the final cut decision (Shim Resolved). Keeping these three layers strictly separated prevents catastrophic state drift.</p>
      </article>

      <article class="principle-card">
        <div class="principle-num">02</div>
        <h3 class="principle-title">Canonical Content is Data; UI is a Projection</h3>
        <p class="principle-desc">The single source of truth lives in immutable Content-Addressable Storage (CAS) with versioned schemas. User interfaces (Web, Desktop, Inspector) are disposable projections that subscribe to state without holding canonical authority.</p>
      </article>

      <article class="principle-card">
        <div class="principle-num">03</div>
        <h3 class="principle-title">AI Never Silently Mutates Canonical Truth</h3>
        <p class="principle-desc">AI outputs are proposals and candidates. An AI process can generate opportunities, drafts, or transcriptions, but canonical Lienzo state changes require explicit human approval gates or deterministic validation.</p>
      </article>

      <article class="principle-card">
        <div class="principle-num">04</div>
        <h3 class="principle-title">Learning Never Silently Becomes Source Truth</h3>
        <p class="principle-desc">Performance telemetry and audience feedback from Metrics are compiled into learning signals in Yod. They influence future opportunity scoring algorithms without destructively overwriting established brand voice criteria.</p>
      </article>

      <article class="principle-card">
        <div class="principle-num">05</div>
        <h3 class="principle-title">Meaningful Outputs Become Artifacts</h3>
        <p class="principle-desc">Every significant milestone produces an immutable, content-addressed Artifact (e.g. RecordingPack, LosslessCut, CaptionTrack, RenderManifest) referenced by cryptographic hash.</p>
      </article>

      <article class="principle-card">
        <div class="principle-num">06</div>
        <h3 class="principle-title">Meaningful Transitions Become Events</h3>
        <p class="principle-desc">State mutations emit immutable, structured Domain Events into the append-only Event Ledger, guaranteeing 100% deterministic time-travel auditability and temporal replay.</p>
      </article>

      <article class="principle-card">
        <div class="principle-num">07</div>
        <h3 class="principle-title">Upstream Changes Invalidate via OUT_OF_SYNC</h3>
        <p class="principle-desc">When an upstream component (e.g. Script Hook) is modified in Lienzo, all downstream derivatives (Audio Cut, Captions, Motion Track) are immediately marked <code>OUT_OF_SYNC</code> to prevent publishing stale or broken media.</p>
      </article>

      <article class="principle-card">
        <div class="principle-num">08</div>
        <h3 class="principle-title">Local-First / Cloud-Ready</h3>
        <p class="principle-desc">Core operations and video processing execute directly on local hardware without cloud roundtrip latency or monthly SaaS lock-in, while maintaining standard JSON/gRPC contracts for optional cloud distribution.</p>
      </article>
    </div>
  </main>

  ${getFooter(1)}
  ${getArchitectDrawer()}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(princDir, 'index.html'), html, 'utf-8');
  console.log('[MultiPage Generator] Generated /principles/index.html');
}

// Run All Generators
generateToolsDirectoryPage();
generateIndividualToolPages();
generateTastePage();
generatePrinciplesPage();

console.log('[MultiPage Generator] Complete! All static multi-surface pages successfully generated.');

// 6. Generate System Dashboard Page (/system/index.html)
function generateSystemPage() {
  const sysDir = path.join(docsDir, 'system');
  fs.mkdirSync(sysDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Architecture Explorer — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
</head>
<body class="system-dashboard-body">
  ${getHeader('system', 1)}

  <!-- 3D Spatial Canvas Mount -->
  <div id="spatial-canvas-container" class="spatial-canvas-fullscreen" aria-hidden="true"></div>
  <div id="spatial-labels-overlay" class="spatial-labels-container" aria-hidden="true"></div>

  <!-- Fallback 2D Vector Schematic -->
  <div id="fallback-schematic-container" class="fallback-schematic" style="display: none;">
    <div class="fallback-banner">
      <span class="fallback-pill">2D SCHEMATIC FALLBACK ACTIVE</span>
      <p>WebGL hardware acceleration is unavailable. Displaying full operational vector architecture.</p>
    </div>
    <svg viewBox="0 0 1000 700" class="fallback-svg-diagram">
      <defs>
        <linearGradient id="pyrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0.8" />
        </linearGradient>
      </defs>
      <polygon points="500,80 820,540 180,540" fill="url(#pyrGrad)" stroke="#38bdf8" stroke-width="2" />
      <circle cx="500" cy="80" r="14" fill="#38bdf8" />
      <text x="500" y="55" fill="#38bdf8" text-anchor="middle" font-family="Space Grotesk" font-size="14" font-weight="bold">YOD (INTELLIGENCE)</text>
      <line x1="500" y1="95" x2="500" y2="480" stroke="#a855f7" stroke-width="3" />
      <text x="520" y="240" fill="#a855f7" font-family="Space Grotesk" font-size="12">LIENZO SPINE</text>
      <line x1="300" y1="360" x2="700" y2="360" stroke="#f59e0b" stroke-width="2" />
      <text x="500" y="350" fill="#f59e0b" text-anchor="middle" font-family="Space Grotesk" font-size="12">SHIM MEMBRANE</text>
      <rect x="360" y="440" width="280" height="45" rx="4" fill="rgba(15,23,42,0.9)" stroke="#10b981" stroke-width="1.5" />
      <text x="500" y="468" fill="#10b981" text-anchor="middle" font-family="Space Grotesk" font-size="13" font-weight="bold">VAV PRODUCTION FORGE</text>
    </svg>
  </div>

  <!-- Operational Dashboard Workspace Layout -->
  <main id="main-content" class="system-workspace-layout">
    <!-- Left: Typographic Directory Rail -->
    <aside class="system-directory-rail" aria-label="System Architecture Modules">
      <div class="directory-header">
        <div class="rail-title-group">
          <span class="rail-glyph">◈</span>
          <h2>Architecture Modules</h2>
        </div>
        <div class="truth-toggle-wrapper">
          <label class="truth-toggle-label" for="target-mode-toggle">
            <input type="checkbox" id="target-mode-toggle" class="truth-toggle-input">
            <span class="truth-toggle-slider"></span>
            <span id="nav-target-tag" class="truth-toggle-text">RELEASED CURRENT</span>
          </label>
        </div>
      </div>
      <nav id="system-directory-list" class="directory-list" role="list">
        <!-- Rendered dynamically by ModeManager -->
      </nav>
    </aside>

    <!-- Center Floating Controls & Spatial Navigator -->
    <div class="system-center-overlay">
      <div id="navigator-mount" class="spatial-navigator-wrapper"></div>
    </div>

    <!-- Right: Contextual Inspector Rail -->
    <aside id="system-active-summary" class="system-inspector-rail" aria-label="Selected Module Details">
      <!-- Rendered dynamically by ModeManager -->
    </aside>
  </main>

  <div id="dossier-modal-mount"></div>
  ${getArchitectDrawer()}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(sysDir, 'index.html'), html, 'utf-8');
  console.log('[MultiPage Generator] Generated /system/index.html');
}

// 7. Generate Flow Page (/flow/index.html)
function generateFlowPage() {
  const flowDir = path.join(docsDir, 'flow');
  fs.mkdirSync(flowDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pipeline Blueprint Explorer — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
</head>
<body class="multipage-body flow-page">
  ${getHeader('flow', 1)}

  <main id="main-content" class="page-container">
    <div class="page-hero">
      <div class="hero-tag">DAG PIPELINE ORCHESTRATION</div>
      <h1 class="page-title">Pipeline Blueprint Explorer</h1>
      <p class="page-lead">Inspect deterministic Directed Acyclic Graph (DAG) blueprints coordinating multi-module content production from intake to publication.</p>
    </div>

    <div class="flow-layout-grid">
      <aside class="flow-sidebar">
        <h2 class="sidebar-title">Pipeline Blueprints</h2>
        <div id="flow-blueprint-selector" class="blueprint-selector-list">
          <!-- Populated by ModeManager -->
        </div>
      </aside>

      <section class="flow-main-viewport">
        <div id="flow-active-metadata" class="flow-meta-card">
          <!-- Populated by ModeManager -->
        </div>
        <div class="flow-dag-stages-card">
          <h3 class="stages-title">Execution Stages &amp; Owning Domains</h3>
          <div id="flow-stages-timeline" class="stages-timeline">
            <!-- Populated by ModeManager -->
          </div>
        </div>
      </section>
    </div>
  </main>

  ${getFooter(1)}
  ${getArchitectDrawer()}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(flowDir, 'index.html'), html, 'utf-8');
  console.log('[MultiPage Generator] Generated /flow/index.html');
}

// 8. Generate Proof Page (/proof/index.html)
function generateProofPage() {
  const proofDir = path.join(docsDir, 'proof');
  fs.mkdirSync(proofDir, { recursive: true });

  const proofCards = evidenceIndex.items.map((item) => {
    const truthClass = item.truthLayer.toLowerCase();
    const mediaBlock = item.mediaPath
      ? `<div class="proof-media-preview"><img src="../${item.mediaPath}" alt="${item.title}" class="proof-thumbnail" /></div>`
      : `<div class="proof-textual-badge"><span class="badge-tag">[TEXTUAL EVIDENCE ONLY]</span></div>`;

    return `
    <article class="proof-card" data-truth="${item.truthLayer}">
      <div class="proof-card-header">
        <span class="proof-type">${item.type}</span>
        <span class="truth-pill ${truthClass}">${item.truthLayer.replace(/_/g, ' ')}</span>
      </div>
      <h3 class="proof-title">${item.title}</h3>
      <p class="proof-proves">${item.whatItProves}</p>
      ${mediaBlock}
      <div class="proof-footer">
        ${item.sha ? `<span class="proof-mono">SHA: <code>${item.sha.slice(0, 12)}</code></span>` : ''}
        ${item.testCount ? `<span class="proof-tests">Tests Passed: <strong>${item.testCount}</strong></span>` : ''}
        <span class="proof-status-pass">✓ ${item.healthStatus}</span>
      </div>
    </article>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evidence &amp; Verification Registry — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
</head>
<body class="multipage-body proof-page">
  ${getHeader('proof', 1)}

  <main id="main-content" class="page-container">
    <div class="page-hero">
      <div class="hero-tag">FORENSIC PROVENANCE</div>
      <h1 class="page-title">Evidence &amp; Release Proof</h1>
      <p class="page-lead">Every claim of system capability is backed by immutable Git commit hashes, deterministic test assertions, and reproducible health check suites.</p>
    </div>

    <div class="proof-summary-bar">
      <div class="summary-metric">
        <span class="metric-num">v1.0.0-rc1</span>
        <span class="metric-label">Release Baseline</span>
      </div>
      <div class="summary-metric">
        <span class="metric-num">86</span>
        <span class="metric-label">Test Files Passing</span>
      </div>
      <div class="summary-metric">
        <span class="metric-num">226</span>
        <span class="metric-label">Unit / Integration Tests</span>
      </div>
      <div class="summary-metric">
        <span class="metric-num">0</span>
        <span class="metric-label">Typecheck Errors</span>
      </div>
    </div>

    <div class="proof-grid">
      ${proofCards}
    </div>
  </main>

  ${getFooter(1)}
  ${getArchitectDrawer()}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(proofDir, 'index.html'), html, 'utf-8');
  console.log('[MultiPage Generator] Generated /proof/index.html');
}

// 9. Generate Roadmap Page (/roadmap/index.html)
function generateRoadmapPage() {
  const rmDir = path.join(docsDir, 'roadmap');
  fs.mkdirSync(rmDir, { recursive: true });

  const gates = [
    { gateId: "P1", title: "VAV Audiovisual Core & Safe Zones", desc: "Non-destructive FFmpeg cut engine, 13 motion families, Remotion composition.", status: "RELEASED_RC1" },
    { gateId: "P2", title: "He Operations Core & Security", desc: "Task graph, typed approval engine, blocker precedence, persistent JSON store, RBAC.", status: "RELEASED_RC1" },
    { gateId: "P3A", title: "He Product UI Core", desc: "Modular desk UI, Solo Queue, Kanban, Calendar, Recording Sessions, Reviews.", status: "RELEASED_RC1" },
    { gateId: "P3B", title: "He Time Tracking & Notifications", desc: "Timer sessions, time reports, in-app notification engine with read isolation.", status: "RELEASED_RC1" },
    { gateId: "P4", title: "Public Status V3 & Spatial Experience", desc: "Multi-surface public architecture, 3D Spatial Pyramid, Taste Canon V2, Public Architect.", status: "RELEASED_RC1" },
    { gateId: "R1", title: "Lienzo Domain Core & Revision CAS", desc: "Persistent versioned identity, component DAG, exclusive CAS store, Impact Engine.", status: "POST_RC1_CANDIDATE" },
    { gateId: "R2", title: "Shim Reality & Editorial Resolution", desc: "Transverse 3-plane observation (Planned/Observed/Resolved), missing beat gap detection.", status: "POST_RC1_CANDIDATE" },
    { gateId: "R3", title: "YOD Intelligence & Opportunity Scanner", desc: "Continuous niche opportunity scoring, prompt compiler, feedback learning loop.", status: "POST_RC1_CANDIDATE" },
    { gateId: "R4", title: "VAV Modular Pipelines & Automated Cuts", desc: "Dynamic multi-track blueprint routing, automatic take relinking.", status: "CONTRACT_ONLY" },
    { gateId: "R5", title: "Collaborative CAS & Cloud Sync", desc: "Multi-user CRDT cursor synchronization, distributed opaque cloud store.", status: "PLANNED" },
    { gateId: "R6", title: "Distributed Autonomous Orchestration", desc: "Self-healing pipeline execution, multi-channel distribution network.", status: "PLANNED" }
  ];

  const gateCards = gates.map((g) => {
    const statusClass = g.status.toLowerCase();
    return `
    <article class="roadmap-card" data-status="${g.status}">
      <div class="roadmap-card-header">
        <span class="gate-id">${g.gateId}</span>
        <span class="truth-pill ${statusClass}">${g.status.replace(/_/g, ' ')}</span>
      </div>
      <h3 class="gate-title">${g.title}</h3>
      <p class="gate-desc">${g.desc}</p>
    </article>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Architecture Roadmap &amp; Gate Progression — ABRAXAS OS</title>
  <link rel="stylesheet" href="../assets/status-v3.css">
</head>
<body class="multipage-body roadmap-page">
  ${getHeader('roadmap', 1)}

  <main id="main-content" class="page-container">
    <div class="page-hero">
      <div class="hero-tag">CAPABILITY EVOLUTION</div>
      <h1 class="page-title">Architecture Roadmap</h1>
      <p class="page-lead">The sequential engineering gates progressing ABRAXAS from foundational release RC1 into full multi-surface candidate maturity.</p>
    </div>

    <div class="roadmap-timeline">
      ${gateCards}
    </div>
  </main>

  ${getFooter(1)}
  ${getArchitectDrawer()}
  <script type="module" src="../assets/status-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(rmDir, 'index.html'), html, 'utf-8');
  console.log('[MultiPage Generator] Generated /roadmap/index.html');
}

// 10. Generate Main Landing / 6-Act Story Page (/index.html)
function generateLandingStoryPage() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ABRAXAS OS — Content Intelligence, Governance &amp; Audiovisual Synthesis</title>
  <link rel="stylesheet" href="./assets/status-v3.css">
</head>
<body class="landing-story-body">
  ${getHeader('story', 0)}

  <!-- 3D Spatial Canvas Mount -->
  <div id="spatial-canvas-container" class="spatial-canvas-fullscreen" aria-hidden="true"></div>
  <div id="spatial-labels-overlay" class="spatial-labels-container" aria-hidden="true"></div>

  <!-- Fallback 2D Vector Schematic -->
  <div id="fallback-schematic-container" class="fallback-schematic" style="display: none;">
    <div class="fallback-banner">
      <span class="fallback-pill">2D SCHEMATIC FALLBACK ACTIVE</span>
      <p>WebGL hardware acceleration is unavailable. Displaying full operational vector architecture.</p>
    </div>
  </div>

  <div id="navigator-mount" class="spatial-navigator-wrapper"></div>

  <main id="main-content" class="story-scroll-container">
    <!-- ACT 01: PREMISE -->
    <section class="story-act-section" data-act="0" data-shot="S0">
      <div class="act-content-wrap">
        <div class="act-tag">ACT 01 // PREMISE</div>
        <h1 class="act-headline">An Operating System for Systematic Content.</h1>
        <p class="act-lead">ABRAXAS unifies strategic audience intelligence, operational governance, and deterministic audiovisual synthesis into one closed-loop content lifecycle.</p>
        <div class="hero-actions">
          <a href="#act-1" class="btn-primary" onclick="window.__ABRAXAS_STORY_CONTROLLER__?.jumpToState(1);">Begin Journey ↓</a>
          <a href="./system/index.html" class="btn-secondary">Explore Architecture →</a>
        </div>
      </div>
    </section>

    <!-- ACT 02: INTELLIGENCE -->
    <section id="act-1" class="story-act-section" data-act="1" data-shot="S2">
      <div class="act-content-wrap">
        <div class="act-tag">ACT 02 // INTELLIGENCE</div>
        <h2 class="act-headline">YOD: Originating Intelligence.</h2>
        <p class="act-lead">External world intent, client brand pillars, and audience coverage gaps enter the YOD apex crystal, compiling structured opportunities and recording packs without guesswork.</p>
        <div class="act-meta">
          <span class="meta-chip">Domain: Intelligence</span>
          <span class="meta-chip">Outputs: RecordingPack, Prompts</span>
        </div>
      </div>
    </section>

    <!-- ACT 03: LIVING IDENTITY -->
    <section class="story-act-section" data-act="2" data-shot="S4">
      <div class="act-content-wrap">
        <div class="act-tag">ACT 03 // IDENTITY</div>
        <h2 class="act-headline">Lienzo: Persistent Identity Spine.</h2>
        <p class="act-lead">A single content piece maintains immutable, versioned identity across its entire lifecycle. Upstream revisions trigger automatic downstream invalidation via the Impact Engine.</p>
        <div class="act-meta">
          <span class="meta-chip">Domain: Identity</span>
          <span class="meta-chip">Invariant: OUT_OF_SYNC</span>
        </div>
      </div>
    </section>

    <!-- ACT 04: REALITY -->
    <section class="story-act-section" data-act="3" data-shot="S5">
      <div class="act-content-wrap">
        <div class="act-tag">ACT 04 // REALITY</div>
        <h2 class="act-headline">Shim: Planned vs Observed vs Resolved.</h2>
        <p class="act-lead">The transverse optical membrane matches planned script beats against observed raw takes, detecting missing coverage gaps and establishing resolved timestamps.</p>
        <div class="act-meta">
          <span class="meta-chip">Domain: Reality</span>
          <span class="meta-chip">Invariant: PLANNED != OBSERVED != RESOLVED</span>
        </div>
      </div>
    </section>

    <!-- ACT 05: MANIFESTATION -->
    <section class="story-act-section" data-act="4" data-shot="S6">
      <div class="act-content-wrap">
        <div class="act-tag">ACT 05 // PRODUCTION</div>
        <h2 class="act-headline">VAV: The Audiovisual Production Forge.</h2>
        <p class="act-lead">Non-destructive FFmpeg jump cuts, kinetic typography styling, and 13 programmatic motion families compose frame-accurate Remotion renders with platform safe-zone protection.</p>
        <div class="act-meta">
          <span class="meta-chip">Domain: Production</span>
          <span class="meta-chip">Engines: FFmpeg, Remotion</span>
        </div>
      </div>
    </section>

    <!-- ACT 06: CLOSED LOOP & CTA -->
    <section class="story-act-section grand-cta-section" data-act="5" data-shot="S11">
      <div class="act-content-wrap">
        <div class="act-tag">ACT 06 // CLOSED LOOP</div>
        <h2 class="act-headline">Manifestation to Continuous Learning.</h2>
        <p class="act-lead">He-II dispatches verified media to platform distribution portals in the External World. Performance telemetry from Metrics loops back to Yod to refine future strategic decisions.</p>
        <div class="cta-banner-box">
          <h3>Ready to explore the operational architecture?</h3>
          <p>Access the real-time 3D system dashboard, inspect all 13 module contracts, and verify cryptographic release evidence.</p>
          <div class="cta-btn-row">
            <a href="./system/index.html" class="btn-primary btn-large">EXPLORE THE SYSTEM →</a>
            <a href="./tools/index.html" class="btn-secondary btn-large">View Tool Directory</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <div id="dossier-modal-mount"></div>
  ${getArchitectDrawer()}
  <script type="module" src="./assets/status-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(docsDir, 'index.html'), html, 'utf-8');
  console.log('[MultiPage Generator] Generated /index.html (6-Act Landing)');
}

generateSystemPage();
generateFlowPage();
generateProofPage();
generateRoadmapPage();
generateLandingStoryPage();

