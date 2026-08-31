/**
 * VAV ↔ Lienzo / Backbone Bridge Types
 */

import { ArtifactRef } from "../../LIENZO/src/types.js";

export type VavJobType = "CAPTION_JOB" | "CUT_JOB" | "MOTION_JOB";

export interface VavJobInput {
  jobType: VavJobType;
  contentId: string;
  componentId: string;
  lienzoRevision: number;
  intentVersion: number;
  inputArtifacts: string[];
  parameters: Record<string, unknown>;
  actorId: string;
}

export interface VavJobResult {
  jobId: string;
  status: "COMPLETED" | "ERROR";
  artifactRef?: ArtifactRef | undefined;
  hash?: string | undefined;
  errors?: string[] | undefined;
  completedAt: string;
}
