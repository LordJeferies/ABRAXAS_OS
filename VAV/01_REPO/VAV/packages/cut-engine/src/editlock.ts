import {validateEditLock, type CutPlan, type EditLock} from "@vav/cut-domain";
import {generateTimeMappingFromCutPlan} from "./timemapping.ts";
import {parseRationalFps} from "@vav/timebase";
import {sha256} from "./sha256.ts";

const computeDeterministicMappingSha256 = (mappingRanges: readonly unknown[]): string => {
  const canonicalJson = JSON.stringify(mappingRanges);
  return `tmh_${sha256(canonicalJson)}`;
};

export const mintEditLock = (cutPlan: CutPlan, lockedBy: string = "USER_EDITORIAL_APPROVAL"): EditLock => {
  const mapping = generateTimeMappingFromCutPlan(cutPlan);
  const primarySource = cutPlan.sourceMedia[0];
  const fps = parseRationalFps(cutPlan.timelineTarget.fpsRational);
  const fpsNominal = fps.num / fps.den;
  const totalFrames = Math.round((cutPlan.timelineTarget.totalDurationUs / 1_000_000) * fpsNominal);

  const mappingRanges = mapping.clips.map((c, idx) => ({
    rangeId: `map_${idx + 1}`,
    sourceAssetId: primarySource.sourceAssetId,
    sourceStartUs: c.sourceStartUs,
    sourceEndUs: c.sourceEndUs,
    editedStartUs: c.timelineStartUs,
    editedEndUs: c.timelineStartUs + (c.sourceEndUs - c.sourceStartUs),
    speedMultiplier: 1.0
  }));

  const removedRanges = mapping.removedRanges.map((rr) => ({
    sourceAssetId: primarySource.sourceAssetId,
    sourceStartUs: rr.sourceStartUs,
    sourceEndUs: rr.sourceEndUs,
    reason: rr.reason
  }));

  const timeMappingHash = computeDeterministicMappingSha256(mappingRanges);

  const lock: EditLock = {
    editLockId: `lock_${cutPlan.contentId}_v${cutPlan.version}`,
    contentId: cutPlan.contentId,
    deliverableId: cutPlan.deliverableId,
    cutPlanId: cutPlan.cutPlanId,
    cutPlanVersion: cutPlan.version,
    timeMappingVersion: mapping.version,
    timeMappingHash,
    timebase: {
      fpsRational: cutPlan.timelineTarget.fpsRational,
      fpsNominal,
      width: cutPlan.timelineTarget.width,
      height: cutPlan.timelineTarget.height,
      durationUs: cutPlan.timelineTarget.totalDurationUs,
      totalFrames
    },
    mappingRanges,
    removedRanges,
    lockedBy,
    lockedAt: new Date().toISOString(),
    status: "LOCKED"
  };

  validateEditLock(lock);
  return lock;
};
