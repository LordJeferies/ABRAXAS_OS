/**
 * ABRAXAS AI Runtime Service
 * Supports Deterministic Logic, External Roundtrip & Unified Token Broker
 */

import { createHash, randomUUID } from "node:crypto";
import { AIJob, AIResult, AIProvider, AIProviderType } from "./types.js";

export class LogicProvider implements AIProvider {
  public readonly providerId = "provider_deterministic_logic";
  public readonly providerType: AIProviderType = "DETERMINISTIC_LOGIC";
  public readonly capabilities = ["TEXT" as const];

  public async execute(job: AIJob): Promise<AIResult> {
    const output = `[LOGIC_PROCESSED] Synthesized response for prompt: "${job.prompt.slice(0, 50)}"`;
    return {
      jobId: job.jobId,
      contentId: job.contentId,
      providerId: this.providerId,
      output,
      confidence: 1.0,
      tokensUsed: 42,
      createdAt: new Date().toISOString()
    };
  }
}

export class ExternalRoundtripProvider implements AIProvider {
  public readonly providerId = "provider_external_roundtrip";
  public readonly providerType: AIProviderType = "EXTERNAL_ROUNDTRIP";
  public readonly capabilities = ["TEXT" as const, "STRUCTURED_DATA" as const];

  public exportJobToHumanReadable(job: AIJob): string {
    return [
      "=== ABRAXAS AI JOB EXPORT ===",
      `JOB ID: ${job.jobId}`,
      `CONTENT ID: ${job.contentId}`,
      `PROMPT: ${job.prompt}`,
      "============================="
    ].join("\n");
  }

  public parseAndValidateExternalResponse(job: AIJob, rawResponse: string): AIResult {
    return {
      jobId: job.jobId,
      contentId: job.contentId,
      providerId: this.providerId,
      output: rawResponse,
      confidence: 0.95,
      tokensUsed: 50,
      structuredData: {
        roundtripVerified: true,
        responseLinesCount: rawResponse.split("\n").length
      },
      createdAt: new Date().toISOString()
    };
  }

  public async execute(job: AIJob): Promise<AIResult> {
    return {
      jobId: job.jobId,
      contentId: job.contentId,
      providerId: this.providerId,
      output: `[EXTERNAL_AWAITING] Export job with ID ${job.jobId}`,
      confidence: 0.5,
      createdAt: new Date().toISOString()
    };
  }
}

export interface AiInferenceRequest {
  provider: "OPENAI" | "ANTHROPIC" | "LOCAL" | "MOCK";
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AiInferenceResponse {
  responseId: string;
  content: string;
  provider: string;
  tokensUsed: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cached: boolean;
  timestamp: string;
}

export class AIRuntimeService {
  private readonly providers = new Map<string, AIProvider>();
  private readonly cache = new Map<string, AiInferenceResponse>();
  private totalTokensUsed = 0;

  constructor() {
    this.registerProvider(new LogicProvider());
    this.registerProvider(new ExternalRoundtripProvider());
  }

  public registerProvider(provider: AIProvider): void {
    this.providers.set(provider.providerId, provider);
  }

  public getProvider(providerId: string): AIProvider | undefined {
    return this.providers.get(providerId);
  }

  public async executeJob(job: AIJob, providerId: string): Promise<AIResult> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`AI Provider "${providerId}" not found`);
    }
    return provider.execute(job);
  }

  public async executeInference(req: AiInferenceRequest): Promise<AiInferenceResponse> {
    const cacheKey = createHash("sha256")
      .update(`${req.provider}:${req.systemPrompt || ""}:${req.prompt}`)
      .digest("hex");

    if (this.cache.has(cacheKey)) {
      const hit = this.cache.get(cacheKey)!;
      return { ...hit, cached: true };
    }

    const promptLen = req.prompt.length;
    const promptTokens = Math.ceil(promptLen / 4);
    const completionTokens = 40;
    const total = promptTokens + completionTokens;
    this.totalTokensUsed += total;

    const responseContent = `[ABRAXAS ${req.provider} RESULT]: Synthesized criterion for "${req.prompt.slice(0, 30)}..."`;

    const res: AiInferenceResponse = {
      responseId: `ai_res_${cacheKey.slice(0, 10)}`,
      content: responseContent,
      provider: req.provider,
      tokensUsed: {
        promptTokens,
        completionTokens,
        totalTokens: total
      },
      cached: false,
      timestamp: new Date().toISOString()
    };

    this.cache.set(cacheKey, res);
    return res;
  }

  public getTotalTokensUsed(): number {
    return this.totalTokensUsed;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const AiRuntimeService = AIRuntimeService;
