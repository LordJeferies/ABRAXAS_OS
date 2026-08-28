import {createCaptionPlan} from "@vav/remotion-composition";
import {open, save} from "@tauri-apps/plugin-dialog";
import {
  analyzeScenes,
  approveAbraxas,
  exportMp4,
  exportQualityMp4 as exportQualityMp4Bridge,
  exportSrt,
  importAbraxas,
  importContent,
  importMotion,
  loadAbraxasRegistry,
  loadProject,
  probeMedia,
  saveProject,
  transcribeMedia,
  visionCapabilities,
  renderProgress,
  cancelQualityRender
} from "./fullAlphaBridge.ts";
import {useFullAlpha} from "./fullAlphaState.ts";

export const chooseAndImportVideo = async () => {
  const selected = await open({
    multiple: false,
    directory: false,
    title: "1 · Importar video a VAV Captions",
    filters: [{name: "Video", extensions: ["mp4", "mov", "m4v", "webm", "mkv"]}]
  });
  if (typeof selected !== "string") return false;

  const state = useFullAlpha.getState();
  state.setNotice({tone: "info", text: "Leyendo metadatos reales con ffprobe..."});

  try {
    const probe = await probeMedia(selected);
    state.resetForMedia(probe);
    state.setNotice({
      tone: "success",
      text: `Video listo: ${probe.name}. Siguiente paso: Crear subtítulos.`
    });
    return true;
  } catch (error) {
    state.setNotice({
      tone: "warning",
      text: `Import falló: ${error instanceof Error ? error.message : String(error)}`
    });
    return false;
  }
};

export const createRealCaptions = async () => {
  const state = useFullAlpha.getState();
  if (!state.media) {
    await chooseAndImportVideo();
    return false;
  }
  if (state.transcriptionStatus === "running") return false;

  state.setTranscriptionStatus("running");
  state.setSection("transcript");
  state.setNotice({
    tone: "info",
    text: `Transcribiendo localmente con ${state.provider === "whisper-cpp" ? "Whisper.cpp Large V3 Turbo FULL" : "MLX Whisper"}...`
  });

  try {
    const result = await transcribeMedia(state.media.path, state.provider, state.modelId);
    state.replaceCaptions(result.captions, result.language);
    state.setTranscriptionStatus("done");
    state.setNotice({
      tone: "success",
      text: `${result.captions.length} bloques reales creados. Ahora revisa el texto.`
    });
    return true;
  } catch (error) {
    state.setTranscriptionStatus("error");
    state.setNotice({
      tone: "warning",
      text: `Transcripción falló: ${error instanceof Error ? error.message : String(error)}`
    });
    return false;
  }
};

export const runSceneSmartLite = async () => {
  const state = useFullAlpha.getState();
  if (!state.media || state.sceneStatus === "running") return false;

  state.setSceneStatus("running");
  state.setSection("scene-smart");
  state.setNotice({tone: "info", text: "Detectando cortes reales con FFmpeg..."});

  try {
    const scenes = await analyzeScenes(state.media.path, state.media.durationUs);
    state.setScenes(scenes);
    state.setSceneStatus("done");
    state.setNotice({
      tone: "success",
      text: `Scene Map listo: ${scenes.length} escenas. Auto placement ya puede usarlas.`
    });
    return true;
  } catch (error) {
    state.setSceneStatus("error");
    state.setNotice({
      tone: "warning",
      text: `Scene analysis falló: ${error instanceof Error ? error.message : String(error)}`
    });
    return false;
  }
};

export const chooseContentProjection = async () => {
  const selected = await open({
    multiple: false,
    directory: false,
    title: "Importar Content Projection",
    filters: [{name: "Contexto", extensions: ["txt", "md", "html", "htm", "json"]}]
  });
  if (typeof selected !== "string") return false;

  const state = useFullAlpha.getState();
  try {
    const result = await importContent(selected);
    state.setContentCandidates(result.items);
    state.setSection("context");
    state.setNotice({tone: "success", text: `Contexto importado: ${result.items.length} rangos.`});
    return true;
  } catch (error) {
    state.setNotice({
      tone: "warning",
      text: `Contexto falló: ${error instanceof Error ? error.message : String(error)}`
    });
    return false;
  }
};

export const chooseMotionManifest = async () => {
  const selected = await open({
    multiple: false,
    directory: false,
    title: "Importar Motion Contexts",
    filters: [{name: "Motion manifest", extensions: ["txt", "md", "json"]}]
  });
  if (typeof selected !== "string") return false;

  const state = useFullAlpha.getState();
  try {
    const result = await importMotion(selected);
    state.setMotionContexts(result.items);
    state.setSection("motion");
    state.setNotice({tone: "success", text: `${result.items.length} motion contexts importados.`});
    return true;
  } catch (error) {
    state.setNotice({
      tone: "warning",
      text: `Motions fallaron: ${error instanceof Error ? error.message : String(error)}`
    });
    return false;
  }
};

