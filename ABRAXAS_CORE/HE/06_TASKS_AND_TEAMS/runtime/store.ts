import fs from "node:fs";
import path from "node:path";
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
import {validateOperationsState, type OperationsStatePayloadV2} from "./persistence-validator.ts";

export interface OperationsStore {
  // Atomic Mutations
  atomicCompleteTimer?(timerId: string, timeEntry: TimeEntry, activityEntries: readonly ActivityEntry[]): void;

  // Team
  getTeamMember(userId: string): TeamMember | undefined;
  listTeamMembers(): readonly TeamMember[];
  saveTeamMember(member: TeamMember): void;
  deleteTeamMember(userId: string): void;

  // Tasks
  getTask(taskId: string): Task | undefined;
  listTasks(): readonly Task[];
  saveTask(task: Task): void;
  deleteTask(taskId: string): void;

  // Assignments
  getAssignment(assignmentId: string): TaskAssignment | undefined;
  listAssignments(): readonly TaskAssignment[];
  saveAssignment(assignment: TaskAssignment): void;
  removeAssignment(assignmentId: string): void;

  // Dependencies
  getDependency(dependencyId: string): Dependency | undefined;
  listDependencies(): readonly Dependency[];
  saveDependency(dependency: Dependency): void;
  removeDependency(dependencyId: string): void;

  // Deadlines
  getDeadline(deadlineId: string): Deadline | undefined;
  listDeadlines(): readonly Deadline[];
  saveDeadline(deadline: Deadline): void;
  removeDeadline(deadlineId: string): void;

  // Recording Sessions
  getRecordingSession(sessionId: string): RecordingSession | undefined;
  listRecordingSessions(): readonly RecordingSession[];
  saveRecordingSession(session: RecordingSession): void;
  removeRecordingSession(sessionId: string): void;

  // Approvals
  getApproval(approvalId: string): Approval | undefined;
  listApprovals(): readonly Approval[];
  saveApproval(approval: Approval): void;
  removeApproval(approvalId: string): void;

  // Activity
  listActivity(): readonly ActivityEntry[];
  recordActivity(activity: ActivityEntry): void;

  // Overrides
  listOverrides(): readonly DependencyOverride[];
  saveOverride(override: DependencyOverride): void;

  // Timer Sessions
  getTimerSession(timerId: string): TimerSession | undefined;
  getActiveTimerSession(userId: string): TimerSession | undefined;
  listTimerSessions(): readonly TimerSession[];
  saveTimerSession(session: TimerSession): void;
  removeTimerSession(timerId: string): void;

  // Time Entries
  getTimeEntry(timeEntryId: string): TimeEntry | undefined;
  listTimeEntries(): readonly TimeEntry[];
  saveTimeEntry(entry: TimeEntry): void;
  removeTimeEntry(timeEntryId: string): void;

  // Notifications
  getNotification(notificationId: string): Notification | undefined;
  listNotifications(): readonly Notification[];
  saveNotification(notification: Notification): void;
  removeNotification(notificationId: string): void;
}

export class MemoryOperationsStore implements OperationsStore {
  private members = new Map<string, TeamMember>();
  private tasks = new Map<string, Task>();
  private assignments = new Map<string, TaskAssignment>();
  private dependencies = new Map<string, Dependency>();
  private deadlines = new Map<string, Deadline>();
  private recordingSessions = new Map<string, RecordingSession>();
  private approvals = new Map<string, Approval>();
  private activity: ActivityEntry[] = [];
  private overrides = new Map<string, DependencyOverride>();
  private timerSessions = new Map<string, TimerSession>();
  private timeEntries = new Map<string, TimeEntry>();
  private notifications = new Map<string, Notification>();

  getTeamMember(userId: string): TeamMember | undefined { return this.members.get(userId); }
  listTeamMembers(): readonly TeamMember[] { return Array.from(this.members.values()); }
  saveTeamMember(member: TeamMember): void { this.members.set(member.userId, member); }
  deleteTeamMember(userId: string): void { this.members.delete(userId); }

  getTask(taskId: string): Task | undefined { return this.tasks.get(taskId); }
  listTasks(): readonly Task[] { return Array.from(this.tasks.values()); }
  saveTask(task: Task): void { this.tasks.set(task.taskId, task); }
  deleteTask(taskId: string): void { this.tasks.delete(taskId); }

