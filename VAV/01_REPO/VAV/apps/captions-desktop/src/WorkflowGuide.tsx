import React, {useRef} from "react";
import {
  ArrowRight,
  Captions,
  Check,
  Download,
  FileVideo2,
  Palette,
  Sparkles
} from "lucide-react";
import {
  completedWorkflowSteps,
  recommendedWorkflowStep,
  workflowSteps,
  type WorkflowStepId
} from "./workflow.ts";
import {useUiState} from "./uiState.ts";

const icons = {
  source: FileVideo2,
  transcribe: Sparkles,
  review: Captions,
  design: Palette,
  export: Download
} satisfies Record<WorkflowStepId, React.ComponentType<{size?: number; strokeWidth?: number}>>;

export const WorkflowGuide: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pendingMedia = useUiState((state) => state.pendingMedia);
  const setPendingMedia = useUiState((state) => state.setPendingMedia);
  const setActiveSection = useUiState((state) => state.setActiveSection);
  const setExportOpen = useUiState((state) => state.setExportOpen);
  const setNotice = useUiState((state) => state.setNotice);

  // C01.6 only has real media selection. Later corridas replace these facts
  // with project-derived state without changing this workflow component.
  const facts = {
    hasMedia: Boolean(pendingMedia),
    hasTranscript: false,
    hasReviewedCaptions: false,
    hasDesign: false
  } as const;

  const recommended = recommendedWorkflowStep(facts);
  const completed = completedWorkflowSteps(facts);

  const importMedia = () => inputRef.current?.click();

  const activate = (step: WorkflowStepId) => {
    switch (step) {
      case "source":
        importMedia();
        return;
      case "transcribe":
        if (!pendingMedia) {
          importMedia();
          return;
        }
        setActiveSection("transcript");
        setNotice({
          tone: "info",
          text: "Paso 2 listo. La transcripción Whisper real se conecta en la Corrida 04; ahora puedes explorar el flujo y los providers."
        });
        return;
      case "review":
        setActiveSection("captions");
        setNotice({
          tone: "info",
          text: "Vista de revisión abierta con captions demo. Cuando exista una transcripción real, este paso se desbloqueará automáticamente."
        });
        return;
      case "design":
        setActiveSection("styles");
        setNotice({
          tone: "info",
          text: "Diseño abierto: aquí convergerán Estilo, Estructura, Caption Motion y Scene Smart."
        });
        return;
      case "export":
        setExportOpen(true);
        return;
    }
  };

  const recommendedStep = workflowSteps.find((step) => step.id === recommended)!;

  return (
    <section className="workflow-guide" aria-label="Flujo principal de VAV Captions">
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="video/*,.mp4,.mov,.m4v,.webm"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setPendingMedia({
            name: file.name,
            size: file.size,
            type: file.type || "video"
          });
          setActiveSection("media");
          setNotice({
            tone: "success",
            text: `Paso 1 completado: ${file.name}. Siguiente paso: crear subtítulos.`
          });
          event.currentTarget.value = "";
        }}
      />

      <div className="workflow-title">
        <span className="eyebrow">FLUJO DE TRABAJO</span>
        <strong>¿Qué hago ahora?</strong>
      </div>

      <div className="workflow-steps">
        {workflowSteps.map((step) => {
          const Icon = icons[step.id];
          const isComplete = completed.includes(step.id);
          const isRecommended = step.id === recommended;

          return (
            <button
              key={step.id}
              type="button"
              className={`workflow-step ${isComplete ? "complete" : ""} ${isRecommended ? "recommended" : ""}`}
              onClick={() => activate(step.id)}
              title={step.description}
              aria-current={isRecommended ? "step" : undefined}
            >
              <span className="workflow-step-number">
                {isComplete ? <Check size={13} strokeWidth={2.5}/> : step.number}
              </span>
              <Icon size={15} strokeWidth={1.8}/>
              <span className="workflow-step-copy">
                <strong>{step.shortLabel}</strong>
                <small>{isComplete ? "Listo" : isRecommended ? "Ahora" : `Paso ${step.number}`}</small>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="workflow-next"
        onClick={() => activate(recommended)}
      >
        <span>
          <small>SIGUIENTE PASO</small>
          <strong>{recommendedStep.label}</strong>
        </span>
        <ArrowRight size={17}/>
      </button>
    </section>
  );
};
