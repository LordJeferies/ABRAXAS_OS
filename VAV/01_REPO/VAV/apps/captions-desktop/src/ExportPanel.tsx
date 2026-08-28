import React from "react";
import {Download, X} from "lucide-react";
import {useUiState} from "./uiState.ts";

export const ExportPanel: React.FC = () => {
  const open = useUiState((state) => state.exportOpen);
  const setOpen = useUiState((state) => state.setExportOpen);
  const pendingMedia = useUiState((state) => state.pendingMedia);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
      <section className="export-panel" role="dialog" aria-modal="true" aria-label="Export VAV project" onMouseDown={(event) => event.stopPropagation()}>
        <div className="export-heading">
          <div><span className="eyebrow">EXPORT</span><strong>Render Output</strong></div>
          <button className="icon-button compact" aria-label="Close export panel" onClick={() => setOpen(false)}><X size={16}/></button>
        </div>

        <div className="export-grid">
          <label><span>Format</span><select defaultValue="mp4"><option value="mp4">MP4 · H.264</option></select></label>
          <label><span>Profile</span><select defaultValue="shorts"><option value="shorts">Generic 9:16</option></select></label>
          <label><span>Captions</span><select defaultValue="burned"><option value="burned">Burned-in</option></select></label>
        </div>

        <div className="export-readiness">
          <span className={`readiness-dot ${pendingMedia ? "warning" : ""}`}/>
          <div>
            <strong>{pendingMedia ? "Media selected, project not renderable yet" : "No real media imported yet"}</strong>
            <span>Final Remotion rendering is deliberately gated until the real media/caption pipeline exists.</span>
          </div>
        </div>

        <button className="render-button" disabled>
          <Download size={17}/> Render video
        </button>
      </section>
    </div>
  );
};