  getAssignment(assignmentId: string): TaskAssignment | undefined { return this.assignments.get(assignmentId); }
  listAssignments(): readonly TaskAssignment[] { return Array.from(this.assignments.values()); }
  saveAssignment(assignment: TaskAssignment): void { this.assignments.set(assignment.assignmentId, assignment); }
  removeAssignment(assignmentId: string): void { this.assignments.delete(assignmentId); }

  getDependency(dependencyId: string): Dependency | undefined { return this.dependencies.get(dependencyId); }
  listDependencies(): readonly Dependency[] { return Array.from(this.dependencies.values()); }
  saveDependency(dependency: Dependency): void { this.dependencies.set(dependency.dependencyId, dependency); }
  removeDependency(dependencyId: string): void { this.dependencies.delete(dependencyId); }

  getDeadline(deadlineId: string): Deadline | undefined { return this.deadlines.get(deadlineId); }
  listDeadlines(): readonly Deadline[] { return Array.from(this.deadlines.values()); }
  saveDeadline(deadline: Deadline): void { this.deadlines.set(deadline.deadlineId, deadline); }
  removeDeadline(deadlineId: string): void { this.deadlines.delete(deadlineId); }

  getRecordingSession(sessionId: string): RecordingSession | undefined { return this.recordingSessions.get(sessionId); }
  listRecordingSessions(): readonly RecordingSession[] { return Array.from(this.recordingSessions.values()); }
  saveRecordingSession(session: RecordingSession): void { this.recordingSessions.set(session.recordingSessionId, session); }
  removeRecordingSession(sessionId: string): void { this.recordingSessions.delete(sessionId); }

  getApproval(approvalId: string): Approval | undefined { return this.approvals.get(approvalId); }
  listApprovals(): readonly Approval[] { return Array.from(this.approvals.values()); }
  saveApproval(approval: Approval): void { this.approvals.set(approval.approvalId, approval); }
  removeApproval(approvalId: string): void { this.approvals.delete(approvalId); }

  listActivity(): readonly ActivityEntry[] { return [...this.activity]; }
  recordActivity(activity: ActivityEntry): void { this.activity.push(activity); }

  listOverrides(): readonly DependencyOverride[] { return Array.from(this.overrides.values()); }
  saveOverride(override: DependencyOverride): void { this.overrides.set(override.overrideId, override); }

  getTimerSession(timerId: string): TimerSession | undefined { return this.timerSessions.get(timerId); }
  getActiveTimerSession(userId: string): TimerSession | undefined {
    return Array.from(this.timerSessions.values()).find((s) => s.userId === userId);
  }
  listTimerSessions(): readonly TimerSession[] { return Array.from(this.timerSessions.values()); }
  saveTimerSession(session: TimerSession): void { this.timerSessions.set(session.timerId, session); }
  removeTimerSession(timerId: string): void { this.timerSessions.delete(timerId); }

  getTimeEntry(timeEntryId: string): TimeEntry | undefined { return this.timeEntries.get(timeEntryId); }
  listTimeEntries(): readonly TimeEntry[] { return Array.from(this.timeEntries.values()); }
  saveTimeEntry(entry: TimeEntry): void { this.timeEntries.set(entry.timeEntryId, entry); }
  removeTimeEntry(timeEntryId: string): void { this.timeEntries.delete(timeEntryId); }

  getNotification(notificationId: string): Notification | undefined { return this.notifications.get(notificationId); }
  listNotifications(): readonly Notification[] { return Array.from(this.notifications.values()); }
  saveNotification(notification: Notification): void { this.notifications.set(notification.notificationId, notification); }
  removeNotification(notificationId: string): void { this.notifications.delete(notificationId); }

  atomicCompleteTimer(timerId: string, timeEntry: TimeEntry, activityEntries: readonly ActivityEntry[]): void {
    this.timerSessions.delete(timerId);
    this.timeEntries.set(timeEntry.timeEntryId, timeEntry);
    for (const act of activityEntries) {
      this.activity.push(act);
    }
  }

  snapshot(): OperationsStatePayloadV2 {
    return {
      schemaVersion: 2,
      members: Array.from(this.members.values()),
      tasks: Array.from(this.tasks.values()),
      assignments: Array.from(this.assignments.values()),
      dependencies: Array.from(this.dependencies.values()),
      deadlines: Array.from(this.deadlines.values()),
      recordingSessions: Array.from(this.recordingSessions.values()),
      approvals: Array.from(this.approvals.values()),
      activity: [...this.activity],
      overrides: Array.from(this.overrides.values()),
      timerSessions: Array.from(this.timerSessions.values()),
      timeEntries: Array.from(this.timeEntries.values()),
      notifications: Array.from(this.notifications.values())
    };
  }

