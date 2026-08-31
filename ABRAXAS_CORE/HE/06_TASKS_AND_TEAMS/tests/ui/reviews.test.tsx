import {describe, expect, it} from "vitest";
import React from "react";
import {renderToString} from "react-dom/server";
import {HeOperationsService} from "../../runtime/index.ts";
import {MemoryOperationsStore} from "../../runtime/infrastructure/index.ts";
import {HeProvider, ReviewsView} from "../../ui/index.ts";

describe("UI Integration — Reviews & Approvals (AC-P3A-012)", () => {
  it("renders review ledger and decision actions", () => {
    const store = new MemoryOperationsStore();
    const service = new HeOperationsService(store);
    service.bootstrapOwner({userId: "u_owner", displayName: "Lead Owner"});

    service.requestApproval({
      targetType: "MOTION_PLAN",
      targetId: "mp_01",
      reviewers: ["u_owner"]
    }, "u_owner");

    const html = renderToString(
      <HeProvider service={service} initialActorId="u_owner">
        <ReviewsView />
      </HeProvider>
    );

    expect(html).toContain("Reviews &amp; Approvals");
    expect(html).toContain("MOTION_PLAN: mp_01");
    expect(html).toContain("PENDING");
    expect(html).toContain("Approve");
    expect(html).toContain("Reject");
  });
});
