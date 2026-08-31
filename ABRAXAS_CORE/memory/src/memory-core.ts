/**
 * ABRAXAS Memory Core
 * Stratigraphic autobiographical & operational cortex for ABRAXAS OS.
 */

import { randomUUID } from "node:crypto";

export type MemoryCategory = "EPISODIC" | "SEMANTIC" | "TELEMETRY" | "ARCHITECTURAL";

export interface MemoryEvent {
  memoryId: string;
  category: MemoryCategory;
  topic: string;
  summary: string;
  details: Record<string, unknown>;
  importance: number; // 0.0 to 1.0
  tags: string[];
  createdAt: string;
}

export class MemoryCore {
  private readonly memoryStore: MemoryEvent[] = [];

  public async record(
    category: MemoryCategory,
    topic: string,
    summary: string,
    details: Record<string, unknown> = {},
    importance = 0.5,
    tags: string[] = []
  ): Promise<MemoryEvent> {
    const event: MemoryEvent = {
      memoryId: `mem_${randomUUID().slice(0, 10)}`,
      category,
      topic,
      summary,
      details,
      importance: Math.min(1.0, Math.max(0.0, importance)),
      tags,
      createdAt: new Date().toISOString()
    };

    this.memoryStore.push(event);
    return event;
  }

  public query(filter: { category?: MemoryCategory; minImportance?: number; tag?: string }): MemoryEvent[] {
    return this.memoryStore.filter((m) => {
      if (filter.category && m.category !== filter.category) return false;
      if (filter.minImportance !== undefined && m.importance < filter.minImportance) return false;
      if (filter.tag && !m.tags.includes(filter.tag)) return false;
      return true;
    });
  }

  public getAll(): MemoryEvent[] {
    return [...this.memoryStore];
  }
}
