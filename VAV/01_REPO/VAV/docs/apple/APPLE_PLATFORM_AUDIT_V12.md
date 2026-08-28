# Apple Platform Audit for the VAV Ecosystem — V12

This audit intentionally selects Apple technologies by product value. Framework availability is not itself a reason to add a dependency.

## Direct value for VAV Captions

### Vision
Primary local computer-vision layer on macOS.

Useful capabilities:
- person / foreground segmentation
- face detection and landmarks
- OCR / burned-in source text
- saliency
- body/hand pose where useful
- tracking / registration / optical flow as later verified providers
- custom Core ML requests

VAV should normalize Vision coordinates at the provider boundary and expose a stable VAV contract.

### Core ML
Provider layer for models not natively covered by Vision, especially future monocular depth and validated segmentation/detection models. Prefer explicit model/version/provenance and Apple Silicon compute-unit selection.

### Core Image
Efficient mask compositing, image preprocessing, visual-analysis conversions and preview utilities. Useful underneath Vision/Remotion workflows rather than as a second motion engine.

### Accelerate / vImage / vDSP
CPU-optimized image/audio/numerical primitives. Useful for masks, heatmaps, signal features, waveform processing and similarity metrics when a GPU model is unnecessary.

### Metal / Metal Performance Shaders
Potential acceleration layer for heavy local analysis and custom effects. Use only for measured hotspots; do not replace Remotion with custom Metal merely because it is available.

### AVFoundation + VideoToolbox
Native media metadata/capture/composition/hardware codec opportunities. FFmpeg remains the established cross-format VAV media utility; VideoToolbox can remain an acceleration/backend option rather than duplicate every FFmpeg path.

### NaturalLanguage
Future semantic enrichment for HERO selection, language recognition, token tagging/embedding and content-role heuristics. It should improve the existing caption-hierarchy contract rather than silently rewrite transcript text.

### Speech
Potential native fallback/secondary speech service and capture-time transcription experiments. It does not replace the current verified Whisper.cpp Large V3 Turbo default without quality evidence.

## Strong value elsewhere in the VAV ecosystem

### ScreenCaptureKit
Future VAV Capture / screen-recording workflows: native screen/window/system-audio capture and cleaner metadata than importing an already flattened recording.

### ARKit
High value primarily for **capture-time** spatial metadata, not as a generic post-processing solution for arbitrary imported videos.

Future VAV Capture on supported iPhone/iPad can preserve:
- camera pose / world tracking
- anchors
- device motion
- scene depth on supported depth/LiDAR configurations

That metadata could later improve VAV Motions world-locked typography, parallax and surface placement. For ordinary imported desktop MP4 files, Vision/Core ML/depth/tracking providers are the logical route.

### CoreMotion
Capture-time device motion / orientation metadata can support camera-aware graphics if VAV later owns capture.

### Create ML
Useful for creating domain-specific classifiers if VAV accumulates a sufficiently curated labeled dataset (for example shot/layout classifications). Not required for current captions rendering.

## Lower-priority / use only with a concrete product requirement

- App Intents: automation/Shortcuts commands for future packaged VAV.app.
- Quick Look / AppKit integrations: project preview/Finder UX after packaging.
- CloudKit: not needed for local-first foundation.
- StoreKit / commerce APIs: product/business concerns, not media intelligence.
- MapKit, HealthKit, HomeKit, etc.: no current VAV media-production justification.

## Architecture rule

Apple frameworks are provider implementations behind VAV contracts. VAV project data, CaptionPlan, MotionPlan and SpatialSceneAnalysis remain framework-neutral so another provider can be substituted without redesigning the editor.
