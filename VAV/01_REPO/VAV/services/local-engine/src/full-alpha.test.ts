import {describe, expect, it} from "vitest";
import {parseRate} from "./full-alpha-media.ts";
import {segmentReadableCaptions} from "./full-alpha-transcription.ts";
import {parseContentText, parseMotionText} from "./full-alpha-context.ts";
import {buildSrt} from "./full-alpha-export.ts";

describe("Full Alpha pure logic", () => {
  it("parses rational FPS", () => {
    expect(parseRate("30000/1001")).toBeCloseTo(29.97002997);
  });

  it("rejects malformed or non-positive rational FPS", () => {
    expect(parseRate("30000/")).toBeNull();
    expect(parseRate("/1001")).toBeNull();
    expect(parseRate("30000/1001/2")).toBeNull();
    expect(parseRate("0/1001")).toBeNull();
    expect(parseRate("30000/0")).toBeNull();
  });

  it("segments long text", () => {
    const result = segmentReadableCaptions([{
      id: "x", startUs: 0, endUs: 6_000_000,
      text: "uno dos tres cuatro cinco seis siete ocho nueve diez once doce",
      timingQuality: "segment"
    }]);
    expect(result.length).toBeGreaterThan(1);
  });

  it("parses content ranges", () => {
    expect(parseContentText("00:02-00:07 hook: inicio")[0]?.role).toBe("hook");
  });

  it("applies Motion 03 policy", () => {
    expect(parseMotionText("00:10-00:14 ABRAXAS_MOTION_03 center")[0]?.captionVisibility).toBe("suppress");
  });

  it("creates SRT", () => {
    expect(buildSrt([{
      id: "a", startUs: 0, endUs: 1_500_000,
      text: "Hola", timingQuality: "segment"
    }])).toContain("00:00:01,500");
  });
});
