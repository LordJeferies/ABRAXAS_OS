/**
 * HE ↔ YOD ↔ LIENZO Bridge & RBAC Projections
 */

import { ClientCoreService } from "../../../YOD/runtime/src/client-core.js";
import { ClientCore } from "../../../YOD/runtime/src/types.js";
import { LienzoService } from "../../../LIENZO/src/service.js";
import { Lienzo, LienzoComponent, LienzoComponentStatus } from "../../../LIENZO/src/types.js";
import { EventLedger } from "../../../backbone/src/event-ledger.js";

export type HeRole = "OWNER" | "PRODUCER" | "EDITOR" | "VIEWER";

export interface HeUserContext {
  userId: string;
  role: HeRole;
}

export class HeLienzoPermissionError extends Error {
  constructor(action: string, role: HeRole) {
    super(`Role "${role}" does not have permission to execute action: "${action}"`);
    this.name = "HeLienzoPermissionError";
  }
}

export function checkHePermission(user: HeUserContext, action: "lienzo.view" | "lienzo.edit" | "lienzo.approve"): void {
  if (action === "lienzo.view") {
    return; // All roles can view
  }
  if (action === "lienzo.edit") {
    if (user.role === "VIEWER") {
      throw new HeLienzoPermissionError(action, user.role);
    }
    return;
  }
  if (action === "lienzo.approve") {
    if (user.role !== "OWNER" && user.role !== "PRODUCER") {
      throw new HeLienzoPermissionError(action, user.role);
    }
    return;
  }
}

export interface HeLienzoSummaryView {
  contentId: string;
  title: string;
  revision: number;
  lifecycle: string;
  totalComponents: number;
  outOfSyncCount: number;
  approvedCount: number;
  updatedAt: string;
}

export class HeOperationsLienzoAdapter {
  constructor(
    public readonly clientService: ClientCoreService,
    public readonly lienzoService: LienzoService,
    public readonly eventLedger?: EventLedger
  ) {}

  public async getClientsProjection(): Promise<ClientCore[]> {
    return this.clientService.listClients();
  }

  public async getLienzosProjection(user: HeUserContext): Promise<HeLienzoSummaryView[]> {
    checkHePermission(user, "lienzo.view");
    const lienzos = await this.lienzoService.listLienzos();
    return lienzos.map((l) => ({
      contentId: l.contentId,
      title: l.title,
      revision: l.revision,
      lifecycle: l.lifecycle,
      totalComponents: l.components.length,
      outOfSyncCount: l.components.filter((c) => c.status === "OUT_OF_SYNC").length,
      approvedCount: l.components.filter((c) => c.status === "APPROVED").length,
      updatedAt: l.updatedAt
    }));
  }

  public async getLienzoDetailProjection(user: HeUserContext, contentId: string): Promise<Lienzo> {
    checkHePermission(user, "lienzo.view");
    return this.lienzoService.getLienzo(contentId);
  }

  public async updateLienzoComponentFromHe(
    user: HeUserContext,
    input: {
      contentId: string;
      componentId: string;
      expectedRevision: number;
      reason: string;
      data?: Record<string, unknown>;
      status?: LienzoComponentStatus;
    }
  ): Promise<{ lienzo: Lienzo; component: LienzoComponent }> {
    checkHePermission(user, "lienzo.edit");
    if (input.status === "APPROVED") {
      checkHePermission(user, "lienzo.approve");
    }

    const res = await this.lienzoService.updateComponent({
      contentId: input.contentId,
      componentId: input.componentId,
      expectedRevision: input.expectedRevision,
      actorId: user.userId,
      reason: `[HE-OP] ${input.reason}`,
      data: input.data,
      status: input.status
    });

    if (this.eventLedger) {
      await this.eventLedger.append({
        eventType: "HE_LIENZO_MUTATED",
        contentId: input.contentId,
        componentId: input.componentId,
        actorId: user.userId,
        reason: input.reason,
        newVersion: res.component.version
      });
    }

    return { lienzo: res.lienzo, component: res.component };
  }
}
