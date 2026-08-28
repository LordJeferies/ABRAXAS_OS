export type AbraxasArtifactKind =
  | "caption-style"
  | "motion-card"
  | "motion-family"
  | "video-analysis"
  | "shot-composition"
  | "text-depth"
  | "text-takeover"
  | "spatial-transform"
  | "motion-path"
  | "motion-replication"
  | "surface-tracking"
  | "quick-reference"
  | "user-preference"
  | "user-profile"
  | "pattern-matrix"
  | "primitive-taxonomy"
  | "reference-dataset"
  | "unknown-reference";

export type AbraxasArtifactStatus = "candidate" | "approved" | "reference-only" | "rejected";

export type ParsedSectionMap = Readonly<Record<string, Readonly<Record<string, string>>>>;

export type NumericRange = Readonly<{min: number; max: number}>;

export type CaptionStylePreset = Readonly<{
  id: string;
  family: string;
  name: string;
  status: "candidate" | "approved";
  confidence: number | null;
  sourceRef: string;
  typography: Readonly<{
    fontCategory: string;
    preferredFamily: string | null;
    fallbackFamily: string | null;
    weight: number;
    secondaryWeight: number;
    italic: boolean;
    textCase: "sentence" | "title" | "upper" | "mixed";
    trackingEm: number;
    lineHeight: number;
  }>;
  sizing: Readonly<{
    baseSizeRatioHeight: number;
    minSizeRatioHeight: number;
    maxSizeRatioHeight: number;
    heroScale: number;
    secondaryScale: number;
    maxLines: number;
    maxWidthRatio: number;
  }>;
  color: Readonly<{
    primaryFill: string;
    secondaryFill: string;
    heroFill: string;
    strokeColor: string;
    strokeWidthRatioHeight: number;
    shadowColor: string;
    shadowOpacity: number;
    shadowBlurRatioHeight: number;
    glowColor: string;
    glowStrength: number;
    backgroundMode: string;
    backgroundColor: string;
    backgroundOpacity: number;
  }>;
  hierarchy: Readonly<{
    heroEnabled: boolean;
    heroSelection: string;
    heroCount: NumericRange;
    secondaryRole: string;
    emphasisMode: string;
  }>;
  structure: Readonly<{
    preferred: string;
    alternatives: readonly string[];
    fallback: string;
    lineBreakPolicy: string;
    avoidOrphans: boolean;
  }>;
  placement: Readonly<{
    preferredZone: string;
    alternateZones: readonly string[];
    avoidZones: readonly string[];
    sceneSmart: string;
  }>;
  motion: Readonly<{
    family: string;
    enter: string;
    active: string;
    exit: string;
    enterMs: number;
    activeMs: number;
    exitMs: number;
    staggerMs: number;
    intensity: number;
    easing: string;
    motionBlur: boolean;
  }>;
  timing: Readonly<{
    displayMode: string;
    leadInMs: number;
    leadOutMs: number;
    minVisibleMs: number;
    maxVisibleMs: number;
    wordSyncRequirement: string;
  }>;
  notes: string;
}>;

export type MotionPreset = Readonly<{
  id: string;
  family: string;
  name: string;
  status: "candidate" | "approved";
  confidence: number | null;
  sourceRef: string;
  scope: readonly string[];
  enter: Readonly<Record<string, string | number | boolean | null>>;
  active: Readonly<Record<string, string | number | boolean | null>>;
  exit: Readonly<Record<string, string | number | boolean | null>>;
  stagger: Readonly<Record<string, string | number | boolean | null>>;
  sync: Readonly<Record<string, string | number | boolean | null>>;
  contextRules: Readonly<Record<string, string | number | boolean | null>>;
}>;

export type AbraxasArtifact = Readonly<{
  artifactId: string;
  kind: AbraxasArtifactKind;
  status: AbraxasArtifactStatus;
  sourceName: string;
  title: string;
  confidence: number | null;
  executable: boolean;
  rawHeader: string;
  sections: ParsedSectionMap;
  warnings: readonly string[];
  stylePreset: CaptionStylePreset | null;
  motionPreset: MotionPreset | null;
  rawJson: unknown | null;
}>;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));

