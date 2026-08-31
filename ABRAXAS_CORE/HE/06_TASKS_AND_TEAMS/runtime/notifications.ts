import type {Notification} from "./types.ts";
import type {Task, TaskAssignment, Deadline, RecordingSession, Approval, Dependency, DependencyOverride} from "./types.ts";
import {evaluateTaskDependencies} from "./dependencies.ts";

export function generateOperationalNotifications(
  store: {
    listTasks: () => readonly Task[];
    listAssignments: () => readonly TaskAssignment[];
    listDeadlines: () => readonly Deadline[];
    listRecordingSessions: () => readonly RecordingSession[];
    listApprovals: () => readonly Approval[];
    listDependencies: () => readonly Dependency[];
    listOverrides: () => readonly DependencyOverride[];
    listNotifications: () => readonly Notification[];
  },
  nowIso: string,
  idProvider: (prefix: string) => string
): readonly Notification[] {
  const existingDedupe = new Set(store.listNotifications().map((n) => n.dedupeKey));
  const newNotifications: Notification[] = [];
  const nowMs = new Date(nowIso).getTime();

  const allTasks = store.listTasks();
  const allAssignments = store.listAssignments();
  const allDeps = store.listDependencies();
  const allOverrides = store.listOverrides();
  const allApprovals = store.listApprovals();

  // 1. Task assignments
  for (const asg of allAssignments) {
    if (asg.status === "ACTIVE") {
      const dedupeKey = `notif_asg_${asg.assignmentId}`;
      if (!existingDedupe.has(dedupeKey)) {
        existingDedupe.add(dedupeKey);
        newNotifications.push({
          notificationId: idProvider("notif"),
          userId: asg.userId,
          type: "TASK_ASSIGNED",
          targetRef: {targetType: "TASK", targetId: asg.taskId},
          createdAt: nowIso,
          severity: "INFO",
          message: `You have been assigned to task '${asg.taskId}'`,
          dedupeKey
        });
      }
    }
  }

  // 2. Task Completed
  for (const task of allTasks) {
    if (task.status === "DONE") {
      const dedupeKey = `notif_tsk_done_${task.taskId}_${task.version}`;
      if (!existingDedupe.has(dedupeKey)) {
        existingDedupe.add(dedupeKey);
        newNotifications.push({
          notificationId: idProvider("notif"),
          userId: task.createdBy,
          type: "TASK_COMPLETED",
          targetRef: {targetType: "TASK", targetId: task.taskId},
          createdAt: nowIso,
          severity: "INFO",
          message: `Task '${task.title}' has reached completed state`,
          dedupeKey
        });
      }
    }
  }

  // 3. Unified Blocker Detection: TASK_BLOCKED for downstream tasks
  for (const task of allTasks) {
    if (task.status !== "DONE" && task.status !== "CANCELLED") {
      const depEval = evaluateTaskDependencies(task, allTasks, allDeps, allOverrides, allApprovals, allAssignments);
      if (depEval.isBlocked || task.status === "BLOCKED") {
        const assignees = allAssignments.filter(a => a.taskId === task.taskId && a.status === "ACTIVE").map(a => a.userId);
        const recipients = assignees.length > 0 ? assignees : [task.createdBy];
        for (const uid of recipients) {
          const dedupeKey = `notif_tsk_blk_${task.taskId}_${uid}_${task.version}`;
          if (!existingDedupe.has(dedupeKey)) {
            existingDedupe.add(dedupeKey);
            newNotifications.push({
              notificationId: idProvider("notif"),
              userId: uid,
              type: "TASK_BLOCKED",
              targetRef: {targetType: "TASK", targetId: task.taskId},
              createdAt: nowIso,
              severity: "WARNING",
              message: `Task '${task.title}' is blocked by upstream dependencies (${depEval.reasons.join(", ")})`,
              dedupeKey
            });
          }
        }
      }
    }
  }

  // 4. WAITING_FOR_YOU & DEPENDENCY_RESOLVED
  for (const dep of allDeps) {
    if (dep.upstreamType === "TASK" && dep.downstreamType === "TASK") {
      const upstreamTask = allTasks.find(t => t.taskId === dep.upstreamId);
      const downstreamTask = allTasks.find(t => t.taskId === dep.downstreamId);

      if (upstreamTask && downstreamTask) {
        // WAITING_FOR_YOU: upstream task is not DONE, downstream task is waiting
        if (upstreamTask.status !== "DONE" && downstreamTask.status !== "CANCELLED" && downstreamTask.status !== "DONE") {
          const upstreamAssignees = allAssignments.filter(a => a.taskId === upstreamTask.taskId && a.status === "ACTIVE").map(a => a.userId);
          for (const uid of upstreamAssignees) {
            const dedupeKey = `notif_waiting_for_you_${dep.dependencyId}_${uid}`;
            if (!existingDedupe.has(dedupeKey)) {
              existingDedupe.add(dedupeKey);
              newNotifications.push({
                notificationId: idProvider("notif"),
                userId: uid,
                type: "WAITING_FOR_YOU",
                targetRef: {targetType: "TASK", targetId: upstreamTask.taskId},
                createdAt: nowIso,
                severity: "INFO",
                message: `Task '${downstreamTask.title}' is waiting for your task '${upstreamTask.title}' to complete`,
                dedupeKey
              });
            }
          }
        }

        // DEPENDENCY_RESOLVED: upstream task is DONE, downstream task is active
        if (upstreamTask.status === "DONE" && downstreamTask.status !== "DONE" && downstreamTask.status !== "CANCELLED") {
          const downstreamAssignees = allAssignments.filter(a => a.taskId === downstreamTask.taskId && a.status === "ACTIVE").map(a => a.userId);
          for (const uid of downstreamAssignees) {
            const dedupeKey = `notif_dep_res_${dep.dependencyId}_${uid}`;
            if (!existingDedupe.has(dedupeKey)) {
              existingDedupe.add(dedupeKey);
              newNotifications.push({
                notificationId: idProvider("notif"),
                userId: uid,
                type: "DEPENDENCY_RESOLVED",
                targetRef: {targetType: "TASK", targetId: downstreamTask.taskId},
                createdAt: nowIso,
                severity: "INFO",
                message: `Dependency on '${upstreamTask.title}' is resolved for your task '${downstreamTask.title}'`,
                dedupeKey
              });
            }
          }
        }
      }
    }
  }

  // 5. Approvals
  for (const app of store.listApprovals()) {
    if (app.decision === "PENDING") {
      for (const reviewerId of app.reviewers) {
        const dedupeKey = `notif_app_req_${app.approvalId}_${reviewerId}`;
        if (!existingDedupe.has(dedupeKey)) {
          existingDedupe.add(dedupeKey);
          newNotifications.push({
            notificationId: idProvider("notif"),
            userId: reviewerId,
            type: "REVIEW_REQUESTED",
            targetRef: {targetType: app.targetType as any, targetId: app.targetId},
            createdAt: nowIso,
            severity: "WARNING",
            message: `Review requested for ${app.targetType} '${app.targetId}'`,
            dedupeKey
          });
        }
      }
    } else if (app.decision === "APPROVED" || app.decision === "CHANGES_REQUESTED" || app.decision === "REJECTED") {
      const dedupeKey = `notif_app_dec_${app.approvalId}_${app.version}`;
      if (!existingDedupe.has(dedupeKey)) {
        existingDedupe.add(dedupeKey);
        newNotifications.push({
          notificationId: idProvider("notif"),
          userId: app.requestedBy,
          type: "APPROVAL_DECIDED",
          targetRef: {targetType: app.targetType as any, targetId: app.targetId},
          createdAt: nowIso,
          severity: app.decision === "APPROVED" ? "INFO" : "WARNING",
          message: `Review decision on ${app.targetType} '${app.targetId}': ${app.decision}`,
          dedupeKey
        });
      }
    }
  }

  // 6. Deadlines
  for (const dl of store.listDeadlines()) {
    if (dl.status === "ACTIVE") {
      const dueMs = new Date(dl.dueAt).getTime();
      const diffHours = (dueMs - nowMs) / (1000 * 60 * 60);

      let recipientUserIds: string[] = [];
      if (dl.targetType === "TASK") {
        const activeAsgs = allAssignments.filter(a => a.taskId === dl.targetId && a.status === "ACTIVE").map(a => a.userId);
        recipientUserIds = activeAsgs.length > 0 ? activeAsgs : [dl.createdBy];
      } else {
        recipientUserIds = [dl.createdBy];
      }

      if (nowMs > dueMs) {
        for (const uid of recipientUserIds) {
          const dedupeKey = `notif_dl_missed_${dl.deadlineId}_${uid}`;
          if (!existingDedupe.has(dedupeKey)) {
            existingDedupe.add(dedupeKey);
            newNotifications.push({
              notificationId: idProvider("notif"),
              userId: uid,
              type: "DEADLINE_MISSED",
              targetRef: {targetType: dl.targetType as any, targetId: dl.targetId},
              createdAt: nowIso,
              severity: "URGENT",
              message: `Deadline missed for ${dl.targetType} '${dl.targetId}' (was due ${dl.dueAt})`,
              dedupeKey
            });
          }
        }
      } else if (diffHours <= 48 && diffHours >= 0) {
        for (const uid of recipientUserIds) {
          const dedupeKey = `notif_dl_appr_${dl.deadlineId}_${uid}`;
          if (!existingDedupe.has(dedupeKey)) {
            existingDedupe.add(dedupeKey);
            newNotifications.push({
              notificationId: idProvider("notif"),
              userId: uid,
              type: "DEADLINE_APPROACHING",
              targetRef: {targetType: dl.targetType as any, targetId: dl.targetId},
              createdAt: nowIso,
              severity: "WARNING",
              message: `Deadline approaching for ${dl.targetType} '${dl.targetId}' (due in ${Math.round(diffHours)}h)`,
              dedupeKey
            });
          }
        }
      }
    }
  }

  // 7. Recording Sessions
  for (const rec of store.listRecordingSessions()) {
    if (rec.status === "CONFIRMED") {
      const startMs = new Date(rec.startsAt).getTime();
      const diffHours = (startMs - nowMs) / (1000 * 60 * 60);
      if (diffHours <= 48 && diffHours >= 0) {
        for (const p of rec.people) {
          const dedupeKey = `notif_rec_up_${rec.recordingSessionId}_${p.userId}`;
          if (!existingDedupe.has(dedupeKey)) {
            existingDedupe.add(dedupeKey);
            newNotifications.push({
              notificationId: idProvider("notif"),
              userId: p.userId,
              type: "RECORDING_UPCOMING",
              targetRef: {targetType: "RECORDING_SESSION", targetId: rec.recordingSessionId},
              createdAt: nowIso,
              severity: "INFO",
              message: `Upcoming recording session '${rec.title}' at ${rec.startsAt}`,
              dedupeKey
            });
          }
        }
      }
    }
  }

  return newNotifications;
}
