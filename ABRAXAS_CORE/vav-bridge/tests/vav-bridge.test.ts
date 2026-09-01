import { describe, it, expect } from "vitest";
import { VavBridgeEngine } from "../src/vav-bridge-engine.js";
import { createLienzoService } from "../../LIENZO/src/service.js";
import { ArtifactRegistry } from "../../backbone/src/artifact-registry.js";
import { EventLedger } from "../../backbone/src/event-ledger.js";

describe("VAV ↔ Lienzo / Backbone Bridge V1 — Production Job Lifecycle", () => {
  it("executes Cut, Caption, and Motion jobs sequentially with artifact lineage and event tracking", async () => {
    const lienzoService = createLienzoService();
    const artifactRegistry = new ArtifactRegistry();
    const eventLedger = new EventLedger();
    const bridge = new VavBridgeEngine(lienzoService, artifactRegistry, eventLedger);

    // 1. Create Lienzo
    const { lienzo } = await lienzoService.createLienzo({
      contentId: "content_vav_01",
      title: "VAV Multi-Stage Production",
      actorId: "director_lead",
      reason: "Init"
    });

    // 2. Create EDIT component for Cuts
    const cutComp = await lienzoService.createComponent({
      contentId: "content_vav_01",
      expectedRevision: 1,
      actorId: "director_lead",
      reason: "Add Cut Component",
      componentId: "comp_cut_track",
      section: "EDIT",
      layer: "PRODUCTION",
      status: "APPROVED"
    });

    // Execute CUT_JOB
    const cutJob = await bridge.executeProductionJob({
      jobType: "CUT_JOB",
      contentId: "content_vav_01",
      componentId: "comp_cut_track",
      lienzoRevision: 2,
      intentVersion: 1,
      inputArtifacts: [],
      parameters: { cutList: [{ startUs: 0, endUs: 5000000 }] },
      actorId: "editor_bob"
    });

    expect(cutJob.status).toBe("COMPLETED");
    expect(cutJob.artifactRef?.kind).toBe("vav_cut_job_artifact");

    // 3. Create CAPTIONS component dependent on Cut Artifact
    const captionComp = await lienzoService.createComponent({
      contentId: "content_vav_01",
      expectedRevision: 3,
      actorId: "editor_bob",
      reason: "Add Caption Component",
      componentId: "comp_caption_track",
      section: "CAPTIONS",
      layer: "PRODUCTION",
      status: "APPROVED"
    });

    // Execute CAPTION_JOB
    const captionJob = await bridge.executeProductionJob({
      jobType: "CAPTION_JOB",
      contentId: "content_vav_01",
      componentId: "comp_caption_track",
      lienzoRevision: 4,
      intentVersion: 1,
      inputArtifacts: [cutJob.artifactRef!.artifactId],
      parameters: { fontStyle: "HORROR_BOLD", maxChars: 25 },
      actorId: "ai_captioner"
    });

    expect(captionJob.status).toBe("COMPLETED");

    // 4. Create MOTIONS component dependent on Caption Artifact
    const motionComp = await lienzoService.createComponent({
      contentId: "content_vav_01",
      expectedRevision: 5,
      actorId: "editor_bob",
      reason: "Add Motion Component",
      componentId: "comp_motion_track",
      section: "MOTIONS",
      layer: "PRODUCTION",
      status: "APPROVED"
    });

    // Execute MOTION_JOB
    const motionJob = await bridge.executeProductionJob({
      jobType: "MOTION_JOB",
      contentId: "content_vav_01",
      componentId: "comp_motion_track",
      lienzoRevision: 6,
      intentVersion: 1,
      inputArtifacts: [captionJob.artifactRef!.artifactId],
      parameters: { motionFamily: "KINETIC_BOUNCE" },
      actorId: "animator_dan"
    });

    expect(motionJob.status).toBe("COMPLETED");

    // 5. Verify Backbone Artifact Lineage
    const finalMotionArtifact = await artifactRegistry.get(motionJob.artifactRef!.artifactId);
    expect(finalMotionArtifact.basedOn).toEqual([captionJob.artifactRef!.artifactId]);

    const fullLineage = await artifactRegistry.getLineage(motionJob.artifactRef!.artifactId);
    expect(fullLineage.length).toBe(3);

    // 6. Verify Events
    const events = await eventLedger.query({ contentId: "content_vav_01" });
    const vavEvents = events.filter((e) => e.eventType.startsWith("VAV_"));
    expect(vavEvents.length).toBe(3);

    // 7. Verify Lienzo Component State
    const finalLienzo = await lienzoService.getLienzo("content_vav_01");
    const mComp = finalLienzo.components.find((c) => c.componentId === "comp_motion_track")!;
    expect(mComp.status).toBe("GENERATED");
    expect(mComp.artifactRefs.length).toBe(1);
    expect(mComp.artifactRefs[0]?.artifactId).toBe(motionJob.artifactRef!.artifactId);
  });
});
