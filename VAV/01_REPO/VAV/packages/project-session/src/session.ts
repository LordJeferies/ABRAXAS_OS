export type SessionStatus = "clean" | "dirty" | "saving" | "recoverable";

export type ProjectSessionMeta = Readonly<{
  projectId: string;
  schemaVersion: number;
  status: SessionStatus;
  lastSavedAt: string | null;
  lastAutosavedAt: string | null;
}>;

export const AUTOSAVE_INTERVAL_MS = 15_000;
