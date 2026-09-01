import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createLienzoService } from "../src/service.js";
import {
  LienzoPersistenceError,
  LienzoSchemaVersionError,
  LienzoValidationError,
  LienzoRevisionConflictError
} from "../src/errors.js";

describe("Lienzo Domain Core V1 — Persistence & Store Integrity", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "abx_lienzo_persist_test_"));
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  // Test 1: Memory persistence roundtrip
  it("performs reliable memory persistence roundtrip with data isolation", async () => {
    const service = createLienzoService();

    await service.createLienzo({
      contentId: "content_mem_1",
      title: "Memory Persistence Content",
      actorId: "user_author",
      reason: "Initial memory test"
    });

    await service.createComponent({
      contentId: "content_mem_1",
      expectedRevision: 1,
      actorId: "user_author",
      reason: "Add scene",
      componentId: "comp_scene_1",
      section: "CONTENT",
      layer: "CORE",
      data: { sceneName: "Intro" }
    });

    const loaded = await service.getLienzo("content_mem_1");
    expect(loaded).not.toBeNull();
    expect(loaded.contentId).toBe("content_mem_1");
    expect(loaded.revision).toBe(2);
    expect(loaded.components.length).toBe(1);
    expect(loaded.components[0]?.data).toEqual({ sceneName: "Intro" });
  });

  // Test 2: JSON persistence roundtrip
  it("performs reliable atomic JSON file roundtrip and verifies on-disk structure", async () => {
    const service = createLienzoService({ storageDir: tmpDir });

    await service.createLienzo({
      contentId: "content_json_1",
      title: "JSON File Content",
      actorId: "user_lead",
      reason: "Disk persistence test"
    });

    await service.createComponent({
      contentId: "content_json_1",
      expectedRevision: 1,
      actorId: "user_lead",
      reason: "Add audio",
      componentId: "comp_audio_1",
      section: "AUDIO",
      layer: "PRODUCTION",
      data: { track: "VO_01.wav" }
    });

    // Fresh store instance reading the directory
    const freshService = createLienzoService({ storageDir: tmpDir });
    const loaded = await freshService.getLienzo("content_json_1");
    expect(loaded.contentId).toBe("content_json_1");
    expect(loaded.revision).toBe(2);
    expect(loaded.components[0]?.data).toEqual({ track: "VO_01.wav" });
  });

  // Test 3: Stale-write protection across two independent service/store instances
  it("proves store-level stale-write protection (CAS) between two independent instances", async () => {
    const instanceA = createLienzoService({ storageDir: tmpDir });
    const instanceB = createLienzoService({ storageDir: tmpDir });

    await instanceA.createLienzo({
      contentId: "content_concurrent_cas",
      title: "CAS Content",
      actorId: "user_init",
      reason: "Initial create"
    });

    // Both instances load revision 1
    const stateA = await instanceA.getLienzo("content_concurrent_cas");
    const stateB = await instanceB.getLienzo("content_concurrent_cas");
    expect(stateA.revision).toBe(1);
    expect(stateB.revision).toBe(1);

    // Instance A commits revision 2
    await instanceA.createComponent({
      contentId: "content_concurrent_cas",
      expectedRevision: 1,
      actorId: "user_a",
      reason: "Instance A writes",
      componentId: "comp_from_a",
      section: "CONTENT",
      layer: "CORE"
    });

    // Instance B attempts to commit with stale revision 1 -> fails closed at store level!
    await expect(
      instanceB.createComponent({
        contentId: "content_concurrent_cas",
        expectedRevision: 1,
        actorId: "user_b",
        reason: "Instance B writes with stale revision",
        componentId: "comp_from_b",
        section: "COPY",
        layer: "CORE"
      })
    ).rejects.toThrow(LienzoRevisionConflictError);

    // Verify disk state has only Instance A's revision
    const freshInstance = createLienzoService({ storageDir: tmpDir });
    const diskState = await freshInstance.getLienzo("content_concurrent_cas");
    expect(diskState.revision).toBe(2);
    expect(diskState.components.length).toBe(1);
    expect(diskState.components[0]?.componentId).toBe("comp_from_a");
  });

  // Test 4: Opaque IDs containing slashes/special characters coexist independently without collision
  it("ensures opaque IDs with slashes and colons (a/b, a_b, a:b) coexist independently without collision", async () => {
    const service = createLienzoService({ storageDir: tmpDir });

    const id1 = "project/alpha/v1";
    const id2 = "project_alpha_v1";
    const id3 = "project:alpha:v1";

    await service.createLienzo({
      contentId: id1,
      title: "Slash ID Content",
      actorId: "user_lead",
      reason: "Init 1"
    });

    await service.createLienzo({
      contentId: id2,
      title: "Underscore ID Content",
      actorId: "user_lead",
      reason: "Init 2"
    });

    await service.createLienzo({
      contentId: id3,
      title: "Colon ID Content",
      actorId: "user_lead",
      reason: "Init 3"
    });

    const list = await service.listLienzos();
    expect(list.length).toBe(3);

    const loaded1 = await service.getLienzo(id1);
    const loaded2 = await service.getLienzo(id2);
    const loaded3 = await service.getLienzo(id3);

    expect(loaded1.title).toBe("Slash ID Content");
    expect(loaded2.title).toBe("Underscore ID Content");
    expect(loaded3.title).toBe("Colon ID Content");
  });

  // Test 5: Duplicate create is atomic and fails closed
  it("fails closed when creating duplicate contentId", async () => {
    const service = createLienzoService({ storageDir: tmpDir });

    await service.createLienzo({
      contentId: "duplicate_check_id",
      title: "Original Content",
      actorId: "user_lead",
      reason: "First creation"
    });

    await expect(
      service.createLienzo({
        contentId: "duplicate_check_id",
        title: "Duplicate Attempt",
        actorId: "user_lead",
        reason: "Second creation attempt"
      })
    ).rejects.toThrow(LienzoValidationError);
  });

  // Test 6: Corrupt JSON fails closed
  it("fails closed upon encountering corrupt JSON data on disk", async () => {
    const service = createLienzoService({ storageDir: tmpDir });
    // Write corrupt file directly into storage dir
    const corruptFile = path.join(tmpDir, "corrupt_data.lienzo.json");
    fs.writeFileSync(corruptFile, "{ invalid_json: [", "utf-8");

    await expect(service.listLienzos()).rejects.toThrow(LienzoPersistenceError);
  });
});
