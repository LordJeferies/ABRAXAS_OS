import {describe, expect, it} from "vitest";
import {visionPointFromAppleBottomLeft, visionRectFromAppleBottomLeft} from "./index.ts";

describe("vision contracts", () => {
  it("converts Apple bottom-left normalized points into VAV top-left space", () => {
    expect(visionPointFromAppleBottomLeft({x: .25, y: .2})).toEqual({x: .25, y: .8});
  });

  it("converts Apple normalized rectangles without changing size", () => {
    expect(visionRectFromAppleBottomLeft({x: .1, y: .2, width: .3, height: .4}))
      .toEqual({x: .1, y: .4, width: .3, height: .4});
  });
});
