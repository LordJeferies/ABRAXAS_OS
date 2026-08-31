/**
 * ABRAXAS Canonical Operator Schema V8.0
 * Deep Kabbalistic Ontology: Four Worlds + Hebrew Letter Operators + Sephirotic Functions
 */

export type KabbalisticWorld = "ATZILUT" | "BERIAH" | "YETZIRAH" | "ASSIAH";

export type SephiroticFunction =
  | "KETER"
  | "CHOKHMAH"
  | "BINAH"
  | "DAAT"
  | "CHESED"
  | "GEVURAH"
  | "TIFERET"
  | "NETZACH"
  | "HOD"
  | "YESOD"
  | "MALKHUT";

export type OperatorState = "INITIALIZING" | "ACTIVE" | "DEGRADED" | "STANDBY" | "EXECUTING";

export interface AbraxasOperatorSchema {
  name: string;
  hebrewLetter: string;
  letterSymbol: string;
  letterMeaning: string;
  world: KabbalisticWorld;
  worldMeaning: string;
  sephiroticFunctions: SephiroticFunction[];
  technicalPurpose: string;
  creativePurpose: string;
  inputs: string[];
  outputs: string[];
  dependencies: string[];
  codeLocation: string;
  state: OperatorState;
}

export const CANONICAL_OPERATOR_REGISTRY: Record<string, AbraxasOperatorSchema> = {
  ARQUITECTO: {
    name: "ARQUITECTO",
    hebrewLetter: "ALEPH",
    letterSymbol: "א",
    letterMeaning: "Supernal Breath & Primordial Unity",
    world: "ATZILUT",
    worldMeaning: "World of Emanation / Archetypal Will",
    sephiroticFunctions: ["KETER", "CHOKHMAH"],
    technicalPurpose: "Deconstructs natural language intention into structured execution DAGs and parameter bounds.",
    creativePurpose: "Translates raw creative desire into actionable mathematical constraints.",
    inputs: ["Human natural language prompt", "Voice intention", "Strategic objectives"],
    outputs: ["Structured Intention Object", "Plan DAG", "Boundary constraints"],
    dependencies: ["PersistentMemory", "IdentityCore"],
    codeLocation: "ABRAXAS_CORE/ARQUITECTO/src/arquitecto-central.ts",
    state: "ACTIVE"
  },
  YOD: {
    name: "YOD",
    hebrewLetter: "YOD",
    letterSymbol: "י",
    letterMeaning: "The Creative Spark / Dimensional Seed",
    world: "BERIAH",
    worldMeaning: "World of Creation / Identity Matrix",
    sephiroticFunctions: ["CHOKHMAH", "CHESED"],
    technicalPurpose: "Scores opportunity radars, tests hook taxonomy, and projects audience retention curves.",
    creativePurpose: "Discovers the sharpest viral angle and angles of attack.",
    inputs: ["Structured Intention", "Historical hook retention vectors"],
    outputs: ["Ranked hook candidate list", "Concept hypothesis", "Angle score"],
    dependencies: ["ARQUITECTO", "SemanticVectorMemory"],
    codeLocation: "ABRAXAS_CORE/YOD/runtime/yod-radar.ts",
    state: "ACTIVE"
  },
  CONTENIDO: {
    name: "CONTENIDO_LIENZO",
    hebrewLetter: "MEM",
    letterSymbol: "מ",
    letterMeaning: "The Matrix Water / Formative Womb",
    world: "BERIAH",
    worldMeaning: "World of Creation / Structural Identity",
    sephiroticFunctions: ["BINAH", "GEVURAH"],
    technicalPurpose: "Maintains immutable Content CAS DAG, script locking, and multi-scene stratigraphy.",
    creativePurpose: "Gives permanent narrative structure to the creative spark.",
    inputs: ["Selected hook angle", "Narrative parameters"],
    outputs: ["Lienzo Entity", "Structural storyboard DAG", "Locked script beats"],
    dependencies: ["YOD", "SqliteMemoryCore"],
    codeLocation: "ABRAXAS_CORE/LIENZO/src/lienzo-engine.ts",
    state: "ACTIVE"
  },
  SHIM: {
    name: "SHIM",
    hebrewLetter: "SHIN",
    letterSymbol: "ש",
    letterMeaning: "The Fire of Truth / Empirical Judgement",
    world: "YETZIRAH",
    worldMeaning: "World of Formation / Reality Metrology",
    sephiroticFunctions: ["DAAT", "GEVURAH"],
    technicalPurpose: "Whisper transcript vs script metrology gate; certifies alignment with 0 gaps tolerance.",
    creativePurpose: "Ensures what was spoken and intended matches physical audiovisual reality.",
    inputs: ["Raw audiovisual stream", "Planned script beats"],
    outputs: ["ShimVerificationCertificate", "Reality Metrology Vector"],
    dependencies: ["CONTENIDO", "WhisperTranscriptionEngine"],
    codeLocation: "ABRAXAS_CORE/SHIM/src/shim-service.ts",
    state: "ACTIVE"
  },
  VAV: {
    name: "VAV",
    hebrewLetter: "VAV",
    letterSymbol: "ו",
    letterMeaning: "The Connecting Pin / Dynamic Hook Spine",
    world: "YETZIRAH",
    worldMeaning: "World of Formation / Radiant Production",
    sephiroticFunctions: ["TIFERET", "NETZACH"],
    technicalPurpose: "Executes lossless multi-segment cuts, Remotion motion synthesis, and color timing.",
    creativePurpose: "Brings harmony, light, physics easing, and visual momentum to life.",
    inputs: ["Verified Lienzo DAG", "ShimCertificate", "Source video footage"],
    outputs: ["Lossless cut bitstream", "Remotion composition manifest"],
    dependencies: ["SHIM", "RemotionCompositionPlan"],
    codeLocation: "services/local-engine/src/full-alpha-engine.ts",
    state: "ACTIVE"
  },
  HOD: {
    name: "HOD_CAPTION_FORGE",
    hebrewLetter: "PE",
    letterSymbol: "פ",
    letterMeaning: "The Mouth / Word-level Kinetic Voice",
    world: "YETZIRAH",
    worldMeaning: "World of Formation / Splendor of Typography",
    sephiroticFunctions: ["HOD"],
    technicalPurpose: "Compiles word-level kinetic subtitles into synchronized SRT, ASS, and VTT streams.",
    creativePurpose: "Expresses cadence, spoken rhythm, and emphasis with kinetic typography.",
    inputs: ["Time-aligned Whisper words", "Visual aesthetic priors"],
    outputs: ["SRT file", "ASS animated subtitle track", "WebVTT stream"],
    dependencies: ["VAV", "CaptionHierarchy"],
    codeLocation: "ABRAXAS_CORE/media-engine/src/caption-forge.ts",
    state: "ACTIVE"
  },
  YESOD: {
    name: "YESOD_INTEGRATION",
    hebrewLetter: "TAV",
    letterSymbol: "ת",
    letterMeaning: "The Foundation / Master Seal",
    world: "YETZIRAH",
    worldMeaning: "World of Formation / Foundation Bundle",
    sephiroticFunctions: ["YESOD"],
    technicalPurpose: "Synthesizes master delivery package and seals all layers under cryptographic SHA-256 CAS address.",
    creativePurpose: "Unifies video, sound, motion, and captions into an indivisible crystal.",
    inputs: ["Rendered video cut", "Kinetic subtitle streams", "Project metadata"],
    outputs: ["Master CAS delivery bundle (cas://<sha256>)", "Project manifest"],
    dependencies: ["VAV", "HOD"],
    codeLocation: "ABRAXAS_CORE/media-engine/src/export-package-system.ts",
    state: "ACTIVE"
  },
  HE: {
    name: "HE_OPERATIONS",
    hebrewLetter: "HE",
    letterSymbol: "ה",
    letterMeaning: "The Window of Manifestation / Living Breath",
    world: "ASSIAH",
    worldMeaning: "World of Action / Physical Manifest Reality",
    sephiroticFunctions: ["MALKHUT"],
    technicalPurpose: "Human review desk approval stamp and multi-platform distribution dispatcher.",
    creativePurpose: "Releases the sovereign creative work into the physical world.",
    inputs: ["Master CAS bundle", "Human review approval stamp"],
    outputs: ["Signed PublishReceipts", "Multi-platform distribution manifests"],
    dependencies: ["YESOD", "PublishingService"],
    codeLocation: "ABRAXAS_CORE/publishing/src/publishing-service.ts",
    state: "ACTIVE"
  }
};
