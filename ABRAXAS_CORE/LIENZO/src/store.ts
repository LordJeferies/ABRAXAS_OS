/**
 * ABRAXAS Lienzo Storage Engine
 * Provides MemoryLienzoStore and atomic JsonFileLienzoStore with store-level CAS and exclusive file locking.
 */

import fs from "node:fs";
import path from "node:path";
import { randomUUID, createHash } from "node:crypto";
import { Lienzo } from "./types.js";
import { validateLienzoState } from "./validator.js";
import {
  LienzoPersistenceError,
  LienzoNotFoundError,
  LienzoRevisionConflictError,
  LienzoValidationError
} from "./errors.js";

export interface ILienzoStore {
  createInitial(lienzo: Lienzo): Promise<void>;
  commit(contentId: string, expectedRevision: number, nextLienzo: Lienzo): Promise<void>;
  load(contentId: string): Promise<Lienzo | null>;
  list(): Promise<Lienzo[]>;
  exists(contentId: string): Promise<boolean>;
}

export class MemoryLienzoStore implements ILienzoStore {
  private store = new Map<string, string>();

  public async createInitial(lienzo: Lienzo): Promise<void> {
    validateLienzoState(lienzo);
    if (this.store.has(lienzo.contentId)) {
      throw new LienzoValidationError(`Lienzo contentId "${lienzo.contentId}" already exists`, "contentId");
    }
    this.store.set(lienzo.contentId, JSON.stringify(lienzo));
  }

  public async commit(contentId: string, expectedRevision: number, nextLienzo: Lienzo): Promise<void> {
    validateLienzoState(nextLienzo);
    const raw = this.store.get(contentId);
    if (!raw) {
      throw new LienzoNotFoundError(contentId);
    }
    const current: Lienzo = JSON.parse(raw);
    if (current.revision !== expectedRevision) {
      throw new LienzoRevisionConflictError(contentId, expectedRevision, current.revision);
    }
    this.store.set(contentId, JSON.stringify(nextLienzo));
  }

  public async load(contentId: string): Promise<Lienzo | null> {
    const raw = this.store.get(contentId);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      validateLienzoState(parsed);
      return parsed;
    } catch (err) {
      throw new LienzoPersistenceError(`Corrupt data in memory store for "${contentId}"`, err);
    }
  }

  public async list(): Promise<Lienzo[]> {
    const results: Lienzo[] = [];
    for (const raw of this.store.values()) {
      const parsed = JSON.parse(raw);
      validateLienzoState(parsed);
      results.push(parsed);
    }
    return results;
  }

  public async exists(contentId: string): Promise<boolean> {
    return this.store.has(contentId);
  }
}

export class JsonFileLienzoStore implements ILienzoStore {
  private readonly storageDir: string;

  constructor(storageDir: string) {
    this.storageDir = storageDir;
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  private getContentKey(contentId: string): string {
    return createHash("sha256").update(contentId).digest("hex");
  }

  private getFilePath(contentId: string): string {
    const key = this.getContentKey(contentId);
    return path.join(this.storageDir, `${key}.lienzo.json`);
  }

  private getLockPath(contentId: string): string {
    const key = this.getContentKey(contentId);
    return path.join(this.storageDir, `${key}.lock`);
  }

  private async acquireLock(contentId: string): Promise<() => void> {
    const lockPath = this.getLockPath(contentId);
    const maxAttempts = 100;
    const retryDelayMs = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const fd = fs.openSync(lockPath, "wx");
        return () => {
          try {
            fs.closeSync(fd);
          } catch {
            // ignore
          }
          try {
            if (fs.existsSync(lockPath)) {
              fs.unlinkSync(lockPath);
            }
          } catch {
            // ignore
          }
        };
      } catch (err: any) {
        if (err.code === "EEXIST") {
          // Lock is held by another worker/instance; back off and retry
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
          continue;
        }
        throw new LienzoPersistenceError(`Failed to acquire lock for ${contentId}`, err);
      }
    }

