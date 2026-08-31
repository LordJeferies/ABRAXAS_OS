/**
 * ABRAXAS Module Visual Identity & Color System V7.2
 */

export interface ModuleIdentity {
  id: string;
  name: string;
  sefirah: string;
  icon: string;
  color: string;
  glowColor: string;
  animationClass: string;
  purpose: string;
  technicalRole: string;
  codeLocation: string;
}

export const MODULE_IDENTITIES: Record<string, ModuleIdentity> = {
  ARQUITECTO: {
    id: "ARQUITECTO",
    name: "ARQUITECTO",
    sefirah: "KETER",
    icon: "👑",
    color: "#d4af37", // Gold
    glowColor: "rgba(212, 175, 55, 0.4)",
    animationClass: "pulse-gold",
    purpose: "Primordial Intention & Architectural Deconstruction",
    technicalRole: "Converts natural language human intention into execution plan",
    codeLocation: "ABRAXAS_CORE/ARQUITECTO/src/arquitecto-central.ts"
  },
  YOD: {
    id: "YOD",
    name: "YOD",
    sefirah: "CHOKHMAH",
    icon: "⚡",
    color: "#38bdf8", // Electric Blue
    glowColor: "rgba(56, 189, 248, 0.4)",
    animationClass: "flash-blue",
    purpose: "Creative Spark, Hook Radar & Retention Scoring",
    technicalRole: "Scores creative angles and ranks hook candidate hypotheses",
    codeLocation: "ABRAXAS_CORE/YOD/runtime/yod-radar.ts"
  },
  CONTENIDO: {
    id: "CONTENIDO",
    name: "CONTENIDO / LIENZO",
    sefirah: "BINAH",
    icon: "🏛️",
    color: "#818cf8", // Indigo
    glowColor: "rgba(129, 140, 248, 0.4)",
    animationClass: "matrix-indigo",
    purpose: "Structural Matrix, Script Locking & CAS Stratigraphy",
    technicalRole: "Maintains immutable Content CAS DAG and revision stratigraphy",
    codeLocation: "ABRAXAS_CORE/LIENZO/src/lienzo-engine.ts"
  },
  SHIM: {
    id: "SHIM",
    name: "SHIM",
    sefirah: "DAAT",
    icon: "⚖️",
    color: "#a855f7", // Deep Purple / Abyss
    glowColor: "rgba(168, 85, 247, 0.4)",
    animationClass: "gate-purple",
    purpose: "Empirical Reality Gate & Whisper Metrology",
    technicalRole: "Validates transcript against script beats; strictly blocks unverified renders",
    codeLocation: "ABRAXAS_CORE/SHIM/src/shim-service.ts"
  },
  VAV: {
    id: "VAV",
    name: "VAV",
    sefirah: "TIFERET",
    icon: "✨",
    color: "#f59e0b", // Radiant Amber
    glowColor: "rgba(245, 158, 11, 0.4)",
    animationClass: "radiant-amber",
    purpose: "Formation Forge, Lossless Cuts & Visual Assembly",
    technicalRole: "Performs lossless multi-segment video cutting and Remotion synthesis",
    codeLocation: "services/local-engine/src/full-alpha-engine.ts"
  },
  HOD: {
    id: "HOD",
    name: "HOD / CAPTION FORGE",
    sefirah: "HOD",
    icon: "📜",
    color: "#ec4899", // Rose / Neon Magenta
    glowColor: "rgba(236, 72, 153, 0.4)",
    animationClass: "cadence-pink",
    purpose: "Splendor, Kinetic Typography & Word Timing",
    technicalRole: "Compiles word-level kinetic subtitles in SRT, ASS, and VTT",
    codeLocation: "ABRAXAS_CORE/media-engine/src/caption-forge.ts"
  },
  YESOD: {
    id: "YESOD",
    name: "YESOD / INTEGRATION",
    sefirah: "YESOD",
    icon: "📦",
    color: "#10b981", // Emerald
    glowColor: "rgba(16, 185, 129, 0.4)",
    animationClass: "solid-emerald",
    purpose: "Master Foundation & CAS Packaging",
    technicalRole: "Packages verified media layers into sovereign .abraxas delivery bundle",
    codeLocation: "ABRAXAS_CORE/media-engine/src/export-package-system.ts"
  },
  HE: {
    id: "HE",
    name: "HE / OPERATIONS",
    sefirah: "MALKHUT",
    icon: "🌍",
    color: "#14b8a6", // Teal
    glowColor: "rgba(20, 184, 166, 0.4)",
    animationClass: "manifest-teal",
    purpose: "Kingdom, Governance Review & Sovereign Distribution",
    technicalRole: "Human review approval desk and multi-platform publishing dispatcher",
    codeLocation: "ABRAXAS_CORE/publishing/src/publishing-service.ts"
  }
};
