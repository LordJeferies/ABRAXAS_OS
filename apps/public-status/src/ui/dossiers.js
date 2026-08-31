export class ModuleDossierModal {
  constructor(container, modulesData) {
    this.container = container;
    this.modules = modulesData || [];
    this.currentModule = null;
    this.launcherElement = null;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="dossier-overlay" id="dossier-overlay" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="dossier-title">
        <div class="dossier-card" id="dossier-card">
          <div class="dossier-header">
            <div class="dossier-title-box">
              <div class="dossier-badge-row">
                <span class="dossier-badge" id="dossier-badge">STATUS</span>
                <span class="dossier-truth-layer" id="dossier-truth-layer">TRUTH LAYER</span>
              </div>
              <h2 class="dossier-title" id="dossier-title">Module Title</h2>
              <span class="dossier-subtitle" id="dossier-subtitle">Domain</span>
            </div>
            <button class="dossier-close-btn" id="dossier-close" aria-label="Close Module Dossier">&times;</button>
          </div>
          <div class="dossier-body" id="dossier-body" tabindex="0">
            <!-- 15-point deep content rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    document.getElementById('dossier-close').addEventListener('click', () => this.close());
    document.getElementById('dossier-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'dossier-overlay') this.close();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('dossier-overlay').style.display !== 'none') {
        this.close();
      }
    });
  }

  open(moduleId, launcher = null) {
    const mod = this.modules.find((m) => m.id === moduleId);
    if (!mod) return;

    this.currentModule = mod;
    this.launcherElement = launcher;

    document.getElementById('dossier-badge').textContent = mod.status || 'STATUS';
    document.getElementById('dossier-truth-layer').textContent = mod.truthLayer || 'POST_RC1_CANDIDATE';
    document.getElementById('dossier-title').textContent = `${mod.name} (${mod.id})`;
    document.getElementById('dossier-subtitle').textContent = `${mod.domain} Domain — ${mod.role}`;

    const body = document.getElementById('dossier-body');
    body.innerHTML = `
      <div class="dossier-section">
        <h4 class="dossier-sec-title">1. WHAT & 2. WHY</h4>
        <p><strong>1. What:</strong> ${mod.shortDefinition || mod.responsibility}</p>
        <p style="margin-top:0.4rem;"><strong>2. Why:</strong> ${mod.why || 'Enforces deterministic domain ownership and architecture truth.'}</p>
      </div>

      <div class="dossier-grid">
        <div class="dossier-col">
          <h4 class="dossier-sec-title">3. OWNS</h4>
          <ul>${(mod.owns || []).map((o) => `<li>${o}</li>`).join('') || `<li>${mod.responsibility}</li>`}</ul>
        </div>
        <div class="dossier-col">
          <h4 class="dossier-sec-title">4. DOES NOT OWN</h4>
          <ul>${(mod.doesNotOwn || ['Does not own external subsystem states.']).map((d) => `<li>${d}</li>`).join('')}</ul>
        </div>
      </div>

      <div class="dossier-grid">
        <div class="dossier-col">
          <h4 class="dossier-sec-title">5. INPUTS</h4>
          <ul>${(mod.inputs || []).map((i) => `<li>${i}</li>`).join('') || '<li>Not yet publicly evidenced</li>'}</ul>
        </div>
        <div class="dossier-col">
          <h4 class="dossier-sec-title">6. OUTPUTS</h4>
          <ul>${(mod.outputs || []).map((o) => `<li>${o}</li>`).join('') || '<li>Not yet publicly evidenced</li>'}</ul>
        </div>
      </div>

      <div class="dossier-section">
        <h4 class="dossier-sec-title">7. CURRENT STATUS & 8. TARGET ARCHITECTURE</h4>
        <p><strong>7. Current Status:</strong> <code>${mod.status}</code> — ${mod.statusDetail || 'Verified.'}</p>
        <p style="margin-top:0.4rem;"><strong>8. Target Architecture:</strong> ${(mod.targetCapabilities || ['Continuous scale and automated clustering.']).join('; ')}</p>
      </div>

      <div class="dossier-section">
        <h4 class="dossier-sec-title">9. SYSTEM CONNECTIONS</h4>
        <p>${(mod.connections || []).join('; ') || 'Connected across canonical core loop.'}</p>
      </div>

      <div class="dossier-grid">
        <div class="dossier-col">
          <h4 class="dossier-sec-title">10. EVENT FOOTPRINT</h4>
          <ul>${(mod.eventFootprint || []).map((e) => `<li><code>${e}</code></li>`).join('') || '<li>Not yet publicly evidenced</li>'}</ul>
        </div>
        <div class="dossier-col">
          <h4 class="dossier-sec-title">11. ARTIFACT FOOTPRINT</h4>
          <ul>${(mod.artifactFootprint || []).map((a) => `<li><code>${a}</code></li>`).join('') || '<li>Not yet publicly evidenced</li>'}</ul>
        </div>
      </div>

      <div class="dossier-section">
        <h4 class="dossier-sec-title">12. EXAMPLE FLOW</h4>
        <p>${mod.exampleFlow || 'State transition executed across verified lifecycle.'}</p>
      </div>

      <div class="dossier-section">
        <h4 class="dossier-sec-title">13. EVIDENCE</h4>
        <p>${(mod.evidenceRefs || []).map((r) => `<span class="evidence-tag">${r}</span>`).join(' ') || '<span>Not yet publicly evidenced</span>'}</p>
      </div>

      <div class="dossier-grid">
        <div class="dossier-col">
          <h4 class="dossier-sec-title">14. BOUNDED DEBT</h4>
          <ul>${(mod.boundedDebt || ['Zero uncontained technical debt.']).map((b) => `<li>${b}</li>`).join('')}</ul>
        </div>
        <div class="dossier-col">
          <h4 class="dossier-sec-title">15. ROADMAP MILESTONES</h4>
          <ul>${(mod.roadmapRefs || ['Milestone verified.']).map((r) => `<li>${r}</li>`).join('')}</ul>
        </div>
      </div>
    `;

    document.getElementById('dossier-overlay').style.display = 'flex';
    document.getElementById('dossier-body').focus();
  }

  close() {
    document.getElementById('dossier-overlay').style.display = 'none';
    if (this.launcherElement) {
      this.launcherElement.focus();
    }
  }
}
