/**
 * Arquitecto Engine — Private Deterministic Contextual Guidance
 */

import { ArquitectoContextInput, ArquitectoAnalysis } from "./types.js";
import { LienzoService } from "../../LIENZO/src/service.js";
import { ClientCoreService } from "../../YOD/runtime/src/client-core.js";

export class ArquitectoEngine {
  constructor(
    private readonly lienzoService: LienzoService,
    private readonly clientService?: ClientCoreService
  ) {}

  public async analyzeContext(input: ArquitectoContextInput): Promise<ArquitectoAnalysis> {
    let currentStage = "IDLE";
    let identifiedGaps: string[] = [];
    let suggestedNextAction = "Select or create an opportunity to begin";
    let recordingGuidance;
    let productionGuidance;

    if (input.contentId) {
      const lienzo = await this.lienzoService.getLienzo(input.contentId);
      currentStage = lienzo.lifecycle;

      const observedComp = lienzo.components.find((c) => c.layer === "OBSERVED");
      const outOfSyncComps = lienzo.components.filter((c) => c.status === "OUT_OF_SYNC");

      if (observedComp && observedComp.status === "BLOCKED") {
        const gaps = (observedComp.data["gaps"] as Array<{ beatId: string }>) || [];
        identifiedGaps = gaps.map((g) => `Missing Beat: ${g.beatId}`);
        suggestedNextAction = `Record pickup take for ${identifiedGaps.join(", ")}`;
        recordingGuidance = {
          framing: "Medium close-up, eye-level lens height",
          intention: "Direct address to camera delivering missing CTA with confident cadence",
          pickupInstructions: [
            "Maintain same lighting setup as primary take",
            "Deliver 2 variations of missing CTA"
          ]
        };
      } else if (outOfSyncComps.length > 0) {
        suggestedNextAction = `Regenerate downstream derivatives for ${outOfSyncComps.map((c) => c.section).join(", ")}`;
      } else if (lienzo.lifecycle === "PRODUCTION") {
        suggestedNextAction = "Proceed with VAV Cut & Caption alignment";
        productionGuidance = {
          cutStyle: "Fast jump-cut pacing on breath pauses",
          captionPlacement: "Center-third safe zone with high-contrast drop shadow",
          motionFamily: "KINETIC_EMPHASIS",
          externalEditorNotes: input.externalToolContext
            ? `Exporting XML / EDL timeline for editing in ${input.externalToolContext}`
            : undefined
        };
      }
    }

    return {
      contextSummary: `User "${input.userId}" (${input.role}) on route "${input.currentRoute}"`,
      currentStage,
      identifiedGaps,
      suggestedNextAction,
      recordingGuidance,
      productionGuidance,
      permissionGranted: input.role !== "VIEWER"
    };
  }
}
