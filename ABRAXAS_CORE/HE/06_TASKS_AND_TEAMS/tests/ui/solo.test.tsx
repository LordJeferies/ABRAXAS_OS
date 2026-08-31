import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, SoloQueueView} from "../../ui/index.ts";

describe("UI Integration — Solo Queue Projection (AC-P3A-004)", () => {
  it("renders solo queue categories and pending user approvals", () => {
    const store = new MemoryOperationsStore();
    let idCounter = 1;
    const service = new HeOperationsService(store, () => "2026-08-30T12:00:00Z", (p) => `${p}_${idCounter++}`);

    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    service.addTeamMember({userId: "u_editor", displayName: "Editor Jane", status: "ACTIVE", roles: ["EDITOR"]}, "u_owner");

    const t1 = service.createTask({title: "Edit Vertical Reel", priority: "HIGH"}, "u_owner");
    service.assignTask(t1.taskId, "u_editor", "u_owner");

    service.requestApproval({
      targetType: "EDIT_LOCK",
      targetId: "lock_solo_01",
      reviewers: ["u_editor"]
    }, "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_editor">
        <SoloQueueView />
      </HeProvider>
    );

    expect(html).toContain("Solo Queue: Editor Jane");
    expect(html).toContain("Edit Vertical Reel");
    expect(html).toContain("Pending Approvals Waiting on You (1)");
    expect(html).toContain("EDIT_LOCK (lock_solo_01)");
  });
});
