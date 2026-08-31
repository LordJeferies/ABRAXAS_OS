# Time Entry Contract V1

## Purpose
Tracks operational execution time linked to tasks and content without mixing with editorial performance metrics.

## Canonical Payload Shape: TimeEntry
```json
{
  "timeEntryId": "te_01",
  "userId": "u_editor",
  "taskId": "tsk_01",
  "contentId": "lienzo_001",
  "startedAt": "2026-08-30T14:00:00Z",
  "endedAt": "2026-08-30T15:30:00Z",
  "durationSeconds": 5400,
  "source": "TIMER",
  "note": "Initial cut pass",
  "createdAt": "2026-08-30T15:30:00Z"
}
```

## Canonical Payload Shape: TimerSession
```json
{
  "timerId": "tmr_01",
  "userId": "u_editor",
  "taskId": "tsk_01",
  "status": "RUNNING",
  "startedAt": "2026-08-30T14:00:00Z",
  "lastResumedAt": "2026-08-30T14:00:00Z",
  "accumulatedSeconds": 0,
  "updatedAt": "2026-08-30T14:00:00Z"
}
```

## Canonical Enums & Fields
* `source`: `"MANUAL"` | `"TIMER"` | `"INTEGRATION"`.
* `TimerStatus`: `"RUNNING"` | `"PAUSED"`.
* `timeEntryId` (string): Unique identifier.
* `userId` (string): Team member recording time.
* `taskId` (string): Local task reference.
* `startedAt` (ISO-8601 string).
* `durationSeconds` (number >= 0).

## Permissions
* `time.track`: Start, pause, resume, and stop active timers.
* `time.manual`: Submit manual time entries.
* `time.view_own`: View own tracked time and time reports.
* `time.view_team`: View team-wide time tracking reports.
* `time.edit`: Edit or record time on behalf of other team members.

## Invariants
1. Maximum 1 active timer per user.
2. Pause only allowed on RUNNING timers; resume only on PAUSED timers.
3. Stopping timer creates durable TimeEntry and removes transient TimerSession.
4. Non-negative duration required.
