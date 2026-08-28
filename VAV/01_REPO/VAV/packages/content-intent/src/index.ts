import type {ProvenanceType} from "@vav/ficha-domain";

export type EditorialRole =
  | "hook"
  | "development"
  | "proof"
  | "close"
  | "cta"
  | "other";

export type TimeSpan = Readonly<{startUs: number; endUs: number}>;

export type CaptionHint = Readonly<{
  emphasisIntensity: "low" | "balanced" | "high" | null;
  structurePreference: string | null;
}>;

export type ContentCandidate = Readonly<{
  candidateId: string;
  contentId: string | null;
  sourceSpan: TimeSpan;
  role: EditorialRole;
  label: string;
  motionHint: string | null;
  captionHint: CaptionHint | null;
  provenance: readonly ProvenanceType[];
}>;
