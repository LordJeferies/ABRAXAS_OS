import {describe, expect, it} from "vitest";
import {HeOperationsService} from "../runtime/service.ts";
import {MemoryOperationsStore} from "../runtime/store.ts";
import {SecurityError} from "../runtime/rbac.ts";

describe("He Time Tracking Core & Security (Gate P3B Repair)", () => {
  const setup = () => {
    const store = new MemoryOperationsStore();
    let clockTime = "2026-08-30T10:00:00Z";
    const clock = () => clockTime;
    let idCounter = 1;
    const idProvider = (p: string) => `${p}_${idCounter++}`;
    const service = new HeOperationsService(store, clock, idProvider);

    // Bootstrap
    service.bootstrapOwner({userId: "u_owner", displayName: "Owner User"});

    // Add manager, editor, viewer
    service.addTeamMember({
      userId: "u_mgr",
      displayName: "Manager User",
      roles: ["MANAGER"],
      status: "ACTIVE"
    }, "u_owner");

    service.addTeamMember({
      userId: "u_editor",
      displayName: "Editor User",
      roles: ["EDITOR"],
      status: "ACTIVE"
    }, "u_owner");

    service.addTeamMember({
      userId: "u_viewer",
      displayName: "Viewer User",
      roles: ["VIEWER"],
      status: "ACTIVE"
    }, "u_owner");

    const task = service.createTask({title: "Edit Reel A", priority: "HIGH"}, "u_owner");
    service.assignTask(task.taskId, "u_editor", "u_owner");

    return {service, store, setTime: (t: string) => { clockTime = t; }, task};
  };

  // 1. Timer Lifecycle
  it("executes full timer lifecycle: start -> pause -> resume -> stop", () => {
    const {service, setTime, task} = setup();

    setTime("2026-08-30T10:00:00Z");
    const session = service.startTimer(task.taskId, "u_editor", "Initial cut");
    expect(session.status).toBe("RUNNING");

    // 10 minutes later -> pause
    setTime("2026-08-30T10:10:00Z");
    const paused = service.pauseTimer(session.timerId, "u_editor");
    expect(paused.status).toBe("PAUSED");
    expect(paused.accumulatedSeconds).toBe(600);

    // 5 minutes later -> resume
    setTime("2026-08-30T10:15:00Z");
    const resumed = service.resumeTimer(session.timerId, "u_editor");
    expect(resumed.status).toBe("RUNNING");

    // 20 minutes later -> stop
    setTime("2026-08-30T10:35:00Z");
    const entry = service.stopTimer(session.timerId, "u_editor", "Finished reel cut");
    expect(entry.durationSeconds).toBe(1800); // 10 min + 20 min = 30 min = 1800s
    expect(entry.userId).toBe("u_editor");
    expect(entry.source).toBe("TIMER");

    // Timer session should be removed
    expect(service.getActiveTimerSession("u_editor")).toBeUndefined();
  });

  // 2. Single active timer invariant
  it("rejects second concurrent active timer for the same user", () => {
    const {service, task} = setup();
    service.startTimer(task.taskId, "u_editor");
    expect(() => service.startTimer(task.taskId, "u_editor")).toThrow(/already has an active timer/);
  });

  // 3. Time Query RBAC Permissions
  it("enforces strict actor authority on time report and entries queries", () => {
    const {service, setTime, task} = setup();
    setTime("2026-08-30T10:00:00Z");
    const s = service.startTimer(task.taskId, "u_editor");
    setTime("2026-08-30T10:30:00Z");
    service.stopTimer(s.timerId, "u_editor");

    // VIEWER own time report -> allowed
    const viewerReport = service.getTimeReport("u_viewer", {userId: "u_viewer"});
    expect(viewerReport.totalSeconds).toBe(0);

    // VIEWER querying editor time report -> denied
    expect(() => service.getTimeReport("u_viewer", {userId: "u_editor"})).toThrow(SecurityError);

    // VIEWER querying team wide -> denied
    expect(() => service.getTimeReport("u_viewer")).toThrow(SecurityError);

    // EDITOR querying own time report -> allowed
    const editorReport = service.getTimeReport("u_editor", {userId: "u_editor"});
    expect(editorReport.totalSeconds).toBe(1800);

    // EDITOR querying team wide -> denied
    expect(() => service.getTimeReport("u_editor")).toThrow(SecurityError);

    // MANAGER querying team wide -> allowed
    const mgrReport = service.getTimeReport("u_mgr");
    expect(mgrReport.totalSeconds).toBe(1800);
  });

  // 4. Timer Stop Atomicity
  it("ensures atomic stop timer completion without dangling state", () => {
    const {service, setTime, task, store} = setup();
    setTime("2026-08-30T10:00:00Z");
    const s = service.startTimer(task.taskId, "u_editor");
    setTime("2026-08-30T10:15:00Z");

    const entry = service.stopTimer(s.timerId, "u_editor");
    expect(entry.durationSeconds).toBe(900);
    expect(store.getTimerSession(s.timerId)).toBeUndefined();
    expect(store.getTimeEntry(entry.timeEntryId)).toBeDefined();
  });
});
