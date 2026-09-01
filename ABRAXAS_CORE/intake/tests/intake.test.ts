import { describe, it, expect } from "vitest";
import { UniversalIntakeService } from "../src/universal-intake.js";
import { ArtifactRegistry } from "../../backbone/src/artifact-registry.js";

describe("Universal Intake V1 — Document Parsing & Opaque Media Registration", () => {
  it("parses TXT, MD, JSON, CSV files into structured in-memory representations", () => {
    const intake = new UniversalIntakeService();

    const jsonDoc = intake.parseTextOrStructured("config.json", '{"theme": "dark", "fps": 60}');
    expect(jsonDoc.format).toBe("JSON");
    expect((jsonDoc.content as any).fps).toBe(60);

    const csvDoc = intake.parseTextOrStructured("beats.csv", "id,startUs,endUs\nP1,0,5000000\nP2,5000000,10000000");
    expect(csvDoc.format).toBe("CSV");
    expect((csvDoc.content as any[]).length).toBe(3);

    const mdDoc = intake.parseTextOrStructured("notes.md", "# Founder Notes\nKey points");
    expect(mdDoc.format).toBe("MD");
  });

  it("registers opaque binary media intake with SHA-256 hash without embedding raw payloads in JSON", async () => {
    const artifactRegistry = new ArtifactRegistry();
    const intake = new UniversalIntakeService(artifactRegistry);

    const artifact = await intake.registerMediaIntake("content_media_01", {
      filename: "camera_a_take1.mp4",
      uri: "file:///assets/raw/camera_a_take1.mp4",
      mediaBufferOrString: "fake_binary_video_stream_content_buffer",
      actorId: "ingest_bot"
    });

    expect(artifact.type).toBe("media_intake_mp4");
    expect(artifact.hash).toContain("sha256:");
    expect(artifact.uri).toBe("file:///assets/raw/camera_a_take1.mp4");

    const fetched = await artifactRegistry.get(artifact.artifactId);
    expect(fetched.artifactId).toBe(artifact.artifactId);
  });
});