  restore(payload: OperationsStatePayloadV2): void {
    this.members = new Map(payload.members.map((m) => [m.userId, m]));
    this.tasks = new Map(payload.tasks.map((t) => [t.taskId, t]));
    this.assignments = new Map(payload.assignments.map((a) => [a.assignmentId, a]));
    this.dependencies = new Map(payload.dependencies.map((d) => [d.dependencyId, d]));
    this.deadlines = new Map(payload.deadlines.map((dl) => [dl.deadlineId, dl]));
    this.recordingSessions = new Map(payload.recordingSessions.map((r) => [r.recordingSessionId, r]));
    this.approvals = new Map(payload.approvals.map((ap) => [ap.approvalId, ap]));
    this.activity = [...payload.activity];
    this.overrides = new Map(payload.overrides.map((o) => [o.overrideId, o]));
    this.timerSessions = new Map(payload.timerSessions.map((s) => [s.timerId, s]));
    this.timeEntries = new Map(payload.timeEntries.map((te) => [te.timeEntryId, te]));
    this.notifications = new Map(payload.notifications.map((n) => [n.notificationId, n]));
  }
}

export class JsonFileOperationsStore implements OperationsStore {
  private filePath: string;
  private mem = new MemoryOperationsStore();

  constructor(filePath: string) {
    this.filePath = filePath;
    this.load();
  }

  private load(): void {
    if (!fs.existsSync(this.filePath)) {
      return;
    }
    const raw = fs.readFileSync(this.filePath, "utf-8");
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new Error(`JsonFileOperationsStore corruption error: Unable to parse JSON file at '${this.filePath}': ${(err as Error).message}`);
    }

    // Schema Migration v1 -> v2 (Atomic)
    if (parsed.schemaVersion === 1) {
      const backupPath = `${this.filePath}.v1.bak.${Date.now()}`;
      fs.writeFileSync(backupPath, raw, "utf-8");

      const v2Payload: OperationsStatePayloadV2 = {
        schemaVersion: 2,
        members: parsed.members ?? [],
        tasks: parsed.tasks ?? [],
        assignments: parsed.assignments ?? [],
        dependencies: parsed.dependencies ?? [],
        deadlines: parsed.deadlines ?? [],
        recordingSessions: parsed.recordingSessions ?? [],
        approvals: parsed.approvals ?? [],
        activity: parsed.activity ?? [],
        overrides: parsed.overrides ?? [],
        timerSessions: parsed.timerSessions ?? [],
        timeEntries: parsed.timeEntries ?? [],
        notifications: parsed.notifications ?? []
      };

      validateOperationsState(v2Payload);

      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(v2Payload, null, 2), "utf-8");
      fs.renameSync(tempPath, this.filePath);

