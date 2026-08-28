# Motion Context Contract

Every instantiated visual motion needs a machine-readable contract.

Conceptual schema:

```json
{
  "motionInstanceId": "VMOT-0032",
  "contentId": "CLIENT-PIECE-001",
  "motionFamily": "ABRAXAS_MOTION_03",
  "sourceSpan": {"startUs": 12000000, "endUs": 18500000},
  "timelineSpan": {"startUs": 4200000, "endUs": 10700000},
  "narrativePurpose": "hook",
  "visualMode": "typography-fullframe",
  "textOwnership": "visual-motion",
  "captionPolicy": {
    "standardCaptionVisibility": "suppress",
    "sceneSmartMode": "restricted",
    "allowedRegions": ["center"],
    "forbiddenRegions": [],
    "duplicationPolicy": "no-duplicate-spoken-text",
    "styleCompatibility": ["motion-owned-typography"]
  },
  "occupancy": {
    "criticalRegions": ["center"],
    "reservedRegions": ["center"]
  },
  "locks": ["exact-text", "motion-family"],
  "provenance": ["USER"],
  "version": 1
}
```

Important:
`allowedRegions: ["center"]` belongs to the actual ficha/motion instance if
that particular Motion 3 requires center-only. Do not hardcode every possible
Motion 3 forever to one coordinate if future Motion 3 variants differ.
