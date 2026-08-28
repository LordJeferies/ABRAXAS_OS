import type {CaptionPlanV1} from "@vav/remotion-composition";
import {convertFileSrc, invoke} from "@tauri-apps/api/core";
import type {
  ContentCandidate,
  DesignState,
  MediaProbe,
  MotionContext,
  RuntimeCaption,
  SavedProject,
  SceneMark,
  AbraxasArtifact,
  CaptionStylePreset,
  MotionPreset,
  VisionProviderReport
} from "./fullAlphaTypes.ts";

const run = <T>(command: string, payload: Record<string, unknown>): Promise<T> =>
  invoke<T>("run_full_alpha_engine", {command, payload});

export const assetUrl = (path: string) => convertFileSrc(path);
export const probeMedia = (path: string) => run<MediaProbe>("probe", {path});

export const transcribeMedia = (
  path: string,
  provider: "whisper-cpp" | "mlx-whisper",
  modelId: string
) => run<{
  provider: string;
  modelId: string;
  language: string | null;
  text: string;
  captions: RuntimeCaption[];
}>("transcribe", {path, provider, modelId});

export const analyzeScenes = (path: string, durationUs: number) =>
  run<SceneMark[]>("scenes", {path, durationUs, threshold: .30});

export const importContent = (path: string) =>
  run<{items: ContentCandidate[]}>("import-content", {path});

export const importMotion = (path: string) =>
  run<{items: MotionContext[]}>("import-motion", {path});


export const importAbraxas = (path: string, trust: "candidate" | "approved" = "candidate") =>
  run<{artifact: AbraxasArtifact; provenance?: {sourceName: string; sourcePath: string; sha256: string; kind: string; importedAt: string}; registry?: {approvedStyles: CaptionStylePreset[]; approvedMotions: MotionPreset[]}}>("import-abraxas", {path, trust});

export const approveAbraxas = (artifact: AbraxasArtifact, sourcePath: string | null) =>
  run<{path: string; registry: {approvedStyles: CaptionStylePreset[]; approvedMotions: MotionPreset[]}}>("approve-abraxas", {artifact, sourcePath});

export const loadAbraxasRegistry = () =>
  run<{approvedStyles: CaptionStylePreset[]; approvedMotions: MotionPreset[]}>("abraxas-registry", {});

export const visionCapabilities = () => run<VisionProviderReport>("vision-capabilities", {});

export const saveProject = (path: string, project: SavedProject) =>
  run<{path: string}>("save-project", {path, project});

export const loadProject = (path: string) =>
  run<SavedProject>("load-project", {path});

export const exportSrt = (path: string, captions: readonly RuntimeCaption[]) =>
  run<{path: string}>("export-srt", {path, captions});

export const exportMp4 = (args: {
  inputPath: string;
  outputPath: string;
  captions: readonly RuntimeCaption[];
  design: DesignState;
  motionContexts: readonly MotionContext[];
  contentCandidates: readonly ContentCandidate[];
  width: number;
  height: number;
}) => run<{path: string; renderer: string}>("export-mp4", args);

export const exportQualityMp4 = (args: {
  inputPath: string;
  outputPath: string;
  plan: CaptionPlanV1;
  jobId: string;
}) => run<{path: string; renderer: string; compositionId: string; width: number; height: number; fps: number; durationInFrames: number; jobId: string}>("export-quality-mp4", args);

export const renderProgress = (jobId: string) =>
  run<{jobId: string; state: string; progress: number; renderer?: string; outputPath?: string; error?: string}>("render-progress", {jobId});

export const cancelQualityRender = (jobId: string) =>
  run<{jobId: string; requested: boolean}>("cancel-render", {jobId});
