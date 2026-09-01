import { describe, it, expect } from "vitest";
import { ShimEngine } from "../src/shim-engine.js";
import { SourceAsset, TranscriptSegment, PlannedBeat } from "../src/types.js";
import { createLienzoService } from "../../LIENZO/src/service.js";
import { EventLedger } from "../../backbone/src/event-ledger.js";

describe("SHIM Real-Source Core V1 — Observation, Gap Detection & Resolution", () => {
  it("observes transcript against planned beats, detects gaps truthfully, and records OBSERVED and RESOLVED layers", async () => {
    const lienzoService = createLienzoService();
    const eventLedger = new EventLedger();
    const shim = new ShimEngine(lienzoService, eventLedger);

    // 1. Create Lienzo in PLANNED state
    const { lienzo } = await lienzoService.createLienzo({
      contentId: "content_shim_01",
      title: "Solo Founder Episode #12",
      actorId: "director_lead",
      reason: "Init project",
      initialLifecycle: "PLANNED"
    });

    // Planned Beats: P1 (Hook), P2 (Story), P3 (CTA)
    const plannedBeats: PlannedBeat[] = [
      { beatId: "P1", intent: "Hook line", expectedKeywords: ["architecture", "scaling"] },
      { beatId: "P2", intent: "Core insight", expectedKeywords: ["database", "bottleneck"] },
      { beatId: "P3", intent: "Call to action", expectedKeywords: ["newsletter", "subscribe"] }
    ];

    // Real observed source audio
    const source: SourceAsset = {
      sourceId: "src_recording_001",
      uri: "file:///recordings/raw_founder_take_1.wav",
      mimeType: "audio/wav",
      durationUs: 45000000,
      checksum: "sha256:abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
      createdAt: new Date().toISOString()
    };

    // Transcript: Contains P1 and P2, but speaker forgot P3!
    const segments: TranscriptSegment[] = [
      {
        segmentId: "seg_01",
        sourceId: source.sourceId,
        speaker: "Founder",
        startUs: 0,
        endUs: 8000000,
        text: "Here is what nobody tells you about scaling architecture under load.",
        confidence: 0.98
      },
      {
        segmentId: "seg_02",
        sourceId: source.sourceId,
        speaker: "Founder",
        startUs: 8000000,
        endUs: 25000000,
        text: "We discovered that our main database bottleneck was actually socket exhaustion.",
        confidence: 0.96
      }
    ];

    // 2. Observe Source (P1 FOUND, P2 FOUND, P3 MISSING)
    const report = shim.observeSource(lienzo.contentId, source, segments, plannedBeats);

    expect(report.observations.find((o) => o.beatId === "P1")?.status).toBe("FOUND");
    expect(report.observations.find((o) => o.beatId === "P2")?.status).toBe("FOUND");
    expect(report.observations.find((o) => o.beatId === "P3")?.status).toBe("MISSING");
    expect(report.gaps.length).toBe(1);
    expect(report.gaps[0]?.beatId).toBe("P3");

    // 3. Record OBSERVED layer in Lienzo
    const obsRes = await shim.recordObservedLayer(
      lienzo.contentId,
      1,
      report,
      "shim_worker"
    );
    expect(obsRes.revision).toBe(2);

    // Verify Gap event logged
    const gapEvents = await eventLedger.query({ eventType: "SHIM_GAP_DETECTED" });
    expect(gapEvents.length).toBe(1);
    expect(gapEvents[0]?.contentId).toBe("content_shim_01");

    // 4. Explicitly Resolve Found Beats (RESOLVED layer)
    const resRes = await shim.resolveObservedToBeats(
      lienzo.contentId,
      2,
      [
        {
          beatId: "P1",
          resolvedText: segments[0]!.text,
          sourceSegmentId: "seg_01",
          startUs: 0,
          endUs: 8000000,
          confirmedBy: "editor_charlie",
          confirmedAt: new Date().toISOString()
        },
        {
          beatId: "P2",
          resolvedText: segments[1]!.text,
          sourceSegmentId: "seg_02",
          startUs: 8000000,
          endUs: 25000000,
          confirmedBy: "editor_charlie",
          confirmedAt: new Date().toISOString()
        }
      ],
      "editor_charlie"
    );

    expect(resRes.revision).toBe(3);

    // 5. Verify PLANNED != OBSERVED != RESOLVED in Lienzo state
    const finalLienzo = await lienzoService.getLienzo(lienzo.contentId);
    const observedComp = finalLienzo.components.find((c) => c.layer === "OBSERVED");
    const resolvedComp = finalLienzo.components.find((c) => c.layer === "RESOLVED");

    expect(observedComp).toBeDefined();
    expect(observedComp?.status).toBe("BLOCKED"); // blocked due to gap
    expect(resolvedComp).toBeDefined();
    expect(resolvedComp?.status).toBe("APPROVED");
    expect((resolvedComp?.data["resolvedBeats"] as any[]).length).toBe(2);
  });
});
