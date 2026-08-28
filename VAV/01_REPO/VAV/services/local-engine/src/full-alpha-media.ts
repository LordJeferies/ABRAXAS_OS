import {existsSync} from "node:fs";
import {basename} from "node:path";
import {spawnSync} from "node:child_process";
import type {MediaProbe} from "./full-alpha-types.ts";

export const parseRate = (value: unknown): number | null => {
  if (typeof value !== "string" || !value || value === "0/0") return null;
  if (!value.includes("/")) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  const parts = value.split("/");
  if (
    parts.length !== 2 ||
    !parts[0]?.trim() ||
    !parts[1]?.trim()
  ) {
    return null;
  }

  const a = Number(parts[0]);
  const b = Number(parts[1]);

  return (
    Number.isFinite(a) &&
    Number.isFinite(b) &&
    a > 0 &&
    b > 0
  ) ? a / b : null;
};

export const probeMedia = (path: string): MediaProbe => {
  if (!existsSync(path)) throw new Error(`Video no encontrado: ${path}`);
  const result = spawnSync("ffprobe", [
    "-v", "error", "-print_format", "json", "-show_format", "-show_streams", path
  ], {encoding: "utf8", maxBuffer: 32 * 1024 * 1024});
  if (result.error) throw new Error(`ffprobe: ${result.error.message}`);
  if (result.status !== 0) throw new Error((result.stderr || "ffprobe falló").trim());

  const raw = JSON.parse(result.stdout);
  const streams = Array.isArray(raw.streams) ? raw.streams : [];
  const video = streams.find((s: any) => s.codec_type === "video") ?? {};
  const audio = streams.filter((s: any) => s.codec_type === "audio");
  const duration = Number(raw?.format?.duration ?? video?.duration ?? 0);

  return {
    path,
    name: basename(path),
    sizeBytes: Number(raw?.format?.size) || 0,
    durationUs: Math.max(0, Math.round(duration * 1_000_000)),
    width: Number(video?.width) || 0,
    height: Number(video?.height) || 0,
    fps: parseRate(video?.avg_frame_rate) ?? parseRate(video?.r_frame_rate),
    fpsRational: typeof video?.avg_frame_rate === "string" ? video.avg_frame_rate : null,
    rotation: Number(video?.tags?.rotate ?? 0) || 0,
    videoCodec: typeof video?.codec_name === "string" ? video.codec_name : null,
    audioCodec: typeof audio[0]?.codec_name === "string" ? audio[0].codec_name : null,
    audioTracks: audio.length
  };
};
