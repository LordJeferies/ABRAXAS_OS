import type {ProvenanceType} from "@vav/ficha-domain";

export type VisualMotionFamily =
  | "ABRAXAS_MOTION_00"
  | "ABRAXAS_MOTION_01"
  | "ABRAXAS_MOTION_02"
  | "ABRAXAS_MOTION_03"
  | "ABRAXAS_MOTION_04"
  | "ABRAXAS_MOTION_05"
  | "ABRAXAS_MOTION_06"
  | "ABRAXAS_MOTION_07"
  | "GENERIC_BROLL"
  | "CUSTOM";

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
  provenance: readonly ProvenanceType[];
  version: number;
}>;
