# RBAC Contract V1

## Purpose
Specifies permission sets, roles, and default-deny access control for He Operations.

## Canonical Permissions
* `task.create`: Create tasks.
* `task.edit`: Update task metadata and dependencies.
* `task.assign`: Assign or unassign team members.
* `task.change_state`: Execute state transitions on tasks.
* `task.override_dependency`: Apply explicit dependency overrides.
* `task.review`: Submit task reviews.
* `deadline.create`: Create new deadlines.
* `deadline.edit`: Update deadline dates and notes.
* `recording.create`: Create draft recording sessions.
* `recording.edit`: Edit recording session details / cancel.
* `recording.confirm`: Move recording sessions to CONFIRMED.
* `approval.request`: Submit approval requests.
* `approval.decide`: Authorize or reject designated approval requests.
* `approval.decide_any`: Supervisor authority to decide or cancel any approval.
* `team.view`: View team member roster.
* `team.manage`: Add or update team members.
* `lienzo.view`: View Lienzo content.
* `lienzo.edit`: Edit Lienzo content.
* `publication.view`: View publication targets.
* `publication.schedule`: Schedule publications.
* `metrics.view`: View operational metrics.
* `provider.configure`: Configure external provider integrations.
* `time.track`: Start, pause, resume, and stop active timers.
* `time.manual`: Submit manual time entries.
* `time.view_own`: View own tracked time reports.
* `time.view_team`: View team-wide tracked time reports.
* `time.edit`: Edit or record time entries on behalf of others.
