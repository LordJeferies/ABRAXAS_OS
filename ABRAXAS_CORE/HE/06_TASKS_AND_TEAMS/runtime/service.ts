import type {
  ActivityEntry,
  DeadlineEvaluation,
  Notification,
  TimeEntry,
  TimeReport,
  TimerSession,
  Approval,
  ApprovalDecision,
  ApprovalTargetType,
  Deadline,
  DeadlineTargetType,
  Dependency,
  DependencyKind,
  DependencyNodeType,
  DependencyOverride,
  RecordingLocationType,
  RecordingSession,
  SessionParticipant,
  Task,
  TaskAssignment,
  TaskPriority,
  TaskSchedule,
  TaskStatus,
  TargetRef,
  TeamMember
} from "./types.ts";
import {evaluateDeadline} from "./deadlines.ts";
import {assertPermission, hasPermission, SecurityError} from "./rbac.ts";
import {
  detectDependencyCycles,
  evaluateTaskDependencies,
  validateDependencyKindConstraints,
  validateTaskStateTransition
} from "./dependencies.ts";
import {validateRecordingSession} from "./recording.ts";
import {validateApprovalDecision} from "./approvals.ts";
import {calculateElapsedSeconds, validateTimeEntryInput, aggregateTimeReport} from "./time.ts";
import {generateOperationalNotifications} from "./notifications.ts";
import type {OperationsStore} from "./store.ts";
import {getCalendarProjection, getKanbanProjection, getSoloQueue, getTeamSnapshot} from "./projections.ts";

export type ClockProvider = () => string;
export type IdProvider = (prefix: string) => string;

const defaultClock: ClockProvider = () => new Date().toISOString();
let idCounter = 1;
const defaultIdProvider: IdProvider = (prefix: string) => `${prefix}_${Date.now()}_${idCounter++}`;

export class HeOperationsService {
  constructor(
    private store: OperationsStore,
    private clock: ClockProvider = defaultClock,
    private idProvider: IdProvider = defaultIdProvider
  ) {}

