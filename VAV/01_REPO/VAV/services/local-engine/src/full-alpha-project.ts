import {readFileSync, writeFileSync} from "node:fs";
import type {SavedProject} from "./full-alpha-types.ts";

export const saveProject = (path: string, project: SavedProject) => {
  writeFileSync(path, JSON.stringify(project, null, 2), "utf8");
  return {path};
};

export const loadProject = (path: string): SavedProject => {
  const raw = JSON.parse(readFileSync(path, "utf8"));
  if (raw?.version !== 1) throw new Error("Proyecto VAV incompatible.");
  return raw as SavedProject;
};
