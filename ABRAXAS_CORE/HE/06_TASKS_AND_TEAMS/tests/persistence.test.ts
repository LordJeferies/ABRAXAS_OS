import {describe, expect, it} from "vitest";
import fs from "node:fs";
import path from "node:path";
import {HeOperationsService} from "../runtime/index.ts";
import {JsonFileOperationsStore} from "../runtime/infrastructure/index.ts";

describe("JsonFileOperationsStore — 9/9 Persisted Entity Behavioral Validation (Gate P2 Repair-04)", () => {
  const tmpDir = "/tmp/he_operations_persistence_structural_test_r04";
  const tmpFile = path.join(tmpDir, "operations_store_v1.json");

  const writeFixture = (data: any) => {
    fs.mkdirSync(tmpDir, {recursive: true});
    fs.writeFileSync(tmpFile, JSON.stringify(data), "utf-8");
  };

  const cleanTmp = () => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, {recursive: true, force: true});
    }
  };

  it("validates full structural integrity and persists state atomically", () => {
    cleanTmp();
    const store = new JsonFileOperationsStore(tmpFile);
    let idCounter = 1;
    const service = new HeOperationsService(
      store,
      () => "2026-08-30T12:00:00.000Z",
      (p) => `${p}_${idCounter++}`
    );

    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    service.addTeamMember({userId: "u_editor", displayName: "Jane Editor", status: "ACTIVE", roles: ["EDITOR"]}, "u_owner");

    const task = service.createTask({title: "Persisted Task", priority: "HIGH"}, "u_owner");
    service.assignTask(task.taskId, "u_editor", "u_owner");

    service.setDeadline({
      targetType: "TASK", targetId: task.taskId, dueAt: "2026-09-01T12:00:00Z", timezone: "America/Bogota"
    }, "u_owner");

    const reloaded = new JsonFileOperationsStore(tmpFile);
    expect(reloaded.listTeamMembers().length).toBe(2);
    expect(reloaded.listTasks().length).toBe(1);
    expect(reloaded.listAssignments().length).toBe(1);
    cleanTmp();
  });

  // 1. TeamMember
  it("rejects persisted invalid TeamMember", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [{userId: "u_1", displayName: "Bad Member", status: "INVALID_GHOST", roles: ["EDITOR"], createdAt: "now"}],
      tasks: [], assignments: [], dependencies: [], deadlines: [], recordingSessions: [], approvals: [], activity: [], overrides: []
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Structural error in TeamMember/);
    cleanTmp();
  });

  // 2. Task
  it("rejects persisted invalid Task", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [],
      tasks: [{taskId: "t_1", title: "", status: "BACKLOG", priority: "MEDIUM", createdBy: "u_1", createdAt: "now", updatedAt: "now"}],
      assignments: [], dependencies: [], deadlines: [], recordingSessions: [], approvals: [], activity: [], overrides: []
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Structural error in Task/);
    cleanTmp();
  });

  // 3. TaskAssignment
  it("rejects persisted invalid TaskAssignment", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [{userId: "u_1", displayName: "User 1", status: "ACTIVE", roles: ["EDITOR"], createdAt: "now"}],
      tasks: [{taskId: "t_1", title: "Task 1", status: "BACKLOG", priority: "MEDIUM", createdBy: "u_1", createdAt: "now", updatedAt: "now"}],
      assignments: [{assignmentId: "asg_1", taskId: "t_1", userId: "u_1", status: "INVALID_STATUS", assignedBy: "u_1", assignedAt: "now"}],
      dependencies: [], deadlines: [], recordingSessions: [], approvals: [], activity: [], overrides: []
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Structural error in TaskAssignment/);
    cleanTmp();
  });

  // 4. Dependency
  it("rejects persisted invalid Dependency", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [],
      tasks: [
        {taskId: "t1", version: 1, title: "T1", status: "BACKLOG", priority: "MEDIUM", createdBy: "u", createdAt: "now", updatedAt: "now"},
        {taskId: "t2", version: 1, title: "T2", status: "BACKLOG", priority: "MEDIUM", createdBy: "u", createdAt: "now", updatedAt: "now"}
      ],
      assignments: [],
      dependencies: [{dependencyId: "dep_1", upstreamType: "TASK", upstreamId: "t1", downstreamType: "TASK", downstreamId: "t2", dependencyKind: "INVALID_KIND", createdBy: "u", createdAt: "now"}],
      deadlines: [], recordingSessions: [], approvals: [], activity: [], overrides: []
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Structural error in Dependency/);
    cleanTmp();
  });

  // 5. Deadline
  it("rejects persisted invalid Deadline", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [], tasks: [], assignments: [], dependencies: [],
      deadlines: [{deadlineId: "dl_1", targetType: "INVALID_TARGET", targetId: "t1", dueAt: "now", status: "ACTIVE", createdBy: "u", createdAt: "now"}],
      recordingSessions: [], approvals: [], activity: [], overrides: []
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Structural error in Deadline/);
    cleanTmp();
  });

  // 6. RecordingSession
  it("rejects persisted invalid RecordingSession", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [], tasks: [], assignments: [], dependencies: [], deadlines: [],
      recordingSessions: [{
        recordingSessionId: "r_1", version: 1, title: "Bad Session", status: "INVALID_STATUS",
        startsAt: "now", endsAt: "later", timezone: "UTC", locationType: "PHYSICAL",
        people: [], relatedLienzoIds: [], relatedTaskIds: [], preparationTaskIds: [],
        createdBy: "u", createdAt: "now"
      }],
      approvals: [], activity: [], overrides: []
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Structural error in RecordingSession/);
    cleanTmp();
  });

  // 7. Approval
  it("rejects persisted invalid Approval", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [], tasks: [], assignments: [], dependencies: [], deadlines: [], recordingSessions: [],
      approvals: [{approvalId: "app_1", version: 1, targetType: "EDIT_LOCK", targetId: "l1", reviewers: [], decision: "INVALID_DECISION", requestedBy: "u", requestedAt: "now"}],
      activity: [], overrides: []
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Structural error in Approval/);
    cleanTmp();
  });

  // 8. ActivityEntry
  it("rejects persisted invalid ActivityEntry", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [], tasks: [], assignments: [], dependencies: [], deadlines: [], recordingSessions: [], approvals: [],
      activity: [{activityId: "act_1", entryType: "INVALID_ENTRY_TYPE", actorId: "u", timestamp: "now", targetRef: {targetType: "TASK", targetId: "t1"}}],
      overrides: []
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Structural error in ActivityEntry/);
    cleanTmp();
  });

  // 9. DependencyOverride
  it("rejects persisted invalid DependencyOverride", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [],
      tasks: [{taskId: "t1", version: 1, title: "T1", status: "BACKLOG", priority: "MEDIUM", createdBy: "u", createdAt: "now", updatedAt: "now"}],
      assignments: [],
      dependencies: [{dependencyId: "d1", upstreamType: "TASK", upstreamId: "t1", downstreamType: "TASK", downstreamId: "t1", dependencyKind: "BLOCKS", createdBy: "u", createdAt: "now"}],
      deadlines: [], recordingSessions: [], approvals: [], activity: [],
      overrides: [{overrideId: "ovr_1", actorId: "u", dependencyId: "d1", targetTaskId: "t1", reason: "", timestamp: "now"}]
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Structural error in DependencyOverride/);
    cleanTmp();
  });

  it("rejects unsupported persisted Dependency combination", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [], tasks: [], assignments: [],
      dependencies: [{
        dependencyId: "dep_1", upstreamType: "COMPONENT", upstreamId: "c1", downstreamType: "TASK", downstreamId: "t1",
        dependencyKind: "BLOCKS", createdBy: "u", createdAt: "now"
      }],
      deadlines: [], recordingSessions: [], approvals: [], activity: [], overrides: []
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Unsupported dependency combination in V1/);
    cleanTmp();
  });

  it("rejects dangling upstream Task dependency", () => {
    cleanTmp();
    writeFixture({
      schemaVersion: 1,
      members: [],
      tasks: [{taskId: "t_downstream", title: "Task 2", status: "BACKLOG", priority: "MEDIUM", createdBy: "u", createdAt: "now", updatedAt: "now"}],
      assignments: [],
      dependencies: [{
        dependencyId: "dep_1", upstreamType: "TASK", upstreamId: "t_ghost_upstream", downstreamType: "TASK", downstreamId: "t_downstream",
        dependencyKind: "BLOCKS", createdBy: "u", createdAt: "now"
      }],
      deadlines: [], recordingSessions: [], approvals: [], activity: [], overrides: []
    });
    expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/Referential error: Dependency 'dep_1' \(BLOCKS\) references non-existent upstream local Task 't_ghost_upstream'/);
    cleanTmp();
  });
});
