import {describe, expect, it} from "vitest";
import {validateOperationsState, type OperationsStatePayloadV2} from "../runtime/persistence-validator.ts";

describe("Persistence Data Integrity & Referential Guarantees (Section 1, 2, 3)", () => {
  const baseValid = (): OperationsStatePayloadV2 => ({
    schemaVersion: 2,
    members: [{userId: "u_1", displayName: "Lead", status: "ACTIVE", roles: ["OWNER"], createdAt: "now"}],
    tasks: [{taskId: "t_1", version: 1, title: "T1", status: "BACKLOG", priority: "MEDIUM", createdBy: "u_1", createdAt: "now", updatedAt: "now"}],
    assignments: [{assignmentId: "asg_1", taskId: "t_1", userId: "u_1", status: "ACTIVE", assignedBy: "u_1", assignedAt: "now"}],
    dependencies: [{dependencyId: "dep_1", upstreamType: "TASK", upstreamId: "t_1", downstreamType: "TASK", downstreamId: "t_1", dependencyKind: "BLOCKS", createdBy: "u_1", createdAt: "now"}],
    deadlines: [],
    recordingSessions: [],
    approvals: [],
    activity: [],
    overrides: [{overrideId: "ovr_1", actorId: "u_1", dependencyId: "dep_1", targetTaskId: "t_1", reason: "Reason", timestamp: "now"}],
    timerSessions: [{timerId: "tim_1", userId: "u_1", taskId: "t_1", status: "RUNNING", startedAt: "now", lastResumedAt: "now", accumulatedSeconds: 0, updatedAt: "now"}],
    timeEntries: [{timeEntryId: "te_1", userId: "u_1", taskId: "t_1", durationSeconds: 60, source: "MANUAL", createdAt: "now", startedAt: "now"}],
    notifications: [{notificationId: "not_1", userId: "u_1", type: "TASK_ASSIGNED", severity: "INFO", message: "Msg", dedupeKey: "k1", createdAt: "now", targetRef: {targetType: "TASK", targetId: "t_1"}}]
  });

  it("validates that a fully consistent payload passes", () => {
    expect(() => validateOperationsState(baseValid())).not.toThrow();
  });

  it("rejects assignment referencing unknown user when members = []", () => {
    const payload = baseValid();
    payload.members = [];
    expect(() => validateOperationsState(payload)).toThrow(/Referential error: TaskAssignment 'asg_1' references non-existent TeamMember 'u_1'/);
  });

  it("rejects assignment referencing unknown task when tasks = []", () => {
    const payload = baseValid();
    payload.tasks = [];
    expect(() => validateOperationsState(payload)).toThrow(/Referential error: TaskAssignment 'asg_1' references non-existent Task 't_1'/);
  });

  it("rejects TimerSession referencing unknown user", () => {
    const payload = baseValid();
    payload.timerSessions[0]!.userId = "u_missing";
    expect(() => validateOperationsState(payload)).toThrow(/Referential error: TimerSession 'tim_1' references non-existent TeamMember 'u_missing'/);
  });

  it("rejects TimerSession referencing unknown task", () => {
    const payload = baseValid();
    payload.timerSessions[0]!.taskId = "t_missing";
    expect(() => validateOperationsState(payload)).toThrow(/Referential error: TimerSession 'tim_1' references non-existent Task 't_missing'/);
  });

  it("rejects TimeEntry referencing unknown user", () => {
    const payload = baseValid();
    payload.timeEntries[0]!.userId = "u_missing";
    expect(() => validateOperationsState(payload)).toThrow(/Referential error: TimeEntry 'te_1' references non-existent TeamMember 'u_missing'/);
  });

  it("rejects TimeEntry referencing unknown task", () => {
    const payload = baseValid();
    payload.timeEntries[0]!.taskId = "t_missing";
    expect(() => validateOperationsState(payload)).toThrow(/Referential error: TimeEntry 'te_1' references non-existent Task 't_missing'/);
  });

  it("rejects Notification referencing unknown user", () => {
    const payload = baseValid();
    payload.notifications[0]!.userId = "u_missing";
    expect(() => validateOperationsState(payload)).toThrow(/Referential error: Notification 'not_1' references non-existent TeamMember 'u_missing'/);
  });

  it("rejects Override referencing unknown Dependency", () => {
    const payload = baseValid();
    payload.overrides[0]!.dependencyId = "dep_missing";
    expect(() => validateOperationsState(payload)).toThrow(/Referential error: DependencyOverride 'ovr_1' references non-existent Dependency 'dep_missing'/);
  });

  it("rejects Override referencing unknown Task", () => {
    const payload = baseValid();
    payload.overrides[0]!.targetTaskId = "t_missing";
    expect(() => validateOperationsState(payload)).toThrow(/Referential error: DependencyOverride 'ovr_1' references non-existent local Task 't_missing'/);
  });

  it("rejects missing timerSessions collection in schema v2", () => {
    const payload: any = baseValid();
    delete payload.timerSessions;
    expect(() => validateOperationsState(payload)).toThrow(/Persistence validation error: 'timerSessions' must be an array/);
  });

  it("rejects missing notifications collection in schema v2", () => {
    const payload: any = baseValid();
    delete payload.notifications;
    expect(() => validateOperationsState(payload)).toThrow(/Persistence validation error: 'notifications' must be an array/);
  });
});