      parsed = v2Payload;
    } else {
      validateOperationsState(parsed);
    }

    this.mem.restore(parsed);
  }

  private flush(): void {
    const payload = this.mem.snapshot();
    validateOperationsState(payload);

    const dir = path.dirname(this.filePath);
    fs.mkdirSync(dir, {recursive: true});
    const tempPath = `${this.filePath}.tmp.${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    fs.writeFileSync(tempPath, JSON.stringify(payload, null, 2), "utf-8");
    fs.renameSync(tempPath, this.filePath);
  }

  private mutateWithRollback<T>(action: () => T): T {
    const snapshot = this.mem.snapshot();
    try {
      const res = action();
      this.flush();
      return res;
    } catch (err) {
      this.mem.restore(snapshot);
      throw err;
    }
  }

  getTeamMember(userId: string) { return this.mem.getTeamMember(userId); }
  listTeamMembers() { return this.mem.listTeamMembers(); }
  saveTeamMember(member: TeamMember) { this.mutateWithRollback(() => this.mem.saveTeamMember(member)); }
  deleteTeamMember(userId: string) { this.mutateWithRollback(() => this.mem.deleteTeamMember(userId)); }

  getTask(taskId: string) { return this.mem.getTask(taskId); }
  listTasks() { return this.mem.listTasks(); }
  saveTask(task: Task) { this.mutateWithRollback(() => this.mem.saveTask(task)); }
  deleteTask(taskId: string) { this.mutateWithRollback(() => this.mem.deleteTask(taskId)); }

  getAssignment(id: string) { return this.mem.getAssignment(id); }
  listAssignments() { return this.mem.listAssignments(); }
  saveAssignment(a: TaskAssignment) { this.mutateWithRollback(() => this.mem.saveAssignment(a)); }
  removeAssignment(id: string) { this.mutateWithRollback(() => this.mem.removeAssignment(id)); }

  getDependency(id: string) { return this.mem.getDependency(id); }
  listDependencies() { return this.mem.listDependencies(); }
  saveDependency(d: Dependency) { this.mutateWithRollback(() => this.mem.saveDependency(d)); }
  removeDependency(id: string) { this.mutateWithRollback(() => this.mem.removeDependency(id)); }

  getDeadline(id: string) { return this.mem.getDeadline(id); }
  listDeadlines() { return this.mem.listDeadlines(); }
  saveDeadline(d: Deadline) { this.mutateWithRollback(() => this.mem.saveDeadline(d)); }
  removeDeadline(id: string) { this.mutateWithRollback(() => this.mem.removeDeadline(id)); }

  getRecordingSession(id: string) { return this.mem.getRecordingSession(id); }
  listRecordingSessions() { return this.mem.listRecordingSessions(); }
  saveRecordingSession(s: RecordingSession) { this.mutateWithRollback(() => this.mem.saveRecordingSession(s)); }
  removeRecordingSession(id: string) { this.mutateWithRollback(() => this.mem.removeRecordingSession(id)); }

  getApproval(id: string) { return this.mem.getApproval(id); }
  listApprovals() { return this.mem.listApprovals(); }
  saveApproval(a: Approval) { this.mutateWithRollback(() => this.mem.saveApproval(a)); }
  removeApproval(id: string) { this.mutateWithRollback(() => this.mem.removeApproval(id)); }

  listActivity() { return this.mem.listActivity(); }
  recordActivity(act: ActivityEntry) { this.mutateWithRollback(() => this.mem.recordActivity(act)); }

  listOverrides() { return this.mem.listOverrides(); }
  saveOverride(o: DependencyOverride) { this.mutateWithRollback(() => this.mem.saveOverride(o)); }

  getTimerSession(id: string) { return this.mem.getTimerSession(id); }
  getActiveTimerSession(userId: string) { return this.mem.getActiveTimerSession(userId); }
  listTimerSessions() { return this.mem.listTimerSessions(); }
  saveTimerSession(s: TimerSession) { this.mutateWithRollback(() => this.mem.saveTimerSession(s)); }
  removeTimerSession(id: string) { this.mutateWithRollback(() => this.mem.removeTimerSession(id)); }

  getTimeEntry(id: string) { return this.mem.getTimeEntry(id); }
  listTimeEntries() { return this.mem.listTimeEntries(); }
  saveTimeEntry(e: TimeEntry) { this.mutateWithRollback(() => this.mem.saveTimeEntry(e)); }
  removeTimeEntry(id: string) { this.mutateWithRollback(() => this.mem.removeTimeEntry(id)); }

  getNotification(id: string) { return this.mem.getNotification(id); }
  listNotifications() { return this.mem.listNotifications(); }
  saveNotification(n: Notification) { this.mutateWithRollback(() => this.mem.saveNotification(n)); }
  removeNotification(id: string) { this.mutateWithRollback(() => this.mem.removeNotification(id)); }

  atomicCompleteTimer(timerId: string, timeEntry: TimeEntry, activityEntries: readonly ActivityEntry[]): void {
    this.mutateWithRollback(() => {
      this.mem.atomicCompleteTimer(timerId, timeEntry, activityEntries);
    });
  }
}

export class LocalStorageOperationsStore implements OperationsStore {
  private storageKey: string;
  private mem = new MemoryOperationsStore();

  constructor(storageKey = "__ABRAXAS_HE_OPERATIONS_STORE_V2__") {
    this.storageKey = storageKey;
    this.load();
  }

  private load(): void {
    if (typeof window === "undefined" || !window.localStorage) return;
    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) return;

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new Error(`LocalStorageOperationsStore corruption: Invalid JSON in localStorage key '${this.storageKey}': ${(err as Error).message}`);
    }

    validateOperationsState(parsed);
    this.mem.restore(parsed);
  }

  private flush(): void {
    if (typeof window === "undefined" || !window.localStorage) return;
    const payload = this.mem.snapshot();
    validateOperationsState(payload);

    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch (err) {
      throw new Error(`LocalStorageOperationsStore write failure: ${(err as Error).message}`);
    }
  }

  private mutateWithRollback<T>(action: () => T): T {
    const snapshot = this.mem.snapshot();
    try {
      const res = action();
      this.flush();
      return res;
    } catch (err) {
      this.mem.restore(snapshot);
      throw err;
    }
  }

  getTeamMember(userId: string) { return this.mem.getTeamMember(userId); }
  listTeamMembers() { return this.mem.listTeamMembers(); }
  saveTeamMember(m: TeamMember) { this.mutateWithRollback(() => this.mem.saveTeamMember(m)); }
  deleteTeamMember(id: string) { this.mutateWithRollback(() => this.mem.deleteTeamMember(id)); }

  getTask(id: string) { return this.mem.getTask(id); }
  listTasks() { return this.mem.listTasks(); }
  saveTask(t: Task) { this.mutateWithRollback(() => this.mem.saveTask(t)); }
  deleteTask(id: string) { this.mutateWithRollback(() => this.mem.deleteTask(id)); }

  getAssignment(id: string) { return this.mem.getAssignment(id); }
  listAssignments() { return this.mem.listAssignments(); }
  saveAssignment(a: TaskAssignment) { this.mutateWithRollback(() => this.mem.saveAssignment(a)); }
  removeAssignment(id: string) { this.mutateWithRollback(() => this.mem.removeAssignment(id)); }

  getDependency(id: string) { return this.mem.getDependency(id); }
  listDependencies() { return this.mem.listDependencies(); }
  saveDependency(d: Dependency) { this.mutateWithRollback(() => this.mem.saveDependency(d)); }
  removeDependency(id: string) { this.mutateWithRollback(() => this.mem.removeDependency(id)); }

  getDeadline(id: string) { return this.mem.getDeadline(id); }
  listDeadlines() { return this.mem.listDeadlines(); }
  saveDeadline(d: Deadline) { this.mutateWithRollback(() => this.mem.saveDeadline(d)); }
  removeDeadline(id: string) { this.mutateWithRollback(() => this.mem.removeDeadline(id)); }

  getRecordingSession(id: string) { return this.mem.getRecordingSession(id); }
  listRecordingSessions() { return this.mem.listRecordingSessions(); }
  saveRecordingSession(s: RecordingSession) { this.mutateWithRollback(() => this.mem.saveRecordingSession(s)); }
  removeRecordingSession(id: string) { this.mutateWithRollback(() => this.mem.removeRecordingSession(id)); }

  getApproval(id: string) { return this.mem.getApproval(id); }
  listApprovals() { return this.mem.listApprovals(); }
  saveApproval(a: Approval) { this.mutateWithRollback(() => this.mem.saveApproval(a)); }
  removeApproval(id: string) { this.mutateWithRollback(() => this.mem.removeApproval(id)); }

  listActivity() { return this.mem.listActivity(); }
  recordActivity(a: ActivityEntry) { this.mutateWithRollback(() => this.mem.recordActivity(a)); }

  listOverrides() { return this.mem.listOverrides(); }
  saveOverride(o: DependencyOverride) { this.mutateWithRollback(() => this.mem.saveOverride(o)); }

  getTimerSession(id: string) { return this.mem.getTimerSession(id); }
  getActiveTimerSession(userId: string) { return this.mem.getActiveTimerSession(userId); }
  listTimerSessions() { return this.mem.listTimerSessions(); }
  saveTimerSession(s: TimerSession) { this.mutateWithRollback(() => this.mem.saveTimerSession(s)); }
  removeTimerSession(id: string) { this.mutateWithRollback(() => this.mem.removeTimerSession(id)); }

  getTimeEntry(id: string) { return this.mem.getTimeEntry(id); }
  listTimeEntries() { return this.mem.listTimeEntries(); }
  saveTimeEntry(e: TimeEntry) { this.mutateWithRollback(() => this.mem.saveTimeEntry(e)); }
  removeTimeEntry(id: string) { this.mutateWithRollback(() => this.mem.removeTimeEntry(id)); }

  getNotification(id: string) { return this.mem.getNotification(id); }
  listNotifications() { return this.mem.listNotifications(); }
  saveNotification(n: Notification) { this.mutateWithRollback(() => this.mem.saveNotification(n)); }
  removeNotification(id: string) { this.mutateWithRollback(() => this.mem.removeNotification(id)); }

  atomicCompleteTimer(timerId: string, timeEntry: TimeEntry, activityEntries: readonly ActivityEntry[]): void {
    this.mutateWithRollback(() => {
      this.mem.atomicCompleteTimer(timerId, timeEntry, activityEntries);
    });
  }
}
