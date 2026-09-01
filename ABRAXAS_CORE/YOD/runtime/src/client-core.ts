/**
 * ClientCore Service & Store
 */

import { randomUUID } from "node:crypto";
import { ClientCore } from "./types.js";

export class ClientCoreService {
  private clients = new Map<string, ClientCore>();

  public async createClient(input: {
    clientId?: string | undefined;
    name: string;
    pillars: string[];
    claims: string[];
    brandVoice: string;
    targetAudiences: string[];
    actorId: string;
  }): Promise<ClientCore> {
    const clientId = input.clientId ?? `client_${randomUUID().slice(0, 8)}`;
    if (this.clients.has(clientId)) {
      throw new Error(`Client "${clientId}" already exists`);
    }

    const now = new Date().toISOString();
    const client: ClientCore = {
      clientId,
      name: input.name,
      pillars: [...input.pillars],
      claims: [...input.claims],
      brandVoice: input.brandVoice,
      targetAudiences: [...input.targetAudiences],
      version: 1,
      createdAt: now,
      createdBy: input.actorId,
      updatedAt: now,
      updatedBy: input.actorId
    };

    this.clients.set(clientId, client);
    return client;
  }

  public async getClient(clientId: string): Promise<ClientCore> {
    const c = this.clients.get(clientId);
    if (!c) throw new Error(`Client not found: "${clientId}"`);
    return c;
  }

  public async updateClient(input: {
    clientId: string;
    expectedVersion: number;
    name?: string | undefined;
    pillars?: string[] | undefined;
    claims?: string[] | undefined;
    brandVoice?: string | undefined;
    targetAudiences?: string[] | undefined;
    actorId: string;
  }): Promise<ClientCore> {
    const existing = await this.getClient(input.clientId);
    if (existing.version !== input.expectedVersion) {
      throw new Error(
        `Client version conflict: expected ${input.expectedVersion}, got ${existing.version}`
      );
    }

    const now = new Date().toISOString();
    const updated: ClientCore = {
      ...existing,
      name: input.name ?? existing.name,
      pillars: input.pillars ? [...input.pillars] : existing.pillars,
      claims: input.claims ? [...input.claims] : existing.claims,
      brandVoice: input.brandVoice ?? existing.brandVoice,
      targetAudiences: input.targetAudiences ? [...input.targetAudiences] : existing.targetAudiences,
      version: existing.version + 1,
      updatedAt: now,
      updatedBy: input.actorId
    };

    this.clients.set(input.clientId, updated);
    return updated;
  }

  public async listClients(): Promise<ClientCore[]> {
    return Array.from(this.clients.values());
  }
}
