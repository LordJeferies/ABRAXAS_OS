import {describe, expect, it} from "vitest";
import fs from "node:fs";
import path from "node:path";
import {JsonFileOperationsStore} from "../runtime/store.ts";
import {validateOperationsState} from "../runtime/persistence-validator.ts";

describe("Canonical Domain & Persistence Drift Regression (Section 1, 2, 3, 23)", () => {
  const tmpDir = "/tmp/he_canon_drift_tests";
  const tmpFile = path.join(tmpDir, "store_drift.json");

  const cleanTmp = () => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, {recursive: true, force: true});
  };

  const writeState = (payload: any) => {
    cleanTmp();
    fs.mkdirSync(tmpDir, {recursive: true});
    fs.writeFileSync(tmpFile, JSON.stringify(payload, null, 2), "utf-8");
  };

  it("accepts all canonical domain values in persistence (valid fixtures)", () => {
    const validPayload = {
      schemaVersion: 2,
      members: [
        {userId: "u_1", displayName: "Lead Owner", status: "ACTIVE", roles: ["OWNER"], createdAt: "2026-08-30T10:00:00Z"},
        {userId: "u_2", displayName: "Jane Editor", status: "ACTIVE", roles: ["EDITOR"], createdAt: "2026-08-30T10:00:00Z"}
      ],
      tasks: [
        {taskId: "t_1", version: 1, title: "Task 1", status: "BACKLOG", priority: "MEDIUM", createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z", updatedAt: "2026-08-30T10:00:00Z"},
        {taskId: "t_2", version: 1, title: "Task 2", status: "READY", priority: "HIGH", createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z", updatedAt: "2026-08-30T10:00:00Z"}
      ],
      assignments: [
        {assignmentId: "asg_1", taskId: "t_1", userId: "u_1", status: "ACTIVE", assignedBy: "u_1", assignedAt: "2026-08-30T10:00:00Z"},
        {assignmentId: "asg_2", taskId: "t_2", userId: "u_2", status: "COMPLETED", assignedBy: "u_1", assignedAt: "2026-08-30T10:00:00Z"}
      ],
      dependencies: [
        {dependencyId: "dep_1", upstreamType: "TASK", upstreamId: "t_1", downstreamType: "TASK", downstreamId: "t_2", dependencyKind: "BLOCKS", createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z"},
        {dependencyId: "dep_2", upstreamType: "EDIT_LOCK", upstreamId: "lock_1", downstreamType: "TASK", downstreamId: "t_2", dependencyKind: "REQUIRES_APPROVAL", createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z"},
        {dependencyId: "dep_3", upstreamType: "MOTION_PLAN", upstreamId: "mp_1", downstreamType: "TASK", downstreamId: "t_2", dependencyKind: "REQUIRES_APPROVAL", createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z"},
        {dependencyId: "dep_4", upstreamType: "PLAN", upstreamId: "p_1", downstreamType: "LIENZO", downstreamId: "l_1", dependencyKind: "INFORMATIONAL", createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z"}
      ],
      deadlines: [
        {deadlineId: "dl_1", targetType: "TASK", targetId: "t_1", dueAt: "2026-09-05T18:00:00Z", timezone: "UTC", status: "ACTIVE", createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z"}
      ],
      recordingSessions: [
        {recordingSessionId: "rec_1", version: 1, title: "Rec 1", status: "PROPOSED", startsAt: "2026-09-02T10:00:00Z", endsAt: "2026-09-02T14:00:00Z", timezone: "America/Bogota", locationType: "PHYSICAL", people: [{userId: "u_1", role: "Director"}], relatedLienzoIds: [], relatedTaskIds: [], preparationTaskIds: [], createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z"},
        {recordingSessionId: "rec_2", version: 1, title: "Rec 2", status: "IN_PROGRESS", startsAt: "2026-09-02T10:00:00Z", endsAt: "2026-09-02T14:00:00Z", timezone: "America/Bogota", locationType: "REMOTE", people: [{userId: "u_2", role: "Talent"}], relatedLienzoIds: [], relatedTaskIds: [], preparationTaskIds: [], createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z"},
        {recordingSessionId: "rec_3", version: 1, title: "Rec 3", status: "COMPLETED", startsAt: "2026-09-02T10:00:00Z", endsAt: "2026-09-02T14:00:00Z", timezone: "America/Bogota", locationType: "TBD", people: [{userId: "u_1", role: "Director"}], relatedLienzoIds: [], relatedTaskIds: [], preparationTaskIds: [], createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z"}
      ],
      approvals: [
        {approvalId: "app_1", version: 1, targetType: "EDIT_LOCK", targetId: "lock_1", reviewers: ["u_1"], decision: "PENDING", requestedBy: "u_2", requestedAt: "2026-08-30T10:00:00Z"}
      ],
      activity: [
        {activityId: "act_1", entryType: "BOOTSTRAP_INITIALIZED", actorId: "u_1", timestamp: "2026-08-30T10:00:00Z", targetRef: {targetType: "TEAM_MEMBER", targetId: "u_1"}}
      ],
      overrides: [
        {overrideId: "ovr_1", actorId: "u_1", dependencyId: "dep_1", targetTaskId: "t_2", reason: "Approved bypass", timestamp: "2026-08-30T10:00:00Z"}
      ],
      timerSessions: [],
      timeEntries: [],
      notifications: []
    };

    writeState(validPayload);
    const store = new JsonFileOperationsStore(tmpFile);
    expect(store.listTeamMembers().length).toBe(2);
    expect(store.listTasks().length).toBe(2);
    expect(store.listAssignments().length).toBe(2);
    expect(store.listDependencies().length).toBe(4);
    expect(store.listRecordingSessions().length).toBe(3);
    expect(store.listOverrides().length).toBe(1);

    cleanTmp();
  });

  it("rejects non-canonical values (HYBRID, INFORMS, invented node types)", () => {
    // 1. HYBRID locationType rejected
    expect(() => validateOperationsState({
      schemaVersion: 2,
      members: [], tasks: [], assignments: [], dependencies: [], deadlines: [],
      recordingSessions: [
        {recordingSessionId: "rec_bad", version: 1, title: "Bad", status: "DRAFT", startsAt: "2026-09-02T10:00:00Z", endsAt: "2026-09-02T14:00:00Z", timezone: "UTC", locationType: "HYBRID", people: [], relatedLienzoIds: [], relatedTaskIds: [], preparationTaskIds: [], createdBy: "u", createdAt: "now"}
      ],
      approvals: [], activity: [], overrides: [], timerSessions: [], timeEntries: [], notifications: []
    })).toThrow(/Structural error in RecordingSession/);

    // 2. INFORMS dependencyKind rejected
    expect(() => validateOperationsState({
      schemaVersion: 2,
      members: [], tasks: [], assignments: [],
      dependencies: [
        {dependencyId: "dep_bad", upstreamType: "TASK", upstreamId: "t1", downstreamType: "TASK", downstreamId: "t2", dependencyKind: "INFORMS", createdBy: "u", createdAt: "now"}
      ],
      deadlines: [], recordingSessions: [], approvals: [], activity: [], overrides: [], timerSessions: [], timeEntries: [], notifications: []
    })).toThrow(/Structural error in Dependency/);

    // 3. APPROVAL dependency node type rejected
    expect(() => validateOperationsState({
      schemaVersion: 2,
      members: [], tasks: [], assignments: [],
      dependencies: [
        {dependencyId: "dep_bad2", upstreamType: "APPROVAL", upstreamId: "app1", downstreamType: "TASK", downstreamId: "t2", dependencyKind: "REQUIRES_APPROVAL", createdBy: "u", createdAt: "now"}
      ],
      deadlines: [], recordingSessions: [], approvals: [], activity: [], overrides: [], timerSessions: [], timeEntries: [], notifications: []
    })).toThrow(/Structural error in Dependency/);
  });
});
