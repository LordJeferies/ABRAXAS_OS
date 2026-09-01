import { describe, it, expect } from "vitest";
import { JobEngine } from "../src/job-engine.js";

describe("Job Engine V1 — Local Queue, Progress & Retries", () => {
  it("tracks job lifecycle through QUEUED -> RUNNING -> COMPLETED with progress updates", async () => {
    const engine = new JobEngine();

    const job = engine.createJob("RENDER_REEL", { contentId: "c_1", resolution: "1080x1920" });
    expect(job.state).toBe("QUEUED");

    const finished = await engine.runJob(job.jobId, async (_payload, updateProgress) => {
      updateProgress(25);
      updateProgress(75);
      return { outputUri: "file:///renders/reel.mp4" };
    });

    expect(finished.state).toBe("COMPLETED");
    expect(finished.progressPercent).toBe(100);
    expect((finished.result as any).outputUri).toBe("file:///renders/reel.mp4");
  });

  it("handles failures and transitions to RETRYING and FAILED on max attempts", async () => {
    const engine = new JobEngine();

    const job = engine.createJob("FLAKY_JOB", {}, 2);

    // Attempt 1 -> fails -> RETRYING
    const afterFirst = await engine.runJob(job.jobId, async () => {
      throw new Error("Temporary network timeout");
    });
    expect(afterFirst.state).toBe("RETRYING");
    expect(afterFirst.attemptCount).toBe(1);

    // Attempt 2 -> fails -> FAILED
    const afterSecond = await engine.runJob(job.jobId, async () => {
      throw new Error("Permanent fatal crash");
    });
    expect(afterSecond.state).toBe("FAILED");
    expect(afterSecond.attemptCount).toBe(2);
  });
});
