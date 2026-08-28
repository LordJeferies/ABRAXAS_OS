import type {CaptionStylePreset, MotionPreset} from "@vav/abraxas-import";
import type {CaptionPlanV1, RenderCaption, RenderContentCandidate, RenderDesignState, RenderMotionContext, RenderSceneMark} from "./types.ts";

export type CreateCaptionPlanInput = Readonly<{
  width: number;
  height: number;
  fps?: number;
  sourceFpsRational?: string | null;
  durationUs: number;
  captions: readonly RenderCaption[];
  design: RenderDesignState;
  scenes: readonly RenderSceneMark[];
  contentCandidates: readonly RenderContentCandidate[];
  motionContexts: readonly RenderMotionContext[];
  approvedStylePresets?: readonly CaptionStylePreset[];
  approvedMotionPresets?: readonly MotionPreset[];
  previewStylePreset?: CaptionStylePreset | null;
  previewMotionPreset?: MotionPreset | null;
  seed?: string;
}>;

const finite = (value: number, fallback: number) => Number.isFinite(value) && value > 0 ? value : fallback;

export const createCaptionPlan = (input: CreateCaptionPlanInput): CaptionPlanV1 => {
  const fps = finite(input.fps ?? 30, 30);
  const width = Math.max(16, Math.round(finite(input.width, 1080)));
  const height = Math.max(16, Math.round(finite(input.height, 1920)));
  const durationUs = Math.max(1, Math.round(finite(input.durationUs, 1_000_000)));
  const designKey = `${input.design.styleId}:${input.design.structureId}:${input.design.motionId}:${input.design.placement}:${input.design.safeZones ? 1 : 0}`;
  const captionKey = input.captions.map((x) => `${x.id}:${x.startUs}:${x.endUs}`).join("|");
  const seed = input.seed?.trim() || `vav:${width}x${height}:${fps}:${durationUs}:${designKey}:${captionKey}`;

  return {
    schemaVersion: 1,
    renderVersion: "v12-remotion-parity-1",
    seed,
    width,
    height,
    fps,
    sourceFpsRational: input.sourceFpsRational ?? null,
    durationUs,
    captions: [...input.captions],
    design: {...input.design},
    scenes: input.scenes.map((x) => ({...x})),
    contentCandidates: input.contentCandidates.map((x) => ({...x})),
    motionContexts: input.motionContexts.map((x) => ({...x})),
    approvedStylePresets: [...(input.approvedStylePresets ?? [])],
    approvedMotionPresets: [...(input.approvedMotionPresets ?? [])],
    previewStylePreset: input.previewStylePreset ?? null,
    previewMotionPreset: input.previewMotionPreset ?? null
  };
};
