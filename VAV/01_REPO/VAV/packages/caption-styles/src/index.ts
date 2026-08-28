import type {CaptionStylePreset} from "@vav/abraxas-import";

export type CaptionStyleRegistryEntry = Readonly<{
  id: string;
  label: string;
  preset: CaptionStylePreset;
  builtIn: boolean;
}>;

const built = (
  id: string,
  label: string,
  patch: Omit<Partial<CaptionStylePreset>,
    "typography" | "sizing" | "color" | "hierarchy" | "structure" | "placement" | "motion" | "timing"> & {
    typography?: Partial<CaptionStylePreset["typography"]>;
    sizing?: Partial<CaptionStylePreset["sizing"]>;
    color?: Partial<CaptionStylePreset["color"]>;
    hierarchy?: Partial<CaptionStylePreset["hierarchy"]>;
    structure?: Partial<CaptionStylePreset["structure"]>;
    placement?: Partial<CaptionStylePreset["placement"]>;
    motion?: Partial<CaptionStylePreset["motion"]>;
    timing?: Partial<CaptionStylePreset["timing"]>;
  }
): CaptionStylePreset => {
  const base: CaptionStylePreset = {
    id,
    family: id,
    name: label,
    status: "approved",
    confidence: 1,
    sourceRef: "builtin",
    typography: {fontCategory: "sans", preferredFamily: null, fallbackFamily: "Arial", weight: 850, secondaryWeight: 700, italic: false, textCase: "sentence", trackingEm: 0, lineHeight: .98},
    sizing: {baseSizeRatioHeight: .042, minSizeRatioHeight: .03, maxSizeRatioHeight: .08, heroScale: 1.35, secondaryScale: .74, maxLines: 2, maxWidthRatio: .82},
    color: {primaryFill: "#FFFFFF", secondaryFill: "#FFFFFF", heroFill: "#FFD329", strokeColor: "#000000", strokeWidthRatioHeight: .002, shadowColor: "#000000", shadowOpacity: .5, shadowBlurRatioHeight: .006, glowColor: "#FFFFFF", glowStrength: 0, backgroundMode: "none", backgroundColor: "#000000", backgroundOpacity: 0},
    hierarchy: {heroEnabled: true, heroSelection: "semantic", heroCount: {min: 0, max: 1}, secondaryRole: "context", emphasisMode: "mixed"},
    structure: {preferred: "balanced", alternatives: ["hero_stack", "progressive"], fallback: "balanced", lineBreakPolicy: "semantic", avoidOrphans: true},
    placement: {preferredZone: "center-low", alternateZones: ["center", "upper-center"], avoidZones: ["bottom"], sceneSmart: "preferred"},
    motion: {family: "clean_fade", enter: "fade", active: "hold", exit: "fade", enterMs: 150, activeMs: 0, exitMs: 130, staggerMs: 0, intensity: .3, easing: "easeOutQuad", motionBlur: false},
    timing: {displayMode: "caption", leadInMs: 20, leadOutMs: 40, minVisibleMs: 550, maxVisibleMs: 3200, wordSyncRequirement: "segment"},
    notes: ""
  };
  return {
    ...base,
    ...patch,
    typography: {...base.typography, ...patch.typography},
    sizing: {...base.sizing, ...patch.sizing},
    color: {...base.color, ...patch.color},
    hierarchy: {...base.hierarchy, ...patch.hierarchy},
    structure: {...base.structure, ...patch.structure},
    placement: {...base.placement, ...patch.placement},
    motion: {...base.motion, ...patch.motion},
    timing: {...base.timing, ...patch.timing}
  };
};

