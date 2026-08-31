import {describe, expect, it} from "vitest";
import {
  assembleCutPlan,
  generateTimeMappingFromCutPlan,
  mintEditLock,
  computeDerivativeInvalidation,
  buildFfmpegCutPlanCommand,
  exportCutPlanToEdl,
  exportCutPlanToFcpxml,
  sha256
} from "./index.ts";
import {
  DEFAULT_NEUTRAL_POLICY,
  MOKA_FRAME_MATCHED_LEGACY_POLICY,
  ValidationError,
  type CutCandidate,
  type CutDecision,
  type SourceMediaRef
} from "@vav/cut-domain";

const sourceMedia: [SourceMediaRef] = [{
  sourceAssetId: "src_moka_master",
  pathOrUri: "/tmp/synthetic_source.mp4",
  durationUs: 60_000_000,
  timebase: {fpsRational: "30/1", fpsNominal: 30, width: 1080, height: 1920}
}];

const candidates: CutCandidate[] = [
  {
    candidateId: "cand_01_hook",
    sourceAssetId: "src_moka_master",
    sourceRange: {startUs: 0, endUs: 5_000_000},
    editorialRole: "HOOK",
    confidence: 0.95
  },
  {
    candidateId: "cand_02_filler",
    sourceAssetId: "src_moka_master",
    sourceRange: {startUs: 6_000_000, endUs: 10_000_000},
    editorialRole: "FILLER",
    confidence: 0.40
  },
  {
    candidateId: "cand_03_payoff",
    sourceAssetId: "src_moka_master",
    sourceRange: {startUs: 55_000_000, endUs: 60_000_000},
    editorialRole: "PAYOFF",
    confidence: 0.98
  }
];

const decisions: CutDecision[] = [
  {decisionId: "d1", candidateId: "cand_01_hook", decisionType: "KEEP", decisionOrigin: "USER"},
  {decisionId: "d2", candidateId: "cand_02_filler", decisionType: "REMOVE", decisionOrigin: "RULE"},
  {decisionId: "d3", candidateId: "cand_03_payoff", decisionType: "TRIM", decisionOrigin: "USER", adjustedRange: {startUs: 56_000_000, endUs: 59_000_000}}
];

describe("@vav/cut-engine & SHA-256 Standards", () => {
  it("verifies SHA-256 against known standard NIST/RFC test vectors", () => {
    expect(sha256("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    expect(sha256("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(sha256("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")).toBe("248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1");
  });

  it("handles boundary limits gracefully by clamping handles without error", () => {
    const plan = assembleCutPlan({
      contentId: "cnt_boundary_test",
      deliverableId: "deliv_01",
      formatId: "FMT_SHORT_VERTICAL_VIDEO",
      sourceMedia,
      candidates,
      decisions,
      policy: MOKA_FRAME_MATCHED_LEGACY_POLICY
    });

    expect(plan.segments.length).toBe(2);
    expect(plan.segments[0]?.handles?.headUs).toBe(0);
    expect(plan.segments[0]?.handles?.tailUs).toBe(100_000);
    expect(plan.segments[1]?.handles?.tailUs).toBe(100_000);
  });

  it("validates effective REORDER sequence indices and rejects collisions against implicit/explicit indices", () => {
    // Collision: Candidate A has original index 0 (no target). Candidate C has targetSequenceIndex = 0.
    const collidingDecisions: CutDecision[] = [
      {decisionId: "d1", candidateId: "cand_01_hook", decisionType: "KEEP", decisionOrigin: "USER"},
      {decisionId: "d2", candidateId: "cand_02_filler", decisionType: "REMOVE", decisionOrigin: "RULE"},
      {decisionId: "d3", candidateId: "cand_03_payoff", decisionType: "REORDER", decisionOrigin: "USER", targetSequenceIndex: 0}
    ];

    expect(() => assembleCutPlan({
      contentId: "cnt_reorder_collision",
      deliverableId: "deliv_01",
      formatId: "FMT_SHORT_VERTICAL_VIDEO",
      sourceMedia,
      candidates,
      decisions: collidingDecisions
    })).toThrow(/Duplicate\/ambiguous effective sequence index/);

    // Valid: Candidate A target = 1, Candidate C target = 0
    const validReorderDecisions: CutDecision[] = [
      {decisionId: "d1", candidateId: "cand_01_hook", decisionType: "REORDER", decisionOrigin: "USER", targetSequenceIndex: 1},
      {decisionId: "d2", candidateId: "cand_02_filler", decisionType: "REMOVE", decisionOrigin: "RULE"},
      {decisionId: "d3", candidateId: "cand_03_payoff", decisionType: "REORDER", decisionOrigin: "USER", targetSequenceIndex: 0}
    ];

    const plan = assembleCutPlan({
      contentId: "cnt_valid_reorder",
      deliverableId: "deliv_01",
      formatId: "FMT_SHORT_VERTICAL_VIDEO",
      sourceMedia,
      candidates,
      decisions: validReorderDecisions
    });

    expect(plan.segments[0]?.editorialRole).toBe("PAYOFF");
    expect(plan.segments[1]?.editorialRole).toBe("HOOK");
  });

  it("mints an immutable EditLock with deterministic SHA-256 mapping identity", () => {
    const planV1 = assembleCutPlan({
      contentId: "cnt_lock_test",
      deliverableId: "deliv_01",
      formatId: "FMT_SHORT_VERTICAL_VIDEO",
      sourceMedia,
      candidates,
      decisions
    });

    const lockV1a = mintEditLock(planV1);
    const lockV1b = mintEditLock(planV1);
    expect(lockV1a.timeMappingHash).toMatch(/^tmh_[0-9a-f]{64}$/);
    expect(lockV1a.timeMappingHash).toBe(lockV1b.timeMappingHash);
  });

  it("enforces EDL rate safety and allows valid FCPXML across all rates", () => {
    const ntscPlan = assembleCutPlan({
      contentId: "cnt_ntsc",
      deliverableId: "deliv_01",
      formatId: "FMT_SHORT_VERTICAL_VIDEO",
      sourceMedia,
      candidates: [candidates[0]!],
      decisions: [decisions[0]!],
      timelineFpsRational: "30000/1001"
    });

    expect(() => exportCutPlanToEdl(ntscPlan)).toThrow(/EDL V1 does not support NTSC 30000\/1001/);

    const palPlan = assembleCutPlan({
      contentId: "cnt_pal",
      deliverableId: "deliv_01",
      formatId: "FMT_SHORT_VERTICAL_VIDEO",
      sourceMedia,
      candidates: [candidates[0]!],
      decisions: [decisions[0]!],
      timelineFpsRational: "25/1"
    });
    expect(exportCutPlanToEdl(palPlan)).toContain("TITLE: DELIV_01");

    const fcpxmlNtsc = exportCutPlanToFcpxml(ntscPlan);
    expect(fcpxmlNtsc).toContain('frameDuration="1001/30000s"');
  });
});
