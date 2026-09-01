/**
 * ABRAXAS Unified Production Pipeline Engine V15.0
 * Pure reality pipeline processing real user media from end to end:
 * 
 * ATZILUT: Intention & Strategy Parsing
 * BERIAH: Probe -> Transcribe (Whisper) -> Scenes (FFmpeg) -> Vision Analysis -> Creative Plan Synthesis
 * YETZIRAH: Caption Plan Construction -> Remotion Composition -> Motion Context Assembly
 * ASSIAH: VideoToolbox Hardware Render / FFmpeg ASS Subtitle Burn -> .abraxas Cryptographic CAS Seal
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync, copyFileSync } from "node:fs";
import { join, resolve, basename, extname } from "node:path";
import { homedir, tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { probeMedia } from "./full-alpha-media.ts";
import { transcribe } from "./full-alpha-transcription.ts";
import { analyzeScenes } from "./full-alpha-scenes.ts";
import { exportMp4, exportSrt } from "./full-alpha-export.ts";
import { renderQualityMp4 } from "./full-alpha-render.ts";
import { createCaptionPlan } from "@vav/remotion-composition/plan";
import { AbraxasCreativeEngine, type CreativeProjectIntent } from "./abraxas-creative-engine.ts";
import type { CaptionBlock, DesignState } from "./full-alpha-types.ts";

export interface UnifiedPipelineRequest {
  videoPath: string;
  projectName: string;
  productName?: string;
  targetAudience?: string;
  creativeObjective?: string;
  scriptText?: string;
  mode?: "FROM_ZERO" | "EXISTING_MATERIAL" | "ONLY_CAPTIONS" | "ONLY_MOTION";
  renderQuality?: "FAST_HARDWARE" | "REMOTION_QUALITY";
  styleId?: string;
}

export interface UnifiedPipelineResult {
  projectId: string;
  projectDir: string;
  status: "SUCCESS" | "FAILED";
  world: "ASSIAH";
  operator: "HE_OPERATIONS (ה)";
  sourceVideo: string;
  outputVideo: string;
  captionsSrt: string;
  captionsAss?: string;
  analysisReport: string;
  creativePlanPath: string;
  packagePath: string;
  manifestPath: string;
  casMasterAddress: string;
  metrics: {
    durationSeconds: number;
    resolution: string;
    fps: number;
    transcribedWordsCount: number;
    detectedScenesCount: number;
    renderTimeMs: number;
    videoSizeBytes: number;
  };
}

export class AbraxasUnifiedPipeline {
  private readonly creativeEngine = new AbraxasCreativeEngine();

  public async execute(req: UnifiedPipelineRequest): Promise<UnifiedPipelineResult> {
    const startTime = Date.now();
    if (!existsSync(req.videoPath)) {
      throw new Error(`Video fuente no encontrado: ${req.videoPath}`);
    }

    const projectId = `proj_${Date.now()}`;
    const baseProjectsDir = join(homedir(), "Desktop", "abraxasos", "Projects", projectId);
    
    // Create physical project stratigraphy
    const inputDir = join(baseProjectsDir, "input");
    const analysisDir = join(baseProjectsDir, "analysis");
    const captionsDir = join(baseProjectsDir, "captions");
    const motionDir = join(baseProjectsDir, "motion");
    const exportsDir = join(baseProjectsDir, "exports");

    mkdirSync(inputDir, { recursive: true });
    mkdirSync(analysisDir, { recursive: true });
    mkdirSync(captionsDir, { recursive: true });
    mkdirSync(motionDir, { recursive: true });
    mkdirSync(exportsDir, { recursive: true });

    // 1. Ingest physical file into workspace
    const targetInputPath = join(inputDir, basename(req.videoPath));
    copyFileSync(req.videoPath, targetInputPath);

    // 2. BERIAH: Real Media Probe
    const probe = probeMedia(targetInputPath);

    // 3. BERIAH: Real Speech Transcription (Whisper)
    const providerConfigPath = resolve(homedir(), "Desktop", "abraxasos", "VAV", "01_REPO", "VAV", "config", "providers.local.json");
    const providerConfig = existsSync(providerConfigPath) ? JSON.parse(readFileSync(providerConfigPath, "utf8")) : {};
    
    let captions: CaptionBlock[] = [];
    try {
      const txResult = transcribe(targetInputPath, "whisper-cpp", "large-v3-turbo", providerConfig?.mlx);
      captions = txResult.captions;
    } catch (txErr) {
      console.warn("Whisper transcription warning, falling back to script alignment:", txErr);
      if (req.scriptText) {
        captions = [
          { id: "cap-00001", startUs: 0, endUs: Math.min(3_000_000, probe.durationUs), text: req.scriptText.slice(0, 50), approved: true },
          { id: "cap-00002", startUs: 3_000_000, endUs: probe.durationUs, text: req.scriptText.slice(50), approved: true }
        ];
      }
    }

    // 4. BERIAH: Real Scene Detection (FFmpeg)
    const scenes = analyzeScenes(targetInputPath, probe.durationUs, 0.30);

    // 5. BERIAH: Creative Intelligence Synthesis
    const intent: CreativeProjectIntent = {
      mode: req.mode || "EXISTING_MATERIAL",
      brandName: req.projectName,
      productName: req.productName,
      targetAudience: req.targetAudience,
      creativeObjective: req.creativeObjective,
      rawScript: req.scriptText,
      stylePreset: req.styleId
    };
    const creativePlan = this.creativeEngine.synthesizeCreativePlan(probe, captions, scenes, intent);

    // Save intermediate intelligence artifacts
    const analysisPath = join(analysisDir, "media_analysis.json");
    const creativePlanPath = join(analysisDir, "creative_decision_plan.json");
    writeFileSync(analysisPath, JSON.stringify({ probe, scenesCount: scenes.length, captionsCount: captions.length }, null, 2));
    writeFileSync(creativePlanPath, JSON.stringify(creativePlan, null, 2));

    // 6. YETZIRAH: Caption & Motion Compilation
    const srtContent = captions.map((c, i) => `${i + 1}\n00:00:${Math.floor(c.startUs / 1000000).toString().padStart(2, '0')},000 --> 00:00:${Math.floor(c.endUs / 1000000).toString().padStart(2, '0')},000\n${c.text}\n`).join("\n");
    const srtFilePath = join(captionsDir, "captions.srt");
    writeFileSync(srtFilePath, srtContent, "utf8");

    const motionManifestPath = join(motionDir, "motion_manifest.json");
    writeFileSync(motionManifestPath, JSON.stringify(creativePlan.motionContexts, null, 2));

    // 7. ASSIAH: Real Render Pipeline Execution
    const outputVideoPath = join(exportsDir, "video_final.mp4");
    const design: DesignState = {
      styleId: req.styleId || "clean-bold",
      motionId: "hero-pop",
      placement: "auto",
      structureId: "hook-heavy",
      typography: {
        fontFamily: "Arial",
        fontSize: 68,
        lineHeight: 1.2,
        primaryColor: "#FFFFFF",
        outlineColor: "#000000",
        outlineWidth: 4,
        letterSpacing: 0,
        textTransform: "uppercase"
      }
    };

    if (req.renderQuality === "REMOTION_QUALITY") {
      const plan = createCaptionPlan({
        width: probe.width || 1080,
        height: probe.height || 1920,
        fps: probe.fps || 30,
        sourceFpsRational: probe.fpsRational,
        durationUs: probe.durationUs,
        captions,
        design,
        scenes,
        contentCandidates: creativePlan.contentCandidates,
        motionContexts: creativePlan.motionContexts
      });

      await renderQualityMp4({
        inputPath: targetInputPath,
        outputPath: outputVideoPath,
        plan,
        jobId: `job_${projectId}`
      });
    } else {
      // Default: Fast Hardware-Accelerated VideoToolbox Render with ASS burn
      exportMp4(
        targetInputPath,
        outputVideoPath,
        captions,
        design,
        creativePlan.motionContexts,
        creativePlan.contentCandidates,
        probe.width || 1080,
        probe.height || 1920
      );
    }

    // 8. Cryptographic CAS Packaging (YESOD & HE)
    const videoBytes = readFileSync(outputVideoPath);
    const videoSha256 = createHash("sha256").update(videoBytes).digest("hex");
    const casAddress = `cas://${videoSha256}`;

    const manifestData = {
      packageVersion: "15.0.0",
      projectId,
      projectName: req.projectName,
      casMasterAddress: casAddress,
      generatedAt: new Date().toISOString(),
      world: "ASSIAH",
      operator: "HE_OPERATIONS (ה)",
      artifacts: [
        { path: "exports/video_final.mp4", sha256: videoSha256, bytes: videoBytes.length },
        { path: "captions/captions.srt", sha256: createHash("sha256").update(srtContent).digest("hex"), bytes: Buffer.byteLength(srtContent) }
      ],
      creativeScores: creativePlan.creativeScores
    };

    const manifestPath = join(exportsDir, "manifest.json");
    const packagePath = join(exportsDir, "project_package.abraxas");
    writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2));
    writeFileSync(packagePath, JSON.stringify(manifestData, null, 2));

    const totalWords = captions.reduce((acc, c) => acc + c.text.split(/\s+/).filter(Boolean).length, 0);

    return {
      projectId,
      projectDir: baseProjectsDir,
      status: "SUCCESS",
      world: "ASSIAH",
      operator: "HE_OPERATIONS (ה)",
      sourceVideo: targetInputPath,
      outputVideo: outputVideoPath,
      captionsSrt: srtFilePath,
      analysisReport: analysisPath,
      creativePlanPath,
      packagePath,
      manifestPath,
      casMasterAddress: casAddress,
      metrics: {
        durationSeconds: Math.round(probe.durationUs / 1000000),
        resolution: `${probe.width}x${probe.height}`,
        fps: probe.fps || 30,
        transcribedWordsCount: totalWords,
        detectedScenesCount: scenes.length,
        renderTimeMs: Date.now() - startTime,
        videoSizeBytes: videoBytes.length
      }
    };
  }
}
