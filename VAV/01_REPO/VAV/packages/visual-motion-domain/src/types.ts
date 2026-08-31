export type SimpleMotionFamilyId =
  | "MOT_ZOOM_IN"
  | "MOT_ZOOM_OUT"
  | "MOT_PUSH_IN"
  | "MOT_PULL_OUT"
  | "MOT_PAN_LEFT"
  | "MOT_PAN_RIGHT"
  | "MOT_SCALE"
  | "MOT_TRANSLATE"
  | "MOT_FADE_IN"
  | "MOT_FADE_OUT"
  | "MOT_REVEAL_WIPE"
  | "MOT_BASIC_PARALLAX"
  | "MOT_BASIC_TRANSITION";

export type LegacyMotionFamilyId =
  | "ABRAXAS_MOTION_00"
  | "ABRAXAS_MOTION_01"
  | "ABRAXAS_MOTION_02"
  | "ABRAXAS_MOTION_03"
  | "ABRAXAS_MOTION_04"
  | "ABRAXAS_MOTION_05"
  | "ABRAXAS_MOTION_06"
  | "ABRAXAS_MOTION_07";

export type VisualMotionFamily = SimpleMotionFamilyId | LegacyMotionFamilyId | "CUSTOM" | "GENERIC_BROLL";

export type TextOwnership = "caption-engine" | "visual-motion" | "hybrid";
export type StandardCaptionVisibility = "visible" | "suppress" | "adaptive";
export type SceneSmartMode = "normal" | "required" | "restricted" | "off";

export type CaptionResponsePolicy = Readonly<{
  standardCaptionVisibility: StandardCaptionVisibility;
  sceneSmartMode: SceneSmartMode;
  allowedRegions: readonly string[];
  forbiddenRegions: readonly string[];
  duplicationPolicy:
    | "allow-standard-caption"
    | "no-duplicate-spoken-text"
    | "keyword-only";
}>;

export type SimpleMotionFamilyDef = Readonly<{
  familyId: SimpleMotionFamilyId;
  name: string;
  category: "CAMERA" | "TRANSFORM" | "OPACITY" | "TRANSITION" | "SPATIAL";
  description: string;
}>;

export type MotionPresetScope = "INTERNAL_BASELINE" | "REFERENCE_PRESET" | "LEGACY_PRESET" | "UNIVERSAL";

export type MotionPreset = Readonly<{
  presetId: string;
  version: number;
  name: string;
  motionFamilyId: SimpleMotionFamilyId;
  parameters: Record<string, number | string | boolean>;
  durationPolicy: {
    defaultDurationUs: number;
    minDurationUs: number;
    maxDurationUs: number;
  };
  easing: string;
  scope: MotionPresetScope;
  provenance: {
    source: string;
    version: string;
  };
  captionPolicy: CaptionResponsePolicy;
}>;

export type MotionAssignment = Readonly<{
  assignmentId: string;
  motionFamilyId: SimpleMotionFamilyId;
  presetId?: string | undefined;
  timelineRange: {
    startUs: number;
    endUs: number;
    startFrame: number;
    endFrame: number;
  };
  parameters: Record<string, number | string | boolean>;
  priority: number;
  visualOwnership: TextOwnership;
  captionPolicy: CaptionResponsePolicy;
  editorialIntentRef?: string | undefined;
  provenance: {
    createdBy: string;
    createdAt: string;
  };
}>;

export type MotionPlan = Readonly<{
  motionPlanId: string;
  version: number;
  contentId: string;
  deliverableId: string;
  editLockId: string;
  timeMappingHash: string;
  canvas: {
    width: number;
    height: number;
    fpsRational: string;
    totalDurationUs: number;
  };
  assignments: readonly MotionAssignment[];
  provenance: {
    createdBy: string;
    createdAt: string;
    status: "DRAFT" | "APPROVED" | "LOCKED" | "OUT_OF_SYNC";
  };
}>;

export type MotionTransformState = Readonly<{
  scale: number;
  translateX: number;
  translateY: number;
  opacity: number;
  cameraZ: number;
  revealProgress: number;
  revealDirection: string;
  parallaxOffset: number;
  transitionProgress: number;
  transitionMode: string;
}>;

export type MotionInvalidationResult = Readonly<{
  motionPlanId: string;
  expectedLockId: string;
  currentLockId: string;
  status: "OUT_OF_SYNC" | "CURRENT";
  reason: string;
  timestamp: string;
}>;

export type MotionContext = Readonly<{
  motionInstanceId: string;
  contentId: string | null;
  motionFamily: VisualMotionFamily;
  sourceStartUs: number;
  sourceEndUs: number;
  timelineStartUs: number | null;
  timelineEndUs: number | null;
  narrativePurpose: string | null;
  visualMode: string;
  textOwnership: TextOwnership;
  captionPolicy: CaptionResponsePolicy;
  criticalRegions: readonly string[];
  reservedRegions: readonly string[];
  provenance: readonly any[];
  version: number;
}>;
