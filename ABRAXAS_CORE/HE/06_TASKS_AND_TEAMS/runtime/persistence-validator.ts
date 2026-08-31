import type {
  ActivityEntry,
  Approval,
  Deadline,
  Dependency,
  DependencyOverride,
  Notification,
  RecordingSession,
  Task,
  TaskAssignment,
  TeamMember,
  TimeEntry,
  TimerSession
} from "./types.ts";
import {validateDependencyKindConstraints} from "./dependencies.ts";

export interface OperationsStatePayloadV2 {
  schemaVersion: 2;
  members: TeamMember[];
  tasks: Task[];
  assignments: TaskAssignment[];
  dependencies: Dependency[];
  deadlines: Deadline[];
  recordingSessions: RecordingSession[];
  approvals: Approval[];
  activity: ActivityEntry[];
  overrides: DependencyOverride[];
  timerSessions: TimerSession[];
  timeEntries: TimeEntry[];
  notifications: Notification[];
}

export function validateOperationsState(data: unknown): asserts data is OperationsStatePayloadV2 {
  if (!data || typeof data !== "object") {
    throw new Error("Persistence validation error: payload must be a non-null object");
  }

  const d = data as Record<string, any>;
  if (d.schemaVersion !== 2) {
    throw new Error(`Persistence validation error: expected schemaVersion 2, received ${d.schemaVersion}`);
  }

  // Required Collections in schemaVersion 2
  const requiredCollections = [
    "members", "tasks", "assignments", "dependencies", "deadlines",
    "recordingSessions", "approvals", "activity", "overrides",
    "timerSessions", "timeEntries", "notifications"
  ];

  for (const col of requiredCollections) {
    if (!Array.isArray(d[col])) {
      throw new Error(`Persistence validation error: '${col}' must be an array`);
    }
  }

  const validMemberStatuses = new Set(["ACTIVE", "INACTIVE", "SUSPENDED"]);
  const validTaskStatuses = new Set(["BACKLOG", "READY", "IN_PROGRESS", "REVIEW", "BLOCKED", "DONE", "CANCELLED"]);
  const validTaskPriorities = new Set(["LOW", "MEDIUM", "HIGH", "URGENT"]);
  const validAssignmentStatuses = new Set(["ACTIVE", "COMPLETED", "REMOVED"]);
  const validDependencyKinds = new Set(["BLOCKS", "REQUIRES_APPROVAL", "REQUIRES_COMPLETION", "INFORMATIONAL"]);
  const validDependencyNodeTypes = new Set([
    "TASK", "LIENZO_COMPONENT", "COPY_VERSION", "COVER_VERSION", "EDIT_LOCK", "MOTION_PLAN",
    "PUBLICATION_TARGET", "PLAN", "LIENZO", "COMPONENT", "RECORDING_SESSION"
  ]);
  const validDeadlineTargets = new Set(["PLAN", "LIENZO", "COMPONENT", "TASK", "RECORDING_SESSION", "PUBLICATION_TARGET"]);
  const validDeadlineStatuses = new Set(["ACTIVE", "COMPLETED", "CANCELLED"]);
  const validSessionStatuses = new Set(["DRAFT", "PROPOSED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);
  const validLocationTypes = new Set(["PHYSICAL", "REMOTE", "TBD"]);
  const validApprovalDecisions = new Set(["PENDING", "APPROVED", "CHANGES_REQUESTED", "REJECTED", "CANCELLED"]);
  const validApprovalTargets = new Set([
    "TASK", "LIENZO_COMPONENT", "COPY_VERSION", "COVER_VERSION", "EDIT_LOCK", "MOTION_PLAN", "PUBLICATION_TARGET"
  ]);
  const validActivityEntryTypes = new Set([
    "BOOTSTRAP_INITIALIZED", "TASK_CREATED", "TASK_UPDATED", "TASK_ASSIGNED", "TASK_UNASSIGNED",
    "TASK_STATUS_CHANGED", "DEPENDENCY_CREATED", "DEPENDENCY_REMOVED", "DEADLINE_CREATED",
    "DEADLINE_UPDATED", "RECORDING_CREATED", "RECORDING_UPDATED", "RECORDING_CONFIRMED",
    "RECORDING_CANCELLED", "APPROVAL_REQUESTED", "APPROVAL_DECIDED", "APPROVAL_CANCELLED",
    "OVERRIDE_APPLIED", "TIME_TIMER_STARTED", "TIME_TIMER_PAUSED", "TIME_TIMER_RESUMED",
    "TIME_TIMER_STOPPED", "TIME_ENTRY_CREATED", "NOTIFICATION_CREATED", "NOTIFICATION_READ"
  ]);
  const validTimerStatuses = new Set(["RUNNING", "PAUSED"]);
  const validTimeSources = new Set(["MANUAL", "TIMER", "INTEGRATION"]);
  const validNotifTypes = new Set([
    "TASK_ASSIGNED", "TASK_COMPLETED", "DEADLINE_APPROACHING", "DEADLINE_MISSED",
    "REVIEW_REQUESTED", "APPROVAL_REQUESTED", "APPROVAL_DECIDED", "DEPENDENCY_RESOLVED", "TASK_BLOCKED",
    "WAITING_FOR_YOU", "RECORDING_UPCOMING", "RECORDING_REMINDER"
  ]);
  const validNotifSeverities = new Set(["INFO", "WARNING", "URGENT"]);

  const memberIds = new Set<string>();
  const taskIds = new Set<string>();
  const depIds = new Set<string>();

  // 1. Members
  for (const m of d.members) {
    if (!m.userId || !m.displayName || !validMemberStatuses.has(m.status) || !Array.isArray(m.roles)) {
      throw new Error(`Structural error in TeamMember: invalid or missing fields in ${JSON.stringify(m)}`);
    }
    memberIds.add(m.userId);
  }

  // 2. Tasks
  for (const t of d.tasks) {
    if (!t.taskId || !t.title || !t.title.trim() || !validTaskStatuses.has(t.status) || !validTaskPriorities.has(t.priority) || !t.createdBy || !t.createdAt || !t.updatedAt) {
      throw new Error(`Structural error in Task: invalid fields or status in ${JSON.stringify(t)}`);
    }
    taskIds.add(t.taskId);
  }

  // 3. Assignments
  for (const a of d.assignments) {
    if (!a.assignmentId || !a.taskId || !a.userId || !validAssignmentStatuses.has(a.status) || !a.assignedBy || !a.assignedAt) {
      throw new Error(`Structural error in TaskAssignment: invalid fields in ${JSON.stringify(a)}`);
    }
    if (!memberIds.has(a.userId)) {
      throw new Error(`Referential error: TaskAssignment '${a.assignmentId}' references non-existent TeamMember '${a.userId}'`);
    }
    if (!taskIds.has(a.taskId)) {
      throw new Error(`Referential error: TaskAssignment '${a.assignmentId}' references non-existent Task '${a.taskId}'`);
    }
  }

  // 4. Dependencies
  for (const dep of d.dependencies) {
    if (!dep.dependencyId || !validDependencyNodeTypes.has(dep.upstreamType) || !dep.upstreamId || !validDependencyNodeTypes.has(dep.downstreamType) || !dep.downstreamId || !validDependencyKinds.has(dep.dependencyKind) || !dep.createdBy || !dep.createdAt) {
      throw new Error(`Structural error in Dependency: invalid fields or types in ${JSON.stringify(dep)}`);
    }

    // Reuse canonical domain dependency constraints validator
    validateDependencyKindConstraints(dep);

    if (dep.dependencyKind === "BLOCKS" || dep.dependencyKind === "REQUIRES_COMPLETION") {
      if (dep.upstreamType === "TASK" && !taskIds.has(dep.upstreamId)) {
        throw new Error(`Referential error: Dependency '${dep.dependencyId}' (${dep.dependencyKind}) references non-existent upstream local Task '${dep.upstreamId}'`);
      }
      if (dep.downstreamType === "TASK" && !taskIds.has(dep.downstreamId)) {
        throw new Error(`Referential error: Dependency '${dep.dependencyId}' (${dep.dependencyKind}) references non-existent downstream local Task '${dep.downstreamId}'`);
      }
    }
    depIds.add(dep.dependencyId);
  }

  // 5. Deadlines
  for (const dl of d.deadlines) {
    if (!dl.deadlineId || !validDeadlineTargets.has(dl.targetType) || !dl.targetId || !dl.dueAt || !validDeadlineStatuses.has(dl.status) || !dl.createdBy || !dl.createdAt) {
      throw new Error(`Structural error in Deadline: invalid fields in ${JSON.stringify(dl)}`);
    }
  }

  // 6. RecordingSessions
  for (const r of d.recordingSessions) {
    if (!r.recordingSessionId || !r.title || !r.startsAt || !r.endsAt || !validSessionStatuses.has(r.status) || !validLocationTypes.has(r.locationType) || !r.createdBy || !r.createdAt) {
      throw new Error(`Structural error in RecordingSession: invalid fields or locationType in ${JSON.stringify(r)}`);
    }
    if (new Date(r.endsAt).getTime() <= new Date(r.startsAt).getTime()) {
      throw new Error(`Structural error: RecordingSession endsAt must be strictly greater than startsAt in ${r.recordingSessionId}`);
    }
  }

  // 7. Approvals
  for (const ap of d.approvals) {
    if (!ap.approvalId || !validApprovalTargets.has(ap.targetType) || !ap.targetId || !Array.isArray(ap.reviewers) || !validApprovalDecisions.has(ap.decision) || !ap.requestedBy || !ap.requestedAt) {
      throw new Error(`Structural error in Approval: invalid fields in ${JSON.stringify(ap)}`);
    }
  }

  // 8. Activity
  for (const act of d.activity) {
    if (!act.activityId || !validActivityEntryTypes.has(act.entryType) || !act.actorId || !act.timestamp || !act.targetRef) {
      throw new Error(`Structural error in ActivityEntry: invalid fields in ${JSON.stringify(act)}`);
    }
  }

  // 9. Overrides
  for (const ovr of d.overrides) {
    if (!ovr.overrideId || !ovr.targetTaskId || !ovr.dependencyId || !ovr.reason || !ovr.reason.trim() || !ovr.actorId || !ovr.timestamp) {
      throw new Error(`Structural error in DependencyOverride: invalid fields in ${JSON.stringify(ovr)}`);
    }
    if (!depIds.has(ovr.dependencyId)) {
      throw new Error(`Referential error: DependencyOverride '${ovr.overrideId}' references non-existent Dependency '${ovr.dependencyId}'`);
    }
    if (!taskIds.has(ovr.targetTaskId)) {
      throw new Error(`Referential error: DependencyOverride '${ovr.overrideId}' references non-existent local Task '${ovr.targetTaskId}'`);
    }
  }

  // 10. TimerSessions
  for (const ts of d.timerSessions) {
    if (!ts.timerId || !ts.userId || !ts.taskId || !ts.startedAt || !validTimerStatuses.has(ts.status)) {
      throw new Error(`Structural error in TimerSession: invalid fields in ${JSON.stringify(ts)}`);
    }
    if (!memberIds.has(ts.userId)) {
      throw new Error(`Referential error: TimerSession '${ts.timerId}' references non-existent TeamMember '${ts.userId}'`);
    }
    if (!taskIds.has(ts.taskId)) {
      throw new Error(`Referential error: TimerSession '${ts.timerId}' references non-existent Task '${ts.taskId}'`);
    }
  }

  // 11. TimeEntries
  for (const te of d.timeEntries) {
    if (!te.timeEntryId || !te.userId || !te.taskId || typeof te.durationSeconds !== "number" || !validTimeSources.has(te.source)) {
      throw new Error(`Structural error in TimeEntry: invalid fields in ${JSON.stringify(te)}`);
    }
    if (!memberIds.has(te.userId)) {
      throw new Error(`Referential error: TimeEntry '${te.timeEntryId}' references non-existent TeamMember '${te.userId}'`);
    }
    if (!taskIds.has(te.taskId)) {
      throw new Error(`Referential error: TimeEntry '${te.timeEntryId}' references non-existent Task '${te.taskId}'`);
    }
  }

  // 12. Notifications
  for (const n of d.notifications) {
    if (!n.notificationId || !n.userId || !validNotifTypes.has(n.type) || !validNotifSeverities.has(n.severity) || !n.message || !n.dedupeKey) {
      throw new Error(`Structural error in Notification: invalid fields in ${JSON.stringify(n)}`);
    }
    if (!memberIds.has(n.userId)) {
      throw new Error(`Referential error: Notification '${n.notificationId}' references non-existent TeamMember '${n.userId}'`);
    }
  }
}
