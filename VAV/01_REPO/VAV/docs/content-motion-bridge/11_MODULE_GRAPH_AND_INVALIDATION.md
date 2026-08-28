# Module Graph / Dependency Invalidation

Conceptual dependencies:

SOURCE_MEDIA
├── TRANSCRIPT
│   ├── CORRECTION
│   ├── SEGMENTATION
│   └── CONTENT_ALIGNMENT
├── SCENE_MAP
└── FRAME_ANALYSIS

EDIT_MAP
└── TIMELINE_PROJECTION

CONTENT_INTENT
└── CAPTION_BEHAVIOR_HINTS

VISUAL_MOTIONS
└── MOTION_CONTEXT

TRANSCRIPT + EDIT_MAP + SCENE_MAP + CONTENT_INTENT + MOTION_CONTEXT
└── CAPTION_PLAN

If only a Motion changes:
DO NOT rerun transcription.
Invalidate only:
motion-context-resolve
placement
visual-segments
caption-plan
preview/render cache for affected intervals.

If only a caption style changes:
DO NOT rerun scenes or transcript.

Every stage has dependency hashes.
