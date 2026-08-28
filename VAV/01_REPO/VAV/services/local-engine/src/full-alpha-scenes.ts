import {spawnSync} from "node:child_process";
import type {SceneMark} from "./full-alpha-types.ts";

export const analyzeScenes = (
  path: string,
  durationUs: number,
  threshold = 0.30
): SceneMark[] => {
  const result = spawnSync("ffmpeg", [
    "-hide_banner", "-i", path,
    "-filter:v", `select='gt(scene,${threshold})',showinfo`,
    "-an", "-f", "null", "-"
  ], {encoding: "utf8", maxBuffer: 64 * 1024 * 1024});

  const log = `${result.stderr ?? ""}\n${result.stdout ?? ""}`;
  const times = [...log.matchAll(/pts_time:([0-9]+(?:\.[0-9]+)?)/g)]
    .map((m) => Math.round(Number(m[1]) * 1_000_000))
    .filter((n) => Number.isFinite(n) && n > 0 && n < durationUs)
    .sort((a, b) => a - b);

  const boundaries = [0, ...new Set(times), Math.max(durationUs, 1)];
  const placements: SceneMark["suggestedPlacement"][] = [
    "center-low", "top-center", "center", "bottom"
  ];
  const scenes: SceneMark[] = [];

  for (let i = 0; i < boundaries.length - 1; i++) {
    const startUs = boundaries[i]!;
    const endUs = boundaries[i + 1]!;
    if (endUs - startUs < 150_000) continue;
    scenes.push({
      id: `scene-${String(scenes.length + 1).padStart(4, "0")}`,
      startUs,
      endUs,
      suggestedPlacement: placements[scenes.length % placements.length]!
    });
  }

  return scenes.length ? scenes : [{
    id: "scene-0001",
    startUs: 0,
    endUs: Math.max(durationUs, 1),
    suggestedPlacement: "center-low"
  }];
};
