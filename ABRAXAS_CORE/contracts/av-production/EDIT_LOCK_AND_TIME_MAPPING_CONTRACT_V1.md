# ABRAXAS OS — EditLock & TimeMapping Contract V1

**Task ID**: `ABX-VAV-CUTS-MOTIONS-ASBUILT-F2AV-001`  
**Gate**: `F2 AV Production Contract Freeze`  
**Status**: `FROZEN_FOR_RUN3_RUN4`

---

## 1. Specification Overview

The `EDIT_LOCK` represents the approved, immutable temporal geometry of an edited piece. Once minted, all downstream processors (Captions, Motions, Color, Mix, Render) synchronize to its coordinates.

The underlying **TimeMapping** engine translates bidirectionally between source media timestamps and edited timeline timestamps without drift.

---

## 2. Time Mapping Strategy Decision

* **Decision**: **`REUSE_DIRECT` / `ADAPT`**
* **Canonical Implementation**: Built upon `@vav/timebase` (rational math, frame/microsecond conversion) and `@vav/time-mapping` (`TimeMappingV1`, `SourceToEditedRange`, `mapSourceTimeToEditedTime`, `mapEditedTimeToSourceTime`).
* **Justification**: The existing `@vav/time-mapping` package already implements bidirectional segment translation, removed range tracking, and trim detection with 100% passing tests.

---

## 3. EditLock JSON Schema & Payload Structure

```json
{
  "edit_lock_id": "lock_moka_v01_v1",
  "content_id": "cnt_moka_v01_2026",
  "deliverable_id": "deliv_short_vertical_01",
  "cut_plan_id": "cut_plan_moka_v01_r3_001",
  "cut_plan_version": 1,
  "time_mapping_version": 1,
  "timebase": {
    "fps_rational": "30000/1001",
    "fps_nominal": 29.97,
    "width": 1080,
    "height": 1920,
    "duration_us": 45120000,
    "total_frames": 1352
  },
  "mapping_ranges": [
    {
      "range_id": "map_01",
      "source_asset_id": "src_raw_master_001",
      "source_start_us": 145200000,
      "source_end_us": 153200000,
      "edited_start_us": 0,
      "edited_end_us": 8000000,
      "speed_multiplier": 1.0
    }
  ],
  "removed_ranges": [
    {
      "source_asset_id": "src_raw_master_001",
      "source_start_us": 153200001,
      "source_end_us": 162100000,
      "reason": "SILENCE_AND_FALSE_START"
    }
  ],
  "locked_by": "USER_EDITORIAL_APPROVAL",
  "locked_at": "2026-08-30T13:35:00Z",
  "status": "LOCKED"
}
```

---

## 4. Invalidation & OUT_OF_SYNC Propagation Lifecycle

```
[User Edits CutPlan] ──> Creates CutPlan v2 (DRAFT)
                              │
                              ▼
                      [User Approves Edit]
                              │
                              ▼
                      Mint EditLock v2 (LOCKED)
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
      Emit Event:                 Lienzo Updates:
      EDIT_LOCK_CREATED           CAPTIONS State ──> OUT_OF_SYNC
      (previous: lock_v1,         MOTIONS State  ──> OUT_OF_SYNC
       new: lock_v2)              RENDER State   ──> OUT_OF_SYNC
                                            │
                                            ▼
                                  Pipeline Triggers:
                                  Re-align Captions to lock_v2
                                  Re-align Motions to lock_v2
```
