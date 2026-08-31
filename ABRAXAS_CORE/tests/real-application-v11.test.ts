import { describe, it, expect } from "vitest";
import { CreativeStudioEngine } from "../studio/src/creative-studio-engine.js";
import { MediaIngestionEngine } from "../media-engine/src/media-ingestion-engine.js";
import { MediaUnderstandingEngine } from "../media-engine/src/media-understanding-engine.js";
import { CaptionForge } from "../media-engine/src/caption-forge.js";
import { MotionForge } from "../media-engine/src/motion-forge.js";
import { ExportPackageSystem } from "../media-engine/src/export-package-system.js";
import { ProjectManagementSystem } from "../projects/src/project-management-system.js";
import { BootManager } from "../kernel/boot-manager.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("ABRAXAS OS V11 — Real Application Implementation Suite", () => {
  // 1. Real Backend Commands & IPC
  it("Task 2: Executes all real backend commands (create, load, analyze, captions, motion, export, status)", async () => {
    // create_project
    const studio = new CreativeStudioEngine(":memory:");
    const created = await studio.createFromZero({
      idea: "Real Commercial Perfume Ad",
      product: "Royal Saffron",
      targetAudience: "Global buyers",
      objective: "Brand awareness"
    });
    expect(created.projectId.startsWith("proj_zero_")).toBe(true);

    // load_project
    const projSys = new ProjectManagementSystem(":memory:");
    projSys.saveProject({
      id: "proj_v11_test",
      name: "Perfume Launch",
      brand: "Royal Saffron",
      objective: "Sales",
      assets: {},
      currentWorld: "ASSIAH",
      currentOperator: "HE",
      pipelineState: "MANIFESTED",
      outputsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const loaded = projSys.loadProject("proj_v11_test");
    expect(loaded?.name).toBe("Perfume Launch");

    // analyze_media
    const ingestion = new MediaIngestionEngine();
    const understanding = new MediaUnderstandingEngine();
    const manifest = ingestion.ingestMedia("take.mp4", Buffer.from("VIDEO_STREAM"));
    const analysis = understanding.analyzeMedia(manifest);
    expect(analysis.scenes.length).toBeGreaterThan(0);

    // generate_captions
    const captionForge = new CaptionForge();
    const captions = captionForge.generateCaptions(analysis);
    expect(captions.srtContent).toContain("-->");

    // generate_motion
    const motionForge = new MotionForge();
    const motion = motionForge.generateMotionManifest(60, 10.0);
    expect(motion.layers.length).toBeGreaterThan(0);

    // export_project
    const exportSys = new ExportPackageSystem();
    const tmpDir = path.join(os.tmpdir(), `abraxas_v11_exp_${Date.now()}`);
    const pkg = exportSys.compileProjectPackage(tmpDir, "proj_v11_test", "Perfume Launch");
    expect(fs.existsSync(pkg.packagePath)).toBe(true);
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}

    // get_system_status
    const bootMgr = new BootManager();
    const { report } = await bootMgr.launch(":memory:");
    expect(report.kernelStatus).toBe("ONLINE");
  });

  // 2. Creative Studio 4 Workflows
  it("Task 4: Executes all 4 real creative studio workflows", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    // Workflow 1: FROM ZERO
    const wf1 = await studio.createFromZero({
      idea: "New Energy Drink Campaign",
      targetAudience: "Athletes",
      objective: "Viral reach"
    });
    expect(wf1.mode).toBe("FROM_ZERO");
    expect(wf1.casArtifactUri.startsWith("cas://")).toBe(true);

    // Workflow 2: OPTIMIZE EXISTING
    const wf2 = await studio.transformExisting({ option: "FULL_OPTIMIZATION" });
    expect(wf2.subtitlesCompiled).toBe(true);
    expect(wf2.motionApplied).toBe(true);

    // Workflow 3: ONLY CAPTIONS
    const wf3 = await studio.transformExisting({ option: "ONLY_CAPTIONS" });
    expect(wf3.subtitlesCompiled).toBe(true);
    expect(wf3.motionApplied).toBe(false);

    // Workflow 4: ONLY MOTION
    const wf4 = await studio.transformExisting({ option: "ONLY_MOTION" });
    expect(wf4.motionApplied).toBe(true);
    expect(wf4.subtitlesCompiled).toBe(false);
  });

  // 3. Physical Installer & App Verification
  it("Task 5: Verifies that ABRAXAS OS.app and ABRAXAS_OS.dmg physically exist", () => {
    const dmgPath = "/Users/lordjef/Desktop/abraxasos/dist/installers/ABRAXAS_OS.dmg";
    const appPath = "/Users/lordjef/Desktop/abraxasos/dist/installers/ABRAXAS OS.app";

    expect(fs.existsSync(dmgPath)).toBe(true);
    expect(fs.existsSync(appPath)).toBe(true);

    const dmgStats = fs.statSync(dmgPath);
    expect(dmgStats.size).toBeGreaterThan(1000000); // Greater than 1MB
  });
});
