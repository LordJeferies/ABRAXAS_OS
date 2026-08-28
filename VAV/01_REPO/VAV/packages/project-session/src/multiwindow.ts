export type ProjectWindowRole =
  | "main"
  | "preview"
  | "timeline"
  | "captions-document"
  | "inspector";

export type WindowSessionBinding = Readonly<{
  windowId: string;
  role: ProjectWindowRole;
  projectSessionId: string;
}>;
