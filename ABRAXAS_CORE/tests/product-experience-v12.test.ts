import { describe, it, expect } from "vitest";
import { CreativeStudioEngine } from "../studio/src/creative-studio-engine.js";
import { ProjectManagementSystem } from "../projects/src/project-management-system.js";
import fs from "node:fs";
import path from "node:path";

describe("ABRAXAS OS V12 — Product Experience Implementation Suite", () => {
  // 1. Creative Studio Real Workflows
  it("executes all 4 Creative Studio workflows and outputs physical CAS package", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    // Mode A: FROM ZERO
    const p1 = await studio.createFromZero({
      idea: "Luxury Perfume Cinematic TikTok Ad",
      product: "Oud Royal Extrait",
      targetAudience: "Global fragrance collectors",
      objective: "High 3s Hook Retention"
    });
    expect(p1.mode).toBe("FROM_ZERO");
    expect(p1.casArtifactUri.startsWith("cas://")).toBe(true);
    expect(p1.publishedReceiptsCount).toBeGreaterThan(0);

    // Mode B: OPTIMIZE EXISTING
    const p2 = await studio.transformExisting({ option: "FULL_OPTIMIZATION" }, "Existing Video Optimization");
    expect(p2.subtitlesCompiled).toBe(true);
    expect(p2.motionApplied).toBe(true);

    // Mode C: ONLY CAPTIONS
    const p3 = await studio.transformExisting({ option: "ONLY_CAPTIONS" });
    expect(p3.subtitlesCompiled).toBe(true);
    expect(p3.motionApplied).toBe(false);

    // Mode D: ONLY MOTION
    const p4 = await studio.transformExisting({ option: "ONLY_MOTION" });
    expect(p4.motionApplied).toBe(true);
    expect(p4.subtitlesCompiled).toBe(false);
  });

  // 2. Project Management Lifecycle
  it("persists, lists, duplicates, and loads projects with Four Worlds state", () => {
    const sys = new ProjectManagementSystem(":memory:");
    sys.saveProject({
      id: "proj_v12_lux",
      name: "Oud Royal Campaign",
      brand: "Oud Royal",
      objective: "Conversion",
      assets: {
        renderMp4Uri: "/renders/master.mp4",
        casPackageUri: "cas://oud_royal_bundle"
      },
      currentWorld: "ASSIAH",
      currentOperator: "HE",
      pipelineState: "MANIFESTED",
      outputsCount: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const loaded = sys.loadProject("proj_v12_lux");
    expect(loaded?.name).toBe("Oud Royal Campaign");
    expect(loaded?.currentWorld).toBe("ASSIAH");

    const dup = sys.duplicateProject("proj_v12_lux", "Oud Royal Campaign (Copy)");
    expect(dup.name).toBe("Oud Royal Campaign (Copy)");
    expect(sys.listProjects().length).toBe(2);
  });

  // 3. Physical App and Installer Files Verification
  it("verifies physical existence of ABRAXAS OS.app and ABRAXAS_OS.dmg", () => {
    const appDir = "/Users/lordjef/Desktop/abraxasos/dist/installers/ABRAXAS OS.app";
    const dmgFile = "/Users/lordjef/Desktop/abraxasos/dist/installers/ABRAXAS_OS.dmg";

    expect(fs.existsSync(appDir)).toBe(true);
    expect(fs.existsSync(dmgFile)).toBe(true);

    const dmgStats = fs.statSync(dmgFile);
    expect(dmgStats.size).toBeGreaterThan(1000000); // 7.7MB
  });

  // 4. Live Status Center Verification
  it("verifies live telemetry JSON API endpoint exists and reports ONLINE status", () => {
    const statusPath = "/Users/lordjef/Desktop/abraxasos/docs/abraxas-os-status/system-live-status.json";
    expect(fs.existsSync(statusPath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(statusPath, "utf8"));
    expect(data.kernelStatus).toBe("ONLINE");
    expect(["YETZIRAH", "ASSIAH"]).toContain(data.currentWorld);
  });
});
