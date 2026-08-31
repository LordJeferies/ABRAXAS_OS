import { describe, it, expect } from "vitest";
import { MODULE_IDENTITIES } from "../../VAV/01_REPO/VAV/apps/captions-desktop/src/studio/ModuleVisualIdentity.js";
import { TreeOfLifeControlCenterProvider } from "../studio/src/control-center-view.js";
import { CreativeStudioEngine } from "../studio/src/creative-studio-engine.js";
import { RenderQueueSystem } from "../media-engine/src/render-queue.js";
import { BootManager } from "../kernel/boot-manager.js";

describe("ABRAXAS OS V7.2 — Product Experience & Status Immersion Suite", () => {
  // 1. Module Visual Identity System
  it("defines distinct visual identities, colors, and code locations for all 8 modules", () => {
    const modules = Object.values(MODULE_IDENTITIES);
    expect(modules.length).toBe(8);

    const arquitecto = MODULE_IDENTITIES["ARQUITECTO"];
    expect(arquitecto.sefirah).toBe("KETER");
    expect(arquitecto.color).toBe("#d4af37"); // Gold
    expect(arquitecto.codeLocation).toContain("arquitecto-central.ts");

    const shim = MODULE_IDENTITIES["SHIM"];
    expect(shim.sefirah).toBe("DAAT");
    expect(shim.color).toBe("#a855f7"); // Purple

    const he = MODULE_IDENTITIES["HE"];
    expect(he.sefirah).toBe("MALKHUT");
    expect(he.color).toBe("#14b8a6"); // Teal
  });

  // 2. Tree of Life Control Center Model
  it("provides comprehensive details across all Sephiroth with Da'at reality locking", () => {
    const provider = new TreeOfLifeControlCenterProvider();
    const details = provider.getSephirothDetails();

    expect(details.length).toBe(8);
    expect(details[0].sefirah).toBe("KETER");
    expect(details[3].sefirah).toBe("DAAT");
    expect(details[3].status).toBe("VERIFIED");
    expect(details[7].sefirah).toBe("MALKHUT");
    expect(details[7].status).toBe("MANIFESTED");
  });

  // 3. User Creative Workflows
  it("allows non-technical users to create from zero or transform existing media effortlessly", async () => {
    const bootManager = new BootManager();
    const { report } = await bootManager.launch(":memory:");
    expect(report.kernelStatus).toBe("ONLINE");

    const studio = new CreativeStudioEngine(":memory:");

    // Option 1: Create from zero
    const projZero = await studio.createFromZero({
      idea: "Commercial Luxury Perfume Launch",
      product: "Royal Saffron",
      targetAudience: "Global buyers",
      objective: "Brand elevation"
    });
    expect(projZero.mode).toBe("FROM_ZERO");
    expect(projZero.casArtifactUri.startsWith("cas://")).toBe(true);

    // Option 2: Transform existing (Motion only, Captions only, Full optimization)
    const txOpt1 = await studio.transformExisting({ option: "ONLY_MOTION" });
    expect(txOpt1.motionApplied).toBe(true);

    const txOpt2 = await studio.transformExisting({ option: "ONLY_CAPTIONS" });
    expect(txOpt2.subtitlesCompiled).toBe(true);

    const txOpt3 = await studio.transformExisting({ option: "FULL_OPTIMIZATION" });
    expect(txOpt3.motionApplied).toBe(true);
    expect(txOpt3.subtitlesCompiled).toBe(true);
  });

  // 4. Render Center Queue Integration
  it("tracks jobs from submission to manifest delivery", () => {
    const queue = new RenderQueueSystem();
    const job = queue.enqueue("proj_v72_luxury");

    queue.updateJobState(job.jobId, "ANALYZING", 25, "MEDIA_UNDERSTANDING");
    expect(queue.getJob(job.jobId)?.progressPercentage).toBe(25);

    queue.updateJobState(job.jobId, "RENDERING", 75, "VAV_MOTION_FORGE");
    expect(queue.getJob(job.jobId)?.progressPercentage).toBe(75);

    queue.updateJobState(job.jobId, "COMPLETED", 100, "EXPORT_SYSTEM", "cas://royal_saffron_final_mp4");
    expect(queue.getJob(job.jobId)?.state).toBe("COMPLETED");
  });
});
