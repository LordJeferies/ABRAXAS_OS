# Dependency and Override Contract V1

## Purpose
Specifies directed graph relationships and override authorization between operational units in He.

## Canonical Payload Shape: Dependency
```json
{
  "dependencyId": "dep_01",
  "upstreamType": "TASK",
  "upstreamId": "tsk_audio_01",
  "downstreamType": "TASK",
  "downstreamId": "tsk_vfx_01",
  "dependencyKind": "BLOCKS",
  "createdBy": "u_manager",
  "createdAt": "2026-08-30T12:00:00Z"
}
```

## Canonical Payload Shape: DependencyOverride
```json
{
  "overrideId": "ovr_01",
  "actorId": "u_manager",
  "dependencyId": "dep_01",
  "targetTaskId": "tsk_vfx_01",
  "reason": "Producer authorized scratch voiceover pass",
  "timestamp": "2026-08-30T12:00:00Z"
}
```

## Canonical Enums & Supported V1 Combinations
* `dependencyKind`: `"BLOCKS"` | `"REQUIRES_APPROVAL"` | `"REQUIRES_COMPLETION"` | `"INFORMATIONAL"`.
* `DependencyNodeType`: `"TASK"` | `"LIENZO_COMPONENT"` | `"COPY_VERSION"` | `"COVER_VERSION"` | `"EDIT_LOCK"` | `"MOTION_PLAN"` | `"PUBLICATION_TARGET"` | `"PLAN"` | `"LIENZO"` | `"COMPONENT"` | `"RECORDING_SESSION"`.
* **V1 Node Type Constraints**:
  * `BLOCKS`: `upstreamType = "TASK"`, `downstreamType = "TASK"`.
  * `REQUIRES_COMPLETION`: `upstreamType = "TASK"`, `downstreamType = "TASK"`.
  * `REQUIRES_APPROVAL`: `upstreamType` in (`"TASK"`, `"LIENZO_COMPONENT"`, `"COPY_VERSION"`, `"COVER_VERSION"`, `"EDIT_LOCK"`, `"MOTION_PLAN"`, `"PUBLICATION_TARGET"`), `downstreamType = "TASK"`.
  * `INFORMATIONAL`: cross-entity allowed.

## Invariants
1. Cycle detection prevents cyclical blocking graphs.
2. An override targets a specific `dependencyId`. Overriding dependency A does not bypass dependency B.
3. Every override requires an explicit actor and non-empty reason.
