import {describe, expect, it} from "vitest";
import {secondsToUs, usToFrame} from "./index.ts";

describe("timebase", () => {
  it("stores seconds as integer microseconds", () => {
    expect(secondsToUs(5.85)).toBe(5_850_000);
  });

  it("converts integer time to frame using rational fps", () => {
    expect(usToFrame(1_000_000, {num: 30_000, den: 1_001})).toBe(30);
  });
});
