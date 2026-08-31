import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, NotificationsView} from "../../ui/index.ts";

describe("UI Integration — Notification Center View (AC-P3B-010)", () => {
  it("renders notification center with unread count and notifications list", () => {
    const store = new MemoryOperationsStore();
    let idCounter = 1;
    const service = new HeOperationsService(store, () => "2026-08-30T12:00:00Z", (p) => `${p}_${idCounter++}`);

    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    const task = service.createTask({title: "Notification Test Task"}, "u_owner");
    service.assignTask(task.taskId, "u_owner", "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <NotificationsView />
      </HeProvider>
    );

    expect(html).toContain("Notification Center");
    expect(html).toContain("TASK_ASSIGNED");
    expect(html).toContain("You have been assigned to task");
  });
});
