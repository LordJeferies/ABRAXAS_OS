import type {MotionPreset, SimpleMotionFamilyDef, SimpleMotionFamilyId} from "./types.ts";

export const SIMPLE_MOTION_FAMILIES: readonly SimpleMotionFamilyDef[] = [
  {familyId: "MOT_ZOOM_IN", name: "Slow Zoom In", category: "CAMERA", description: "Gradual camera push inwards"},
  {familyId: "MOT_ZOOM_OUT", name: "Slow Zoom Out", category: "CAMERA", description: "Gradual camera pull outwards"},
  {familyId: "MOT_PUSH_IN", name: "Dynamic Push In", category: "CAMERA", description: "Snappy punch-in on narrative beats"},
  {familyId: "MOT_PULL_OUT", name: "Dynamic Pull Out", category: "CAMERA", description: "Snappy pull back from framing"},
  {familyId: "MOT_PAN_LEFT", name: "Horizontal Pan Left", category: "CAMERA", description: "Smooth horizontal tracking left"},
  {familyId: "MOT_PAN_RIGHT", name: "Horizontal Pan Right", category: "CAMERA", description: "Smooth horizontal tracking right"},
  {familyId: "MOT_SCALE", name: "Direct 2D Scale", category: "TRANSFORM", description: "Arbitrary 2D scale transform"},
  {familyId: "MOT_TRANSLATE", name: "2D Translation", category: "TRANSFORM", description: "XY layer offset"},
  {familyId: "MOT_FADE_IN", name: "Fade In Opacity", category: "OPACITY", description: "Cross-fade to full opacity"},
  {familyId: "MOT_FADE_OUT", name: "Fade Out Opacity", category: "OPACITY", description: "Cross-fade to zero opacity"},
  {familyId: "MOT_REVEAL_WIPE", name: "Directional Reveal Wipe", category: "TRANSITION", description: "Linear clip-path reveal wipe"},
  {familyId: "MOT_BASIC_PARALLAX", name: "2.5D Layer Parallax", category: "SPATIAL", description: "Differential foreground/background layer translation"},
  {familyId: "MOT_BASIC_TRANSITION", name: "Segment Cut Transition", category: "TRANSITION", description: "Micro-motion bridge linking consecutive segments"}
];

const defaultCaptionPolicy = {
  standardCaptionVisibility: "visible" as const,
  sceneSmartMode: "normal" as const,
  allowedRegions: ["auto"],
  forbiddenRegions: [],
  duplicationPolicy: "allow-standard-caption" as const
};

