import { describe, it, expect } from "vitest";
import { ClientCoreService } from "../../../YOD/runtime/src/client-core.js";
import { createLienzoService } from "../../../LIENZO/src/service.js";
import { EventLedger } from "../../../backbone/src/event-ledger.js";
import {
  HeOperationsLienzoAdapter,
  HeUserContext,
  HeLienzoPermissionError
} from "../runtime/he-yod-lienzo-bridge.js";

describe("He ↔ YOD ↔ Lienzo Product Integration & RBAC Projections", () => {
  it("allows switching between multiple clients dynamically in a single He runtime projection", async () => {
    const clientService = new ClientCoreService();
    const lienzoService = createLienzoService();
    const adapter = new HeOperationsLienzoAdapter(clientService, lienzoService);

    await clientService.createClient({
      clientId: "client_alpha",
      name: "Alpha Dynamics",
      pillars: ["Robotics"],
      claims: ["Autonomous"],
      brandVoice: "Sharp",
      targetAudiences: ["Engineers"],
      actorId: "admin"
    });

    await clientService.createClient({
      clientId: "client_beta",
      name: "Beta Bio",
      pillars: ["Genomics"],
      claims: ["Precision"],
      brandVoice: "Calm",
      targetAudiences: ["Researchers"],
      actorId: "admin"
    });

    const clients = await adapter.getClientsProjection();
    expect(clients.length).toBe(2);
    expect(clients.map((c) => c.clientId)).toEqual(["client_alpha", "client_beta"]);
  });

  it("enforces RBAC permissions on Lienzo mutations initiated from He Operations", async () => {
    const clientService = new ClientCoreService();
    const lienzoService = createLienzoService();
    const eventLedger = new EventLedger();
    const adapter = new HeOperationsLienzoAdapter(clientService, lienzoService, eventLedger);

    const { lienzo } = await lienzoService.createLienzo({
      contentId: "content_rbac_01",
      title: "RBAC Security Test",
      actorId: "producer_alice",
      reason: "Init"
    });

    await lienzoService.createComponent({
      contentId: "content_rbac_01",
      expectedRevision: 1,
      actorId: "producer_alice",
      reason: "Add hook",
      componentId: "comp_hook",
      section: "CONTENT",
      layer: "CORE",
      status: "DRAFT",
      data: { text: "Original" }
    });

    const viewerUser: HeUserContext = { userId: "user_viewer", role: "VIEWER" };
    const editorUser: HeUserContext = { userId: "user_editor", role: "EDITOR" };

    // Viewer attempting edit -> must fail closed with permission error
    await expect(
      adapter.updateLienzoComponentFromHe(viewerUser, {
        contentId: "content_rbac_01",
        componentId: "comp_hook",
        expectedRevision: 2,
        reason: "Unauthorized edit attempt",
        data: { text: "Hacked" }
      })
    ).rejects.toThrow(HeLienzoPermissionError);

    // Editor executing valid edit -> succeeds and logs event to backbone ledger
    const res = await adapter.updateLienzoComponentFromHe(editorUser, {
      contentId: "content_rbac_01",
      componentId: "comp_hook",
      expectedRevision: 2,
      reason: "Authorized editorial update",
      data: { text: "Polished Hook Text" }
    });

    expect(res.component.data["text"]).toBe("Polished Hook Text");
    expect(res.component.version).toBe(2);

    const events = await eventLedger.query({ contentId: "content_rbac_01" });
    expect(events.length).toBe(1);
    expect(events[0]?.eventType).toBe("HE_LIENZO_MUTATED");
  });
});