const numberOr = (value: string | undefined, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const boolOr = (value: string | undefined, fallback: boolean): boolean => {
  if (value == null) return fallback;
  const x = value.trim().toLowerCase();
  if (["true", "yes", "1", "on"].includes(x)) return true;
  if (["false", "no", "0", "off"].includes(x)) return false;
  return fallback;
};

const list = (value: string | undefined): string[] =>
  (value ?? "").split(",").map((x) => x.trim()).filter(Boolean);

const range = (value: string | undefined, fallback: NumericRange): NumericRange => {
  if (!value) return fallback;
  const m = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*\.\.\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) {
    const n = Number(value);
    return Number.isFinite(n) ? {min: n, max: n} : fallback;
  }
  const a = Number(m[1]);
  const b = Number(m[2]);
  return {min: Math.min(a, b), max: Math.max(a, b)};
};

const normalizeCase = (value: string | undefined): "sentence" | "title" | "upper" | "mixed" => {
  const x = (value ?? "sentence").toLowerCase();
  return x === "title" || x === "upper" || x === "mixed" ? x : "sentence";
};

const scalar = (value: string | undefined): string | number | boolean | null => {
  if (value == null || value === "") return null;
  const x = value.trim();
  if (x === "true") return true;
  if (x === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(x)) return Number(x);
  return x;
};

const sectionScalars = (section: Readonly<Record<string, string>> | undefined) =>
  Object.fromEntries(Object.entries(section ?? {}).map(([k, v]) => [k, scalar(v)]));

export const parseSectionedText = (text: string): Readonly<{header: string; sections: ParsedSectionMap}> => {
  const sections: Record<string, Record<string, string>> = {};
  let current = "ROOT";
  sections[current] = {};
  let header = "";

  for (const original of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const line = original.trim();
    if (!line) continue;
    if (!header && !line.startsWith("[") && !line.includes("=")) header = line;
    if (line.startsWith("#") || line.startsWith("//") || line.startsWith(";")) continue;
    const section = line.match(/^\[([^\]]+)\]$/);
    if (section) {
      current = section[1]!.trim().toUpperCase();
      sections[current] ??= {};
      continue;
    }
    const splitAt = line.indexOf("=");
    if (splitAt < 1) continue;
    const key = line.slice(0, splitAt).trim();
    const value = line.slice(splitAt + 1).trim();
    sections[current]![key] = value;
  }

  return {header, sections};
};

const classifyText = (header: string, sections: ParsedSectionMap): AbraxasArtifactKind => {
  const h = header.toUpperCase();
  const names = new Set(Object.keys(sections));
  if (h.includes("VAV_STYLE_CARD") || (names.has("TYPOGRAPHY") && names.has("HIERARCHY") && names.has("STRUCTURE") && names.has("COLOR"))) return "caption-style";
  if (h.includes("VAV_MOTION_CARD")) return "motion-card";
  if (h.includes("ABRAXAS_MOTION_FAMILY")) return "motion-family";
  if (h.includes("VAV_VIDEO_ANALYSIS") || names.has("VIDEO") && names.has("GLOBAL_STYLE") && names.has("SCENE_SEGMENTATION")) return "video-analysis";
  if (h.includes("SHOT_COMPOSITION") || names.has("SHOT") && names.has("SUBJECT") && names.has("SCENE") && names.has("TEXT_OPPORTUNITY")) return "shot-composition";
  if (h.includes("TEXT_DEPTH")) return "text-depth";
  if (h.includes("TEXT_TAKEOVER")) return "text-takeover";
  if (h.includes("SPATIAL_TRANSFORM")) return "spatial-transform";
  if (h.includes("MOTION_PATH")) return "motion-path";
  if (h.includes("MOTION_REPLICATION")) return "motion-replication";
  if (h.includes("SURFACE_TRACKING")) return "surface-tracking";
  if (h.includes("QUICK_VISUAL_REFERENCE")) return "quick-reference";
  if (h.includes("USER_PREFERENCE_FEEDBACK")) return "user-preference";
  if (h.includes("USER_VISUAL_PROFILE")) return "user-profile";
  if (h.includes("PATTERN_MATRIX")) return "pattern-matrix";
  if (h.includes("PRIMITIVE") || names.has("ENTER_FAMILIES") && names.has("ACTIVE_FAMILIES")) return "primitive-taxonomy";
  return "unknown-reference";
};

