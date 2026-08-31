import { describe, it, expect } from "vitest";
import { BrandMemorySystem } from "../brand-dna/src/brand-memory-system.js";
import { ProjectManagementSystem } from "../projects/src/project-management-system.js";
import { AutoUpdateSystem } from "../updater/src/auto-update-system.js";
import { CreativeStudioEngine } from "../studio/src/creative-studio-engine.js";

describe("ABRAXAS OS V9.0 — Complete Productization & macOS Release Suite", () => {
  // 1. Brand DNA Memory System
  it("registers brand DNA guidelines and recalls them cleanly from SQLite memory", () => {
    const brandSys = new BrandMemorySystem(":memory:");

    brandSys.registerBrandDNA({
      brandId: "brand_oud_royal",
      name: "Oud Royal Parfums",
      voiceTone: "Sophisticated, enigmatic, authoritative",
      primaryColors: ["#d4af37", "#0a0a0c", "#38bdf8"],
      targetAudience: "Luxury fragrance collectors & trendsetters",
      visualReferences: ["Dark mood board", "135deg gold lighting"],
      previousCampaignsCount: 4,
      averageHookRetention: 92.4,
      updatedAt: new Date().toISOString()
    });

    const recalled = brandSys.getBrandDNA("brand_oud_royal");
    expect(recalled).toBeDefined();
    expect(recalled?.name).toBe("Oud Royal Parfums");
    expect(recalled?.primaryColors).toContain("#d4af37");
    expect(recalled?.averageHookRetention).toBe(92.4);

    const brands = brandSys.listBrands();
    expect(brands.length).toBe(1);
  });

  // 2. Project Management System
  it("saves, loads, duplicates, and lists managed projects with Four Worlds state", () => {
    const projSys = new ProjectManagementSystem(":memory:");

    const project = {
      id: "proj_perfume_v9",
      name: "Oud Royal Launch",
      brand: "Oud Royal",
      objective: "Drive viral TikTok conversions",
      assets: {
        renderMp4Uri: "/renders/master.mp4",
        casPackageUri: "cas://7197210...master"
      },
      currentWorld: "ASSIAH" as const,
      currentOperator: "HE",
      pipelineState: "MANIFESTED" as const,
      outputsCount: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projSys.saveProject(project);

    const loaded = projSys.loadProject("proj_perfume_v9");
    expect(loaded).toBeDefined();
    expect(loaded?.name).toBe("Oud Royal Launch");
    expect(loaded?.currentWorld).toBe("ASSIAH");

    const duplicated = projSys.duplicateProject("proj_perfume_v9", "Oud Royal Launch (Copy)");
    expect(duplicated.name).toBe("Oud Royal Launch (Copy)");
    expect(duplicated.id).not.toBe("proj_perfume_v9");

    const allProjects = projSys.listProjects();
    expect(allProjects.length).toBe(2);
  });

  // 3. Auto-Update System
  it("checks version and verifies zero migration requirement for V9.0", () => {
    const updater = new AutoUpdateSystem();
    const status = updater.checkUpdate("9.0.0");

    expect(status.currentVersion).toBe("9.0.0");
    expect(status.latestVersion).toBe("9.0.0");
    expect(status.updateAvailable).toBe(false);
    expect(status.migrationRequired).toBe(false);
  });

  // 4. Creative Workflows Execution (Full Integration)
  it("verifies full creative execution across all 4 workflows", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    // 1. Create From Zero
    const p1 = await studio.createFromZero({
      idea: "Viral Perfume Campaign",
      product: "Oud Royal",
      targetAudience: "Luxury buyers",
      objective: "Sales conversion"
    });
    expect(p1.casArtifactUri.startsWith("cas://")).toBe(true);

    // 2. Transform Existing
    const p2 = await studio.transformExisting({ option: "FULL_OPTIMIZATION" });
    expect(p2.subtitlesCompiled).toBe(true);
    expect(p2.motionApplied).toBe(true);

    // 3. Caption Only
    const p3 = await studio.transformExisting({ option: "ONLY_CAPTIONS" });
    expect(p3.subtitlesCompiled).toBe(true);
    expect(p3.motionApplied).toBe(false);

    // 4. Motion Only
    const p4 = await studio.transformExisting({ option: "ONLY_MOTION" });
    expect(p4.motionApplied).toBe(true);
    expect(p4.subtitlesCompiled).toBe(false);
  });
});
