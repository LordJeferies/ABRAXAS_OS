/**
 * ABRAXAS Persistent Memory Module
 * Connects SQLite persistence with Neural Events and Semantic Indexing.
 */

import { SqliteMemoryCore, MemoryRecord } from "../../memory/src/memory-core.js";
import { SemanticVectorMemory } from "../../memory/src/semantic-vector-memory.js";

export class PersistentMemory {
  private readonly vectorMemory: SemanticVectorMemory;

  constructor(private readonly sqliteCore: SqliteMemoryCore = new SqliteMemoryCore(":memory:")) {
    this.vectorMemory = new SemanticVectorMemory();
  }

  public save(event: { content: string; type: string; details?: Record<string, unknown>; importance?: number; tags?: string[] }): MemoryRecord {
    const importance = event.importance ?? 0.5;
    const tags = event.tags ?? [];
    const details = event.details ?? {};

    // 1. Save to SQLite
    const record = this.sqliteCore.recordEpisodic(
      event.type,
      event.content,
      details,
      importance,
      tags
    );

    // 2. Index in Semantic Vector Memory
    this.vectorMemory.index(record.memoryId, `${event.type}: ${event.content}`, {
      memoryId: record.memoryId,
      importance
    });

    return record;
  }

  public search(query: string, topK = 5): Array<{ record?: MemoryRecord; text: string; similarity: number }> {
    const vectorHits = this.vectorMemory.search(query, topK);
    const sqliteRecords = this.sqliteCore.queryEpisodic(0.0);

    return vectorHits.map((hit) => {
      const match = sqliteRecords.find((r) => r.memoryId === hit.item.id);
      return {
        record: match,
        text: hit.item.text,
        similarity: hit.similarity
      };
    });
  }

  public getSqliteCore(): SqliteMemoryCore {
    return this.sqliteCore;
  }
}