const artifactStatus = (kind: AbraxasArtifactKind, sections: ParsedSectionMap): AbraxasArtifactStatus => {
  const declared = (sections.IDENTITY?.status ?? "").toLowerCase();
  if (declared === "rejected" || declared === "deprecated") return "rejected";
  if (kind === "caption-style" || kind === "motion-card" || kind === "motion-family") {
    return declared === "approved" ? "approved" : "candidate";
  }
  return "reference-only";
};

const canonicalStyleId = (id: string): string => {
  const key = id.trim().toLowerCase();
  const aliases: Record<string, string> = {
    "vav.hybrid_inspirational": "hybrid-inspirational",
    "vav.hollow_glow": "hollow-glow",
    "vav.impact_motion": "impact-motion",
    "vav.clean_bold": "clean-bold"
  };
  return aliases[key] ?? id;
};

const canonicalMotionId = (id: string): string => {
  const key = id.trim().toLowerCase();
  const aliases: Record<string, string> = {
    "slide_blur_lite": "slide-blur-lite",
    "hero_pop": "hero-pop",
    "glow_reveal": "glow-reveal",
    "glow_pulse": "glow-pulse",
    "impact_kinetic": "impact-kinetic",
    "clean_fade": "clean-fade",
    "right_out_blur": "right-out-blur"
  };
  return aliases[key] ?? key.replaceAll("_", "-");
};

const normalizeZone = (value: string | undefined, fallback: string): string =>
  (value ?? fallback).trim().toLowerCase().replaceAll("_", "-");

