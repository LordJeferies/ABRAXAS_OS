import {describe, expect, it} from "vitest";
import {evaluateBaselineMotion} from "./index.ts";

describe("caption motion", () => {
  it("slide blur resolves from 65px/22px toward rest", () => {
    const a = evaluateBaselineMotion("slide-blur-lite", 0, 30);
    const b = evaluateBaselineMotion("slide-blur-lite", 20, 30);
    expect(a.translateY).toBe(65);
    expect(a.blurPx).toBe(22);
    expect(b.translateY).toBeLessThan(a.translateY);
  });
  it("applies a real exit phase when caption duration is known", () => {
    const middle = evaluateBaselineMotion("impact-kinetic", 15, 30, 60, 1080);
    const ending = evaluateBaselineMotion("impact-kinetic", 59, 30, 60, 1080);
    expect(ending.opacity).toBeLessThan(middle.opacity);
    expect(ending.translateX).toBeGreaterThan(middle.translateX);
    expect(ending.blurPx).toBeGreaterThan(middle.blurPx);
  });

});
