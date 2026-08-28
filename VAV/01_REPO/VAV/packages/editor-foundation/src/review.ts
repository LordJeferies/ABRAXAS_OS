export type ReviewKind =
  | "low-confidence-word"
  | "segmentation"
  | "speaker"
  | "placement"
  | "automation"
  | "qc-warning";

export type ReviewItem = Readonly<{
  id: string;
  kind: ReviewKind;
  confidence: number | null;
  resolved: boolean;
  targetId: string;
}>;
