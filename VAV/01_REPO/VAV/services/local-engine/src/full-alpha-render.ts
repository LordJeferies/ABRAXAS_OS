import {copyFileSync, existsSync, linkSync, mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {dirname, extname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {bundle} from "@remotion/bundler";
import {makeCancelSignal, renderMedia, selectComposition} from "@remotion/renderer";
import type {CaptionPlanV1, VavCaptionCompositionProps} from "@vav/remotion-composition";

export type QualityRenderRequest = Readonly<{
  inputPath: string;
  outputPath: string;
  plan: CaptionPlanV1;
  jobId?: string;
}>;

const renderJobsRoot = () => {
  const home = process.env.HOME ?? tmpdir();
  return join(home, "Library", "Application Support", "VAV", "render-jobs");
};

const writeJob = (jobId: string, value: Record<string, unknown>) => {
  const root = renderJobsRoot();
  mkdirSync(root, {recursive: true});
  writeFileSync(join(root, `${jobId}.json`), JSON.stringify({jobId, updatedAt: new Date().toISOString(), ...value}, null, 2) + "\n", "utf8");
};

export const qualityRenderProgressPath = (jobId: string) => join(renderJobsRoot(), `${jobId}.json`);
export const qualityRenderCancelPath = (jobId: string) => join(renderJobsRoot(), `${jobId}.cancel`);

export const requestQualityRenderCancel = (jobId: string) => {
  const root = renderJobsRoot();
  mkdirSync(root, {recursive: true});
  writeFileSync(qualityRenderCancelPath(jobId), new Date().toISOString() + "\n", "utf8");
  writeJob(jobId, {state: "cancelling", progress: 0, renderer: "remotion-quality"});
  return {jobId, requested: true};
};

const safeMediaName = (inputPath: string) => {
  const ext = extname(inputPath).toLowerCase();
  const allowed = new Set([".mp4", ".mov", ".m4v", ".webm", ".mkv"]);
  return `source${allowed.has(ext) ? ext : ".mp4"}`;
};

const stageSourceInBundle = (inputPath: string, bundleDir: string): string => {
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

export const renderQualityMp4 = async (request: QualityRenderRequest) => {
  if (!existsSync(request.inputPath)) throw new Error(`Video no encontrado: ${request.inputPath}`);
  mkdirSync(dirname(request.outputPath), {recursive: true});

  const jobId = request.jobId?.trim() || `render-${Date.now()}`;
  const temp = mkdtempSync(join(tmpdir(), "vav-remotion-quality-"));
  const entryPoint = fileURLToPath(new URL("../../../packages/remotion-composition/src/render-entry.tsx", import.meta.url));
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
  const bundleOutDir = join(temp, "bundle");
  const cancelPath = qualityRenderCancelPath(jobId);
  if (existsSync(cancelPath)) unlinkSync(cancelPath);
  const {cancelSignal, cancel} = makeCancelSignal();
  let cancelRequested = false;
  const cancelPoll = setInterval(() => {
    if (!cancelRequested && existsSync(cancelPath)) {
      cancelRequested = true;
      cancel();
    }
  }, 250);

  writeJob(jobId, {state: "preparing", progress: 0, renderer: "remotion-quality", outputPath: request.outputPath});

  try {
    const serveUrl = await bundle({
      entryPoint,
      rootDir: repoRoot,
      outDir: bundleOutDir,
      onProgress: (progress) => {
        writeJob(jobId, {state: "preparing", progress: Math.min(.08, Math.max(0, Number(progress) / 100 * .08)), renderer: "remotion-quality", outputPath: request.outputPath});
      }
    });

    const sourceMediaName = stageSourceInBundle(request.inputPath, serveUrl);
    const inputProps: VavCaptionCompositionProps = {
      plan: request.plan,
      videoUrl: null,
      sourceMediaName,
      showGuides: false
    };

    const composition = await selectComposition({
      serveUrl,
      id: "VAVCaptionComposition",
      inputProps
    });

    writeJob(jobId, {state: "rendering", progress: .08, renderer: "remotion-quality", outputPath: request.outputPath});

    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: request.outputPath,
      inputProps,
      audioCodec: "aac",
      cancelSignal,
      onProgress: ({progress}) => {
        const p = .08 + Math.max(0, Math.min(1, progress)) * .90;
        writeJob(jobId, {state: "rendering", progress: p, renderer: "remotion-quality", outputPath: request.outputPath});
      }
    });

    writeJob(jobId, {state: "done", progress: 1, renderer: "remotion-quality", outputPath: request.outputPath});
    return {
      path: request.outputPath,
      renderer: "remotion-quality",
      compositionId: composition.id,
      width: composition.width,
      height: composition.height,
      fps: composition.fps,
      durationInFrames: composition.durationInFrames,
      jobId
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeJob(jobId, {state: cancelRequested || /cancel/i.test(message) ? "cancelled" : "failed", progress: 0, renderer: "remotion-quality", outputPath: request.outputPath, error: message});
    throw error;
  } finally {
    clearInterval(cancelPoll);
    if (existsSync(cancelPath)) unlinkSync(cancelPath);
    rmSync(temp, {recursive: true, force: true});
  }
};
