import {describe, expect, it} from "vitest";
import {buildCaptionHierarchy} from "./index.ts";

describe("caption hierarchy", () => {
  it("does not automatically use the last connector as hero", () => {
    const result = buildCaptionHierarchy("aprende a CRECER con estrategia", "hook", 1);
    expect(result.heroText.toLowerCase()).not.toBe("con");
    expect(result.heroText.length).toBeGreaterThan(0);
  });

  it("keeps negation visually attached to a selected concept", () => {
    const result = buildCaptionHierarchy("esto NO funciona", "hook", 1);
    expect(result.heroText.toLowerCase()).toContain("no");
    expect(result.heroText.toLowerCase()).toContain("funciona");
  });

  it("never drops words when a multi-word hero span is built", () => {
    const input = "You take any video today";
    const result = buildCaptionHierarchy(input, "hook", 2);
    const reconstructed = [result.supportBefore, result.heroText, result.supportAfter].filter(Boolean).join(" ");
    expect(reconstructed).toBe(input);
  });

  it("prioritizes numeric proof", () => {
    const result = buildCaptionHierarchy("subimos conversion 47% este mes", "proof", 1);
    expect(result.heroText).toContain("47%");
  });
});