const normalizeStyle = (sections: ParsedSectionMap, sourceRef: string): CaptionStylePreset => {
  const identity = sections.IDENTITY ?? {};
  const type = sections.TYPOGRAPHY ?? {};
  const size = sections.SIZE ?? {};
  const color = sections.COLOR ?? {};
  const hierarchy = sections.HIERARCHY ?? {};
  const structure = sections.STRUCTURE ?? {};
  const placement = sections.PLACEMENT ?? {};
  const motion = sections.MOTION ?? {};
  const timing = sections.TIMING ?? {};
  const notes = sections.NOTES ?? {};

  const declaredId = identity.id?.trim() || `imported.${sourceRef.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  const id = canonicalStyleId(declaredId);
  const status = identity.status?.toLowerCase() === "approved" ? "approved" as const : "candidate" as const;
  const confidenceRaw = identity.confidence == null ? null : Number(identity.confidence);

  return {
    id,
    family: identity.family?.trim() || id,
    name: identity.name?.trim() || id,
    status,
    confidence: confidenceRaw != null && Number.isFinite(confidenceRaw) ? clamp(confidenceRaw, 0, 1) : null,
    sourceRef,
    typography: {
      fontCategory: type.font_category ?? "sans",
      preferredFamily: type.font_family_preferred || null,
      fallbackFamily: type.font_family_fallback || null,
      weight: clamp(numberOr(type.weight_default, 800), 100, 1000),
      secondaryWeight: clamp(numberOr(type.weight_secondary, 650), 100, 1000),
      italic: boolOr(type.italic_default, false),
      textCase: normalizeCase(type.case),
      trackingEm: clamp(numberOr(type.tracking_em, 0), -0.2, 0.4),
      lineHeight: clamp(numberOr(type.line_height, 1), 0.7, 2.2)
    },
    sizing: {
      baseSizeRatioHeight: clamp(numberOr(size.base_size_ratio_height, 0.045), 0.012, 0.2),
      minSizeRatioHeight: clamp(numberOr(size.min_size_ratio_height, 0.03), 0.01, 0.2),
      maxSizeRatioHeight: clamp(numberOr(size.max_size_ratio_height, 0.09), 0.01, 0.3),
      heroScale: clamp(numberOr(size.hero_scale, 1.35), 0.6, 4),
      secondaryScale: clamp(numberOr(size.secondary_scale, 0.8), 0.4, 2),
      maxLines: Math.round(clamp(numberOr(size.max_lines, 2), 1, 6)),
      maxWidthRatio: clamp(numberOr(size.max_width_ratio, 0.82), 0.2, 0.98)
    },
    color: {
      primaryFill: color.primary_fill ?? "#FFFFFF",
      secondaryFill: color.secondary_fill ?? color.primary_fill ?? "#FFFFFF",
      heroFill: color.hero_fill ?? color.primary_fill ?? "#FFFFFF",
      strokeColor: color.stroke_color ?? "#000000",
      strokeWidthRatioHeight: clamp(numberOr(color.stroke_width_ratio_height, 0.002), 0, 0.02),
      shadowColor: color.shadow_color ?? "#000000",
      shadowOpacity: clamp(numberOr(color.shadow_opacity, 0.45), 0, 1),
      shadowBlurRatioHeight: clamp(numberOr(color.shadow_blur_ratio_height, 0.004), 0, 0.05),
      glowColor: color.glow_color ?? "#FFFFFF",
      glowStrength: clamp(numberOr(color.glow_strength, 0), 0, 1),
      backgroundMode: color.background_mode ?? "none",
      backgroundColor: color.background_color ?? "#000000",
      backgroundOpacity: clamp(numberOr(color.background_opacity, 0), 0, 1)
    },
    hierarchy: {
      heroEnabled: boolOr(hierarchy.hero_word_enabled, true),
      heroSelection: hierarchy.hero_word_selection ?? "semantic",
      heroCount: range(hierarchy.hero_word_count, {min: 0, max: 1}),
      secondaryRole: hierarchy.secondary_text_role ?? "context",
      emphasisMode: hierarchy.emphasis_mode ?? "mixed"
    },
    structure: {
      preferred: normalizeZone(structure.preferred, "balanced"),
      alternatives: list(structure.alternatives).map((value) => normalizeZone(value, value)),
      fallback: normalizeZone(structure.fallback, "balanced"),
      lineBreakPolicy: structure.line_break_policy ?? "semantic",
      avoidOrphans: boolOr(structure.orphan_word_avoid, true)
    },
    placement: {
      preferredZone: normalizeZone(placement.preferred_zone, "center-low"),
      alternateZones: list(placement.alternate_zones).map((value) => normalizeZone(value, value)),
      avoidZones: list(placement.avoid_zones).map((value) => normalizeZone(value, value)),
      sceneSmart: placement.scene_smart ?? "preferred"
    },
    motion: {
      family: canonicalMotionId(motion.motion_family ?? "clean_fade"),
      enter: motion.enter ?? "fade",
      active: motion.active ?? "hold",
      exit: motion.exit ?? "fade",
      enterMs: Math.round(clamp(numberOr(motion.enter_ms, 160), 0, 5000)),
      activeMs: Math.round(clamp(numberOr(motion.active_ms, 0), 0, 10000)),
      exitMs: Math.round(clamp(numberOr(motion.exit_ms, 140), 0, 5000)),
      staggerMs: Math.round(clamp(numberOr(motion.stagger_ms, 0), 0, 2000)),
      intensity: clamp(numberOr(motion.intensity, 0.5), 0, 2),
      easing: motion.easing ?? "easeOutQuart",
      motionBlur: boolOr(motion.motion_blur, false)
    },
    timing: {
      displayMode: timing.display_mode ?? "caption",
      leadInMs: Math.round(clamp(numberOr(timing.lead_in_ms, 0), -1000, 3000)),
      leadOutMs: Math.round(clamp(numberOr(timing.lead_out_ms, 0), -1000, 3000)),
      minVisibleMs: Math.round(clamp(numberOr(timing.min_visible_ms, 450), 0, 10000)),
      maxVisibleMs: Math.round(clamp(numberOr(timing.max_visible_ms, 3200), 100, 30000)),
      wordSyncRequirement: timing.word_sync_requirement ?? "segment"
    },
    notes: notes.human_description ?? ""
  };
};

const normalizeMotion = (sections: ParsedSectionMap, sourceRef: string): MotionPreset => {
  const identity = sections.IDENTITY ?? {};
  const scope = sections.SCOPE ?? {};
  const status = identity.status?.toLowerCase() === "approved" ? "approved" as const : "candidate" as const;
  const confidenceRaw = identity.confidence == null ? null : Number(identity.confidence);
  return {
    id: canonicalMotionId(identity.id?.trim() || `motion.${sourceRef.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`),
    family: canonicalMotionId(identity.family?.trim() || identity.id?.trim() || "custom"),
    name: identity.name?.trim() || identity.id?.trim() || sourceRef,
    status,
    confidence: confidenceRaw != null && Number.isFinite(confidenceRaw) ? clamp(confidenceRaw, 0, 1) : null,
    sourceRef,
    scope: list(scope.applies_to ?? scope.scope),
    enter: sectionScalars(sections.ENTER),
    active: sectionScalars(sections.ACTIVE),
    exit: sectionScalars(sections.EXIT),
    stagger: sectionScalars(sections.STAGGER),
    sync: sectionScalars(sections.SYNC),
    contextRules: sectionScalars(sections.CONTEXT_RULES)
  };
};

const jsonKind = (value: any): AbraxasArtifactKind => {
  const root = Array.isArray(value) ? value[0] : value;
  if (!root || typeof root !== "object") return "reference-dataset";
  const keys = new Set(Object.keys(root));
  if (keys.has("visual_identity") || keys.has("pattern_scope") || keys.has("quick_reference")) return "quick-reference";
  if (keys.has("shot_size") || keys.has("SHOT_CONTEXT") || keys.has("shot_context")) return "shot-composition";
  if (keys.has("x_norm") || keys.has("z_norm") || keys.has("rotate_y")) return "spatial-transform";
  if (keys.has("preference") || keys.has("rating")) return "user-preference";
  if (keys.has("preferred") && keys.has("avoid")) return "user-profile";
  return "reference-dataset";
};

export const parseAbraxasArtifact = (text: string, sourceName = "import.txt"): AbraxasArtifact => {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("ABRAXAS import: archivo vacío.");

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const rawJson = JSON.parse(trimmed);
      const kind = jsonKind(rawJson);
      return {
        artifactId: `artifact-${sourceName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
        kind,
        status: "reference-only",
        sourceName,
        title: sourceName,
        confidence: null,
        executable: false,
        rawHeader: "JSON",
        sections: {},
        warnings: ["JSON de referencia importado como datos; no se ejecuta código ni HTML."],
        stylePreset: null,
        motionPreset: null,
        rawJson
      };
    } catch {
      // Fall through to section parser so a text file beginning with '[' can still be diagnosed.
    }
  }

  const parsed = parseSectionedText(trimmed);
  const kind = classifyText(parsed.header, parsed.sections);
  const status = artifactStatus(kind, parsed.sections);
  const executable = (kind === "caption-style" || kind === "motion-card" || kind === "motion-family") && status !== "rejected";
  const warnings: string[] = [];
  if (kind === "unknown-reference") warnings.push("Tipo no ejecutable: se conservará como referencia/provenance.");
  if (status === "approved") warnings.push("El archivo declara approved, pero VAV puede importarlo como Candidate salvo confirmación explícita del usuario.");

  const stylePreset = kind === "caption-style" ? normalizeStyle(parsed.sections, sourceName) : null;
  const motionPreset = kind === "motion-card" || kind === "motion-family" ? normalizeMotion(parsed.sections, sourceName) : null;
  const confidence = stylePreset?.confidence ?? motionPreset?.confidence ?? null;
  const title = stylePreset?.name ?? motionPreset?.name ?? parsed.sections.IDENTITY?.name ?? (parsed.header || sourceName);

  return {
    artifactId: `artifact-${(stylePreset?.id ?? motionPreset?.id ?? sourceName).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
    kind,
    status,
    sourceName,
    title,
    confidence,
    executable,
    rawHeader: parsed.header,
    sections: parsed.sections,
    warnings,
    stylePreset,
    motionPreset,
    rawJson: null
  };
};

export const forceCandidate = (artifact: AbraxasArtifact): AbraxasArtifact => ({
  ...artifact,
  status: artifact.status === "rejected" ? "rejected" : artifact.executable ? "candidate" : "reference-only",
  stylePreset: artifact.stylePreset ? {...artifact.stylePreset, status: "candidate"} : null,
  motionPreset: artifact.motionPreset ? {...artifact.motionPreset, status: "candidate"} : null
});

export const approveArtifact = (artifact: AbraxasArtifact): AbraxasArtifact => {
  if (!artifact.executable) throw new Error("Solo Style/Motion Cards ejecutables pueden aprobarse como preset.");
  return {
    ...artifact,
    status: "approved",
    stylePreset: artifact.stylePreset ? {...artifact.stylePreset, status: "approved"} : null,
    motionPreset: artifact.motionPreset ? {...artifact.motionPreset, status: "approved"} : null
  };
};
