import {describe, expect, it} from "vitest";
import {
  AUTOSAVE_INTERVAL_MS,
  canOpenProjectVersion,
  scoreRelinkCandidate,
  initialCutSessionState,
  createCutPlanAction,
  updateCutPlanAction,
  undoCutPlanAction,
  approveCutPlanAction
} from "./index.ts";
import type {SourceMediaRef, CutCandidate, CutDecision} from "@vav/cut-domain";

const sourceMedia: [SourceMediaRef] = [{
  sourceAssetId: "src_01",
  pathOrUri: "/path/video.mp4",
  durationUs: 60_000_000,
  timebase: {fpsRational: "30/1", fpsNominal: 30, width: 1080, height: 1920}
}];

const candidates: CutCandidate[] = [
  {
    candidateId: "c1",
    sourceAssetId: "src_01",
    sourceRange: {startUs: 1_000_000, endUs: 5_000_000},
    editorialRole: "HOOK",
    confidence: 0.95
  },
  {
    candidateId: "c2",
    sourceAssetId: "src_01",
    sourceRange: {startUs: 6_000_000, endUs: 10_000_000},
    editorialRole: "PAYOFF",
    confidence: 0.98
  }
];

const decisions: CutDecision[] = [
  {decisionId: "d1", candidateId: "c1", decisionType: "KEEP", decisionOrigin: "USER"},
  {decisionId: "d2", candidateId: "c2", decisionType: "KEEP", decisionOrigin: "USER"}
];

describe("project-session", () => {
  it("keeps autosave interval positive", () => {
    expect(AUTOSAVE_INTERVAL_MS).toBeGreaterThan(0);
  });

  it("handles basic migration and relink helpers", () => {
    expect(canOpenProjectVersion(1)).toBe(true);
    expect(scoreRelinkCandidate({filenameMatch: true, byteSizeMatch: true, durationDeltaMs: 100, partialHashMatch: true})).toBe(100);
  });

  it("manages CutSessionState actions with reversible history and EditLock approval", () => {
    let session = initialCutSessionState;

    session = createCutPlanAction(session, {
      contentId: "cnt_session",
      deliverableId: "deliv_01",
      formatId: "FMT_SHORT_VERTICAL_VIDEO",
      sourceMedia,
      candidates: [candidates[0]!],
      decisions: [decisions[0]!]
    });
    expect(session.activeCutPlan?.version).toBe(1);

    session = updateCutPlanAction(session, {
      contentId: "cnt_session",
      deliverableId: "deliv_01",
      formatId: "FMT_SHORT_VERTICAL_VIDEO",
      sourceMedia,
      candidates,
      decisions
    });
    expect(session.activeCutPlan?.version).toBe(2);

    session = undoCutPlanAction(session);
    expect(session.activeCutPlan?.version).toBe(1);

    session = approveCutPlanAction(session, "TEST_EDITOR");
    expect(session.activeCutPlan?.provenance.status).toBe("APPROVED");
    expect(session.activeEditLock?.status).toBe("LOCKED");
    expect(session.activeEditLock?.lockedBy).toBe("TEST_EDITOR");
  });
});
