import {describe, expect, it} from "vitest";
import {defaultPolicyForMotion} from "./index.ts";

describe("motion caption policy", () => {
  it("suppresses standard caption during Motion 03 takeover", () => {
    expect(defaultPolicyForMotion("ABRAXAS_MOTION_03").standardCaptionVisibility)
      .toBe("suppress");
  });

  it("keeps B-roll captions adaptive", () => {
    expect(defaultPolicyForMotion("GENERIC_BROLL").sceneSmartMode)
      .toBe("required");
  });
});
