export type PanelId =
  | "nav.rail"
  | "preview.player"
  | "timeline.main"
  | "captions.document"
  | "inspector.project";

export const defaultWorkspaceLayout = {
  mode: "desktop-dockable",
  detachable: [
    "preview.player",
    "timeline.main",
    "captions.document",
    "inspector.project"
  ] as PanelId[]
};
