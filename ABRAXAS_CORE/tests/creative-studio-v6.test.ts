import { describe, it, expect } from "vitest";
import { CreativeStudioEngine } from "../studio/src/creative-studio-engine.js";
import { TreeOfLifeControlCenterProvider } from "../studio/src/control-center-view.js";
import { StudioProjectLibrary } from "../studio/src/project-library.js";

describe("ABRAXAS OS V6.0 — Creative Operating System Suite", () => {
  // 1. Mode A: Create Content From Zero
  it("creates complete content from zero via full 8-step Sephirothic ladder", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    const result = await studio.createFromZero({
      idea: "Why Traditional Video Editing Fails Under Multi-Channel Scale",
      product: "ABRAXAS OS V6",
      targetAudience: "Systems Architects & Creative Directors",
      objective: "Drive adoption of deterministic editing architectures"
    });

    expect(result.projectId.startsWith("proj_zero_")).toBe(true);
    expect(result.mode).toBe("FROM_ZERO");
    expect(result.casArtifactUri.startsWith("cas://")).toBe(true);
    expect(result.currentSefirah).toBe("MALKHUT");
    expect(result.storyboardSummary.length).toBe(4);
    expect(result.subtitlesCompiled).toBe(true);
    expect(result.motionApplied).toBe(true);
    expect(result.publishedReceiptsCount).toBeGreaterThan(0);
  });

  // 2. Mode B: Transform Existing Material (Sub-options)
  it("transforms existing material with ONLY_CAPTIONS pipeline", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    const result = await studio.transformExisting({
      option: "ONLY_CAPTIONS",
      scriptText: "Transform this audio with rhythmic word-level captions"
    });

    expect(result.mode).toBe("EXISTING_MATERIAL");
    expect(result.selectedOption).toBe("ONLY_CAPTIONS");
    expect(result.subtitlesCompiled).toBe(true);
    expect(result.motionApplied).toBe(false);
    expect(result.casArtifactUri.startsWith("cas://")).toBe(true);
  });

  it("transforms existing material with ONLY_MOTION pipeline", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    const result = await studio.transformExisting({
      option: "ONLY_MOTION",
      scriptText: "Apply fluid dynamic motion and physics-based easing"
    });

    expect(result.selectedOption).toBe("ONLY_MOTION");
    expect(result.subtitlesCompiled).toBe(false);
    expect(result.motionApplied).toBe(true);
    expect(result.casArtifactUri.startsWith("cas://")).toBe(true);
  });

  it("transforms existing material with MOTION_AND_CAPTIONS pipeline", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    const result = await studio.transformExisting({
      option: "MOTION_AND_CAPTIONS",
      scriptText: "Apply both kinetic subtitles and motion layers"
    });

    expect(result.selectedOption).toBe("MOTION_AND_CAPTIONS");
    expect(result.subtitlesCompiled).toBe(true);
    expect(result.motionApplied).toBe(true);
  });

  it("transforms existing material with FULL_OPTIMIZATION pipeline", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    const result = await studio.transformExisting({
      option: "FULL_OPTIMIZATION",
      scriptText: "Execute full structural, hook and audiovisual optimization"
    });

    expect(result.selectedOption).toBe("FULL_OPTIMIZATION");
    expect(result.subtitlesCompiled).toBe(true);
    expect(result.motionApplied).toBe(true);
    expect(result.casArtifactUri.startsWith("cas://")).toBe(true);
  });

  // 3. Tree of Life Control Center Visualization Provider
  it("provides comprehensive details for all 8 Sephiroth nodes", () => {
    const provider = new TreeOfLifeControlCenterProvider();
    const details = provider.getSephirothDetails();

    expect(details.length).toBe(8);
    expect(details[0].sefirah).toBe("KETER");
    expect(details[0].activeModule).toBe("ARQUITECTO");

    expect(details[3].sefirah).toBe("DAAT");
    expect(details[3].activeModule).toBe("SHIM");
    expect(details[3].status).toBe("VERIFIED");

    expect(details[7].sefirah).toBe("MALKHUT");
    expect(details[7].activeModule).toBe("HE");
    expect(details[7].status).toBe("MANIFESTED");
  });

  // 4. Project Library Persistence
  it("persists created projects into SQLite and queries them cleanly", async () => {
    const library = new StudioProjectLibrary(":memory:");

    library.saveProject({
      projectId: "proj_saved_101",
      title: "Master Architectural Video",
      mode: "FROM_ZERO",
      currentSefirah: "MALKHUT",
      casArtifactUri: "cas://abc123sha256",
      scriptContent: "Canonical script",
      storyboardSummary: ["Scene 1", "Scene 2"],
      subtitlesCompiled: true,
      motionApplied: true,
      publishedReceiptsCount: 4,
      completedAt: new Date().toISOString()
    });

    const projects = library.listProjects();
    expect(projects.length).toBe(1);
    expect(projects[0].projectId).toBe("proj_saved_101");
    expect(projects[0].casArtifactUri).toBe("cas://abc123sha256");
  });
});
