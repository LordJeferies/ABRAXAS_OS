import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, TeamDashboardView, PeopleView} from "../../ui/index.ts";

describe("UI Integration — Team Dashboard & People View (AC-P3A-005, AC-P3A-013)", () => {
  it("renders team workload with active tasks and blocked work waiting-for graph", () => {
    const store = new MemoryOperationsStore();
    let idCounter = 1;
    const service = new HeOperationsService(store, () => "2026-08-30T12:00:00Z", (p) => `${p}_${idCounter++}`);

    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    service.addTeamMember({userId: "u_editor", displayName: "Editor Jane", status: "ACTIVE", roles: ["EDITOR"]}, "u_owner");

    const upTask = service.createTask({title: "Clean Audio", priority: "HIGH"}, "u_owner");
    const downTask = service.createTask({title: "Add Motion VFX", priority: "URGENT"}, "u_owner");

    service.assignTask(upTask.taskId, "u_owner", "u_owner");
    service.assignTask(downTask.taskId, "u_editor", "u_owner");

    service.createDependency({
      upstreamType: "TASK", upstreamId: upTask.taskId, downstreamType: "TASK", downstreamId: downTask.taskId,
      dependencyKind: "BLOCKS"
    }, "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <TeamDashboardView />
      </HeProvider>
    );

    expect(html).toContain("Team Operations Dashboard");
    expect(html).toContain("Member Workload &amp; Active Work (2)");
    expect(html).toContain("Blocked Work &amp; Waiting-For Graph (1)");
    expect(html).toContain("Add Motion VFX");
    expect(html).toContain(`Waiting For Tasks: ${upTask.taskId}`);
    expect(html).toContain("Waiting For Users: u_owner");
  });

  it("renders PeopleView with registered member details", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <PeopleView />
      </HeProvider>
    );

    expect(html).toContain("Registered Team Members (1)");
    expect(html).toContain("Lead Owner");
    expect(html).toContain("OWNER");
  });
});
