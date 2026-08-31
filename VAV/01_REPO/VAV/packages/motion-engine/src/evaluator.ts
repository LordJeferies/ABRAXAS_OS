import type {MotionPlan, MotionTransformState} from "@vav/visual-motion-domain";

export const evaluateMotionTransform = (
  plan: MotionPlan,
  timeUs: number
): MotionTransformState => {
  let scale = 1.0;
  let translateX = 0.0;
  let translateY = 0.0;
  let opacity = 1.0;
  let cameraZ = 0.0;
  let revealProgress = 1.0;
  let revealDirection = "LEFT_TO_RIGHT";
  let parallaxOffset = 0.0;
  let transitionProgress = 0.0;
  let transitionMode = "NONE";

  for (const asg of plan.assignments) {
    if (timeUs >= asg.timelineRange.startUs && timeUs <= asg.timelineRange.endUs) {
      const dur = asg.timelineRange.endUs - asg.timelineRange.startUs;
      const progress = dur > 0 ? (timeUs - asg.timelineRange.startUs) / dur : 0;

      switch (asg.motionFamilyId) {
        case "MOT_ZOOM_IN":
        case "MOT_PUSH_IN": {
          const startS = Number(asg.parameters["startScale"] ?? 1.0);
          const endS = Number(asg.parameters["endScale"] ?? 1.15);
          scale *= startS + (endS - startS) * progress;
          break;
        }
        case "MOT_ZOOM_OUT":
        case "MOT_PULL_OUT": {
          const startS = Number(asg.parameters["startScale"] ?? 1.15);
          const endS = Number(asg.parameters["endScale"] ?? 1.0);
          scale *= startS + (endS - startS) * progress;
          break;
        }
        case "MOT_PAN_LEFT": {
          const px = Number(asg.parameters["translateXPercent"] ?? -8.0);
          translateX += (px / 100) * plan.canvas.width * progress;
          break;
        }
        case "MOT_PAN_RIGHT": {
          const px = Number(asg.parameters["translateXPercent"] ?? 8.0);
          translateX += (px / 100) * plan.canvas.width * progress;
          break;
        }
        case "MOT_SCALE": {
          scale *= Number(asg.parameters["scale"] ?? 1.1);
          break;
        }
        case "MOT_TRANSLATE": {
          const dx = Number(asg.parameters["deltaX"] ?? 0);
          const dy = Number(asg.parameters["deltaY"] ?? 0);
          translateX += dx * progress;
          translateY += dy * progress;
          break;
        }
        case "MOT_FADE_IN": {
          opacity = Math.min(1.0, progress);
          break;
        }
        case "MOT_FADE_OUT": {
          opacity = Math.max(0.0, 1.0 - progress);
          break;
        }
        case "MOT_REVEAL_WIPE": {
          revealProgress = progress;
          revealDirection = String(asg.parameters["direction"] ?? "LEFT_TO_RIGHT");
          break;
        }
        case "MOT_BASIC_PARALLAX": {
          const fg = Number(asg.parameters["foregroundMultiplier"] ?? 1.3);
          parallaxOffset = progress * 20.0;
          cameraZ = fg * progress;
          break;
        }
        case "MOT_BASIC_TRANSITION": {
          transitionProgress = progress;
          transitionMode = String(asg.parameters["mode"] ?? "WHIP_DIP");
          break;
        }
      }
    }
  }

  return {
    scale,
    translateX,
    translateY,
    opacity,
    cameraZ,
    revealProgress,
    revealDirection,
    parallaxOffset,
    transitionProgress,
    transitionMode
  };
};
