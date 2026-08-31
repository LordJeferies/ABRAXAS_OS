export class ModeManager {
  constructor(pyramid, dossierModal, blueprintsData, modulesData, evidenceData, appState) {
    this.pyramid = pyramid;
    this.dossiers = dossierModal;
    this.blueprints = blueprintsData || [];
    this.modules = modulesData || [];
    this.evidence = evidenceData || [];
    this.appState = appState;
    this.activeMode = 'STORY';
    this.isTarget = false;

    this.initEventListeners();
    this.renderSystemDirectory();
    this.renderFlowBlueprints();
  }

  initEventListeners() {
    document.querySelectorAll('.mode-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const mode = e.target.dataset.mode;
        this.switchMode(mode);
      });
    });

    const targetToggle = document.getElementById('target-mode-toggle');
    if (targetToggle) {
      targetToggle.addEventListener('change', (e) => {
        this.setTargetMode(e.target.checked);
      });
    }
  }

  setTargetMode(isTarget) {
    this.isTarget = isTarget;
    const toggle = document.getElementById('target-mode-toggle');
    if (toggle) toggle.checked = isTarget;
    if (this.pyramid && this.pyramid.setTargetMode) {
      this.pyramid.setTargetMode(this.isTarget);
    }
    if (this.appState) {
      this.appState.truthView = this.isTarget ? 'TARGET' : 'CURRENT';
    }

    const tag = document.getElementById('nav-target-tag');
    if (tag) tag.textContent = this.isTarget ? 'TARGET BLUEPRINTS' : 'RELEASED CURRENT';

    document.querySelectorAll('.module-truth-tag, .truth-pill').forEach((t) => {
      if (t.classList.contains('target-mode-sensitive')) {
        t.style.display = this.isTarget ? 'inline-block' : 'none';
      }
    });
  }

  switchMode(mode) {
    this.activeMode = mode;
    if (this.appState) this.appState.mode = mode;

    document.querySelectorAll('.mode-tab-btn').forEach((b) => {
      const isActive = b.dataset.mode === mode;
      b.classList.toggle('active-mode', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.mode-view-container').forEach((c) => {
      c.style.display = 'none';
    });

    const view = document.getElementById(`mode-view-${mode.toLowerCase()}`);
    if (view) view.style.display = 'block';

    if (this.pyramid && this.pyramid.setMode) {
      this.pyramid.setMode(mode);
    }
  }

  renderSystemDirectory() {
    const listContainer = document.getElementById('system-directory-list');
    if (!listContainer || this.modules.length === 0) return;

    listContainer.innerHTML = '';
    this.modules.forEach((mod, idx) => {
      const item = document.createElement('div');
      item.className = `directory-item ${idx === 0 ? 'active' : ''}`;
      item.dataset.moduleId = mod.id;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');

      const truthClass = mod.truthLayer ? mod.truthLayer.toLowerCase() : 'post_rc1_candidate';

      item.innerHTML = `
        <div>
          <div class="item-name">${mod.name}</div>
          <div class="item-domain">${mod.domain}</div>
        </div>
        <span class="truth-pill ${truthClass}">${(mod.truthLayer || 'PLANNED').replace(/_/g, ' ')}</span>
      `;

      item.addEventListener('click', () => {
        this.selectModule(mod.id);
        if (this.pyramid && this.pyramid.focusModule) {
          this.pyramid.focusModule(mod.id);
        }
      });

      listContainer.appendChild(item);
    });

    if (this.modules.length > 0) {
      this.selectModule(this.modules[0].id);
    }
  }

  selectModule(modId) {
    const mod = this.modules.find((m) => m.id === modId) || this.modules[0];
    const summaryContainer = document.getElementById('system-active-summary');
    const listContainer = document.getElementById('system-directory-list');
    if (!mod || !summaryContainer) return;

    if (listContainer) {
      listContainer.querySelectorAll('.directory-item').forEach((it) => {
        const isActive = it.dataset.moduleId === mod.id;
        it.classList.toggle('active', isActive);
      });
    }

    if (this.appState) {
      this.appState.activeModule = mod.id;
    }

    const slug = mod.id.toLowerCase().replace(/_/g, '-');
    const isSubdir = window.location.pathname.includes('/system') || window.location.pathname.includes('/flow');
    const prefix = isSubdir ? '../' : './';
    const truthClass = mod.truthLayer ? mod.truthLayer.toLowerCase() : 'post_rc1_candidate';

    summaryContainer.innerHTML = `
      <div class="inspector-header">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
          <span class="domain-badge">${mod.domain}</span>
          <span class="truth-pill ${truthClass}">${(mod.truthLayer || 'PLANNED').replace(/_/g, ' ')}</span>
        </div>
        <h3 class="inspector-title summary-title">${mod.name}</h3>
        <p class="inspector-role">${mod.role}</p>
      </div>

      <div class="inspector-section">
        <h4>Responsibility</h4>
        <p>${mod.responsibility || mod.shortDefinition}</p>
      </div>

      <div class="inspector-section">
        <h4>Inputs &amp; Outputs</h4>
        <p><strong>In:</strong> ${(mod.inputs || []).join(', ') || 'N/A'}</p>
        <p><strong>Out:</strong> ${(mod.outputs || []).join(', ') || 'N/A'}</p>
      </div>

      <div class="inspector-section">
        <h4>Current Status</h4>
        <p class="status-detail-text">${mod.statusDetail || mod.status}</p>
      </div>

      <a href="${prefix}tools/${slug}/index.html" class="inspector-deep-btn">VIEW FULL TOOL PAGE →</a>
    `;

    window.location.hash = `#system/${mod.id.toLowerCase()}`;
  }

  renderFlowBlueprints() {
    const selectorContainer = document.getElementById('flow-blueprint-selector');
    if (!selectorContainer || this.blueprints.length === 0) return;

    selectorContainer.innerHTML = '';
    this.blueprints.forEach((bp, idx) => {
      const item = document.createElement('div');
      item.className = `blueprint-item ${idx === 0 ? 'active' : ''}`;
      item.dataset.blueprintId = bp.id;
      item.innerHTML = `
        <div class="bp-id">${bp.name || bp.id}</div>
        <div class="bp-stages-count">${(bp.stages || []).length} Stages • ${bp.executionState || 'DETERMINISTIC'}</div>
      `;

      item.addEventListener('click', () => {
        this.selectBlueprint(bp.id);
      });

      selectorContainer.appendChild(item);
    });

    if (this.blueprints.length > 0) {
      this.selectBlueprint(this.blueprints[0].id);
    }
  }

  selectBlueprint(bpId) {
    const bp = this.blueprints.find((b) => b.id === bpId) || this.blueprints[0];
    if (!bp) return;

    if (this.appState) {
      this.appState.selectedBlueprintId = bp.id;
    }

    const selectorContainer = document.getElementById('flow-blueprint-selector');
    if (selectorContainer) {
      selectorContainer.querySelectorAll('.blueprint-item').forEach((it) => {
        it.classList.toggle('active', it.dataset.blueprintId === bp.id);
      });
    }

    const metaContainer = document.getElementById('flow-active-metadata');
    if (metaContainer) {
      metaContainer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span class="truth-pill released_current">${bp.executionState || 'VERIFIED'}</span>
          <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan);">${(bp.stages || []).length} Total Stages</span>
        </div>
        <h2 style="font-family:var(--font-headline); font-size:1.4rem; margin-bottom:0.4rem;">${bp.name || bp.id}</h2>
        <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.5; margin-bottom:1rem;">${bp.description}</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-family:var(--font-mono); font-size:0.75rem;">
          <div><span style="color:var(--text-muted);">Required Inputs:</span> <code>${(bp.inputs || []).join(', ')}</code></div>
          <div><span style="color:var(--text-muted);">Terminal Output:</span> <code>${(bp.terminalOutputs || []).join(', ')}</code></div>
        </div>
      `;
    }

    const timelineContainer = document.getElementById('flow-stages-timeline');
    if (timelineContainer) {
      timelineContainer.innerHTML = (bp.stages || []).map((stage, sIdx) => `
        <div class="stage-row">
          <span class="stage-id">0${sIdx + 1}</span>
          <span class="stage-owner-chip">${stage.owner}</span>
          <span class="stage-desc">${stage.name || stage.stageId}</span>
          <span class="stage-artifact">${stage.terminalArtifact || 'OK'}</span>
        </div>
      `).join('');
    }

    if (this.pyramid) {
      this.pyramid.activeBlueprint = bp;
    }

    window.location.hash = `#flow/${bp.id.toLowerCase()}`;
  }
}
