import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, TasksView} from "../../ui/index.ts";

describe("UI Integration — Tasks Manager (AC-P3A-006)", () => {
  it("renders tasks table and create form", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    service.createTask({title: "Render Promo Reel", priority: "HIGH"}, "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <TasksView />
      </HeProvider>
    );

    expect(html).toContain("Tasks Manager");
    expect(html).toContain("Render Promo Reel");
    expect(html).toContain("BACKLOG");
    expect(html).toContain("HIGH");
  });
});
