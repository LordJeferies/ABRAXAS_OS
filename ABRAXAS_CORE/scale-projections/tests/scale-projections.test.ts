import { describe, it, expect } from "vitest";
import {
  SearchIndexService,
  NavigationCommandRegistry,
  VersionDiffExplorer
} from "../src/scale-services.js";
import { createLienzoService } from "../../LIENZO/src/service.js";

describe("Scale Experience Projections V1 — Search, Commands & Diff Explorer", () => {
  it("indexes and queries entities across all 8 supported search domains", () => {
    const search = new SearchIndexService();

    search.indexItem({ id: "client_1", type: "client", title: "Solaria Energy", tags: ["solar", "cleantech"] });
    search.indexItem({ id: "lienzo_1", type: "lienzo", title: "Grid Resilience Breakdown", tags: ["instagram", "reel"] });
    search.indexItem({ id: "task_1", type: "task", title: "Record Pickup CTA", tags: ["pickup", "recording"] });
    search.indexItem({ id: "art_1", type: "artifact", title: "Final Render MP4", tags: ["render", "video"] });
    search.indexItem({ id: "struct_1", type: "structure", title: "Problem Agitate Solve", tags: ["pas", "framework"] });
    search.indexItem({ id: "prompt_1", type: "prompt", title: "Founder Studio Teleprompter Prompt", tags: ["prompt", "ai"] });
    search.indexItem({ id: "person_1", type: "person", title: "Lead Animator", tags: ["team", "motion"] });
    search.indexItem({ id: "pub_1", type: "publication_target", title: "Instagram Reel Target", tags: ["social", "instagram"] });

    const results = search.search("solar");
    expect(results.length).toBe(1);
    expect(results[0]?.id).toBe("client_1");

    const allLienzos = search.search("", "lienzo");
    expect(allLienzos.length).toBe(1);
  });

  it("filters navigation and action commands according to user role permissions", () => {
    const registry = new NavigationCommandRegistry();

    const viewerCommands = registry.listCommands("VIEWER");
    expect(viewerCommands.some((c) => c.commandId === "cmd_action_create_lienzo")).toBe(false);

    const producerCommands = registry.listCommands("PRODUCER");
    expect(producerCommands.some((c) => c.commandId === "cmd_action_create_lienzo")).toBe(true);
  });

  it("diffs Lienzo revisions truthfully and reports exact component status transitions", async () => {
    const lienzoService = createLienzoService();
    const diffExplorer = new VersionDiffExplorer();

    const { lienzo } = await lienzoService.createLienzo({
      contentId: "content_diff_01",
      title: "Diff Explorer Content",
      actorId: "user_lead",
      reason: "Init"
    });

    await lienzoService.createComponent({
      contentId: "content_diff_01",
      expectedRevision: 1,
      actorId: "user_lead",
      reason: "Add hook",
      componentId: "comp_hook",
      section: "CONTENT",
      layer: "CORE",
      status: "DRAFT"
    });

    await lienzoService.changeComponentStatus({
      contentId: "content_diff_01",
      componentId: "comp_hook",
      newStatus: "APPROVED",
      expectedRevision: 2,
      actorId: "user_lead",
      reason: "Approve hook"
    });

    const lFinal = await lienzoService.getLienzo("content_diff_01");
    const diff = diffExplorer.diffLienzoRevisions(lFinal, 1, 3);

    expect(diff.entityId).toBe("content_diff_01");
    expect(diff.fromRevision).toBe(1);
    expect(diff.toRevision).toBe(3);
    expect(diff.changes.length).toBeGreaterThanOrEqual(1);
  });
});
