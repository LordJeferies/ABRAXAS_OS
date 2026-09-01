/**
 * Universal Intake V1 — Ingests structured documents and opaque binary media
 */

import { createHash } from "node:crypto";
import { ArtifactRegistry } from "../../backbone/src/artifact-registry.js";
import { Artifact } from "../../backbone/src/types.js";

export interface ParsedDocument {
  format: "TXT" | "MD" | "JSON" | "CSV";
  content: unknown;
}

export class UniversalIntakeService {
  constructor(private readonly artifactRegistry?: ArtifactRegistry) {}

  public parseTextOrStructured(filename: string, rawText: string): ParsedDocument {
    const lower = filename.toLowerCase();
    if (lower.endsWith(".json")) {
      return { format: "JSON", content: JSON.parse(rawText) };
    }
    if (lower.endsWith(".csv")) {
      const lines = rawText.split("\n").filter((l) => l.trim().length > 0);
      const rows = lines.map((l) => l.split(",").map((cell) => cell.trim()));
      return { format: "CSV", content: rows };
    }
    if (lower.endsWith(".md")) {
      return { format: "MD", content: rawText };
    }
    return { format: "TXT", content: rawText };
  }

  public async registerMediaIntake(
    contentId: string,
    fileInfo: {
      filename: string;
      uri: string;
      mediaBufferOrString: string | Buffer;
      actorId: string;
    }
  ): Promise<Artifact> {
    if (!this.artifactRegistry) {
      throw new Error("ArtifactRegistry required for media intake");
    }

    const hash = createHash("sha256")
      .update(fileInfo.mediaBufferOrString)
      .digest("hex");

    const ext = fileInfo.filename.split(".").pop()?.toLowerCase() || "bin";

    return this.artifactRegistry.register({
      contentId,
      type: `media_intake_${ext}`,
      version: 1,
      createdBy: fileInfo.actorId,
      uri: fileInfo.uri,
      hash: `sha256:${hash}`,
      metadata: { filename: fileInfo.filename }
    });
  }
}
