export type WorkspacePreset =
  | "default"
  | "transcript"
  | "motion"
  | "scene-smart"
  | "review"
  | "dual-monitor"
  | "custom";

export type WorkspaceLayoutState = Readonly<{
  version: number;
  preset: WorkspacePreset;
  serializedLayout: unknown;
}>;
