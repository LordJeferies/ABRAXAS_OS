/**
 * Job Engine Types
 */

export type JobState = "QUEUED" | "RUNNING" | "RETRYING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface BackgroundJob<T = unknown, R = unknown> {
  jobId: string;
  jobType: string;
  payload: T;
  state: JobState;
  progressPercent: number; // 0 - 100
  attemptCount: number;
  maxAttempts: number;
  heartbeatAt?: string | undefined;
  error?: string | undefined;
  result?: R | undefined;
  createdAt: string;
  updatedAt: string;
}
