import type {DesignState, RuntimeCaption, SceneMark} from "./fullAlphaTypes.ts";
import {builtInCaptionStyles} from "@vav/caption-styles";
import {builtInMotionCatalog} from "@vav/caption-motion";

export const styleCatalog = builtInCaptionStyles.map(({id, label}) => ({id, label}));

export const structureCatalog = [
  {id: "hero-stack", label: "Hero Stack"},
  {id: "balanced", label: "Balanced"},
  {id: "progressive", label: "Progressive"}
] as const;

export const motionCatalog = builtInMotionCatalog.map(({id, label}) => ({id, label}));

export const placementCatalog = [
  {id: "auto", label: "Auto · Scene Smart"},
  {id: "top-center", label: "Arriba"},
  {id: "center", label: "Centro"},
  {id: "center-low", label: "Centro bajo"},
  {id: "bottom", label: "Abajo"}
] as const;

export const defaultDesign: DesignState = {
  styleId: "hybrid-inspirational",
  structureId: "hero-stack",
  motionId: "slide-blur-lite",
  placement: "auto",
  safeZones: true
};

export const frameFromUs = (us: number, fps: number) =>
  Math.max(0, Math.round((us / 1_000_000) * fps));

export const usFromFrame = (frame: number, fps: number) =>
  Math.max(0, Math.round((frame / fps) * 1_000_000));

export const captionAtFrame = (
  captions: readonly RuntimeCaption[],
  frame: number,
  fps: number
): RuntimeCaption | null => {
  const us = usFromFrame(frame, fps);
  return captions.find((caption) => us >= caption.startUs && us < caption.endUs) ?? null;
};

export const formatUs = (us: number): string => {
  const total = Math.max(0, us) / 1_000_000;
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = Math.floor(total % 60);
  const hundredths = Math.floor((total % 1) * 100);

  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
};

export const resolvePlacement = (
  placement: DesignState["placement"],
  scene: Pick<SceneMark, "suggestedPlacement"> | null
): Exclude<DesignState["placement"], "auto"> =>
  placement === "auto" ? scene?.suggestedPlacement ?? "center-low" : placement;
