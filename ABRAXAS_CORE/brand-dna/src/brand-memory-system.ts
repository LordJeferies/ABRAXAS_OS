/**
 * ABRAXAS Brand DNA Memory System V9.0
 * Stores and learns brand identity, color palettes, voice guidelines, audience archetypes, and campaign history.
 */

import { SqliteMemoryCore } from "../../memory/src/memory-core.js";

export interface BrandDNA {
  brandId: string;
  name: string;
  voiceTone: string;
  primaryColors: string[];
  targetAudience: string;
  visualReferences: string[];
  previousCampaignsCount: number;
  averageHookRetention: number;
  updatedAt: string;
}

export class BrandMemorySystem {
  private readonly memory: SqliteMemoryCore;

  constructor(dbPath = ":memory:") {
    this.memory = new SqliteMemoryCore(dbPath);
  }

  public registerBrandDNA(dna: BrandDNA): void {
    this.memory.recordEpisodic(
      `Brand DNA: ${dna.name}`,
      `Voice: ${dna.voiceTone} | Audience: ${dna.targetAudience}`,
      dna,
      0.95,
      ["brand_dna", dna.brandId, dna.name.toLowerCase()]
    );
  }

  public getBrandDNA(brandId: string): BrandDNA | undefined {
    const episodes = this.memory.queryEpisodic(0.0);
    const match = episodes.find((e) => e.details?.brandId === brandId);
    return match?.details as BrandDNA | undefined;
  }

  public listBrands(): BrandDNA[] {
    const episodes = this.memory.queryEpisodic(0.0);
    return episodes
      .filter((e) => e.tags?.includes("brand_dna"))
      .map((e) => e.details as BrandDNA);
  }
}
