import {execFileSync} from "node:child_process";
import {copyFileSync, existsSync, linkSync, mkdirSync, mkdtempSync, rmSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {dirname, extname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {bundle} from "@remotion/bundler";
import {renderMedia, renderStill, selectComposition} from "@remotion/renderer";
import sharp from "sharp";
import type {CaptionPlanV1, VavCaptionCompositionProps} from "@vav/remotion-composition";

export type ParityVerifyRequest = Readonly<{
  inputPath: string;
  outputDir: string;
  plan: CaptionPlanV1;
  threshold?: number;
}>;

const safeMediaName = (inputPath: string) => {
  const ext = extname(inputPath).toLowerCase();
  return `source${[".mp4", ".mov", ".m4v", ".webm", ".mkv"].includes(ext) ? ext : ".mp4"}`;
};

const stageSourceInBundle = (inputPath: string, bundleDir: string) => {
  const name = safeMediaName(inputPath);
  const publicDir = join(bundleDir, "public");
  mkdirSync(publicDir, {recursive: true});
  const target = join(publicDir, name);
  try {
    linkSync(inputPath, target);
  } catch {
    copyFileSync(inputPath, target);
  }
  if (!existsSync(target)) throw new Error(`No se pudo preparar media Remotion: ${target}`);
  return name;
};

const meanAbsoluteDifference = async (aPath: string, bPath: string) => {
  const a = await sharp(aPath).removeAlpha().raw().toBuffer({resolveWithObject: true});
  const b = await sharp(bPath).removeAlpha().raw().toBuffer({resolveWithObject: true});
  if (a.info.width !== b.info.width || a.info.height !== b.info.height || a.data.length !== b.data.length) {
    return {normalizedMad: 1, comparable: false};
  }
  let sum = 0;
  for (let i = 0; i < a.data.length; i++) sum += Math.abs(a.data[i]! - b.data[i]!);
  return {normalizedMad: sum / a.data.length / 255, comparable: true};
};

export const verifyQualityRenderParity = async (request: ParityVerifyRequest) => {
  if (!existsSync(request.inputPath)) throw new Error(`Video no encontrado: ${request.inputPath}`);
  mkdirSync(request.outputDir, {recursive: true});
  const threshold = Number.isFinite(request.threshold) ? Math.max(0.001, Math.min(0.5, Number(request.threshold))) : 0.08;
  const temp = mkdtempSync(join(tmpdir(), "vav-parity-"));
  const bundleOutDir = join(temp, "bundle");
  const entryPoint = fileURLToPath(new URL("../../../packages/remotion-composition/src/render-entry.tsx", import.meta.url));
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
  const outputMp4 = join(request.outputDir, "quality-parity-fixture.mp4");

  try {
    const serveUrl = await bundle({entryPoint, rootDir: repoRoot, outDir: bundleOutDir});
    const sourceMediaName = stageSourceInBundle(request.inputPath, serveUrl);
    const inputProps: VavCaptionCompositionProps = {plan: request.plan, videoUrl: null, sourceMediaName, showGuides: false};
    const composition = await selectComposition({serveUrl, id: "VAVCaptionComposition", inputProps});
    await renderMedia({composition, serveUrl, codec: "h264", audioCodec: "aac", outputLocation: outputMp4, inputProps});

    const ratios = [0.10, 0.25, 0.50, 0.75, 0.90];
    const samples = [] as Array<Record<string, unknown>>;
    for (const ratio of ratios) {
      const frame = Math.max(0, Math.min(composition.durationInFrames - 1, Math.round((composition.durationInFrames - 1) * ratio)));
      const direct = join(request.outputDir, `direct-${Math.round(ratio * 100)}-f${frame}.png`);
      const encoded = join(request.outputDir, `encoded-${Math.round(ratio * 100)}-f${frame}.png`);
      await renderStill({composition, serveUrl, output: direct, inputProps, frame, imageFormat: "png"});
      execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", outputMp4, "-vf", `select=eq(n\\,${frame})`, "-fps_mode", "vfr", "-frames:v", "1", encoded]);
      const diff = await meanAbsoluteDifference(direct, encoded);
      samples.push({ratio, frame, direct, encoded, ...diff, pass: diff.comparable && diff.normalizedMad <= threshold});
    }

    const pass = samples.every((sample) => sample.pass === true);
    const report = {
      schemaVersion: 1,
      renderer: "shared-remotion-composition",
      compositionId: composition.id,
      inputPath: request.inputPath,
      outputMp4,
      width: composition.width,
      height: composition.height,
      fps: composition.fps,
      durationInFrames: composition.durationInFrames,
      threshold,
      samples,
      pass,
      note: "Direct composition stills are compared against frames decoded from the rendered MP4. Safe-zone editor guides are intentionally excluded from both."
    };
    writeFileSync(join(request.outputDir, "parity-report.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
    return report;
  } finally {
    rmSync(temp, {recursive: true, force: true});
  }
};