    throw new LienzoPersistenceError(
      `Timeout waiting for exclusive lock on Lienzo "${contentId}" after ${maxAttempts * retryDelayMs}ms`
    );
  }

  public async createInitial(lienzo: Lienzo): Promise<void> {
    validateLienzoState(lienzo);
    const releaseLock = await this.acquireLock(lienzo.contentId);
    const key = this.getContentKey(lienzo.contentId);
    const filePath = this.getFilePath(lienzo.contentId);
    const tmpPath = path.join(this.storageDir, `.${key}.${randomUUID()}.tmp`);

    try {
      if (fs.existsSync(filePath)) {
        throw new LienzoValidationError(`Lienzo contentId "${lienzo.contentId}" already exists`, "contentId");
      }
      const serialized = JSON.stringify(lienzo, null, 2);
      fs.writeFileSync(tmpPath, serialized, "utf-8");
      fs.renameSync(tmpPath, filePath);
    } catch (err) {
      if (fs.existsSync(tmpPath)) {
        try {
          fs.unlinkSync(tmpPath);
        } catch {
          // ignore
        }
      }
      if (err instanceof LienzoValidationError) {
        throw err;
      }
      throw new LienzoPersistenceError(`Failed to create initial Lienzo "${lienzo.contentId}"`, err);
    } finally {
      releaseLock();
    }
  }

  public async commit(contentId: string, expectedRevision: number, nextLienzo: Lienzo): Promise<void> {
    validateLienzoState(nextLienzo);
    if (nextLienzo.contentId !== contentId) {
      throw new LienzoValidationError(
        `Payload contentId "${nextLienzo.contentId}" does not match commit target "${contentId}"`
      );
    }

    const releaseLock = await this.acquireLock(contentId);
    const key = this.getContentKey(contentId);
    const filePath = this.getFilePath(contentId);
    const tmpPath = path.join(this.storageDir, `.${key}.${randomUUID()}.tmp`);

    try {
      if (!fs.existsSync(filePath)) {
        throw new LienzoNotFoundError(contentId);
      }

      const raw = fs.readFileSync(filePath, "utf-8");
      let current: Lienzo;
      try {
        current = JSON.parse(raw);
        validateLienzoState(current);
      } catch (err) {
        throw new LienzoPersistenceError(`Corrupt disk state during commit for "${contentId}"`, err);
      }

      if (current.revision !== expectedRevision) {
        throw new LienzoRevisionConflictError(contentId, expectedRevision, current.revision);
      }

      const serialized = JSON.stringify(nextLienzo, null, 2);
      fs.writeFileSync(tmpPath, serialized, "utf-8");
      fs.renameSync(tmpPath, filePath);
    } catch (err) {
      if (fs.existsSync(tmpPath)) {
        try {
          fs.unlinkSync(tmpPath);
        } catch {
          // ignore
        }
      }
      if (err instanceof LienzoRevisionConflictError || err instanceof LienzoNotFoundError || err instanceof LienzoValidationError) {
        throw err;
      }
      throw new LienzoPersistenceError(`Failed to commit revision for Lienzo "${contentId}"`, err);
    } finally {
      releaseLock();
    }
  }

  public async load(contentId: string): Promise<Lienzo | null> {
    const filePath = this.getFilePath(contentId);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    let raw: string;
    try {
      raw = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      throw new LienzoPersistenceError(`Failed to read Lienzo file at ${filePath}`, err);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new LienzoPersistenceError(`Corrupt JSON in Lienzo file at ${filePath}`, err);
    }

    if (parsed && typeof parsed === "object" && parsed.contentId !== contentId) {
      throw new LienzoPersistenceError(
        `Lienzo contentId mismatch in file: expected "${contentId}", found "${parsed.contentId}"`
      );
    }

    validateLienzoState(parsed);
    return parsed;
  }

  public async list(): Promise<Lienzo[]> {
    const files = fs.readdirSync(this.storageDir).filter((f) => f.endsWith(".lienzo.json"));
    const results: Lienzo[] = [];

    for (const f of files) {
      const fullPath = path.join(this.storageDir, f);
      try {
        const raw = fs.readFileSync(fullPath, "utf-8");
        const parsed = JSON.parse(raw);
        validateLienzoState(parsed);
        results.push(parsed);
      } catch (err) {
        throw new LienzoPersistenceError(`Failed to load Lienzo file ${fullPath}`, err);
      }
    }

    return results;
  }

  public async exists(contentId: string): Promise<boolean> {
    const filePath = this.getFilePath(contentId);
    return fs.existsSync(filePath);
  }
}
