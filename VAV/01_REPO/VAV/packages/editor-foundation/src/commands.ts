export type CommandId =
  | "play.pause"
  | "history.undo"
  | "history.redo"
  | "project.save"
  | "project.search"
  | "marker.add"
  | "export.open";

export type CommandDefinition = Readonly<{
  id: CommandId;
  label: string;
  defaultShortcut: string;
}>;

export const defaultCommands: readonly CommandDefinition[] = [
  {id: "play.pause", label: "Play / Pause", defaultShortcut: "Space"},
  {id: "history.undo", label: "Undo", defaultShortcut: "Mod+Z"},
  {id: "history.redo", label: "Redo", defaultShortcut: "Mod+Shift+Z"},
  {id: "project.save", label: "Save", defaultShortcut: "Mod+S"},
  {id: "project.search", label: "Search", defaultShortcut: "Mod+F"},
  {id: "marker.add", label: "Add Marker", defaultShortcut: "M"},
  {id: "export.open", label: "Export", defaultShortcut: "Mod+E"}
];
