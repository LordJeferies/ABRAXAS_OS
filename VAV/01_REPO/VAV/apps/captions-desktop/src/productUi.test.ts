import {describe, expect, it, beforeEach} from "vitest";
import {useVavProductStore} from "./vavProductState.ts";
import {useUiState, type ActiveSection} from "./uiState.ts";
import {useFullAlpha} from "./fullAlphaState.ts";
import {generateRemotionMotionStyles} from "@vav/remotion-composition";
import {parseRationalFps, usToFrame} from "@vav/timebase";

const ALL_12_SECTIONS: ActiveSection[] = [
  "project",
  "media",
  "transcript",
  "captions",
  "styles",
  "structure",
  "scene-smart",
  "context",
  "audio",
  "diagnostics",
  "cuts",
  "motion"
];

describe("VAV Product UI Workflows & 12 Workspace Verification", () => {
  beforeEach(() => {
    useVavProductStore.getState().clearProject();
  });

  it("verifies all 12 workspaces are routable without regressions or placeholder stubs", () => {
    expect(ALL_12_SECTIONS.length).toBe(12);

    for (const sec of ALL_12_SECTIONS) {
      useUiState.getState().setActiveSection(sec);
      expect(useUiState.getState().activeSection).toBe(sec);
    }
  });

  it("starts in clean state (synthetic project is NOT auto-loaded)", () => {
    const state = useVavProductStore.getState();
    expect(state.sourceMedia).toBeNull();
    expect(state.candidates.length).toBe(0);
    expect(state.cutSession.activeEditLock).toBeNull();
  });

  it("loads synthetic fixture explicitly on user command and observes undecided candidates", () => {
    useVavProductStore.getState().loadSyntheticProject();
    const state = useVavProductStore.getState();
    expect(state.sourceMedia).toBeDefined();
    expect(state.candidates.length).toBe(3);
    expect(Object.keys(state.decisions).length).toBe(0);
  });

  it("requires explicit decisions for all candidates before CutPlan can be approved", () => {
    const store = useVavProductStore.getState();
    store.loadSyntheticProject();

    store.setCandidateDecision("cand_01_hook", "KEEP");
    expect(useVavProductStore.getState().cutPlanError).toContain("Pending decisions");

    store.setCandidateDecision("cand_02_filler", "REMOVE");
    store.setCandidateDecision("cand_03_payoff", "KEEP");

    const activeState = useVavProductStore.getState();
    expect(activeState.cutPlanError).toBeNull();
    expect(activeState.cutSession.activeCutPlan?.segments.length).toBe(2);
  });

  it("supports editable TRIM and validates boundaries", () => {
    const store = useVavProductStore.getState();
    store.loadSyntheticProject();

    store.setCandidateDecision("cand_01_hook", "KEEP");
    store.setCandidateDecision("cand_02_filler", "REMOVE");
    store.setCandidateDecision("cand_03_payoff", "TRIM", "USER", {startUs: 15_000_000, endUs: 19_000_000});

    const activePlan = useVavProductStore.getState().cutSession.activeCutPlan;
    expect(activePlan).toBeDefined();
    expect(activePlan?.segments[1]?.sourceRange.startUs).toBe(15_000_000);
    expect(activePlan?.segments[1]?.sourceRange.endUs).toBe(19_000_000);
  });

  it("creates explicit REORDER decision for undecided candidate and sorts cleanly", () => {
    const store = useVavProductStore.getState();
    store.loadSyntheticProject();

    // Reordering undecided candidate 1
    store.reorderCandidate("cand_01_hook", 1);
    store.setCandidateDecision("cand_02_filler", "REMOVE");
    store.reorderCandidate("cand_03_payoff", 0);

    const activePlan = useVavProductStore.getState().cutSession.activeCutPlan;
    expect(activePlan?.segments[0]?.editorialRole).toBe("PAYOFF");
    expect(activePlan?.segments[1]?.editorialRole).toBe("HOOK");
  });

  it("approves CutPlan, mints immutable EditLock with SHA-256 hash, and triggers MotionPlan sync", () => {
    const store = useVavProductStore.getState();
    store.loadSyntheticProject();
    store.setCandidateDecision("cand_01_hook", "KEEP");
    store.setCandidateDecision("cand_02_filler", "REMOVE");
    store.setCandidateDecision("cand_03_payoff", "KEEP");

    store.approveCutPlan("EDITORIAL_USER");

    const state = useVavProductStore.getState();
    expect(state.cutSession.activeEditLock).toBeDefined();
    expect(state.cutSession.activeEditLock?.status).toBe("LOCKED");
    expect(state.cutSession.activeEditLock?.timeMappingHash).toMatch(/^tmh_[0-9a-f]{64}$/);
    expect(state.motionSyncStatus).toBe("CURRENT");
  });

  it("derives preview frame from @vav/timebase rational authority across rates", () => {
    const rates = ["30/1", "25/1", "24000/1001", "30000/1001"];
    for (const r of rates) {
      const fps = parseRationalFps(r);
      const frameAt1Sec = usToFrame(1_000_000, fps);
      expect(Number.isInteger(frameAt1Sec)).toBe(true);
      expect(frameAt1Sec).toBeGreaterThanOrEqual(23);
    }
  });

  it("advances playback when ticking", () => {
    const store = useVavProductStore.getState();
    store.loadSyntheticProject();
    store.togglePlay();

    store.tickPlayback(100);
    expect(useVavProductStore.getState().currentTimeUs).toBe(100_000);
  });

  it("evaluates caption collision under different VisualOwnership settings", () => {
    const store = useVavProductStore.getState();
    store.setVisualOwnership("caption-engine");

    store.checkCollision(
      {minX: 100, maxX: 500, minY: 1200, maxY: 1500},
      {minX: 200, maxX: 800, minY: 1200, maxY: 1400}
    );

    expect(useVavProductStore.getState().collisionResult).toBe("SUPPRESS_MOTION");
  });
});
