export type ReplaceScope = "current-caption" | "from-here" | "whole-project";

export type FindReplaceRequest = Readonly<{
  find: string;
  replacement: string;
  scope: ReplaceScope;
  addToProjectDictionary: boolean;
}>;
