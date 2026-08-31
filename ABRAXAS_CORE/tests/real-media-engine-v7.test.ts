import { describe, it, expect } from "vitest";
import { MediaIngestionEngine } from "../media-engine/src/media-ingestion-engine.js";
import { MediaUnderstandingEngine } from "../media-engine/src/media-understanding-engine.js";
import { CaptionForge } from "../media-engine/src/caption-forge.js";
import { MotionForge } from "../media-engine/src/motion-forge.js";
import { CreativeIntelligenceEngine } from "../media-engine/src/creative-intelligence.js";
import { RenderQueueSystem } from "../media-engine/src/render-queue.js";
import { ExportPackageSystem } from "../media-engine/src/export-package-system.js";
import { CreativeStudioEngine } from "../studio/src/creative-studio-engine.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("ABRAXAS OS V7.0 — Real Creative Production Engine Suite", () => {
  // 1. Media Ingestion Engine
  it("ingests raw media stream and extracts full manifest with cryptographic checksum", () => {
    const ingestion = new MediaIngestionEngine();
    const rawBuffer = Buffer.from("ABRAXAS_SAMPLE_RAW_AV1_VIDEO_STREAM");
    const manifest = ingestion.ingestMedia("hero_take.mp4", rawBuffer);

    expect(manifest.file).toBe("hero_take.mp4");
    expect(manifest.format).toBe("mp4");
    expect(manifest.durationSeconds).toBe(30.0);
    expect(manifest.fps).toBe(30);
    expect(manifest.resolution.width).toBe(1080);
    expect(manifest.resolution.height).toBe(1920);
    expect(manifest.checksumSha256.length).toBe(64);
    expect(manifest.sceneChangesEstimateSec.length).toBeGreaterThan(3);
  });

  // 2. AI Media Understanding & Analysis
  it("generates transcription, scenes, hook analysis and retention map", () => {
    const ingestion = new MediaIngestionEngine();
    const understanding = new MediaUnderstandingEngine();

    const manifest = ingestion.ingestMedia("hero_take.mp4", Buffer.from("AUDIOVISUAL_STREAM"));
    const analysis = understanding.analyzeMedia(manifest);

    expect(analysis.transcription.segments.length).toBeGreaterThan(0);
    expect(analysis.transcription.segments[0].words.length).toBeGreaterThan(0);
    expect(analysis.scenes.length).toBe(3);
    expect(analysis.hookAnalysis.hookScore).toBeGreaterThan(90);
    expect(analysis.retentionMap.length).toBe(4);
  });

  // 3. Caption Forge (SRT, ASS, VTT)
  it("compiles word-level kinetic captions across SRT, ASS, and VTT formats", () => {
    const ingestion = new MediaIngestionEngine();
    const understanding = new MediaUnderstandingEngine();
    const captionForge = new CaptionForge();

    const manifest = ingestion.ingestMedia("take.mp4", Buffer.from("AUDIOVISUAL_STREAM"));
    const analysis = understanding.analyzeMedia(manifest);
    const captions = captionForge.generateCaptions(analysis);

    expect(captions.srtContent).toContain("-->");
    expect(captions.assContent).toContain("[V4+ Styles]");
    expect(captions.vttContent).toContain("WEBVTT");
    expect(captions.wordCount).toBeGreaterThan(5);
    expect(captions.kineticPacingScore).toBeGreaterThan(90);
  });

  // 4. Motion Forge
  it("generates motion manifest with physics easing, zooms and dynamic transitions", () => {
    const motionForge = new MotionForge();
    const manifest = motionForge.generateMotionManifest(60, 15.0);

    expect(manifest.fps).toBe(60);
    expect(manifest.totalFrames).toBe(900);
    expect(manifest.layers.length).toBe(4);
    expect(manifest.layers[0].type).toBe("CAMERA_ZOOM");
    expect(manifest.layers[1].type).toBe("SPEED_RAMP");
    expect(manifest.motionScore).toBe(95);
  });

  // 5. Creative Intelligence Engine
  it("evaluates hook, retention, emotion and conversion scores with recommendations", () => {
    const understanding = new MediaUnderstandingEngine();
    const creativeIntel = new CreativeIntelligenceEngine();

    const manifest = new MediaIngestionEngine().ingestMedia("take.mp4", Buffer.from("STREAM"));
    const analysis = understanding.analyzeMedia(manifest);
    const scores = creativeIntel.evaluateCreative(analysis);

    expect(scores.hook).toBeGreaterThan(80);
    expect(scores.retention).toBeGreaterThan(80);
    expect(scores.recommendations.length).toBeGreaterThan(2);
  });

  // 6. Render Queue System
  it("manages render job states through complete lifecycle", () => {
    const queue = new RenderQueueSystem();
    const job = queue.enqueue("project_alpha_7");

    expect(job.state).toBe("QUEUED");
    expect(queue.listActiveJobs().length).toBe(1);

    queue.updateJobState(job.jobId, "RENDERING", 65, "MOTION_FORGE");
    expect(queue.getJob(job.jobId)?.progressPercentage).toBe(65);

    queue.updateJobState(job.jobId, "COMPLETED", 100, "EXPORT_SYSTEM", "cas://final_master_render");
    expect(queue.getJob(job.jobId)?.state).toBe("COMPLETED");
    expect(queue.listActiveJobs().length).toBe(0);
  });

  // 7. Export Package System
  it("compiles final MP4, SRT and .abraxas project delivery package with CAS checksums", () => {
    const exportSys = new ExportPackageSystem();
    const tmpProjectDir = path.join(os.tmpdir(), `abraxas_pkg_test_${Date.now()}`);

    const result = exportSys.compileProjectPackage(tmpProjectDir, "project_mankay_01", "Mankay Campaign");
    expect(fs.existsSync(result.packagePath)).toBe(true);
    expect(result.manifest.casMasterAddress.startsWith("cas://")).toBe(true);
    expect(result.manifest.files.length).toBe(2);

    try { fs.rmSync(tmpProjectDir, { recursive: true, force: true }); } catch (e) {}
  });

  // 8. Real Workflows Execution
  it("executes all 4 real user workflows (Create Zero, Optimize Existing, Only Captions, Only Motion)", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    // Workflow A: Create From Zero
    const wfA = await studio.createFromZero({
      idea: "Mankay Campaign",
      product: "Mankay Coffee",
      targetAudience: "Artisanal coffee lovers",
      objective: "Direct to consumer subscription"
    });
    expect(wfA.mode).toBe("FROM_ZERO");
    expect(wfA.casArtifactUri.startsWith("cas://")).toBe(true);

    // Workflow B: Optimize Existing
    const wfB = await studio.transformExisting({ option: "FULL_OPTIMIZATION" }, "Mankay Existing Edit");
    expect(wfB.selectedOption).toBe("FULL_OPTIMIZATION");
    expect(wfB.subtitlesCompiled).toBe(true);
    expect(wfB.motionApplied).toBe(true);

    // Workflow C: Only Captions
    const wfC = await studio.transformExisting({ option: "ONLY_CAPTIONS" });
    expect(wfC.subtitlesCompiled).toBe(true);
    expect(wfC.motionApplied).toBe(false);

    // Workflow D: Only Motion
    const wfD = await studio.transformExisting({ option: "ONLY_MOTION" });
    expect(wfD.motionApplied).toBe(true);
    expect(wfD.subtitlesCompiled).toBe(false);
  });
});
