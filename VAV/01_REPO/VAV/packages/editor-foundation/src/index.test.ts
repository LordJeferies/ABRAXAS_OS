import {describe, expect, it} from "vitest";
import {
  chooseSnap,
  commitHistory,
  createHistory,
  redoHistory,
  semanticZoomForPixelsPerSecond,
  undoHistory
} from "./index.ts";

describe("editor foundation", () => {
  it("supports reversible history", () => {
    const h0 = createHistory("A");
    const h1 = commitHistory(h0, "B");
    expect(undoHistory(h1).present).toBe("A");
    expect(redoHistory(undoHistory(h1)).present).toBe("B");
  });

  it("chooses the nearest snap within threshold", () => {
    expect(chooseSnap([
      {target: "scene-cut", distancePx: 6, position: 100},
      {target: "playhead", distancePx: 3, position: 95}
    ])?.target).toBe("playhead");
  });

  it("uses semantic timeline zoom", () => {
    expect(semanticZoomForPixelsPerSecond(40)).toBe("blocks");
    expect(semanticZoomForPixelsPerSecond(300)).toBe("word-boundaries");
  });
});
