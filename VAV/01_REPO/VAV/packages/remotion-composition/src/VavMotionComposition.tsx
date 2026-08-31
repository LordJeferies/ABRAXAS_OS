import React from "react";
import {useCurrentFrame} from "remotion";
import type {MotionPlan} from "@vav/visual-motion-domain";
import type {EditLock} from "@vav/cut-domain";
import {generateRemotionMotionStyles} from "./motion-adapter.ts";
import {parseRationalFps} from "@vav/timebase";

export type VavMotionCompositionProps = {
  motionPlan: MotionPlan | null;
  editLock: EditLock | null;
  fpsRational?: string;
  width?: number;
  height?: number;
  videoUrl?: string | null;
};

export const VavMotionComposition: React.FC<VavMotionCompositionProps> = ({
  motionPlan,
  editLock,
  fpsRational: fallbackFpsRational = "30/1",
  width: fallbackWidth = 1080,
  height: fallbackHeight = 1920,
  videoUrl
}) => {
  const frame = useCurrentFrame();
  const fpsRationalStr = editLock ? editLock.timebase.fpsRational : fallbackFpsRational;
  const fpsRational = parseRationalFps(fpsRationalStr);
  const numericFps = fpsRational.num / fpsRational.den;
  const width = editLock ? editLock.timebase.width : fallbackWidth;
  const height = editLock ? editLock.timebase.height : fallbackHeight;

  const styles = generateRemotionMotionStyles(motionPlan, frame, fpsRational, width, height);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#030712",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        data-testid="motion-layer"
        style={{
          width: "480px",
          height: "480px",
          transform: styles.transform,
          opacity: styles.opacity,
          clipPath: styles.clipPath,
          background: "linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)",
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontFamily: "sans-serif",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
        }}
      >
        <span style={{fontSize: "48px", fontWeight: 800, letterSpacing: "-0.05em"}}>VAV</span>
        <span style={{fontSize: "14px", opacity: 0.8, marginTop: "8px", fontFamily: "monospace"}}>
          Frame #{frame} ({((frame / numericFps)).toFixed(2)}s)
        </span>
      </div>
    </div>
  );
};
