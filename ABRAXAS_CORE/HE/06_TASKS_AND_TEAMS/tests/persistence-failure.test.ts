import {describe, expect, it} from "vitest";
import fs from "node:fs";
import path from "node:path";
import {HeOperationsService} from "../runtime/service.ts";
import {JsonFileOperationsStore, LocalStorageOperationsStore} from "../runtime/store.ts";
import {validateOperationsState} from "../runtime/persistence-validator.ts";

describe("Persistence Failure Injection & Atomicity (Sections 6, 7, 8, 9, 10)", () => {
  const tmpDir = "/tmp/he_persistence_failure_tests";
  const tmpFile = path.join(tmpDir, "store_fail.json");

  const cleanTmp = () => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, {recursive: true, force: true});
  };

  // Section 7: Shared Validator fails closed on invalid payload
  it("fails closed on invalid structural payload and throws descriptive error", () => {
    expect(() => validateOperationsState(null)).toThrow(/non-null object/);
    expect(() => validateOperationsState({schemaVersion: 1})).toThrow(/expected schemaVersion 2/);
    expect(() => validateOperationsState({
      schemaVersion: 2,
      members: [{userId: "u1", displayName: "Bad", status: "INVALID_STATUS", roles: []}],
      tasks: [], assignments: [], dependencies: [], deadlines: [], recordingSessions: [], approvals: [], activity: [], overrides: [], timerSessions: [], timeEntries: [], notifications: []
    })).toThrow(/Structural error in TeamMember/);
  });

  // Section 8: LocalStorage write failure rolls back in-memory mutation
  it("rolls back in-memory state when LocalStorage write fails", () => {
    const storage = new Map<string, string>();
    let throwOnSet = false;

    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => storage.get(k) ?? null,
        setItem: (k: string, v: string) => {
          if (throwOnSet) throw new Error("QuotaExceededError: Storage quota full");
          storage.set(k, v);
        }
      }
    };

    const store = new LocalStorageOperationsStore("__TEST_STORE__");
    let idCounter = 1;
    const service = new HeOperationsService(store, () => "2026-08-30T10:00:00Z", (p) => `${p}_${idCounter++}`);

    service.bootstrapOwner({userId: "u_owner", displayName: "Owner"});
    expect(store.listTeamMembers().length).toBe(1);

    // Inject write failure
    throwOnSet = true;
    expect(() => {
      service.createTask({title: "Failed Write Task", priority: "HIGH"}, "u_owner");
    }).toThrow(/QuotaExceededError/);

    // In-memory tasks should NOT retain the failed task
    expect(store.listTasks().length).toBe(0);

    delete (globalThis as any).window;
  });

  // Section 7 & 9: Timer Stop Atomicity failure rollback with exact activity and entry assertions
  it("rolls back timer stop transaction when persistence fails, preserving active timer and exact activity count", () => {
    cleanTmp();
    fs.mkdirSync(tmpDir, {recursive: true});

    const store = new JsonFileOperationsStore(tmpFile);
    let clockTime = "2026-08-30T10:00:00Z";
    let idCounter = 1;
    const service = new HeOperationsService(store, () => clockTime, (p) => `${p}_${idCounter++}`);

    service.bootstrapOwner({userId: "u_owner", displayName: "Owner"});
    const task = service.createTask({title: "Audio Render", priority: "HIGH"}, "u_owner");
    service.assignTask(task.taskId, "u_owner", "u_owner");

    const timer = service.startTimer(task.taskId, "u_owner");
    expect(service.getActiveTimerSession("u_owner")).toBeDefined();

    const timeEntriesCountBefore = store.listTimeEntries().length;
    const timerStoppedCountBefore = store.listActivity().filter(a => a.entryType === "TIME_TIMER_STOPPED").length;
    const timeEntryCreatedCountBefore = store.listActivity().filter(a => a.entryType === "TIME_ENTRY_CREATED").length;

    // Inject disk write failure during stopTimer flush
    clockTime = "2026-08-30T10:30:00Z";
    const originalFlush = (store as any).flush.bind(store);
    (store as any).flush = () => {
      throw new Error("DiskIOError: Simulated write failure during timer completion");
    };

    // Attempt to stop timer -> must fail
    expect(() => service.stopTimer(timer.timerId, "u_owner")).toThrow(/DiskIOError/);

    // State after failed stop:
    // 1. TimerSession still exists
    expect(service.getActiveTimerSession("u_owner")).toBeDefined();
    // 2. TimeEntry count unchanged
    expect(store.listTimeEntries().length).toBe(timeEntriesCountBefore);
    // 3. TIME_TIMER_STOPPED count unchanged
    expect(store.listActivity().filter(a => a.entryType === "TIME_TIMER_STOPPED").length).toBe(timerStoppedCountBefore);
    // 4. TIME_ENTRY_CREATED count unchanged
    expect(store.listActivity().filter(a => a.entryType === "TIME_ENTRY_CREATED").length).toBe(timeEntryCreatedCountBefore);

    // Restore flush and execute successful retry
    (store as any).flush = originalFlush;
    const entry = service.stopTimer(timer.timerId, "u_owner");

    expect(entry.durationSeconds).toBe(1800);
    expect(service.getActiveTimerSession("u_owner")).toBeUndefined();
    expect(store.listTimeEntries().length).toBe(timeEntriesCountBefore + 1);
    expect(store.listActivity().filter(a => a.entryType === "TIME_TIMER_STOPPED").length).toBe(timerStoppedCountBefore + 1);
    expect(store.listActivity().filter(a => a.entryType === "TIME_ENTRY_CREATED").length).toBe(timeEntryCreatedCountBefore + 1);

    cleanTmp();
  });

  // Section 6: Migration Write/Rename Failure Atomicity (Real Failure Injection)
  it("preserves canonical V1 file byte-identically and creates valid backup when migration write/rename fails", () => {
    cleanTmp();
    fs.mkdirSync(tmpDir, {recursive: true});

    const validV1Content = JSON.stringify({
      schemaVersion: 1,
      members: [{userId: "u_1", displayName: "Migrated User", status: "ACTIVE", roles: ["OWNER"], createdAt: "2026-08-30T10:00:00Z"}],
      tasks: [{taskId: "t_1", title: "T1", status: "BACKLOG", priority: "MEDIUM", createdBy: "u_1", createdAt: "2026-08-30T10:00:00Z", updatedAt: "2026-08-30T10:00:00Z"}],
      assignments: [], dependencies: [], deadlines: [], recordingSessions: [], approvals: [], activity: [], overrides: []
    }, null, 2);

    fs.writeFileSync(tmpFile, validV1Content, "utf-8");
    const originalBytes = fs.readFileSync(tmpFile, "utf-8");

    // Inject failure during renameSync before canonical replacement
    const originalRenameSync = fs.renameSync;
    let renameCalled = false;
    (fs as any).renameSync = (oldP: string, newP: string) => {
      renameCalled = true;
      throw new Error("EPERM: Simulated permission failure during atomic migration rename");
    };

    try {
      expect(() => new JsonFileOperationsStore(tmpFile)).toThrow(/EPERM/);
    } finally {
      (fs as any).renameSync = originalRenameSync;
    }

    expect(renameCalled).toBe(true);

    // 1. Canonical file after failed migration MUST equal originalBytes
    const canonicalBytesAfterFail = fs.readFileSync(tmpFile, "utf-8");
    expect(canonicalBytesAfterFail).toBe(originalBytes);

    // 2. Backup file MUST exist and equal originalBytes
    const files = fs.readdirSync(tmpDir);
    const backupFileName = files.find(f => f.includes(".v1.bak."));
    expect(backupFileName).toBeDefined();
    const backupContent = fs.readFileSync(path.join(tmpDir, backupFileName!), "utf-8");
    expect(backupContent).toBe(originalBytes);

    // 3. Subsequent retry without failure successfully migrates to V2
    const store = new JsonFileOperationsStore(tmpFile);
    const v2Content = JSON.parse(fs.readFileSync(tmpFile, "utf-8"));
    expect(v2Content.schemaVersion).toBe(2);
    expect(store.listTeamMembers().length).toBe(1);
    expect(store.listTasks().length).toBe(1);

    cleanTmp();
  });
});
