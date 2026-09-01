import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// Domain Runtimes
import { createLienzoService } from "../LIENZO/src/service.js";
import { EventLedger } from "../backbone/src/event-ledger.js";
import { ArtifactRegistry } from "../backbone/src/artifact-registry.js";
import { ClientCoreService } from "../YOD/runtime/src/client-core.js";
import { YodEngine } from "../YOD/runtime/src/yod-engine.js";
import { ShimEngine } from "../SHIM/src/shim-engine.js";
import { VavBridgeEngine } from "../vav-bridge/src/vav-bridge-engine.js";
import { ArquitectoEngine } from "../ARQUITECTO/src/arquitecto-engine.js";
import { PublishingService } from "../publishing/src/publishing-service.js";
import { MetricsEngine } from "../metrics/src/metrics-engine.js";
import { LearningEngine } from "../learning/src/learning-engine.js";
import { HeOperationsLienzoAdapter, HeUserContext } from "../HE/06_TASKS_AND_TEAMS/runtime/he-yod-lienzo-bridge.js";

describe("ABRAXAS OS — Master End-to-End Core Loop Acceptance V1", () => {
  it("executes the complete 34-step deterministic Core Loop lifecycle and verifies all system invariants", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "abx_master_core_loop_"));

    // Central Services
    const lienzoService = createLienzoService({ storageDir: tmpDir });
    const eventLedger = new EventLedger();
    const artifactRegistry = new ArtifactRegistry();
    const clientService = new ClientCoreService();
    const yod = new YodEngine();
    const shim = new ShimEngine(lienzoService, eventLedger);
    const vavBridge = new VavBridgeEngine(lienzoService, artifactRegistry, eventLedger);
    const arquitecto = new ArquitectoEngine(lienzoService, clientService);
    const publishingService = new PublishingService(eventLedger);
    const metricsEngine = new MetricsEngine();
    const learningEngine = new LearningEngine(metricsEngine);
    const heAdapter = new HeOperationsLienzoAdapter(clientService, lienzoService, eventLedger);

    const producerUser: HeUserContext = { userId: "lead_producer", role: "PRODUCER" };

    // STEP 1: Create ClientCore CLIENT_A
    const clientA = await clientService.createClient({
      clientId: "client_neuralflow",
      name: "NeuralFlow AI",
      pillars: ["Latency Zero", "Distributed Inference", "Kernel Optimization"],
      claims: ["Sub-5ms global p99 latency", "Zero memory allocations on fast path"],
      brandVoice: "Authoritative, mathematically rigorous, no-fluff",
      targetAudiences: ["Lead Systems Engineers", "ML Infrastructure Directors"],
      actorId: "lead_strategist"
    });
    expect(clientA.clientId).toBe("client_neuralflow");
    expect(clientA.version).toBe(1);

    // STEP 2: YOD detects a justified opportunity
    const opportunity = yod.generateOpportunity(clientA, {
      underrepresentedPillar: "Kernel Optimization",
      coverageGap: "0 posts on kernel bypass in last 30 days",
      recommendedFormatId: "FORMAT_CASE_STUDY_REEL_V1",
      recommendedStructureId: "STRUCTURE_HOOK_PROBLEM_PROOF_CTA_V1",
      hookConcept: "Why standard Linux networking drops packets at 100Gbps",
      score: 96,
      actorId: "yod_ai_planner"
    });
    expect(opportunity.score).toBe(96);
    expect(opportunity.justification.coverageGap).toContain("kernel bypass");

    // STEP 3 & 4: User accepts -> YOD creates Plan
    const plan = yod.createPlanFromOpportunity(
      opportunity,
      [
        {
          title: "Bypassing the Linux Kernel for 100Gbps AI Streams",
          formatId: "FORMAT_CASE_STUDY_REEL_V1",
          structureId: "STRUCTURE_HOOK_PROBLEM_PROOF_CTA_V1",
          targetPlatform: "Instagram"
        }
      ],
      "lead_producer"
    );
    expect(plan.items.length).toBe(1);

    // STEP 5 & 6: Plan creates Lienzo -> YOD writes STRATEGY and PLANNED
    const { contentId } = await yod.instantiateLienzoFromPlanItem(
      lienzoService,
      plan,
      plan.items[0]!,
      clientA,
      "yod_bridge"
    );
    let currentLienzo = await lienzoService.getLienzo(contentId);
    expect(currentLienzo.revision).toBe(3);
    expect(currentLienzo.components.length).toBe(2);

    // STEP 7: YOD compiles Recording Pack (Founder Studio model)
    const recPack = yod.compileRecordingPack({
      contentId,
      clientId: clientA.clientId,
      title: currentLienzo.title,
      question: "What bottleneck forced you to implement kernel bypass?",
      context: "Explaining eBPF and DPDK for high-throughput AI inference",
      openTrigger: "At 100Gbps, context switching alone eats 40% of your CPU...",
      possibleHooks: ["Why we bypassed the Linux kernel", "The socket buffer bottleneck"],
      developmentDirections: ["Explain ring buffer overflow", "Show memory bandwidth limit"],
      closeOptions: ["Subscribe for deep systems architecture breakdowns"],
      sourceRequirements: ["Record in high-contrast dark studio with high-gain lavalier mic"],
      visualSupport: ["Show latency comparison benchmark chart"],
      recordingIntent: "Technical authority and breakthrough performance proof",
      actorId: "lead_producer"
    });
    expect(recPack.possibleHooks.length).toBe(2);

    // STEP 8: He creates/projections check for Recording
    const lienzosInHe = await heAdapter.getLienzosProjection(producerUser);
    expect(lienzosInHe.length).toBe(1);
    expect(lienzosInHe[0]?.contentId).toBe(contentId);

    // STEP 9: Arquitecto explains recording direction
    const initialGuidance = await arquitecto.analyzeContext({
      userId: producerUser.userId,
      role: producerUser.role,
      currentRoute: "/studio/recording",
      contentId
    });
    expect(initialGuidance.permissionGranted).toBe(true);

    // STEP 10: Source / transcript is ingested
    const sourceAsset = {
      sourceId: "src_founder_take_01",
      uri: "file:///raw_takes/founder_kernel_take1.wav",
      mimeType: "audio/wav",
      durationUs: 42000000,
      checksum: "sha256:aaaa1111bbbb2222cccc3333dddd4444eeee5555ffff6666aaaa1111bbbb2222",
      createdAt: new Date().toISOString()
    };

    const transcriptSegments = [
      {
        segmentId: "seg_take1_01",
        sourceId: sourceAsset.sourceId,
        speaker: "Founder",
        startUs: 0,
        endUs: 12000000,
        text: "At 100Gbps, standard Linux networking drops packets due to context switching overhead.",
        confidence: 0.99
      },
      {
        segmentId: "seg_take1_02",
        sourceId: sourceAsset.sourceId,
        speaker: "Founder",
        startUs: 12000000,
        endUs: 32000000,
        text: "By utilizing zero-copy ring buffers and DPDK, we achieved sub-5ms p99 latency.",
        confidence: 0.97
      }
    ];

    // Planned beats: P1 (Hook), P2 (Proof), P3 (CTA)
    const plannedBeats = [
      { beatId: "P1", intent: "Hook", expectedKeywords: ["100Gbps", "networking"] },
      { beatId: "P2", intent: "Proof", expectedKeywords: ["DPDK", "latency"] },
      { beatId: "P3", intent: "CTA", expectedKeywords: ["subscribe", "newsletter"] }
    ];

    // STEP 11 & 12: Shim detects P1 FOUND, P2 FOUND, P3 MISSING -> Gap event
    const observationReport = shim.observeSource(contentId, sourceAsset, transcriptSegments, plannedBeats);
    expect(observationReport.gaps.length).toBe(1);
    expect(observationReport.gaps[0]?.beatId).toBe("P3");

    const obsRes = await shim.recordObservedLayer(contentId, currentLienzo.revision, observationReport, "shim_bot");
    currentLienzo = await lienzoService.getLienzo(contentId);
    expect(currentLienzo.revision).toBe(4);

    const gapEvents = await eventLedger.query({ eventType: "SHIM_GAP_DETECTED" });
    expect(gapEvents.length).toBe(1);

    // STEP 13 & 14: Arquitecto suggests pickup instructions for missing P3
    const gapGuidance = await arquitecto.analyzeContext({
      userId: producerUser.userId,
      role: producerUser.role,
      currentRoute: "/studio/recording",
      contentId
    });
    expect(gapGuidance.identifiedGaps).toContain("Missing Beat: P3");
    expect(gapGuidance.recordingGuidance?.pickupInstructions.length).toBeGreaterThan(0);

    // STEP 15: Pickup source imported (P3 provided)
    const pickupSegment = {
      segmentId: "seg_pickup_01",
      sourceId: "src_founder_pickup_01",
      speaker: "Founder",
      startUs: 0,
      endUs: 6000000,
      text: "Subscribe to NeuralFlow engineering breakdowns for more zero-copy architecture deep dives.",
      confidence: 0.99
    };

    // STEP 16 & 17: Shim resolves content explicitly -> RESOLVED layer written
    const resRes = await shim.resolveObservedToBeats(
      contentId,
      currentLienzo.revision,
      [
        {
          beatId: "P1",
          resolvedText: transcriptSegments[0]!.text,
          sourceSegmentId: transcriptSegments[0]!.segmentId,
          startUs: 0,
          endUs: 12000000,
          confirmedBy: "editor_lead",
          confirmedAt: new Date().toISOString()
        },
        {
          beatId: "P2",
          resolvedText: transcriptSegments[1]!.text,
          sourceSegmentId: transcriptSegments[1]!.segmentId,
          startUs: 12000000,
          endUs: 32000000,
          confirmedBy: "editor_lead",
          confirmedAt: new Date().toISOString()
        },
        {
          beatId: "P3",
          resolvedText: pickupSegment.text,
          sourceSegmentId: pickupSegment.segmentId,
          startUs: 0,
          endUs: 6000000,
          confirmedBy: "editor_lead",
          confirmedAt: new Date().toISOString()
        }
      ],
      "editor_lead"
    );
    currentLienzo = await lienzoService.getLienzo(contentId);
    expect(currentLienzo.revision).toBe(5);

    // STEP 18: Create downstream EDIT, CAPTIONS, MOTIONS components
    await lienzoService.createComponent({
      contentId,
      expectedRevision: 5,
      actorId: "editor_lead",
      reason: "Add Cut Track",
      componentId: "comp_vav_cut",
      section: "EDIT",
      layer: "PRODUCTION",
      status: "APPROVED"
    });

    await lienzoService.createComponent({
      contentId,
      expectedRevision: 6,
      actorId: "editor_lead",
      reason: "Add Caption Track",
      componentId: "comp_vav_caption",
      section: "CAPTIONS",
      layer: "PRODUCTION",
      status: "APPROVED"
    });

    await lienzoService.createComponent({
      contentId,
      expectedRevision: 7,
      actorId: "editor_lead",
      reason: "Add Motion Graphic Track",
      componentId: "comp_vav_motion",
      section: "MOTIONS",
      layer: "PRODUCTION",
      status: "APPROVED"
    });

    // Establish dependencies: Cut -> Caption -> Motion
    await lienzoService.addDependency({
      contentId,
      upstreamComponentId: "comp_vav_cut",
      downstreamComponentId: "comp_vav_caption",
      expectedRevision: 8,
      actorId: "editor_lead",
      reason: "Cut feeds Caption"
    });

    await lienzoService.addDependency({
      contentId,
      upstreamComponentId: "comp_vav_caption",
      downstreamComponentId: "comp_vav_motion",
      expectedRevision: 9,
      actorId: "editor_lead",
      reason: "Caption feeds Motion"
    });

    currentLienzo = await lienzoService.getLienzo(contentId);
    expect(currentLienzo.revision).toBe(10);

    // STEP 19 & 20: Pipeline executes VAV Cut -> Caption -> Motion subset
    const cutJob = await vavBridge.executeProductionJob({
      jobType: "CUT_JOB",
      contentId,
      componentId: "comp_vav_cut",
      lienzoRevision: 10,
      intentVersion: 1,
      inputArtifacts: [],
      parameters: { targetFps: 60 },
      actorId: "vav_worker"
    });
    expect(cutJob.status).toBe("COMPLETED");

    const captionJob = await vavBridge.executeProductionJob({
      jobType: "CAPTION_JOB",
      contentId,
      componentId: "comp_vav_caption",
      lienzoRevision: 11,
      intentVersion: 1,
      inputArtifacts: [cutJob.artifactRef!.artifactId],
      parameters: { font: "Inter-Bold" },
      actorId: "vav_worker"
    });
    expect(captionJob.status).toBe("COMPLETED");

    const motionJob = await vavBridge.executeProductionJob({
      jobType: "MOTION_JOB",
      contentId,
      componentId: "comp_vav_motion",
      lienzoRevision: 12,
      intentVersion: 1,
      inputArtifacts: [captionJob.artifactRef!.artifactId],
      parameters: { motionPreset: "KINETIC_FLOW" },
      actorId: "vav_worker"
    });
    expect(motionJob.status).toBe("COMPLETED");

    // STEP 21 & 22 & 23: Artifacts registered, events emitted, Lienzo in GENERATED production states
    currentLienzo = await lienzoService.getLienzo(contentId);
    expect(currentLienzo.revision).toBe(13);
    const finalMotionComp = currentLienzo.components.find((c) => c.componentId === "comp_vav_motion")!;
    expect(finalMotionComp.status).toBe("GENERATED");
    expect(finalMotionComp.artifactRefs.length).toBe(1);

    // Verify artifact lineage
    const lineage = await artifactRegistry.getLineage(motionJob.artifactRef!.artifactId);
    expect(lineage.length).toBe(3);

    // STEP 24: QA Approval occurs through He RBAC
    const qaApprovalRes = await heAdapter.updateLienzoComponentFromHe(producerUser, {
      contentId,
      componentId: "comp_vav_motion",
      expectedRevision: 13,
      reason: "QA verified audio sync, color safe zones, and caption timing",
      status: "APPROVED"
    });
    expect(qaApprovalRes.component.status).toBe("APPROVED");
    currentLienzo = await lienzoService.getLienzo(contentId);
    expect(currentLienzo.revision).toBe(14);

    // STEP 25 & 26: Three PublicationTargets are created and scheduled (freezing snapshots)
    const targetIG = await publishingService.createTarget({
      contentId,
      platform: "Instagram",
      accountId: "@neuralflow_ai",
      timezone: "UTC",
      actorId: "social_lead"
    });

    const targetTikTok = await publishingService.createTarget({
      contentId,
      platform: "TikTok",
      accountId: "@neuralflow",
      timezone: "UTC",
      actorId: "social_lead"
    });

    const targetYT = await publishingService.createTarget({
      contentId,
      platform: "YouTube",
      accountId: "UC_NeuralFlow",
      timezone: "UTC",
      actorId: "social_lead"
    });

    await publishingService.scheduleTarget({
      targetId: targetIG.targetId,
      scheduledAt: "2026-09-05T15:00:00Z",
      copyText: "Instagram Copy: Why context switching kills 100Gbps streams.",
      mediaArtifactId: motionJob.artifactRef!.artifactId,
      actorId: "social_lead"
    });

    await publishingService.scheduleTarget({
      targetId: targetTikTok.targetId,
      scheduledAt: "2026-09-05T16:00:00Z",
      copyText: "TikTok Hook: Stop using socket buffers for AI inference.",
      mediaArtifactId: motionJob.artifactRef!.artifactId,
      actorId: "social_lead"
    });

    await publishingService.scheduleTarget({
      targetId: targetYT.targetId,
      scheduledAt: "2026-09-05T17:00:00Z",
      copyText: "YouTube Shorts: Linux Kernel Bypass Deep Dive",
      mediaArtifactId: motionJob.artifactRef!.artifactId,
      actorId: "social_lead"
    });

    // STEP 27 & 28: Ingest raw performance metrics for Instagram & normalize
    await publishingService.executePublish(targetIG.targetId, "cron_publisher");
    const snap = metricsEngine.ingestSnapshot({
      contentId,
      targetId: targetIG.targetId,
      platform: "Instagram",
      raw: {
        views: 85000,
        reach: 72000,
        impressions: 95000,
        likes: 6400,
        comments: 520,
        shares: 1800,
        saves: 2900,
        watchTimeSeconds: 2800000,
        averageViewDurationSeconds: 38,
        completionRate: 0.88,
        clicks: 3400,
        leads: 290,
        conversions: 85
      }
    });

    const normalizedMetrics = metricsEngine.normalizeMetrics(snap.raw);
    expect(normalizedMetrics.retentionScore).toBe(88);
    expect(normalizedMetrics.compositePerformanceScore).toBeGreaterThanOrEqual(50);

    // STEP 29 & 30: LearningSignal created & next YOD opportunity references it
    const signal = learningEngine.generateLearningSignal({
      contentId,
      clientId: clientA.clientId,
      structureId: "STRUCTURE_HOOK_PROBLEM_PROOF_CTA_V1",
      formatId: "FORMAT_CASE_STUDY_REEL_V1",
      snapshot: snap
    });

    expect(signal.hypothesis).toContain("demonstrates high retention");

    const nextOpportunity = yod.generateOpportunity(clientA, {
      underrepresentedPillar: "Distributed Inference",
      coverageGap: "Follow-up systems teardown after viral kernel bypass piece",
      recommendedFormatId: signal.formatId,
      recommendedStructureId: signal.structureId,
      hookConcept: "Zero-copy tensor allocation across GPU clusters",
      score: 99,
      actorId: "yod_ai_planner"
    });
    expect(nextOpportunity.score).toBe(99);

    // STEP 31: Source Truth remains untouched by learned hypothesis
    const clientAfterLearning = await clientService.getClient(clientA.clientId);
    expect(clientAfterLearning.claims).toEqual([
      "Sub-5ms global p99 latency",
      "Zero memory allocations on fast path"
    ]);
    expect(clientAfterLearning.version).toBe(1);

    // STEP 32 & 33: Reload from fresh persistence instance and verify complete lineage
    const freshLienzoService = createLienzoService({ storageDir: tmpDir });
    const reloadedLienzo = await freshLienzoService.getLienzo(contentId);
    expect(reloadedLienzo.contentId).toBe(contentId);
    expect(reloadedLienzo.revision).toBe(14);
    expect(reloadedLienzo.history.length).toBe(14);

    // Clean up temporary fixture directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
