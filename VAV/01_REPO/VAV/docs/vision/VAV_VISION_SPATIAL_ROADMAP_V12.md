# VAV Vision + Spatial Foundation V12

## Shared ecosystem service

Vision is intentionally a shared VAV capability rather than caption-specific code.

```text
VAV Vision Engine
  -> VAV Captions
  -> VAV Motions
  -> future VAV Cuts / Reframe / Media Intelligence
```

## Implemented foundation in this corrida

`@vav/vision-contracts`:
- normalized VAV coordinates (top-left origin)
- subjects/faces/source-text/saliency contracts
- layer graph
- placement candidates
- provider capability reporting

`@vav/spatial-scene`:
- negative-space / contrast / continuity / style-prior scoring
- face / eyes / mouth / source-text / high-motion penalties
- depth policy contract
- depth modes including `behind-subject` and `sandwich`

`native/vav-vision-macos` still-image foundation:
- person segmentation matte
- face detection
- eye / lip landmarks
- OCR source-text regions
- attention saliency
- objectness saliency
- conversion from Apple Vision bottom-left normalized coordinates to VAV top-left normalized coordinates

## Explicitly not yet claimed implemented

- long-video person-instance mask propagation
- general foreground-object mask propagation
- optical-flow stabilization in the production pipeline
- object / rectangle tracking in VAV
- homography surface tracking in VAV
- 2D/3D pose-driven caption placement in production
- monocular depth provider in production
- camera solve / full 3D reconstruction
- SAM2/Cutie integration into CaptionPlan

SAM2 and Cutie are optional providers prepared by the resumable installer. Their presence does not mark the feature production-ready.

## First target depth composition

```text
L0 source/background video
L1 background typography
L4 segmented subject
L6 foreground caption/accent
```

This enables a future `TEXT_BEHIND_SUBJECT` / `TEXT_SANDWICH` renderer while preserving a safe foreground-overlay fallback if segmentation confidence is insufficient.

## Why not require full 3D

A high-quality subject matte is sufficient for convincing text-behind-subject compositions. Relative depth, masks, camera motion and tracking can then progressively improve parallax, occlusion and environmental typography without blocking the first useful feature.
