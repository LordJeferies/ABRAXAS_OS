import type {Rational} from "@vav/timebase";

export type CutDecisionType = "KEEP" | "REMOVE" | "TRIM" | "REORDER";
export type CutDecisionOrigin = "USER" | "RULE" | "SHIM_EVIDENCE" | "IMPORT";

export type SourceMediaRef = Readonly<{
  sourceAssetId: string;
  pathOrUri: string;
  sha256?: string | null | undefined;
  durationUs: number;
  timebase: {
    fpsRational: string;
    fpsNominal: number;
    width: number;
    height: number;
  };
}>;

export type TimelineTarget = Readonly<{
  fpsRational: string;
  width: number;
  height: number;
  totalDurationUs: number;
}>;

export type CutPolicy = Readonly<{
  policyName?: string | undefined;
  handleDurationUs: number;
  silenceRemovalThresholdDb: number;
  minSilenceDurationUs: number;
  consonantTailPreservationUs: number;
  breathBehavior: "PRESERVE" | "ATTENUATE_6DB" | "STRIP";
}>;

export const DEFAULT_NEUTRAL_POLICY: CutPolicy = {
  policyName: "DEFAULT_NEUTRAL",
  handleDurationUs: 0,
  silenceRemovalThresholdDb: 0,
  minSilenceDurationUs: 0,
  consonantTailPreservationUs: 0,
  breathBehavior: "PRESERVE"
};

export const MOKA_FRAME_MATCHED_LEGACY_POLICY: CutPolicy = {
  policyName: "MOKA_FRAME_MATCHED_LEGACY",
  handleDurationUs: 100_000,
  silenceRemovalThresholdDb: -38.0,
  minSilenceDurationUs: 350_000,
  consonantTailPreservationUs: 80_000,
  breathBehavior: "ATTENUATE_6DB"
};

export type CutCandidate = Readonly<{
  candidateId: string;
  sourceAssetId: string;
  sourceRange: {
    startUs: number;
    endUs: number;
    startFrame?: number | undefined;
    endFrame?: number | undefined;
  };
  speaker?: {
    speakerId: string;
    confidence?: number | undefined;
  } | undefined;
  editorialRole: string;
  confidence: number;
  rationale?: string | undefined;
}>;

export type CutDecision = Readonly<{
  decisionId: string;
  candidateId: string;
  decisionType: CutDecisionType;
  decisionOrigin: CutDecisionOrigin;
  adjustedRange?: {
    startUs: number;
    endUs: number;
  } | undefined;
  targetSequenceIndex?: number | undefined;
  reason?: string | undefined;
}>;

export type CutSegment = Readonly<{
  segmentId: string;
  sequenceIndex: number;
  sourceAssetId: string;
  sourceRange: {
    startUs: number;
    endUs: number;
    startFrame: number;
    endFrame: number;
  };
  editedRange: {
    startUs: number;
    endUs: number;
    startFrame: number;
    endFrame: number;
  };
  handles: {
    headUs: number;
    tailUs: number;
  };
  speaker?: {
    speakerId: string;
    confidence?: number | undefined;
  } | undefined;
  editorialRole: string;
  reconciliationRef?: string | undefined;
}>;

export type CutPlan = Readonly<{
  cutPlanId: string;
  version: number;
  contentId: string;
  deliverableId: string;
  formatId: string;
  sourceMode: "SINGLE_SOURCE_V1";
  sourceMedia: readonly [SourceMediaRef];
  timelineTarget: TimelineTarget;
  cuttingPolicies: CutPolicy;
  segments: readonly CutSegment[];
  provenance: {
    createdBy: string;
    createdAt: string;
    basedOnShimMap?: string | undefined;
    status: "DRAFT" | "APPROVED" | "LOCKED" | "DEPRECATED";
  };
}>;

export type EditLockMappingRange = Readonly<{
  rangeId: string;
  sourceAssetId: string;
  sourceStartUs: number;
  sourceEndUs: number;
  editedStartUs: number;
  editedEndUs: number;
  speedMultiplier: number;
}>;

export type EditLockRemovedRange = Readonly<{
  sourceAssetId: string;
  sourceStartUs: number;
  sourceEndUs: number;
  reason: string;
}>;

export type EditLock = Readonly<{
  editLockId: string;
  contentId: string;
  deliverableId: string;
  cutPlanId: string;
  cutPlanVersion: number;
  timeMappingVersion: number;
  timeMappingHash: string;
  timebase: {
    fpsRational: string;
    fpsNominal: number;
    width: number;
    height: number;
    durationUs: number;
    totalFrames: number;
  };
  mappingRanges: readonly EditLockMappingRange[];
  removedRanges: readonly EditLockRemovedRange[];
  lockedBy: string;
  lockedAt: string;
  status: "LOCKED";
}>;

export type CutInvalidationResult = Readonly<{
  previousLockId: string | null;
  newLockId: string;
  invalidatedDerivatives: readonly ("CAPTIONS" | "MOTIONS" | "RENDER" | "QC")[];
  reason: string;
  timestamp: string;
}>;
