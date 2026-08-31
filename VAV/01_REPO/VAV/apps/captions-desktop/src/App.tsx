import React, {useEffect, useMemo, useRef} from "react";
import {Player, type PlayerRef} from "@remotion/player";
import {CutsWorkspace} from "./CutsWorkspace.tsx";
import {MotionsWorkspace} from "./MotionsWorkspace.tsx";

import {createCaptionPlan} from "@vav/remotion-composition";
import {
  Activity, ArrowRight, Captions, Check, ChevronLeft, ChevronRight,
  CircleCheck, Download, FileText, FileVideo2, FolderOpen, Layers3,
  LoaderCircle, Merge, MonitorPlay, Move3D, Music2, Palette, Pause,
  Play, Redo2, Save, Scissors, ShieldCheck, Sparkles, Undo2, Upload,
  WandSparkles, LibraryBig, Eye, BadgeCheck, Database, RefreshCw
} from "lucide-react";
import {EngineHealth} from "./EngineHealth.tsx";
import {mergeCaptionStyleRegistry} from "@vav/caption-styles";
import {mergeMotionRegistry} from "@vav/caption-motion";
import {FullAlphaComposition} from "./FullAlphaComposition.tsx";
import {FullAlphaProviderSelector} from "./FullAlphaProviderSelector.tsx";
import {assetUrl} from "./fullAlphaBridge.ts";
import {
  captionAtFrame, formatUs, frameFromUs,
  placementCatalog, structureCatalog, usFromFrame
} from "./fullAlphaDomain.ts";
import {
  approveAbraxasImport, chooseAbraxasArtifacts, chooseAndImportVideo, chooseContentProjection, chooseMotionManifest,
  cancelQualityMp4, isQualityRenderActive, createRealCaptions, exportAlphaMp4, exportQualityMp4, exportRealSrt, loadVavProject, refreshAbraxasFoundation,
  runSceneSmartLite, saveVavProject
} from "./fullAlphaActions.ts";
import {useFullAlpha, type Section} from "./fullAlphaState.ts";


const nav: readonly [Section, string, React.ComponentType<{size?: number}>][] = [
  ["project", "Proyecto", Layers3],
  ["media", "Video", FileVideo2],
            ["cuts", "Cortes", Scissors],
  ["transcript", "Transcripción", FileText],
  ["captions", "Subtítulos", Captions],
  ["styles", "Estilos", Palette],
  ["structure", "Estructura", Layers3],
  ["motion", "Motion", Move3D],
  ["scene-smart", "Scene Smart", WandSparkles],
  ["context", "Contexto", Upload],
  ["abraxas", "ABRAXAS", LibraryBig],
  ["audio", "Audio", Music2],
  ["diagnostics", "Diagnóstico", Activity]
];

