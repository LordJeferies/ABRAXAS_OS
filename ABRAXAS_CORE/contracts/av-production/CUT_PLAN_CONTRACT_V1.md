# ABRAXAS OS — CutPlan Contract V1

**Task ID**: `ABX-VAV-CUTS-V1-IMPLEMENTATION-001`  
**Gate**: `F2 AV Production Contract Freeze / VAV Cuts V1`  
**Status**: `PHASE0_NORMALIZED_FROZEN`

---

## 1. Specification Overview

The `CutPlan` is a versioned, non-destructive manifest declaring exact timeline assembly from one or more source media assets into an edited timeline.

It is authored and executed by **VAV Cuts**, consuming candidate observations from **Shim** and editorial intent from **YOD**.

---

## 2. CutDecision Enumeration & Semantics

Every candidate segment identified by Shim or the editor is evaluated through one of the four canonical decisions:

| Cut Decision | Semantic Meaning | Behavior in CutPlan |
| :--- | :--- | :--- |
| **`KEEP`** | Candidate accepted as-is. | Assembled into edited timeline with standard policy handles. |
| **`REMOVE`** | Candidate rejected. | Excluded from edited timeline; recorded in `removed_ranges` with audit reason. |
| **`TRIM`** | Candidate accepted with modified in/out bounds. | Assembled using adjusted timestamps with consonant-tail and microtrim protection. |
| **`REORDER`** | Candidate moved to a different sequence index. | Sequence index overridden while preserving source timestamp integrity. |

---

## 3. Parameterized CutPolicy Configuration

All time bounds and audio thresholds are configurable policy parameters, avoiding hardcoded assumptions:

```json
{
  "handle_duration_us": 100000,
  "silence_removal_threshold_db": -38.0,
  "min_silence_duration_us": 350000,
  "consonant_tail_preservation_us": 80000,
  "breath_behavior": "ATTENUATE_6DB"
}
```

---

## 4. CutPlan JSON Payload Structure

```json
{
  "cut_plan_id": "cut_plan_moka_v01_r3_001",
  "version": 1,
  "content_id": "cnt_moka_v01_2026",
  "deliverable_id": "deliv_short_vertical_01",
  "format_id": "FMT_SHORT_VERTICAL_VIDEO",
  "source_media": [
    {
      "source_asset_id": "src_raw_master_001",
      "path_or_uri": "/Volumes/Media/Moka/2026-07-23 15-25-59.mp4",
      "sha256": "4a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b",
      "duration_us": 3600000000,
      "timebase": {
        "fps_rational": "30000/1001",
        "fps_nominal": 29.97,
        "width": 1920,
        "height": 1080
      }
    }
  ],
  "timeline_target": {
    "fps_rational": "30000/1001",
    "width": 1080,
    "height": 1920,
    "total_duration_us": 45120000
  },
  "cutting_policies": {
    "handle_duration_us": 100000,
    "silence_removal_threshold_db": -38.0,
    "min_silence_duration_us": 350000,
    "consonant_tail_preservation_us": 80000,
    "breath_behavior": "ATTENUATE_6DB"
  },
  "segments": [
    {
      "segment_id": "seg_01_hook",
      "sequence_index": 0,
      "source_asset_id": "src_raw_master_001",
      "source_range": {
        "start_us": 145200000,
        "end_us": 153200000,
        "start_frame": 4351,
        "end_frame": 4591
      },
      "edited_range": {
        "start_us": 0,
        "end_us": 8000000,
        "start_frame": 0,
        "end_frame": 240
      },
      "handles": {
        "head_us": 100000,
        "tail_us": 100000
      },
      "speaker": {
        "speaker_id": "SPK_FACU",
        "confidence": 0.98
      },
      "editorial_role": "HOOK_DIRECT_TRIGGER",
      "reconciliation_ref": "card_moka_v01_p01"
    }
  ],
  "provenance": {
    "created_by": "VAV_CUTS_V1",
    "created_at": "2026-08-30T13:30:00Z",
    "based_on_shim_map": "shim_map_moka_v01_v1",
    "status": "DRAFT"
  }
}
```

---

## 5. Invariants

1. **Non-Destructive Cutting**: Source media files are never overwritten, trimmed in-place, or destructively modified.
2. **Strict Monotonicity**: On the edited timeline, `segments[i+1].edited_range.start_us >= segments[i].edited_range.end_us`.
3. **Zero Gaps / Overlaps**: Unintended temporal gaps or negative durations are rejected.
4. **Handle Safety**: Handles extend before and after cut bounds for cross-fades without altering primary cut duration.
5. **Consonant Tail Protection**: Cutting algorithms enforce configurable padding (default `80ms`) after detected word endpoints.
