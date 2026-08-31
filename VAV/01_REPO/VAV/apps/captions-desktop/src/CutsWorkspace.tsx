import React, {useState} from "react";
import {
  Scissors,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  Lock,
  Undo2,
  AlertTriangle,
  FileVideo,
  Layers,
  Sparkles,
  Sliders,
  Download,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import {useVavProductStore} from "./vavProductState.ts";
import {VavTimelineViewer} from "./VavTimelineViewer.tsx";

export const CutsWorkspace: React.FC = () => {
  const {
    sourceMedia,
    candidates,
    decisions,
    selectedPolicyName,
    cutSession,
    cutPlanError,
    loadSyntheticProject,
    clearProject,
    setCandidateDecision,
    reorderCandidate,
    applyCutPolicy,
    undoCutPlan,
    approveCutPlan,
    motionSyncStatus
  } = useVavProductStore();

  const [trimInputs, setTrimInputs] = useState<Record<string, {inSec: string; outSec: string}>>({});

  const activePlan = cutSession.activeCutPlan;
  const activeLock = cutSession.activeEditLock;

  const handleTrimChange = (candidateId: string, field: "inSec" | "outSec", value: string) => {
    setTrimInputs((prev) => ({
      ...prev,
      [candidateId]: {
        inSec: field === "inSec" ? value : (prev[candidateId]?.inSec ?? "0"),
        outSec: field === "outSec" ? value : (prev[candidateId]?.outSec ?? "0")
      }
    }));
  };

  const applyCustomTrim = (c: any) => {
    const current = trimInputs[c.candidateId] ?? {
      inSec: (c.sourceRange.startUs / 1_000_000).toString(),
      outSec: (c.sourceRange.endUs / 1_000_000).toString()
    };
    const inUs = Math.round(parseFloat(current.inSec) * 1_000_000);
    const outUs = Math.round(parseFloat(current.outSec) * 1_000_000);

    setCandidateDecision(c.candidateId, "TRIM", "USER", {startUs: inUs, endUs: outUs});
  };

  return (
    <div className="cuts-workspace p-6 space-y-6 max-w-6xl mx-auto text-slate-100 font-sans">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scissors className="text-indigo-400" size={24} />
            VAV Cuts — Timeline Engine
          </h1>
          <p className="text-xs text-slate-400">
            Corte determinista no-destructivo, TRIM editable, REORDER estricto y autoría de EditLock
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!sourceMedia ? (
            <button
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-medium transition flex items-center gap-2"
              onClick={loadSyntheticProject}
            >
              <Sparkles size={16} /> Cargar Proyecto Sintético (30s)
            </button>
          ) : (
            <>
              <button
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs transition"
                onClick={clearProject}
              >
                Limpiar Proyecto
              </button>

              <button
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs transition flex items-center gap-1.5"
                onClick={undoCutPlan}
                disabled={cutSession.history.length === 0}
              >
                <Undo2 size={14} /> Deshacer ({cutSession.history.length})
              </button>

              <button
                className={`px-4 py-2 rounded text-sm font-semibold transition flex items-center gap-2 ${
                  activePlan && !cutPlanError
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
                onClick={() => approveCutPlan("USER_EDITORIAL_APPROVAL")}
                disabled={!activePlan || Boolean(cutPlanError)}
              >
                <Lock size={16} /> Aprobar & Bloquear EditLock
              </button>
            </>
          )}
        </div>
      </div>

      {/* Downstream Invalidation Alert */}
      {motionSyncStatus === "OUT_OF_SYNC" && (
        <div className="p-3 bg-amber-950/80 border border-amber-600/60 rounded-lg flex items-center gap-3 text-amber-200 text-sm">
          <AlertTriangle size={20} className="text-amber-400 shrink-0" />
          <div>
            <strong>Derivadas desincronizadas (OUT_OF_SYNC):</strong> El CutPlan fue modificado. Se requiere re-aprobar el EditLock para alinear Motions y Render.
          </div>
        </div>
      )}

      {/* Empty State */}
      {!sourceMedia && (
        <div className="p-12 border-2 border-dashed border-slate-800 rounded-xl text-center space-y-4">
          <FileVideo size={48} className="mx-auto text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-300">Ningún archivo de video cargado</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Carga un video o pulsa "Cargar Proyecto Sintético" para auditar y ejecutar cortes deterministas.
          </p>
        </div>
      )}

      {sourceMedia && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Candidates & Decisions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <Layers size={18} className="text-indigo-400" />
                  Candidatos Observados por Shim ({candidates.length})
                </h2>

                {/* Policy Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Política de Corte:</span>
                  <select
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    value={selectedPolicyName}
                    onChange={(e) => applyCutPolicy(e.target.value as any)}
                  >
                    <option value="DEFAULT_NEUTRAL">Neutral (Sin handles destructivos)</option>
                    <option value="MOKA_FRAME_MATCHED_LEGACY">Moka Legacy (Handles de 100ms)</option>
                  </select>
                </div>
              </div>

              {/* Candidate Cards */}
              <div className="space-y-3">
                {candidates.map((c, idx) => {
                  const dec = decisions[c.candidateId];
                  const isUndecided = !dec;
                  const isTrimmed = dec?.decisionType === "TRIM";

                  return (
                    <div
                      key={c.candidateId}
                      className={`p-4 rounded-lg border transition ${
                        isUndecided
                          ? "bg-slate-900 border-amber-500/50"
                          : dec.decisionType === "KEEP"
                          ? "bg-slate-900/80 border-emerald-500/50"
                          : dec.decisionType === "REMOVE"
                          ? "bg-slate-900/40 border-red-500/40 opacity-70"
                          : dec.decisionType === "REORDER"
                          ? "bg-slate-900/80 border-purple-500/50"
                          : "bg-slate-900/80 border-sky-500/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                              Seq #{dec?.targetSequenceIndex ?? idx + 1}
                            </span>
                            <span className="font-semibold text-sm text-slate-100">{c.candidateId}</span>
                            <span className="text-xs px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-700 rounded">
                              {c.editorialRole}
                            </span>
                            <span className="text-xs text-slate-400">
                              Confianza: {(c.confidence * 100).toFixed(0)}%
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                            <Clock size={12} />
                            Fuente: {(c.sourceRange.startUs / 1_000_000).toFixed(2)}s → {(c.sourceRange.endUs / 1_000_000).toFixed(2)}s (Duración: {((c.sourceRange.endUs - c.sourceRange.startUs) / 1_000_000).toFixed(2)}s)
                          </p>
                        </div>

                        {/* Explicit Decision Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                              dec?.decisionType === "KEEP"
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                            }`}
                            onClick={() => setCandidateDecision(c.candidateId, "KEEP")}
                          >
                            <CheckCircle2 size={13} /> KEEP
                          </button>

                          <button
                            className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                              dec?.decisionType === "REMOVE"
                                ? "bg-red-600 text-white"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                            }`}
                            onClick={() => setCandidateDecision(c.candidateId, "REMOVE")}
                          >
                            <XCircle size={13} /> REMOVE
                          </button>

                          <button
                            className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                              isTrimmed
                                ? "bg-sky-600 text-white"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                            }`}
                            onClick={() => applyCustomTrim(c)}
                          >
                            <Scissors size={13} /> TRIM
                          </button>

                          {/* Reorder Buttons */}
                          <div className="flex items-center gap-0.5 bg-slate-800 rounded p-0.5">
                            <button
                              className="p-1 hover:bg-slate-700 rounded text-slate-300"
                              title="Mover Arriba"
                              onClick={() => reorderCandidate(c.candidateId, Math.max(0, idx - 1))}
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              className="p-1 hover:bg-slate-700 rounded text-slate-300"
                              title="Mover Abajo"
                              onClick={() => reorderCandidate(c.candidateId, idx + 1)}
                            >
                              <ChevronDown size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Editable TRIM Subpanel */}
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-4 text-xs">
                        <span className="text-slate-400 font-medium">Límites de Recorte (Seg):</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-mono">In:</span>
                          <input
                            type="number"
                            step="0.1"
                            min={(c.sourceRange.startUs / 1_000_000).toString()}
                            max={(c.sourceRange.endUs / 1_000_000).toString()}
                            className="w-16 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-slate-200"
                            defaultValue={(c.sourceRange.startUs / 1_000_000).toString()}
                            onChange={(e) => handleTrimChange(c.candidateId, "inSec", e.target.value)}
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-mono">Out:</span>
                          <input
                            type="number"
                            step="0.1"
                            min={(c.sourceRange.startUs / 1_000_000).toString()}
                            max={(c.sourceRange.endUs / 1_000_000).toString()}
                            className="w-16 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-slate-200"
                            defaultValue={(c.sourceRange.endUs / 1_000_000).toString()}
                            onChange={(e) => handleTrimChange(c.candidateId, "outSec", e.target.value)}
                          />
                        </div>

                        <button
                          className="px-2 py-0.5 bg-sky-950 border border-sky-700 text-sky-300 rounded hover:bg-sky-900 transition text-[11px]"
                          onClick={() => applyCustomTrim(c)}
                        >
                          Aplicar TRIM
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {cutPlanError && (
                <div className="p-3 bg-red-950/80 border border-red-600 rounded text-xs text-red-200 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {cutPlanError}
                </div>
              )}
            </div>

            {/* Right Column: EditLock & Render Plan */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Lock size={18} className="text-emerald-400" />
                Estado del EditLock
              </h2>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Estado:</span>
                  <span className={`font-semibold ${activeLock ? "text-emerald-400" : "text-amber-400"}`}>
                    {activeLock ? "LOCKED (Inmutable)" : "DRAFT (Borrador)"}
                  </span>
                </div>

                {activeLock && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lock ID:</span>
                      <span className="font-mono text-slate-200">{activeLock.editLockId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Timebase:</span>
                      <span className="font-mono text-slate-200">{activeLock.timebase.fpsRational} ({activeLock.timebase.fpsNominal} fps)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duración:</span>
                      <span className="font-semibold text-indigo-400">{(activeLock.timebase.durationUs / 1_000_000).toFixed(2)}s</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-slate-400 block">SHA-256 Mapping Identity:</span>
                      <div className="font-mono text-[10px] text-slate-300 bg-slate-950 p-1.5 rounded break-all select-all">
                        {activeLock.timeMappingHash}
                      </div>
                    </div>
                  </>
                )}

                {!activeLock && (
                  <p className="text-slate-500 italic py-2">
                    Toma decisiones sobre todos los candidatos para ensamblar el CutPlan y activar el bloqueo inmutable.
                  </p>
                )}
              </div>

              {/* Render Plan Card */}
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2 text-xs">
                <h3 className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Download size={14} className="text-indigo-400" />
                  Plan de Render & Exportación
                </h3>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estado de Ejecución:</span>
                  <span className="font-mono text-indigo-300">RENDER PLAN / NOT EXECUTED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verificación QA:</span>
                  <span className="text-emerald-400 font-semibold">{"NOT_EXECUTED (Pendiente de QC)"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Preview Timeline */}
          <div className="pt-6 border-t border-slate-800">
            <VavTimelineViewer />
          </div>
        </div>
      )}
    </div>
  );
};
