import type {PlacementCandidate} from "@vav/vision-contracts";

export type PlacementEvidence = Readonly<{
  negativeSpace: number;
  contrast: number;
  continuity: number;
  stylePrior: number;
  lowSaliency: number;
  depthSuitability: number;
  mouthCollision: number;
  eyeCollision: number;
  sourceTextCollision: number;
  faceCollision: number;
  highMotion: number;
}>;

export const placementScore = (e: PlacementEvidence): number => {
  const raw =
    .22 * e.negativeSpace +
    .16 * e.contrast +
    .14 * e.continuity +
    .14 * e.stylePrior +
    .10 * e.lowSaliency +
    .08 * e.depthSuitability -
    .30 * e.mouthCollision -
    .25 * e.eyeCollision -
    .20 * e.sourceTextCollision -
    .15 * e.faceCollision -
    .12 * e.highMotion;
  return Math.max(0, Math.min(1, raw));
};

export const choosePlacementCandidate = (items: readonly PlacementCandidate[]): PlacementCandidate | null =>
  [...items].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))[0] ?? null;

export type DepthMode =
  | "flat-overlay"
  | "foreground-overlay"
  | "behind-subject"
  | "sandwich"
  | "background-environment"
  | "tracked-surface"
  | "perspective-plane"
  | "full-takeover"
  | "multi-depth";

export type DepthPolicy = Readonly<{
  preferred: DepthMode;
  fallback: DepthMode;
  subjectMaskRequired: boolean;
  minimumMaskConfidence: number;
  maxTextOcclusion: number;
  protectHeroWord: boolean;
}>;

export const canUsePreferredDepth = (
  policy: DepthPolicy,
  maskConfidence: number | null,
  estimatedOcclusion: number
): boolean => {
  if (policy.subjectMaskRequired && (maskConfidence == null || maskConfidence < policy.minimumMaskConfidence)) return false;
  if (estimatedOcclusion > policy.maxTextOcclusion) return false;
  return true;
};
