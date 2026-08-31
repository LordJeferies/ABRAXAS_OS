import {describe, expect, it} from "vitest";
import {HeOperationsService} from "../runtime/service.ts";
import {MemoryOperationsStore} from "../runtime/store.ts";

describe("Notification Purity & Unified Blocker Notifications (Sections 11, 12)", () => {
  const setup = () => {
    const store = new MemoryOperationsStore();
    let clockTime = "2026-08-30T10:00:00Z";
    let idCounter = 1;
    const service = new HeOperationsService(store, () => clockTime, (p) => `${p}_${idCounter++}`);

    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    service.addTeamMember({userId: "u_editor", displayName: "Jane Editor", roles: ["EDITOR"], status: "ACTIVE"}, "u_owner");

    return {service, store};
  };

  // Section 11: getNotifications is pure and causes ZERO mutations
  it("ensures getNotifications() is a side-effect-free pure query", () => {
    const {service, store} = setup();

    const t = service.createTask({title: "Edit Video", priority: "HIGH"}, "u_owner");
    service.assignTask(t.taskId, "u_editor", "u_owner");

    const notifsBefore = service.getNotifications("u_editor");
    const countBefore = store.listNotifications().length;
    const actCountBefore = store.listActivity().length;

    // Call getNotifications multiple times
    const notifs1 = service.getNotifications("u_editor");
    const notifs2 = service.getNotifications("u_editor");

    expect(notifs1.length).toBe(notifsBefore.length);
    expect(notifs2.length).toBe(notifsBefore.length);
    expect(store.listNotifications().length).toBe(countBefore);
    expect(store.listActivity().length).toBe(actCountBefore);
  });

  // Section 12: Unified Blocker Detection generates TASK_BLOCKED even in BACKLOG state
  it("generates TASK_BLOCKED for downstream task in BACKLOG when blocked by dependency", () => {
    const {service} = setup();

    const tUpstream = service.createTask({title: "Scriptwriting", priority: "HIGH"}, "u_owner");
    const tDownstream = service.createTask({title: "Voiceover Recording", priority: "URGENT"}, "u_owner");

    service.assignTask(tDownstream.taskId, "u_editor", "u_owner");

    // Create BLOCKS dependency
    service.createDependency({
      upstreamType: "TASK",
      upstreamId: tUpstream.taskId,
      downstreamType: "TASK",
      downstreamId: tDownstream.taskId,
      dependencyKind: "BLOCKS"
    }, "u_owner");

    // Downstream task is in BACKLOG status but effectively blocked by tUpstream
    const editorNotifs = service.getNotifications("u_editor");
    const blockedNotif = editorNotifs.find(n => n.type === "TASK_BLOCKED");

    expect(blockedNotif).toBeDefined();
    expect(blockedNotif?.targetRef.targetId).toBe(tDownstream.taskId);
    expect(blockedNotif?.message).toContain("blocked by upstream dependencies");
  });
});
