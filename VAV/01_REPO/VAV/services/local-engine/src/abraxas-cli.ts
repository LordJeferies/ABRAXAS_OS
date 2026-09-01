#!/usr/bin/env node
/**
 * ABRAXAS CLI V16.0 — High-Velocity Terminal Engine
 * Usage:
 *   abraxas --input ./raw_videos --output ./exports --concurrency 4
 *   abraxas --input video.mp4 --style VIRAL_GOLD
 */

import { resolve, join } from "node:path";
import { existsSync, statSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { AbraxasBatchFactory } from "./abraxas-batch-factory.ts";

const args = process.argv.slice(2);

const getArg = (flag: string, fallback?: string): string | undefined => {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1]!.startsWith("-")) {
    return args[idx + 1];
  }
  return fallback;
};

const hasFlag = (flag: string): boolean => args.includes(flag);

async function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    console.log(`
\x1b[33m============================================================
   ABRAXAS OS — TERMINAL BATCH FACTORY V16.0
============================================================\x1b[0m

\x1b[1mUSO:\x1b[0m
  abraxas --input <carpeta_o_video> [opciones]

\x1b[1mOPCIONES:\x1b[0m
  --input, -i <path>       Carpeta con videos raw o archivo de video individual.
  --output, -o <path>      Carpeta de salida (Default: ./Projects/batch_exports)
  --concurrency, -c <N>    Cantidad de renders simultáneos (Default: 4)
  --style, -s <style>      Estilo de subtítulo: VIRAL_GOLD, NEON_CYBER, CLEAN_MINIMAL
  --no-sfx                 Desactiva el diseño sonoro automático (SFX)
  --no-vfx                 Desactiva los overlays de motion plates (VFX)
  --bitrate <rate>         Bitrate de video H.264 (Default: 10M)
  --help, -h               Muestra esta ayuda

\x1b[1mEJEMPLOS:\x1b[0m
  # Procesar lote de 50 videos a máxima velocidad:
  abraxas --input ~/Desktop/raw_batch --concurrency 6

  # Procesar un video con estilo Cyberpunk:
  abraxas --input ./take1.mp4 --style NEON_CYBER
`);
    process.exit(0);
  }

  const rawInput = getArg("--input") || getArg("-i") || "/Users/lordjef/Desktop/vav-captioned-quality.mp4";
  const rawOutput = getArg("--output") || getArg("-o") || join(homedir(), "Desktop", "abraxasos", "Projects", "batch_exports");
  const concurrency = parseInt(getArg("--concurrency", "4") || getArg("-c", "4") || "4", 10);
  const style = (getArg("--style") || getArg("-s") || "VIRAL_GOLD") as any;
  const enableSfx = !hasFlag("--no-sfx");
  const enableMotionPlates = !hasFlag("--no-vfx");
  const bitrate = getArg("--bitrate") || "10M";

  const inputPath = resolve(process.cwd(), rawInput);
  const outputPath = resolve(process.cwd(), rawOutput);

  if (!existsSync(inputPath)) {
    console.error(`\x1b[31mError: La ruta de entrada no existe: ${inputPath}\x1b[0m`);
    process.exit(1);
  }

  const factory = new AbraxasBatchFactory();
  const startTime = Date.now();

  const isFile = !statSync(inputPath).isDirectory();

  if (isFile) {
    console.log(`\n\x1b[33m⚡ ABRAXAS SINGLE VIDEO HIGH-VELOCITY RENDER\x1b[0m`);
    console.log(`\x1b[36m-> Archivo:\x1b[0m ${inputPath}`);
    console.log(`\x1b[36m-> Estilo Subtítulos:\x1b[0m ${style}`);
    console.log(`\x1b[36m-> SFX Sound Design:\x1b[0m ${enableSfx ? "ACTIVO" : "DESACTIVADO"}`);
    console.log(`\x1b[36m-> VFX Motion Plates:\x1b[0m ${enableMotionPlates ? "ACTIVO" : "DESACTIVADO"}\n`);

    const result = await factory.processSingleVideo(inputPath, outputPath, {
      enableSfx,
      enableMotionPlates,
      subtitleStyle: style,
      bitrate
    });

    if (result.status === "SUCCESS") {
      console.log(`\n\x1b[32m✓ Video Renderizado con Éxito en ${Math.round(result.renderTimeMs! / 1000)}s!\x1b[0m`);
      console.log(`\x1b[1mUbicación:\x1b[0m ${result.outputPath}`);
      console.log(`\x1b[1mCAS Hash:\x1b[0m  ${result.casHash}`);
      console.log(`\x1b[1mPalabras:\x1b[0m  ${result.wordsTranscribed}`);
    } else {
      console.error(`\n\x1b[31m✗ Falló el render: ${result.error}\x1b[0m`);
      process.exit(1);
    }
  } else {
    const results = await factory.executeBatch({
      inputDir: inputPath,
      outputDir: outputPath,
      concurrency,
      enableSfx,
      enableMotionPlates,
      subtitleStyle: style,
      bitrate
    });

    const successful = results.filter(r => r.status === "SUCCESS").length;
    const totalTimeSec = Math.round((Date.now() - startTime) / 1000);
    const avgSecPerVideo = results.length > 0 ? (totalTimeSec / results.length).toFixed(1) : 0;

    console.log(`\n\x1b[33m============================================================\x1b[0m`);
    console.log(`\x1b[32m🎉 LOTE COMPLETADO: ${successful}/${results.length} VIDEOS EXPORTADOS\x1b[0m`);
    console.log(`\x1b[36m-> Tiempo Total:\x1b[0m ${totalTimeSec} segundos (${(totalTimeSec / 60).toFixed(1)} minutos)`);
    console.log(`\x1b[36m-> Promedio por video:\x1b[0m ${avgSecPerVideo}s / video`);
    console.log(`\x1b[36m-> Carpeta Destino:\x1b[0m ${outputPath}`);
    console.log(`\x1b[33m============================================================\x1b[0m\n`);
  }
}

main().catch((err) => {
  console.error("\x1b[31mFatal CLI error:\x1b[0m", err);
  process.exit(1);
});
