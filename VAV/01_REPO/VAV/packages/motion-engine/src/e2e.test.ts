import {describe, expect, it} from "vitest";
import {resolveMotionPlan, evaluateMotionTransform} from "./index.ts";
import type {EditLock} from "@vav/cut-domain";

describe("VAV Motions V1 Synthetic E2E", () => {
  it("renders deterministic frame transform evaluations for zoom, pan, and fade keyframes anchored to EditLock", () => {
    const syntheticLock: EditLock = {
      editLockId: "lock_synth_001",
      contentId: "cnt_synth",
      deliverableId: "deliv_synth_01",
      cutPlanId: "cp_synth_01",
      cutPlanVersion: 1,
      timeMappingVersion: 1,
      timeMappingHash: "tmh_synth_hash_001",
      timebase: {
        fpsRational: "30/1",
        fpsNominal: 30,
        width: 1080,
        height: 1920,
        durationUs: 6_000_000,
        totalFrames: 180
      },
      mappingRanges: [{rangeId: "r1", sourceAssetId: "src_01", sourceStartUs: 0, sourceEndUs: 6_000_000, editedStartUs: 0, editedEndUs: 6_000_000, speedMultiplier: 1.0}],
      removedRanges: [],
      lockedBy: "USER",
      lockedAt: "2026-08-30T13:30:00Z",
      status: "LOCKED"
    };

    const motionPlan = resolveMotionPlan({
      contentId: "cnt_synth",
      deliverableId: "deliv_synth_01",
      editLock: syntheticLock,
      intents: [
        {intentId: "i_zoom", timelineStartUs: 0, timelineEndUs: 2_000_000, role: "HOOK", suggestedPresetId: "PRESET_PUSH_IN_DYNAMIC_V1"},
        {intentId: "i_pan", timelineStartUs: 2_000_000, timelineEndUs: 4_000_000, role: "DEVELOPMENT", suggestedPresetId: "PRESET_HORIZONTAL_PAN_RIGHT_V1"},
        {intentId: "i_fade", timelineStartUs: 4_000_000, timelineEndUs: 6_000_000, role: "PAYOFF", suggestedPresetId: "PRESET_SMOOTH_FADE_OUT_V1"}
      ]
    });

    expect(motionPlan.assignments.length).toBe(3);
    expect(motionPlan.editLockId).toBe("lock_synth_001");

    // Sample Frame 1 (1.0s - midway through Push In)
    const t1 = evaluateMotionTransform(motionPlan, 1_000_000);
    expect(t1.scale).toBeGreaterThan(1.0);
    expect(t1.scale).toBeLessThanOrEqual(1.15);
    expect(t1.opacity).toBe(1.0);

    // Sample Frame 2 (3.0s - midway through Pan Right)
    const t2 = evaluateMotionTransform(motionPlan, 3_000_000);
    expect(t2.translateX).toBeGreaterThan(0);

    // Sample Frame 3 (5.0s - midway through Fade Out)
    const t3 = evaluateMotionTransform(motionPlan, 5_000_000);
    expect(t3.opacity).toBeLessThan(1.0);
    expect(t3.opacity).toBeGreaterThan(0.0);
  });
});
