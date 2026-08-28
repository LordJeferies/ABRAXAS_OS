import {existsSync, mkdtempSync, rmSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import type {CaptionBlock, ContentCandidate, DesignState, MotionContext} from "./full-alpha-types.ts";

const srtTime = (us: number): string => {
  const ms = Math.max(0, Math.round(us / 1000));
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const rest = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(rest).padStart(3, "0")}`;
};

const assTime = (us: number): string => {
  const cs = Math.max(0, Math.round(us / 10_000));
  const h = Math.floor(cs / 360_000);
  const m = Math.floor((cs % 360_000) / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const rest = cs % 100;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(rest).padStart(2, "0")}`;
};

const clean = (text: string) => text.replace(/\r?\n/g, "\\N").replace(/[{}]/g, "");

export const buildSrt = (captions: readonly CaptionBlock[]): string =>
  captions.map((caption, index) =>
    `${index + 1}\n${srtTime(caption.startUs)} --> ${srtTime(caption.endUs)}\n${caption.text.trim()}\n`
  ).join("\n");

const styleMeta = (design: DesignState) => {
  switch (design.styleId) {
    case "hybrid-inspirational": return {size: 72, primary: "&H00FFFFFF", outline: "&H00000000", outlinePx: 4};
    case "hollow-glow": return {size: 76, primary: "&H00FFFFFF", outline: "&H00FFFFFF", outlinePx: 5};
    case "impact-motion": return {size: 92, primary: "&H00FFFFFF", outline: "&H00000000", outlinePx: 6};
    case "clean-bold":
    default: return {size: 68, primary: "&H00FFFFFF", outline: "&H00000000", outlinePx: 4};
  }
};

const align = (placement: DesignState["placement"]) =>
  placement === "top-center" ? 8 : placement === "center" ? 5 : 2;

const motionTag = (motion: DesignState["motionId"]) =>
  motion === "hero-pop"
    ? "\\fscx82\\fscy82\\t(0,220,\\fscx100\\fscy100)\\fad(70,120)"
    : motion === "fade"
      ? "\\fad(160,160)"
      : "\\fad(110,150)";

export const buildAss = (
  captions: readonly CaptionBlock[],
  design: DesignState,
  motions: readonly MotionContext[],
  content: readonly ContentCandidate[],
  width: number,
  height: number
): string => {
  const meta = styleMeta(design);
  const placement = design.placement === "auto" ? "center-low" : design.placement;
  const style = `Style: VAV,Arial,${meta.size},${meta.primary},&H000000FF,${meta.outline},&H64000000,-1,0,0,0,100,100,0,0,1,${meta.outlinePx},2,${align(placement)},60,60,150,1`;

  const events = captions
    .filter((caption) => !motions.some((motion) =>
      motion.captionVisibility === "suppress" &&
      caption.startUs < motion.endUs &&
      caption.endUs > motion.startUs
    ))
    .map((caption) => {
      const role = content.find((candidate) =>
        caption.startUs >= candidate.startUs && caption.startUs < candidate.endUs
      )?.role ?? "other";
      const roleTag = role === "hook" ? "\\fs92" : "";
      return `Dialogue: 0,${assTime(caption.startUs)},${assTime(caption.endUs)},VAV,,0,0,0,,{${motionTag(design.motionId)}${roleTag}}${clean(caption.text)}`;
    }).join("\n");

  return `[Script Info]
ScriptType: v4.00+
PlayResX: ${width || 1080}
PlayResY: ${height || 1920}
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
${style}

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
${events}
`;
};

export const exportSrt = (path: string, captions: readonly CaptionBlock[]) => {
  writeFileSync(path, buildSrt(captions), "utf8");
  return {path};
};

export const exportMp4 = (
  inputPath: string,
  outputPath: string,
  captions: readonly CaptionBlock[],
  design: DesignState,
  motions: readonly MotionContext[],
  content: readonly ContentCandidate[],
  width: number,
  height: number
) => {
  if (!existsSync(inputPath)) throw new Error(`Video no encontrado: ${inputPath}`);

  const temp = mkdtempSync(join(tmpdir(), "vav-alpha-export-"));
  const ass = join(temp, "captions.ass");
  try {
    writeFileSync(ass, buildAss(captions, design, motions, content, width, height), "utf8");
    const filter = `ass='${ass.replace(/'/g, "\\\\'")}'`;
    const common = [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", inputPath, "-vf", filter,
      "-c:a", "aac", "-b:a", "192k",
      "-movflags", "+faststart"
    ];

    let result = spawnSync("ffmpeg", [
      ...common, "-c:v", "h264_videotoolbox", "-b:v", "10M", outputPath
    ], {encoding: "utf8", maxBuffer: 64 * 1024 * 1024});

    if (result.status !== 0) {
      result = spawnSync("ffmpeg", [
        ...common, "-c:v", "libx264", "-preset", "medium", "-crf", "18", outputPath
      ], {encoding: "utf8", maxBuffer: 64 * 1024 * 1024});
    }

    if (result.status !== 0) throw new Error((result.stderr || "FFmpeg export falló").trim());
    return {path: outputPath, renderer: "ffmpeg-ass-alpha"};
  } finally {
    rmSync(temp, {recursive: true, force: true});
  }
};
