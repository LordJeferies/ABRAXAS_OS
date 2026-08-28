import React from "react";
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, Video} from "remotion";
import {evaluateBaselineMotion, evaluateImportedMotion} from "@vav/caption-motion";
import {getCaptionStylePreset, resolveCaptionVisual} from "@vav/caption-styles";
import {buildCaptionHierarchy, type ContentRole as HierarchyContentRole} from "@vav/caption-hierarchy";
import type {CaptionStylePreset} from "@vav/abraxas-import";
import type {VavCaptionCompositionProps} from "./types.ts";

const usFromFrame = (frame: number, fps: number) => Math.max(0, Math.round((frame / fps) * 1_000_000));

const positionStyle = (placement: string): React.CSSProperties => {
  if (placement === "top-center") return {top: "12%", bottom: "auto"};
  if (placement === "center") return {top: "50%", bottom: "auto"};
  if (placement === "bottom") return {top: "auto", bottom: "12%"};
  return {top: "auto", bottom: "25%"};
};

const roleForHierarchy = (role: string | undefined): HierarchyContentRole => {
  if (role === "hook" || role === "development" || role === "proof" || role === "close" || role === "cta") return role;
  return "other";
};

const textTransformValue = (value: "none" | "uppercase" | "capitalize"): React.CSSProperties["textTransform"] => value;

const fontFamily = (preset: CaptionStylePreset, hero: boolean): string => {
  const preferred = preset.typography.preferredFamily?.trim();
  const fallback = preset.typography.fallbackFamily?.trim();
  const abstractDescriptor = preferred?.includes("_") || preferred?.includes("+");
  if (preset.typography.fontCategory === "mixed") {
    return hero ? "Inter, system-ui, -apple-system, sans-serif" : "Georgia, 'Times New Roman', serif";
  }
  if (preferred && !abstractDescriptor) return `${preferred}, ${fallback ?? "system-ui"}`;
  if (preset.typography.fontCategory === "serif") return `${fallback ?? "Georgia"}, serif`;
  return `${fallback ?? "Inter"}, system-ui, -apple-system, sans-serif`;
};

