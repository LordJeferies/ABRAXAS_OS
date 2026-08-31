import type {CutCandidate, CutDecision, CutPlan, CutPolicy, EditLock} from "./types.ts";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const validateCutPolicy = (policy: CutPolicy): void => {
  if (policy.handleDurationUs < 0 || policy.consonantTailPreservationUs < 0) {
    throw new ValidationError("CutPolicy handle and consonant durations cannot be negative");
  }
};

export const validateCutCandidate = (candidate: CutCandidate, sourceDurationUs: number): void => {
  if (!candidate.candidateId) throw new ValidationError("CutCandidate candidateId cannot be empty");
  if (candidate.sourceRange.startUs < 0 || candidate.sourceRange.endUs > sourceDurationUs) {
    throw new ValidationError(`CutCandidate ${candidate.candidateId} sourceRange exceeds source duration ${sourceDurationUs}`);
  }
  if (candidate.sourceRange.endUs <= candidate.sourceRange.startUs) {
    throw new ValidationError(`CutCandidate ${candidate.candidateId} has invalid non-positive range`);
  }
};

export const validateCutDecision = (decision: CutDecision, candidate?: CutCandidate): void => {
  if (!decision.decisionId) throw new ValidationError("CutDecision decisionId cannot be empty");
  if (!decision.decisionOrigin) throw new ValidationError("CutDecision must have explicit decisionOrigin");

  if (decision.decisionType === "TRIM" && decision.adjustedRange && candidate) {
    if (
      decision.adjustedRange.startUs < candidate.sourceRange.startUs ||
      decision.adjustedRange.endUs > candidate.sourceRange.endUs
    ) {
      throw new ValidationError(`TRIM adjustedRange exceeds candidate bounds for ${candidate.candidateId}`);
    }
  }
};

export const validateCutPlan = (plan: CutPlan): void => {
  if (!plan.cutPlanId || plan.cutPlanId.trim() === "") {
    throw new ValidationError("CutPlan cutPlanId cannot be empty");
  }
  if (plan.sourceMode !== "SINGLE_SOURCE_V1") {
    throw new ValidationError("CutPlan sourceMode must be SINGLE_SOURCE_V1 in V1");
  }
  if (!plan.sourceMedia || plan.sourceMedia.length !== 1) {
    throw new ValidationError("CutPlan must contain exactly one source media reference in SINGLE_SOURCE_V1 mode");
  }

  const primarySource = plan.sourceMedia[0]!;
  if (!primarySource.sourceAssetId || primarySource.durationUs <= 0) {
    throw new ValidationError("Primary source media reference must have valid sourceAssetId and positive duration");
  }

  let cumulativeDuration = 0;
  for (let i = 0; i < plan.segments.length; i++) {
    const seg = plan.segments[i]!;

    if (seg.sourceAssetId !== primarySource.sourceAssetId) {
      throw new ValidationError(`Segment ${seg.segmentId} references undeclared source ${seg.sourceAssetId}`);
    }

    if (seg.sourceRange.startUs < 0 || seg.sourceRange.endUs > primarySource.durationUs) {
      throw new ValidationError(`Segment ${seg.segmentId} sourceRange [${seg.sourceRange.startUs}, ${seg.sourceRange.endUs}] exceeds source duration ${primarySource.durationUs}`);
    }

    const segDur = seg.sourceRange.endUs - seg.sourceRange.startUs;
    if (segDur <= 0) {
      throw new ValidationError(`Segment ${seg.segmentId} has non-positive duration: ${segDur}`);
    }

    if (seg.editedRange.startUs !== cumulativeDuration) {
      throw new ValidationError(`Segment ${seg.segmentId} editedRange.startUs (${seg.editedRange.startUs}) does not match contiguous timeline offset (${cumulativeDuration})`);
    }

    cumulativeDuration += segDur;

    if (seg.editedRange.endUs !== cumulativeDuration) {
      throw new ValidationError(`Segment ${seg.segmentId} editedRange.endUs (${seg.editedRange.endUs}) does not match expected contiguous end (${cumulativeDuration})`);
    }
  }

  if (cumulativeDuration !== plan.timelineTarget.totalDurationUs) {
    throw new ValidationError(`Timeline totalDurationUs (${plan.timelineTarget.totalDurationUs}) does not match sum of segments (${cumulativeDuration})`);
  }
};

export const validateEditLock = (lock: EditLock): void => {
  if (!lock.editLockId || lock.editLockId.trim() === "") {
    throw new ValidationError("EditLock editLockId cannot be empty");
  }
  if (!lock.timeMappingHash || !lock.timeMappingHash.startsWith("tmh_")) {
    throw new ValidationError("EditLock timeMappingHash must be a valid deterministic hash starting with tmh_");
  }
  if (lock.status !== "LOCKED") {
    throw new ValidationError("EditLock status must be LOCKED upon minting");
  }
};
