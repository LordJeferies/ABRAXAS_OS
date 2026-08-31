# Activity Contract V1

## Purpose
Canonical operational audit ledger capturing all domain mutations in He.

## Canonical Payload Shape
```json
{
  "activityId": "act_01",
  "entryType": "TASK_CREATED",
  "actorId": "u_manager",
  "timestamp": "2026-08-30T12:00:00Z",
  "targetRef": {
    "targetType": "TASK",
    "targetId": "tsk_01"
  },
  "beforeState": null,
  "afterState": "BACKLOG",
  "details": "Created task 'Edit Vertical Reel'"
}
```

## Canonical ActivityEntryType Enums
* Core Operations:
  * `"BOOTSTRAP_INITIALIZED"`
  * `"TASK_CREATED"`
  * `"TASK_UPDATED"`
  * `"TASK_ASSIGNED"`
  * `"TASK_UNASSIGNED"`
  * `"TASK_STATUS_CHANGED"`
  * `"DEPENDENCY_CREATED"`
  * `"DEPENDENCY_REMOVED"`
  * `"DEADLINE_CREATED"`
  * `"DEADLINE_UPDATED"`
  * `"RECORDING_CREATED"`
  * `"RECORDING_UPDATED"`
  * `"RECORDING_CONFIRMED"`
  * `"RECORDING_CANCELLED"`
  * `"APPROVAL_REQUESTED"`
  * `"APPROVAL_DECIDED"`
  * `"APPROVAL_CANCELLED"`
  * `"OVERRIDE_APPLIED"`
* P3B Time Tracking:
  * `"TIME_TIMER_STARTED"`
  * `"TIME_TIMER_PAUSED"`
  * `"TIME_TIMER_RESUMED"`
  * `"TIME_TIMER_STOPPED"`
  * `"TIME_ENTRY_CREATED"`
* P3B Notifications:
  * `"NOTIFICATION_CREATED"`
  * `"NOTIFICATION_READ"`
