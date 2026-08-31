/**
 * ABRAXAS SHIM Observation & Resolution Engine
 */

import { randomUUID, createHash } from "node:crypto";
import {
  SourceAsset,
  TranscriptSegment,
  PlannedBeat,
  BeatObservation,
  ShimObservationReport,
  ResolvedBeatMapping,
  ShimVerificationCertificate,
  UnverifiedRealityError
} from "./types.js";
import { LienzoService } from "../../LIENZO/src/service.js";
import { EventLedger } from "../../backbone/src/event-ledger.js";

export class ShimEngine {
  constructor(
    private readonly lienzoService: LienzoService,
    private readonly eventLedger?: EventLedger
  ) {}

  public observeSource(
    contentId: string,
    source: SourceAsset,
    segments: TranscriptSegment[],
    plannedBeats: PlannedBeat[]
  ): ShimObservationReport {
    const observations: BeatObservation[] = [];
    const gaps: BeatObservation[] = [];

    for (const beat of plannedBeats) {
      const matches = segments.filter((seg) =>
        beat.expectedKeywords.some((kw) =>
          seg.text.toLowerCase().includes(kw.toLowerCase())
        )
      );

      if (matches.length > 0) {
        const obs: BeatObservation = {
          beatId: beat.beatId,
          status: "FOUND",
          matchingSegmentIds: matches.map((m) => m.segmentId),
          evidenceText: matches.map((m) => m.text).join(" | "),
          confidence: 0.95
        };
        observations.push(obs);
      } else {
        const gap: BeatObservation = {
          beatId: beat.beatId,
          status: "MISSING",
          matchingSegmentIds: [],
          confidence: 0
        };
        observations.push(gap);
        gaps.push(gap);
      }
    }

    const report: ShimObservationReport = {
      reportId: `shim_rep_${randomUUID().slice(0, 10)}`,
      contentId,
      sourceId: source.sourceId,
      observations,
      gaps,
      createdAt: new Date().toISOString()
    };

    return report;
  }

  public issueVerificationCertificate(
    contentId: string,
    report: ShimObservationReport,
    verifiedBy = "SHIM_DAAT_METROLOGY_GATE"
  ): ShimVerificationCertificate {
    const totalBeats = report.observations.length;
    const foundBeats = report.observations.filter((o) => o.status === "FOUND").length;
    const alignmentScore = totalBeats > 0 ? foundBeats / totalBeats : 1.0;
    const gapStatus = report.gaps.length === 0 ? "OK" : "GAPS_DETECTED";

    const timestamp = new Date().toISOString();
    const signature = createHash("sha256")
      .update(`${contentId}:${report.reportId}:${alignmentScore}:${gapStatus}:${timestamp}:${verifiedBy}`)
      .digest("hex");

    return {
      certificateId: `cert_shim_${randomUUID().slice(0, 10)}`,
      contenidoId: contentId,
      alignmentScore,
      verificationTimestamp: timestamp,
      gapStatus,
      verifiedBy,
      signature
    };
  }

  public async recordObservedLayer(
    contentId: string,
    expectedRevision: number,
    report: ShimObservationReport,
    actorId: string
  ): Promise<{ revision: number; certificate?: ShimVerificationCertificate }> {
    const cert = this.issueVerificationCertificate(contentId, report, actorId);
    const metrologyStatus = report.gaps.length === 0 ? "VERIFIED_OK" : "GAPS_DETECTED";

    const res = await this.lienzoService.createComponent({
      contentId,
      expectedRevision,
      actorId,
      reason: `Record Shim observed source findings (${report.gaps.length} gaps)`,
      componentId: `comp_observed_${randomUUID().slice(0, 6)}`,
      section: "AUDIO",
      layer: "OBSERVED",
      status: report.gaps.length === 0 ? "APPROVED" : "BLOCKED",
      data: {
        sourceId: report.sourceId,
        observations: report.observations,
        gaps: report.gaps,
        metrologyStatus,
        certificate: cert
      }
    });

    if (report.gaps.length > 0 && this.eventLedger) {
      for (const gap of report.gaps) {
        await this.eventLedger.append({
          eventType: "SHIM_GAP_DETECTED",
          contentId,
          actorId,
          reason: `Shim detected missing beat '${gap.beatId}' in recording`,
          metadata: {
            beatId: gap.beatId,
            reportId: report.reportId,
            sourceId: report.sourceId,
            missingElement: gap.beatId,
            priority: "HIGH",
            deadline: new Date(Date.now() + 86400000).toISOString()
          }
        });
      }
    } else if (this.eventLedger) {
      await this.eventLedger.append({
        eventType: "SHIM_VERIFIED",
        contentId,
        actorId,
        reason: `Shim certified 100% empirical alignment`,
        metadata: {
          certificateId: cert.certificateId,
          alignmentScore: cert.alignmentScore
        }
      });
    }

    return { revision: res.lienzo.revision, certificate: cert };
  }

  public async resolveObservedToBeats(
    contentId: string,
    expectedRevision: number,
    mappings: ResolvedBeatMapping[],
    actorId: string
  ): Promise<{ revision: number }> {
    const res = await this.lienzoService.createComponent({
      contentId,
      expectedRevision,
      actorId,
      reason: `Record Shim resolved beat mappings (${mappings.length} beats)`,
      componentId: `comp_resolved_${randomUUID().slice(0, 6)}`,
      section: "AUDIO",
      layer: "RESOLVED",
      status: "APPROVED",
      data: {
        mappings,
        resolvedBeats: mappings,
        metrologyStatus: "VERIFIED_OK"
      }
    });

    if (this.eventLedger) {
      await this.eventLedger.append({
        eventType: "SHIM_BEATS_RESOLVED",
        contentId,
        actorId,
        reason: `Shim mapped ${mappings.length} observed beats to timeline`,
        metadata: {
          count: mappings.length
        }
      });
    }

    return { revision: res.lienzo.revision };
  }

  public resolveMappings(
    report: ShimObservationReport,
    segments: TranscriptSegment[]
  ): ResolvedBeatMapping[] {
    const mappings: ResolvedBeatMapping[] = [];

    for (const obs of report.observations) {
      if (obs.status === "FOUND" && obs.matchingSegmentIds.length > 0) {
        const matchingSegs = segments.filter((s) =>
          obs.matchingSegmentIds.includes(s.segmentId)
        );
        if (matchingSegs.length > 0) {
          const startUs = Math.min(...matchingSegs.map((s) => s.startUs));
          const endUs = Math.max(...matchingSegs.map((s) => s.endUs));
          mappings.push({
            beatId: obs.beatId,
            sourceId: report.sourceId,
            startUs,
            endUs,
            confidence: obs.confidence
          });
        }
      }
    }

    return mappings;
  }
}
