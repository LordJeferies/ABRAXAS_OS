import type {
  ActiveTaskSummary,
  Approval,
  BlockedWorkItem,
  CalendarItem,
  CalendarProjection,
  Deadline,
  Dependency,
  DependencyOverride,
  KanbanCard,
  KanbanProjection,
  RecordingSession,
  SoloQueue,
  Task,
  TaskAssignment,
  TeamMember,
  TeamSnapshot
} from "./types.ts";
import {evaluateDeadline} from "./deadlines.ts";
import {evaluateTaskDependencies} from "./dependencies.ts";

export const getSoloQueue = (
  userId: string,
  allTasks: readonly Task[],
  assignments: readonly TaskAssignment[],
  dependencies: readonly Dependency[],
  overrides: readonly DependencyOverride[],
  deadlines: readonly Deadline[],
  approvals: readonly Approval[] = [],
  nowIso: string = new Date().toISOString()
): SoloQueue => {
  const userTaskIds = new Set(
    assignments.filter((a) => a.userId === userId && a.status === "ACTIVE").map((a) => a.taskId)
  );

  const assignedTasks = allTasks.filter((t) => userTaskIds.has(t.taskId));
  const deadlineMap = new Map(deadlines.filter((d) => d.targetType === "TASK").map((d) => [d.targetId, d]));

  const next: Task[] = [];
  const inProgress: Task[] = [];
  const reviewRequired: Task[] = [];
  const blocked: Task[] = [];
  const dueSoon: Task[] = [];
  const overdue: Task[] = [];

  for (const task of assignedTasks) {
    const depEval = evaluateTaskDependencies(task, allTasks, dependencies, overrides, approvals, assignments);
    const dl = deadlineMap.get(task.taskId);
    const dlEval = dl ? evaluateDeadline(dl, task, allTasks, dependencies, overrides, approvals, assignments, nowIso) : undefined;

    if (depEval.isBlocked || task.status === "BLOCKED") {
      blocked.push(task);
    } else if (task.status === "IN_PROGRESS") {
      inProgress.push(task);
    } else if (task.status === "REVIEW") {
      reviewRequired.push(task);
    } else if (task.status === "READY") {
      next.push(task);
    } else if (task.status === "BACKLOG") {
      next.push(task);
    }

    if (dlEval?.riskState === "OVERDUE") {
      overdue.push(task);
    } else if (dlEval?.riskState === "DUE_SOON") {
      dueSoon.push(task);
    }
  }

  const priorityScore = (t: Task) => (
    t.priority === "URGENT" ? 4 :
    t.priority === "HIGH" ? 3 :
    t.priority === "MEDIUM" ? 2 : 1
  );

  const sortDeterministic = (list: Task[]) => (
    [...list].sort((a, b) => priorityScore(b) - priorityScore(a) || a.taskId.localeCompare(b.taskId))
  );

  const pendingApprovalsForUser = approvals.filter(
    (a) => a.decision === "PENDING" && a.reviewers.includes(userId)
  );

  return {
    userId,
    generatedAt: nowIso,
    next: sortDeterministic(next),
    inProgress: sortDeterministic(inProgress),
    reviewRequired: sortDeterministic(reviewRequired),
    blocked: sortDeterministic(blocked),
    dueSoon: sortDeterministic(dueSoon),
    overdue: sortDeterministic(overdue),
    pendingApprovalsForUser
  };
};

export const getTeamSnapshot = (
  teamMembers: readonly TeamMember[],
  allTasks: readonly Task[],
  assignments: readonly TaskAssignment[],
  dependencies: readonly Dependency[],
  overrides: readonly DependencyOverride[],
  deadlines: readonly Deadline[],
  recordingSessions: readonly RecordingSession[],
  approvals: readonly Approval[],
  nowIso: string = new Date().toISOString()
): TeamSnapshot => {
  const memberWorkload = teamMembers.map((m) => {
    const userAsgs = assignments.filter((a) => a.userId === m.userId && a.status === "ACTIVE");
    const taskIds = new Set(userAsgs.map((a) => a.taskId));
    const tasks = allTasks.filter((t) => taskIds.has(t.taskId));

    let blockedCount = 0;
    let overdueCount = 0;
    const activeTasks: ActiveTaskSummary[] = [];

    for (const t of tasks) {
      const depEval = evaluateTaskDependencies(t, allTasks, dependencies, overrides, approvals, assignments);
      if (depEval.isBlocked || t.status === "BLOCKED") blockedCount++;
      const dl = deadlines.find((d) => d.targetType === "TASK" && d.targetId === t.taskId);
      if (dl) {
        const evalRes = evaluateDeadline(dl, t, allTasks, dependencies, overrides, approvals, assignments, nowIso);
        if (evalRes.riskState === "OVERDUE") overdueCount++;
      }
      if (t.status !== "DONE" && t.status !== "CANCELLED") {
        activeTasks.push({
          taskId: t.taskId,
          title: t.title,
          status: t.status,
          priority: t.priority
        });
      }
    }

    return {
      userId: m.userId,
      displayName: m.displayName,
      activeTaskCount: activeTasks.length,
      blockedTaskCount: blockedCount,
      overdueTaskCount: overdueCount,
      activeTasks
    };
  });

  const overdueTasks: Task[] = [];
  const dueSoonTasks: Task[] = [];
  const blockedWork: BlockedWorkItem[] = [];

  for (const t of allTasks) {
    if (t.status === "DONE" || t.status === "CANCELLED") continue;
    const dl = deadlines.find((d) => d.targetType === "TASK" && d.targetId === t.taskId);
    if (dl) {
      const evalRes = evaluateDeadline(dl, t, allTasks, dependencies, overrides, approvals, assignments, nowIso);
      if (evalRes.riskState === "OVERDUE") overdueTasks.push(t);
      if (evalRes.riskState === "DUE_SOON") dueSoonTasks.push(t);
    }

    const depEval = evaluateTaskDependencies(t, allTasks, dependencies, overrides, approvals, assignments);
    if (depEval.isBlocked || t.status === "BLOCKED") {
      const activeAsgs = assignments.filter((a) => a.taskId === t.taskId && a.status === "ACTIVE");
      blockedWork.push({
        taskId: t.taskId,
        taskTitle: t.title,
        assigneeIds: activeAsgs.map((a) => a.userId),
        waitingForTaskIds: depEval.waitingForTaskIds,
        waitingForUserIds: depEval.waitingForUserIds,
        reasons: depEval.reasons
      });
    }
  }

  const upcomingRecordingSessions = recordingSessions.filter(
    (s) => s.status !== "COMPLETED" && s.status !== "CANCELLED"
  );

  const pendingApprovals = approvals.filter((a) => a.decision === "PENDING");

  return {
    generatedAt: nowIso,
    memberWorkload,
    overdueTasks,
    dueSoonTasks,
    pendingApprovals,
    upcomingRecordingSessions,
    blockedWork
  };
};

