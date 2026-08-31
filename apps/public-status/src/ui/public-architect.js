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
    if (!query) return this.getDefaultResponse();
    const q = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Four Worlds
    if (/\b(four worlds|cuatro mundos|atziluth|beriah|yetzirah|assiah)\b/i.test(q)) {
      return {
        type: 'ARCHITECTURE',
        moduleId: 'CORE',
        title: 'The Four Worlds Architecture // Los Cuatro Mundos',
        answerEn: 'The Four Worlds framework structures reality from pure potential to manifestation: Atziluth (Emanation / YOD Apex), Beri\'ah (Creation / Contenido Crystal), Yetzirah (Formation / VAV Synthesis Forge), and Assiah (Manifestation / HE Operations).',
        answerEs: 'El marco de los Cuatro Mundos estructura la realidad desde el potencial puro hasta la manifestación: Atziluth (Emanación / Ápice YOD), Beri\'ah (Creación / Cristal Contenido), Yetzirah (Formación / Fragua de Síntesis VAV) y Assiah (Manifestación / Operaciones HE).',
        node: 'CORE'
      };
    }

    // 2. Dimension A / Cognitive Stratigraphy
    if (/\b(dimension a|dimensión a|stratigraphy|estratigrafia|learning loop)\b/i.test(q)) {
      return {
        type: 'ARCHITECTURE',
        moduleId: 'CONTENIDO',
        title: 'Adaptive Dimension A // Dimensión A',
        answerEn: 'Dimension A represents cognitive stratigraphy: memory, learning signals, and criteria refinement over time. It preserves provenance lineage and revision history without silently mutating source content data.',
        answerEs: 'La Dimensión A representa la estratigrafía cognitiva: memoria, señales de aprendizaje y refinamiento de criterios en el tiempo. Preserva el linaje de procedencia y el historial de revisiones sin mutar silenciosamente los datos de contenido fuente.',
        node: 'CONTENIDO'
      };
    }

    // 3. Current vs Target
    if (/\b(current vs target|current|target|objetivo|actual vs objetivo)\b/i.test(q)) {
      return {
        type: 'SYSTEM',
        moduleId: 'CORE',
        title: 'CURRENT vs TARGET Architecture // Estado Actual vs Objetivo',
        answerEn: 'CURRENT shows only cryptographically verified runtime capabilities (HE, VAV, Public Architect). TARGET displays the full architectural vision (Pipeline DAGs, AI Runtime, Publishing, Metrics) while preserving honest truth layer distinctions.',
        answerEs: 'CURRENT muestra únicamente las capacidades de ejecución verificadas criptográficamente (HE, VAV, Public Architect). TARGET despliega la visión arquitectónica completa (DAGs de Pipeline, AI Runtime, Publishing, Metrics) preservando las distinciones honestas de verdad.',
        node: 'CORE'
      };
    }

    // 4. Publishing Implementation Status
    if (/\b(publishing|publicacion|publish|is publishing implemented|esta implementado publishing)\b/i.test(q)) {
      return {
        type: 'MODULE',
        moduleId: 'PUBLISHING',
        title: 'Publishing Implementation Status // Estado de Publishing',
        answerEn: 'Publishing is currently CONTRACT_ONLY (Design Phase). It defines multi-platform distribution contracts and export manifests projecting from the Pyramid to external channels, but does not yet have live third-party API runtime integration in v1.0.0-rc1.',
        answerEs: 'Publishing está actualmente en CONTRACT_ONLY (Fase de Diseño). Define contratos de distribución multiplataforma y manifiestos de exportación proyectados hacia canales externos, pero aún no tiene integración de API de terceros en vivo en v1.0.0-rc1.',
        node: 'PUBLISHING'
      };
    }

    // 5. Pipeline Engine
    if (/\b(pipeline engine|pipeline|motor de pipeline|blueprints)\b/i.test(q)) {
      return {
        type: 'MODULE',
        moduleId: 'PIPELINE_ENGINE',
        title: 'Pipeline Engine // Motor de Pipeline',
        answerEn: 'The Pipeline Engine is currently CONTRACT_ONLY (Design Registry). It defines 11 canonical lifecycle DAG blueprints specifying stage transitions from intake to publication, validated via schemas rather than an active execution daemon.',
        answerEs: 'El Motor de Pipeline está actualmente en CONTRACT_ONLY (Registro de Diseño). Define 11 blueprints de DAG canónicos que especifican transiciones de etapas desde el ingreso hasta la publicación, validados mediante esquemas.',
        node: 'PIPELINE_ENGINE'
      };
    }

    // 6. OUT_OF_SYNC Invalidation
    if (/\b(out[-_ ]of[-_ ]sync|sync|invalidation|desincronizado)\b/i.test(q)) {
      return {
        type: 'CONCEPT',
        moduleId: 'CONTENIDO',
        title: 'What is OUT_OF_SYNC Invalidation? // ¿Qué es OUT_OF_SYNC?',
        answerEn: 'OUT_OF_SYNC occurs when an upstream component is edited (incrementing its version), invalidating downstream generated derivatives while preserving prior artifacts until targeted re-render.',
        answerEs: 'OUT_OF_SYNC ocurre cuando se edita un componente ascendente (incrementando su versión), invalidando los derivados generados descendentes mientras preserva los artefactos previos hasta un re-renderizado dirigido.',
        node: 'CONTENIDO'
      };
    }

    // 7. SHIM / Planned vs Observed
    if (/\b(shim|planned|observed|resolved|gap|discrepancia)\b/i.test(q)) {
      return {
        type: 'MODULE',
        moduleId: 'SHIM',
        title: 'SHIM: Planned vs Observed vs Resolved // SHIM y Metrología',
        answerEn: 'SHIM is the Da\'at Metrology operator. It observes real recorded audio/video, aligns speech transcripts against scripted intent, and strictly detects missing coverage gaps rather than hallucinating content.',
        answerEs: 'SHIM es el operador de metrología en Da\'at. Observa audio y video reales grabados, alinea transcripciones con la intención guionada y detecta brechas de cobertura en lugar de alucinar contenido.',
        node: 'SHIM'
      };
    }

    // 8. HE / Operations
    if (/\b(he|governance|gobernanza|tasks|tareas|calendar|recording)\b/i.test(q)) {
      return {
        type: 'MODULE',
        moduleId: 'HE',
        title: 'HE Operations Core // Núcleo Operativo HE',
        answerEn: 'HE is RELEASED_CURRENT in v1.0.0-rc1. It governs operational visibility: tasks, recording sessions, deadlines, talent calendar, multi-role review workflows, and approval gates.',
        answerEs: 'HE está en estado RELEASED_CURRENT en v1.0.0-rc1. Gobierna la visibilidad operativa: tareas, sesiones de grabación, fechas límite, calendario de talentos, flujos de revisión multi-rol y compuertas de aprobación.',
        node: 'HE'
      };
    }

    // 9. YOD / Intelligence
    if (/\b(yod|intelligence|radar|criteria|criterio|brand voice)\b/i.test(q)) {
      return {
        type: 'MODULE',
        moduleId: 'YOD',
        title: 'YOD Intelligence Apex // Ápice de Inteligencia YOD',
        answerEn: 'YOD operates in the Golden Emanation Chamber (Atziluth). It evaluates opportunity radar scoring, brand voice criteria, and hook taxonomies before content is produced.',
        answerEs: 'YOD opera en la Cámara de Emanación Dorada (Atziluth). Evalúa puntuaciones de radar de oportunidad, criterios de voz de marca y taxonomías de hooks antes de producir el contenido.',
        node: 'YOD'
      };
    }

    // 10. Contenido / Lienzo
    if (/\b(contenido|lienzo|identity|identidad|dag|persistent)\b/i.test(q)) {
      return {
        type: 'MODULE',
        moduleId: 'CONTENIDO',
        title: 'Contenido (Domain Core) // Contenido e Identidad',
        answerEn: 'Contenido is the single-piece content entity preserving identity, revision lineage, and stage states across all drafts, cuts, and distribution variants via a content-addressed DAG.',
        answerEs: 'Contenido es la entidad de pieza única que preserva identidad, linaje de revisiones y estados de etapa a través de todos los borradores, cortes y variantes de distribución mediante un DAG.',
        node: 'CONTENIDO'
      };
    }

    // 11. VAV / Synthesis
    if (/\b(vav|synthesis|cuts|captions|motions|remotion|ffmpeg)\b/i.test(q)) {
      return {
        type: 'MODULE',
        moduleId: 'VAV',
        title: 'VAV Synthesis Core // Núcleo de Síntesis VAV',
        answerEn: 'VAV is RELEASED_CURRENT in v1.0.0-rc1. It executes non-destructive FFmpeg jump-cuts, kinetic typography styling, and Remotion motion graphics inside platform safe zones.',
        answerEs: 'VAV está en estado RELEASED_CURRENT en v1.0.0-rc1. Ejecuta cortes no destructivos con FFmpeg, estilos de tipografía cinética y gráficos en movimiento con Remotion.',
        node: 'VAV'
      };
    }

    return this.getDefaultResponse();
  }

  getDefaultResponse() {
    return {
      type: 'SYSTEM',
      moduleId: 'CORE',
      title: 'ABRAXAS OS Overview // Visión General de ABRAXAS OS',
      answerEn: 'ABRAXAS OS unifies strategic content intelligence (YOD), operational workflow governance (HE), and deterministic audiovisual synthesis (VAV) into a closed-loop operating system.',
      answerEs: 'ABRAXAS OS unifica inteligencia estratégica de contenido (YOD), gobernanza de flujos operativos (HE) y síntesis audiovisual determinista (VAV) en un sistema operativo de ciclo cerrado.',
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
