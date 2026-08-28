export type TimelineSemanticZoom = "blocks" | "captions-and-words" | "word-boundaries";

export const semanticZoomForPixelsPerSecond = (pps: number): TimelineSemanticZoom => {
  if (pps < 80) return "blocks";
  if (pps < 220) return "captions-and-words";
  return "word-boundaries";
};
