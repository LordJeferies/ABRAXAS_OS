export type NormalizedPoint = Readonly<{x: number; y: number}>;
export type NormalizedRect = Readonly<{x: number; y: number; width: number; height: number}>;
export type TimeRangeUs = Readonly<{startUs: number; endUs: number}>;

export type VisionCapabilityId =
  | "person-segmentation"
  | "person-instance-mask"
  | "foreground-instance-mask"
  | "face-detection"
  | "face-landmarks"
  | "body-pose-2d"
  | "body-pose-3d"
  | "hand-pose"
  | "ocr"
  | "saliency-attention"
  | "saliency-objectness"
  | "optical-flow"
  | "object-tracking"
  | "rectangle-tracking"
  | "homography"
  | "image-feature-print"
  | "image-aesthetics"
  | "coreml-custom"
  | "depth"
  | "object-segmentation-advanced"
  | "mask-tracking-advanced";

export type ProviderAvailability = "available" | "installed-unverified" | "missing" | "unsupported" | "planned";

export type VisionCapability = Readonly<{
  id: VisionCapabilityId;
  provider: string;
  availability: ProviderAvailability;
  confidence: number | null;
  notes: string;
}>;

export type VisionProviderReport = Readonly<{
  generatedAt: string;
  platform: string;
  arch: string;
  providersRoot: string | null;
  capabilities: readonly VisionCapability[];
}>;

export type FaceRegion = Readonly<{
  id: string;
  bbox: NormalizedRect;
  confidence: number;
  eyes: readonly NormalizedPoint[];
  mouth: readonly NormalizedPoint[];
}>;

export type SubjectRegion = Readonly<{
  id: string;
  bbox: NormalizedRect;
  confidence: number;
  maskRef: string | null;
}>;

export type SourceTextRegion = Readonly<{
  id: string;
  bbox: NormalizedRect;
  text: string;
  confidence: number;
}>;

export type NegativeSpaceRegion = Readonly<{
  id: string;
  bbox: NormalizedRect;
  score: number;
  saliencyScore: number;
  motionScore: number;
  detailScore: number;
}>;

export type DepthBand = "far-background" | "background" | "midground" | "subject" | "foreground";

export type LayerRole =
  | "background-environment"
  | "background-typography"
  | "midground-environment"
  | "subject"
  | "foreground-detail"
  | "foreground-typography"
  | "graphics"
  | "ui-overlay";

export type LayerNode = Readonly<{
  id: string;
  role: LayerRole;
  zOrder: number;
  depthBand: DepthBand | null;
  sourceRef: string | null;
}>;

export type LayerGraph = Readonly<{
  nodes: readonly LayerNode[];
  subjectMaskRefs: readonly string[];
  objectMaskRefs: readonly string[];
}>;

export type PlacementCandidate = Readonly<{
  id: string;
  zone: string;
  bbox: NormalizedRect;
  score: number;
  reasons: readonly string[];
  penalties: readonly string[];
}>;

export type VisualSceneAnalysis = Readonly<{
  schemaVersion: 1;
  sceneId: string;
  timeRange: TimeRangeUs;
  subjects: readonly SubjectRegion[];
  faces: readonly FaceRegion[];
  sourceText: readonly SourceTextRegion[];
  negativeSpace: readonly NegativeSpaceRegion[];
  depthMapRef: string | null;
  opticalFlowRef: string | null;
  cameraMotion: string | null;
  layerGraph: LayerGraph;
  placementCandidates: readonly PlacementCandidate[];
  confidence: number;
}>;

export const visionUsesTopLeftCoordinates = true as const;

export const visionPointFromAppleBottomLeft = (point: NormalizedPoint): NormalizedPoint => ({
  x: point.x,
  y: 1 - point.y
});

export const visionRectFromAppleBottomLeft = (rect: NormalizedRect): NormalizedRect => ({
  x: rect.x,
  y: 1 - rect.y - rect.height,
  width: rect.width,
  height: rect.height
});
