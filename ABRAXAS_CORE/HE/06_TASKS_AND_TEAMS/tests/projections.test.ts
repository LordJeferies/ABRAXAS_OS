import {describe, expect, it, beforeEach} from "vitest";
import {HeOperationsService} from "../runtime/index.ts";
import {MemoryOperationsStore} from "../runtime/infrastructure/index.ts";

describe("He Projections — Unified Blocker Context & Team Active Work (Gate P2 Repair-03)", () => {
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

    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    service.addTeamMember({userId: "u_editor", displayName: "Jane Editor", status: "ACTIVE", roles: ["EDITOR"]}, "u_owner");
    service.addTeamMember({userId: "u_animator", displayName: "Bob Motion", status: "ACTIVE", roles: ["DESIGNER"]}, "u_owner");
  });

  it("exposes active task ownership in TeamSnapshot memberWorkload", () => {
    const t1 = service.createTask({title: "Audio Cleaning", priority: "HIGH"}, "u_owner");
    const t2 = service.createTask({title: "Reel Motion Cut", priority: "URGENT"}, "u_owner");

    service.assignTask(t1.taskId, "u_editor", "u_owner");
    service.assignTask(t2.taskId, "u_animator", "u_owner");

    const snap = service.getTeamSnapshot();
    const editorWork = snap.memberWorkload.find((m: any) => m.userId === "u_editor");
    const animatorWork = snap.memberWorkload.find((m: any) => m.userId === "u_animator");

    expect(editorWork?.activeTasks.length).toBe(1);
    expect(editorWork?.activeTasks[0]?.taskId).toBe(t1.taskId);
    expect(editorWork?.activeTasks[0]?.title).toBe("Audio Cleaning");
    expect(editorWork?.activeTasks[0]?.priority).toBe("HIGH");

    expect(animatorWork?.activeTasks.length).toBe(1);
    expect(animatorWork?.activeTasks[0]?.taskId).toBe(t2.taskId);
  });

  it("evaluates unified blocker context consistently across Deadline, Solo, Team and Kanban", () => {
    const task = service.createTask({title: "Social Export"}, "u_owner");
    service.assignTask(task.taskId, "u_editor", "u_owner");

    // Set deadline
    const dl = service.setDeadline({
      targetType: "TASK", targetId: task.taskId, dueAt: "2026-09-02T18:00:00Z", timezone: "America/Bogota"
    }, "u_owner");

    // Add REQUIRES_APPROVAL dependency
    const approval = service.requestApproval({
      targetType: "MOTION_PLAN", targetId: "mp_001", reviewers: ["u_owner"]
    }, "u_owner");

    service.createDependency({
      upstreamType: "MOTION_PLAN", upstreamId: "mp_001", downstreamType: "TASK", downstreamId: task.taskId,
      dependencyKind: "REQUIRES_APPROVAL"
    }, "u_owner");

    // 1. While approval is PENDING:
    const soloPending = service.getSoloQueue("u_editor");
    expect(soloPending.blocked.some((t: any) => t.taskId === task.taskId)).toBe(true);

    const kanbanPending = service.getKanbanProjection();
    expect(kanbanPending.blocked.some((c: any) => c.task.taskId === task.taskId)).toBe(true);

    const teamPending = service.getTeamSnapshot();
    expect(teamPending.blockedWork.some((b: any) => b.taskId === task.taskId)).toBe(true);

    // 2. When approval becomes APPROVED:
    service.decideApproval(approval.approvalId, "APPROVED", "u_owner");

    const soloApproved = service.getSoloQueue("u_editor");
    expect(soloApproved.blocked.some((t: any) => t.taskId === task.taskId)).toBe(false);

    const kanbanApproved = service.getKanbanProjection();
    expect(kanbanApproved.blocked.some((c: any) => c.task.taskId === task.taskId)).toBe(false);

    const teamApproved = service.getTeamSnapshot();
    expect(teamApproved.blockedWork.some((b: any) => b.taskId === task.taskId)).toBe(false);
  });

  it("guarantees Kanban card uniqueness (each task appears in exactly 1 column)", () => {
    service.createTask({title: "Task 1"}, "u_owner");
    service.createTask({title: "Task 2"}, "u_owner");
    service.createTask({title: "Task 3"}, "u_owner");

    const kanban = service.getKanbanProjection();
    const allCards = [
      ...kanban.backlog,
      ...kanban.ready,
      ...kanban.inProgress,
      ...kanban.review,
      ...kanban.blocked,
      ...kanban.done
    ];

    const cardIds = allCards.map((c: any) => c.task.taskId);
    const uniqueIds = new Set(cardIds);
    expect(cardIds.length).toBe(uniqueIds.size);
    expect(cardIds.length).toBe(3);
  });
});
