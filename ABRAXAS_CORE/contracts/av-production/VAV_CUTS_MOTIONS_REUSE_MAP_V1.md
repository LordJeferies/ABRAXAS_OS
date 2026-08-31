# ABRAXAS OS — VAV Cuts & Motions Reuse Map V1

**Task ID**: `ABX-VAV-CUTS-MOTIONS-ASBUILT-F2AV-001`  
**Gate**: `F2 AV Production Contract Freeze`  
**Status**: `FROZEN_FOR_RUN3_RUN4`

---

## 1. Historical Algorithm Extraction Registry

| Capability / Algorithm | Historical Source Path & File | Functions / Scripts | Historical Behavior & Limits | Target Package | Reuse Classification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Multi-pass Hardware Cutting** | `Desktop/Moka_Terminal_Cortes_48_FrameMatched_FINAL/tools/30_CORTAR_Y_SUBTITULAR_48.py` | `ffmpeg_command`, `validate_output` | FFmpeg cut with strict start/end timestamps, handles, and subtitle burns. | `@vav/export-system` | **`ADAPT`** |
| **Literal Word Sync & Consonant Tail** | `Desktop/Moka_Terminal_Cortes_48_FrameMatched_FINAL/tools/27_APROBAR_3_LITERAL.py` | `load_validated_mlx_transcript` | 3-pass transcript alignment preserving 80ms consonant tails. | `@vav/transcription` | **`REUSE_DIRECT`** |
| **VideoToolbox Zero-Copy Segment Extraction** | `Downloads/JOC55_HOTFIX_FAST_V3_3_HW_DECODE_RESUME/TOOLS/joc55_vt40_fast_v3.py` | `_fingerprint`, `build_segment_command` | Apple Silicon VT hardware decode/encode with cache fingerprinting. | `@vav/export-system` | **`ADAPT`** |
| **Contiguous Segment Merging** | `Downloads/JOC55_HOTFIX_FAST_V3_3_HW_DECODE_RESUME/TOOLS/joc55_vt40_fast_core.py` | `merge_contiguous_segments` | Merges contiguous cut ranges to prevent unnecessary re-encoding. | `@vav/time-mapping` | **`REUSE_DIRECT`** |
| **DaVinci Resolve Timeline Bridge** | `Downloads/JOC55_HOTFIX_FAST_V3_3_HW_DECODE_RESUME/TOOLS/JOC55_REBUILD_RESUME_FAST_V3_3.py` | `rebuild_timeline_resolve` | Generates Resolve EDL/FCPXML timeline tracks for DaVinci roundtrip. | `@vav/interchange` | **`MIGRATE`** |
| **Automated Motion Treatment Sidecars** | `Downloads/JOC55_HOTFIX_FAST_V3_3_HW_DECODE_RESUME/TOOLS/motion_treatment_v2.py` | `plan_motion_treatment` | Camera punch-in calculations based on speaker turn changes. | `@vav/visual-motion-domain` | **`ADAPT`** |
| **Storage Preflight & Resume Recovery** | `Desktop/Moka_Terminal_Cortes_48_FrameMatched_FINAL/tools/moka_render_safety.py` | `storage_preflight`, `is_render_current` | Checks disk space before render and allows partial batch resumption. | `@vav/export-system` | **`REUSE_DIRECT`** |

---

## 2. Target Package Distribution for Implementation Runs

* **Run 3 (VAV Cuts V1)**:
  * Implement `CutPlan` domain models & validators in `@vav/time-mapping` and `@vav/project-model`.
  * Implement Non-destructive Cut Engine and FFmpeg VideoToolbox extractors in `@vav/export-system`.
  * Wire DaVinci EDL export into `@vav/interchange`.
  * Bind `EDIT_LOCK` minting into `@vav/project-session`.

* **Run 4 (VAV Motions V1)**:
  * Implement Simple Motion Core transform generators in `@vav/visual-motion-domain`.
  * Implement Safe-zone collision checker in `@vav/motion-caption-policy`.
  * Integrate Camera zoom/push/pull rendering into `@vav/remotion-composition`.
