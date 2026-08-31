import {describe, expect, it} from "vitest";
import fs from "node:fs";
import path from "node:path";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {JsonFileOperationsStore} from "../../runtime/infrastructure/index.ts";
import {
  HeProvider,
  HeProductShell,
  SoloQueueView,
  TeamDashboardView,
  TasksView,
  KanbanView,
  CalendarView,
  DeadlinesView,
  RecordingSessionsView,
  ReviewsView,
  PeopleView,
  ActivityView
} from "../../ui/index.ts";

describe("UI Runtime Smoke — Full Product Lifecycle & Persistence (AC-P3A-016)", () => {
  const tmpDir = "/tmp/he_ui_smoke_runtime_test";
  const tmpFile = path.join(tmpDir, "operations_store_v1.json");

  it("executes complete operational lifecycle through UI components and verifies persistence", () => {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, {recursive: true, force: true});

    const store = new JsonFileOperationsStore(tmpFile);
    let idCounter = 1;
    const service = new HeOperationsService(store, () => "2026-08-30T12:00:00Z", (p) => `${p}_${idCounter++}`);

    // 1. Bootstrap
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});
    service.addTeamMember({userId: "u_editor", displayName: "Editor Jane", status: "ACTIVE", roles: ["EDITOR"]}, "u_owner");

    // 2. Task lifecycle
    const task = service.createTask({title: "Complete P3A Productization", priority: "URGENT"}, "u_owner");
    service.assignTask(task.taskId, "u_editor", "u_owner");

    // 3. Approval request & resolution
    const approval = service.requestApproval({
      targetType: "TASK",
      targetId: task.taskId,
      reviewers: ["u_owner"],
      comments: "Review P3A implementation"
    }, "u_editor");

    service.decideApproval(approval.approvalId, "APPROVED", "u_owner", "LGTM");

    // 4. State transition
    service.transitionTask(task.taskId, "IN_PROGRESS", "u_editor");
    service.transitionTask(task.taskId, "DONE", "u_editor");

    // 5. Render all 10 views to prove reachability
    const views = [
      <SoloQueueView key="1" />,
      <TeamDashboardView key="2" />,
      <TasksView key="3" />,
      <KanbanView key="4" />,
      <CalendarView key="5" />,
      <DeadlinesView key="6" />,
      <RecordingSessionsView key="7" />,
      <ReviewsView key="8" />,
      <PeopleView key="9" />,
      <ActivityView key="10" />
    ];

    for (const view of views) {
      const rendered = renderToString(
        <HeProvider service={service} initialActorId="u_owner">
          {view}
        </HeProvider>
      );
      expect(rendered.length).toBeGreaterThan(50);
    }

    // 6. Reload from disk and verify full state parity
    const reloadedStore = new JsonFileOperationsStore(tmpFile);
    expect(reloadedStore.listTasks().length).toBe(1);
    expect(reloadedStore.getTask(task.taskId)?.status).toBe("DONE");
    expect(reloadedStore.listApprovals().length).toBe(1);
    expect(reloadedStore.listApprovals()[0]?.decision).toBe("APPROVED");
    expect(reloadedStore.listActivity().length).toBeGreaterThan(4);

    fs.rmSync(tmpDir, {recursive: true, force: true});
  });
});
