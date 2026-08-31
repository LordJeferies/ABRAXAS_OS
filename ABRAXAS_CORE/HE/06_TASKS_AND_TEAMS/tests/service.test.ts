import {describe, expect, it, beforeEach} from "vitest";
import {
  HeOperationsService,
  SecurityError,
  DependencyError,
  ApprovalError,
  RecordingSessionError
} from "../runtime/index.ts";
import {MemoryOperationsStore} from "../runtime/infrastructure/index.ts";

describe("HeOperationsService — Domain Consistency & Invariants (Gate P2 Repair-03)", () => {
  let store: MemoryOperationsStore;
  let service: HeOperationsService;
  let idCounter = 1;
  const mockNow = "2026-08-30T12:00:00.000Z";

  beforeEach(() => {
    store = new MemoryOperationsStore();
    idCounter = 1;
    service = new HeOperationsService(
      store,
      () => mockNow,
      (prefix) => `${prefix}_${idCounter++}`
    );

    // Bootstrap initial owner
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});

    // Add standard team members
    service.addTeamMember({
      userId: "u_manager", displayName: "Operations Manager", status: "ACTIVE", roles: ["MANAGER"]
    }, "u_owner");

    service.addTeamMember({
      userId: "u_editor", displayName: "Video Editor", status: "ACTIVE", roles: ["EDITOR"]
    }, "u_owner");

    service.addTeamMember({
      userId: "u_viewer", displayName: "Client Viewer", status: "ACTIVE", roles: ["VIEWER"]
    }, "u_owner");

    service.addTeamMember({
      userId: "u_custom", displayName: "Custom QA Operator", status: "ACTIVE", roles: ["CUSTOM"],
      customPermissions: ["task.review", "approval.decide"]
    }, "u_owner");

    service.addTeamMember({
      userId: "u_inactive", displayName: "Inactive Member", status: "INACTIVE", roles: ["EDITOR"]
    }, "u_owner");
  });

  it("enforces V1 supported dependency combinations and rejects unsupported node types", () => {
    const taskA = service.createTask({title: "Task A"}, "u_manager");
    const taskB = service.createTask({title: "Task B"}, "u_manager");

    // Valid: BLOCKS with TASK -> TASK
    expect(() => service.createDependency({
      upstreamType: "TASK", upstreamId: taskA.taskId, downstreamType: "TASK", downstreamId: taskB.taskId,
      dependencyKind: "BLOCKS"
    }, "u_manager")).not.toThrow();

    // Invalid: BLOCKS with COMPONENT -> TASK (rejected in V1)
    expect(() => service.createDependency({
      upstreamType: "COMPONENT", upstreamId: "c_01", downstreamType: "TASK", downstreamId: taskB.taskId,
      dependencyKind: "BLOCKS"
    }, "u_manager")).toThrow(DependencyError);

    // Invalid: REQUIRES_APPROVAL with LIENZO upstream (rejected in V1 because LIENZO is not an ApprovalTargetType)
    expect(() => service.createDependency({
      upstreamType: "LIENZO", upstreamId: "lz_01", downstreamType: "TASK", downstreamId: taskB.taskId,
      dependencyKind: "REQUIRES_APPROVAL"
    }, "u_manager")).toThrow(DependencyError);

    // Valid: REQUIRES_APPROVAL with EDIT_LOCK -> TASK
    expect(() => service.createDependency({
      upstreamType: "EDIT_LOCK", upstreamId: "lock_01", downstreamType: "TASK", downstreamId: taskB.taskId,
      dependencyKind: "REQUIRES_APPROVAL"
    }, "u_manager")).not.toThrow();
  });

  it("enforces typed approval resolution and rejects ID collisions across different target types", () => {
    const task = service.createTask({title: "Assemble Final Delivery"}, "u_manager");

    // Approval exists for EDIT_LOCK with ID 'artifact_123'
    const lockApproval = service.requestApproval({
      targetType: "EDIT_LOCK",
      targetId: "artifact_123",
      reviewers: ["u_custom"],
      comments: "Review edit lock"
    }, "u_manager");

    // Decide lock approval as APPROVED
    service.decideApproval(lockApproval.approvalId, "APPROVED", "u_custom");

    // Dependency requires approval for MOTION_PLAN with the same ID 'artifact_123'
    service.createDependency({
      upstreamType: "MOTION_PLAN",
      upstreamId: "artifact_123",
      downstreamType: "TASK",
      downstreamId: task.taskId,
      dependencyKind: "REQUIRES_APPROVAL"
    }, "u_manager");

    // Attempt to transition task to IN_PROGRESS: MUST FAIL because approved target was EDIT_LOCK, not MOTION_PLAN
    expect(() => service.transitionTask(task.taskId, "IN_PROGRESS", "u_manager")).toThrow(DependencyError);

    // Now request and approve the exact MOTION_PLAN approval
    const motionApproval = service.requestApproval({
      targetType: "MOTION_PLAN",
      targetId: "artifact_123",
      reviewers: ["u_custom"]
    }, "u_manager");
    service.decideApproval(motionApproval.approvalId, "APPROVED", "u_custom");

    // Now the task can transition cleanly
    const ready = service.transitionTask(task.taskId, "IN_PROGRESS", "u_manager");
    expect(ready.status).toBe("IN_PROGRESS");
  });

  it("enforces dependency-specific overrides without bypassing other or future blockers", () => {
    const taskA = service.createTask({title: "Scripting"}, "u_manager");
    const taskB = service.createTask({title: "Voiceover"}, "u_manager");
    const targetTask = service.createTask({title: "Assembly"}, "u_manager");

    const depA = service.createDependency({
      upstreamType: "TASK", upstreamId: taskA.taskId, downstreamType: "TASK", downstreamId: targetTask.taskId,
      dependencyKind: "BLOCKS"
    }, "u_manager");

    const depB = service.createDependency({
      upstreamType: "TASK", upstreamId: taskB.taskId, downstreamType: "TASK", downstreamId: targetTask.taskId,
      dependencyKind: "BLOCKS"
    }, "u_manager");

    // Override ONLY dependency A
    service.overrideDependency(targetTask.taskId, depA.dependencyId, "Producer authorized outline", "u_manager");

    // Dependency B is still unresolved -> Transition MUST FAIL
    expect(() => service.transitionTask(targetTask.taskId, "IN_PROGRESS", "u_manager")).toThrow(DependencyError);

    // Now override dependency B explicitly
    service.overrideDependency(targetTask.taskId, depB.dependencyId, "Producer authorized scratch audio", "u_manager");

    // Now transition succeeds
    service.transitionTask(targetTask.taskId, "IN_PROGRESS", "u_manager");
    expect(store.getTask(targetTask.taskId)?.status).toBe("IN_PROGRESS");

    // Add a new blocker C after previous overrides
    const taskC = service.createTask({title: "Legal QA"}, "u_manager");
    service.createDependency({
      upstreamType: "TASK", upstreamId: taskC.taskId, downstreamType: "TASK", downstreamId: targetTask.taskId,
      dependencyKind: "BLOCKS"
    }, "u_manager");

    // Transitioning to REVIEW or DONE MUST FAIL because C is not overridden
    expect(() => service.transitionTask(targetTask.taskId, "DONE", "u_manager")).toThrow(DependencyError);
  });

  it("enforces full blocked-state transition policy (denies READY, IN_PROGRESS, REVIEW, DONE; permits BACKLOG, BLOCKED, CANCELLED)", () => {
    const blocker = service.createTask({title: "Rough Cut"}, "u_manager");
    const task = service.createTask({title: "Sound Mix"}, "u_manager");

    service.createDependency({
      upstreamType: "TASK", upstreamId: blocker.taskId, downstreamType: "TASK", downstreamId: task.taskId,
      dependencyKind: "BLOCKS"
    }, "u_manager");

    // Denied terminal / active states when blocked
    expect(() => service.transitionTask(task.taskId, "READY", "u_manager")).toThrow(DependencyError);
    expect(() => service.transitionTask(task.taskId, "IN_PROGRESS", "u_manager")).toThrow(DependencyError);
    expect(() => service.transitionTask(task.taskId, "REVIEW", "u_manager")).toThrow(DependencyError);
    expect(() => service.transitionTask(task.taskId, "DONE", "u_manager")).toThrow(DependencyError);

    // Allowed states when blocked
    expect(() => service.transitionTask(task.taskId, "BLOCKED", "u_manager")).not.toThrow();
    expect(store.getTask(task.taskId)?.status).toBe("BLOCKED");

    expect(() => service.transitionTask(task.taskId, "BACKLOG", "u_manager")).not.toThrow();
    expect(store.getTask(task.taskId)?.status).toBe("BACKLOG");

    expect(() => service.transitionTask(task.taskId, "CANCELLED", "u_manager")).not.toThrow();
    expect(store.getTask(task.taskId)?.status).toBe("CANCELLED");
  });

  it("enforces task creation lifecycle: createTask always initializes in BACKLOG", () => {
    const task = service.createTask({title: "Color Grade"}, "u_manager");
    expect(task.status).toBe("BACKLOG");
    expect(task.version).toBe(1);
    expect(task.createdBy).toBe("u_manager");
  });

  it("enforces unified clock authority and validates approval decision commands", () => {
    const approval = service.requestApproval({
      targetType: "EDIT_LOCK",
      targetId: "lock_002",
      reviewers: ["u_custom"]
    }, "u_manager");

    // Passing PENDING to decideApproval is rejected
    expect(() => service.decideApproval(approval.approvalId, "PENDING" as any, "u_custom")).toThrow(ApprovalError);

    // Passing CANCELLED to decideApproval is rejected (cancelApproval must be used)
    expect(() => service.decideApproval(approval.approvalId, "CANCELLED" as any, "u_custom")).toThrow(ApprovalError);

    // Valid decision uses injected service clock
    const decided = service.decideApproval(approval.approvalId, "APPROVED", "u_custom", "Approved on schedule");
    expect(decided.decidedAt).toBe(mockNow);
    expect(decided.decision).toBe("APPROVED");

    const activity = store.listActivity().find((a) => a.entryType === "APPROVAL_DECIDED");
    expect(activity?.timestamp).toBe(mockNow);
  });

  it("enforces reviewer referential integrity on approval requests", () => {
    // Unknown reviewer rejected
    expect(() => service.requestApproval({
      targetType: "EDIT_LOCK", targetId: "lock_003", reviewers: ["u_unknown_ghost"]
    }, "u_manager")).toThrow(/does not exist/);

    // Inactive reviewer rejected
    expect(() => service.requestApproval({
      targetType: "EDIT_LOCK", targetId: "lock_003", reviewers: ["u_inactive"]
    }, "u_manager")).toThrow(/INACTIVE/);

    // Duplicate reviewers rejected
    expect(() => service.requestApproval({
      targetType: "EDIT_LOCK", targetId: "lock_003", reviewers: ["u_custom", "u_custom"]
    }, "u_manager")).toThrow(/Duplicate reviewer/);
  });
});