export const getKanbanProjection = (
  allTasks: readonly Task[],
  teamMembers: readonly TeamMember[],
  assignments: readonly TaskAssignment[],
  dependencies: readonly Dependency[],
  overrides: readonly DependencyOverride[],
  deadlines: readonly Deadline[],
  approvals: readonly Approval[] = [],
  nowIso: string = new Date().toISOString()
): KanbanProjection => {
  const memberMap = new Map(teamMembers.map((m) => [m.userId, m]));
  const deadlineMap = new Map(deadlines.filter((d) => d.targetType === "TASK").map((d) => [d.targetId, d]));

  const backlog: KanbanCard[] = [];
  const ready: KanbanCard[] = [];
  const inProgress: KanbanCard[] = [];
  const review: KanbanCard[] = [];
  const blocked: KanbanCard[] = [];
  const done: KanbanCard[] = [];

  for (const t of allTasks) {
    if (t.status === "CANCELLED") continue;

    const taskAsgs = assignments.filter((a) => a.taskId === t.taskId && a.status === "ACTIVE");
    const assignees = taskAsgs.map((a) => memberMap.get(a.userId)!).filter(Boolean);
    const depEval = evaluateTaskDependencies(t, allTasks, dependencies, overrides, approvals, taskAsgs);
    const dl = deadlineMap.get(t.taskId);
    const dlEval = dl ? evaluateDeadline(dl, t, allTasks, dependencies, overrides, approvals, taskAsgs, nowIso) : undefined;

    const card: KanbanCard = {
      task: t,
      assignees,
      isBlocked: depEval.isBlocked,
      waitingFor: depEval.waitingFor,
      deadlineRisk: dlEval?.riskState
    };

    // Exactly one column assignment with computed blocker taking precedence over non-DONE states
    if (t.status === "DONE") {
      done.push(card);
    } else if (t.status === "BLOCKED" || depEval.isBlocked) {
      blocked.push(card);
    } else if (t.status === "IN_PROGRESS") {
      inProgress.push(card);
    } else if (t.status === "REVIEW") {
      review.push(card);
    } else if (t.status === "READY") {
      ready.push(card);
    } else {
      backlog.push(card);
    }
  }

  return {backlog, ready, inProgress, review, blocked, done};
};

export const getCalendarProjection = (
  tasks: readonly Task[],
  recordingSessions: readonly RecordingSession[],
  deadlines: readonly Deadline[],
  externalPublicationTargets: readonly {targetId: string; title: string; scheduledAt: string; timezone: string}[] = [],
  nowIso: string = new Date().toISOString()
): CalendarProjection => {
  const items: CalendarItem[] = [];

  // Tasks with explicit schedules
  for (const t of tasks) {
    if (t.schedule) {
      items.push({
        itemId: `cal_task_${t.taskId}`,
        itemType: "TASK",
        sourceId: t.taskId,
        title: t.title,
        startsAt: t.schedule.scheduledStartAt,
        endsAt: t.schedule.scheduledEndAt,
        timezone: t.schedule.timezone,
        status: t.status,
        targetRef: t.targetRef ?? {targetType: "TASK", targetId: t.taskId}
      });
    }
  }

  // Recording sessions
  for (const s of recordingSessions) {
    items.push({
      itemId: `cal_rec_${s.recordingSessionId}`,
      itemType: "RECORDING_SESSION",
      sourceId: s.recordingSessionId,
      title: s.title,
      startsAt: s.startsAt,
      endsAt: s.endsAt,
      timezone: s.timezone,
      status: s.status
    });
  }

  // Deadlines
  for (const d of deadlines) {
    items.push({
      itemId: `cal_dl_${d.deadlineId}`,
      itemType: "DEADLINE",
      sourceId: d.deadlineId,
      title: `Deadline: ${d.targetType} ${d.targetId}`,
      startsAt: d.dueAt,
      timezone: d.timezone,
      status: d.status,
      targetRef: {targetType: d.targetType as any, targetId: d.targetId}
    });
  }

  // Publication targets
  for (const p of externalPublicationTargets) {
    items.push({
      itemId: `cal_pub_${p.targetId}`,
      itemType: "PUBLICATION_TARGET",
      sourceId: p.targetId,
      title: p.title,
      startsAt: p.scheduledAt,
      timezone: p.timezone,
      status: "SCHEDULED",
      targetRef: {targetType: "PUBLICATION_TARGET", targetId: p.targetId}
    });
  }

  return {
    generatedAt: nowIso,
    items
  };
};
