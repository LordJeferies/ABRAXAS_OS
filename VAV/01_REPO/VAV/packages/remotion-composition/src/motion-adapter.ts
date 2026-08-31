import type {MotionPlan, MotionTransformState} from "@vav/visual-motion-domain";
import {evaluateMotionTransform} from "@vav/motion-engine";
import {frameToUs, parseRationalFps, type Rational} from "@vav/timebase";

export type RemotionMotionStyles = Readonly<{
  transform: string;
  opacity: number;
  clipPath?: string | undefined;
  filter?: string | undefined;
  transitionMode?: string | undefined;
  evaluatedState: MotionTransformState;
}>;

export const generateRemotionMotionStyles = (
  motionPlan: MotionPlan | null,
  frame: number,
  fps: number | string | Rational = "30/1",
  canvasWidth: number = 1080,
  canvasHeight: number = 1920
): RemotionMotionStyles => {
  const rationalFps: Rational = typeof fps === "string"
    ? parseRationalFps(fps)
    : (typeof fps === "number" ? {num: Math.round(fps * 1000), den: 1000} : fps);

  if (!motionPlan || motionPlan.assignments.length === 0) {
    const neutralState: MotionTransformState = {
      scale: 1.0,
      translateX: 0.0,
      translateY: 0.0,
      opacity: 1.0,
      cameraZ: 0.0,
      revealProgress: 1.0,
      revealDirection: "LEFT_TO_RIGHT",
      parallaxOffset: 0.0,
      transitionProgress: 0.0,
      transitionMode: "NONE"
    };
    return {
      transform: "translate3d(0.00px, 0.00px, 0.00px) scale(1.0000)",
      opacity: 1.0,
      evaluatedState: neutralState
    };
  }

  const timeUs = frameToUs(frame, rationalFps);
  const state = evaluateMotionTransform(motionPlan, timeUs);

  let clipPath: string | undefined;
  if (state.revealProgress < 1.0) {
    const pct = Math.round(state.revealProgress * 100);
    clipPath = state.revealDirection === "LEFT_TO_RIGHT"
      ? `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`
      : `polygon(${100 - pct}% 0, 100% 0, 100% 100%, ${100 - pct}% 100%)`;
  }

  // Handle BASIC_TRANSITION whip/dip mode materialization
  let finalOpacity = Math.max(0, Math.min(1, state.opacity));
  let finalTx = state.translateX;
  if (state.transitionMode === "WHIP_DIP" && state.transitionProgress > 0) {
    finalOpacity *= (1.0 - Math.sin(state.transitionProgress * Math.PI) * 0.5);
    finalTx += (Math.sin(state.transitionProgress * Math.PI) * 50.0);
  }

  return {
    transform: `translate3d(${finalTx.toFixed(2)}px, ${state.translateY.toFixed(2)}px, ${state.cameraZ.toFixed(2)}px) scale(${state.scale.toFixed(4)})`,
    opacity: finalOpacity,
    clipPath,
    transitionMode: state.transitionMode,
    evaluatedState: state
  };
};
