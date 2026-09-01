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

const run = async <T>(command: string, payload: Record<string, unknown>): Promise<T> => {
  try {
    return await invoke<T>("run_full_alpha_engine", { command, payload });
  } catch (err) {
    console.warn(`[Tauri Bridge] run_full_alpha_engine (${command}) warning:`, err);
    throw err;
  }
};

export const assetUrl = (path: string) => {
  try {
    return convertFileSrc(path);
  } catch {
    return path;
  }
};

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

export const designState = (path: string) =>
  run<DesignState>("design-state", {path});

export const exportAss = (path: string, outputPath: string) =>
  run<{outputPath: string}>("export-ass", {path, outputPath});

export const exportMp4 = (
  payload: {
    videoPath: string;
    plan: CaptionPlanV1;
    outputPath: string;
    targetWidth: number;
    targetHeight: number;
    fps: number;
    concurrency: number;
  }
) => run<{outputPath: string}>("export-mp4", payload as unknown as Record<string, unknown>);

export const getAbraxasSystemStatus = () =>
  run<any>("get_system_status", {});

export const executeAbraxasPipeline = (payload: {
  videoPath: string;
  projectName: string;
  productName?: string;
  targetAudience?: string;
  creativeObjective?: string;
  scriptText?: string;
  mode?: "FROM_ZERO" | "EXISTING_MATERIAL" | "ONLY_CAPTIONS" | "ONLY_MOTION";
  renderQuality?: "FAST_HARDWARE" | "REMOTION_QUALITY";
  styleId?: string;
}) => run<any>("render_pipeline", payload);

export const createAbraxasProject = (payload: { mode?: string; idea?: string; product?: string; targetAudience?: string; objective?: string; option?: string; scriptText?: string; title?: string }) =>
  run<any>("create_project", payload);

export const loadAbraxasProject = (projectId: string) =>
  run<any>("load_project", { projectId });

export const analyzeAbraxasMedia = (fileName: string, scriptText?: string) =>
  run<any>("analyze_media", { fileName, scriptText });

export const generateAbraxasCaptions = (analysis: any) =>
  run<any>("generate_captions", { analysis });

export const generateAbraxasMotion = (fps = 60, durationSec = 15.0) =>
  run<any>("generate_motion", { fps, durationSec });

export const exportAbraxasProjectPackage = (projectDir: string, projectId: string, title?: string) =>
  run<any>("export_project", { projectDir, projectId, title });
