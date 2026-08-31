import { describe, it, expect } from "vitest";
import { CreativeStudioEngine } from "../studio/src/creative-studio-engine.js";
import { MediaIngestionEngine } from "../media-engine/src/media-ingestion-engine.js";
import { MediaUnderstandingEngine } from "../media-engine/src/media-understanding-engine.js";
import { CaptionForge } from "../media-engine/src/caption-forge.js";
import { MotionForge } from "../media-engine/src/motion-forge.js";
import { CreativeIntelligenceEngine } from "../media-engine/src/creative-intelligence.js";
import { ExportPackageSystem } from "../media-engine/src/export-package-system.js";
import { ProjectWorkspaceManager } from "../studio/src/project-workspace.js";
import { SqliteMemoryCore } from "../memory/src/memory-core.js";
import { BootManager } from "../kernel/boot-manager.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("ABRAXAS OS V7.1 — Real Content Creation Lab Validation Suite", () => {
  // TEST 1: CREATE FROM ZERO (Premium Perfume TikTok Ad)
  it("Test 1: Creates complete TikTok perfume advertisement from zero through 8-step pipeline", async () => {
    const startTime = Date.now();
    const studio = new CreativeStudioEngine(":memory:");

    const project = await studio.createFromZero({
      idea: "Stop buying boring perfumes: The Oud Royal Phenomenon",
      product: "Oud Royal Extrait",
      targetAudience: "Gen Z & Millennials on TikTok",
      objective: "Drive 10,000 direct-to-consumer orders with high retention hook"
    });

    const executionMs = Date.now() - startTime;
    expect(executionMs).toBeLessThan(1000); // Super fast <1s in-memory execution

    expect(project.projectId.startsWith("proj_zero_")).toBe(true);
    expect(project.mode).toBe("FROM_ZERO");
    expect(project.casArtifactUri.startsWith("cas://")).toBe(true);
    expect(project.currentSefirah).toBe("MALKHUT");
    expect(project.subtitlesCompiled).toBe(true);
    expect(project.motionApplied).toBe(true);
    expect(project.publishedReceiptsCount).toBeGreaterThan(0);
    expect(project.storyboardSummary.length).toBe(4);
  });

  // TEST 2: EXISTING VIDEO OPTIMIZATION (FULL OPTIMIZATION)
  it("Test 2: Imports existing video and performs FULL OPTIMIZATION with hook & retention upgrades", async () => {
    const studio = new CreativeStudioEngine(":memory:");
    const rawVideo = Buffer.from("ABRAXAS_RAW_SOURCE_FOOTAGE_TEST_STREAM");

    const project = await studio.transformExisting(
      {
        videoBuffer: rawVideo,
        option: "FULL_OPTIMIZATION",
        scriptText: "Unboxing the rarest fragrance in the world."
      },
      "Perfume TikTok Full Optimization"
    );

    expect(project.mode).toBe("EXISTING_MATERIAL");
    expect(project.selectedOption).toBe("FULL_OPTIMIZATION");
    expect(project.subtitlesCompiled).toBe(true);
    expect(project.motionApplied).toBe(true);
    expect(project.casArtifactUri.startsWith("cas://")).toBe(true);
  });

  // TEST 3: ONLY CAPTIONS
  it("Test 3: Generates word-level kinetic captions in SRT/ASS/VTT for existing footage", async () => {
    const studio = new CreativeStudioEngine(":memory:");
    const understanding = new MediaUnderstandingEngine();
    const captionForge = new CaptionForge();

    const project = await studio.transformExisting(
      {
        option: "ONLY_CAPTIONS",
        scriptText: "Top notes: Bergamot and Saffron. Heart notes: Turkish Rose."
      },
      "Perfume Notes Subtitles"
    );

    expect(project.selectedOption).toBe("ONLY_CAPTIONS");
    expect(project.subtitlesCompiled).toBe(true);
    expect(project.motionApplied).toBe(false);

    const manifest = new MediaIngestionEngine().ingestMedia("perfume.mp4", Buffer.from("VIDEO"));
    const analysis = understanding.analyzeMedia(manifest, project.scriptContent);
    const captions = captionForge.generateCaptions(analysis);

    expect(captions.srtContent).toContain("-->");
    expect(captions.assContent).toContain("Dialogue:");
    expect(captions.vttContent).toContain("WEBVTT");
    expect(captions.wordCount).toBeGreaterThan(0);
  });

  // TEST 4: ONLY MOTION
  it("Test 4: Applies Remotion motion layers and camera zooms without caption modifications", async () => {
    const studio = new CreativeStudioEngine(":memory:");
    const motionForge = new MotionForge();

    const project = await studio.transformExisting(
      {
        option: "ONLY_MOTION",
        scriptText: "Smooth slow-motion bottle rotation"
      },
      "Bottle B-Roll Motion"
    );

    expect(project.selectedOption).toBe("ONLY_MOTION");
    expect(project.motionApplied).toBe(true);
    expect(project.subtitlesCompiled).toBe(false);

    const motionManifest = motionForge.generateMotionManifest(60, 10.0);
    expect(motionManifest.layers.length).toBeGreaterThan(0);
    expect(motionManifest.layers[0].type).toBe("CAMERA_ZOOM");
  });

  // TEST 5: PERFORMANCE MEMORY & RETENTION HEURISTICS
  it("Test 5: Logs creative decisions and updates evolutionary memory", () => {
    const memory = new SqliteMemoryCore(":memory:");

    memory.recordEpisodic(
      "TikTok Perfume Ad Benchmark",
      "Question hook 'Stop buying boring perfumes' yielded 92.4% retention in first 3s",
      { hookArchetype: "QUESTION_HOOK", retentionMultiplier: 1.15, conversionLift: 0.28 },
      0.95,
      ["perfume", "tiktok", "retention_benchmark"]
    );

    const episodes = memory.queryEpisodic(0.0);
    expect(episodes.length).toBe(1);
    expect(episodes[0].details.hookArchetype).toBe("QUESTION_HOOK");
    expect(episodes[0].details.retentionMultiplier).toBe(1.15);
  });

  // USER EXPERIENCE TEST (NON-TECHNICAL ZERO TERMINAL FLOW)
  it("User Experience Test: Simulates cold boot and automated project creation with 0 terminal input", async () => {
    const bootManager = new BootManager();
    const { report } = await bootManager.launch(":memory:");

    expect(report.kernelStatus).toBe("ONLINE");
    expect(report.guardianStatus).toBe("OPTIMAL");
    expect(report.arquitectoOnline).toBe(true);

    const studio = new CreativeStudioEngine(":memory:");
    const workspaceMgr = new ProjectWorkspaceManager();
    const exportSys = new ExportPackageSystem();

    const project = await studio.createFromZero({
      idea: "Viral Summer Fragrance Review",
      targetAudience: "Perfume Enthusiasts",
      objective: "Viral organic discovery"
    });

    const tmpBaseDir = path.join(os.tmpdir(), `abraxas_lab_${Date.now()}`);
    const projDir = workspaceMgr.materializeProjectDirectory(tmpBaseDir, project);
    const pkg = exportSys.compileProjectPackage(projDir, project.projectId, project.title);

    expect(fs.existsSync(pkg.packagePath)).toBe(true);
    expect(fs.existsSync(path.join(projDir, "exports", "video_final.mp4"))).toBe(true);
    expect(fs.existsSync(path.join(projDir, "exports", "captions.srt"))).toBe(true);

    try { fs.rmSync(tmpBaseDir, { recursive: true, force: true }); } catch (e) {}
  });
});