export const builtInCaptionStyles: readonly CaptionStyleRegistryEntry[] = [
  {
    id: "hybrid-inspirational",
    label: "Hybrid Inspirational",
    builtIn: true,
    preset: built("hybrid-inspirational", "Hybrid Inspirational", {
      typography: {fontCategory: "mixed", italic: true, weight: 850, secondaryWeight: 500},
      sizing: {baseSizeRatioHeight: .0355, heroScale: 1.55, secondaryScale: .74, maxLines: 3, maxWidthRatio: .78},
      color: {heroFill: "#FFD329", shadowOpacity: .58},
      hierarchy: {heroEnabled: true, heroCount: {min: 1, max: 2}, secondaryRole: "context"},
      structure: {preferred: "hero_stack"},
      motion: {family: "slide_blur_lite", enter: "blur_slide", exit: "fade", enterMs: 280, exitMs: 160, staggerMs: 35, intensity: .75, easing: "easeOutQuart", motionBlur: true},
      notes: "Secondary editorial/italic support with a dominant yellow sans hero word."
    })
  },
  {
    id: "hollow-glow",
    label: "Hollow Glow",
    builtIn: true,
    preset: built("hollow-glow", "Hollow Glow", {
      typography: {weight: 900, textCase: "upper"},
      sizing: {baseSizeRatioHeight: .05, heroScale: 1.2, maxLines: 2},
      color: {primaryFill: "transparent", secondaryFill: "transparent", heroFill: "transparent", strokeColor: "#FFFFFF", strokeWidthRatioHeight: .003, glowColor: "#FFFFFF", glowStrength: .7, shadowOpacity: .2},
      hierarchy: {heroEnabled: false, heroCount: {min: 0, max: 0}, emphasisMode: "outline"},
      motion: {family: "glow_reveal", enter: "fade", active: "glow_pulse", exit: "fade", enterMs: 220, exitMs: 180, intensity: .55}
    })
  },
  {
    id: "impact-motion",
    label: "Impact Motion",
    builtIn: true,
    preset: built("impact-motion", "Impact Motion", {
      typography: {weight: 950, textCase: "upper", trackingEm: -.02, lineHeight: .88},
      sizing: {baseSizeRatioHeight: .064, heroScale: 1.7, secondaryScale: .82, maxLines: 2, maxWidthRatio: .86},
      color: {heroFill: "#FFCC00", strokeWidthRatioHeight: .0034, shadowOpacity: .65, backgroundMode: "box", backgroundOpacity: .12},
      hierarchy: {heroEnabled: true, heroCount: {min: 1, max: 3}},
      structure: {preferred: "hero_stack"},
      placement: {preferredZone: "center"},
      motion: {family: "impact_kinetic", enter: "pop", active: "micro_scale", exit: "right_out_blur", enterMs: 190, exitMs: 190, staggerMs: 28, intensity: 1.15, easing: "easeOutBack", motionBlur: true},
      timing: {displayMode: "word_progressive", minVisibleMs: 380, maxVisibleMs: 1900, wordSyncRequirement: "word_exact"}
    })
  },
  {
    id: "clean-bold",
    label: "Clean Bold",
    builtIn: true,
    preset: built("clean-bold", "Clean Bold", {})
  }
] as const;

export const mergeCaptionStyleRegistry = (
  approvedImported: readonly CaptionStylePreset[]
): readonly CaptionStyleRegistryEntry[] => {
  const map = new Map<string, CaptionStyleRegistryEntry>();
  for (const entry of builtInCaptionStyles) map.set(entry.id, entry);
  for (const preset of approvedImported) {
    if (preset.status !== "approved") continue;
    map.set(preset.id, {id: preset.id, label: preset.name, preset, builtIn: false});
  }
  return [...map.values()];
};

export const getCaptionStylePreset = (
  styleId: string,
  approvedImported: readonly CaptionStylePreset[] = [],
  previewCandidate: CaptionStylePreset | null = null
): CaptionStylePreset => {
  if (previewCandidate?.id === styleId) return previewCandidate;
  return mergeCaptionStyleRegistry(approvedImported).find((entry) => entry.id === styleId)?.preset
    ?? builtInCaptionStyles[0]!.preset;
};

export type ResolvedCaptionVisual = Readonly<{
  baseSizePx: number;
  heroSizePx: number;
  secondarySizePx: number;
  maxWidthPercent: number;
  fontWeight: number;
  secondaryWeight: number;
  fontStyle: "normal" | "italic";
  textTransform: "none" | "uppercase" | "capitalize";
  letterSpacingEm: number;
  lineHeight: number;
  primaryFill: string;
  secondaryFill: string;
  heroFill: string;
  strokeColor: string;
  strokeWidthPx: number;
  shadow: string;
  glow: string | null;
}>;

export const resolveCaptionVisual = (preset: CaptionStylePreset, viewportHeight: number): ResolvedCaptionVisual => {
  const base = Math.max(
    viewportHeight * preset.sizing.minSizeRatioHeight,
    Math.min(viewportHeight * preset.sizing.maxSizeRatioHeight, viewportHeight * preset.sizing.baseSizeRatioHeight)
  );
  const shadowBlur = viewportHeight * preset.color.shadowBlurRatioHeight;
  const shadow = `0 ${Math.max(1, viewportHeight * .002)}px ${shadowBlur}px color-mix(in srgb, ${preset.color.shadowColor} ${Math.round(preset.color.shadowOpacity * 100)}%, transparent)`;
  const glow = preset.color.glowStrength > 0
    ? `0 0 ${Math.max(1, viewportHeight * .012 * preset.color.glowStrength)}px ${preset.color.glowColor}`
    : null;
  return {
    baseSizePx: base,
    heroSizePx: base * preset.sizing.heroScale,
    secondarySizePx: base * preset.sizing.secondaryScale,
    maxWidthPercent: preset.sizing.maxWidthRatio * 100,
    fontWeight: preset.typography.weight,
    secondaryWeight: preset.typography.secondaryWeight,
    fontStyle: preset.typography.italic ? "italic" : "normal",
    textTransform: preset.typography.textCase === "upper" ? "uppercase" : preset.typography.textCase === "title" ? "capitalize" : "none",
    letterSpacingEm: preset.typography.trackingEm,
    lineHeight: preset.typography.lineHeight,
    primaryFill: preset.color.primaryFill,
    secondaryFill: preset.color.secondaryFill,
    heroFill: preset.color.heroFill,
    strokeColor: preset.color.strokeColor,
    strokeWidthPx: viewportHeight * preset.color.strokeWidthRatioHeight,
    shadow,
    glow
  };
};
