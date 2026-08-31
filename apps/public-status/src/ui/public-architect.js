export class PublicArchitectUI {
  constructor(pyramid, qaPairs, dossierModal, modulesData) {
    this.pyramid = pyramid;
    this.qaPairs = qaPairs || [];
    this.dossiers = dossierModal;
    this.modules = modulesData || [];
    if (typeof document !== 'undefined') {
      this.init();
    }
  }

  init() {
    const input = document.getElementById('architect-input');
    const form = document.getElementById('architect-form');
    const suggestions = document.querySelectorAll('.architect-chip');

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleQuery(input.value);
      });
    }

    suggestions.forEach((chip) => {
      chip.addEventListener('click', () => {
        if (input) input.value = chip.textContent;
        this.handleQuery(chip.textContent);
      });
    });
  }

  resolveIntent(query) {
    const q = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Operational windows
    if (/\b(he\s*i|he\s*1)\b/i.test(q)) {
      return {
        type: 'MODULE_WINDOW',
        moduleId: 'HE',
        title: 'What is HE I?',
        answerEn: 'HE I is the pre-production operational window of the He Operations Core, orchestrating recording sessions, talent scheduling, and prompt packs.',
        answerEs: 'HE I es la ventana operativa de preproducción del Núcleo de Operaciones He, orquestando sesiones de grabación, calendario de talentos y paquetes de prompts.',
        node: 'HE'
      };
    }

    if (/\b(he\s*ii|he\s*2)\b/i.test(q)) {
      return {
        type: 'MODULE_WINDOW',
        moduleId: 'HE',
        title: 'What is HE II?',
        answerEn: 'HE II is the post-production manifestation window of the He Operations Core, governing master video review, multi-role QA approvals, and release gates.',
        answerEs: 'HE II es la ventana de manifestación de postproducción del Núcleo de Operaciones He, gobernando la revisión de video maestro, aprobaciones de QA y compuertas de lanzamiento.',
        node: 'HE'
      };
    }

    // 2. Specific conceptual invariants
    if (/\b(out[-_ ]of[-_ ]sync|sync|invalidation)\b/i.test(q)) {
      return {
        type: 'CONCEPT',
        moduleId: 'LIENZO',
        title: 'What is OUT_OF_SYNC Invalidation?',
        answerEn: 'OUT_OF_SYNC occurs when an upstream component is edited (incrementing its version), invalidating downstream generated derivatives while preserving prior artifacts until targeted re-render.',
        answerEs: 'OUT_OF_SYNC ocurre cuando se edita un componente ascendente (incrementando su versión), invalidando los derivados generados descendentes mientras preserva los artefactos previos.',
        node: 'LIENZO'
      };
    }

    if (/\b(planned|observed|resolved|gap|difference)\b/i.test(q)) {
      return {
        type: 'CONCEPT',
        moduleId: 'SHIM',
        title: 'Planned vs Observed vs Resolved',
        answerEn: 'Planned vs Observed vs Resolved defines the three-stage truth lifecycle of ABRAXAS: Planned defines strategic intent (Yod), Observed verifies real-source footage and detects missing coverage gaps (Shim), and Resolved locks confirmed timestamps with human authorization (He).',
        answerEs: 'Planned vs Observed vs Resolved define el ciclo de vida de la verdad.',
        node: 'SHIM'
      };
    }

    if (/\b(event|events)\b/i.test(q)) {
      return {
        type: 'MODULE',
        moduleId: 'EVENTS',
        title: 'What are Events?',
        answerEn: 'Events are immutable Domain Events recorded in the append-only Event Ledger, providing deterministic auditability and temporal state replay.',
        answerEs: 'Los eventos son eventos de dominio inmutables registrados en el libro mayor de eventos de solo adición.',
        node: 'EVENTS'
      };
    }

    if (/\b(artifact|artifacts)\b/i.test(q)) {
      return {
        type: 'MODULE',
        moduleId: 'ARTIFACTS',
        title: 'What are Artifacts?',
        answerEn: 'Artifacts are immutable, content-addressed outputs (RecordingPacks, LosslessCuts, RenderManifests) produced by deterministic stage execution.',
        answerEs: 'Los artefactos son salidas inmutables dirigidas por contenido producidas por la ejecución determinista de etapas.',
        node: 'ARTIFACTS'
      };
    }

    // 3. Dynamic module matches
    for (const mod of this.modules) {
      const baseName = mod.name.toLowerCase();
      const baseId = mod.id.toLowerCase();
      const nameNoS = baseName.replace(/s$/, '');
      const idNoS = baseId.replace(/s$/, '');

      const pattern = new RegExp(`\\b(${baseName}|${baseId}|${nameNoS}|${idNoS})\\b`, 'i');
      if (pattern.test(q)) {
        return {
          type: 'MODULE',
          moduleId: mod.id,
          title: `What is ${mod.name}?`,
          answerEn: `${mod.name} is the ${mod.domain} domain responsible for ${mod.role.toLowerCase()}. ${mod.shortDefinition || mod.responsibility}`,
          answerEs: `${mod.name} es el dominio de ${mod.domain} responsable de ${mod.role.toLowerCase()}. ${mod.shortDefinition || mod.responsibility}`,
          node: mod.id
        };
      }
    }

    const defQA = this.qaPairs.find((p) => p.id === 'what-is-abraxas') || this.qaPairs[0];
    return {
      type: 'SYSTEM',
      moduleId: null,
      title: defQA?.questionEn || 'What is ABRAXAS OS?',
      answerEn: defQA?.answerEn || 'ABRAXAS OS is an integrated operating system unifying content intelligence, operational workflow governance, and deterministic audiovisual synthesis.',
      answerEs: defQA?.answerEs || 'ABRAXAS OS es un sistema operativo integrado.',
      node: 'CORE'
    };
  }

  handleQuery(query) {
    if (!query || !query.trim()) return;

    if (this.pyramid && this.pyramid.triggerArchitectQuery) {
      this.pyramid.triggerArchitectQuery();
    }
    const res = this.resolveIntent(query);

    const responseContainer = document.getElementById('architect-response');
    if (responseContainer) {
      responseContainer.innerHTML = `
        <div class="architect-bubble">
          <div class="bubble-tag">PUBLIC ARCHITECT &bull; VERIFIED DETERMINISTIC ANSWER</div>
          <p class="bubble-text"><strong>${res.title}</strong></p>
          <p class="bubble-text">${res.answerEn}</p>
          <p class="bubble-text es-trans"><em>${res.answerEs}</em></p>
          ${res.moduleId ? `<button class="btn-dossier-jump" id="architect-dossier-btn" data-mid="${res.moduleId}">Open ${res.moduleId} Dossier &rarr;</button>` : ''}
        </div>
      `;

      const dossierBtn = document.getElementById('architect-dossier-btn');
      if (dossierBtn && this.dossiers) {
        dossierBtn.addEventListener('click', () => {
          this.dossiers.open(res.moduleId, dossierBtn);
        });
      }
    }

    if (res.node && this.pyramid && this.pyramid.focusModule) {
      this.pyramid.focusModule(res.node);
    }
  }
}
