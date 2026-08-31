/**
 * ABRAXAS SHIM Observation & Reality Types
 */

export interface SourceAsset {
  sourceId: string;
  uri: string;
  durationUs: number;
  format: string;
  checksumSha256: string;
}

export interface TranscriptSegment {
  segmentId: string;
  startUs: number;
  endUs: number;
  text: string;
  confidence: number;
}

export interface PlannedBeat {
  beatId: string;
  description: string;
  expectedKeywords: string[];
  estimatedDurationUs?: number;
}

export type ObservationStatus = "FOUND" | "MISSING" | "DRIFT";

export interface BeatObservation {
  beatId: string;
  status: ObservationStatus;
  matchingSegmentIds: string[];
  evidenceText?: string;
  confidence: number;
}

export interface ShimObservationReport {
  reportId: string;
  contentId: string;
  sourceId: string;
  observations: BeatObservation[];
  gaps: BeatObservation[];
  createdAt: string;
}

export interface ResolvedBeatMapping {
  beatId: string;
  sourceId: string;
  startUs: number;
  endUs: number;
  confidence: number;
}

export interface ShimVerificationCertificate {
  certificateId: string;
  contenidoId: string;
  alignmentScore: number;
  verificationTimestamp: string;
  gapStatus: "OK" | "GAPS_DETECTED" | "BLOCKED";
  verifiedBy: string;
  signature: string;
}

export class UnverifiedRealityError extends Error {
  public readonly contenidoId: string;
  public readonly details: string;

  constructor(contenidoId: string, details?: string) {
    super(
      `UnverifiedRealityError: Contenido '${contenidoId}' has not passed SHIM Da'at reality verification (${
        details || "metrologyStatus is not VERIFIED_OK"
      }). Audiovisual manifestation rejected.`
    );
    this.name = "UnverifiedRealityError";
    this.contenidoId = contenidoId;
    this.details = details || "metrologyStatus is not VERIFIED_OK";
  }
}
