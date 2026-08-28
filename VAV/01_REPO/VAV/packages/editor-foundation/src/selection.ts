export type SelectionScope = "word" | "caption" | "group" | "scene" | "multi" | "all";

export type EditorSelection = Readonly<{
  scope: SelectionScope;
  ids: readonly string[];
}>;

export const emptySelection: EditorSelection = {scope: "multi", ids: []};
