import {describe, expect, it} from "vitest";
import {
  captionAtFrame,
  defaultDesign,
  formatUs,
  frameFromUs,
  resolvePlacement,
  styleCatalog
} from "./fullAlphaDomain.ts";

describe("Full Alpha editor domain", () => {
  it("keeps 4 styles", () => expect(styleCatalog).toHaveLength(4));
  it("maps microseconds to frames", () => expect(frameFromUs(1_000_000, 30)).toBe(30));
  it("finds active caption", () => {
    expect(captionAtFrame([{
      id: "x", startUs: 500_000, endUs: 1_500_000,
      text: "hola", timingQuality: "segment"
    }], 30, 30)?.id).toBe("x");
  });
  it("resolves auto placement", () => {
    expect(resolvePlacement("auto", {suggestedPlacement: "top-center"})).toBe("top-center");
  });
  it("keeps defaults", () => {
    expect(defaultDesign.safeZones).toBe(true);
    expect(formatUs(65_250_000)).toBe("01:05.25");
  });
});
