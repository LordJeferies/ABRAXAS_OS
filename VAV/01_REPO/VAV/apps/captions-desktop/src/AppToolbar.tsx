import React, {useRef} from "react";
import {
  Download,
  FolderOpen,
  PanelLeftClose,
  PlayCircle,
  Redo2,
  Settings2,
  Sparkles,
  Undo2
} from "lucide-react";
import {useUiState} from "./uiState.ts";

export const AppToolbar: React.FC<{onToggleRail: () => void}> = ({onToggleRail}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pendingMedia = useUiState((state) => state.pendingMedia);
  const setPendingMedia = useUiState((state) => state.setPendingMedia);
  const setActiveSection = useUiState((state) => state.setActiveSection);
  const setExportOpen = useUiState((state) => state.setExportOpen);
  const setNotice = useUiState((state) => state.setNotice);

  return (
    <header className="app-toolbar">
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="video/*,.mp4,.mov,.m4v,.webm"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          setPendingMedia({name:file.name,size:file.size,type:file.type || "video"});
          setActiveSection("media");
          setNotice({tone:"success",text:`Video seleccionado: ${file.name}. Continúa con el paso 2: Crear subtítulos.`});
          event.currentTarget.value = "";
        }}
      />

      <div className="toolbar-group">
        <button className="icon-button" onClick={onToggleRail} aria-label="Mostrar u ocultar menú" title="Mostrar u ocultar menú">
          <PanelLeftClose size={18} strokeWidth={1.8}/>
        </button>
        <div className="project-identity">
          <strong>Proyecto sin título</strong>
          <span>{pendingMedia ? pendingMedia.name : "VAV Captions"}</span>
        </div>
      </div>

      <div className="toolbar-group toolbar-center">
        <button className="toolbar-action" onClick={() => inputRef.current?.click()}>
          <FolderOpen size={17}/><span>Importar</span>
        </button>
        <button
          className="toolbar-action"
          disabled={!pendingMedia}
          onClick={() => {
            setActiveSection("transcript");
            setNotice({tone:"info",text:"Preparación abierta. La ejecución real de Whisper se conecta en la Corrida 04."});
          }}
        >
          <Sparkles size={17}/><span>Crear subtítulos</span>
        </button>
        <button
          className="toolbar-action"
          onClick={() => {
            setActiveSection("project");
            setNotice({tone:"info",text:"Vista previa enfocada. Usa los controles debajo del viewer."});
          }}
        >
          <PlayCircle size={17}/><span>Vista previa</span>
        </button>
      </div>

      <div className="toolbar-group toolbar-trailing">
        <button className="icon-button" disabled aria-label="Deshacer" title="Deshacer">
          <Undo2 size={17}/>
        </button>
        <button className="icon-button" disabled aria-label="Rehacer" title="Rehacer">
          <Redo2 size={17}/>
        </button>
        <button className="icon-button" onClick={() => setActiveSection("project")} aria-label="Ajustes" title="Ajustes">
          <Settings2 size={18}/>
        </button>
        <button className="export-button" onClick={() => setExportOpen(true)}>
          <Download size={17}/><span>Exportar</span>
        </button>
      </div>
    </header>
  );
};