export const saveVavProject = async () => {
  const path = await save({
    title: "Guardar proyecto VAV",
    defaultPath: "vav-project.vav.json",
    filters: [{name: "VAV Project", extensions: ["json"]}]
  });
  if (!path) return false;

  const state = useFullAlpha.getState();
  try {
    await saveProject(path, state.serializable());
    state.setNotice({tone: "success", text: `Proyecto guardado: ${path}`});
    return true;
  } catch (error) {
    state.setNotice({
      tone: "warning",
      text: `Guardar falló: ${error instanceof Error ? error.message : String(error)}`
    });
    return false;
  }
};

export const loadVavProject = async () => {
  const path = await open({
    multiple: false,
    directory: false,
    title: "Abrir proyecto VAV",
    filters: [{name: "VAV Project", extensions: ["json"]}]
  });
  if (typeof path !== "string") return false;

  const state = useFullAlpha.getState();
  try {
    const project = await loadProject(path);
    state.hydrate(project);
    state.setNotice({tone: "success", text: "Proyecto VAV cargado."});
    return true;
  } catch (error) {
    state.setNotice({
      tone: "warning",
      text: `Abrir proyecto falló: ${error instanceof Error ? error.message : String(error)}`
    });
    return false;
  }
};

export const exportRealSrt = async () => {
  const state = useFullAlpha.getState();
  if (!state.captions.length) return false;

  const path = await save({
    title: "Exportar SRT",
    defaultPath: "captions.srt",
    filters: [{name: "SubRip", extensions: ["srt"]}]
  });
  if (!path) return false;

  try {
    await exportSrt(path, state.captions);
    state.setNotice({tone: "success", text: `SRT exportado: ${path}`});
    return true;
  } catch (error) {
    state.setNotice({
      tone: "warning",
      text: `SRT falló: ${error instanceof Error ? error.message : String(error)}`
    });
    return false;
  }
};


let activeQualityJobId: string | null = null;
export const isQualityRenderActive = () => activeQualityJobId !== null;

export const cancelQualityMp4 = async () => {
  const state = useFullAlpha.getState();
  if (!activeQualityJobId || state.exportStatus !== "running") return false;
  try {
    await cancelQualityRender(activeQualityJobId);
    state.setNotice({tone: "info", text: "Cancelando Remotion Quality..."});
    return true;
  } catch (error) {
    state.setNotice({tone: "warning", text: `No se pudo solicitar cancelación: ${error instanceof Error ? error.message : String(error)}`});
    return false;
  }
};

export const exportQualityMp4 = async () => {
  const state = useFullAlpha.getState();
  if (!state.media || !state.captions.length || state.exportStatus === "running") return false;

  const path = await save({
    title: "Exportar MP4 · Remotion Quality",
    defaultPath: "vav-captioned-quality.mp4",
    filters: [{name: "MP4", extensions: ["mp4"]}]
  });
  if (!path) return false;

  const durationUs = Math.max(state.media.durationUs, state.captions.at(-1)?.endUs ?? 0, 1_000_000);
  const plan = createCaptionPlan({
    width: state.media.width,
    height: state.media.height,
    fps: state.media.fps ?? 30,
    sourceFpsRational: state.media.fpsRational,
    durationUs,
    captions: state.captions,
    design: state.design,
    scenes: state.scenes,
    contentCandidates: state.contentCandidates,
    motionContexts: state.motionContexts,
    approvedStylePresets: state.approvedStylePresets,
    approvedMotionPresets: state.approvedMotionPresets,
    previewStylePreset: state.previewStylePreset,
    previewMotionPreset: state.previewMotionPreset
  });
  const jobId = `vav-quality-${Date.now()}`;
  activeQualityJobId = jobId;

  state.setExportStatus("running");
  state.setNotice({tone: "info", text: "Preparando Remotion Quality. Preview y export usan el mismo CaptionPlan..."});

  let polling = true;
  const poll = async () => {
    while (polling) {
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      if (!polling) break;
      try {
        const status = await renderProgress(jobId);
        if (status.state === "rendering" || status.state === "preparing") {
          const pct = Math.max(0, Math.min(100, Math.round((status.progress ?? 0) * 100)));
          state.setNotice({tone: "info", text: `Remotion Quality · ${status.state} · ${pct}%`});
        }
      } catch {
        // Progress is best-effort; the actual render promise remains authoritative.
      }
    }
  };
  void poll();

  try {
    const result = await exportQualityMp4Bridge({
      inputPath: state.media.path,
      outputPath: path,
      plan,
      jobId
    });
    state.setExportStatus("done");
    state.setNotice({tone: "success", text: `MP4 Quality exportado con ${result.renderer}: ${path}`});
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/cancel/i.test(message)) {
      state.setExportStatus("idle");
      state.setNotice({tone: "info", text: "Remotion Quality cancelado."});
    } else {
      state.setExportStatus("error");
      state.setNotice({tone: "warning", text: `Remotion Quality falló: ${message}`});
    }
    return false;
  } finally {
    polling = false;
    activeQualityJobId = null;
  }
};

