export type TeamRole = "OWNER" | "MANAGER" | "EDITOR" | "DIRECTOR" | "TALENT" | "VIEWER" | "DESIGNER" | "CUSTOM";
export type MemberStatus = "ACTIVE" | "INACTIVE";

export type Permission =
  | "task.create"
  | "task.edit"
  | "task.assign"
  | "task.change_state"
  | "task.override_dependency"
  | "task.review"
  | "deadline.create"
  | "deadline.edit"
  | "recording.create"
  | "recording.edit"
  | "recording.confirm"
  | "approval.request"
  | "approval.decide"
  | "approval.decide_any"
  | "team.view"
  | "team.manage"
  | "lienzo.view"
  | "lienzo.edit"
  | "publication.view"
  | "publication.schedule"
  | "metrics.view"
  | "provider.configure"
  | "time.track"
  | "time.manual"
  | "time.view_own"
  | "time.view_team"
  | "time.edit";

export type TeamMember = {
  userId: string;
  displayName: string;
  email?: string | undefined;
  roles: readonly TeamRole[];
  customPermissions?: readonly Permission[] | undefined;
  status: MemberStatus;
  createdAt: string;
  updatedAt?: string | undefined;
};

export type TaskStatus =
  | "BACKLOG"
  | "READY"
  | "IN_PROGRESS"
  | "REVIEW"
  | "BLOCKED"
  | "DONE"
  | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskTargetType =
  | "PLAN"
  | "LIENZO"
  | "COMPONENT"
  | "RECORDING_SESSION"
  | "PUBLICATION_TARGET"
  | "TASK"
  | "EDIT_LOCK"
  | "MOTION_PLAN"
  | "LIENZO_COMPONENT"
  | "COPY_VERSION"
  | "COVER_VERSION"
  | "NONE_EXTERNAL";

export type TargetRef = {
  targetType: TaskTargetType;
  targetId: string;
  component?: string | undefined;
  version?: number | undefined;
};

export type TaskSchedule = {
  scheduledStartAt?: string | undefined;
  scheduledEndAt?: string | undefined;
  timezone?: string | undefined;
};

export type Task = {
  taskId: string;
  version: number;
  title: string;
  description?: string | undefined;
  status: TaskStatus;
  priority: TaskPriority;
  targetRef?: TargetRef | undefined;
  schedule?: TaskSchedule | undefined;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type AssignmentStatus = "ACTIVE" | "COMPLETED" | "REMOVED";

export type TaskAssignment = {
  assignmentId: string;
  taskId: string;
  userId: string;
  roleOnTask?: string | undefined;
  assignedBy: string;
  assignedAt: string;
  status: AssignmentStatus;
};

export type DependencyKind =
  | "BLOCKS"
  | "REQUIRES_APPROVAL"
  | "REQUIRES_COMPLETION"
  | "INFORMATIONAL";

export type DependencyNodeType =
  | "TASK"
  | "LIENZO_COMPONENT"
  | "COPY_VERSION"
  | "COVER_VERSION"
  | "EDIT_LOCK"
  | "MOTION_PLAN"
  | "PUBLICATION_TARGET"
  | "PLAN"
  | "LIENZO"
  | "COMPONENT"
  | "RECORDING_SESSION";

export type Dependency = {
  dependencyId: string;
  upstreamType: DependencyNodeType;
  upstreamId: string;
  downstreamType: DependencyNodeType;
  downstreamId: string;
  dependencyKind: DependencyKind;
  createdBy: string;
  createdAt: string;
};

export type DependencyOverride = {
  overrideId: string;
  actorId: string;
  dependencyId: string;
  targetTaskId: string;
  reason: string;
  timestamp: string;
};

export type DeadlineTargetType =
  | "PLAN"
  | "LIENZO"
  | "COMPONENT"
  | "TASK"
  | "RECORDING_SESSION"
  | "PUBLICATION_TARGET";

export type DeadlineStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export type DeadlineRiskState =
  | "ON_TRACK"
  | "AT_RISK"
  | "DUE_SOON"
  | "OVERDUE"
  | "COMPLETED";

export type Deadline = {
  deadlineId: string;
  targetType: DeadlineTargetType;
  targetId: string;
  dueAt: string;
  timezone: string;
  status: DeadlineStatus;
  source?: string | undefined;
  notes?: string | undefined;
  createdBy: string;
  createdAt: string;
};

export type DeadlineEvaluation = {
  deadlineId: string;
  targetType: DeadlineTargetType;
  targetId: string;
  dueAt: string;
  riskState: DeadlineRiskState;
  riskReasons: readonly string[];
  hoursRemaining: number;
};

export type RecordingLocationType = "PHYSICAL" | "REMOTE" | "TBD";

export type SessionParticipant = {
  userId: string;
  role: string;
};

export type RecordingSessionStatus =
  | "DRAFT"
  | "PROPOSED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type RecordingSession = {
  recordingSessionId: string;
  version: number;
  title: string;
  status: RecordingSessionStatus;
  startsAt: string;
  endsAt: string;
  timezone: string;
  locationType: RecordingLocationType;
  locationDetails?: string | undefined;
  people: readonly SessionParticipant[];
  relatedLienzoIds: readonly string[];
  relatedTaskIds: readonly string[];
  preparationTaskIds: readonly string[];
  notes?: string | undefined;
  createdBy: string;
  createdAt: string;
};

export type ApprovalTargetType =
  | "TASK"
  | "LIENZO_COMPONENT"
  | "COPY_VERSION"
  | "COVER_VERSION"
  | "EDIT_LOCK"
  | "MOTION_PLAN"
  | "PUBLICATION_TARGET";

export type ApprovalDecision =
  | "PENDING"
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "REJECTED"
  | "CANCELLED";

