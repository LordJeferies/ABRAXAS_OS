import { describe, it, expect } from "vitest";
import { ArquitectoEngine } from "../src/arquitecto-engine.js";
import { createLienzoService } from "../../LIENZO/src/service.js";

describe("ARQUITECTO Private Contextual Runtime V1 — Guidance & Coaches", () => {
  it("diagnoses Shim gaps truthfully and provides actionable recording coach pickup instructions", async () => {
    const lienzoService = createLienzoService();
    const arquitecto = new ArquitectoEngine(lienzoService);

    // 1. Create Lienzo with a blocked OBSERVED component containing a Gap
    const { lienzo } = await lienzoService.createLienzo({
      contentId: "content_coach_01",
      title: "Founder Story #4",
      actorId: "lead_producer",
      reason: "Init"
    });

    await lienzoService.createComponent({
      contentId: "content_coach_01",
      expectedRevision: 1,
      actorId: "shim_worker",
      reason: "Shim observed missing beat P3",
      componentId: "comp_observed_with_gap",
      section: "AUDIO",
      layer: "OBSERVED",
      status: "BLOCKED",
      data: {
        gaps: [{ beatId: "P3", intent: "Call to Action" }]
      }
    });

    // 2. Arquitecto analyzes context
    const analysis = await arquitecto.analyzeContext({
      userId: "user_director",
      role: "PRODUCER",
      currentRoute: "/studio/recording-session",
      contentId: "content_coach_01"
    });

    expect(analysis.identifiedGaps).toContain("Missing Beat: P3");
    expect(analysis.suggestedNextAction).toContain("Record pickup take");
    expect(analysis.recordingGuidance?.framing).toContain("Medium close-up");
    expect(analysis.recordingGuidance?.pickupInstructions.length).toBe(2);
  });

  it("provides external editor guidance when user is working in external NLE (e.g. DaVinci Resolve)", async () => {
    const lienzoService = createLienzoService();
    const arquitecto = new ArquitectoEngine(lienzoService);

    const { lienzo } = await lienzoService.createLienzo({
      contentId: "content_davinci_01",
      title: "DaVinci Resolve Workflow",
      actorId: "lead_producer",
      reason: "Init",
      initialLifecycle: "PRODUCTION"
    });

    const analysis = await arquitecto.analyzeContext({
      userId: "user_editor",
      role: "EDITOR",
      currentRoute: "/editor/timeline",
      contentId: "content_davinci_01",
      externalToolContext: "DaVinci Resolve Studio"
    });

    expect(analysis.productionGuidance?.externalEditorNotes).toContain("DaVinci Resolve Studio");
    expect(analysis.productionGuidance?.captionPlacement).toContain("Center-third safe zone");
  });
});
