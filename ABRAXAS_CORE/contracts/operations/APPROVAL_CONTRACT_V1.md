# Approval Contract V1

## Purpose
Formal review and decision tracking across operational targets (Tasks, Lienzo components, EditLocks, MotionPlans, Publication targets).

## Canonical Payload Shape
```json
{
  "approvalId": "app_01",
  "version": 1,
  "targetType": "EDIT_LOCK",
  "targetId": "lock_001",
  "requestedBy": "u_editor",
  "reviewers": ["u_supervisor"],
  "decision": "PENDING",
  "comments": "Please review edit lock v1",
  "requestedAt": "2026-08-30T12:00:00Z",
  "decidedAt": null,
  "decidedBy": null
}
```

## Canonical Enums
* `targetType`: `"TASK"` | `"LIENZO_COMPONENT"` | `"COPY_VERSION"` | `"COVER_VERSION"` | `"EDIT_LOCK"` | `"MOTION_PLAN"` | `"PUBLICATION_TARGET"`.
* `decision`: `"PENDING"` | `"APPROVED"` | `"CHANGES_REQUESTED"` | `"REJECTED"` | `"CANCELLED"`.

## Invariants
1. Reviewers must resolve to existing, active, unique `TeamMember` entities.
2. `requestApproval` always initializes in state `PENDING`.
3. `decideApproval` accepts only `"APPROVED"`, `"CHANGES_REQUESTED"`, or `"REJECTED"`.
4. Decision authorization requires `(approval.decide AND designated reviewer) OR approval.decide_any`.
5. Clock authority is unified through the service's `ClockProvider`.
