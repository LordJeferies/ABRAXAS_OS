import {existsSync, mkdtempSync, readFileSync, rmSync} from "node:fs";
import {homedir, tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import type {CaptionBlock} from "./full-alpha-types.ts";

const msToUs = (value: unknown) => Math.max(0, Math.round(Number(value || 0) * 1_000));
const secToUs = (value: unknown) => Math.max(0, Math.round(Number(value || 0) * 1_000_000));

const timestampToUs = (value: unknown): number => {
  if (typeof value !== "string") return 0;
  const m = value.match(/(?:(\d+):)?(\d+):(\d+)[,.](\d+)/);
  if (!m) return 0;
  const h = Number(m[1] ?? 0);
  const min = Number(m[2] ?? 0);
  const sec = Number(m[3] ?? 0);
  const ms = Number((m[4] ?? "0").padEnd(3, "0").slice(0, 3));
  return ((((h * 60) + min) * 60 + sec) * 1000 + ms) * 1000;
};

const which = (name: string): string | null => {
  const r = spawnSync("which", [name], {encoding: "utf8"});
  return r.status === 0 ? r.stdout.trim() : null;
};

const run = (exe: string, args: readonly string[], label: string) => {
  const r = spawnSync(exe, [...args], {encoding: "utf8", maxBuffer: 128 * 1024 * 1024});
  if (r.error) throw new Error(`${label}: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${label}: ${(r.stderr || r.stdout || "").trim()}`);
};

export const segmentReadableCaptions = (
  raw: readonly CaptionBlock[],
  maxWords = 7
): CaptionBlock[] => {
  const out: CaptionBlock[] = [];
  for (const segment of raw) {
    const words = segment.text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) {
      out.push({...segment, id: `cap-${String(out.length + 1).padStart(5, "0")}`, approved: false});
      continue;
    }
    const groups: string[][] = [];
    for (let i = 0; i < words.length; i += maxWords) groups.push(words.slice(i, i + maxWords));
    const duration = Math.max(1, segment.endUs - segment.startUs);
    let consumed = 0;
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index]!;
      const startUs = index === 0
        ? segment.startUs
        : segment.startUs + Math.round(duration * (consumed / words.length));
      consumed += group.length;
      const endUs = index === groups.length - 1
        ? segment.endUs
        : segment.startUs + Math.round(duration * (consumed / words.length));
      out.push({
        id: `cap-${String(out.length + 1).padStart(5, "0")}`,
        startUs,
        endUs: Math.max(endUs, startUs + 1),
        text: group.join(" "),
        timingQuality: "estimated",
        approved: false
      });
    }
  }
  return out;
};

export const normalizeWhisperCpp = (raw: any): CaptionBlock[] => {
  const source = Array.isArray(raw?.transcription) ? raw.transcription : [];
  return source.map((segment: any, index: number) => {
    const startUs = segment?.offsets?.from != null
      ? msToUs(segment.offsets.from)
      : timestampToUs(segment?.timestamps?.from);
    const endUs = segment?.offsets?.to != null
      ? msToUs(segment.offsets.to)
      : timestampToUs(segment?.timestamps?.to);
    return {
      id: `raw-${index + 1}`,
      startUs,
      endUs: Math.max(endUs, startUs + 1),
      text: String(segment?.text ?? "").trim(),
      timingQuality: "segment" as const,
      approved: false
    };
  }).filter((caption: CaptionBlock) => caption.text.length > 0);
};

export const normalizeMlx = (raw: any): CaptionBlock[] => {
  const source = Array.isArray(raw?.segments) ? raw.segments : [];
  return source.map((segment: any, index: number) => ({
    id: `raw-${index + 1}`,
    startUs: secToUs(segment?.start),
    endUs: Math.max(secToUs(segment?.end), secToUs(segment?.start) + 1),
    text: String(segment?.text ?? "").trim(),
    timingQuality: "segment" as const,
    approved: false
  })).filter((caption: CaptionBlock) => caption.text.length > 0);
};

const modelPath = join(
  homedir(), "Library", "Application Support", "VAV",
  "models", "whisper", "ggml-large-v3-turbo.bin"
);

export const transcribe = (
  inputPath: string,
  provider: "whisper-cpp" | "mlx-whisper",
  modelId: string,
  mlxConfig: any
) => {
  if (!existsSync(inputPath)) throw new Error(`Video no encontrado: ${inputPath}`);
  const ffmpeg = which("ffmpeg");
  if (!ffmpeg) throw new Error("FFmpeg no está disponible.");

  const temp = mkdtempSync(join(tmpdir(), "vav-full-alpha-"));
  const wav = join(temp, "audio.wav");

  try {
    run(ffmpeg, [
      "-hide_banner", "-loglevel", "error", "-y", "-i", inputPath,
      "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", wav
    ], "FFmpeg audio");

    let language: string | null = null;
    let rawCaptions: CaptionBlock[] = [];

    if (provider === "whisper-cpp") {
      const cli = which("whisper-cli");
      if (!cli) throw new Error("whisper-cli no está disponible.");
      if (!existsSync(modelPath)) throw new Error("Large V3 Turbo FULL no está instalado.");
      const prefix = join(temp, "whisper");
      run(cli, ["-m", modelPath, "-f", wav, "-l", "auto", "-ojf", "-of", prefix, "-np"], "Whisper.cpp");
      const jsonPath = `${prefix}.json`;
      const raw = JSON.parse(readFileSync(jsonPath, "utf8"));
      language = typeof raw?.result?.language === "string" ? raw.result.language : null;
      rawCaptions = normalizeWhisperCpp(raw);
    } else {
      if (!mlxConfig?.available || !mlxConfig?.executable) throw new Error("MLX no está disponible.");
      const model = Array.isArray(mlxConfig.models)
        ? mlxConfig.models.find((candidate: any) => candidate.id === modelId)
        : null;
      if (!model?.path) throw new Error(`Modelo MLX no encontrado: ${modelId}`);
      run(mlxConfig.executable, [
        wav, "--model", model.path, "--output-dir", temp,
        "--output-format", "json", "--output-name", "mlx",
        "--word-timestamps", "True", "--verbose", "False"
      ], "MLX Whisper");
      const raw = JSON.parse(readFileSync(join(temp, "mlx.json"), "utf8"));
      language = typeof raw?.language === "string" ? raw.language : null;
      rawCaptions = normalizeMlx(raw);
    }

    const captions = segmentReadableCaptions(rawCaptions);
    return {provider, modelId, language, text: captions.map((c) => c.text).join(" "), captions};
  } finally {
    rmSync(temp, {recursive: true, force: true});
  }
};
