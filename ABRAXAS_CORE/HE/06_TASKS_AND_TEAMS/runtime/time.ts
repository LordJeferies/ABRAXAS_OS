import type {TimeEntry, TimerSession, TimeReport, Task} from "./types.ts";

export function calculateElapsedSeconds(session: TimerSession, nowIso: string): number {
  if (session.status === "PAUSED") {
    return session.accumulatedSeconds;
  }
  const startMs = new Date(session.lastResumedAt).getTime();
  const nowMs = new Date(nowIso).getTime();
  const deltaSec = Math.max(0, Math.floor((nowMs - startMs) / 1000));
  return session.accumulatedSeconds + deltaSec;
}

export function validateTimeEntryInput(input: {durationSeconds: number; startedAt?: string; endedAt?: string}): void {
  if (input.durationSeconds < 0 || !Number.isFinite(input.durationSeconds)) {
    throw new Error(`Invalid durationSeconds '${input.durationSeconds}': must be non-negative finite number`);
  }
  if (input.startedAt && input.endedAt) {
    const s = new Date(input.startedAt).getTime();
    const e = new Date(input.endedAt).getTime();
    if (e < s) {
      throw new Error(`TimeEntry endedAt (${input.endedAt}) cannot be before startedAt (${input.startedAt})`);
    }
  }
}

export function aggregateTimeReport(
  entries: readonly TimeEntry[],
  tasks: readonly Task[],
  filter?: {userId?: string; taskId?: string; fromDate?: string; toDate?: string}
): TimeReport {
  let filtered = [...entries];

  if (filter?.userId) {
    filtered = filtered.filter((e) => e.userId === filter.userId);
  }
  if (filter?.taskId) {
    filtered = filtered.filter((e) => e.taskId === filter.taskId);
  }
  if (filter?.fromDate) {
    filtered = filtered.filter((e) => e.createdAt >= filter.fromDate!);
  }
  if (filter?.toDate) {
    filtered = filtered.filter((e) => e.createdAt <= filter.toDate!);
  }

  const taskMap = new Map<string, Task>(tasks.map((t) => [t.taskId, t]));
  let totalSeconds = 0;
  const breakdownByUser: Record<string, number> = {};
  const breakdownByTask: Record<string, number> = {};
  const breakdownByTarget: Record<string, number> = {};

  for (const entry of filtered) {
    totalSeconds += entry.durationSeconds;

    breakdownByUser[entry.userId] = (breakdownByUser[entry.userId] ?? 0) + entry.durationSeconds;
    breakdownByTask[entry.taskId] = (breakdownByTask[entry.taskId] ?? 0) + entry.durationSeconds;

    const task = taskMap.get(entry.taskId);
    if (task?.targetRef) {
      const targetKey = `${task.targetRef.targetType}:${task.targetRef.targetId}`;
      breakdownByTarget[targetKey] = (breakdownByTarget[targetKey] ?? 0) + entry.durationSeconds;
    }
  }

  return {
    totalSeconds,
    entryCount: filtered.length,
    breakdownByUser,
    breakdownByTask,
    breakdownByTarget,
    entries: filtered
  };
}
