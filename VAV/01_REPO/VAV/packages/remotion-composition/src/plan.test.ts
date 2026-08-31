import {describe, expect, it} from "vitest";
import {createCaptionPlan} from "./plan.ts";
import {generateRemotionMotionStyles} from "./motion-adapter.ts";
import {resolveMotionPlan} from "@vav/motion-engine";
import {SIMPLE_MOTION_FAMILIES, type SimpleMotionFamilyId} from "@vav/visual-motion-domain";
import {parseRationalFps, frameToUs} from "@vav/timebase";
import type {EditLock} from "@vav/cut-domain";

const editLock: EditLock = {
  editLockId: "lock_remotion_001",
  contentId: "cnt_remotion",
  deliverableId: "deliv_01",
  cutPlanId: "cp_01",
  cutPlanVersion: 1,
  timeMappingVersion: 1,
  timeMappingHash: "tmh_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  timebase: {fpsRational: "30/1", fpsNominal: 30, width: 1080, height: 1920, durationUs: 10_000_000, totalFrames: 300},
  mappingRanges: [{rangeId: "r1", sourceAssetId: "src_01", sourceStartUs: 0, sourceEndUs: 10_000_000, editedStartUs: 0, editedEndUs: 10_000_000, speedMultiplier: 1.0}],
  removedRanges: [],
  lockedBy: "USER",
  lockedAt: "2026-08-30T13:30:00Z",
  status: "LOCKED"
};

describe("remotion-composition & 13/13 Behavioral Materialization", () => {
  it("verifies rational timebase in Remotion frame conversion across NTSC/PAL/Film rates", () => {
    const testRates = ["30/1", "25/1", "24000/1001", "30000/1001"];
    for (const r of testRates) {
      const rat = parseRationalFps(r);
      const timeUs = frameToUs(30, rat);
      expect(timeUs).toBeGreaterThan(0);
      expect(Number.isFinite(timeUs)).toBe(true);
    }
  });

  it("verifies distinct behavioral effect at midpoint for each of the 13 Simple Motion Families", () => {
    expect(SIMPLE_MOTION_FAMILIES.length).toBe(13);

    for (const fam of SIMPLE_MOTION_FAMILIES) {
      const fid = fam.familyId;
      let params: Record<string, number | string | boolean> = {};

      if (fid === "MOT_ZOOM_IN" || fid === "MOT_PUSH_IN") {
        params = {startScale: 1.0, endScale: 1.25};
      } else if (fid === "MOT_ZOOM_OUT" || fid === "MOT_PULL_OUT") {
        params = {startScale: 1.25, endScale: 1.0};
      } else if (fid === "MOT_PAN_LEFT") {
        params = {translateXPercent: -15.0};
      } else if (fid === "MOT_PAN_RIGHT") {
        params = {translateXPercent: 15.0};
      } else if (fid === "MOT_SCALE") {
        params = {scale: 1.2};
      } else if (fid === "MOT_TRANSLATE") {
        params = {deltaX: 50, deltaY: 30};
      } else if (fid === "MOT_FADE_IN") {
        params = {fadeDurationUs: 2_000_000};
      } else if (fid === "MOT_FADE_OUT") {
        params = {fadeDurationUs: 2_000_000};
      } else if (fid === "MOT_REVEAL_WIPE") {
        params = {direction: "LEFT_TO_RIGHT", durationUs: 2_000_000};
      } else if (fid === "MOT_BASIC_PARALLAX") {
        params = {foregroundMultiplier: 1.5, backgroundMultiplier: 0.7};
      } else if (fid === "MOT_BASIC_TRANSITION") {
        params = {mode: "WHIP_DIP", transitionDurationUs: 2_000_000};
      }

      const motionPlan = resolveMotionPlan({
        contentId: "cnt_behavior_test",
        deliverableId: "deliv_01",
        editLock,
        intents: [{
          intentId: `intent_${fid}`,
          timelineStartUs: 0,
          timelineEndUs: 2_000_000,
          role: "HOOK",
          suggestedFamily: fid,
          parameters: params
        }]
      });

      // Midpoint: Frame 30 (1.0s) at 30fps
      const mid = generateRemotionMotionStyles(motionPlan, 30, "30/1", 1080, 1920);

      switch (fid) {
        case "MOT_ZOOM_IN":
        case "MOT_PUSH_IN":
          expect(mid.evaluatedState.scale).toBeGreaterThan(1.0);
          break;
        case "MOT_ZOOM_OUT":
        case "MOT_PULL_OUT":
          expect(mid.evaluatedState.scale).toBeLessThan(1.25);
          break;
        case "MOT_PAN_LEFT":
          expect(mid.evaluatedState.translateX).toBeLessThan(0);
          break;
        case "MOT_PAN_RIGHT":
          expect(mid.evaluatedState.translateX).toBeGreaterThan(0);
          break;
        case "MOT_SCALE":
          expect(mid.evaluatedState.scale).toBeCloseTo(1.2);
          break;
        case "MOT_TRANSLATE":
          expect(mid.evaluatedState.translateX !== 0 || mid.evaluatedState.translateY !== 0).toBe(true);
          break;
        case "MOT_FADE_IN":
        case "MOT_FADE_OUT":
          expect(mid.opacity).toBeGreaterThan(0.0);
          expect(mid.opacity).toBeLessThan(1.0);
          break;
        case "MOT_REVEAL_WIPE":
          expect(mid.clipPath).toBeDefined();
          break;
        case "MOT_BASIC_PARALLAX":
          expect(mid.evaluatedState.parallaxOffset !== 0 || mid.evaluatedState.cameraZ !== 0).toBe(true);
          break;
        case "MOT_BASIC_TRANSITION":
          expect(mid.transitionMode).toBe("WHIP_DIP");
          expect(mid.evaluatedState.transitionProgress).toBeGreaterThan(0);
          break;
      }
    }
  });
});
