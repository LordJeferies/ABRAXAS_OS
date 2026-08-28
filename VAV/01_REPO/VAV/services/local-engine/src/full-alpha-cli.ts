import {existsSync, readFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {collectHealth} from "./health.ts";
import {probeMedia} from "./full-alpha-media.ts";
import {transcribe} from "./full-alpha-transcription.ts";
import {analyzeScenes} from "./full-alpha-scenes.ts";
import {importContentFile, importMotionFile} from "./full-alpha-context.ts";
import {exportMp4, exportSrt} from "./full-alpha-export.ts";
import {qualityRenderProgressPath, renderQualityMp4, requestQualityRenderCancel} from "./full-alpha-render.ts";
import {verifyQualityRenderParity} from "./full-alpha-parity.ts";
import {loadProject, saveProject} from "./full-alpha-project.ts";
import {approveImportedArtifact, importAbraxasFile, loadAbraxasRegistry, persistTrustedImport} from "./abraxas-registry.ts";
import {collectVisionProviderReport} from "./vision-capabilities.ts";

const command = process.argv[2] ?? "health";
const rawPayload = process.argv[3] ?? "{}";
const payload = () => JSON.parse(rawPayload);

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");

const providerConfig = () => {
  const path = resolve(repoRoot, "config/providers.local.json");
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
};

try {
  let result: unknown;

  if (command === "health") result = collectHealth();
  else if (command === "probe") {
    const p = payload(); result = probeMedia(String(p.path ?? ""));
  } else if (command === "transcribe") {
    const p = payload();
    result = transcribe(
      String(p.path ?? ""),
      p.provider === "mlx-whisper" ? "mlx-whisper" : "whisper-cpp",
      String(p.modelId ?? "large-v3-turbo"),
      providerConfig()?.mlx
    );
  } else if (command === "scenes") {
    const p = payload();
    result = analyzeScenes(String(p.path ?? ""), Number(p.durationUs ?? 0), Number(p.threshold ?? .30));
  } else if (command === "import-content") {
    const p = payload(); result = {items: importContentFile(String(p.path ?? ""))};
  } else if (command === "import-motion") {
    const p = payload(); result = {items: importMotionFile(String(p.path ?? ""))};
  } else if (command === "import-abraxas") {
    const p = payload();
    result = p.trust === "approved"
      ? persistTrustedImport(String(p.path ?? ""))
      : importAbraxasFile(String(p.path ?? ""), "candidate");
  } else if (command === "approve-abraxas") {
    const p = payload();
    result = approveImportedArtifact(p.artifact, p.sourcePath ? String(p.sourcePath) : null);
  } else if (command === "abraxas-registry") {
    result = loadAbraxasRegistry();
  } else if (command === "vision-capabilities") {
    result = collectVisionProviderReport();
  } else if (command === "save-project") {
    const p = payload(); result = saveProject(String(p.path ?? ""), p.project);
  } else if (command === "load-project") {
    const p = payload(); result = loadProject(String(p.path ?? ""));
  } else if (command === "export-srt") {
    const p = payload(); result = exportSrt(String(p.path ?? ""), p.captions ?? []);
  } else if (command === "export-quality-mp4") {
    const p = payload();
    result = await renderQualityMp4({
      inputPath: String(p.inputPath ?? ""),
      outputPath: String(p.outputPath ?? ""),
      plan: p.plan,
      ...(p.jobId ? {jobId: String(p.jobId)} : {})
    });
  } else if (command === "verify-render-parity") {
    const p = payload();
    result = await verifyQualityRenderParity({
      inputPath: String(p.inputPath ?? ""),
      outputDir: String(p.outputDir ?? ""),
      plan: p.plan,
      ...(p.threshold != null ? {threshold: Number(p.threshold)} : {})
    });
  } else if (command === "cancel-render") {
    const p = payload();
    result = requestQualityRenderCancel(String(p.jobId ?? ""));
  } else if (command === "render-progress") {
    const p = payload();
    const path = qualityRenderProgressPath(String(p.jobId ?? ""));
    result = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {jobId: String(p.jobId ?? ""), state: "unknown", progress: 0};
  } else if (command === "export-mp4") {
    const p = payload();
    result = exportMp4(
      String(p.inputPath ?? ""),
      String(p.outputPath ?? ""),
      p.captions ?? [],
      p.design,
      p.motionContexts ?? [],
      p.contentCandidates ?? [],
      Number(p.width ?? 1080),
      Number(p.height ?? 1920)
    );
  } else {
    throw new Error(`Comando desconocido: ${command}`);
  }

  console.log(JSON.stringify(result));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
}
