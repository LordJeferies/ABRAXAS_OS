import type {CutPlan} from "@vav/cut-domain";

export type FfmpegCutOptions = {
  outputPath?: string | undefined;
  useVideoToolbox?: boolean | undefined;
};

export const buildFfmpegCutPlanCommand = (
  cutPlan: CutPlan,
  options: FfmpegCutOptions = {}
): {
  filterComplex: string;
  commandArgs: string[];
} => {
  const primarySource = cutPlan.sourceMedia[0];
  if (!primarySource) throw new Error("CutPlan has no sourceMedia");

  const inputPath = primarySource.pathOrUri;
  const outputPath = options.outputPath ?? `output_${cutPlan.deliverableId}.mp4`;
  const useVT = options.useVideoToolbox ?? false;

  const filterParts: string[] = [];
  const concatInputs: string[] = [];

  for (let i = 0; i < cutPlan.segments.length; i++) {
    const seg = cutPlan.segments[i]!;
    const startSec = (seg.sourceRange.startUs / 1_000_000).toFixed(6);
    const endSec = (seg.sourceRange.endUs / 1_000_000).toFixed(6);

    filterParts.push(`[0:v]trim=start=${startSec}:end=${endSec},setpts=PTS-STARTPTS[v${i}]`);
    filterParts.push(`[0:a]atrim=start=${startSec}:end=${endSec},asetpts=PTS-STARTPTS[a${i}]`);
    concatInputs.push(`[v${i}][a${i}]`);
  }

  const concatFilter = `${concatInputs.join("")}concat=n=${cutPlan.segments.length}:v=1:a=1[vout][aout]`;
  filterParts.push(concatFilter);

  const filterComplex = filterParts.join(";");

  const commandArgs = [
    "-y",
    "-i", inputPath,
    "-filter_complex", filterComplex,
    "-map", "[vout]",
    "-map", "[aout]",
    "-c:v", useVT ? "h264_videotoolbox" : "libx264",
    "-preset", "fast",
    "-c:a", "aac",
    "-b:a", "192k",
    outputPath
  ];

  return {filterComplex, commandArgs};
};
