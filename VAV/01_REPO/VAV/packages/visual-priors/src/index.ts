import type {CaptionStylePreset} from "@vav/abraxas-import";

export type VisualPrior = Readonly<{
  preferredPlacement: string;
  alternatePlacements: readonly string[];
  avoidPlacements: readonly string[];
  preferredStructure: string;
  alternateStructures: readonly string[];
  fallbackStructure: string;
  minSizeRatioHeight: number;
  maxSizeRatioHeight: number;
  sceneSmart: "required" | "preferred" | "optional" | "off";
}>;

const sceneSmartValue = (x: string): VisualPrior["sceneSmart"] =>
  x === "required" || x === "optional" || x === "off" ? x : "preferred";

export const visualPriorFromStyle = (preset: CaptionStylePreset): VisualPrior => ({
  preferredPlacement: preset.placement.preferredZone,
  alternatePlacements: preset.placement.alternateZones,
  avoidPlacements: preset.placement.avoidZones,
  preferredStructure: preset.structure.preferred,
  alternateStructures: preset.structure.alternatives,
  fallbackStructure: preset.structure.fallback,
  minSizeRatioHeight: preset.sizing.minSizeRatioHeight,
  maxSizeRatioHeight: preset.sizing.maxSizeRatioHeight,
  sceneSmart: sceneSmartValue(preset.placement.sceneSmart)
});

export type VisualResolutionStep =
  | "preferred-placement"
  | "preferred-size"
  | "collision-check"
  | "resize"
  | "alternate-placement"
  | "alternate-structure"
  | "safe-fallback";

export const visualResolutionOrder: readonly VisualResolutionStep[] = [
  "preferred-placement",
  "preferred-size",
  "collision-check",
  "resize",
  "alternate-placement",
  "alternate-structure",
  "safe-fallback"
] as const;