  // ==========================================
  // BOOTSTRAP
  // ==========================================
  bootstrapOwner(input: {userId: string; displayName: string; email?: string}): TeamMember {
    const existing = this.store.listTeamMembers();
    if (existing.length > 0) {
      throw new SecurityError("Bootstrap forbidden: Operations store has already been initialized with team members.");
    }

    const now = this.clock();
    const owner: TeamMember = {
      userId: input.userId,
      displayName: input.displayName,
      status: "ACTIVE",
      roles: ["OWNER"],
      email: input.email,
      createdAt: now
    };

    this.store.saveTeamMember(owner);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "BOOTSTRAP_INITIALIZED",
      actorId: input.userId,
      timestamp: now,
      targetRef: {targetType: "NONE_EXTERNAL", targetId: input.userId},
      details: `Initialized He Operations Core with Lead Owner '${input.userId}'`
    });

    return owner;
  }

  // ==========================================
  // TEAM MANAGEMENT
  // ==========================================
  addTeamMember(input: Omit<TeamMember, "createdAt">, actorId: string): TeamMember {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "team.manage", "add team member");

    const member: TeamMember = {
      ...input,
      createdAt: this.clock()
    };
    this.store.saveTeamMember(member);
    return member;
  }

  // ==========================================
  // TASK DOMAIN
  // ==========================================
  createTask(
    input: {
      title: string;
      description?: string;
      priority?: TaskPriority;
      targetRef?: TargetRef;
      schedule?: TaskSchedule;
    },
    actorId: string
  ): Task {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "task.create", "create task");

    if (!input.title || !input.title.trim()) {
      throw new Error("Task creation requires a non-empty title");
    }

    const now = this.clock();
    const taskId = this.idProvider("tsk");
    const status: TaskStatus = "BACKLOG";

    const task: Task = {
      taskId,
      version: 1,
      title: input.title.trim(),
      description: input.description,
      status,
      priority: input.priority ?? "MEDIUM",
      targetRef: input.targetRef,
      schedule: input.schedule,
      createdBy: actorId,
      createdAt: now,
      updatedAt: now
    };

    this.store.saveTask(task);
    this.syncNotifications();

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "TASK_CREATED",
      actorId,
      timestamp: now,
      targetRef: task.targetRef ?? {targetType: "TASK", targetId: taskId},
      afterState: status,
      details: task.title
    });

    this.syncNotifications();
    return task;
  }

  editTask(
    taskId: string,
    input: {
      title?: string;
      description?: string;
      priority?: TaskPriority;
      targetRef?: TargetRef;
      schedule?: TaskSchedule;
    },
    actorId: string
  ): Task {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "task.edit", "edit task");

    const task = this.store.getTask(taskId);
    if (!task) throw new Error(`Task '${taskId}' not found`);

    if (input.title !== undefined && !input.title.trim()) {
      throw new Error("Task edit title cannot be empty");
    }

    const now = this.clock();
    const updated: Task = {
      ...task,
      title: input.title !== undefined ? input.title.trim() : task.title,
      description: input.description !== undefined ? input.description : task.description,
      priority: input.priority !== undefined ? input.priority : task.priority,
      targetRef: input.targetRef !== undefined ? input.targetRef : task.targetRef,
      schedule: input.schedule !== undefined ? input.schedule : task.schedule,
      version: task.version + 1,
      updatedAt: now
    };

    this.store.saveTask(updated);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "TASK_UPDATED",
      actorId,
      timestamp: now,
      targetRef: updated.targetRef ?? {targetType: "TASK", targetId: taskId},
      details: `Updated task '${updated.title}'`
    });

    this.syncNotifications();
    return updated;
  }

  overrideDependency(
    taskId: string,
    dependencyId: string,
    reason: string,
    actorId: string
  ): DependencyOverride {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "task.override_dependency", "override dependency");

    const task = this.store.getTask(taskId);
    if (!task) throw new Error(`Task '${taskId}' not found`);

    const dep = this.store.getDependency(dependencyId);
    if (!dep) throw new Error(`Dependency '${dependencyId}' not found`);
    if (dep.downstreamId !== taskId) {
      throw new Error(`Dependency '${dependencyId}' does not target task '${taskId}'`);
    }

    if (!reason || !reason.trim()) {
      throw new Error("Dependency override requires a non-empty reason");
    }

    const now = this.clock();
    const override: DependencyOverride = {
      overrideId: this.idProvider("ovr"),
      actorId,
      dependencyId,
      targetTaskId: taskId,
      reason: reason.trim(),
      timestamp: now
    };

    this.store.saveOverride(override);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "OVERRIDE_APPLIED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "TASK", targetId: taskId},
      details: `Overrode dependency '${dependencyId}': ${reason.trim()}`
    });

    return override;
  }

  transitionTask(
    taskId: string,
    nextStatus: TaskStatus,
    actorId: string,
    overrideInput?: { dependencyId: string; reason: string }
  ): Task {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "task.change_state", "transition task status");

    const task = this.store.getTask(taskId);
    if (!task) throw new Error(`Task '${taskId}' not found`);

    if (overrideInput) {
      this.overrideDependency(taskId, overrideInput.dependencyId, overrideInput.reason, actorId);
    }

    const depEval = evaluateTaskDependencies(
      task,
      this.store.listTasks(),
      this.store.listDependencies(),
      this.store.listOverrides(),
      this.store.listApprovals(),
      this.store.listAssignments()
    );

    validateTaskStateTransition(task.status, nextStatus, depEval.isBlocked, false);

    const now = this.clock();
    const updated: Task = {
      ...task,
      status: nextStatus,
      version: task.version + 1,
      updatedAt: now
    };

    this.store.saveTask(updated);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "TASK_STATUS_CHANGED",
      actorId,
      timestamp: now,
      targetRef: task.targetRef ?? {targetType: "TASK", targetId: taskId},
      beforeState: task.status,
      afterState: nextStatus,
      details: `Status transitioned from ${task.status} to ${nextStatus}`
    });

    this.syncNotifications();
    return updated;
  }

  // ==========================================
  // ASSIGNMENTS
  // ==========================================
  assignTask(taskId: string, userId: string, actorId: string, roleOnTask?: string): TaskAssignment {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "task.assign", "assign task");

    const task = this.store.getTask(taskId);
    if (!task) throw new Error(`Cannot assign: Task '${taskId}' not found`);

    const member = this.store.getTeamMember(userId);
    if (!member) throw new Error(`Cannot assign: TeamMember '${userId}' not found`);
    if (member.status !== "ACTIVE") throw new Error(`Cannot assign: TeamMember '${userId}' is INACTIVE`);

    const existing = this.store.listAssignments().find(
      (a) => a.taskId === taskId && a.userId === userId && a.status === "ACTIVE"
    );
    if (existing) {
      throw new Error(`User '${userId}' is already actively assigned to task '${taskId}'`);
    }

    const now = this.clock();
    const asg: TaskAssignment = {
      assignmentId: this.idProvider("asg"),
      taskId,
      userId,
      roleOnTask,
      assignedBy: actorId,
      assignedAt: now,
      status: "ACTIVE"
    };

    this.store.saveAssignment(asg);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "TASK_ASSIGNED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "TASK", targetId: taskId},
      afterState: userId,
      details: `Assigned user '${member.displayName}' (${userId})`
    });

    this.syncNotifications();
    return asg;
  }

  unassignTask(assignmentId: string, actorId: string): void {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "task.assign", "unassign task");

    const asg = this.store.getAssignment(assignmentId);
    if (!asg) throw new Error(`Assignment '${assignmentId}' not found`);

    this.store.removeAssignment(assignmentId);

    const now = this.clock();
    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "TASK_UNASSIGNED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "TASK", targetId: asg.taskId},
      beforeState: asg.userId,
      details: `Removed assignment of user '${asg.userId}'`
    });
  }

  // ==========================================
  // DEPENDENCIES
  // ==========================================
  createDependency(
    input: {
      upstreamType: DependencyNodeType;
      upstreamId: string;
      downstreamType: DependencyNodeType;
      downstreamId: string;
      dependencyKind: DependencyKind;
    },
    actorId: string
  ): Dependency {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "task.edit", "create dependency");

    const now = this.clock();
    const dep: Dependency = {
      dependencyId: this.idProvider("dep"),
      upstreamType: input.upstreamType,
      upstreamId: input.upstreamId,
      downstreamType: input.downstreamType,
      downstreamId: input.downstreamId,
      dependencyKind: input.dependencyKind,
      createdBy: actorId,
      createdAt: now
    };

    validateDependencyKindConstraints(dep);
    detectDependencyCycles(dep, this.store.listDependencies());
    this.store.saveDependency(dep);
    this.syncNotifications();

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "DEPENDENCY_CREATED",
      actorId,
      timestamp: now,
      targetRef: {targetType: input.downstreamType as any, targetId: input.downstreamId},
      details: `Created ${input.dependencyKind} dependency from ${input.upstreamType}:${input.upstreamId}`
    });

    this.syncNotifications();
    return dep;
  }

  removeDependency(dependencyId: string, actorId: string): void {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "task.edit", "remove dependency");

    const dep = this.store.getDependency(dependencyId);
    if (!dep) throw new Error(`Dependency '${dependencyId}' not found`);

    this.store.removeDependency(dependencyId);

    const now = this.clock();
    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "DEPENDENCY_REMOVED",
      actorId,
      timestamp: now,
      targetRef: {targetType: dep.downstreamType as any, targetId: dep.downstreamId},
      details: `Removed dependency '${dependencyId}'`
    });
  }

  // ==========================================
  // DEADLINES
  // ==========================================
  setDeadline(
    input: {
      targetType: DeadlineTargetType;
      targetId: string;
      dueAt: string;
      timezone: string;
      source?: string;
      notes?: string;
    },
    actorId: string
  ): Deadline {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "deadline.create", "set deadline");

    const now = this.clock();
    const deadline: Deadline = {
      deadlineId: this.idProvider("dl"),
      targetType: input.targetType,
      targetId: input.targetId,
      dueAt: input.dueAt,
      timezone: input.timezone,
      status: "ACTIVE",
      source: input.source,
      notes: input.notes,
      createdBy: actorId,
      createdAt: now
    };

    this.store.saveDeadline(deadline);
    this.syncNotifications();

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "DEADLINE_CREATED",
      actorId,
      timestamp: now,
      targetRef: {targetType: input.targetType as any, targetId: input.targetId},
      afterState: input.dueAt,
      details: `Set deadline for ${input.targetType} ${input.targetId}`
    });

    this.syncNotifications();
    return deadline;
  }

  updateDeadline(
    deadlineId: string,
    input: {dueAt?: string; timezone?: string; status?: Deadline["status"]; notes?: string},
    actorId: string
  ): Deadline {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "deadline.edit", "update deadline");

    const deadline = this.store.getDeadline(deadlineId);
    if (!deadline) throw new Error(`Deadline '${deadlineId}' not found`);

    const now = this.clock();
    const updated: Deadline = {
      ...deadline,
      dueAt: input.dueAt ?? deadline.dueAt,
      timezone: input.timezone ?? deadline.timezone,
      status: input.status ?? deadline.status,
      notes: input.notes ?? deadline.notes
    };

    this.store.saveDeadline(updated);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "DEADLINE_UPDATED",
      actorId,
      timestamp: now,
      targetRef: {targetType: deadline.targetType as any, targetId: deadline.targetId},
      beforeState: deadline.dueAt,
      afterState: updated.dueAt,
      details: `Updated deadline '${deadlineId}'`
    });

    this.syncNotifications();
    return updated;
  }

  // ==========================================
  // RECORDING SESSIONS
  // ==========================================
  createRecordingSession(
    input: {
      title: string;
      startsAt: string;
      endsAt: string;
      timezone: string;
      locationType: RecordingLocationType;
      locationDetails?: string;
      people: readonly SessionParticipant[];
      relatedLienzoIds?: readonly string[];
      relatedTaskIds?: readonly string[];
      preparationTaskIds?: readonly string[];
      notes?: string;
    },
    actorId: string
  ): RecordingSession {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "recording.create", "create recording session");

    const now = this.clock();
    const session: RecordingSession = {
      recordingSessionId: this.idProvider("rec"),
      version: 1,
      title: input.title.trim(),
      status: "DRAFT",
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      timezone: input.timezone,
      locationType: input.locationType,
      locationDetails: input.locationDetails,
      people: input.people,
      relatedLienzoIds: input.relatedLienzoIds ?? [],
      relatedTaskIds: input.relatedTaskIds ?? [],
      preparationTaskIds: input.preparationTaskIds ?? [],
      notes: input.notes,
      createdBy: actorId,
      createdAt: now
    };

    validateRecordingSession(session);
    this.store.saveRecordingSession(session);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "RECORDING_CREATED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "RECORDING_SESSION", targetId: session.recordingSessionId},
      afterState: "DRAFT",
      details: session.title
    });

    this.syncNotifications();
    return session;
  }

  editRecordingSession(
    sessionId: string,
    input: Partial<Omit<RecordingSession, "recordingSessionId" | "version" | "createdBy" | "createdAt">>,
    actorId: string
  ): RecordingSession {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "recording.edit", "edit recording session");

    const session = this.store.getRecordingSession(sessionId);
    if (!session) throw new Error(`RecordingSession '${sessionId}' not found`);

    const updated: RecordingSession = {
      ...session,
      ...input,
      version: session.version + 1
    };

    validateRecordingSession(updated);
    this.store.saveRecordingSession(updated);

    const now = this.clock();
    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "RECORDING_UPDATED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "RECORDING_SESSION", targetId: sessionId},
      details: `Updated recording session '${updated.title}'`
    });

    this.syncNotifications();
    return updated;
  }

  confirmRecordingSession(sessionId: string, actorId: string): RecordingSession {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "recording.confirm", "confirm recording session");

    const session = this.store.getRecordingSession(sessionId);
    if (!session) throw new Error(`RecordingSession '${sessionId}' not found`);

    const updated: RecordingSession = {
      ...session,
      status: "CONFIRMED",
      version: session.version + 1
    };

    this.store.saveRecordingSession(updated);

    const now = this.clock();
    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "RECORDING_CONFIRMED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "RECORDING_SESSION", targetId: sessionId},
      beforeState: session.status,
      afterState: "CONFIRMED",
      details: `Confirmed recording session '${session.title}'`
    });

    this.syncNotifications();
    return updated;
  }

  cancelRecordingSession(sessionId: string, actorId: string): RecordingSession {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "recording.edit", "cancel recording session");

    const session = this.store.getRecordingSession(sessionId);
    if (!session) throw new Error(`RecordingSession '${sessionId}' not found`);

    const updated: RecordingSession = {
      ...session,
      status: "CANCELLED",
      version: session.version + 1
    };

    this.store.saveRecordingSession(updated);

    const now = this.clock();
    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "RECORDING_CANCELLED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "RECORDING_SESSION", targetId: sessionId},
      beforeState: session.status,
      afterState: "CANCELLED",
      details: `Cancelled recording session '${session.title}'`
    });

    this.syncNotifications();
    return updated;
  }

  // ==========================================
  // APPROVALS
  // ==========================================
  requestApproval(
    input: {
      targetType: ApprovalTargetType;
      targetId: string;
      reviewers: readonly string[];
      comments?: string;
    },
    actorId: string
  ): Approval {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "approval.request", "request approval");

    if (input.reviewers.length === 0) {
      throw new Error("Approval request requires at least one designated reviewer");
    }

    const reviewerSet = new Set<string>();
    for (const rId of input.reviewers) {
      if (reviewerSet.has(rId)) {
        throw new Error(`Duplicate reviewer '${rId}' in approval request`);
      }
      reviewerSet.add(rId);

      const rMember = this.store.getTeamMember(rId);
      if (!rMember) {
        throw new Error(`Reviewer '${rId}' does not exist`);
      }
      if (rMember.status !== "ACTIVE") {
        throw new Error(`Reviewer '${rId}' is INACTIVE`);
      }
    }

    const now = this.clock();
    const approval: Approval = {
      approvalId: this.idProvider("app"),
      version: 1,
      targetType: input.targetType,
      targetId: input.targetId,
      requestedBy: actorId,
      reviewers: input.reviewers,
      decision: "PENDING",
      comments: input.comments,
      requestedAt: now
    };

    this.store.saveApproval(approval);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "APPROVAL_REQUESTED",
      actorId,
      timestamp: now,
      targetRef: {targetType: input.targetType as any, targetId: input.targetId},
      afterState: "PENDING",
      details: `Requested review from ${input.reviewers.join(", ")}`
    });

    this.syncNotifications();
    return approval;
  }

  decideApproval(
    approvalId: string,
    decision: ApprovalDecision,
    actorId: string,
    comments?: string
  ): Approval {
    const actor = this.store.getTeamMember(actorId);
    if (!actor) throw new SecurityError(`Unknown actor '${actorId}'`);

    const approval = this.store.getApproval(approvalId);
    if (!approval) throw new Error(`Approval '${approvalId}' not found`);

    const now = this.clock();
    const decided = validateApprovalDecision(approval, decision, actor, now, comments);
    this.store.saveApproval(decided);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "APPROVAL_DECIDED",
      actorId,
      timestamp: now,
      targetRef: {targetType: approval.targetType as any, targetId: approval.targetId},
      beforeState: approval.decision,
      afterState: decision,
      details: comments ?? `Decided ${decision}`
    });

    return decided;
  }

  cancelApproval(approvalId: string, actorId: string): Approval {
    const actor = this.store.getTeamMember(actorId);
    const approval = this.store.getApproval(approvalId);
    if (!approval) throw new Error(`Approval '${approvalId}' not found`);

    const isRequester = approval.requestedBy === actorId;
    const hasDecideAny = hasPermission(actor, "approval.decide_any");

    if (!isRequester && !hasDecideAny) {
      throw new SecurityError(`Actor '${actorId}' is neither the original requester nor an authorized supervisor to cancel approval '${approvalId}'.`);
    }

    const now = this.clock();
    const cancelled: Approval = {
      ...approval,
      decision: "CANCELLED",
      decidedAt: now,
      decidedBy: actorId,
      version: approval.version + 1
    };

    this.store.saveApproval(cancelled);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "APPROVAL_CANCELLED",
      actorId,
      timestamp: now,
      targetRef: {targetType: approval.targetType as any, targetId: approval.targetId},
      beforeState: approval.decision,
      afterState: "CANCELLED",
      details: "Approval request cancelled"
    });

    return cancelled;
  }

  // ==========================================
  // READ & QUERY METHODS (PRODUCT API)
  // ==========================================
  getTeamMembers(): readonly TeamMember[] {
    return this.store.listTeamMembers();
  }

  getTeamMember(userId: string): TeamMember | undefined {
    return this.store.getTeamMember(userId);
  }

  getTasks(): readonly Task[] {
    return this.store.listTasks();
  }

  getTask(taskId: string): Task | undefined {
    return this.store.getTask(taskId);
  }

  getAssignments(): readonly TaskAssignment[] {
    return this.store.listAssignments();
  }

  getDeadlines(): readonly Deadline[] {
    return this.store.listDeadlines();
  }

  getRecordingSessions(): readonly RecordingSession[] {
    return this.store.listRecordingSessions();
  }

  getApprovals(): readonly Approval[] {
    return this.store.listApprovals();
  }

  getActivity(): readonly ActivityEntry[] {
    return this.store.listActivity();
  }

  getDependencies(): readonly Dependency[] {
    return this.store.listDependencies();
  }

  getOverrides(): readonly DependencyOverride[] {
    return this.store.listOverrides();
  }

  // ==========================================
  // P3B: TIME TRACKING COMMANDS & QUERIES
  // ==========================================
  startTimer(taskId: string, actorId: string, note?: string): TimerSession {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "time.track", "start active timer");

    const task = this.store.getTask(taskId);
    if (!task) throw new Error(`Cannot start timer: Task '${taskId}' not found`);

    const existingActive = this.store.getActiveTimerSession(actorId);
    if (existingActive) {
      throw new Error(`User '${actorId}' already has an active timer session '${existingActive.timerId}' (${existingActive.status})`);
    }

    const now = this.clock();
    const session: TimerSession = {
      timerId: this.idProvider("tmr"),
      userId: actorId,
      taskId,
      status: "RUNNING",
      startedAt: now,
      lastResumedAt: now,
      accumulatedSeconds: 0,
      updatedAt: now
    };

    this.store.saveTimerSession(session);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "TIME_TIMER_STARTED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "TASK", targetId: taskId},
      afterState: session.status,
      details: note ?? `Started timer for task '${task.title}'`
    });

    this.syncNotifications();
    return session;
  }

  pauseTimer(timerId: string, actorId: string): TimerSession {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "time.track", "pause timer");

    const session = this.store.getTimerSession(timerId);
    if (!session) throw new Error(`Timer session '${timerId}' not found`);

    if (session.userId !== actorId && !hasPermission(actor, "time.edit")) {
      throw new SecurityError(`Actor '${actorId}' cannot pause another member's timer`);
    }

    if (session.status !== "RUNNING") {
      throw new Error(`Cannot pause timer '${timerId}': status is already '${session.status}'`);
    }

    const now = this.clock();
    const elapsed = calculateElapsedSeconds(session, now);
    const updated: TimerSession = {
      ...session,
      status: "PAUSED",
      accumulatedSeconds: elapsed,
      lastResumedAt: now,
      updatedAt: now
    };

    this.store.saveTimerSession(updated);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "TIME_TIMER_PAUSED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "TASK", targetId: session.taskId},
      afterState: "PAUSED",
      details: `Paused timer at ${elapsed}s`
    });

    this.syncNotifications();
    return updated;
  }

  resumeTimer(timerId: string, actorId: string): TimerSession {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "time.track", "resume timer");

    const session = this.store.getTimerSession(timerId);
    if (!session) throw new Error(`Timer session '${timerId}' not found`);

    if (session.userId !== actorId && !hasPermission(actor, "time.edit")) {
      throw new SecurityError(`Actor '${actorId}' cannot resume another member's timer`);
    }

    if (session.status !== "PAUSED") {
      throw new Error(`Cannot resume timer '${timerId}': status is currently '${session.status}'`);
    }

    const now = this.clock();
    const updated: TimerSession = {
      ...session,
      status: "RUNNING",
      lastResumedAt: now,
      updatedAt: now
    };

    this.store.saveTimerSession(updated);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "TIME_TIMER_RESUMED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "TASK", targetId: session.taskId},
      afterState: "RUNNING",
      details: "Resumed timer"
    });

    this.syncNotifications();
    return updated;
  }

  stopTimer(timerId: string, actorId: string, note?: string): TimeEntry {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "time.track", "stop timer");

    const session = this.store.getTimerSession(timerId);
    if (!session) throw new Error(`Timer session '${timerId}' not found`);

    if (session.userId !== actorId && !hasPermission(actor, "time.edit")) {
      throw new SecurityError(`Actor '${actorId}' cannot stop another member's timer`);
    }

    const now = this.clock();
    const totalDuration = calculateElapsedSeconds(session, now);

    const task = this.store.getTask(session.taskId);
    const entry: TimeEntry = {
      timeEntryId: this.idProvider("te"),
      userId: session.userId,
      taskId: session.taskId,
      contentId: task?.targetRef?.targetId,
      startedAt: session.startedAt,
      endedAt: now,
      durationSeconds: Math.max(0, totalDuration),
      source: "TIMER",
      note: note ?? "Timer completed",
      createdAt: now
    };

    const act1: ActivityEntry = {
      activityId: this.idProvider("act"),
      entryType: "TIME_TIMER_STOPPED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "TASK", targetId: session.taskId},
      details: `Stopped timer with duration ${totalDuration}s`
    };

    const act2: ActivityEntry = {
      activityId: this.idProvider("act"),
      entryType: "TIME_ENTRY_CREATED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "TASK", targetId: session.taskId},
      afterState: entry.durationSeconds,
      details: `Recorded ${totalDuration}s time entry`
    };

    if (this.store.atomicCompleteTimer) {
      this.store.atomicCompleteTimer(timerId, entry, [act1, act2]);
    } else {
      this.store.removeTimerSession(timerId);
      this.store.saveTimeEntry(entry);
      this.store.recordActivity(act1);
      this.store.recordActivity(act2);
    }

    return entry;
  }

  addManualTimeEntry(
    input: {
      taskId: string;
      userId?: string;
      durationSeconds: number;
      startedAt?: string;
      endedAt?: string;
      note?: string;
      contentId?: string;
    },
    actorId: string
  ): TimeEntry {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "time.manual", "add manual time entry");

    const targetUserId = input.userId ?? actorId;
    if (targetUserId !== actorId && !hasPermission(actor, "time.edit")) {
      throw new SecurityError(`Actor '${actorId}' lacks permission 'time.edit' to add time entry for user '${targetUserId}'`);
    }

    const targetMember = this.store.getTeamMember(targetUserId);
    if (!targetMember) throw new Error(`User '${targetUserId}' not found`);
    if (targetMember.status !== "ACTIVE") throw new Error(`User '${targetUserId}' is INACTIVE`);

    const task = this.store.getTask(input.taskId);
    if (!task) throw new Error(`Task '${input.taskId}' not found`);

    validateTimeEntryInput(input);

    const now = this.clock();
    const entry: TimeEntry = {
      timeEntryId: this.idProvider("te"),
      userId: targetUserId,
      taskId: input.taskId,
      contentId: input.contentId ?? task.targetRef?.targetId,
      startedAt: input.startedAt ?? now,
      endedAt: input.endedAt,
      durationSeconds: input.durationSeconds,
      source: "MANUAL",
      note: input.note,
      createdAt: now
    };

    this.store.saveTimeEntry(entry);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "TIME_ENTRY_CREATED",
      actorId,
      timestamp: now,
      targetRef: {targetType: "TASK", targetId: input.taskId},
      afterState: entry.durationSeconds,
      details: input.note ?? `Manual time entry of ${entry.durationSeconds}s for user '${targetUserId}'`
    });

    return entry;
  }

  getTimeReport(actorId: string, filter?: {userId?: string; taskId?: string; fromDate?: string; toDate?: string}): TimeReport {
    const actor = this.store.getTeamMember(actorId);
    if (!actor || actor.status !== "ACTIVE") {
      throw new SecurityError(`Actor '${actorId}' is unknown or inactive`);
    }

    const isOwnOnly = filter?.userId === actorId;
    const isTargetingOther = filter?.userId && filter.userId !== actorId;
    const isTeamWide = !filter?.userId;

    if (isOwnOnly) {
      if (!hasPermission(actor, "time.view_own") && !hasPermission(actor, "time.view_team")) {
        throw new SecurityError(`Actor '${actorId}' lacks permission 'time.view_own'`);
      }
    } else if (isTargetingOther || isTeamWide) {
      if (!hasPermission(actor, "time.view_team")) {
        throw new SecurityError(`Actor '${actorId}' lacks permission 'time.view_team' to view other members or team reports`);
      }
    }

    return aggregateTimeReport(this.store.listTimeEntries(), this.store.listTasks(), filter);
  }

  getTimeEntries(actorId: string): readonly TimeEntry[] {
    const actor = this.store.getTeamMember(actorId);
    if (!actor || actor.status !== "ACTIVE") {
      throw new SecurityError(`Actor '${actorId}' is unknown or inactive`);
    }
    if (hasPermission(actor, "time.view_team")) {
      return this.store.listTimeEntries();
    }
    if (hasPermission(actor, "time.view_own")) {
      return this.store.listTimeEntries().filter((e) => e.userId === actorId);
    }
    throw new SecurityError(`Actor '${actorId}' lacks permission 'time.view_own' or 'time.view_team'`);
  }

  getDeadlineEvaluations(): readonly DeadlineEvaluation[] {
    const now = this.clock();
    const allTasks = this.store.listTasks();
    const allDeps = this.store.listDependencies();
    const allOverrides = this.store.listOverrides();
    const allApps = this.store.listApprovals();
    const allAsgs = this.store.listAssignments();

    return this.store.listDeadlines().map((dl) => {
      const targetTask = dl.targetType === "TASK" ? this.store.getTask(dl.targetId) : undefined;
      return evaluateDeadline(dl, targetTask, allTasks, allDeps, allOverrides, allApps, allAsgs, now);
    });
  }

  getDeadlineEvaluation(deadlineId: string): DeadlineEvaluation | undefined {
    const dl = this.store.getDeadline(deadlineId);
    if (!dl) return undefined;
    const now = this.clock();
    const targetTask = dl.targetType === "TASK" ? this.store.getTask(dl.targetId) : undefined;
    return evaluateDeadline(
      dl,
      targetTask,
      this.store.listTasks(),
      this.store.listDependencies(),
      this.store.listOverrides(),
      this.store.listApprovals(),
      this.store.listAssignments(),
      now
    );
  }

  getActiveTimerSession(userId: string): TimerSession | undefined {
    return this.store.getActiveTimerSession(userId);
  }

  listTimerSessions(): readonly TimerSession[] {
    return this.store.listTimerSessions();
  }

  // ==========================================
  // P3B: NOTIFICATION COMMANDS & QUERIES
  // ==========================================
  syncNotifications(): readonly Notification[] {
    const now = this.clock();
    const generated = generateOperationalNotifications(this.store, now, this.idProvider);
    for (const n of generated) {
      this.store.saveNotification(n);
      this.store.recordActivity({
        activityId: this.idProvider("act"),
        entryType: "NOTIFICATION_CREATED",
        actorId: "system",
        timestamp: now,
        targetRef: n.targetRef,
        details: n.message
      });
    }
    return this.store.listNotifications();
  }

  getNotifications(userId: string, unreadOnly = false): readonly Notification[] {
    const all = this.store.listNotifications().filter((n) => n.userId === userId);
    return unreadOnly ? all.filter((n) => !n.readAt) : all;
  }

  markNotificationRead(notificationId: string, actorId: string): Notification {
    const notif = this.store.getNotification(notificationId);
    if (!notif) throw new Error(`Notification '${notificationId}' not found`);

    const actor = this.store.getTeamMember(actorId);
    if (notif.userId !== actorId && !hasPermission(actor, "team.manage")) {
      throw new SecurityError(`Actor '${actorId}' cannot mark notification for user '${notif.userId}'`);
    }

    const now = this.clock();
    const updated: Notification = {
      ...notif,
      readAt: now
    };

    this.store.saveNotification(updated);

    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "NOTIFICATION_READ",
      actorId,
      timestamp: now,
      targetRef: notif.targetRef,
      details: `Marked notification '${notificationId}' as read`
    });

    this.syncNotifications();
    return updated;
  }

  markAllNotificationsRead(userId: string, actorId: string): void {
    const actor = this.store.getTeamMember(actorId);
    if (userId !== actorId && !hasPermission(actor, "team.manage")) {
      throw new SecurityError(`Actor '${actorId}' cannot mark notifications for user '${userId}'`);
    }

    const now = this.clock();
    const unread = this.store.listNotifications().filter((n) => n.userId === userId && !n.readAt);
    for (const n of unread) {
      this.store.saveNotification({...n, readAt: now});
    }

    if (unread.length > 0) {
      this.store.recordActivity({
        activityId: this.idProvider("act"),
        entryType: "NOTIFICATION_READ",
        actorId,
        timestamp: now,
        targetRef: {targetType: "TASK", targetId: "bulk"},
        details: `Marked ${unread.length} notifications as read for user '${userId}'`
      });
    }
  }

  // ==========================================
  // PROJECTIONS
  // ==========================================

  editDeadline(
    deadlineId: string,
    input: {dueAt?: string; timezone?: string},
    actorId: string
  ): Deadline {
    const actor = this.store.getTeamMember(actorId);
    assertPermission(actor, "deadline.edit", "edit deadline");

    const existing = this.store.getDeadline(deadlineId);
    if (!existing) throw new Error(`Deadline '${deadlineId}' not found`);

    const now = this.clock();
    const updated: Deadline = {
      ...existing,
      dueAt: input.dueAt ?? existing.dueAt,
      timezone: input.timezone ?? existing.timezone
    };

    this.store.saveDeadline(updated);
    this.store.recordActivity({
      activityId: this.idProvider("act"),
      entryType: "DEADLINE_UPDATED",
      actorId,
      timestamp: now,
      targetRef: {targetType: updated.targetType as any, targetId: updated.targetId},
      details: `Updated deadline to ${updated.dueAt}`
    });

    this.syncNotifications();
    return updated;
  }



  getSoloQueue(userId: string, nowIso?: string) {
    return getSoloQueue(
      userId,
      this.store.listTasks(),
      this.store.listAssignments(),
      this.store.listDependencies(),
      this.store.listOverrides(),
      this.store.listDeadlines(),
      this.store.listApprovals(),
      nowIso ?? this.clock()
    );
  }

  getTeamSnapshot(nowIso?: string) {
    return getTeamSnapshot(
      this.store.listTeamMembers(),
      this.store.listTasks(),
      this.store.listAssignments(),
      this.store.listDependencies(),
      this.store.listOverrides(),
      this.store.listDeadlines(),
      this.store.listRecordingSessions(),
      this.store.listApprovals(),
      nowIso ?? this.clock()
    );
  }

  getKanbanProjection(nowIso?: string) {
    return getKanbanProjection(
      this.store.listTasks(),
      this.store.listTeamMembers(),
      this.store.listAssignments(),
      this.store.listDependencies(),
      this.store.listOverrides(),
      this.store.listDeadlines(),
      this.store.listApprovals(),
      nowIso ?? this.clock()
    );
  }

  getCalendarProjection(
    externalPubs: readonly {targetId: string; title: string; scheduledAt: string; timezone: string}[] = [],
    nowIso?: string
  ) {
    return getCalendarProjection(
      this.store.listTasks(),
      this.store.listRecordingSessions(),
      this.store.listDeadlines(),
      externalPubs,
      nowIso ?? this.clock()
    );
  }
}