export const VavCaptionComposition: React.FC<VavCaptionCompositionProps> = ({plan, videoUrl = null, sourceMediaName = null, showGuides = false}) => {
  const frame = useCurrentFrame();
  const {fps, height, width} = useVideoConfig();
  const timeUs = usFromFrame(frame, fps);
  const caption = plan.captions.find((item) => timeUs >= item.startUs && timeUs < item.endUs) ?? null;
  const scene = plan.scenes.find((item) => timeUs >= item.startUs && timeUs < item.endUs) ?? null;
  const content = plan.contentCandidates.find((item) => timeUs >= item.startUs && timeUs < item.endUs) ?? null;
  const motionContext = plan.motionContexts.find((item) => timeUs >= item.startUs && timeUs < item.endUs) ?? null;

  const preset = getCaptionStylePreset(plan.design.styleId, plan.approvedStylePresets, plan.previewStylePreset);
  const visual = resolveCaptionVisual(preset, height);
  const presetPlacement = preset.placement.preferredZone === "top" || preset.placement.preferredZone === "upper-center" ? "top-center"
    : preset.placement.preferredZone === "center" ? "center"
    : preset.placement.preferredZone === "bottom" || preset.placement.preferredZone === "lower" ? "bottom"
    : "center-low";
  const placement = plan.design.placement === "auto" ? scene?.suggestedPlacement ?? presetPlacement : plan.design.placement;
  const suppressed = motionContext?.captionVisibility === "suppress";
  const localFrame = caption ? Math.max(0, frame - Math.round((caption.startUs / 1_000_000) * fps)) : 0;
  const importedMotion = plan.previewMotionPreset?.id === plan.design.motionId
    ? plan.previewMotionPreset
    : plan.approvedMotionPresets.find((item) => item.id === plan.design.motionId) ?? null;
  const captionTotalFrames = caption ? Math.max(1, Math.round(((caption.endUs - caption.startUs) / 1_000_000) * fps)) : 1;
  const motion = importedMotion
    ? evaluateImportedMotion(importedMotion, localFrame, fps, width, height, captionTotalFrames)
    : evaluateBaselineMotion(plan.design.motionId, localFrame, fps, captionTotalFrames, width);

  const hierarchy = caption ? buildCaptionHierarchy(caption.text, roleForHierarchy(content?.role), Math.max(1, preset.hierarchy.heroCount.max)) : null;
  const words = hierarchy?.tokens ?? [];
  const roleScale = content?.role === "hook" ? 1.1 : 1;
  const structure = plan.design.structureId.replaceAll("_", "-");
  const pos = positionStyle(placement);
  const centerTransform = placement === "center" ? "translateY(-50%)" : "";
  const motionTransform = `translate(${motion.translateX}px, ${motion.translateY}px) rotate(${motion.rotateZDeg}deg) scale(${motion.scale})`;
  const shadow = [visual.shadow, visual.glow].filter(Boolean).join(", ");
  const outline = visual.strokeWidthPx > 0 ? `${visual.strokeWidthPx}px ${visual.strokeColor}` : undefined;
  const bg = preset.color.backgroundMode !== "none"
    ? `color-mix(in srgb, ${preset.color.backgroundColor} ${Math.round(preset.color.backgroundOpacity * 100)}%, transparent)`
    : "transparent";
  const mediaSrc = videoUrl || (sourceMediaName ? staticFile(sourceMediaName) : null);

  return (
    <AbsoluteFill style={{backgroundColor: "#050608"}}>
      {mediaSrc ? (
        <Video src={mediaSrc} style={{width: "100%", height: "100%", objectFit: "cover"}} />
      ) : (
        <AbsoluteFill style={{display: "grid", placeItems: "center", color: "rgba(255,255,255,.5)", fontFamily: "system-ui"}}>IMPORTA UN VIDEO</AbsoluteFill>
      )}

      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(0,0,0,.02),transparent 55%,rgba(0,0,0,.16))"}} />

      {showGuides && plan.design.safeZones && (
        <div style={{position: "absolute", left: "7%", right: "12%", top: "8%", bottom: "14%", border: "2px dashed rgba(58,200,255,.35)", borderRadius: 18, pointerEvents: "none"}} />
      )}

      {caption && hierarchy && !suppressed && (
        <div style={{
          position: "absolute", left: "9%", right: "9%", marginInline: "auto", maxWidth: `${visual.maxWidthPercent}%`, ...pos,
          textAlign: "center", fontFamily: fontFamily(preset, false), fontSize: visual.baseSizePx * roleScale, lineHeight: visual.lineHeight,
          color: visual.primaryFill, fontWeight: visual.fontWeight, fontStyle: visual.fontStyle, letterSpacing: `${visual.letterSpacingEm}em`,
          textTransform: textTransformValue(visual.textTransform), opacity: motion.opacity, filter: `blur(${Math.max(0, motion.blurPx)}px)`,
          transform: `${centerTransform} ${motionTransform}`.trim(), WebkitTextStroke: outline, textShadow: shadow, background: bg,
          borderRadius: preset.color.backgroundMode === "pill" ? 999 : preset.color.backgroundMode === "box" ? 12 : 0,
          padding: preset.color.backgroundMode === "none" ? 0 : `${Math.round(height * .008)}px ${Math.round(width * .018)}px`
        }}>
          {structure === "hero-stack" && preset.hierarchy.heroEnabled && hierarchy.heroText ? (
            <>
              {hierarchy.supportBefore && <div style={{fontFamily: fontFamily(preset, false), fontSize: visual.secondarySizePx, color: visual.secondaryFill, fontWeight: visual.secondaryWeight, opacity: .92, fontStyle: preset.typography.fontCategory === "mixed" ? "italic" : visual.fontStyle}}>{hierarchy.supportBefore}</div>}
              <div style={{fontFamily: fontFamily(preset, true), fontSize: visual.heroSizePx, lineHeight: .9, color: visual.heroFill, fontWeight: Math.max(800, visual.fontWeight), fontStyle: "normal"}}>{hierarchy.heroText}</div>
              {hierarchy.supportAfter && <div style={{marginTop: Math.round(height * .004), fontSize: visual.secondarySizePx, color: visual.secondaryFill, fontWeight: visual.secondaryWeight, opacity: .9}}>{hierarchy.supportAfter}</div>}
            </>
          ) : structure === "progressive" ? (
            <div>{words.map((token, index) => <span key={`${token.text}-${index}`} style={{opacity: index <= Math.floor(localFrame / Math.max(1, fps * .22)) ? 1 : .28, marginRight: Math.round(width * .01), color: token.role === "hero" ? visual.heroFill : token.role === "connector" ? visual.secondaryFill : visual.primaryFill, fontSize: token.role === "hero" ? visual.heroSizePx : visual.baseSizePx, fontWeight: token.role === "hero" ? Math.max(850, visual.fontWeight) : visual.fontWeight}}>{token.text}</span>)}</div>
          ) : (
            <div>{words.map((token, index) => <React.Fragment key={`${token.text}-${index}`}><span style={{color: token.role === "hero" && preset.hierarchy.heroEnabled ? visual.heroFill : token.role === "connector" ? visual.secondaryFill : visual.primaryFill, fontSize: token.role === "hero" && preset.hierarchy.heroEnabled ? visual.baseSizePx * Math.min(1.18, preset.sizing.heroScale) : visual.baseSizePx, fontWeight: token.role === "hero" ? Math.max(850, visual.fontWeight) : visual.fontWeight}}>{token.text}</span>{index < words.length - 1 ? " " : ""}</React.Fragment>)}</div>
          )}
          {content && <div style={{marginTop: 18, fontSize: 18, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", opacity: .35}}>{content.role}</div>}
        </div>
      )}
    </AbsoluteFill>
  );
};
