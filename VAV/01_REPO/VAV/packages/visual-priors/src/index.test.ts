import {describe, expect, it} from "vitest";
import {visualResolutionOrder} from "./index.ts";

describe("visual priors", () => {
  it("keeps the frozen deterministic resolution order", () => {
    expect(visualResolutionOrder).toEqual(["preferred-placement", "preferred-size", "collision-check", "resize", "alternate-placement", "alternate-structure", "safe-fallback"]);
  });
});
