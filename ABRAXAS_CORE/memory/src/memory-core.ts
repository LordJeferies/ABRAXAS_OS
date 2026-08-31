/**
 * ABRAXAS Persistent SQLite Memory Core
 * Autobiographical, Semantic, Telemetry & Architectural Persistence.
 */

import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs";

export type MemoryCategory = "EPISODIC" | "SEMANTIC" | "TELEMETRY" | "ARCHITECTURAL";

export interface MemoryRecord {
  memoryId: string;
  category: MemoryCategory;
  topic: string;
  summary: string;
  detailsJson: string;
  details?: Record<string, unknown>;
  importance: number;
  tagsJson: string;
  tags?: string[];
  createdAt: string;
}

export type MemoryEvent = MemoryRecord;

export class SqliteMemoryCore {
  private readonly db: DatabaseSync;

  constructor(dbPath: string = ":memory:") {
    if (dbPath !== ":memory:") {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    this.db = new DatabaseSync(dbPath);
    this.initSchema();
  }

  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS episodic_memory (
        memory_id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        summary TEXT NOT NULL,
        details_json TEXT,
        importance REAL,
        tags_json TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS semantic_index (
        term TEXT PRIMARY KEY,
        definition TEXT NOT NULL,
        embedding_stub TEXT,
        associated_topics TEXT,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS telemetry_database (
        telemetry_id TEXT PRIMARY KEY,
        content_id TEXT NOT NULL,
        hook_type TEXT NOT NULL,
        views INTEGER,
        watch_percentage REAL,
        conversion_rate REAL,
        recorded_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS architectural_evolution (
        event_id TEXT PRIMARY KEY,
        phase TEXT NOT NULL,
        description TEXT NOT NULL,
        verdict TEXT NOT NULL,
        recorded_at TEXT NOT NULL
      );
    `);
  }

  public record(
    category: MemoryCategory,
    topic: string,
    summary: string,
    details: Record<string, unknown> = {},
    importance = 0.5,
    tags: string[] = []
  ): MemoryRecord {
    return this.recordEpisodic(topic, summary, details, importance, tags);
  }

  public recordEpisodic(
    topic: string,
    summary: string,
    details: Record<string, unknown> = {},
    importance = 0.5,
    tags: string[] = []
  ): MemoryRecord {
    const memoryId = `mem_ep_${randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();
    const detailsJson = JSON.stringify(details);
    const tagsJson = JSON.stringify(tags);

    const stmt = this.db.prepare(`
      INSERT INTO episodic_memory (memory_id, topic, summary, details_json, importance, tags_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(memoryId, topic, summary, detailsJson, importance, tagsJson, now);

    return {
      memoryId,
      category: "EPISODIC",
      topic,
      summary,
      detailsJson,
      details,
      importance,
      tagsJson,
      tags,
      createdAt: now
    };
  }

  public recordSemantic(term: string, definition: string, topics: string[] = []): void {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO semantic_index (term, definition, embedding_stub, associated_topics, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(term, definition, "STUB_EMBEDDING_V1", JSON.stringify(topics), now);
  }

  public recordTelemetry(
    contentId: string,
    hookType: string,
    views: number,
    watchPercentage: number,
    conversionRate: number
  ): void {
    const telemetryId = `tel_${randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO telemetry_database (telemetry_id, content_id, hook_type, views, watch_percentage, conversion_rate, recorded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(telemetryId, contentId, hookType, views, watchPercentage, conversionRate, now);
  }

  public recordArchitecturalEvolution(phase: string, description: string, verdict: string): void {
    const eventId = `arch_evo_${randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO architectural_evolution (event_id, phase, description, verdict, recorded_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(eventId, phase, description, verdict, now);
  }

  public query(filter: { category?: MemoryCategory; minImportance?: number; tag?: string }): MemoryRecord[] {
    const records = this.queryEpisodic(filter.minImportance ?? 0.0);
    return records.filter((m) => {
      if (filter.tag && (!m.tags || !m.tags.includes(filter.tag))) return false;
      return true;
    });
  }

  public getAll(): MemoryRecord[] {
    return this.queryEpisodic(0.0);
  }

  public queryEpisodic(minImportance = 0.0): MemoryRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM episodic_memory WHERE importance >= ? ORDER BY created_at DESC
    `);
    const rows = stmt.all(minImportance) as any[];
    return rows.map((r) => {
      let details: Record<string, unknown> = {};
      let tags: string[] = [];
      try { details = JSON.parse(r.details_json); } catch (e) {}
      try { tags = JSON.parse(r.tags_json); } catch (e) {}

      return {
        memoryId: r.memory_id,
        category: "EPISODIC",
        topic: r.topic,
        summary: r.summary,
        detailsJson: r.details_json,
        details,
        importance: r.importance,
        tagsJson: r.tags_json,
        tags,
        createdAt: r.created_at
      };
    });
  }

  public close(): void {
    this.db.close();
  }
}

export const MemoryCore = SqliteMemoryCore;
