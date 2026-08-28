import type {MotionContext} from "@vav/visual-motion-domain";

export type CaptionCompileInput = Readonly<{
  captionIds: readonly string[];
  motionContexts: readonly MotionContext[];
  lockedTargetIds: readonly string[];
}>;

export type CaptionOwnership =
  | "caption-engine"
  | "visual-motion"
  | "hybrid";

export const ownershipAtTime = (
  timeUs: number,
  motions: readonly MotionContext[]
): CaptionOwnership => {
  const active = motions.find((motion) =>
    motion.timelineStartUs !== null &&
    motion.timelineEndUs !== null &&
    timeUs >= motion.timelineStartUs &&
    timeUs < motion.timelineEndUs
  );
  return active?.textOwnership ?? "caption-engine";
};
