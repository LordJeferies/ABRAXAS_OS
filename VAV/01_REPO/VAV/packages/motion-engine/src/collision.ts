import {getSafeBoundingBox, NEUTRAL_SAFE_ZONE, type PlatformSafeZonePreset} from "@vav/platform-safe-zones";
import type {TextOwnership} from "@vav/visual-motion-domain";

export type CollisionResult = "CLEAR" | "ADJUST" | "SUPPRESS_MOTION" | "ADAPT_CAPTION";

export type BoundingBox = Readonly<{
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}>;

export const evaluateCaptionMotionCollision = (
  motionBounds: BoundingBox,
  captionBounds: BoundingBox,
  canvasWidth: number,
  canvasHeight: number,
  ownership: TextOwnership = "caption-engine",
  safeZone: PlatformSafeZonePreset = NEUTRAL_SAFE_ZONE
): CollisionResult => {
  const safeBox = getSafeBoundingBox(canvasWidth, canvasHeight, safeZone);

  // Check if caption is outside platform safe zone
  if (
    captionBounds.minX < safeBox.minX ||
    captionBounds.maxX > safeBox.maxX ||
    captionBounds.minY < safeBox.minY ||
    captionBounds.maxY > safeBox.maxY
  ) {
    return "ADAPT_CAPTION";
  }

  // Check overlap between motion graphical element and caption
  const overlapsX = motionBounds.minX < captionBounds.maxX && motionBounds.maxX > captionBounds.minX;
  const overlapsY = motionBounds.minY < captionBounds.maxY && motionBounds.maxY > captionBounds.minY;

  if (overlapsX && overlapsY) {
    if (ownership === "caption-engine") {
      return "SUPPRESS_MOTION";
    } else if (ownership === "visual-motion") {
      return "ADAPT_CAPTION";
    } else {
      return "ADJUST";
    }
  }

  return "CLEAR";
};
