import {describe, expect, it} from "vitest";
import {
  DEFAULT_NEUTRAL_POLICY,
  MOKA_FRAME_MATCHED_LEGACY_POLICY,
  validateCutCandidate,
  validateCutDecision,
  validateCutPlan,
  validateCutPolicy,
  validateEditLock,
  createCutPlanArtifact,
  createEditLockArtifact,
  createCutPlanCreatedEvent,
  createEditLockCreatedEvent,
  createDerivativeOutOfSyncEvent,
  createLienzoEditLayerWriteback,
  ValidationError,
  type CutCandidate,
  type CutDecision,
  type CutPlan,
  type EditLock
} from "./index.ts";

describe("@vav/cut-domain", () => {
  it("validates neutral policy and legacy preset", () => {
    expect(() => validateCutPolicy(DEFAULT_NEUTRAL_POLICY)).not.toThrow();
    expect(DEFAULT_NEUTRAL_POLICY.handleDurationUs).toBe(0);
    expect(DEFAULT_NEUTRAL_POLICY.consonantTailPreservationUs).toBe(0);
    expect(DEFAULT_NEUTRAL_POLICY.breathBehavior).toBe("PRESERVE");

    expect(() => validateCutPolicy(MOKA_FRAME_MATCHED_LEGACY_POLICY)).not.toThrow();
    expect(MOKA_FRAME_MATCHED_LEGACY_POLICY.handleDurationUs).toBe(100_000);
    expect(MOKA_FRAME_MATCHED_LEGACY_POLICY.consonantTailPreservationUs).toBe(80_000);
  });

  it("validates CutCandidate against source duration bounds", () => {
    const valid: CutCandidate = {
      candidateId: "cand_01",
      sourceAssetId: "src_01",
      sourceRange: {startUs: 1_000_000, endUs: 5_000_000},
      editorialRole: "HOOK",
      confidence: 0.95
    };
    expect(() => validateCutCandidate(valid, 10_000_000)).not.toThrow();
    expect(() => validateCutCandidate(valid, 4_000_000)).toThrow(ValidationError);
  });

  it("validates CutDecision with explicit decisionOrigin and rejects TRIM out of bounds", () => {
    const candidate: CutCandidate = {
      candidateId: "cand_01",
      sourceAssetId: "src_01",
      sourceRange: {startUs: 1_000_000, endUs: 5_000_000},
      editorialRole: "HOOK",
      confidence: 0.95
    };

    const validTrim: CutDecision = {
      decisionId: "d1",
      candidateId: "cand_01",
      decisionType: "TRIM",
      decisionOrigin: "USER",
      adjustedRange: {startUs: 2_000_000, endUs: 4_000_000}
    };
    expect(() => validateCutDecision(validTrim, candidate)).not.toThrow();

    const invalidTrim: CutDecision = {
      decisionId: "d2",
      candidateId: "cand_01",
      decisionType: "TRIM",
      decisionOrigin: "USER",
      adjustedRange: {startUs: 500_000, endUs: 4_000_000} // starts before candidate
    };
    expect(() => validateCutDecision(invalidTrim, candidate)).toThrow(ValidationError);
  });

  it("validates compliant CutPlan with single-source V1 mode", () => {
    const plan: CutPlan = {
      cutPlanId: "cp_01",
      version: 1,
      contentId: "cnt_01",
      deliverableId: "deliv_01",
      formatId: "FMT_SHORT_VERTICAL_VIDEO",
      sourceMode: "SINGLE_SOURCE_V1",
      sourceMedia: [{
        sourceAssetId: "src_01",
        pathOrUri: "/path/video.mp4",
        durationUs: 60_000_000,
        timebase: {fpsRational: "30/1", fpsNominal: 30, width: 1080, height: 1920}
      }],
      timelineTarget: {fpsRational: "30/1", width: 1080, height: 1920, totalDurationUs: 10_000_000},
      cuttingPolicies: DEFAULT_NEUTRAL_POLICY,
      segments: [
        {
          segmentId: "seg_01",
          sequenceIndex: 0,
          sourceAssetId: "src_01",
          sourceRange: {startUs: 1_000_000, endUs: 6_000_000, startFrame: 30, endFrame: 180},
          editedRange: {startUs: 0, endUs: 5_000_000, startFrame: 0, endFrame: 150},
          handles: {headUs: 0, tailUs: 0},
          editorialRole: "HOOK"
        },
        {
          segmentId: "seg_02",
          sequenceIndex: 1,
          sourceAssetId: "src_01",
          sourceRange: {startUs: 10_000_000, endUs: 15_000_000, startFrame: 300, endFrame: 450},
          editedRange: {startUs: 5_000_000, endUs: 10_000_000, startFrame: 150, endFrame: 300},
          handles: {headUs: 0, tailUs: 0},
          editorialRole: "PAYOFF"
        }
      ],
      provenance: {
        createdBy: "TEST",
        createdAt: "2026-08-30T13:30:00Z",
        status: "DRAFT"
      }
    };
    expect(() => validateCutPlan(plan)).not.toThrow();
  });

  it("creates valid artifact, event, and Lienzo writeback adapters", () => {
    const plan: CutPlan = {
      cutPlanId: "cp_01",
      version: 1,
      contentId: "cnt_01",
      deliverableId: "deliv_01",
      formatId: "FMT_SHORT_VERTICAL_VIDEO",
      sourceMode: "SINGLE_SOURCE_V1",
      sourceMedia: [{
        sourceAssetId: "src_01",
        pathOrUri: "/path/video.mp4",
        durationUs: 60_000_000,
        timebase: {fpsRational: "30/1", fpsNominal: 30, width: 1080, height: 1920}
      }],
      timelineTarget: {fpsRational: "30/1", width: 1080, height: 1920, totalDurationUs: 5_000_000},
      cuttingPolicies: DEFAULT_NEUTRAL_POLICY,
      segments: [{
        segmentId: "seg_01",
        sequenceIndex: 0,
        sourceAssetId: "src_01",
        sourceRange: {startUs: 0, endUs: 5_000_000, startFrame: 0, endFrame: 150},
        editedRange: {startUs: 0, endUs: 5_000_000, startFrame: 0, endFrame: 150},
        handles: {headUs: 0, tailUs: 0},
        editorialRole: "HOOK"
      }],
      provenance: {createdBy: "TEST", createdAt: "2026-08-30T13:30:00Z", status: "APPROVED"}
    };

    const lock: EditLock = {
      editLockId: "lock_01",
      contentId: "cnt_01",
      deliverableId: "deliv_01",
      cutPlanId: "cp_01",
      cutPlanVersion: 1,
      timeMappingVersion: 1,
      timeMappingHash: "tmh_test_1234",
      timebase: {fpsRational: "30/1", fpsNominal: 30, width: 1080, height: 1920, durationUs: 5_000_000, totalFrames: 150},
      mappingRanges: [{rangeId: "r1", sourceAssetId: "src_01", sourceStartUs: 0, sourceEndUs: 5_000_000, editedStartUs: 0, editedEndUs: 5_000_000, speedMultiplier: 1.0}],
      removedRanges: [],
      lockedBy: "USER",
      lockedAt: "2026-08-30T13:30:00Z",
      status: "LOCKED"
    };

    const art = createCutPlanArtifact(plan, "file:///artifacts/cutplan.json");
    expect(art.type).toBe("cut_plan");
    expect(art.version).toBe(1);

    const evt = createEditLockCreatedEvent(lock);
    expect(evt.reason).toBe("EDIT_LOCK_CREATED");

    const writeback = createLienzoEditLayerWriteback(plan, lock);
    expect(writeback.status).toBe("LOCKED");
    expect(writeback.timeMappingHash).toBe("tmh_test_1234");
  });
});
