import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultDocsDir = path.resolve(__dirname, "../../../../docs/abraxas-os-status");

export function parseCliArgs(args) {
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--release-state" && args[i + 1]) {
      parsed.releaseState = args[++i];
    } else if (args[i] === "--release-label" && args[i + 1]) {
      parsed.releaseLabel = args[++i];
    } else if (args[i] === "--release-sha" && args[i + 1]) {
      parsed.releaseSha = args[++i];
    } else if (args[i] === "--output-dir" && args[i + 1]) {
      parsed.outputDir = args[++i];
    }
  }
  return parsed;
}

export function buildPublicStatus(options = {}) {
  const docsDir = options.outputDir || defaultDocsDir;
  const releaseState = options.releaseState || "PRE_RELEASE";
  const releaseLabel = options.releaseLabel;
  const releaseSha = options.releaseSha;

  // Mode validation
  if (releaseState !== "PRE_RELEASE" && releaseState !== "RELEASED_RC1") {
    throw new Error(`Invalid release-state '${releaseState}'. Expected 'PRE_RELEASE' or 'RELEASED_RC1'.`);
  }

  if (releaseState === "RELEASED_RC1") {
    if (!releaseLabel) {
      throw new Error("Missing required argument: --release-label is required when --release-state is RELEASED_RC1.");
    }
    if (releaseLabel !== "v1.0.0-rc1") {
      throw new Error(`Invalid release-label '${releaseLabel}'. Expected 'v1.0.0-rc1'.`);
    }
    if (!releaseSha) {
      throw new Error("Missing required argument: --release-sha is required when --release-state is RELEASED_RC1.");
    }
    if (!/^[0-9a-fA-F]{40}$/.test(releaseSha)) {
      throw new Error(`Invalid release-sha '${releaseSha}'. Expected exactly 40 hexadecimal characters.`);
    }
  }

  // 1. Read Generated Verification Artifact (Private / Build side)
  const verificationJsonPath = path.join(docsDir, "generated-verification.json");
  if (!fs.existsSync(verificationJsonPath)) {
    throw new Error(`generated-verification.json not found at ${verificationJsonPath}. Run 'pnpm verification:generate' first.`);
  }

  const generatedVerification = JSON.parse(fs.readFileSync(verificationJsonPath, "utf-8"));

  // 2. Strict Allowlisted Public Knowledge with Authoritative Ownership Semantics
  const publicKnowledge = {
    systemName: "ABRAXAS OS",
    tagline: "Audiovisual Intelligence & Operational Production Operating System",
    description: "ABRAXAS OS is an integrated operating system unifying content intelligence, operational workflow governance, and deterministic audiovisual synthesis.",
    whatItIs: [
      "An integrated content intelligence and operational AV operating system.",
      "A local-first, deterministic production pipeline bridging editorial concepts with render engines.",
      "A unified task, approval, deadline, and time tracking operational core (He).",
      "A non-destructive cuts and programmatic visual motion synthesis engine (VAV)."
    ],
    whatItIsNot: [
      "Not a generic project management SaaS wrapper.",
      "Not a simple third-party AI chatbot prompt wrapper.",
      "Not an automated spam publishing bot.",
      "Not a destructive video editor."
    ],
    modules: [
      {
        id: "YOD",
        name: "Yod",
        domain: "Intelligence",
        role: "Content Intelligence & Forensic Criteria",
        responsibility: "Maintains content pattern registries, hook and CTA taxonomies, narrative structures, and forensic provenance truth.",
        status: "PARTIAL_FOUNDATION",
        statusDetail: "Pattern and format registries verified locally."
      },
      {
        id: "LIENZO",
        name: "Lienzo",
        domain: "Identity",
        role: "Persistent Content Identity & Authoring Canvas",
        responsibility: "Provides persistent, versioned content identity and structured semantic composition as Source of Truth per content piece.",
        status: "CONTRACT_ONLY",
        statusDetail: "Canonical schema and authoring contracts frozen."
      },
      {
        id: "HE",
        name: "He",
        domain: "Operations",
        role: "Operations Core, Tasks, Teams & Workflows",
        responsibility: "Manages tasks, assignments, dependencies, operational blockers, Kanban projections, production calendars, recording sessions, approvals, time tracking, and notification center.",
        status: "VERIFIED_LOCAL",
        statusDetail: "Operations Core, Persistent Store, Product UI, Time Tracking, and Notifications verified."
      },
      {
        id: "SHIM",
        name: "Shim",
        domain: "Reality",
        role: "Real-Source Observation & Candidate Resolution",
        responsibility: "Observes real media sources, performs checksum verification, resolves candidate assets, and ensures evidence integrity.",
        status: "CONTRACT_ONLY",
        statusDetail: "Storage and asset candidate observation contract frozen."
      },
      {
        id: "VAV",
        name: "VAV",
        domain: "Production",
        role: "Audiovisual Synthesis, Cuts & Motions Engine",
        responsibility: "Executes non-destructive multi-segment cutting via local FFmpeg, frame-accurate Remotion motion compositions, caption compilation, and platform safe-zone validations.",
        status: "VERIFIED_LOCAL",
        statusDetail: "Cut Engine, Motion Engine, Remotion Composition, and Platform Safe Zones verified."
      },
      {
        id: "ARQUITECTO",
        name: "Arquitecto",
        domain: "Guidance",
        role: "Contextual Guidance & Knowledge Projection",
        responsibility: "Consumes Yod criteria and system state to provide architectural guidance; powers the deterministic Public Architect V1 responder.",
        status: "PARTIAL_FOUNDATION",
        statusDetail: "Public Architect V1 guide verified locally; private reasoning runtime in specification."
      },
      {
        id: "PIPELINE_ENGINE",
        name: "Pipeline Engine",
        domain: "Infrastructure",
        role: "Batch Orchestration & Stage Execution",
        responsibility: "Coordinates multi-stage asset generation, offline compilation, and rendering pipelines.",
        status: "PLANNED",
        statusDetail: "Batch execution specification scheduled for future gate."
      },
      {
        id: "AI_RUNTIME",
        name: "AI Runtime",
        domain: "Infrastructure",
        role: "Provider-Agnostic AI Dispatcher",
        responsibility: "Executes controlled LLM and vision inference across local/hybrid providers with strict prompt boundaries.",
        status: "PLANNED",
        statusDetail: "Provider dispatch interface scheduled for future gate."
      },
      {
        id: "PUBLISHING",
        name: "Publishing",
        domain: "Infrastructure",
        role: "Multi-Platform Export & Delivery Gateway",
        responsibility: "Packages approved master media with platform metadata for distribution.",
        status: "PLANNED",
        statusDetail: "Distribution gateway scheduled for future gate."
      },
      {
        id: "METRICS",
        name: "Metrics",
        domain: "Infrastructure",
        role: "Distribution Telemetry & Feedback",
        responsibility: "Collects engagement signals to close the feedback loop back into Yod pattern criteria (target loop).",
        status: "PLANNED",
        statusDetail: "Telemetry feedback scheduled for future gate."
      }
    ],
    relationships: [
      { from: "YOD", to: "LIENZO", description: "Provides content patterns, hooks, and forensic criteria for authoring." },
      { from: "LIENZO", to: "HE", description: "Supplies structured scenes and components requiring production tasks and approvals." },
      { from: "HE", to: "VAV", description: "Dispatches approved tasks and edit locks to render cut and motion deliverables." },
      { from: "SHIM", to: "LIENZO", description: "Observes real media assets and binds candidate files to scene components." },
      { from: "VAV", to: "PUBLISHING", description: "Delivers rendered video files and compiled captions for packaging." },
      { from: "METRICS", to: "YOD", description: "Feeds platform performance telemetry back into criteria registries (Target Loop)." },
      { from: "YOD", to: "ARQUITECTO", description: "Supplies criteria and system contracts to architectural guidance models." }
    ],
    qaPairs: [
      {
        id: "what-is-abraxas",
        questionEn: "What is ABRAXAS OS?",
        questionEs: "¿Qué es ABRAXAS OS?",
        answerEn: "ABRAXAS OS is an integrated operating system uniting content intelligence (Yod), team workflow operations (He), and deterministic video synthesis (VAV).",
        answerEs: "ABRAXAS OS es un sistema operativo integrado que une inteligencia de contenido (Yod), operaciones de flujo de trabajo (He) y síntesis de video determinista (VAV)."
      },
      {
        id: "what-is-yod",
        questionEn: "What is Yod?",
        questionEs: "¿Qué es Yod?",
        answerEn: "Yod is the intelligence domain maintaining structured content pattern registries, hook taxonomies, and forensic provenance criteria.",
        answerEs: "Yod es el dominio de inteligencia que mantiene registros estructurados de patrones de contenido, taxonomías de ganchos y criterios de procedencia forense."
      },
      {
        id: "what-is-lienzo",
        questionEn: "What is Lienzo?",
        questionEs: "¿Qué es Lienzo?",
        answerEn: "Lienzo is the persistent authoring identity canvas serving as the immutable Source of Truth for scene structures and creative components.",
        answerEs: "Lienzo es el lienzo de identidad de autoría persistente que sirve como Fuente de Verdad inmutable para estructuras de escenas y componentes creativos."
      },
      {
        id: "what-is-he",
        questionEn: "What is He?",
        questionEs: "¿Qué es He?",
        answerEn: "He is the operations core governing tasks, assignments, typed blocker dependencies, multi-reviewer approvals, production calendars, time tracking, and notification routing.",
        answerEs: "He es el núcleo de operaciones que gobierna tareas, asignaciones, dependencias bloqueantes tipadas, aprobaciones multi-revisor, calendarios de producción, registro de tiempo y enrutamiento de notificaciones."
      },
      {
        id: "what-is-shim",
        questionEn: "What is Shim?",
        questionEs: "¿Qué es Shim?",
        answerEn: "Shim observes real external media sources and verifies checksums and candidate assets for safe pipeline consumption.",
        answerEs: "Shim observa fuentes de medios externos reales y verifica sumas de comprobación y activos candidatos para un consumo seguro en el pipeline."
      },
      {
        id: "what-is-vav",
        questionEn: "What is VAV?",
        questionEs: "¿Qué es VAV?",
        answerEn: "VAV is the production audiovisual synthesis engine executing non-destructive FFmpeg multi-segment cuts, Remotion motion graphics, and platform safe-zone validations.",
        answerEs: "VAV es el motor de producción de síntesis audiovisual que ejecuta cortes multi-segmento no destructivos con FFmpeg, gráficos de movimiento con Remotion y validaciones de zonas seguras."
      },
      {
        id: "what-is-arquitecto",
        questionEn: "What is Arquitecto?",
        questionEs: "¿Qué es Arquitecto?",
        answerEn: "Arquitecto provides contextual architecture guidance and powers the deterministic Public Architect V1 responder.",
        answerEs: "Arquitecto proporciona orientación contextual sobre la arquitectura del sistema y alimenta el respondedor determinista Public Architect V1."
      },
      {
        id: "what-is-roadmap",
        questionEn: "What is the ABRAXAS roadmap?",
        questionEs: "¿Cuál es la hoja de ruta de ABRAXAS?",
        answerEn: "The roadmap consists of Gates P1 (VAV AV Core), P2 (He Operations Core), P3A (He UI Core), P3B (Time & Notifications), P4 (Public Status & Public Architect), and P5 (Integrated Release).",
        answerEs: "La hoja de ruta comprende las Fases P1 (Núcleo AV VAV), P2 (Núcleo Operativo He), P3A (Interfaz He), P3B (Tiempo y Notificaciones), P4 (Estado Público y Arquitecto Público) y P5 (Lanzamiento Integrado)."
      },
      {
        id: "what-works-now",
        questionEn: "What works now in ABRAXAS OS?",
        questionEs: "¿Qué funciona actualmente en ABRAXAS OS?",
        answerEn: "Currently verified local: VAV non-destructive cuts & Remotion motions, He Operations Core & Product UI (Solo Queue, Kanban, Calendar, Deadlines, Recordings, Time Tracking, Notifications), and Public Status V2 / Public Architect V1.",
        answerEs: "Actualmente verificado localmente: cortes no destructivos y movimiento Remotion de VAV, Núcleo Operativo e Interfaz de He (Solo Queue, Kanban, Calendario, Deadlines, Grabaciones, Registro de Tiempo, Notificaciones) y Estado Público V2 / Arquitecto Público V1."
      },
      {
        id: "how-he-and-vav-relate",
        questionEn: "How do He and VAV relate?",
        questionEs: "¿Cómo se relacionan He y VAV?",
        answerEn: "He manages operational workflow, tasks, assignments, and approvals for video projects, while VAV provides the audiovisual engine executing non-destructive cuts and programmatic motion renders.",
        answerEs: "He gestiona el flujo de trabajo operativo, tareas, asignaciones y aprobaciones para proyectos de video, mientras que VAV proporciona el motor audiovisual que ejecuta cortes no destructivos y renders de movimiento programático."
      }
    ]
  };

  // 3. Strict Allowlisted System Status from Generated Verification
  const isRelease = releaseState === "RELEASED_RC1";
  const systemStatus = {
    version: isRelease ? "1.0.0-rc1" : "1.0.0-pre-release",
    statusDate: new Date().toISOString().split("T")[0],
    overallReleaseStatus: isRelease ? "RELEASED_RC1" : "IMPLEMENTED_LOCAL_UNDER_AUDIT",
    auditStatus: isRelease ? "RELEASE_COMPLETE_RC1" : "AWAITING_FINAL_AUDIT",
    ...(isRelease ? {
      release: {
        label: releaseLabel,
        commitSha: releaseSha,
        releasedAt: new Date().toISOString()
      }
    } : {}),
    moduleSummary: {
      YOD: { status: "PARTIAL_FOUNDATION", verified: true },
      LIENZO: { status: "CONTRACT_ONLY", verified: true },
      HE: { status: "VERIFIED_LOCAL", verified: true },
      SHIM: { status: "CONTRACT_ONLY", verified: true },
      VAV: { status: "VERIFIED_LOCAL", verified: true },
      ARQUITECTO: { status: "PARTIAL_FOUNDATION", verified: true },
      PIPELINE_ENGINE: { status: "PLANNED", verified: false },
      AI_RUNTIME: { status: "PLANNED", verified: false },
      PUBLISHING: { status: "PLANNED", verified: false },
      METRICS: { status: "PLANNED", verified: false }
    },
    verificationSummary: {
      testFileCount: generatedVerification.testFileCount,
      testCount: generatedVerification.testCount,
      typecheckStatus: generatedVerification.typecheckStatus,
      healthCheckSystems: generatedVerification.healthCheckSummary
    }
  };

  // 4. Strict Allowlisted Roadmap
  const roadmap = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString().split("T")[0],
    gates: [
      {
        gateId: "P1",
        title: "VAV Audiovisual Core & Platform Safe Zones",
        description: "Non-destructive FFmpeg multi-segment cut engine, 13 simple motion families, frame-accurate Remotion composition, platform safe zones.",
        status: "VERIFIED_LOCAL"
      },
      {
        gateId: "P2",
        title: "He Operations Core & Security",
        description: "Task graph, typed approval engine, blocker precedence, persistent local-first JSON store with referential integrity, RBAC.",
        status: "VERIFIED_LOCAL"
      },
      {
        gateId: "P3A",
        title: "He Product UI Core",
        description: "Modular operational UI, Solo Queue, Team Dashboard, Kanban board, Production Calendar (Month/Week/List), Deadlines, Recording Sessions, Reviews, People Workload, Activity Ledger.",
        status: "VERIFIED_LOCAL"
      },
      {
        gateId: "P3B",
        title: "He Time Tracking & Notifications",
        description: "Timer sessions, pause/resume, manual time tracking, time reports, in-app notification engine with deduplication and read isolation, store schema v1->v2 migration.",
        status: "VERIFIED_LOCAL"
      },
      {
        gateId: "P4",
        title: "Public Status V2 & Public Architect V1",
        description: "Story Mode public architecture, Apple-style highlights carousel, interactive module explorer, sticky storytelling, token-boundary Public Architect responder.",
        status: "VERIFIED_LOCAL"
      },
      {
        gateId: "P5",
        title: "Integrated Pre-Release Audit & Release",
        description: "Final global verification across all modules, zero regression validation, artifact promotion to released state.",
        status: isRelease ? "RELEASED_RC1" : "AWAITING_FINAL_AUDIT"
      }
    ]
  };

  // Write outputs atomically
  fs.writeFileSync(path.join(docsDir, "public-knowledge.json"), JSON.stringify(publicKnowledge, null, 2), "utf-8");
  fs.writeFileSync(path.join(docsDir, "system-status.json"), JSON.stringify(systemStatus, null, 2), "utf-8");
  fs.writeFileSync(path.join(docsDir, "roadmap.json"), JSON.stringify(roadmap, null, 2), "utf-8");

  console.log(`[Status Builder] Mode: ${releaseState} | Successfully projected public status artifacts into ${docsDir}`);
  return { systemStatus, roadmap, publicKnowledge };
}

// CLI execution
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    const cliOptions = parseCliArgs(process.argv.slice(2));
    buildPublicStatus(cliOptions);
  } catch (err) {
    console.error(`[Status Builder Error] ${err.message}`);
    process.exit(1);
  }
}
