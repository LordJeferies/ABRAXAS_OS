import React, {useState} from "react";
import {
  Move3D,
  Sparkles,
  Shield,
  Sliders,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import {useVavProductStore} from "./vavProductState.ts";
import {
  SIMPLE_MOTION_FAMILIES,
  STANDARD_MOTION_PRESETS,
  type MotionAssignment,
  type SimpleMotionFamilyDef
} from "@vav/visual-motion-domain";
import {SAFE_ZONE_PRESETS, type PlatformSafeZonePreset} from "@vav/platform-safe-zones";
import {VavTimelineViewer} from "./VavTimelineViewer.tsx";

export const MotionsWorkspace: React.FC = () => {
  const {
    cutSession,
    motionPlan,
    currentSafeZone,
    visualOwnership,
    motionSyncStatus,
    collisionResult,
    selectedPresetId,
    recalculateMotionPlan,
    addMotionIntent,
    removeMotionIntent,
    applyMotionPresetToIntent,
    setSafeZone,
    setVisualOwnership,
    checkCollision
  } = useVavProductStore();

  const [testBounds, setTestBounds] = useState({
    motionX: 100,
    motionY: 1200,
    captionX: 200,
    captionY: 1300
  });

  const activeLock = cutSession.activeEditLock;

  const handleTestCollision = (field: keyof typeof testBounds, val: number) => {
    const next = {...testBounds, [field]: val};
    setTestBounds(next);
    checkCollision(
      {minX: next.motionX, maxX: next.motionX + 300, minY: next.motionY, maxY: next.motionY + 200},
      {minX: next.captionX, maxX: next.captionX + 400, minY: next.captionY, maxY: next.captionY + 150}
    );
  };

  return (
    <div className="motions-workspace p-6 space-y-6 max-w-6xl mx-auto text-slate-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Move3D className="text-sky-400" size={24} />
            VAV Motions — Visual Engine
          </h1>
          <p className="text-xs text-slate-400">
            Simple Motion Core (13 Familias), presets configurados, anclaje estricto a EditLock y resolución de colisiones
          </p>
        </div>

        <div className="flex items-center gap-3">
          {motionSyncStatus === "OUT_OF_SYNC" && (
            <button
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded text-sm font-semibold transition flex items-center gap-2 text-white"
              onClick={recalculateMotionPlan}
            >
              <RotateCcw size={16} /> Re-resolver Motions a EditLock
            </button>
          )}

          {activeLock && (
            <button
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded text-sm font-semibold transition flex items-center gap-2"
              onClick={() => addMotionIntent({
                intentId: `intent_${Date.now()}`,
                timelineStartUs: 0,
                timelineEndUs: Math.min(2_000_000, activeLock.timebase.durationUs),
                role: "HOOK",
                suggestedPresetId: selectedPresetId
              })}
            >
              <Sparkles size={16} /> Añadir Intención de Motion
            </button>
          )}
        </div>
      </div>

      {/* Lock Requirement Banner */}
      {!activeLock && (
        <div className="p-8 border border-slate-800 bg-slate-900/60 rounded-xl text-center space-y-3">
          <Move3D size={40} className="mx-auto text-slate-600" />
          <h3 className="text-base font-semibold text-slate-300">EditLock Requerido</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            VAV Motions requiere una geometría temporal inmutable provista por un EditLock activo en VAV Cuts antes de autorizar transformaciones visuales.
          </p>
        </div>
      )}

      {activeLock && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Motion Track & Assignments */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  Asignaciones de Motion ({motionPlan?.assignments.length ?? 0})
                </h2>

                <span className={`text-xs px-2.5 py-1 rounded font-mono ${
                  motionSyncStatus === "CURRENT"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                    : "bg-amber-950 text-amber-300 border border-amber-700"
                }`}>
                  {motionSyncStatus === "CURRENT" ? "Sincronizado con EditLock" : "OUT_OF_SYNC"}
                </span>
              </div>

              {/* Assignments List */}
              <div className="space-y-3">
                {motionPlan?.assignments.map((asg: MotionAssignment, idx: number) => (
                  <div
                    key={asg.assignmentId}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 rounded">#{idx + 1}</span>
                        <span className="font-semibold text-sm text-sky-300">{asg.motionFamilyId}</span>
                        {asg.presetId && (
                          <span className="text-xs font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-700 rounded">
                            {asg.presetId}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">Prioridad: {asg.priority}</span>
                      </div>

                      <button
                        className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                        onClick={() => removeMotionIntent(asg.editorialIntentRef ?? "")}
                      >
                        Eliminar
                      </button>
                    </div>

                    <p className="text-xs font-mono text-slate-400">
                      Rango Timeline: {(asg.timelineRange.startUs / 1_000_000).toFixed(2)}s → {(asg.timelineRange.endUs / 1_000_000).toFixed(2)}s (Frames: {asg.timelineRange.startFrame}–{asg.timelineRange.endFrame})
                    </p>

                    {/* Preset Switcher for Assignment */}
                    <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Preset:</span>
                      <select
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                        value={asg.presetId ?? ""}
                        onChange={(e) => applyMotionPresetToIntent(asg.editorialIntentRef ?? "", e.target.value)}
                      >
                        {STANDARD_MOTION_PRESETS.map((p) => (
                          <option key={p.presetId} value={p.presetId}>
                            {p.name} ({p.motionFamilyId})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {motionPlan?.assignments.length === 0 && (
                  <div className="p-6 border border-dashed border-slate-800 rounded text-center text-xs text-slate-500">
                    Ninguna asignación de motion configurada. Añade una intención editorial para comenzar.
                  </div>
                )}
              </div>

              {/* Simple Motion Families Catalog */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Sliders size={16} className="text-sky-400" />
                  Catálogo de Familias Simples V1 (13 Primitivas Ejecutables)
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SIMPLE_MOTION_FAMILIES.map((fam: SimpleMotionFamilyDef) => (
                    <div
                      key={fam.familyId}
                      className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded text-xs space-y-1 hover:border-slate-700 transition"
                    >
                      <span className="font-semibold text-sky-400 block">{fam.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">{fam.familyId}</span>
                      <p className="text-[11px] text-slate-400 leading-tight">{fam.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Presets, Safe Zones & Ownership */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Shield size={18} className="text-indigo-400" />
                Políticas y Safe-Zones
              </h2>

              {/* Visual Ownership Selector */}
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 font-semibold block">Propiedad Visual (VisualOwnership):</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["caption-engine", "visual-motion", "hybrid"] as const).map((own) => (
                    <button
                      key={own}
                      className={`py-1.5 px-2 rounded text-[11px] font-medium transition text-center ${
                        visualOwnership === own
                          ? "bg-indigo-600 text-white font-semibold"
                          : "bg-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                      onClick={() => setVisualOwnership(own)}
                    >
                      {own}
                    </button>
                  ))}
                </div>
              </div>

              {/* Safe Zone Presets */}
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2 text-xs">
                <span className="text-slate-400 font-semibold block">Zona Segura de Plataforma:</span>
                <select
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs"
                  value={currentSafeZone.presetId}
                  onChange={(e) => setSafeZone(e.target.value)}
                >
                  {SAFE_ZONE_PRESETS.map((sz: PlatformSafeZonePreset) => (
                    <option key={sz.presetId} value={sz.presetId}>
                      {sz.platform} (Top: {sz.topMarginPercent}%, Bot: {sz.bottomMarginPercent}%)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 block italic">
                  Fuente: {currentSafeZone.provenance.source}
                </span>
              </div>

              {/* Collision Tester */}
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-3 text-xs">
                <span className="text-slate-400 font-semibold block flex items-center justify-between">
                  <span>Inspector de Colisiones:</span>
                  <span className={`font-mono font-bold ${collisionResult === "CLEAR" ? "text-emerald-400" : "text-amber-400"}`}>
                    {collisionResult}
                  </span>
                </span>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Posición Gráfica Y:</span>
                    <span className="font-mono text-slate-300">{testBounds.motionY}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1920"
                    value={testBounds.motionY}
                    onChange={(e) => handleTestCollision("motionY", Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
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
