import {describe, expect, it} from "vitest";
import {sourceToTimelineUs, timelineToSourceUs} from "./index.ts";

const clips = [{
  clipId: "CLIP-1",
  sourceStartUs: 10_000_000,
  sourceEndUs: 20_000_000,
  timelineStartUs: 0
}];

describe("time mapping", () => {
  it("projects source into edited timeline", () => {
    expect(sourceToTimelineUs(12_500_000, clips)).toBe(2_500_000);
  });

  it("projects timeline back to source", () => {
    expect(timelineToSourceUs(2_500_000, clips)).toBe(12_500_000);
  });
});
