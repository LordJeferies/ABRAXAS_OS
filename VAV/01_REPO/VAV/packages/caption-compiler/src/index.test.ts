import {describe, expect, it} from "vitest";
import {ownershipAtTime} from "./index.ts";

describe("caption compiler ownership", () => {
  it("lets visual motion own Motion 3 typography", () => {
    expect(ownershipAtTime(5_000_000, [{
      motionInstanceId: "VM1",
      contentId: null,
      motionFamily: "ABRAXAS_MOTION_03",
      sourceStartUs: 0,
      sourceEndUs: 10_000_000,
      timelineStartUs: 0,
      timelineEndUs: 10_000_000,
      narrativePurpose: "hook",
      visualMode: "typography-fullframe",
      textOwnership: "visual-motion",
      captionPolicy: {
        standardCaptionVisibility: "suppress",
        sceneSmartMode: "restricted",
        allowedRegions: ["center"],
        forbiddenRegions: [],
        duplicationPolicy: "no-duplicate-spoken-text"
      },
      criticalRegions: ["center"],
      reservedRegions: ["center"],
      provenance: ["USER"],
      version: 1
    }])).toBe("visual-motion");
  });
});
