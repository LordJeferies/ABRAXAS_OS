import { describe, it, expect } from "vitest";
import { EventLedger } from "../src/event-ledger.js";
import { ArtifactRegistry } from "../src/artifact-registry.js";
import { BackboneValidationError, ArtifactNotFoundError } from "../src/errors.js";

describe("Backbone V1 — Canonical Event Ledger & Artifact Registry", () => {
  it("maintains append-only event ledger and supports filtering by contentId and eventType", async () => {
    const ledger = new EventLedger();

    const ev1 = await ledger.append({
      eventType: "LIENZO_CREATED",
      contentId: "content_100",
      actorId: "user_lead",
      reason: "Init",
      newVersion: 1
    });

    const ev2 = await ledger.append({
      eventType: "TASK_CREATED",
      contentId: "content_100",
      taskId: "task_cut_01",
      actorId: "user_lead",
      reason: "Create editing task",
      newVersion: 1
    });

    const ev3 = await ledger.append({
      eventType: "LIENZO_CREATED",
      contentId: "content_200",
      actorId: "user_other",
      reason: "Other project"
    });

    expect(ev1.eventId).toBeDefined();
    expect(ev2.taskId).toBe("task_cut_01");

    const all = await ledger.getAll();
    expect(all.length).toBe(3);

    const filteredContent100 = await ledger.query({ contentId: "content_100" });
    expect(filteredContent100.length).toBe(2);

    const filteredLienzoCreated = await ledger.query({ eventType: "LIENZO_CREATED" });
    expect(filteredLienzoCreated.length).toBe(2);
  });

  it("registers artifacts with unique IDs, hash, and traceable recursive basedOn lineage", async () => {
    const registry = new ArtifactRegistry();

    // 1. Raw Audio Artifact
    const art1 = await registry.register({
      artifactId: "art_raw_audio_01",
      contentId: "content_100",
      type: "audio_wav",
      version: 1,
      createdBy: "ingest_bot",
      uri: "file:///assets/raw/speech.wav",
      hash: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
    });

    // 2. Transcript Artifact based on Raw Audio
    const art2 = await registry.register({
      artifactId: "art_transcript_01",
      contentId: "content_100",
      type: "transcript_json",
      version: 1,
      createdBy: "whisper_service",
      basedOn: [art1.artifactId],
      uri: "file:///assets/transcripts/speech.json",
      hash: "sha256:2222222222222222222222222222222222222222222222222222222222222222"
    });

    // 3. Rendered MP4 based on Transcript & Audio
    const art3 = await registry.register({
      artifactId: "art_render_mp4_01",
      contentId: "content_100",
      type: "rendered_video_mp4",
      version: 1,
      createdBy: "vav_render_engine",
      basedOn: [art2.artifactId],
      uri: "file:///assets/renders/final.mp4",
      hash: "sha256:3333333333333333333333333333333333333333333333333333333333333333"
    });

    // Query lineage for final render
    const lineage = await registry.getLineage(art3.artifactId);
    expect(lineage.length).toBe(3);
    const lineageIds = lineage.map((a) => a.artifactId);
    expect(lineageIds).toEqual(["art_render_mp4_01", "art_transcript_01", "art_raw_audio_01"]);

    // List by content
    const contentArts = await registry.listByContent("content_100");
    expect(contentArts.length).toBe(3);
  });

  it("fails closed when registering artifact without contentId or duplicate ID", async () => {
    const registry = new ArtifactRegistry();

    await expect(
      registry.register({
        contentId: "   ",
        type: "audio",
        version: 1,
        createdBy: "user",
        uri: "file:///a.wav",
        hash: "hash"
      })
    ).rejects.toThrow(BackboneValidationError);

    await registry.register({
      artifactId: "art_unique_1",
      contentId: "content_1",
      type: "audio",
      version: 1,
      createdBy: "user",
      uri: "file:///a.wav",
      hash: "hash"
    });

    await expect(
      registry.register({
        artifactId: "art_unique_1",
        contentId: "content_1",
        type: "audio",
        version: 1,
        createdBy: "user",
        uri: "file:///a.wav",
        hash: "hash"
      })
    ).rejects.toThrow(BackboneValidationError);
  });
});