export const STANDARD_MOTION_PRESETS: readonly MotionPreset[] = [
  {
    presetId: "PRESET_SLOW_ZOOM_IN_V1",
    version: 1,
    name: "Slow Zoom In (Baseline)",
    motionFamilyId: "MOT_ZOOM_IN",
    parameters: {startScale: 1.0, endScale: 1.15, originX: 0.5, originY: 0.5},
    durationPolicy: {defaultDurationUs: 3_000_000, minDurationUs: 500_000, maxDurationUs: 10_000_000},
    easing: "ease-out",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_SLOW_ZOOM_OUT_V1",
    version: 1,
    name: "Slow Zoom Out (Baseline)",
    motionFamilyId: "MOT_ZOOM_OUT",
    parameters: {startScale: 1.15, endScale: 1.0, originX: 0.5, originY: 0.5},
    durationPolicy: {defaultDurationUs: 3_000_000, minDurationUs: 500_000, maxDurationUs: 10_000_000},
    easing: "ease-out",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_PUSH_IN_DYNAMIC_V1",
    version: 1,
    name: "Dynamic Push In (Baseline)",
    motionFamilyId: "MOT_PUSH_IN",
    parameters: {startScale: 1.0, endScale: 1.15, originX: 0.5, originY: 0.45},
    durationPolicy: {defaultDurationUs: 1_500_000, minDurationUs: 400_000, maxDurationUs: 4_000_000},
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_MOKA_DYNAMIC_PUSH_LEGACY",
    version: 1,
    name: "Moka Dynamic Push Punch (Legacy 1.25x)",
    motionFamilyId: "MOT_PUSH_IN",
    parameters: {startScale: 1.0, endScale: 1.25, originX: 0.5, originY: 0.45},
    durationPolicy: {defaultDurationUs: 1_500_000, minDurationUs: 400_000, maxDurationUs: 4_000_000},
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    scope: "LEGACY_PRESET",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_PULL_OUT_SNAPPY_V1",
    version: 1,
    name: "Snappy Pull Out (Baseline)",
    motionFamilyId: "MOT_PULL_OUT",
    parameters: {startScale: 1.25, endScale: 1.0, originX: 0.5, originY: 0.45},
    durationPolicy: {defaultDurationUs: 1_500_000, minDurationUs: 400_000, maxDurationUs: 4_000_000},
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_HORIZONTAL_PAN_LEFT_V1",
    version: 1,
    name: "Subtle Pan Left (Baseline)",
    motionFamilyId: "MOT_PAN_LEFT",
    parameters: {translateXPercent: -8.0},
    durationPolicy: {defaultDurationUs: 2_000_000, minDurationUs: 500_000, maxDurationUs: 6_000_000},
    easing: "linear",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_HORIZONTAL_PAN_RIGHT_V1",
    version: 1,
    name: "Subtle Pan Right (Baseline)",
    motionFamilyId: "MOT_PAN_RIGHT",
    parameters: {translateXPercent: 8.0},
    durationPolicy: {defaultDurationUs: 2_000_000, minDurationUs: 500_000, maxDurationUs: 6_000_000},
    easing: "linear",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_DIRECT_SCALE_V1",
    version: 1,
    name: "Direct Scale 1.1x (Reference)",
    motionFamilyId: "MOT_SCALE",
    parameters: {scale: 1.1},
    durationPolicy: {defaultDurationUs: 1_000_000, minDurationUs: 100_000, maxDurationUs: 10_000_000},
    easing: "linear",
    scope: "REFERENCE_PRESET",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_TRANSLATE_XY_V1",
    version: 1,
    name: "Translate Offset (Reference)",
    motionFamilyId: "MOT_TRANSLATE",
    parameters: {deltaX: 0, deltaY: 0},
    durationPolicy: {defaultDurationUs: 1_000_000, minDurationUs: 100_000, maxDurationUs: 10_000_000},
    easing: "linear",
    scope: "REFERENCE_PRESET",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_SMOOTH_FADE_IN_V1",
    version: 1,
    name: "Smooth Opacity Fade In (Baseline)",
    motionFamilyId: "MOT_FADE_IN",
    parameters: {fadeDurationUs: 300_000},
    durationPolicy: {defaultDurationUs: 300_000, minDurationUs: 100_000, maxDurationUs: 1_000_000},
    easing: "ease-in-out",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_SMOOTH_FADE_OUT_V1",
    version: 1,
    name: "Smooth Opacity Fade Out (Baseline)",
    motionFamilyId: "MOT_FADE_OUT",
    parameters: {fadeDurationUs: 300_000},
    durationPolicy: {defaultDurationUs: 300_000, minDurationUs: 100_000, maxDurationUs: 1_000_000},
    easing: "ease-in-out",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_REVEAL_WIPE_LEFT_TO_RIGHT_V1",
    version: 1,
    name: "Horizontal Wipe Reveal (Baseline)",
    motionFamilyId: "MOT_REVEAL_WIPE",
    parameters: {direction: "LEFT_TO_RIGHT", durationUs: 400_000},
    durationPolicy: {defaultDurationUs: 400_000, minDurationUs: 150_000, maxDurationUs: 1_000_000},
    easing: "linear",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_BASIC_2_5D_PARALLAX_V1",
    version: 1,
    name: "Layered 2.5D Parallax (Baseline)",
    motionFamilyId: "MOT_BASIC_PARALLAX",
    parameters: {foregroundMultiplier: 1.3, backgroundMultiplier: 0.8},
    durationPolicy: {defaultDurationUs: 2_000_000, minDurationUs: 500_000, maxDurationUs: 5_000_000},
    easing: "linear",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  },
  {
    presetId: "PRESET_WHIP_DIP_TRANSITION_V1",
    version: 1,
    name: "Whip Dip Transition (Baseline)",
    motionFamilyId: "MOT_BASIC_TRANSITION",
    parameters: {transitionDurationUs: 200_000, mode: "WHIP_DIP"},
    durationPolicy: {defaultDurationUs: 200_000, minDurationUs: 50_000, maxDurationUs: 500_000},
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    scope: "INTERNAL_BASELINE",
    provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
    captionPolicy: defaultCaptionPolicy
  }
];

export const getMotionFamilyDef = (id: SimpleMotionFamilyId): SimpleMotionFamilyDef | undefined =>
  SIMPLE_MOTION_FAMILIES.find((f) => f.familyId === id);

export const getMotionPreset = (id: string): MotionPreset | undefined =>
  STANDARD_MOTION_PRESETS.find((p) => p.presetId === id);
