# ABRAXAS OS — AV Production Contract V1

**Task ID**: `ABX-VAV-CUTS-MOTIONS-ASBUILT-F2AV-001`  
**Gate**: `F2 AV Production Contract Freeze`  
**Status**: `FROZEN_FOR_RUN3_RUN4`

---

## 1. Architectural Purpose & Ownership Boundaries

This contract establishes the formal subsystem boundaries, data contracts, and event lifecycle governing audiovisual production across ABRAXAS OS and VAV.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                LIENZO                                    │
│   (Persistent Content Identity, Multi-Layer State, Source of Truth)      │
└────────────┬─────────────────────────────┬───────────────────────────────┘
             │ Intent & Strategy           │ Source Observation & Proof
             ▼                             ▼
┌─────────────────────────┐   ┌────────────────────────────────────────────┐
│          YOD            │   │                   SHIM                     │
│ (Content Intelligence,  │   │  (Source Observation, Timestamp Analysis,  │
│ Editorial Progression,  │   │   Speaker Attribution, Candidate Discovery)│
│ Production Intent)      │   └─────────────────────┬──────────────────────┘
└────────────┬────────────┘                         │
             │ Motion Intent                        │ Cut Candidates & Evidence
             │ (Visual Modes, Beats)                ▼
             │                ┌────────────────────────────────────────────┐
             │                │                 VAV CUTS                   │
             │                │  (Editorial Timeline Cutting, Microtrims,  │
             │                │   Zero-Drift Sync, CutPlan Execution)      │
             │                └─────────────────────┬──────────────────────┘
             │                                      │ Produces Non-Destructive
             │                                      ▼
             │                ┌────────────────────────────────────────────┐
             │                │                 EDIT LOCK                  │
             │                │  (Immutable Temporal Geometry Anchor,      │
             │                │   Source ↔ Edited Time Mapping V1)         │
             │                └──────┬──────────────────────┬──────────────┘
             │                       │                      │
             │ Anchored On Lock      │ Anchored On Lock     │
             ▼                       ▼                      ▼
┌─────────────────────────┐   ┌──────────────┐   ┌─────────────────────────┐
│       VAV MOTIONS       │   │ VAV CAPTIONS │   │      EXPORT / QA        │
│  (Camera Moves, Pushes, │   │  (Remotion   │   │  (FFmpeg Hardware Enc,  │
│   Zooms, Visual Assets, │   │  Subtitles,  │   │   Storage Preflight,    │
│   MotionPlan Execution) │   │  Safe Zones) │   │   Deterministic Parity) │
└─────────────────────────┘   └──────────────┘   └─────────────────────────┘
```

### Subsystem Responsibilities

1. **Lienzo**: Owns persistent content identity, multi-stage revision history, and component states (`DRAFT`, `LOCKED`, `OUT_OF_SYNC`, `READY`). Lienzo is the global Source of Truth for the content object; VAV never replaces Lienzo.
2. **YOD**: Owns editorial intelligence, narrative structures (`STRUCTURE_REGISTRY_V1`), formats (`FORMAT_REGISTRY_V1`), and production intent (structural beats, visual mode hints). YOD does NOT render video or animate layers.
3. **Shim**: Observes and resolves real source media (transcripts, timestamps, speaker segmentation, candidate ranges, evidence gaps). Shim proposes cut candidates; Shim does NOT own final edit execution.
4. **VAV Cuts**: Owns timeline cutting, microtrim calculations, handle safety, silence/breath management, DaVinci timeline bridging, and execution of the non-destructive `CutPlan`.
5. **VAV Motions**: Owns motion execution, camera framing (zoom, push, pull, pan), layer transforms, visual assets, caption collision avoidance, and execution of the `MotionPlan`.
6. **VAV Captions**: Owns kinetic subtitle rendering, typographic hierarchy, word-level highlight animation, and Remotion composition.
7. **Pipeline Engine**: Orchestrates modular execution, job queuing, and dependency invalidation.
8. **AI Runtime**: Executes discrete provider/model jobs (Whisper MLX, Qwen, DeepSeek, Claude, Apple Foundation Models) under strict deterministic output schemas.
9. **Events & Artifacts**: Provide the tamper-evident, versioned communication backbone across all subsystems.

---

## 2. Core AV Invariants

1. **Non-Destructive Cutting**: Source media files are never overwritten, trimmed in-place, or destructively modified.
2. **Deterministic Timebase**: All timeline math operates on integer microseconds (`us`) paired with explicit rational framerates (e.g. `30000/1001`, `24000/1001`, `25/1`, `30/1`, `60/1`), guaranteed by `@vav/timebase`.
3. **Edit Lock Anchor**: Once an edit is approved, an immutable `EDIT_LOCK` is minted. Downstream Motions, Captions, and Render jobs MUST reference this exact lock version.
4. **Downstream Invalidation**: Any mutation to a `CutPlan` invalidates downstream `MotionPlan`, `CaptionPlan`, and `Render` artifacts, transitioning their Lienzo state to `OUT_OF_SYNC`.
5. **Separation of Motion Intent from Animation Geometry**: YOD specifies *what* to emphasize (e.g. `visual_mode: "BENCH_ARTIFACT"`); VAV Motions calculates *how* to animate it (e.g. coordinates, easing curves, camera matrices).
