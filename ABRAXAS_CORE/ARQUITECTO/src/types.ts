/**
 * Arquitecto Private Contextual Runtime Types
 */

export interface ArquitectoContextInput {
  userId: string;
  role: string;
  currentRoute: string;
  clientId?: string | undefined;
  contentId?: string | undefined;
  externalToolContext?: string | undefined; // e.g. "DaVinci Resolve", "Premiere", "CapCut"
}

export interface ArquitectoAnalysis {
  contextSummary: string;
  currentStage: string;
  identifiedGaps: string[];
  suggestedNextAction: string;
  recordingGuidance?: {
    framing: string;
    intention: string;
    pickupInstructions: string[];
  } | undefined;
  productionGuidance?: {
    cutStyle: string;
    captionPlacement: string;
    motionFamily: string;
    externalEditorNotes?: string | undefined;
  } | undefined;
  permissionGranted: boolean;
}
