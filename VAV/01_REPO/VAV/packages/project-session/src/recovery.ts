export type RecoveryCandidate = Readonly<{
  id: string;
  createdAt: string;
  source: "autosave" | "last-known-good";
  projectId: string;
}>;
