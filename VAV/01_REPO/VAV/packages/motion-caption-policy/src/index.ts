import type {
  CaptionResponsePolicy,
  VisualMotionFamily
} from "@vav/visual-motion-domain";

const visibleAdaptive: CaptionResponsePolicy = {
  standardCaptionVisibility: "visible",
  sceneSmartMode: "required",
  allowedRegions: ["auto"],
  forbiddenRegions: [],
  duplicationPolicy: "allow-standard-caption"
};

export const defaultPolicyForMotion = (
  family: VisualMotionFamily
): CaptionResponsePolicy => {
  switch (family) {
    case "ABRAXAS_MOTION_00":
      return {
        ...visibleAdaptive,
        sceneSmartMode: "normal"
      };
    case "ABRAXAS_MOTION_02":
      return {
        standardCaptionVisibility: "adaptive",
        sceneSmartMode: "restricted",
        allowedRegions: ["auto"],
        forbiddenRegions: [],
        duplicationPolicy: "no-duplicate-spoken-text"
      };
    case "ABRAXAS_MOTION_03":
      return {
        standardCaptionVisibility: "suppress",
        sceneSmartMode: "restricted",
        allowedRegions: ["motion-defined"],
        forbiddenRegions: [],
        duplicationPolicy: "no-duplicate-spoken-text"
      };
    case "ABRAXAS_MOTION_01":
    case "ABRAXAS_MOTION_04":
    case "ABRAXAS_MOTION_05":
    case "ABRAXAS_MOTION_06":
    case "ABRAXAS_MOTION_07":
    case "GENERIC_BROLL":
      return visibleAdaptive;
    default:
      return {
        standardCaptionVisibility: "adaptive",
        sceneSmartMode: "required",
        allowedRegions: ["auto"],
        forbiddenRegions: [],
        duplicationPolicy: "allow-standard-caption"
      };
  }
};
