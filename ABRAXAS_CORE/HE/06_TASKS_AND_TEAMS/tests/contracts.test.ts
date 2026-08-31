import {describe, expect, it} from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("All 9 Operations Contracts Reconciliation (Gate P2 Repair-04)", () => {
  const contractsDir = "/Users/lordjef/Desktop/abraxasos/ABRAXAS_CORE/contracts/operations";
  const runtimeTypesFile = "/Users/lordjef/Desktop/abraxasos/ABRAXAS_CORE/HE/06_TASKS_AND_TEAMS/runtime/types.ts";

  const expectedContractFiles = [
    "TASK_CONTRACT_V1.md",
    "RECORDING_SESSION_CONTRACT_V1.md",
    "DEADLINE_CONTRACT_V1.md",
    "APPROVAL_CONTRACT_V1.md",
    "RBAC_CONTRACT_V1.md",
    "TIME_ENTRY_CONTRACT_V1.md",
    "NOTIFICATION_CONTRACT_V1.md",
    "DEPENDENCY_OVERRIDE_CONTRACT_V1.md",
    "ACTIVITY_CONTRACT_V1.md"
  ];

  it("verifies all 9 operational contracts are present, read, and verified against runtime types", () => {
    expect(expectedContractFiles.length).toBe(9);

    const runtimeCode = fs.readFileSync(runtimeTypesFile, "utf-8");
    let verifiedCount = 0;

    for (const filename of expectedContractFiles) {
      const fullPath = path.join(contractsDir, filename);
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, "utf-8");
      expect(content.length).toBeGreaterThan(50);
      verifiedCount++;
    }

    expect(verifiedCount).toBe(9);

    // 1. TASK_CONTRACT_V1.md
    const taskContract = fs.readFileSync(path.join(contractsDir, "TASK_CONTRACT_V1.md"), "utf-8");
    const taskStatuses = ["BACKLOG", "READY", "IN_PROGRESS", "REVIEW", "BLOCKED", "DONE", "CANCELLED"];
    for (const s of taskStatuses) {
      expect(taskContract).toContain(`"${s}"`);
      expect(runtimeCode).toContain(`"${s}"`);
    }
    const taskPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    for (const p of taskPriorities) {
      expect(taskContract).toContain(`"${p}"`);
      expect(runtimeCode).toContain(`"${p}"`);
    }
    const taskTargetTypes = [
      "PLAN", "LIENZO", "COMPONENT", "RECORDING_SESSION", "PUBLICATION_TARGET",
      "TASK", "EDIT_LOCK", "MOTION_PLAN", "LIENZO_COMPONENT", "COPY_VERSION", "COVER_VERSION", "NONE_EXTERNAL"
    ];
    for (const tt of taskTargetTypes) {
      expect(taskContract).toContain(`"${tt}"`);
      expect(runtimeCode).toContain(`"${tt}"`);
    }
    expect(taskContract).toContain("scheduledStartAt");
    expect(runtimeCode).toContain("scheduledStartAt");

    // 2. APPROVAL_CONTRACT_V1.md
    const approvalContract = fs.readFileSync(path.join(contractsDir, "APPROVAL_CONTRACT_V1.md"), "utf-8");
    const approvalDecisions = ["PENDING", "APPROVED", "CHANGES_REQUESTED", "REJECTED", "CANCELLED"];
    for (const d of approvalDecisions) {
      expect(approvalContract).toContain(`"${d}"`);
      expect(runtimeCode).toContain(`"${d}"`);
    }
    const approvalTargets = [
      "TASK", "LIENZO_COMPONENT", "COPY_VERSION", "COVER_VERSION", "EDIT_LOCK", "MOTION_PLAN", "PUBLICATION_TARGET"
    ];
    for (const t of approvalTargets) {
      expect(approvalContract).toContain(`"${t}"`);
      expect(runtimeCode).toContain(`"${t}"`);
    }

    // 3. RBAC_CONTRACT_V1.md
    const rbacContract = fs.readFileSync(path.join(contractsDir, "RBAC_CONTRACT_V1.md"), "utf-8");
    const permissions = [
      "task.create", "task.edit", "task.assign", "task.change_state", "task.override_dependency", "task.review",
      "deadline.create", "deadline.edit", "recording.create", "recording.edit", "recording.confirm",
      "approval.request", "approval.decide", "approval.decide_any", "team.view", "team.manage",
      "lienzo.view", "lienzo.edit", "publication.view", "publication.schedule", "metrics.view", "provider.configure"
    ];
    for (const perm of permissions) {
      expect(rbacContract).toContain(perm);
      expect(runtimeCode).toContain(`"${perm}"`);
    }

    // 4. DEADLINE_CONTRACT_V1.md
    const deadlineContract = fs.readFileSync(path.join(contractsDir, "DEADLINE_CONTRACT_V1.md"), "utf-8");
    const deadlineRisks = ["COMPLETED", "OVERDUE", "DUE_SOON", "AT_RISK", "ON_TRACK"];
    for (const r of deadlineRisks) {
      expect(deadlineContract).toContain(r);
      expect(runtimeCode).toContain(`"${r}"`);
    }
    const deadlineTargets = ["PLAN", "LIENZO", "COMPONENT", "TASK", "RECORDING_SESSION", "PUBLICATION_TARGET"];
    for (const dt of deadlineTargets) {
      expect(deadlineContract).toContain(dt);
      expect(runtimeCode).toContain(dt);
    }

    // 5. RECORDING_SESSION_CONTRACT_V1.md
    const recordingContract = fs.readFileSync(path.join(contractsDir, "RECORDING_SESSION_CONTRACT_V1.md"), "utf-8");
    const recordingStatuses = ["DRAFT", "PROPOSED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
    for (const s of recordingStatuses) {
      expect(recordingContract).toContain(s);
      expect(runtimeCode).toContain(`"${s}"`);
    }
    const recordingLocations = ["PHYSICAL", "REMOTE", "TBD"];
    for (const loc of recordingLocations) {
      expect(recordingContract).toContain(loc);
      expect(runtimeCode).toContain(`"${loc}"`);
    }

    // 6. DEPENDENCY_OVERRIDE_CONTRACT_V1.md
    const depContract = fs.readFileSync(path.join(contractsDir, "DEPENDENCY_OVERRIDE_CONTRACT_V1.md"), "utf-8");
    const depKinds = ["BLOCKS", "REQUIRES_APPROVAL", "REQUIRES_COMPLETION", "INFORMATIONAL"];
    for (const k of depKinds) {
      expect(depContract).toContain(`"${k}"`);
      expect(runtimeCode).toContain(`"${k}"`);
    }
    const depNodeTypes = [
      "TASK", "LIENZO_COMPONENT", "COPY_VERSION", "COVER_VERSION", "EDIT_LOCK",
      "MOTION_PLAN", "PUBLICATION_TARGET", "PLAN", "LIENZO", "COMPONENT", "RECORDING_SESSION"
    ];
    for (const dnt of depNodeTypes) {
      expect(depContract).toContain(dnt);
      expect(runtimeCode).toContain(dnt);
    }
    expect(depContract).toContain("overrideId");
    expect(depContract).toContain("targetTaskId");
    expect(runtimeCode).toContain("overrideId");
    expect(runtimeCode).toContain("targetTaskId");

    // 7. ACTIVITY_CONTRACT_V1.md
    const actContract = fs.readFileSync(path.join(contractsDir, "ACTIVITY_CONTRACT_V1.md"), "utf-8");
    const activityTypes = [
      "BOOTSTRAP_INITIALIZED", "TASK_CREATED", "TASK_UPDATED", "TASK_ASSIGNED", "TASK_UNASSIGNED",
      "TASK_STATUS_CHANGED", "DEPENDENCY_CREATED", "DEPENDENCY_REMOVED", "DEADLINE_CREATED",
      "DEADLINE_UPDATED", "RECORDING_CREATED", "RECORDING_UPDATED", "RECORDING_CONFIRMED",
      "RECORDING_CANCELLED", "APPROVAL_REQUESTED", "APPROVAL_DECIDED", "APPROVAL_CANCELLED",
      "OVERRIDE_APPLIED"
    ];
    for (const act of activityTypes) {
      expect(actContract).toContain(act);
      expect(runtimeCode).toContain(`"${act}"`);
    }

    // 8. TIME_ENTRY_CONTRACT_V1.md
    const timeContract = fs.readFileSync(path.join(contractsDir, "TIME_ENTRY_CONTRACT_V1.md"), "utf-8");
    const timeSources = ["MANUAL", "TIMER", "INTEGRATION"];
    for (const ts of timeSources) {
      expect(timeContract).toContain(`"${ts}"`);
      expect(runtimeCode).toContain(`"${ts}"`);
    }

    // 9. NOTIFICATION_CONTRACT_V1.md
    const notifContract = fs.readFileSync(path.join(contractsDir, "NOTIFICATION_CONTRACT_V1.md"), "utf-8");
    const notifTypes = [
      "TASK_ASSIGNED", "DEADLINE_APPROACHING", "TASK_BLOCKED", "APPROVAL_REQUESTED",
      "APPROVAL_DECIDED", "RECORDING_REMINDER"
    ];
    for (const nt of notifTypes) {
      expect(notifContract).toContain(`"${nt}"`);
      expect(runtimeCode).toContain(`"${nt}"`);
    }
    const notifSeverities = ["INFO", "WARNING", "URGENT"];
    for (const ns of notifSeverities) {
      expect(notifContract).toContain(`"${ns}"`);
      expect(runtimeCode).toContain(`"${ns}"`);
    }
  });
});
