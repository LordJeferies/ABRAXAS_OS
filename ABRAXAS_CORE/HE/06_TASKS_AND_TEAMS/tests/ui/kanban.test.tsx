import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, KanbanView} from "../../ui/index.ts";

describe("UI Integration — Kanban Projection (AC-P3A-007, AC-P3A-008)", () => {
  it("renders 6 kanban columns and places blocked task in Blocked column", () => {
    const store = new MemoryOperationsStore();
    let idCounter = 1;
    const service = new HeOperationsService(store, () => "2026-08-30T12:00:00Z", (p) => `${p}_${idCounter++}`);

    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    const upTask = service.createTask({title: "Script"}, "u_owner");
    const downTask = service.createTask({title: "Assembly"}, "u_owner");

    service.createDependency({
      upstreamType: "TASK", upstreamId: upTask.taskId, downstreamType: "TASK", downstreamId: downTask.taskId,
      dependencyKind: "BLOCKS"
    }, "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <KanbanView />
      </HeProvider>
    );

    expect(html).toContain("Operational Kanban");
    expect(html).toContain("Backlog (1)");
    expect(html).toContain("Blocked (1)");
    expect(html).toContain("Assembly");
  });
});