export const App: React.FC = () => {
  const playerRef = useRef<PlayerRef | null>(null);

  const section = useFullAlpha((s) => s.section);
  const media = useFullAlpha((s) => s.media);
  const projectFps = media?.fps && Number.isFinite(media.fps) && media.fps > 0 ? media.fps : 30;
  const captions = useFullAlpha((s) => s.captions);
  const selectedCaptionId = useFullAlpha((s) => s.selectedCaptionId);
  const design = useFullAlpha((s) => s.design);
  const scenes = useFullAlpha((s) => s.scenes);
  const contentCandidates = useFullAlpha((s) => s.contentCandidates);
  const motionContexts = useFullAlpha((s) => s.motionContexts);
  const abraxasImports = useFullAlpha((s) => s.abraxasImports);
  const approvedStylePresets = useFullAlpha((s) => s.approvedStylePresets);
  const approvedMotionPresets = useFullAlpha((s) => s.approvedMotionPresets);
  const previewStylePreset = useFullAlpha((s) => s.previewStylePreset);
  const previewMotionPreset = useFullAlpha((s) => s.previewMotionPreset);
  const visionReport = useFullAlpha((s) => s.visionReport);
  const reviewComplete = useFullAlpha((s) => s.reviewComplete);
  const designComplete = useFullAlpha((s) => s.designComplete);
  const transcriptionStatus = useFullAlpha((s) => s.transcriptionStatus);
  const sceneStatus = useFullAlpha((s) => s.sceneStatus);
  const exportStatus = useFullAlpha((s) => s.exportStatus);
  const currentFrame = useFullAlpha((s) => s.currentFrame);
  const playing = useFullAlpha((s) => s.playing);
  const notice = useFullAlpha((s) => s.notice);
  const undoStack = useFullAlpha((s) => s.undoStack);
  const redoStack = useFullAlpha((s) => s.redoStack);

  const setSection = useFullAlpha((s) => s.setSection);
  const selectCaption = useFullAlpha((s) => s.selectCaption);
  const editCaption = useFullAlpha((s) => s.editCaption);
  const toggleApproved = useFullAlpha((s) => s.toggleApproved);
  const splitCaption = useFullAlpha((s) => s.splitCaption);
  const mergePrevious = useFullAlpha((s) => s.mergePrevious);
  const markReviewComplete = useFullAlpha((s) => s.markReviewComplete);
  const patchDesign = useFullAlpha((s) => s.patchDesign);
  const markDesignComplete = useFullAlpha((s) => s.markDesignComplete);
  const previewAbraxasImport = useFullAlpha((s) => s.previewAbraxasImport);
  const clearAbraxasPreview = useFullAlpha((s) => s.clearAbraxasPreview);
  const setCurrentFrame = useFullAlpha((s) => s.setCurrentFrame);
  const setPlaying = useFullAlpha((s) => s.setPlaying);
  const setNotice = useFullAlpha((s) => s.setNotice);
  const undo = useFullAlpha((s) => s.undo);
  const redo = useFullAlpha((s) => s.redo);

  const durationUs = Math.max(
    media?.durationUs ?? 0,
    captions.at(-1)?.endUs ?? 0,
    20_000_000
  );
  const durationFrames = Math.max(1, frameFromUs(durationUs, projectFps));
  const videoUrl = media ? assetUrl(media.path) : null;
  const selected = captions.find((caption) => caption.id === selectedCaptionId) ?? null;
  const styleRegistry = useMemo(() => mergeCaptionStyleRegistry(approvedStylePresets), [approvedStylePresets]);
  const motionRegistry = useMemo(() => mergeMotionRegistry(approvedMotionPresets), [approvedMotionPresets]);
  const previewPlan = useMemo(() => createCaptionPlan({
    width: media?.width ?? 1080,
    height: media?.height ?? 1920,
    fps: projectFps,
    sourceFpsRational: media?.fpsRational ?? null,
    durationUs,
    captions,
    design,
    scenes,
    contentCandidates,
    motionContexts,
    approvedStylePresets,
    approvedMotionPresets,
    previewStylePreset,
    previewMotionPreset
  }), [media?.width, media?.height, media?.fps, media?.fpsRational, durationUs, captions, design, scenes, contentCandidates, motionContexts, approvedStylePresets, approvedMotionPresets, previewStylePreset, previewMotionPreset]);

  const completed = {
    video: Boolean(media),
    transcribe: captions.length > 0,
    review: reviewComplete,
    design: designComplete,
    export: exportStatus === "done"
  };

  const nextStep =
    !completed.video ? "video" :
    !completed.transcribe ? "transcribe" :
    !completed.review ? "review" :
    !completed.design ? "design" : "export";

  const seekTo = (frame: number) => {
    const clamped = Math.max(0, Math.min(durationFrames - 1, Math.round(frame)));
    playerRef.current?.seekTo(clamped);
    setCurrentFrame(clamped);
    const active = captionAtFrame(captions, clamped, projectFps);
    if (active) selectCaption(active.id);
  };

  const runNextStep = async () => {
    if (nextStep === "video") await chooseAndImportVideo();
    else if (nextStep === "transcribe") await createRealCaptions();
    else if (nextStep === "review") setSection("captions");
    else if (nextStep === "design") setSection("styles");
    else await exportQualityMp4();
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      const frame = player.getCurrentFrame();
      setCurrentFrame(frame);
      setPlaying(player.isPlaying());

      const active = captionAtFrame(captions, frame, projectFps);
      if (active && active.id !== useFullAlpha.getState().selectedCaptionId) {
        selectCaption(active.id);
      }
    }, 120);

    return () => window.clearInterval(id);
  }, [captions, selectCaption, setCurrentFrame, setPlaying]);

  useEffect(() => {
    void refreshAbraxasFoundation();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(id);
  }, [notice, setNotice]);

  const timelineCaptions = useMemo(() => captions.map((caption) => ({
    ...caption,
    left: `${(caption.startUs / durationUs) * 100}%`,
    width: `${Math.max(.5, ((caption.endUs - caption.startUs) / durationUs) * 100)}%`
  })), [captions, durationUs]);

  const inspector = (() => {
    if (section === "diagnostics") {
      return <div className="fa-inspector-scroll">
        <EngineHealth/>
        <div className="fa-card">
          <div className="fa-card-title">VAV VISION FOUNDATION</div>
          <button className="fa-secondary" onClick={() => void refreshAbraxasFoundation()}><RefreshCw size={14}/>Actualizar capabilities</button>
          <div className="fa-range-list">
            {(visionReport?.capabilities ?? []).slice(0, 24).map((cap) => (
              <div key={`${cap.provider}-${cap.id}`}>
                <b>{cap.id}</b><span>{cap.availability}</span><small>{cap.provider}</small>
              </div>
            ))}
          </div>
          <small>Apple Vision es la base nativa. SAM2/Cutie son providers opcionales; depth permanece planned hasta validación.</small>
        </div>
      </div>;
    }

    if (section === "media") {
      return (
        <div className="fa-card">
          <div className="fa-card-title">MEDIA REAL</div>
          {media ? (
            <>
              <strong>{media.name}</strong>
              <div className="fa-properties">
                <span>Duración <b>{formatUs(media.durationUs)}</b></span>
                <span>Resolución <b>{media.width}×{media.height}</b></span>
                <span>FPS <b>{media.fps?.toFixed(3) ?? "—"}</b></span>
                <span>Video <b>{media.videoCodec ?? "—"}</b></span>
                <span>Audio <b>{media.audioCodec ?? "—"}</b></span>
              </div>
              <button className="fa-primary" onClick={() => void chooseAndImportVideo()}>
                <FolderOpen size={15}/>Cambiar video
              </button>
            </>
          ) : (
            <button className="fa-primary" onClick={() => void chooseAndImportVideo()}>
              <FolderOpen size={15}/>Importar video
            </button>
          )}
        </div>
      );
    }

    if (section === "transcript") {
      return (
        <div className="fa-inspector-scroll">
          <FullAlphaProviderSelector/>
          <div className="fa-card">
            <div className="fa-card-title">TRANSCRIPCIÓN</div>
            <span>Estado: <b>{transcriptionStatus}</b></span>
            <span>Bloques: <b>{captions.length}</b></span>
            <button
              className="fa-primary"
              disabled={!media || transcriptionStatus === "running"}
              onClick={() => void createRealCaptions()}
            >
              {transcriptionStatus === "running"
                ? <LoaderCircle className="fa-spin" size={15}/>
                : <Sparkles size={15}/>}
              {transcriptionStatus === "running" ? "Transcribiendo..." : "Crear subtítulos"}
            </button>
          </div>
        </div>
      );
    }

    if (section === "captions") {
      return (
        <div className="fa-card">
          <div className="fa-card-title">REVISIÓN</div>
          {selected ? (
            <>
              <label className="fa-field">Texto
                <textarea
                  value={selected.text}
                  onChange={(event) => editCaption(selected.id, event.target.value)}
                />
              </label>
              <div className="fa-properties">
                <span>Inicio <b>{formatUs(selected.startUs)}</b></span>
                <span>Fin <b>{formatUs(selected.endUs)}</b></span>
                <span>Timing <b>{selected.timingQuality}</b></span>
              </div>
              <div className="fa-button-grid">
                <button onClick={() => toggleApproved(selected.id)}>
                  <CircleCheck size={14}/>{selected.approved ? "Aprobado" : "Aprobar"}
                </button>
                <button onClick={() => splitCaption(selected.id)}>
                  <Scissors size={14}/>Dividir
                </button>
                <button onClick={() => mergePrevious(selected.id)}>
                  <Merge size={14}/>Unir anterior
                </button>
              </div>
            </>
          ) : <p>Selecciona un bloque del documento o timeline.</p>}

          <button className="fa-primary" disabled={!captions.length} onClick={markReviewComplete}>
            <ShieldCheck size={15}/>Marcar revisión completa
          </button>
        </div>
      );
    }

    if (section === "styles") {
      return (
        <div className="fa-card">
          <div className="fa-card-title">ESTILO</div>
          <div className="fa-preset-list">
            {styleRegistry.map((item) => (
              <button
                key={item.id}
                className={design.styleId === item.id ? "active" : ""}
                onClick={() => patchDesign({styleId: item.id})}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button className="fa-primary" onClick={() => {
            markDesignComplete();
            setSection("structure");
          }}>
            <Check size={15}/>Aplicar diseño
          </button>
        </div>
      );
    }

    if (section === "structure") {
      return (
        <div className="fa-card">
          <div className="fa-card-title">ESTRUCTURA + POSICIÓN</div>
          <div className="fa-preset-list">
            {structureCatalog.map((item) => (
              <button
                key={item.id}
                className={design.structureId === item.id ? "active" : ""}
                onClick={() => patchDesign({structureId: item.id})}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="fa-field">Posición
            <select
              value={design.placement}
              onChange={(event) => patchDesign({
                placement: event.target.value as typeof design.placement
              })}
            >
              {placementCatalog.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="fa-toggle">
            <input
              type="checkbox"
              checked={design.safeZones}
              onChange={(event) => patchDesign({safeZones: event.target.checked})}
            />
            Mostrar safe zones
          </label>
        </div>
      );
    }

    if (section === "motion") {
      return (
        <div className="fa-card">
          <div className="fa-card-title">CAPTION MOTION</div>
          <div className="fa-preset-list">
            {motionRegistry.map((item) => (
              <button
                key={item.id}
                className={design.motionId === item.id ? "active" : ""}
                onClick={() => patchDesign({motionId: item.id})}
              >
                {item.label}
              </button>
            ))}
          </div>
          <hr/>
          <strong>Motion Contexts: {motionContexts.length}</strong>
          <button className="fa-secondary" onClick={() => void chooseMotionManifest()}>
            <Upload size={14}/>Importar manifest
          </button>
          <small>Motion 03 puede suprimir captions estándar. B-roll puede requerir Scene Smart.</small>
        </div>
      );
    }

    if (section === "scene-smart") {
      return (
        <div className="fa-card">
          <div className="fa-card-title">SCENE SMART LITE</div>
          <span>Escenas: <b>{scenes.length}</b></span>
          <span>Estado: <b>{sceneStatus}</b></span>
          <button
            className="fa-primary"
            disabled={!media || sceneStatus === "running"}
            onClick={() => void runSceneSmartLite()}
          >
            {sceneStatus === "running"
              ? <LoaderCircle className="fa-spin" size={15}/>
              : <WandSparkles size={15}/>}
            Analizar escenas
          </button>
          <small>Cortes reales + priors deterministas. Face tracking fino queda en hardening.</small>
        </div>
      );
    }

    if (section === "context") {
      return (
        <div className="fa-card">
          <div className="fa-card-title">CONTENT PROJECTION</div>
          <span>Rangos importados: <b>{contentCandidates.length}</b></span>
          <button className="fa-primary" onClick={() => void chooseContentProjection()}>
            <Upload size={14}/>Importar TXT / HTML / JSON
          </button>
          <div className="fa-range-list">
            {contentCandidates.slice(0, 8).map((item) => (
              <div key={item.id}>
                <b>{item.role}</b>
                <span>{formatUs(item.startUs)}–{formatUs(item.endUs)}</span>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section === "abraxas") {
      return (
        <div className="fa-inspector-scroll">
          <div className="fa-card">
            <div className="fa-card-title">ABRAXAS PRESET LAB</div>
            <p>TXT/MD/JSON se analizan como datos. HTML queda reference-only. TS/JS no se ejecutan.</p>
            <div className="fa-button-grid">
              <button className="fa-primary" onClick={() => void chooseAbraxasArtifacts("candidate")}><Upload size={14}/>Importar Candidate</button>
              <button onClick={() => void chooseAbraxasArtifacts("approved")}><BadgeCheck size={14}/>Importar confiable</button>
            </div>
            {(previewStylePreset || previewMotionPreset) && (
              <button className="fa-secondary" onClick={clearAbraxasPreview}><Eye size={14}/>Salir de preview</button>
            )}
            <div className="fa-properties">
              <span>Styles aprobados <b>{approvedStylePresets.length}</b></span>
              <span>Motions aprobados <b>{approvedMotionPresets.length}</b></span>
              <span>Imports sesión/proyecto <b>{abraxasImports.length}</b></span>
            </div>
          </div>
          <div className="fa-card">
            <div className="fa-card-title">IMPORTS</div>
            <div className="fa-range-list">
              {abraxasImports.length ? abraxasImports.map((item) => (
                <div key={item.importId}>
                  <b>{item.artifact.title}</b>
                  <span>{item.artifact.kind} · {item.artifact.status}</span>
                  <small>{item.artifact.executable ? "Preset ejecutable" : "Reference / evidence only"}</small>
                  {item.artifact.warnings.map((warning, index) => <small key={index}>{warning}</small>)}
                  {item.artifact.executable && (
                    <div className="fa-button-grid">
                      <button onClick={() => previewAbraxasImport(item.importId)}><Eye size={13}/>Preview</button>
                      <button onClick={() => void approveAbraxasImport(item.importId)}><BadgeCheck size={13}/>Aprobar</button>
                    </div>
                  )}
                </div>
              )) : <small>Importa las fichas producidas por el análisis ABRAXAS.</small>}
            </div>
          </div>
          <div className="fa-card">
            <div className="fa-card-title">REGLA DE CONFIANZA</div>
            <small>Candidate → Preview → Approve es el flujo por defecto. “Importar confiable” solo debe usarse con fichas propias ya revisadas. QVR, shot/depth/spatial cards y datasets V3.1 se conservan como evidencia, no como código ejecutable.</small>
          </div>
        </div>
      );
    }

    if (section === "audio") {
      return (
        <div className="fa-card">
          <div className="fa-card-title">AUDIO</div>
          {media ? (
            <div className="fa-properties">
              <span>Codec <b>{media.audioCodec ?? "—"}</b></span>
              <span>Pistas <b>{media.audioTracks}</b></span>
            </div>
          ) : <p>Importa un video.</p>}
          <small>Waveform/edit avanzado se endurece después de Full Alpha.</small>
        </div>
      );
    }

    return (
      <div className="fa-inspector-scroll">
        <div className="fa-card">
          <div className="fa-card-title">PROYECTO</div>
          <div className="fa-properties">
            <span>Video <b>{media ? "Listo" : "Pendiente"}</b></span>
            <span>Captions <b>{captions.length}</b></span>
            <span>Revisión <b>{reviewComplete ? "Completa" : "Pendiente"}</b></span>
            <span>Diseño <b>{designComplete ? "Aplicado" : "Pendiente"}</b></span>
          </div>
          <div className="fa-button-grid">
            <button onClick={() => void saveVavProject()}><Save size={14}/>Guardar</button>
            <button onClick={() => void loadVavProject()}><FolderOpen size={14}/>Abrir</button>
          </div>
        </div>
        <FullAlphaProviderSelector/>
      </div>
    );
  })();

  return (
    <main className="fa-app">
      <header className="fa-topbar">
        <div className="fa-brand">
          <span>V</span>
          <div><strong>VAV Captions</strong><small>FULL ALPHA</small></div>
        </div>

        <div className="fa-top-actions">
          <button onClick={() => void chooseAndImportVideo()}>
            <FolderOpen size={15}/>Importar video
          </button>
          <button
            disabled={!media || transcriptionStatus === "running"}
            onClick={() => void createRealCaptions()}
          >
            <Sparkles size={15}/>Crear subtítulos
          </button>
          <button disabled={!undoStack.length} onClick={undo} aria-label="Deshacer">
            <Undo2 size={15}/>
          </button>
          <button disabled={!redoStack.length} onClick={redo} aria-label="Rehacer">
            <Redo2 size={15}/>
          </button>
          {exportStatus === "running" && isQualityRenderActive() ? (
            <button className="fa-export-button" onClick={() => void cancelQualityMp4()}>
              <LoaderCircle className="fa-spin" size={15}/>Cancelar Quality
            </button>
          ) : (
            <button
              className="fa-export-button"
              disabled={!media || !captions.length}
              onClick={() => void exportQualityMp4()}
            >
              <Download size={15}/>Exportar MP4 Quality
            </button>
          )}
        </div>
      </header>

      <div className="fa-body">
        <aside className="fa-nav">
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={section === id ? "active" : ""}
              onClick={() => setSection(id)}
            >
              <Icon size={17}/><span>{label}</span>
            </button>
          ))}
        </aside>

        <section className="fa-main">
          {section === "cuts" && <CutsWorkspace />}
          {section === "motion" && <MotionsWorkspace />}
          {section !== "cuts" && section !== "motion" && (<>
          <div className="fa-workflow">
            <div><small>FLUJO</small><strong>¿Qué hago ahora?</strong></div>
            {[
              ["video", 1, "Video", completed.video],
              ["transcribe", 2, "Transcribir", completed.transcribe],
              ["review", 3, "Revisar", completed.review],
              ["design", 4, "Diseñar", completed.design],
              ["export", 5, "Exportar", completed.export]
            ].map(([id, n, label, done]) => (
              <div
                key={String(id)}
                className={`fa-step ${done ? "done" : nextStep === id ? "current" : ""}`}
              >
                <b>{done ? "✓" : n}</b><span>{label}</span>
              </div>
            ))}
            <button className="fa-next" onClick={() => void runNextStep()}>
              <span>
                <small>SIGUIENTE PASO</small>
                <strong>{
                  nextStep === "video" ? "Importar video" :
                  nextStep === "transcribe" ? "Crear subtítulos" :
                  nextStep === "review" ? "Revisar texto" :
                  nextStep === "design" ? "Diseñar captions" : "Exportar MP4"
                }</strong>
              </span>
              <ArrowRight size={17}/>
            </button>
          </div>

          <section className="fa-viewer-panel">
            <div className="fa-panel-head">
              <div><small>VIEWER</small><strong>{media?.name ?? "Sin video"}</strong></div>
              <div className="fa-badges">
                <span>{design.styleId}</span>
                <span>{design.structureId}</span>
                <span>{design.placement}</span>
              </div>
            </div>

            <div className="fa-viewer">
              <div className="fa-player-frame">
                <Player
                  ref={playerRef}
                  component={FullAlphaComposition}
                  inputProps={{plan: previewPlan, videoUrl, sourceMediaName: null, showGuides: true}}
                  durationInFrames={durationFrames}
                  compositionWidth={previewPlan.width}
                  compositionHeight={previewPlan.height}
                  fps={previewPlan.fps}
                  controls={false}
                  loop
                  clickToPlay
                  spaceKeyToPlayOrPause
                  style={{width: "100%", height: "100%"}}
                />
              </div>
            </div>

            <div className="fa-transport">
              <div>
                <button onClick={() => seekTo(Math.max(0, currentFrame - 1))}>
                  <ChevronLeft size={16}/>
                </button>
                <button className="fa-play" onClick={() => playerRef.current?.toggle()}>
                  {playing ? <Pause size={15}/> : <Play size={15}/>}
                </button>
                <button onClick={() => seekTo(Math.min(durationFrames - 1, currentFrame + 1))}>
                  <ChevronRight size={16}/>
                </button>
              </div>
              <strong>
                {formatUs(usFromFrame(currentFrame, projectFps))}
                <span> / {formatUs(durationUs)}</span>
              </strong>
              <button onClick={() => playerRef.current?.requestFullscreen()}>
                <MonitorPlay size={15}/>Fullscreen
              </button>
            </div>
          </section>

          <section className="fa-bottom">
            <div className="fa-timeline-panel">
              <div className="fa-panel-head">
                <div><small>TIMELINE</small><strong>Scenes · Content · Captions · Motion</strong></div>
                <span>{formatUs(durationUs)}</span>
              </div>

              <div className="fa-timeline">
                <button
                  className="fa-seek-layer"
                  aria-label="Mover playhead"
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    const ratio = (event.clientX - rect.left) / rect.width;
                    seekTo(frameFromUs(Math.max(0, Math.min(1, ratio)) * durationUs, projectFps));
                  }}
                />

                <div
                  className="fa-playhead"
                  style={{left: `${(usFromFrame(currentFrame, projectFps) / durationUs) * 100}%`}}
                />

                <div className="fa-lane">
                  <label>SCENE</label>
                  {scenes.map((scene) => (
                    <span
                      key={scene.id}
                      className="fa-clip scene"
                      style={{
                        left: `${scene.startUs / durationUs * 100}%`,
                        width: `${Math.max(.6, (scene.endUs - scene.startUs) / durationUs * 100)}%`
                      }}
                    >{scene.id}</span>
                  ))}
                </div>

                <div className="fa-lane">
                  <label>CONTENT</label>
                  {contentCandidates.map((candidate) => (
                    <span
                      key={candidate.id}
                      className={`fa-clip content ${candidate.role}`}
                      style={{
                        left: `${candidate.startUs / durationUs * 100}%`,
                        width: `${Math.max(.6, (candidate.endUs - candidate.startUs) / durationUs * 100)}%`
                      }}
                    >{candidate.role}</span>
                  ))}
                </div>

                <div className="fa-lane">
                  <label>CAPTION</label>
                  {timelineCaptions.map((caption) => (
                    <button
                      key={caption.id}
                      className={`fa-clip caption ${caption.id === selectedCaptionId ? "active" : ""}`}
                      style={{left: caption.left, width: caption.width}}
                      title={caption.text}
                      onClick={(event) => {
                        event.stopPropagation();
                        selectCaption(caption.id);
                        seekTo(frameFromUs(caption.startUs, projectFps));
                      }}
                    >{caption.text}</button>
                  ))}
                </div>

                <div className="fa-lane">
                  <label>MOTION</label>
                  {motionContexts.map((motion) => (
                    <span
                      key={motion.id}
                      className="fa-clip motion"
                      style={{
                        left: `${motion.startUs / durationUs * 100}%`,
                        width: `${Math.max(.6, (motion.endUs - motion.startUs) / durationUs * 100)}%`
                      }}
                    >{motion.family}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="fa-document-panel">
              <div className="fa-panel-head">
                <div><small>CAPTION DOCUMENT</small><strong>Lectura y revisión completa</strong></div>
                <span>{captions.length} bloques</span>
              </div>
              <div className="fa-document">
                {!captions.length && (
                  <div className="fa-empty">
                    <Captions size={24}/>
                    <strong>Todavía no hay subtítulos</strong>
                    <span>Importa un video y pulsa Crear subtítulos.</span>
                  </div>
                )}

                {captions.map((caption) => (
                  <button
                    key={caption.id}
                    className={caption.id === selectedCaptionId ? "active" : ""}
                    onClick={() => {
                      selectCaption(caption.id);
                      seekTo(frameFromUs(caption.startUs, projectFps));
                    }}
                  >
                    <span>{formatUs(caption.startUs)}</span>
                    <p>{caption.text}</p>
                    <b>{caption.approved ? "✓" : ""}</b>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>)}
        </section>

        <aside className="fa-inspector">
          <div className="fa-inspector-head">
            <small>INSPECTOR</small><strong>{section.replace("-", " ")}</strong>
          </div>
          {inspector}
          <div className="fa-export-tools">
            <button disabled={!captions.length} onClick={() => void exportRealSrt()}>
              <Download size={14}/>SRT
            </button>
            {exportStatus === "running" && isQualityRenderActive() ? (
              <button onClick={() => void cancelQualityMp4()}><LoaderCircle className="fa-spin" size={14}/>Cancelar</button>
            ) : (
              <button disabled={!media || !captions.length} onClick={() => void exportQualityMp4()}>
                <Download size={14}/>MP4 Quality
              </button>
            )}
            <button disabled={!media || !captions.length || exportStatus === "running"} onClick={() => void exportAlphaMp4()}>
              <Download size={14}/>MP4 Fast ASS
            </button>
          </div>
        </aside>
      </div>

      {notice && <div className={`fa-toast ${notice.tone}`}>{notice.text}</div>}
    </main>
  );
};
