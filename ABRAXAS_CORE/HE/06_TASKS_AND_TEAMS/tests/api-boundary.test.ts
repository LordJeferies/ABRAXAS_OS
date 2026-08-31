import {describe, expect, it} from "vitest";
import * as ProductApi from "../runtime/index.ts";
import * as InfraApi from "../runtime/infrastructure/index.ts";

describe("He Operations Core — Public API vs Infrastructure Boundary (Gate P2 Repair-03)", () => {
  it("proves product entrypoint does NOT export raw storage classes or raw persistence mutation methods", () => {
    const productExports = Object.keys(ProductApi);

    // Forbidden from product entrypoint
    expect(productExports).not.toContain("MemoryOperationsStore");
    expect(productExports).not.toContain("JsonFileOperationsStore");
    expect(productExports).not.toContain("OperationsStore");
    expect(productExports).not.toContain("saveTask");
    expect(productExports).not.toContain("saveApproval");

    // Required in product entrypoint
    expect(productExports).toContain("HeOperationsService");
    expect(productExports).toContain("getSoloQueue");
    expect(productExports).toContain("getTeamSnapshot");
    expect(productExports).toContain("getKanbanProjection");
    expect(productExports).toContain("getCalendarProjection");
    expect(productExports).toContain("SecurityError");
    expect(productExports).toContain("DependencyError");
    expect(productExports).toContain("ApprovalError");
  });

  it("proves infrastructure entrypoint exports storage providers for server initialization and tests", () => {
    const infraExports = Object.keys(InfraApi);
    expect(infraExports).toContain("MemoryOperationsStore");
    expect(infraExports).toContain("JsonFileOperationsStore");
  });

  it("proves HeOperationsService provides zero arbitrary task import or status bypass methods", () => {
    const serviceProto = Object.getOwnPropertyNames(ProductApi.HeOperationsService.prototype);
    expect(serviceProto).not.toContain("importTaskFixture");
    expect(serviceProto).not.toContain("importTask");
    expect(serviceProto).not.toContain("saveTask");
  });
});