export type Approval = {
  approvalId: string;
  version: number;
  targetType: ApprovalTargetType;
  targetId: string;
  reviewers: readonly string[];
  decision: ApprovalDecision;
  comments?: string | undefined;
  requestedBy: string;
  requestedAt: string;
  decidedBy?: string | undefined;
  decidedAt?: string | undefined;
};

export type ActivityEntryType =
  | "BOOTSTRAP_INITIALIZED"
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_ASSIGNED"
  | "TASK_UNASSIGNED"
  | "TASK_STATUS_CHANGED"
  | "DEPENDENCY_CREATED"
  | "DEPENDENCY_REMOVED"
  | "DEADLINE_CREATED"
  | "DEADLINE_UPDATED"
  | "RECORDING_CREATED"
  | "RECORDING_UPDATED"
  | "RECORDING_CONFIRMED"
  | "RECORDING_CANCELLED"
  | "APPROVAL_REQUESTED"
  | "APPROVAL_DECIDED"
  | "APPROVAL_CANCELLED"
  | "OVERRIDE_APPLIED"
  | "TIME_TIMER_STARTED"
  | "TIME_TIMER_PAUSED"
  | "TIME_TIMER_RESUMED"
  | "TIME_TIMER_STOPPED"
  | "TIME_ENTRY_CREATED"
  | "NOTIFICATION_CREATED"
  | "NOTIFICATION_READ";

export type ActivityEntry = {
  activityId: string;
  entryType: ActivityEntryType;
  actorId: string;
  timestamp: string;
  targetRef: TargetRef;
  beforeState?: unknown;
  afterState?: unknown;
  details?: string | undefined;
};

export type TimerStatus = "RUNNING" | "PAUSED";
export type TimeSource = "MANUAL" | "TIMER" | "INTEGRATION";

export type TimerSession = {
  timerId: string;
  userId: string;
  taskId: string;
  status: TimerStatus;
  startedAt: string;
  lastResumedAt: string;
  accumulatedSeconds: number;
  updatedAt: string;
};

export type TimeEntry = {
  timeEntryId: string;
  userId: string;
  taskId: string;
  contentId?: string | undefined;
  startedAt: string;
  endedAt?: string | undefined;
  durationSeconds: number;
  source: TimeSource;
  note?: string | undefined;
  createdAt: string;
};

export type TimeReport = {
  totalSeconds: number;
  entryCount: number;
  breakdownByUser: Record<string, number>;
  breakdownByTask: Record<string, number>;
  breakdownByTarget: Record<string, number>;
  entries: readonly TimeEntry[];
};

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_COMPLETED"
  | "DEADLINE_APPROACHING"
  | "DEADLINE_MISSED"
  | "REVIEW_REQUESTED"
  | "APPROVAL_REQUESTED"
  | "APPROVAL_DECIDED"
  | "DEPENDENCY_RESOLVED"
  | "TASK_BLOCKED"
  | "WAITING_FOR_YOU"
  | "RECORDING_UPCOMING"
  | "RECORDING_REMINDER";

export type NotificationSeverity = "INFO" | "WARNING" | "URGENT";

export type Notification = {
  notificationId: string;
  userId: string;
  type: NotificationType;
  targetRef: TargetRef;
  createdAt: string;
  readAt?: string | undefined;
  severity: NotificationSeverity;
  message: string;
  dedupeKey: string;
};

// ==========================================
// PROJECTION TYPES
// ==========================================
export type SoloQueue = {
  userId: string;
  generatedAt: string;
  inProgress: readonly Task[];
  next: readonly Task[];
  reviewRequired: readonly Task[];
  blocked: readonly Task[];
  dueSoon: readonly Task[];
  overdue: readonly Task[];
  pendingApprovalsForUser: readonly Approval[];
};

export type ActiveTaskSummary = {
  taskId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export type MemberWorkload = {
  userId: string;
  displayName: string;
  activeTaskCount: number;
  blockedTaskCount: number;
  overdueTaskCount: number;
  activeTasks: readonly ActiveTaskSummary[];
};

export type BlockedWorkItem = {
  taskId: string;
  taskTitle: string;
  assigneeIds: readonly string[];
  waitingForTaskIds: readonly string[];
  waitingForUserIds: readonly string[];
  reasons: readonly string[];
};

export type TeamSnapshot = {
  generatedAt: string;
  memberWorkload: readonly MemberWorkload[];
  blockedWork: readonly BlockedWorkItem[];
  overdueTasks: readonly Task[];
  dueSoonTasks: readonly Task[];
  pendingApprovals: readonly Approval[];
  upcomingRecordingSessions: readonly RecordingSession[];
};

export type KanbanCard = {
  task: Task;
  assignees: readonly TeamMember[];
  isBlocked: boolean;
  waitingFor: readonly string[];
  deadlineRisk?: DeadlineRiskState | undefined;
};

export type KanbanProjection = {
  backlog: readonly KanbanCard[];
  ready: readonly KanbanCard[];
  inProgress: readonly KanbanCard[];
  review: readonly KanbanCard[];
  blocked: readonly KanbanCard[];
  done: readonly KanbanCard[];
};

export type CalendarItemType = "TASK" | "RECORDING_SESSION" | "DEADLINE" | "PUBLICATION_TARGET";

export type CalendarItem = {
  itemId: string;
  itemType: CalendarItemType;
  title: string;
  sourceId: string;
  startsAt: string | undefined;
  endsAt?: string | undefined;
  timezone?: string | undefined;
  status?: string | undefined;
  targetRef?: TargetRef | undefined;
};

export type CalendarProjection = {
  generatedAt: string;
  items: readonly CalendarItem[];
};
