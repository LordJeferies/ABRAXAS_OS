import {describe, expect, it} from "vitest";
import {canUsePreferredDepth, placementScore} from "./index.ts";

describe("spatial scene", () => {
  it("penalizes mouth/source text collisions", () => {
    const clean = placementScore({negativeSpace: 1, contrast: 1, continuity: 1, stylePrior: 1, lowSaliency: 1, depthSuitability: 1, mouthCollision: 0, eyeCollision: 0, sourceTextCollision: 0, faceCollision: 0, highMotion: 0});
    const blocked = placementScore({negativeSpace: 1, contrast: 1, continuity: 1, stylePrior: 1, lowSaliency: 1, depthSuitability: 1, mouthCollision: 1, eyeCollision: 0, sourceTextCollision: 1, faceCollision: 0, highMotion: 0});
    expect(clean).toBeGreaterThan(blocked);
  });

  it("falls back when a subject mask is too weak", () => {
    const policy = {preferred: "behind-subject" as const, fallback: "foreground-overlay" as const, subjectMaskRequired: true, minimumMaskConfidence: .82, maxTextOcclusion: .25, protectHeroWord: true};
    expect(canUsePreferredDepth(policy, .91, .2)).toBe(true);
    expect(canUsePreferredDepth(policy, .7, .2)).toBe(false);
    expect(canUsePreferredDepth(policy, .95, .4)).toBe(false);
  });
});
