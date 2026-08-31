import {describe, expect, it} from "vitest";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";

describe("UI Integration — Dependency-Specific Overrides (AC-P3A-008)", () => {
  it("executes explicit override with mandatory reason without unblocking other blockers", () => {
    const store = new MemoryOperationsStore();
    let idCounter = 1;
    const service = new HeOperationsService(store, () => "2026-08-30T12:00:00Z", (p) => `${p}_${idCounter++}`);

    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    const tA = service.createTask({title: "Script"}, "u_owner");
    const tB = service.createTask({title: "Audio"}, "u_owner");
    const tTarget = service.createTask({title: "Video Edit"}, "u_owner");
    service.assignTask(tTarget.taskId, "u_owner", "u_owner");

    const depA = service.createDependency({
      upstreamType: "TASK", upstreamId: tA.taskId, downstreamType: "TASK", downstreamId: tTarget.taskId,
      dependencyKind: "BLOCKS"
    }, "u_owner");

    const depB = service.createDependency({
      upstreamType: "TASK", upstreamId: tB.taskId, downstreamType: "TASK", downstreamId: tTarget.taskId,
      dependencyKind: "BLOCKS"
    }, "u_owner");

    // Override A only
    const ovrA = service.overrideDependency(tTarget.taskId, depA.dependencyId, "Producer authorized script outline", "u_owner");
    expect(ovrA.dependencyId).toBe(depA.dependencyId);

    // Target still blocked by B
    const solo = service.getSoloQueue("u_owner");
    expect(solo.blocked.some((t: any) => t.taskId === tTarget.taskId)).toBe(true);

    // Override B
    service.overrideDependency(tTarget.taskId, depB.dependencyId, "Producer authorized scratch voice", "u_owner");

    // Target now unblocked
    const soloUnblocked = service.getSoloQueue("u_owner");
    expect(soloUnblocked.blocked.some((t: any) => t.taskId === tTarget.taskId)).toBe(false);
  });
});
