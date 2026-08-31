export * from "./edl-fcpxml.ts";
import type {EditClipMap} from "@vav/time-mapping";
import type {MotionContext} from "@vav/visual-motion-domain";

export type VavEditManifest = Readonly<{
  schemaVersion: 1;
  sourceMediaId: string;
  clips: readonly EditClipMap[];
}>;

export type VavMotionManifest = Readonly<{
  schemaVersion: 1;
  contentId: string | null;
  motionInstances: readonly MotionContext[];
}>;

export type VavContentBridgeManifest = Readonly<{
  schemaVersion: 1;
  contentId: string | null;
  sourceArtifactId: string;
  moduleVersions: Readonly<Record<string, number>>;
}>;
