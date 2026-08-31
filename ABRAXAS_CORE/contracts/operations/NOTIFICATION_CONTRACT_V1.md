# Notification Contract V1

## Purpose
In-app operational alerts and reminders dispatched to team members.

## Canonical Payload Shape
```json
{
  "notificationId": "notif_01",
  "userId": "u_editor",
  "type": "TASK_ASSIGNED",
  "targetRef": {
    "targetType": "TASK",
    "targetId": "tsk_01"
  },
  "createdAt": "2026-08-30T12:00:00Z",
  "readAt": null,
  "severity": "INFO",
  "message": "You have been assigned to task 'tsk_01'",
  "dedupeKey": "notif_asg_asg_01"
}
```

## Canonical Enums & Fields
* `type`: `"TASK_ASSIGNED"` | `"TASK_COMPLETED"` | `"DEADLINE_APPROACHING"` | `"DEADLINE_MISSED"` | `"REVIEW_REQUESTED"` | `"APPROVAL_REQUESTED"` | `"APPROVAL_DECIDED"` | `"DEPENDENCY_RESOLVED"` | `"TASK_BLOCKED"` | `"WAITING_FOR_YOU"` | `"RECORDING_UPCOMING"` | `"RECORDING_REMINDER"`.
* `severity`: `"INFO"` | `"WARNING"` | `"URGENT"`.
* `notificationId` (string): Unique identifier.
* `userId` (string): Recipient team member.
* `createdAt` (ISO-8601 string).
* `message` (string, non-empty).
* `dedupeKey` (string, unique for deduplication).

## Invariants
1. Notification generation is idempotent using `dedupeKey`.
2. Users can only modify read status of their own notifications unless authorized with `team.manage`.
