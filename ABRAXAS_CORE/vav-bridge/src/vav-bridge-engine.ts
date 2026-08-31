/**
 * VAV Bridge Engine — Links VAV production execution into Lienzo & Backbone
 * Enforces Da'at Reality Verification Gate & Universal CAS Artifact Registry
 */

import { randomUUID, createHash } from "node:crypto";
import { VavJobInput, VavJobResult } from "./types.js";
import { LienzoService } from "../../LIENZO/src/service.js";
import { ArtifactRegistry } from "../../backbone/src/artifact-registry.js";
import { EventLedger } from "../../backbone/src/event-ledger.js";
import { UnverifiedRealityError } from "../../SHIM/src/types.js";

export class VavBridgeEngine {
  constructor(
    private readonly lienzoService: LienzoService,
    private readonly artifactRegistry: ArtifactRegistry,
    private readonly eventLedger: EventLedger
  ) {}

  public async executeProductionJob(input: VavJobInput): Promise<VavJobResult> {
    const jobId = `vav_job_${randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();

    // 1. Verify current Lienzo state
    const current = await this.lienzoService.getLienzo(input.contentId);
    if (current.revision !== input.lienzoRevision) {
      throw new Error(
        `Lienzo revision conflict: Job submitted with revision ${input.lienzoRevision}, but current is ${current.revision}`
      );
    }

    // 2. DA'AT REALITY GATE ENFORCEMENT
    const observedOrResolved = Object.values(current.components).filter(
      (c) => c.layer === "OBSERVED" || c.layer === "RESOLVED"
    );

    if (observedOrResolved.length > 0) {
      const isVerified = observedOrResolved.some(
        (c) =>
          c.status === "APPROVED" &&
          (c.layer === "RESOLVED" ||
           c.data?.metrologyStatus === "VERIFIED_OK" ||
           !c.data?.gaps ||
           (Array.isArray(c.data?.gaps) && c.data.gaps.length === 0))
      );

      if (!isVerified) {
        throw new UnverifiedRealityError(
          input.contentId,
          "SHIM observed layer has unresolved gaps or blocked metrology status"
        );
      }
    }

    try {
      // 3. Compute deterministic output CAS Hash
      const outputHash = createHash("sha256")
        .update(`${input.contentId}:${input.jobType}:${input.intentVersion}:${JSON.stringify(input.parameters)}`)
        .digest("hex");
      const outputUri = `cas://${outputHash}`;

      // 4. Register Artifact in Universal CAS ArtifactRegistry
      const artifact = await this.artifactRegistry.register({
        contentId: input.contentId,
        componentId: input.componentId,
        type: `vav_${input.jobType.toLowerCase()}_artifact`,
        version: input.intentVersion,
        createdBy: "vav_engine",
        basedOn: input.inputArtifacts,
        uri: outputUri,
        hash: `sha256:${outputHash}`,
        metadata: input.parameters
      });

      // 5. Update Lienzo Component status to GENERATED with CAS ArtifactRef attached
      const statusRes = await this.lienzoService.changeComponentStatus({
        contentId: input.contentId,
        componentId: input.componentId,
        expectedRevision: input.lienzoRevision,
        newStatus: "GENERATED",
        actorId: input.actorId,
        reason: `VAV ${input.jobType} successfully completed`,
        artifactRef: {
          artifactId: artifact.artifactId,
          kind: artifact.type,
          uri: artifact.uri,
          checksum: artifact.hash,
          createdAt: artifact.createdAt
        }
      });

      // 6. Emit Event to Backbone EventLedger
      await this.eventLedger.append({
        eventType: `VAV_${input.jobType}_COMPLETED`,
        contentId: input.contentId,
        componentId: input.componentId,
        actorId: input.actorId,
        reason: `VAV completed ${input.jobType}`,
        newVersion: statusRes.component.version,
        metadata: {
          jobId,
          jobType: input.jobType,
          artifactId: artifact.artifactId,
          casUri: outputUri,
          hash: artifact.hash
        }
      });

      return {
        jobId,
        status: "COMPLETED",
        artifactRef: {
          artifactId: artifact.artifactId,
          kind: artifact.type,
          uri: artifact.uri,
          checksum: artifact.hash,
          createdAt: artifact.createdAt
        },
        hash: artifact.hash,
        completedAt: now
      };
    } catch (err: any) {
      if (err instanceof UnverifiedRealityError) {
        throw err;
      }
      // Mark component ERROR in Lienzo if execution fails
      await this.lienzoService.changeComponentStatus({
        contentId: input.contentId,
        componentId: input.componentId,
        expectedRevision: input.lienzoRevision,
        newStatus: "ERROR",
        actorId: input.actorId,
        reason: `VAV ${input.jobType} failed: ${err.message}`
      });

      await this.eventLedger.append({
        eventType: `VAV_${input.jobType}_FAILED`,
        contentId: input.contentId,
        componentId: input.componentId,
        actorId: input.actorId,
        reason: `VAV execution error: ${err.message}`
      });

      throw err;
    }
  }
}
