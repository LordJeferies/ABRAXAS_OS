import {z} from "zod";

export const ProviderStateSchema = z.object({
  generatedAt: z.string(),
  platform: z.string(),
  arch: z.string(),
  whisperCpp: z.object({
    available: z.boolean(),
    executable: z.string().nullable(),
    model: z.object({
      id: z.literal("large-v3-turbo"),
      label: z.literal("Large V3 Turbo FULL"),
      path: z.string(),
      installed: z.boolean()
    })
  }),
  mlx: z.object({
    supported: z.boolean(),
    available: z.boolean(),
    reason: z.string().nullable(),
    executable: z.string().nullable(),
    models: z.array(z.object({
      id: z.enum(["large-v3-turbo", "large-v3"]),
      label: z.string(),
      path: z.string(),
      installed: z.boolean()
    }))
  })
});

export type ProviderState = z.infer<typeof ProviderStateSchema>;

export type TranscriptionWord = Readonly<{
  id: string;
  text: string;
  startUs: number;
  endUs: number;
  confidence: number | null;
}>;

export type TranscriptionResult = Readonly<{
  providerId: "whisper-cpp" | "mlx-whisper";
  modelId: "large-v3-turbo" | "large-v3";
  words: readonly TranscriptionWord[];
}>;

export interface TranscriptionProvider {
  readonly id: "whisper-cpp" | "mlx-whisper";
  readonly available: boolean;
  transcribe(audioPath: string): Promise<TranscriptionResult>;
}

export const DEFAULT_PROVIDER_ID = "whisper-cpp" as const;
export const DEFAULT_MODEL_ID = "large-v3-turbo" as const;

export const isMlxSupportedPlatform = (platform: string, arch: string): boolean =>
  platform === "darwin" && arch === "arm64";
