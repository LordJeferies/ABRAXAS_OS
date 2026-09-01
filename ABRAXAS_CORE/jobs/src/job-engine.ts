/**
 * Job Engine — Deterministic local background job queue with retries & state transitions
 */

import { randomUUID } from "node:crypto";
import { BackgroundJob, JobState } from "./types.js";

export class JobEngine {
  private jobs = new Map<string, BackgroundJob>();

  public createJob<T>(jobType: string, payload: T, maxAttempts = 3): BackgroundJob<T> {
    const jobId = `job_${randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();

    const job: BackgroundJob<T> = {
      jobId,
      jobType,
      payload,
      state: "QUEUED",
      progressPercent: 0,
      attemptCount: 0,
      maxAttempts,
      createdAt: now,
      updatedAt: now
    };

    this.jobs.set(jobId, job as BackgroundJob);
    return job;
  }

  public getJob(jobId: string): BackgroundJob | undefined {
    return this.jobs.get(jobId);
  }

  public async runJob<T, R>(jobId: string, runner: (payload: T, updateProgress: (pct: number) => void) => Promise<R>): Promise<BackgroundJob<T, R>> {
    const job = this.jobs.get(jobId);
    if (!job) throw new Error(`Job "${jobId}" not found`);

    job.state = "RUNNING";
    job.attemptCount += 1;
    job.heartbeatAt = new Date().toISOString();
    job.updatedAt = new Date().toISOString();

    try {
      const result = await runner(job.payload as T, (pct: number) => {
        job.progressPercent = pct;
        job.heartbeatAt = new Date().toISOString();
      });

      job.state = "COMPLETED";
      job.progressPercent = 100;
      job.result = result;
      job.updatedAt = new Date().toISOString();
      return job as BackgroundJob<T, R>;
    } catch (err: any) {
      job.error = err.message;
      if (job.attemptCount < job.maxAttempts) {
        job.state = "RETRYING";
      } else {
        job.state = "FAILED";
      }
      job.updatedAt = new Date().toISOString();
      return job as BackgroundJob<T, R>;
    }
  }
}
