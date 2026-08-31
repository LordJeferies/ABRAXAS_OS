# ABRAXAS OS — MotionPlan Contract V1

**Task ID**: `ABX-VAV-CUTS-MOTIONS-ASBUILT-F2AV-001`  
**Gate**: `F2 AV Production Contract Freeze`  
**Status**: `FROZEN_FOR_RUN4`

---

## 1. Specification Overview

The `MotionPlan` is a versioned manifest declaring spatial animations, camera movements (zoom, push, pull, pan), visual asset placements, and safe-zone constraints anchored to the edited timeline established by an `EDIT_LOCK`.

---

## 2. Simple Motion Core vs Advanced Motion Partition

To ensure **Run 4 (VAV Motions V1)** can execute immediately without waiting for complex ML computer vision pipelines, capabilities are strictly partitioned:

| Core Domain | Capabilities Included in Run 4 (Simple Motion Core) | Deferred to Future Phases (Advanced Motion) |
| :--- | :--- | :--- |
| **Camera Moves** | Deterministic Zoom In/Out, Push, Pull, Pan, Static Framing | 3D Camera Path Tracking, Multi-Axis Dolly Simulation |
| **Transforms** | Scale, Translate, Fade In/Out, Wipe Reveal | Semantic Subject Isolation, Dynamic Depth Plane Layering |
| **Visual Assets** | Side-by-side Overlays, Bench Data Cards, Document Pops | Live Surface Planar Tracking, Occlusion Mesh Deformation |
| **Caption Safety**| Bounding Box Collision Avoidance, Bottom/Top Safe Zones | Dynamic Real-Time Word Occlusion Bypass |

---

## 3. MotionPlan JSON Schema & Payload Structure

```json
{
  "motion_plan_id": "mot_plan_moka_v01_r4_001",
  "version": 1,
  "content_id": "cnt_moka_v01_2026",
  "deliverable_id": "deliv_short_vertical_01",
  "edit_lock_id": "lock_moka_v01_v1",
  "canvas": {
    "width": 1080,
    "height": 1920,
    "fps_rational": "30000/1001",
    "safe_zones": {
      "top_margin_px": 288,
      "bottom_margin_px": 480,
      "left_margin_px": 64,
      "right_margin_px": 64
    }
  },
  "assignments": [
    {
      "assignment_id": "mot_asg_01_hook_punch",
      "motion_family_id": "MOT_CAMERA_PUSH_IN",
      "timeline_range": {
        "start_us": 0,
        "end_us": 2500000,
        "start_frame": 0,
        "end_frame": 75
      },
      "parameters": {
        "start_scale": 1.0,
        "end_scale": 1.15,
        "origin_x": 0.5,
        "origin_y": 0.35,
        "easing": "EASE_OUT_CUBIC"
      },
      "visual_owner": "MAIN_SPEAKER_VIDEO",
      "caption_policy": {
        "text_ownership": "caption-engine",
        "caption_visibility": "visible",
        "avoid_collision": true
      },
      "priority": 1,
      "editorial_intent": "EMPHASIZE_HOOK_TENSION"
    },
    {
      "assignment_id": "mot_asg_02_evidence_card",
      "motion_family_id": "MOT_OVERLAY_SLIDE_REVEAL",
      "timeline_range": {
        "start_us": 8000000,
        "end_us": 14000000,
        "start_frame": 240,
        "end_frame": 420
      },
      "parameters": {
        "asset_ref": "art_graph_binding_affinity_001",
        "placement": "CENTER_HIGH",
        "entry_animation": "SLIDE_UP_FADE",
        "exit_animation": "FADE_OUT"
      },
      "visual_owner": "VISUAL_MOTION_DOMAIN",
      "caption_policy": {
        "text_ownership": "hybrid",
        "caption_visibility": "adaptive",
        "avoid_collision": true
      },
      "priority": 2,
      "editorial_intent": "DISPLAY_EMPIRICAL_PROOF"
    }
  ],
  "provenance": {
    "created_by": "VAV_MOTIONS_V1",
    "created_at": "2026-08-30T13:40:00Z",
    "status": "DRAFT"
  }
}
```
