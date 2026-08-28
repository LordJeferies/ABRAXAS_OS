export type SnapTarget =
  | "playhead"
  | "caption-edge"
  | "word-edge"
  | "scene-cut"
  | "safe-zone-guide"
  | "canvas-center"
  | "manual-guide";

export type SnapCandidate = Readonly<{
  target: SnapTarget;
  distancePx: number;
  position: number;
}>;

export const chooseSnap = (
  candidates: readonly SnapCandidate[],
  thresholdPx = 8
): SnapCandidate | null =>
  [...candidates]
    .filter((candidate) => candidate.distancePx <= thresholdPx)
    .sort((a, b) => a.distancePx - b.distancePx)[0] ?? null;
