import {z} from "zod";

export const VavActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("setTranscriptionProvider"),
    providerId: z.enum(["whisper-cpp", "mlx-whisper"]),
    modelId: z.string().min(1)
  }),
  z.object({
    type: z.literal("correctWord"),
    wordId: z.string().min(1),
    replacement: z.string()
  }),
  z.object({
    type: z.literal("setEmphasis"),
    wordId: z.string().min(1),
    role: z.enum(["NORMAL", "SECONDARY", "PRIMARY", "HERO"])
  }),
  z.object({
    type: z.literal("setPlacement"),
    visualSegmentId: z.string().min(1),
    placement: z.string().min(1)
  }),
  z.object({
    type: z.literal("splitCaption"),
    captionId: z.string().min(1),
    atWordId: z.string().min(1)
  }),
  z.object({
    type: z.literal("joinCaptions"),
    captionIds: z.array(z.string().min(1)).min(2)
  }),
  z.object({
    type: z.literal("lockField"),
    targetId: z.string().min(1),
    field: z.enum(["text", "timing", "position", "size", "style", "motion"])
  }),
  z.object({
    type: z.literal("unlockField"),
    targetId: z.string().min(1),
    field: z.enum(["text", "timing", "position", "size", "style", "motion"])
  }),
  z.object({
    type: z.literal("addMarker"),
    markerId: z.string().min(1),
    timeUs: z.number().int().nonnegative(),
    label: z.string()
  })
]);

export type VavAction = z.infer<typeof VavActionSchema>;
