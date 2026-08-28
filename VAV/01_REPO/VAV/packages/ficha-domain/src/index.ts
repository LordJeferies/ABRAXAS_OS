export type ProvenanceType = "SOURCE" | "USER" | "AI_DERIVED" | "EDITORIAL" | "SYSTEM";

export type ModuleStatus =
  | "NOT_STARTED"
  | "PLANNED"
  | "WAITING_FOR_SOURCE"
  | "DRAFT"
  | "REVIEW_REQUIRED"
  | "APPROVED"
  | "FINAL"
  | "BLOCKED"
  | "NOT_APPLICABLE";

export type FichaModuleMeta = Readonly<{
  name: string;
  version: number;
  status: ModuleStatus;
  createdByStage: string;
  consumes: readonly string[];
  produces: readonly string[];
  provenance: readonly ProvenanceType[];
}>;

export type FichaIdentity = Readonly<{
  contentId: string;
  contentRevision: number;
}>;
