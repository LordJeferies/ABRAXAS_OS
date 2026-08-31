import { describe, it, expect } from "vitest";
import { BootManager } from "../kernel/boot-manager.js";
import { CreativeStudioEngine } from "../studio/src/creative-studio-engine.js";
import { ProjectWorkspaceManager } from "../studio/src/project-workspace.js";
import { StudioProjectLibrary } from "../studio/src/project-library.js";
import { AutonomousMemoryEvolutionAnalyzer } from "../studio/src/autonomous-memory-evolution.js";
import { SqliteMemoryCore } from "../memory/src/memory-core.js";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

describe("ABRAXAS OS V6.2 — User Acceptance & Production Hardening Suite", () => {
  // 1. Cold Boot User Flow
  it("executes cold boot sequence from desktop launch with 0 developer commands", async () => {
    const bootManager = new BootManager();
    const { kernel, arquitecto, report } = await bootManager.launch(":memory:");

    expect(report.kernelStatus).toBe("ONLINE");
    expect(report.memoryConnected).toBe(true);
    expect(report.guardianStatus).toBe("OPTIMAL");
    expect(report.arquitectoOnline).toBe(true);
    expect(report.stepsCompleted).toContain("DESKTOP_LAUNCH_TRIGGERED");
    expect(report.stepsCompleted).toContain("ARQUITECTO_ONLINE");
  });

  // 2. Create From Zero Workflow
  it("executes complete Create From Zero project across all 8 Sephiroth", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    const project = await studio.createFromZero({
      idea: "Create a viral short-form advertisement",
      product: "Test Product",
      targetAudience: "Social media users",
      objective: "High retention video"
    });

    expect(project.title).toContain("viral short-form");
    expect(project.mode).toBe("FROM_ZERO");
    expect(project.casArtifactUri.startsWith("cas://")).toBe(true);
    expect(project.storyboardSummary.length).toBeGreaterThanOrEqual(4);
    expect(project.subtitlesCompiled).toBe(true);
    expect(project.motionApplied).toBe(true);
    expect(project.publishedReceiptsCount).toBeGreaterThan(0);
  });

  // 3. Existing Material Transformation Options
  it("verifies all 6 transformation options for existing material", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    const opt1 = await studio.transformExisting({ option: "ONLY_MOTION" });
    expect(opt1.selectedOption).toBe("ONLY_MOTION");
    expect(opt1.motionApplied).toBe(true);
    expect(opt1.subtitlesCompiled).toBe(false);

    const opt2 = await studio.transformExisting({ option: "ONLY_CAPTIONS" });
    expect(opt2.selectedOption).toBe("ONLY_CAPTIONS");
    expect(opt2.subtitlesCompiled).toBe(true);
    expect(opt2.motionApplied).toBe(false);

    const opt3 = await studio.transformExisting({ option: "MOTION_AND_CAPTIONS" });
    expect(opt3.selectedOption).toBe("MOTION_AND_CAPTIONS");
    expect(opt3.subtitlesCompiled).toBe(true);
    expect(opt3.motionApplied).toBe(true);

    const opt4 = await studio.transformExisting({ option: "RESTRUCTURE" });
    expect(opt4.selectedOption).toBe("RESTRUCTURE");

    const opt5 = await studio.transformExisting({ option: "IMPROVE_HOOK" });
    expect(opt5.selectedOption).toBe("IMPROVE_HOOK");

    const opt6 = await studio.transformExisting({ option: "FULL_OPTIMIZATION" });
    expect(opt6.selectedOption).toBe("FULL_OPTIMIZATION");
    expect(opt6.motionApplied).toBe(true);
    expect(opt6.subtitlesCompiled).toBe(true);
  });

  // 4. Project Workspace Model & Materialization
  it("creates workspace model and materializes canonical project directory structure", async () => {
    const studio = new CreativeStudioEngine(":memory:");
    const workspaceMgr = new ProjectWorkspaceManager();

    const project = await studio.createFromZero({
      idea: "Perfume Advertisement",
      targetAudience: "Luxury buyers",
      objective: "Brand awareness"
    });

    const model = workspaceMgr.createWorkspaceModel(project);
    expect(model.projectName).toBe("Perfume Advertisement");
    expect(model.currentSefirah).toBe("MALKHUT");
    expect(model.activeModule).toBe("HE");
    expect(model.timelineEvents.length).toBe(6);
    expect(model.generatedAssets.casBundleUri).toBe(project.casArtifactUri);

    const tmpBaseDir = path.join(os.tmpdir(), `abraxas_ws_${Date.now()}`);
    const materializedDir = workspaceMgr.materializeProjectDirectory(tmpBaseDir, project);

    expect(fs.existsSync(path.join(materializedDir, "source"))).toBe(true);
    expect(fs.existsSync(path.join(materializedDir, "analysis", "script.md"))).toBe(true);
    expect(fs.existsSync(path.join(materializedDir, "storyboard", "scenes.json"))).toBe(true);
    expect(fs.existsSync(path.join(materializedDir, "captions", "subtitles.srt"))).toBe(true);
    expect(fs.existsSync(path.join(materializedDir, "exports", "manifest.json"))).toBe(true);

    try { fs.rmSync(tmpBaseDir, { recursive: true, force: true }); } catch (e) {}
  });

  // 5. Project Persistence and Reload After Restart
  it("persists project into SQLite and reloads identically after cold restart", () => {
    const tmpDbPath = path.join(os.tmpdir(), `abraxas_proj_db_${Date.now()}.db`);

    // Session 1: Save project
    const lib1 = new StudioProjectLibrary(tmpDbPath);
    lib1.saveProject({
      projectId: "proj_perfume_99",
      title: "Lattafa Advertisement",
      mode: "FROM_ZERO",
      currentSefirah: "MALKHUT",
      casArtifactUri: "cas://lattafa_sha256_render",
      scriptContent: "Luxury fragrance hook",
      storyboardSummary: ["Scene 1", "Scene 2"],
      subtitlesCompiled: true,
      motionApplied: true,
      publishedReceiptsCount: 2,
      completedAt: new Date().toISOString()
    });

    // Session 2: Cold restart simulation
    const lib2 = new StudioProjectLibrary(tmpDbPath);
    const projects = lib2.listProjects();
    expect(projects.length).toBe(1);
    expect(projects[0].title).toBe("Lattafa Advertisement");
    expect(projects[0].casArtifactUri).toBe("cas://lattafa_sha256_render");

    try { fs.unlinkSync(tmpDbPath); } catch (e) {}
  });

  // 6. Autonomous Memory Evolution Insights
  it("evaluates evolutionary insights and successful creative patterns", () => {
    const memory = new SqliteMemoryCore(":memory:");
    memory.recordEpisodic("Test Run", "Completed successful project", {}, 0.9);

    const analyzer = new AutonomousMemoryEvolutionAnalyzer(memory);
    const insights = analyzer.evaluateOrganismMemory();

    expect(insights.successfulHooks.length).toBe(3);
    expect(insights.successfulHooks[0].hook).toBe("QUESTION_HOOK");
    expect(insights.successfulStructures.length).toBeGreaterThan(0);
    expect(insights.creativePatterns.length).toBeGreaterThan(0);
  });
});
