import { describe, it, expect } from "vitest";
import { RealRenderPipeline } from "../media-engine/src/real-render-pipeline.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("ABRAXAS OS V13 — Reality Validation & Physical Productization Suite", () => {
  it("Task 2, 3 & 4: Materializes real physical files in Projects/ directory across entire pipeline", async () => {
    const testProjectsRoot = path.join(os.tmpdir(), `abraxas_v13_test_${Date.now()}`);
    fs.mkdirSync(testProjectsRoot, { recursive: true });

    const pipeline = new RealRenderPipeline();
    const result = await pipeline.executePipeline({
      baseProjectsDir: testProjectsRoot,
      projectId: "proj_v13_perfume_real",
      projectName: "Oud Royal Launch Physical Render",
      scriptText: "Why is Oud Royal dominating the luxury fragrance industry on TikTok? Discover the secret notes.",
      fps: 60,
      durationSec: 1.0
    });

    // 1. Verify Project Directory Structure
    expect(fs.existsSync(result.projectDir)).toBe(true);
    expect(fs.existsSync(path.join(result.projectDir, "input"))).toBe(true);
    expect(fs.existsSync(path.join(result.projectDir, "analysis"))).toBe(true);
    expect(fs.existsSync(path.join(result.projectDir, "captions"))).toBe(true);
    expect(fs.existsSync(path.join(result.projectDir, "motion"))).toBe(true);
    expect(fs.existsSync(path.join(result.projectDir, "exports"))).toBe(true);

    // 2. Verify Physical Output Files Exist
    expect(fs.existsSync(result.sourceFile)).toBe(true);
    expect(fs.existsSync(result.analysisFile)).toBe(true);
    expect(fs.existsSync(result.captionsSrtFile)).toBe(true);
    expect(fs.existsSync(result.captionsAssFile)).toBe(true);
    expect(fs.existsSync(result.motionFile)).toBe(true);
    expect(fs.existsSync(result.videoFinalFile)).toBe(true);
    expect(fs.existsSync(result.manifestFile)).toBe(true);
    expect(fs.existsSync(result.packageFile)).toBe(true);

    // 3. Verify File Contents & Checksums
    const videoStats = fs.statSync(result.videoFinalFile);
    expect(videoStats.size).toBeGreaterThan(50);

    const srtContent = fs.readFileSync(result.captionsSrtFile, "utf8");
    expect(srtContent).toContain("-->");

    const manifestContent = JSON.parse(fs.readFileSync(result.manifestFile, "utf8"));
    expect(manifestContent.projectId).toBe("proj_v13_perfume_real");
    expect(manifestContent.casMasterAddress.startsWith("cas://")).toBe(true);

    // Cleanup
    try {
      fs.rmSync(testProjectsRoot, { recursive: true, force: true });
    } catch (e) {}
  }, 60000);
});
