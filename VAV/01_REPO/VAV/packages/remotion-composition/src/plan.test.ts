import {describe, expect, it} from "vitest";
import {createCaptionPlan} from "./plan.ts";

const base = () => ({
  width: 1080,
  height: 1920,
  fps: 30,
  sourceFpsRational: "30000/1001",
  durationUs: 2_000_000,
  captions: [{id: "c1", startUs: 0, endUs: 1_000_000, text: "Esto cambia TODO", timingQuality: "segment" as const}],
  design: {styleId: "hybrid-inspirational", structureId: "hero-stack", motionId: "slide-blur-lite", placement: "auto" as const, safeZones: true},
  scenes: [{id: "s1", startUs: 0, endUs: 2_000_000, suggestedPlacement: "center-low" as const}],
  contentCandidates: [{id: "r1", startUs: 0, endUs: 2_000_000, role: "hook" as const, label: "Hook", motionHint: null}],
  motionContexts: [],
  approvedStylePresets: [],
  approvedMotionPresets: [],
  previewStylePreset: null,
  previewMotionPreset: null
});

describe("CaptionPlan V1", () => {
  it("is deterministic for the same resolved editor state", () => {
    expect(createCaptionPlan(base())).toEqual(createCaptionPlan(base()));
  });

  it("preserves integer microseconds and source FPS evidence", () => {
    const plan = createCaptionPlan(base());
    expect(plan.durationUs).toBe(2_000_000);
    expect(plan.captions[0]?.endUs).toBe(1_000_000);
    expect(plan.sourceFpsRational).toBe("30000/1001");
    expect(plan.renderVersion).toBe("v12-remotion-parity-1");
  });
});
