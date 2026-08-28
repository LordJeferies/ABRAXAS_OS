# vav-vision-macos

Native macOS sidecar for the shared VAV Vision Engine.

Current implemented still-image foundation:
- person segmentation mask
- face + eye/lip landmarks
- OCR/source-text regions
- attention saliency
- objectness saliency
- conversion from Apple bottom-left coordinates to VAV top-left normalized coordinates

This is **not** yet the full video/depth/tracking engine. Person-instance masks, foreground-instance masks,
optical flow, tracking, homography and depth remain roadmap items until individually implemented and verified.

Build on macOS:

```bash
xcrun swiftc -O \
  -framework Vision -framework AppKit -framework CoreImage \
  Sources/main.swift -o vav-vision-macos
```
