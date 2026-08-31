import type {CutPlan} from "@vav/cut-domain";
import {sourceToTimelineUs, timelineToSourceUs, type EditClipMap} from "@vav/time-mapping";

export type TimeMappingResult = Readonly<{
  version: number;
  clips: readonly EditClipMap[];
  removedRanges: readonly {
    sourceStartUs: number;
    sourceEndUs: number;
    reason: string;
  }[];
}>;

export const generateTimeMappingFromCutPlan = (cutPlan: CutPlan): TimeMappingResult => {
  const clips: EditClipMap[] = cutPlan.segments.map((seg) => ({
    clipId: seg.segmentId,
    sourceStartUs: seg.sourceRange.startUs,
    sourceEndUs: seg.sourceRange.endUs,
    timelineStartUs: seg.editedRange.startUs
  }));

  // Calculate removed intervals in SOURCE chronology
  const sortedSourceIntervals = cutPlan.segments
    .map((seg) => ({startUs: seg.sourceRange.startUs, endUs: seg.sourceRange.endUs}))
    .sort((a, b) => a.startUs - b.startUs);

  const removedRanges = [];
  for (let i = 0; i < sortedSourceIntervals.length - 1; i++) {
    const cur = sortedSourceIntervals[i]!;
    const next = sortedSourceIntervals[i + 1]!;
    if (next.startUs > cur.endUs) {
      removedRanges.push({
        sourceStartUs: cur.endUs,
        sourceEndUs: next.startUs,
        reason: "CUT_REMOVED_INTERVAL"
      });
    }
  }

  return {
    version: cutPlan.version,
    clips,
    removedRanges
  };
};

export {sourceToTimelineUs, timelineToSourceUs, type EditClipMap};
