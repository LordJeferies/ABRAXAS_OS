/**
 * ABRAXAS Backbone Types — Canonical Events & Artifacts
 */

export const BACKBONE_SCHEMA_VERSION = 1 as const;

export type ArtifactStatus = "ACTIVE" | "SUPERSEDED" | "DEPRECATED" | "ERROR";

export interface Event {
  schemaVersion: typeof BACKBONE_SCHEMA_VERSION;
  eventId: string;
  eventType: string;
  contentId: string | null;
  taskId: string | null;
  componentId: string | null;
  actorId: string;
  timestamp: string;
  reason: string;
  previousVersion: number | null;
  newVersion: number | null;
  metadata: Record<string, unknown>;
}

export interface Artifact {
  schemaVersion: typeof BACKBONE_SCHEMA_VERSION;
  artifactId: string;
  contentId: string;
  componentId: string | null;
  type: string;
  version: number;
  createdBy: string;
  createdAt: string;
  basedOn: string[];
  uri: string;
  hash: string;
  status: ArtifactStatus;
  provider: string | null;
  promptJobId: string | null;
  metadata: Record<string, unknown>;
}
