import type {CaptionStylePreset, MotionPreset} from "@vav/abraxas-import";

export type RenderCaption = Readonly<{
  id: string;
  startUs: number;
  endUs: number;
  text: string;
  timingQuality: "word" | "segment" | "estimated";
  approved?: boolean;
}>;

export type RenderDesignState = Readonly<{
  styleId: string;
  structureId: string;
  motionId: string;
  placement: "auto" | "top-center" | "center" | "center-low" | "bottom";
  safeZones: boolean;
}>;

export type RenderSceneMark = Readonly<{
  id: string;
  startUs: number;
  endUs: number;
  suggestedPlacement: "top-center" | "center" | "center-low" | "bottom";
}>;

export type RenderContentCandidate = Readonly<{
  id: string;
  startUs: number;
  endUs: number;
  role: "hook" | "development" | "proof" | "close" | "cta" | "other";
  label: string;
  motionHint: string | null;
}>;

export type RenderMotionContext = Readonly<{
  id: string;
  startUs: number;
  endUs: number;
  family: string;
  visualMode: string;
  textOwnership: "caption-engine" | "visual-motion" | "hybrid";
  captionVisibility: "visible" | "adaptive" | "suppress";
  sceneSmartMode: "normal" | "required" | "restricted" | "off";
}>;

export type CaptionPlanV1 = Readonly<{
  schemaVersion: 1;
  renderVersion: "v12-remotion-parity-1";
  seed: string;
  width: number;
  height: number;
  fps: number;
  sourceFpsRational: string | null;
  durationUs: number;
  captions: readonly RenderCaption[];
  design: RenderDesignState;
  scenes: readonly RenderSceneMark[];
  contentCandidates: readonly RenderContentCandidate[];
  motionContexts: readonly RenderMotionContext[];
  approvedStylePresets: readonly CaptionStylePreset[];
  approvedMotionPresets: readonly MotionPreset[];
  previewStylePreset: CaptionStylePreset | null;
  previewMotionPreset: MotionPreset | null;
}>;

export type VavCaptionCompositionProps = Readonly<{
  plan: CaptionPlanV1;
  /** Used by the editor preview (Tauri asset URL). */
  videoUrl?: string | null;
  /** Used by the renderer bundle; resolved through Remotion staticFile(). */
  sourceMediaName?: string | null;
  /** Editor-only overlay. Never burn safe-zone guides into final exports. */
  showGuides?: boolean;
}>;
