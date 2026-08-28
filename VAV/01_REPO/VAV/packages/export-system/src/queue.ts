export type ExportJobState =
  | "waiting"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type ExportJob = Readonly<{
  id: string;
  profileId: string;
  state: ExportJobState;
  progress: number;
  outputPath: string | null;
}>;
