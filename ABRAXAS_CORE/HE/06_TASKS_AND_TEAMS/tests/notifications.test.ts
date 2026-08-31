import {describe, expect, it} from "vitest";
import {HeOperationsService} from "../runtime/service.ts";
import {MemoryOperationsStore} from "../runtime/store.ts";
import {SecurityError} from "../runtime/rbac.ts";

describe("He Notifications Engine & Security (Gate P3B Repair)", () => {
  const setup = () => {
    const store = new MemoryOperationsStore();
    let clockTime = "2026-08-30T10:00:00Z";
    const clock = () => clockTime;
    let idCounter = 1;
    const idProvider = (p: string) => `${p}_${idCounter++}`;
    const service = new HeOperationsService(store, clock, idProvider);

    service.bootstrapOwner({userId: "u_owner", displayName: "Owner"});

    service.addTeamMember({
      userId: "u_mgr",
      displayName: "Manager",
      roles: ["MANAGER"],
      status: "ACTIVE"
    }, "u_owner");

    service.addTeamMember({
      userId: "u_editor",
      displayName: "Editor",
      roles: ["EDITOR"],
      status: "ACTIVE"
    }, "u_owner");

    service.addTeamMember({
      userId: "u_viewer",
      displayName: "Viewer",
      roles: ["VIEWER"],
      status: "ACTIVE"
    }, "u_owner");

    return {service, store, setTime: (t: string) => { clockTime = t; }};
  };

  // 1. Generation of TASK_ASSIGNED, TASK_COMPLETED, TASK_BLOCKED, WAITING_FOR_YOU, DEPENDENCY_RESOLVED
  it("generates complete set of operational notifications", () => {
    const {service, setTime} = setup();

    const t1 = service.createTask({title: "Script Review", priority: "HIGH"}, "u_owner");
    const t2 = service.createTask({title: "Video Assembly", priority: "URGENT"}, "u_owner");

    // Assign t1 to u_editor, t2 to u_viewer
    service.assignTask(t1.taskId, "u_editor", "u_owner");
    service.assignTask(t2.taskId, "u_viewer", "u_owner");

    // Create blocking dependency: t1 blocks t2
    service.createDependency({
      upstreamType: "TASK",
      upstreamId: t1.taskId,
      downstreamType: "TASK",
      downstreamId: t2.taskId,
      dependencyKind: "BLOCKS"
    }, "u_owner");

    // Check TASK_ASSIGNED for u_editor
    const editorNotifs1 = service.getNotifications("u_editor");
    expect(editorNotifs1.some(n => n.type === "TASK_ASSIGNED")).toBe(true);

    // Check WAITING_FOR_YOU for u_editor (upstream assignee)
    expect(editorNotifs1.some(n => n.type === "WAITING_FOR_YOU")).toBe(true);

    // Complete t1
    service.transitionTask(t1.taskId, "READY", "u_editor");
    service.transitionTask(t1.taskId, "IN_PROGRESS", "u_editor");
    service.transitionTask(t1.taskId, "DONE", "u_editor");

    // Check TASK_COMPLETED for creator (u_owner)
    const ownerNotifs = service.getNotifications("u_owner");
    expect(ownerNotifs.some(n => n.type === "TASK_COMPLETED")).toBe(true);

    // Check DEPENDENCY_RESOLVED for downstream assignee (u_viewer)
    const viewerNotifs = service.getNotifications("u_viewer");
    expect(viewerNotifs.some(n => n.type === "DEPENDENCY_RESOLVED")).toBe(true);
  });

  // 2. Deadline notifications routed to active assignees
  it("routes task deadline alerts to active assignees", () => {
    const {service, setTime} = setup();
    const task = service.createTask({title: "Master Delivery", priority: "URGENT"}, "u_owner");
    service.assignTask(task.taskId, "u_editor", "u_owner");

    // Set deadline 24h away (within 48h approaching window)
    setTime("2026-08-30T10:00:00Z");
    service.setDeadline({
      targetType: "TASK",
      targetId: task.taskId,
      dueAt: "2026-08-31T10:00:00Z",
      timezone: "America/Bogota"
    }, "u_owner");

    const editorNotifs = service.getNotifications("u_editor");
    expect(editorNotifs.some(n => n.type === "DEADLINE_APPROACHING")).toBe(true);
  });

  // 3. True cross-user read denial & isolation
  it("strictly enforces cross-user notification read isolation and manager bypass", () => {
    const {service} = setup();
    const task = service.createTask({title: "Audio Mix", priority: "MEDIUM"}, "u_owner");
    service.assignTask(task.taskId, "u_editor", "u_owner");

    const editorNotifs = service.getNotifications("u_editor");
    const editorNotif = editorNotifs.find(n => n.type === "TASK_ASSIGNED");
    expect(editorNotif).toBeDefined();

    // VIEWER attempts to mark editor's notification read -> denied
    expect(() => service.markNotificationRead(editorNotif!.notificationId, "u_viewer")).toThrow(SecurityError);

    // EDITOR marks own notification read -> allowed
    const readBySelf = service.markNotificationRead(editorNotif!.notificationId, "u_editor");
    expect(readBySelf.readAt).toBeDefined();

    // MANAGER marks another notification read -> allowed via team.manage
    const task2 = service.createTask({title: "Color Grading", priority: "HIGH"}, "u_owner");
    service.assignTask(task2.taskId, "u_viewer", "u_owner");
    const viewerNotifs = service.getNotifications("u_viewer");
    const viewerNotif = viewerNotifs.find(n => n.type === "TASK_ASSIGNED");
    expect(viewerNotif).toBeDefined();

    const readByMgr = service.markNotificationRead(viewerNotif!.notificationId, "u_mgr");
    expect(readByMgr.readAt).toBeDefined();
  });
});
