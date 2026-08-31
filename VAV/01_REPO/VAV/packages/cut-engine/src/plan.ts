import {
  DEFAULT_NEUTRAL_POLICY,
  ValidationError,
  type CutCandidate,
  type CutDecision,
  type CutPlan,
  type CutPolicy,
  type CutSegment,
  type SourceMediaRef
} from "@vav/cut-domain";
import {parseRationalFps, usToFrame} from "@vav/timebase";

export type AssembleCutPlanInput = Readonly<{
  cutPlanId?: string | undefined;
  version?: number | undefined;
  contentId: string;
  deliverableId: string;
  formatId: string;
  sourceMedia: readonly [SourceMediaRef];
  candidates: readonly CutCandidate[];
  decisions: readonly CutDecision[];
  policy?: CutPolicy | undefined;
  timelineFpsRational?: string | undefined;
}>;

export const assembleCutPlan = (input: AssembleCutPlanInput): CutPlan => {
  const primarySource = input.sourceMedia[0];
  if (!primarySource) {
    throw new ValidationError("CutPlan assembly requires a primary source media reference");
  }

  const fpsRational = input.timelineFpsRational ?? primarySource.timebase.fpsRational;
  const fps = parseRationalFps(fpsRational);
  const policy = input.policy ?? DEFAULT_NEUTRAL_POLICY;

  const decisionMap = new Map<string, CutDecision>();
  for (const d of input.decisions) {
    decisionMap.set(d.candidateId, d);
  }

  for (const c of input.candidates) {
    if (!decisionMap.has(c.candidateId)) {
      throw new ValidationError(`Undecided candidate ${c.candidateId}: every candidate requires an explicit CutDecision`);
    }
  }

  const activeItems: {candidate: CutCandidate; decision: CutDecision; originalIndex: number; effectiveIndex: number}[] = [];
  for (let idx = 0; idx < input.candidates.length; idx++) {
    const c = input.candidates[idx]!;
    const d = decisionMap.get(c.candidateId)!;
    if (d.decisionType !== "REMOVE") {
      const effectiveIndex = d.targetSequenceIndex ?? idx;
      activeItems.push({candidate: c, decision: d, originalIndex: idx, effectiveIndex});
    }
  }

  // Validate that all effective indexes across active items are unique
  const effectiveIndexSet = new Set<number>();
  for (const item of activeItems) {
    if (effectiveIndexSet.has(item.effectiveIndex)) {
      throw new ValidationError(`Duplicate/ambiguous effective sequence index ${item.effectiveIndex} specified for decision ${item.decision.decisionId}`);
    }
    effectiveIndexSet.add(item.effectiveIndex);
  }

  activeItems.sort((a, b) => a.effectiveIndex - b.effectiveIndex);

  const segments: CutSegment[] = [];
  let currentTimelineUs = 0;

  for (let i = 0; i < activeItems.length; i++) {
    const {candidate, decision} = activeItems[i]!;
    let srcStart = candidate.sourceRange.startUs;
    let srcEnd = candidate.sourceRange.endUs;

    if (decision.decisionType === "TRIM" && decision.adjustedRange) {
      if (decision.adjustedRange.startUs < candidate.sourceRange.startUs || decision.adjustedRange.endUs > candidate.sourceRange.endUs) {
        throw new ValidationError(`TRIM adjustedRange [${decision.adjustedRange.startUs}, ${decision.adjustedRange.endUs}] exceeds candidate bounds [${candidate.sourceRange.startUs}, ${candidate.sourceRange.endUs}]`);
      }
      srcStart = decision.adjustedRange.startUs;
      srcEnd = decision.adjustedRange.endUs;
    }

    const requestedHeadHandleUs = policy.handleDurationUs;
    const requestedTailHandleUs = policy.handleDurationUs;
    const headHandleUs = Math.min(requestedHeadHandleUs, srcStart);
    const tailHandleUs = Math.min(requestedTailHandleUs, primarySource.durationUs - srcEnd);

    const segDurationUs = srcEnd - srcStart;
    const timelineStartUs = currentTimelineUs;
    const timelineEndUs = currentTimelineUs + segDurationUs;

    const sourceRange = {
      startUs: srcStart,
      endUs: srcEnd,
      startFrame: usToFrame(srcStart, fps),
      endFrame: usToFrame(srcEnd, fps)
    };

    const editedRange = {
      startUs: timelineStartUs,
      endUs: timelineEndUs,
      startFrame: usToFrame(timelineStartUs, fps),
      endFrame: usToFrame(timelineEndUs, fps)
    };

    segments.push({
      segmentId: `seg_${(i + 1).toString().padStart(2, "0")}`,
      sequenceIndex: i,
      sourceAssetId: primarySource.sourceAssetId,
      sourceRange,
      editedRange,
      editorialRole: candidate.editorialRole,
      speaker: candidate.speaker,
      handles: {
        headUs: headHandleUs,
        tailUs: tailHandleUs
      }
    });

    currentTimelineUs = timelineEndUs;
  }

  const cutPlan: CutPlan = {
    cutPlanId: input.cutPlanId ?? `cut_plan_${input.contentId}_v${input.version ?? 1}`,
    version: input.version ?? 1,
    contentId: input.contentId,
    deliverableId: input.deliverableId,
    formatId: input.formatId,
    sourceMode: "SINGLE_SOURCE_V1",
    sourceMedia: input.sourceMedia,
    cuttingPolicies: policy,
    timelineTarget: {
      fpsRational,
      width: primarySource.timebase.width,
      height: primarySource.timebase.height,
      totalDurationUs: currentTimelineUs
    },
    segments,
    provenance: {
      createdBy: "VAV_CUT_ENGINE_V1",
      createdAt: new Date().toISOString(),
      status: "DRAFT"
    }
  };

  return cutPlan;
};
