# SCROLL-SYNCHRONIZED VIDEO BACKGROUND PATTERN SPECIFICATION V1
*Architectural Design & Engineering Pattern for Scroll-Driven Video scrub and playback*

**Classification**: `DESIGN_READY_PATTERN_SPECIFICATION`  
**Pattern Status**: `DESIGN_READY // NOT_IMPLEMENTED_UNLESS_A_REAL_APPROVED_ASSET_EXISTS`  
**Owning Domain**: `YOD // Visual Intelligence & VAV Production Engineering`

---

## 1. Executive Summary

This specification establishes the canonical ABRAXAS architecture for **Scroll-Synchronized Video Backgrounds**, inspired by Apple product launch storytelling (e.g. MacBook Pro, Mac Studio).

> **Status Notice**: This pattern is **DESIGN-READY**. It must NOT be faked or implemented with mock/placeholder video assets until a real, approved, high-bitrate video master is authored and committed to the repository.

---

## 2. Four Implementation Strategies

```
┌─────────────────────────────────────────────────────────────────────────┐
│              SCROLL-SYNCHRONIZED VIDEO IMPLEMENTATION STRATEGIES        │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       ▼                             ▼                             ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ Strategy A:          │  │ Strategy B:          │  │ Strategy C:          │
│ HTML5 Video          │  │ Frame-Sequence       │  │ Hybrid Video +       │
│ currentTime Scrub    │  │ Canvas Drawing       │  │ DOM Masking/Parallax │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │ Strategy D:          │
                          │ Pre-Rendered         │
                          │ Remotion/FFmpeg Scrub│
                          └──────────────────────┘
```

### Strategy A: HTML5 Video `currentTime` Direct Scrub
* **Mechanism**: GSAP `ScrollTrigger` normalizes page scroll progress $p \in [0, 1]$ and maps it directly to video playback time:
  $$\text{video.currentTime} = p \times \text{video.duration}$$
* **When to Use**: Long continuous clips (> 10s) with low-to-medium frame precision requirements where memory is constrained.
* **Caveat**: On non-keyframe seeks, browser decoders can cause noticeable frame stutter (seek lag). Requires encoding with dense intra-frames (GOP size = 1 or all I-frames).

### Strategy B: Frame-Sequence HTML5 Canvas Scrub
* **Mechanism**: Video is pre-extracted into individual JPEG/WebP frames (e.g. 120–240 frames). As the user scrolls, `ScrollTrigger` calculates the active frame index and renders the preloaded image directly onto a `<canvas>` context using `ctx.drawImage()`.
* **When to Use**: Short, precision product rotations (< 8s, 120–180 frames) where 100% deterministic frame scrubbing and zero seek jitter are non-negotiable.
* **Caveat**: Higher initial image asset payload; requires progressive preloading with poster frame fallback.

### Strategy C: Hybrid Video + DOM Masking & Parallax
* **Mechanism**: Video plays in a constrained loop or time scrub behind CSS clip-path masks and floating SVG typography, driven by multi-layered GSAP ScrollTrigger timelines.
* **When to Use**: Editorial chapters where video serves as an atmospheric texture behind architectural typography.

### Strategy D: Pre-Rendered Remotion / FFmpeg Programmatic Asset
* **Mechanism**: High-fidelity Remotion visual motion compositions are exported via local FFmpeg at 60fps with optimized WebM/H.265 profiles, loaded as deterministic frame-scrubbed media in the web layer.
* **When to Use**: Showcasing internal VAV motion engine capabilities directly in public product storytelling.

---

## 3. Engineering Decision Matrix

| Dimension | Strategy A (HTML5 currentTime) | Strategy B (Canvas Sequence) | Strategy C (Hybrid DOM Mask) | Strategy D (Remotion Master) |
| :--- | :--- | :--- | :--- | :--- |
| **Frame Scrub Precision** | Variable (Hardware dependent) | **100% Deterministic** | Moderate | **100% Frame-Accurate** |
| **Memory Footprint** | **Low (Single video buffer)** | Medium-High (Frame array) | Low | Medium |
| **Initial Preload Bandwidth**| **Low (Progressive byte-range)**| High (Must buffer frames) | Low | Low-Medium |
| **Mobile Reliability** | Moderate (OS power throttle) | **Very High** | High | High |
| **Seek Jitter Risk** | High (without intra-frame GOP)| **Zero (Pre-decoded images)**| Moderate | Zero |
| **Best Use Case** | Continuous panoramic flight | 360° Hardware rotation | Editorial atmosphere | Motion engine demonstration |

---

## 4. Universal Constraints & Fallback Rules

1. **Accessibility & Reduced Motion**: When `prefers-reduced-motion: reduce` is detected:
   - Video scrubbing is completely disabled.
   - An optimized static poster frame (`poster.webp`) is rendered immediately.
   - Zero layout shift; 100% of editorial typography and interactive content remains accessible.
2. **Strict Audio Ban**: Background scroll-synced video must **never autoplay audio**. Media elements must be initialized with `muted`, `playsinline`, and `autoplay={false}`.
3. **Bandwidth & Low-Power Adaptation**: On mobile devices (`width <= 768px`) or low-power mode:
   - Default to lightweight WebP sequence or static poster.
   - Limit frame resolution to 720p / 1080p max.
4. **No External Scroll-Hijacking Libraries**: Lenis or proprietary smooth-scroll libraries must not be introduced merely because a reference uses them. Standard browser scrolling coordinates with GSAP ScrollTrigger natively.

