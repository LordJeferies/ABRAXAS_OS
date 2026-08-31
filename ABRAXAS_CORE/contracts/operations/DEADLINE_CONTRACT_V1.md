# Deadline Contract V1

## Purpose
Multi-level deadline tracking across Plans, Lienzos, Components, Tasks, Recording Sessions, and Publication Targets.

## Canonical Payload Shape
```json
{
  "deadlineId": "dl_01",
  "targetType": "TASK",
  "targetId": "tsk_01",
  "dueAt": "2026-09-01T18:00:00Z",
  "timezone": "America/Bogota",
  "status": "ACTIVE",
  "source": "EDITORIAL_SCHEDULE",
  "notes": "Must be ready before studio session",
  "createdBy": "u_manager",
  "createdAt": "2026-08-30T12:00:00Z"
}
```

## Canonical Enums
* `targetType`: `"PLAN"` | `"LIENZO"` | `"COMPONENT"` | `"TASK"` | `"RECORDING_SESSION"` | `"PUBLICATION_TARGET"`.
* `status`: `"ACTIVE"` | `"COMPLETED"` | `"CANCELLED"`.

## Severity Precedence & Risk Evaluation
* `COMPLETED`: Target is done or deadline marked completed.
* `OVERDUE`: `now > dueAt` and target incomplete (retains OVERDUE even if blocked).
* `DUE_SOON`: `dueAt - now <= 48 hours`.
* `AT_RISK`: Target is blocked by upstream dependencies.
* `ON_TRACK`: Progressing without blockers.
