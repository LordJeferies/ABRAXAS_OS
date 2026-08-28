import {z} from "zod";

export const WordSchema = z.object({
  id: z.string().min(1),
  text: z.string(),
  startUs: z.number().int().nonnegative(),
  endUs: z.number().int().nonnegative(),
  confidence: z.number().min(0).max(1).nullable().default(null),
  speaker: z.string().nullable().default(null)
}).refine((word) => word.endUs >= word.startUs, {
  message: "endUs must be >= startUs"
});

export const VisualSegmentSchema = z.object({
  id: z.string().min(1),
  captionId: z.string().min(1),
  sceneId: z.string().min(1),
  startUs: z.number().int().nonnegative(),
  endUs: z.number().int().nonnegative(),
  placement: z.string(),
  sizeResolved: z.number().positive()
});

export const SemanticCaptionSchema = z.object({
  id: z.string().min(1),
  startUs: z.number().int().nonnegative(),
  endUs: z.number().int().nonnegative(),
  wordIds: z.array(z.string()),
  styleId: z.string(),
  structureId: z.string(),
  visualSegments: z.array(VisualSegmentSchema)
});

export const VavProjectSchema = z.object({
  schemaVersion: z.literal(1),
  projectId: z.string().min(1),
  words: z.array(WordSchema),
  captions: z.array(SemanticCaptionSchema)
});

export type Word = z.infer<typeof WordSchema>;
export type SemanticCaption = z.infer<typeof SemanticCaptionSchema>;
export type VavProject = z.infer<typeof VavProjectSchema>;
