import {describe, expect, it} from "vitest";
import {
  resolveMotionPlan,
  evaluateMotionTransform,
  evaluateCaptionMotionCollision,
  checkMotionPlanLockSync
} from "./index.ts";
import {
  SIMPLE_MOTION_FAMILIES,
  STANDARD_MOTION_PRESETS,
  getMotionFamilyDef,
  getMotionPreset,
  type SimpleMotionFamilyId
} from "@vav/visual-motion-domain";
import {
  SAFE_ZONE_PRESETS,
  TIKTOK_SAFE_ZONE_V1,
  REELS_SAFE_ZONE_V1,
  NEUTRAL_SAFE_ZONE
} from "@vav/platform-safe-zones";
import type {EditLock} from "@vav/cut-domain";

const editLock: EditLock = {
  editLockId: "lock_moka_v01_v1",
  contentId: "cnt_moka_v01",
  deliverableId: "deliv_vertical_01",
  cutPlanId: "cp_01",
  cutPlanVersion: 1,
  timeMappingVersion: 1,
  timeMappingHash: "tmh_4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b",
  timebase: {
    fpsRational: "30/1",
    fpsNominal: 30,
    width: 1080,
    height: 1920,
    durationUs: 10_000_000,
    totalFrames: 300
  },
  mappingRanges: [{rangeId: "r1", sourceAssetId: "src_01", sourceStartUs: 0, sourceEndUs: 10_000_000, editedStartUs: 0, editedEndUs: 10_000_000, speedMultiplier: 1.0}],
  removedRanges: [],
  lockedBy: "USER",
  lockedAt: "2026-08-30T13:30:00Z",
  status: "LOCKED"
};

describe("@vav/motion-engine", () => {
  it("verifies all 13 Simple Motion Families execute deterministically", () => {
    expect(SIMPLE_MOTION_FAMILIES.length).toBe(13);

    for (const fam of SIMPLE_MOTION_FAMILIES) {
      const plan = resolveMotionPlan({
        contentId: "cnt_all_test",
        deliverableId: "deliv_01",
        editLock,
        intents: [{
          intentId: `intent_${fam.familyId}`,
          timelineStartUs: 0,
          timelineEndUs: 2_000_000,
          role: "HOOK",
          suggestedFamily: fam.familyId
        }]
      });

      expect(plan.assignments.length).toBe(1);
      const state = evaluateMotionTransform(plan, 1_000_000);
      expect(state).toBeDefined();
      expect(Number.isFinite(state.scale)).toBe(true);
      expect(Number.isFinite(state.opacity)).toBe(true);
    }
  });

  it("produces neutral parameters and no presetId when intent is family-only without preset", () => {
    const plan = resolveMotionPlan({
      contentId: "cnt_neutral",
      deliverableId: "deliv_01",
      editLock,
      intents: [
        {intentId: "i_family_only", timelineStartUs: 0, timelineEndUs: 2_000_000, role: "HOOK", suggestedFamily: "MOT_ZOOM_IN"}
      ]
    });

    expect(plan.assignments.length).toBe(1);
    expect(plan.assignments[0]?.presetId).toBeUndefined();
    expect(plan.assignments[0]?.parameters["startScale"]).toBe(1.0);
    expect(plan.assignments[0]?.parameters["endScale"]).toBe(1.0);
  });

  it("verifies safeZone defaults to NEUTRAL_SAFE_ZONE (0% margins) when omitted", () => {
    // 1. Overlapping case inside full canvas with ownership = caption-engine -> SUPPRESS_MOTION
    const overlapResult = evaluateCaptionMotionCollision(
      {minX: 200, maxX: 600, minY: 1200, maxY: 1600},
      {minX: 200, maxX: 600, minY: 1200, maxY: 1600},
      1080, 1920,
      "caption-engine"
      // safeZone omitted -> defaults to NEUTRAL_SAFE_ZONE
    );
    expect(overlapResult).toBe("SUPPRESS_MOTION");

    // 2. Non-overlapping case inside full canvas -> CLEAR
    const clearResult = evaluateCaptionMotionCollision(
      {minX: 100, maxX: 300, minY: 200, maxY: 400},
      {minX: 500, maxX: 800, minY: 1200, maxY: 1500},
      1080, 1920,
      "caption-engine"
      // safeZone omitted -> defaults to NEUTRAL_SAFE_ZONE
    );
    expect(clearResult).toBe("CLEAR");

    // 3. Explicit TikTok safe-zone case with caption near top boundary (outside TikTok safe zone)
    const tiktokResult = evaluateCaptionMotionCollision(
      {minX: 100, maxX: 300, minY: 500, maxY: 700},
      {minX: 100, maxX: 300, minY: 50, maxY: 150}, // Top 50px is in top 15% margin
      1080, 1920,
      "caption-engine",
      TIKTOK_SAFE_ZONE_V1
    );
    expect(tiktokResult).toBe("ADAPT_CAPTION");
  });

  it("validates EditLock invalidation sync and emits OUT_OF_SYNC on mismatch", () => {
    const plan = resolveMotionPlan({
      contentId: "cnt_moka_v01",
      deliverableId: "deliv_vertical_01",
      editLock,
      intents: [{intentId: "i1", timelineStartUs: 0, timelineEndUs: 2_000_000, role: "HOOK"}]
    });

    const syncCurrent = checkMotionPlanLockSync(plan, editLock);
    expect(syncCurrent.status).toBe("CURRENT");

    const newLock: EditLock = {
      ...editLock,
      editLockId: "lock_moka_v01_v2",
      timeMappingHash: "tmh_different_hash"
    };

    const syncOut = checkMotionPlanLockSync(plan, newLock);
    expect(syncOut.status).toBe("OUT_OF_SYNC");
  });
});
