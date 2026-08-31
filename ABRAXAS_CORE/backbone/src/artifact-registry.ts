/**
 * Backbone Universal CAS Artifact Registry (Content-Addressed Storage)
 */

import { randomUUID } from "node:crypto";
import { ArtifactRecord, RegisterArtifactInput } from "./types.js";
import { BackboneValidationError, ArtifactNotFoundError } from "./errors.js";

export interface ArtifactReference {
  uri: string;
  hash: string;
  type: string;
  parentArtifact?: string | undefined;
}

export class ArtifactRegistry {
  private readonly artifacts = new Map<string, ArtifactRecord>();

  public async register(input: RegisterArtifactInput): Promise<ArtifactRecord> {
    if (!input.contentId || input.contentId.trim().length === 0) {
      throw new BackboneValidationError("contentId must be provided");
    }

    const artifactId = input.artifactId || `art_${randomUUID().slice(0, 10)}`;
    if (this.artifacts.has(artifactId)) {
      throw new BackboneValidationError(`Artifact with ID "${artifactId}" already exists`);
    }

    const now = new Date().toISOString();

    let cleanHash = input.hash;
    if (cleanHash.startsWith("sha256:")) {
      cleanHash = cleanHash.replace("sha256:", "");
    }

    const uri = input.uri || `cas://${cleanHash}`;

    const record: ArtifactRecord = {
      artifactId,
      contentId: input.contentId,
      componentId: input.componentId,
      type: input.type,
      version: input.version,
      createdBy: input.createdBy,
      basedOn: input.basedOn || [],
      uri,
      hash: `sha256:${cleanHash}`,
      metadata: input.metadata || {},
      createdAt: now
    };

    this.artifacts.set(artifactId, record);
    return record;
  }

  public async get(artifactId: string): Promise<ArtifactRecord> {
    const item = this.artifacts.get(artifactId);
    if (!item) {
      throw new ArtifactNotFoundError(artifactId);
    }
    return item;
  }

  public async getArtifact(artifactId: string): Promise<ArtifactRecord> {
    return this.get(artifactId);
  }

  public async getArtifactByHash(hash: string): Promise<ArtifactRecord | undefined> {
    const targetHash = hash.startsWith("sha256:") ? hash : `sha256:${hash}`;
    return Array.from(this.artifacts.values()).find((a) => a.hash === targetHash);
  }

  public async listByContent(contentId: string): Promise<ArtifactRecord[]> {
    return this.listArtifactsForContent(contentId);
  }

  public async listArtifactsForContent(contentId: string): Promise<ArtifactRecord[]> {
    return Array.from(this.artifacts.values()).filter((a) => a.contentId === contentId);
  }

  public async getLineage(artifactId: string): Promise<ArtifactRecord[]> {
    const result: ArtifactRecord[] = [];
    const visited = new Set<string>();

    const traverse = async (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      try {
        const current = await this.get(id);
        result.push(current);
        for (const parentId of current.basedOn) {
          await traverse(parentId);
        }
      } catch (e) {}
    };

    await traverse(artifactId);
    return result;
  }
}
