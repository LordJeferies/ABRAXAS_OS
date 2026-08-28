export type CaptionBlock = Readonly<{
  id: string;
  startUs: number;
  endUs: number;
  text: string;
  timingQuality: "word" | "segment" | "estimated";
  approved?: boolean;
}>;

export type MediaProbe = Readonly<{
  path: string;
  name: string;
  sizeBytes: number;
  durationUs: number;
  width: number;
  height: number;
  fps: number | null;
  fpsRational: string | null;
  rotation: number;
  videoCodec: string | null;
  audioCodec: string | null;
  audioTracks: number;
}>;

export type SceneMark = Readonly<{
  id: string;
  startUs: number;
  endUs: number;
  suggestedPlacement: "top-center" | "center" | "center-low" | "bottom";
}>;

export type ContentCandidate = Readonly<{
  id: string;
  startUs: number;
  endUs: number;
  role: "hook" | "development" | "proof" | "close" | "cta" | "other";
  label: string;
  motionHint: string | null;
}>;

export type MotionContext = Readonly<{
  id: string;
  startUs: number;
  endUs: number;
  family: string;
  visualMode: string;
  textOwnership: "caption-engine" | "visual-motion" | "hybrid";
  captionVisibility: "visible" | "adaptive" | "suppress";
  sceneSmartMode: "normal" | "required" | "restricted" | "off";
}>;

export type DesignState = Readonly<{
  styleId: string;
  structureId: string;
  motionId: string;
  placement: "auto" | "top-center" | "center" | "center-low" | "bottom";
  safeZones: boolean;
}>;

export type SavedProject = Readonly<{
  version: 1;
  media: MediaProbe | null;
  captions: readonly CaptionBlock[];
  design: DesignState;
  scenes: readonly SceneMark[];
  contentCandidates: readonly ContentCandidate[];
  motionContexts: readonly MotionContext[];
  reviewComplete: boolean;
  designComplete: boolean;
  abraxasImports?: readonly unknown[];
}>;
