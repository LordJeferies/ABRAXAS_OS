import type {MotionPreset} from "@vav/abraxas-import";

export type MotionRegistryEntry = Readonly<{id: string; label: string; builtIn: boolean; preset: MotionPreset | null}>;

export const builtInMotionCatalog: readonly MotionRegistryEntry[] = [
  {id: "slide-blur-lite", label: "Slide + Blur Lite", builtIn: true, preset: null},
  {id: "hero-pop", label: "Hero Pop", builtIn: true, preset: null},
  {id: "fade", label: "Fade", builtIn: true, preset: null},
  {id: "glow-pulse", label: "Glow Pulse", builtIn: true, preset: null},
  {id: "glow-reveal", label: "Glow Reveal", builtIn: true, preset: null},
  {id: "impact-kinetic", label: "Impact Kinetic", builtIn: true, preset: null},
  {id: "clean-fade", label: "Clean Fade", builtIn: true, preset: null}
] as const;

export const mergeMotionRegistry = (approved: readonly MotionPreset[]): readonly MotionRegistryEntry[] => {
  const map = new Map<string, MotionRegistryEntry>(builtInMotionCatalog.map((x) => [x.id, x]));
  for (const preset of approved) {
    if (preset.status !== "approved") continue;
    map.set(preset.id, {id: preset.id, label: preset.name, builtIn: false, preset});
  }
  return [...map.values()];
};

export type MotionPhase = "enter" | "active" | "exit";

export type MotionEvaluation = Readonly<{
  translateX: number;
  translateY: number;
  scale: number;
  opacity: number;
  blurPx: number;
  rotateZDeg: number;
}>;

const clamp01 = (t: number) => Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
const easeOutQuart = (t: number) => 1 - Math.pow(1 - clamp01(t), 4);
const easeInQuart = (t: number) => Math.pow(clamp01(t), 4);

const framesForMs = (ms: number, fps: number) => Math.max(1, (ms / 1000) * Math.max(1, fps));

const exitProgress = (localFrame: number, totalFrames: number, exitMs: number, fps: number) => {
  if (!Number.isFinite(totalFrames) || totalFrames <= 0 || exitMs <= 0) return 0;
  const exitFrames = framesForMs(exitMs, fps);
  return clamp01((localFrame - Math.max(0, totalFrames - exitFrames)) / exitFrames);
};

export const evaluateBaselineMotion = (
  motionId: string,
  localFrame: number,
  fps: number,
  totalFrames = Number.POSITIVE_INFINITY,
  viewportWidth = 1080
): MotionEvaluation => {
  const enterMs = motionId === "impact-kinetic" ? 190 : motionId === "clean-fade" ? 150 : motionId === "glow-reveal" ? 220 : 280;
  const enter = easeOutQuart(localFrame / framesForMs(enterMs, fps));
  const exitMs = motionId === "impact-kinetic" ? 190 : motionId === "clean-fade" ? 130 : motionId === "glow-reveal" ? 180 : 160;
  const exit = easeInQuart(exitProgress(localFrame, totalFrames, exitMs, fps));
  const visible = enter * (1 - exit);

  if (motionId === "slide-blur-lite") {
    return {translateX: 0, translateY: (1 - enter) * 65, scale: .96 + .04 * enter, opacity: visible, blurPx: (1 - enter) * 22 + exit * 8, rotateZDeg: 0};
  }
  if (motionId === "hero-pop") {
    return {translateX: 0, translateY: 0, scale: .82 + .18 * enter, opacity: visible, blurPx: exit * 5, rotateZDeg: 0};
  }
  if (motionId === "impact-kinetic") {
    return {translateX: exit * viewportWidth * .12, translateY: 0, scale: .82 + .18 * enter, opacity: visible, blurPx: exit * 18, rotateZDeg: 0};
  }
  if (motionId === "glow-pulse" || motionId === "glow-reveal") {
    const pulse = localFrame > framesForMs(enterMs, fps) ? Math.sin(localFrame / Math.max(1, fps) * Math.PI * 2.1) : 0;
    return {translateX: 0, translateY: 0, scale: .99 + .01 * enter + pulse * .006, opacity: visible, blurPx: 0, rotateZDeg: 0};
  }
  return {translateX: 0, translateY: 0, scale: 1, opacity: visible, blurPx: 0, rotateZDeg: 0};
};

