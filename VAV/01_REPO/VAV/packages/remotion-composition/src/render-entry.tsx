import React from "react";
import {Composition, registerRoot} from "remotion";
import {VavCaptionComposition} from "./VavCaptionComposition.tsx";
import type {VavCaptionCompositionProps} from "./types.ts";

const fallbackPlan: VavCaptionCompositionProps["plan"] = {
  schemaVersion: 1,
  renderVersion: "v12-remotion-parity-1",
  seed: "vav-default",
  width: 1080,
  height: 1920,
  fps: 30,
  sourceFpsRational: null,
  durationUs: 10_000_000,
  captions: [],
  design: {styleId: "hybrid-inspirational", structureId: "hero-stack", motionId: "slide-blur-lite", placement: "auto", safeZones: false},
  scenes: [],
  contentCandidates: [],
  motionContexts: [],
  approvedStylePresets: [],
  approvedMotionPresets: [],
  previewStylePreset: null,
  previewMotionPreset: null
};

const Root: React.FC = () => (
  <Composition
    id="VAVCaptionComposition"
    component={VavCaptionComposition}
    defaultProps={{plan: fallbackPlan, videoUrl: null, sourceMediaName: null, showGuides: false} satisfies VavCaptionCompositionProps}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
    calculateMetadata={({props}) => ({
      durationInFrames: Math.max(1, Math.ceil((props.plan.durationUs / 1_000_000) * props.plan.fps)),
      fps: props.plan.fps,
      width: Math.max(16, Math.round(props.plan.width)),
      height: Math.max(16, Math.round(props.plan.height))
    })}
  />
);

registerRoot(Root);
