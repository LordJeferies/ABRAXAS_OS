export type WorkflowStepId =
  | "source"
  | "transcribe"
  | "review"
  | "design"
  | "export";

export type WorkflowStep = Readonly<{
  id: WorkflowStepId;
  number: number;
  label: string;
  shortLabel: string;
  description: string;
}>;

export const workflowSteps: readonly WorkflowStep[] = [
  {
    id: "source",
    number: 1,
    label: "Importar video",
    shortLabel: "Video",
    description: "Selecciona el archivo fuente."
  },
  {
    id: "transcribe",
    number: 2,
    label: "Crear subtítulos",
    shortLabel: "Transcribir",
    description: "Whisper genera el texto y timings."
  },
  {
    id: "review",
    number: 3,
    label: "Revisar texto",
    shortLabel: "Revisar",
    description: "Corrige, divide y valida captions."
  },
  {
    id: "design",
    number: 4,
    label: "Diseñar captions",
    shortLabel: "Diseñar",
    description: "Estilo, estructura, motion y posición."
  },
  {
    id: "export",
    number: 5,
    label: "Exportar",
    shortLabel: "Exportar",
    description: "Comprueba y renderiza el resultado."
  }
];

export type WorkflowFacts = Readonly<{
  hasMedia: boolean;
  hasTranscript: boolean;
  hasReviewedCaptions: boolean;
  hasDesign: boolean;
}>;

export const recommendedWorkflowStep = (
  facts: WorkflowFacts
): WorkflowStepId => {
  if (!facts.hasMedia) return "source";
  if (!facts.hasTranscript) return "transcribe";
  if (!facts.hasReviewedCaptions) return "review";
  if (!facts.hasDesign) return "design";
  return "export";
};

export const completedWorkflowSteps = (
  facts: WorkflowFacts
): readonly WorkflowStepId[] => {
  const completed: WorkflowStepId[] = [];
  if (facts.hasMedia) completed.push("source");
  if (facts.hasTranscript) completed.push("transcribe");
  if (facts.hasReviewedCaptions) completed.push("review");
  if (facts.hasDesign) completed.push("design");
  return completed;
};
