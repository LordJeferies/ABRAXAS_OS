/**
 * ABRAXAS Project Execution & Render Queue V7.0
 * States: QUEUED -> ANALYZING -> GENERATING -> RENDERING -> VALIDATING -> COMPLETED / FAILED
 */

export type RenderState =
  | "QUEUED"
  | "ANALYZING"
  | "GENERATING"
  | "RENDERING"
  | "VALIDATING"
  | "COMPLETED"
  | "FAILED";

export interface RenderJob {
  jobId: string;
  projectId: string;
  state: RenderState;
  progressPercentage: number;
  currentEngine: string;
  retryCount: number;
  outputUri?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export class RenderQueueSystem {
  private readonly queue: Map<string, RenderJob> = new Map();

  public enqueue(projectId: string): RenderJob {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const job: RenderJob = {
      jobId,
      projectId,
      state: "QUEUED",
      progressPercentage: 0,
      currentEngine: "MEDIA_INGESTION",
      retryCount: 0,
      createdAt: new Date().toISOString()
    };
    this.queue.set(jobId, job);
    return job;
  }

  public updateJobState(jobId: string, state: RenderState, progress: number, engine: string, outputUri?: string): RenderJob {
    const job = this.queue.get(jobId);
    if (!job) throw new Error(`Job ${jobId} not found in render queue`);

    job.state = state;
    job.progressPercentage = progress;
    job.currentEngine = engine;
    if (outputUri) job.outputUri = outputUri;
    if (state === "COMPLETED" || state === "FAILED") {
      job.completedAt = new Date().toISOString();
    }
    return job;
  }

  public getJob(jobId: string): RenderJob | undefined {
    return this.queue.get(jobId);
  }

  public listActiveJobs(): RenderJob[] {
    return Array.from(this.queue.values()).filter((j) => j.state !== "COMPLETED" && j.state !== "FAILED");
  }

  public listAllJobs(): RenderJob[] {
    return Array.from(this.queue.values());
  }
}