const numeric = (value: string | number | boolean | null | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : typeof value === "string" && Number.isFinite(Number(value)) ? Number(value) : fallback;

const textValue = (value: string | number | boolean | null | undefined, fallback = "") =>
  typeof value === "string" ? value : fallback;

export const evaluateImportedMotion = (
  preset: MotionPreset,
  localFrame: number,
  fps: number,
  viewportWidth: number,
  viewportHeight: number,
  totalFrames = Number.POSITIVE_INFINITY
): MotionEvaluation => {
  const durationMs = Math.max(1, numeric(preset.enter.duration_ms, 220));
  const raw = (localFrame / Math.max(1, fps)) * 1000 / durationMs;
  const t = easeOutQuart(raw);
  const opacityFrom = numeric(preset.enter.opacity_from, 0);
  const opacityTo = numeric(preset.enter.opacity_to, 1);
  const enterType = textValue(preset.enter.type);
  const scaleFrom = numeric(preset.enter.scale_from, enterType === "pop" ? .82 : 1);
  const scaleTo = numeric(preset.enter.scale_to, 1);
  const xFrom = numeric(preset.enter.x_from_ratio, 0) * viewportWidth;
  const xTo = numeric(preset.enter.x_to_ratio, 0) * viewportWidth;
  const yFrom = numeric(preset.enter.y_from_ratio, enterType === "blur_slide" ? .035 : 0) * viewportHeight;
  const yTo = numeric(preset.enter.y_to_ratio, 0) * viewportHeight;
  const blurFrom = numeric(preset.enter.blur_from_px, enterType === "blur_slide" ? 22 : 0);
  const blurTo = numeric(preset.enter.blur_to_px, 0);
  const rotationFrom = numeric(preset.enter.rotation_from_deg, 0);
  const rotationTo = numeric(preset.enter.rotation_to_deg, 0);

  const exitMs = Math.max(0, numeric(preset.exit.duration_ms, 160));
  const out = easeInQuart(exitProgress(localFrame, totalFrames, exitMs, fps));
  const exitType = textValue(preset.exit.type);
  const exitOpacityFrom = numeric(preset.exit.opacity_from, 1);
  const exitOpacityTo = numeric(preset.exit.opacity_to, 0);
  const exitXFrom = numeric(preset.exit.x_from_ratio, 0) * viewportWidth;
  const exitXTo = numeric(preset.exit.x_to_ratio, exitType === "right_out_blur" ? .12 : 0) * viewportWidth;
  const exitYFrom = numeric(preset.exit.y_from_ratio, 0) * viewportHeight;
  const exitYTo = numeric(preset.exit.y_to_ratio, 0) * viewportHeight;
  const exitBlurFrom = numeric(preset.exit.blur_from_px, 0);
  const exitBlurTo = numeric(preset.exit.blur_to_px, exitType.includes("blur") ? 18 : 0);

  const enterOpacity = opacityFrom + (opacityTo - opacityFrom) * t;
  const exitOpacity = exitOpacityFrom + (exitOpacityTo - exitOpacityFrom) * out;
  const enterX = xFrom + (xTo - xFrom) * t;
  const enterY = yFrom + (yTo - yFrom) * t;
  const exitX = exitXFrom + (exitXTo - exitXFrom) * out;
  const exitY = exitYFrom + (exitYTo - exitYFrom) * out;

  return {
    translateX: enterX + exitX,
    translateY: enterY + exitY,
    scale: scaleFrom + (scaleTo - scaleFrom) * t,
    opacity: clamp01(enterOpacity * exitOpacity),
    blurPx: Math.max(0, blurFrom + (blurTo - blurFrom) * t + exitBlurFrom + (exitBlurTo - exitBlurFrom) * out),
    rotateZDeg: rotationFrom + (rotationTo - rotationFrom) * t
  };
};
