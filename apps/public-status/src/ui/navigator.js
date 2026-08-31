export class SpatialNavigator {
  constructor(container, onJumpCallback) {
    this.container = container;
    this.onJump = onJumpCallback;
    this.isCollapsed = false;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="navigator-hud" id="spatial-navigator" role="region" aria-label="Spatial Pyramid Minimap Navigator">
        <div class="nav-header">
          <span class="nav-title">SPATIAL NAVIGATOR</span>
          <button class="nav-toggle-btn" id="nav-toggle-btn" aria-label="Toggle Navigator Minimap">_</button>
        </div>
        <div class="nav-content" id="nav-content">
          <div class="nav-chapter" id="nav-chapter-label">0. Genesis: HERO</div>
          <div class="nav-schematic">
            <svg viewBox="0 0 100 80" class="pyramid-svg" aria-label="Pyramid Chamber Topology Schematic">
              <polygon points="50,10 20,70 80,70" fill="none" stroke="#38bdf8" stroke-width="1.5" opacity="0.4"/>
              <line x1="50" y1="10" x2="50" y2="70" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="2,2"/>
              
              <!-- Accessible Interactive Node Groups -->
              <g role="button" tabindex="0" class="nav-node-group" data-state="2" aria-label="Jump to YOD Apex (Intelligence)">
                <circle id="nav-node-yod" cx="50" cy="15" r="4.0" class="nav-node" />
                <title>YOD // Intelligence</title>
              </g>
              <g role="button" tabindex="0" class="nav-node-group" data-state="3" aria-label="Jump to HE I Window of Intent (Operations)">
                <circle id="nav-node-he1" cx="62" cy="28" r="4.0" class="nav-node" />
                <title>HE I // Intent</title>
              </g>
              <g role="button" tabindex="0" class="nav-node-group" data-state="4" aria-label="Jump to LIENZO Identity Spine (Identity)">
                <circle id="nav-node-lienzo" cx="50" cy="40" r="4.5" class="nav-node" />
                <title>LIENZO // Identity</title>
              </g>
              <g role="button" tabindex="0" class="nav-node-group" data-state="5" aria-label="Jump to SHIM Reality Chamber (Reality)">
                <circle id="nav-node-shim" cx="38" cy="48" r="4.0" class="nav-node" />
                <title>SHIM // Reality</title>
              </g>
              <g role="button" tabindex="0" class="nav-node-group" data-state="6" aria-label="Jump to VAV Production Forge (Embodiment)">
                <circle id="nav-node-vav" cx="50" cy="58" r="4.0" class="nav-node" />
                <title>VAV // Embodiment</title>
              </g>
              <g role="button" tabindex="0" class="nav-node-group" data-state="8" aria-label="Jump to HE II Window of Manifestation (Operations)">
                <circle id="nav-node-he2" cx="65" cy="65" r="4.0" class="nav-node" />
                <title>HE II // Manifestation</title>
              </g>
            </svg>
          </div>
          <div class="nav-footer">
            <div class="nav-progress-bar"><div class="nav-progress-fill" id="nav-progress-fill"></div></div>
            <div class="nav-controls">
              <span class="nav-target-indicator" id="nav-target-tag">RELEASED CURRENT</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Toggle collapse
    const toggleBtn = document.getElementById('nav-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.isCollapsed = !this.isCollapsed;
        document.getElementById('nav-content').style.display = this.isCollapsed ? 'none' : 'block';
        toggleBtn.textContent = this.isCollapsed ? '+' : '_';
      });
    }

    // Node clicks & keyboard interaction
    this.container.querySelectorAll('.nav-node-group').forEach((grp) => {
      const handleJump = () => {
        const stateIdx = parseInt(grp.dataset.state, 10);
        if (this.onJump) this.onJump(stateIdx);
      };

      grp.addEventListener('click', handleJump);
      grp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleJump();
        }
      });
    });
  }

  updateState(shot, progressRatio) {
    const label = document.getElementById('nav-chapter-label');
    if (label && shot) {
      label.textContent = shot.label || `${shot.chapter}: ${shot.name}`;
    }

    const fill = document.getElementById('nav-progress-fill');
    if (fill) fill.style.width = `${Math.min(100, Math.max(0, progressRatio * 100))}%`;

    document.querySelectorAll('.nav-node').forEach((n) => n.classList.remove('active-nav-node'));
    if (shot && shot.nodeId) {
      const activeNode = document.getElementById(`nav-node-${shot.nodeId.toLowerCase()}`);
      if (activeNode) activeNode.classList.add('active-nav-node');
    }
  }
}
