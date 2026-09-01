/**
 * ABRAXAS AI Runtime Types — Providers, Jobs & External Roundtrip
 */

export type AICapability =
  | "TEXT"
  | "STRUCTURED_OUTPUT"
  | "VISION"
  | "IMAGE_GENERATION"
  | "IMAGE_EDIT"
  | "VIDEO_ANALYSIS"
  | "TRANSCRIPTION"
  | "TOOLS"
  | "LONG_CONTEXT"
  | "LOCAL_ONLY";

export interface AIProvider {
  providerId: string;
  name: string;
  capabilities: AICapability[];
  isAvailable: boolean;
  execute(job: AIJob): Promise<AIResult>;
}

export interface AIJob {
  jobId: string;
  contentId: string;
  prompt: string;
  requiredCapabilities: AICapability[];
  parameters?: Record<string, unknown> | undefined;
  createdAt: string;
}

export interface AIResult {
  jobId: string;
  contentId: string;
  providerId: string;
  output: string;
  structuredData?: Record<string, unknown> | undefined;
  completedAt: string;
}
