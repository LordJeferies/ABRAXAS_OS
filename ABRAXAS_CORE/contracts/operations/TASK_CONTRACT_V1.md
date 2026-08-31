# Task Contract V1

## Purpose
He owns operational work state. A Task represents discrete operational work related to ABRAXAS (Lienzos, Cuts, Motions, Reviews) or external/mixed workflows (studio rental, logistics, calls).

## Canonical Payload Shape
```json
{
  "taskId": "tsk_01",
  "version": 1,
  "title": "Edit Vertical Reel",
  "description": "Trim silence and add motion preset",
  "status": "BACKLOG",
  "priority": "HIGH",
  "targetRef": {
    "targetType": "LIENZO",
    "targetId": "lienzo_001",
    "component": "EDIT_LOCK",
    "version": 1
  },
  "schedule": {
    "scheduledStartAt": "2026-09-01T09:00:00Z",
    "scheduledEndAt": "2026-09-01T12:00:00Z",
    "timezone": "America/Bogota"
  },
  "createdBy": "u_manager",
  "createdAt": "2026-08-30T12:00:00Z",
  "updatedAt": "2026-08-30T12:00:00Z"
}
```

## Field Definitions & Canonical Enums
* `taskId` (string): Unique deterministic or generated task identifier.
* `version` (integer >= 1): Monotonically increasing revision counter.
* `title` (string, non-empty): Summary of the operational unit of work.
* `status`: `"BACKLOG"` | `"READY"` | `"IN_PROGRESS"` | `"REVIEW"` | `"BLOCKED"` | `"DONE"` | `"CANCELLED"`.
* `priority`: `"LOW"` | `"MEDIUM"` | `"HIGH"` | `"URGENT"`.
* `targetRef` (optional):
  * `targetType`: `"PLAN"` | `"LIENZO"` | `"COMPONENT"` | `"RECORDING_SESSION"` | `"PUBLICATION_TARGET"` | `"TASK"` | `"EDIT_LOCK"` | `"MOTION_PLAN"` | `"LIENZO_COMPONENT"` | `"COPY_VERSION"` | `"COVER_VERSION"` | `"NONE_EXTERNAL"`.
  * `targetId` (string).
  * `component` (optional string).
  * `version` (optional integer).
* `schedule` (optional):
  * `scheduledStartAt` (ISO-8601 string).
  * `scheduledEndAt` (optional ISO-8601 string).
  * `timezone` (string).

## Lifecycle Invariants
1. Product command `createTask` defaults status strictly to `BACKLOG`.
2. `editTask` allows updating title, description, priority, targetRef, and schedule, but strictly forbids changing `status`.
3. `transitionTask` evaluates dependencies, reviews, and overrides before state transition.
4. Blocked tasks with unresolved dependencies are strictly prevented from reaching `READY`, `IN_PROGRESS`, `REVIEW`, or `DONE` unless explicitly overridden.
