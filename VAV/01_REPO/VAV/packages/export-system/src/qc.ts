export type QcSeverity = "info" | "warning" | "error";

export type QcIssueCode =
  | "media-offline"
  | "font-missing"
  | "caption-overflow"
  | "safe-zone"
  | "reading-speed"
  | "low-confidence"
  | "segment-overlap"
  | "placement-invalid"
  | "sync-warning";

export type QcIssue = Readonly<{
  id: string;
  code: QcIssueCode;
  severity: QcSeverity;
  targetId: string | null;
  message: string;
}>;

export const canExportWithIssues = (issues: readonly QcIssue[]): boolean =>
  !issues.some((issue) => issue.severity === "error");
