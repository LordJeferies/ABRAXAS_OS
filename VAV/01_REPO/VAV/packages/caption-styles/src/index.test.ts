import {describe, expect, it} from "vitest";
import {builtInCaptionStyles, mergeCaptionStyleRegistry, resolveCaptionVisual} from "./index.ts";

describe("caption styles", () => {
  it("keeps four built-in families", () => {
    expect(builtInCaptionStyles.map((x) => x.id)).toEqual(["hybrid-inspirational", "hollow-glow", "impact-motion", "clean-bold"]);
  });

  it("resolves relative sizes from viewport height", () => {
    const v = resolveCaptionVisual(builtInCaptionStyles[0]!.preset, 1920);
    expect(v.heroSizePx).toBeGreaterThan(v.baseSizePx);
    expect(v.baseSizePx).toBeGreaterThan(50);
  });

  it("only merges approved imported presets", () => {
    const base = builtInCaptionStyles[0]!.preset;
    const items = mergeCaptionStyleRegistry([{...base, id: "custom-a", name: "A", status: "candidate"}, {...base, id: "custom-b", name: "B", status: "approved"}]);
    expect(items.some((x) => x.id === "custom-a")).toBe(false);
    expect(items.some((x) => x.id === "custom-b")).toBe(true);
  });
});
