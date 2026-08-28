export type ProjectionFormat = "txt" | "md" | "html" | "json";

export type RawImportArtifact = Readonly<{
  importId: string;
  format: ProjectionFormat;
  originalPath: string;
  sha256: string;
  importedAt: string;
}>;

export type ImportCandidate<T> = Readonly<{
  candidateId: string;
  confidence: number | null;
  needsReview: boolean;
  value: T;
  rawSourceRef: string;
}>;

export const projectionIsCanonical = (_format: ProjectionFormat): false => false;
