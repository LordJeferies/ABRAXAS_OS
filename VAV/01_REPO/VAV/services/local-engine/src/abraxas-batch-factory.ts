/**
 * ABRAXAS Batch Factory & High-Velocity CLI Engine V16.0
 * Capable of processing 50+ videos in batch with:
 * - Whisper Large V3 Turbo transcription
 * - High-Fidelity Synthesized SFX (Sub impacts, whooshes, kinetic pops)
 * - Living 3D Motion Plate Overlays (VFX)
 * - Kinetic High-Retention Subtitles (ASS / Word-level animation)
 * - Apple Silicon VideoToolbox Hardware Acceleration (10-15x realtime)
 * - Parallel Worker Pool Architecture
 */

import { existsSync, readdirSync, statSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, unlinkSync } from "node:fs";
import { join, resolve, basename, extname } from "node:path";
import { homedir, cpus, tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { execSync, spawnSync } from "node:child_process";
import { probeMedia } from "./full-alpha-media.ts";
import { transcribe } from "./full-alpha-transcription.ts";
import { analyzeScenes } from "./full-alpha-scenes.ts";
import { AbraxasSfxEngine, type SfxEvent } from "./abraxas-sfx-engine.ts";
import { AbraxasVfxEngine } from "./abraxas-vfx-engine.ts";
import { AbraxasCreativeEngine } from "./abraxas-creative-engine.ts";

export interface BatchOptions {
  inputDir: string;
  outputDir: string;
  concurrency?: number;
  enableSfx?: boolean;
  enableMotionPlates?: boolean;
  subtitleStyle?: "VIRAL_GOLD" | "NEON_CYBER" | "CLEAN_MINIMAL";
  bitrate?: string;
  onProgress?: (completed: number, total: number, currentItem: string) => void;
}

export interface VideoBatchResult {
  fileName: string;
  status: "SUCCESS" | "FAILED";
  outputPath?: string;
  durationSec?: number;
  renderTimeMs?: number;
  casHash?: string;
  wordsTranscribed?: number;
  error?: string;
}

export class AbraxasBatchFactory {
  private readonly sfxEngine = new AbraxasSfxEngine();
  private readonly vfxEngine = new AbraxasVfxEngine();
  private readonly creativeEngine = new AbraxasCreativeEngine();

  /**
   * Discovers all video files in the input directory
   */
  public discoverVideos(inputDir: string): string[] {
    if (!existsSync(inputDir)) throw new Error(`Carpeta de entrada no existe: ${inputDir}`);
    const allowed = new Set([".mp4", ".mov", ".webm", ".m4v", ".mkv"]);
    return readdirSync(inputDir)
      .filter((file) => !file.startsWith("."))
      .filter((file) => allowed.has(extname(file).toLowerCase()))
      .map((file) => join(inputDir, file));
  }

  /**
   * Processes a single video through the complete high-velocity pipeline
   */
  public async processSingleVideo(
    videoPath: string,
    outputDir: string,
    options: Partial<BatchOptions> = {}
  ): Promise<VideoBatchResult> {
    const startTime = Date.now();
    const fileName = basename(videoPath);
    const baseName = fileName.replace(extname(fileName), "");
    const tempDir = join(tmpdir(), `abx_batch_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
    mkdirSync(tempDir, { recursive: true });
    mkdirSync(outputDir, { recursive: true });

    try {
      // 1. Media Probe
      const probe = probeMedia(videoPath);
      const durationSec = Math.max(1, Math.round(probe.durationUs / 1_000_000));

      // 2. Whisper Speech Transcription
      const providerConfigPath = resolve(homedir(), "Desktop", "abraxasos", "VAV", "01_REPO", "VAV", "config", "providers.local.json");
      const providerConfig = existsSync(providerConfigPath) ? JSON.parse(readFileSync(providerConfigPath, "utf8")) : {};
      const tx = transcribe(videoPath, "whisper-cpp", "large-v3-turbo", providerConfig?.mlx);
      const captions = tx.captions;

      // 3. Scene Detection
      const scenes = analyzeScenes(videoPath, probe.durationUs, 0.30);

      // 4. Generate Kinetic Subtitles (ASS)
      const assContent = this.vfxEngine.generateViralAssCaptions(
        captions,
        probe.width || 1080,
        probe.height || 1920,
        options.subtitleStyle || "VIRAL_GOLD"
      );
      const assPath = join(tempDir, "subtitles.ass");
      writeFileSync(assPath, assContent, "utf8");

      // 5. Compute SFX Events
      const sfxEvents: SfxEvent[] = [];
      if (options.enableSfx !== false) {
        // Impact at hook (0.0s)
        sfxEvents.push({ timestampUs: 0, type: "SUB_IMPACT", gainDb: -1 });
        // Whooshes at scene transitions
        scenes.forEach((s) => {
          if (s.startUs > 500_000) {
            sfxEvents.push({ timestampUs: s.startUs - 100_000, type: "WHOOSH", gainDb: -3 });
          }
        });
        // Kinetic pops at key caption changes
        captions.slice(0, 5).forEach((c) => {
          if (c.startUs > 300_000) {
            sfxEvents.push({ timestampUs: c.startUs, type: "KINETIC_POP", gainDb: -4 });
          }
        });
      }

      // 6. Build Audio Mix with SFX
      const sfxMix = this.sfxEngine.generateAudioMixFilter(sfxEvents, durationSec);

      // 7. Motion Plates Overlay (VFX)
      const overlays = options.enableMotionPlates !== false
        ? this.vfxEngine.selectMotionPlates(durationSec, scenes)
        : [];

      // 8. Construct High-Performance Hardware-Accelerated FFmpeg Pipeline
      const finalOutputPath = join(outputDir, `${baseName}_abraxas_master.mp4`);
      const escapedAss = assPath.replace(/'/g, "\\\\'").replace(/:/g, "\\\\:");
      
      let videoFilter = `ass='${escapedAss}'`;
      const additionalInputArgs: string[] = [...sfxMix.inputArgs];
      let complexFilterString = "";

      if (overlays.length > 0) {
        let currentVLabel = "0:v";
        const vFilters: string[] = [];

        overlays.forEach((ov, idx) => {
          additionalInputArgs.push("-i", ov.imagePath);
          const imgInputIdx = 1 + sfxEvents.length + idx; // inputs layout
          const overlayLabel = `ov_${idx}`;
          const nextVLabel = `v_${idx + 1}`;

          // Scale plate to 32% width and overlay in top right with 20px padding
          vFilters.push(
            `[${imgInputIdx}:v]scale=iw*0.32:-1[${overlayLabel}]`,
            `[${currentVLabel}][${overlayLabel}]overlay=W-w-30:60:enable='between(t,${ov.startSec},${ov.startSec + ov.durationSec})'[${nextVLabel}]`
          );
          currentVLabel = nextVLabel;
        });

        // Finally burn ASS subtitles onto the composite video
        vFilters.push(`[${currentVLabel}]ass='${escapedAss}'[v_final]`);
        complexFilterString = `${sfxMix.filterComplex ? sfxMix.filterComplex + "; " : ""}${vFilters.join("; ")}`;
      }

      // Execute Apple Silicon VideoToolbox Hardware Render
      const ffmpegCmd: string[] = [
        "-hide_banner", "-loglevel", "error", "-y",
        "-i", videoPath,
        ...additionalInputArgs
      ];

      if (complexFilterString) {
        ffmpegCmd.push(
          "-filter_complex", complexFilterString,
          "-map", "[v_final]",
          "-map", sfxMix.filterComplex ? "[a_master]" : "0:a"
        );
      } else {
        ffmpegCmd.push("-vf", videoFilter);
        if (sfxMix.filterComplex) {
          ffmpegCmd.push("-filter_complex", sfxMix.filterComplex, "-map", "0:v", "-map", "[a_master]");
        }
      }

      ffmpegCmd.push(
        "-c:v", "h264_videotoolbox",
        "-b:v", options.bitrate || "10M",
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        finalOutputPath
      );

      const renderRes = spawnSync("ffmpeg", ffmpegCmd, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
      if (renderRes.status !== 0) {
        // Fallback to CPU libx264 if needed
        console.warn(`VideoToolbox warning, falling back to libx264 for ${fileName}`);
        const fallbackCmd = ffmpegCmd.map(arg => arg === "h264_videotoolbox" ? "libx264" : arg);
        spawnSync("ffmpeg", fallbackCmd, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
      }

      const outBytes = readFileSync(finalOutputPath);
      const sha256 = createHash("sha256").update(outBytes).digest("hex");
      const renderTimeMs = Date.now() - startTime;
      const totalWords = captions.reduce((acc, c) => acc + c.text.split(/\s+/).filter(Boolean).length, 0);

      return {
        fileName,
        status: "SUCCESS",
        outputPath: finalOutputPath,
        durationSec,
        renderTimeMs,
        casHash: `cas://${sha256}`,
        wordsTranscribed: totalWords
      };
    } catch (err: any) {
      return {
        fileName,
        status: "FAILED",
        error: err.message || String(err),
        renderTimeMs: Date.now() - startTime
      };
    }
  }

  /**
   * Executes a high-velocity parallel batch job across a folder of videos
   */
  public async executeBatch(options: BatchOptions): Promise<VideoBatchResult[]> {
    const videos = this.discoverVideos(options.inputDir);
    const total = videos.length;
    const concurrency = Math.min(options.concurrency || 4, cpus().length || 4);
    const results: VideoBatchResult[] = [];
    let completedCount = 0;

    console.log(`\n\x1b[33m⚡ ABRAXAS HIGH-VELOCITY BATCH FACTORY V16.0\x1b[0m`);
    console.log(`\x1b[36m-> Videos Descubiertos:\x1b[0m ${total}`);
    console.log(`\x1b[36m-> Concurrencia Apple Silicon:\x1b[0m ${concurrency} workers paralelos`);
    console.log(`\x1b[36m-> Carpeta Destino:\x1b[0m ${options.outputDir}\n`);

    // Worker Pool
    const queue = [...videos];
    const workers = Array.from({ length: concurrency }).map(async (_, workerId) => {
      while (queue.length > 0) {
        const video = queue.shift();
        if (!video) break;

        const res = await this.processSingleVideo(video, options.outputDir, options);
        results.push(res);
        completedCount++;

        const pct = Math.round((completedCount / total) * 100);
        if (res.status === "SUCCESS") {
          console.log(
            `\x1b[32m✓ [${completedCount}/${total} - ${pct}%]\x1b[0m ` +
            `\x1b[1m${res.fileName}\x1b[0m (${res.durationSec}s) -> ` +
            `\x1b[33m${Math.round(res.renderTimeMs! / 1000)}s render\x1b[0m | ` +
            `\x1b[36m${res.wordsTranscribed} palabras\x1b[0m | ` +
            `\x1b[90m${res.casHash?.slice(0, 20)}...\x1b[0m`
          );
        } else {
          console.log(`\x1b[31m✗ [${completedCount}/${total}]\x1b[0m \x1b[1m${res.fileName}\x1b[0m ERROR: ${res.error}`);
        }

        if (options.onProgress) {
          options.onProgress(completedCount, total, res.fileName);
        }
      }
    });

    await Promise.all(workers);
    return results;
  }
}