export const exportAlphaMp4 = async () => {
  const state = useFullAlpha.getState();
  if (!state.media || !state.captions.length || state.exportStatus === "running") return false;

  const path = await save({
    title: "Exportar MP4 Full Alpha",
    defaultPath: "vav-captioned-fast-ass.mp4",
    filters: [{name: "MP4", extensions: ["mp4"]}]
  });
  if (!path) return false;

  state.setExportStatus("running");
  state.setNotice({tone: "info", text: "Renderizando MP4 Fast/Compatibility con FFmpeg + ASS..."});

  try {
    await exportMp4({
      inputPath: state.media.path,
      outputPath: path,
      captions: state.captions,
      design: state.design,
      motionContexts: state.motionContexts,
      contentCandidates: state.contentCandidates,
      width: state.media.width,
      height: state.media.height
    });
    state.setExportStatus("done");
    state.setNotice({tone: "success", text: `MP4 exportado: ${path}`});
    return true;
  } catch (error) {
    state.setExportStatus("error");
    state.setNotice({
      tone: "warning",
      text: `MP4 falló: ${error instanceof Error ? error.message : String(error)}`
    });
    return false;
  }
};


export const refreshAbraxasFoundation = async () => {
  const state = useFullAlpha.getState();
  try {
    const [registry, vision] = await Promise.all([
      loadAbraxasRegistry(),
      visionCapabilities()
    ]);
    state.setAbraxasRegistry(registry.approvedStyles, registry.approvedMotions);
    state.setVisionReport(vision);
    return true;
  } catch (error) {
    state.setNotice({
      tone: "warning",
      text: `Foundation refresh falló: ${error instanceof Error ? error.message : String(error)}`
    });
    return false;
  }
};

export const chooseAbraxasArtifacts = async (trust: "candidate" | "approved" = "candidate") => {
  const selected = await open({
    multiple: true,
    directory: false,
    title: trust === "approved" ? "Importar ABRAXAS como aprobado" : "Importar fichas / referencias ABRAXAS",
    filters: [{name: "ABRAXAS data", extensions: ["txt", "md", "json", "html", "htm"]}]
  });
  const paths = typeof selected === "string" ? [selected] : Array.isArray(selected) ? selected : [];
  if (!paths.length) return false;

  const state = useFullAlpha.getState();
  let importedCount = 0;
  let executableCount = 0;

  for (const path of paths) {
    try {
      const result = await importAbraxas(path, trust);
      const provenance = result.provenance ?? {
        sourceName: path.split("/").at(-1) ?? path,
        sourcePath: path,
        sha256: `${Date.now()}-${importedCount}`,
        kind: result.artifact.kind,
        importedAt: new Date().toISOString()
      };
      state.addAbraxasImport({
        importId: provenance.sha256,
        sourcePath: path,
        importedAt: provenance.importedAt,
        artifact: result.artifact
      });
      if (result.registry) state.setAbraxasRegistry(result.registry.approvedStyles, result.registry.approvedMotions);
      importedCount += 1;
      if (result.artifact.executable) executableCount += 1;
    } catch (error) {
      state.setNotice({
        tone: "warning",
        text: `No pude importar ${path.split("/").at(-1)}: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }

  state.setSection("abraxas");
  state.setNotice({
    tone: "success",
    text: `${importedCount} archivos ABRAXAS leídos; ${executableCount} contienen presets ejecutables. ${trust === "candidate" ? "Revisa/preview antes de aprobar." : "Los ejecutables confiables fueron aprobados."}`
  });
  return importedCount > 0;
};

export const approveAbraxasImport = async (importId: string) => {
  const state = useFullAlpha.getState();
  const record = state.abraxasImports.find((x) => x.importId === importId);
  if (!record?.artifact.executable) {
    state.setNotice({tone: "warning", text: "Esta ficha es evidencia/reference-only y no puede aprobarse como preset ejecutable."});
    return false;
  }

  try {
    const result = await approveAbraxas(record.artifact, record.sourcePath);
    state.setAbraxasRegistry(result.registry.approvedStyles, result.registry.approvedMotions);
    const style = record.artifact.stylePreset;
    const motion = record.artifact.motionPreset;
    if (style) state.patchDesign({styleId: style.id, structureId: style.structure.preferred, motionId: style.motion.family});
    if (motion) state.patchDesign({motionId: motion.id});
    state.clearAbraxasPreview();
    state.setNotice({tone: "success", text: `Preset aprobado y guardado en Registry: ${record.artifact.title}`});
    return true;
  } catch (error) {
    state.setNotice({tone: "warning", text: `Aprobación falló: ${error instanceof Error ? error.message : String(error)}`});
    return false;
  }
};
