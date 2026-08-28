import React from "react";
import {
  Activity,
  Captions,
  CheckCircle2,
  FileVideo2,
  Layers3,
  Lock,
  Move3D,
  Palette,
  Sparkles
} from "lucide-react";
import {EngineHealth} from "./EngineHealth.tsx";
import {ProviderSelector} from "./ProviderSelector.tsx";
import {getCaptionById} from "./editorData.ts";
import {useUiState} from "./uiState.ts";

const Placeholder: React.FC<{title: string; text: string}> = ({title, text}) => (
  <section className="inspector-section">
    <div className="section-title">
      <div><span className="eyebrow">WORKSPACE</span><strong>{title}</strong></div>
      <Sparkles size={16} className="section-icon"/>
    </div>
    <p className="section-copy">{text}</p>
  </section>
);

export const InspectorPanel: React.FC = () => {
  const activeSection = useUiState((state) => state.activeSection);
  const selectedCaptionId = useUiState((state) => state.selectedCaptionId);
  const pendingMedia = useUiState((state) => state.pendingMedia);
  const selectedCaption = getCaptionById(selectedCaptionId);

  if (activeSection === "diagnostics") {
    return (
      <aside className="inspector">
        <div className="inspector-heading">
          <div><span className="eyebrow">DIAGNOSTICS</span><strong>Engine Registry</strong></div>
          <span className="meta-chip">DEV</span>
        </div>
        <EngineHealth/>
      </aside>
    );
  }

  return (
    <aside className="inspector">
      <div className="inspector-heading">
        <div><span className="eyebrow">INSPECTOR</span><strong>{activeSection.replace("-", " ")}</strong></div>
        <span className="meta-chip">LOCAL</span>
      </div>

      {activeSection === "project" && (
        <>
          <section className="inspector-section">
            <div className="section-title">
              <div><span className="eyebrow">PROJECT</span><strong>Workspace</strong></div>
              <Layers3 size={16} className="section-icon"/>
            </div>
            <div className="property-list">
              <div><span>Format</span><strong>9:16</strong></div>
              <div><span>Preview</span><strong>Remotion</strong></div>
              <div><span>Media</span><strong>{pendingMedia ? "Selected" : "Not imported"}</strong></div>
            </div>
          </section>
          <ProviderSelector/>
        </>
      )}

      {activeSection === "media" && (
        <section className="inspector-section">
          <div className="section-title">
            <div><span className="eyebrow">MEDIA</span><strong>Source</strong></div>
            <FileVideo2 size={16} className="section-icon"/>
          </div>
          {pendingMedia ? (
            <div className="media-summary">
              <span className="media-dot"/>
              <div><strong>{pendingMedia.name}</strong><span>{(pendingMedia.size / 1024 / 1024).toFixed(1)} MB · pending probe</span></div>
            </div>
          ) : (
            <p className="section-copy">Use Import to select a local video. Real ffprobe metadata is Corrida 02.</p>
          )}
        </section>
      )}

      {(activeSection === "captions" || activeSection === "transcript") && (
        <>
          <section className="inspector-section">
            <div className="section-title">
              <div><span className="eyebrow">SELECTION</span><strong>Caption</strong></div>
              <Captions size={16} className="section-icon"/>
            </div>
            {selectedCaption ? (
              <>
                <div className="selection-preview">{selectedCaption.text}</div>
                <div className="property-list">
                  <div><span>Start</span><strong>{selectedCaption.time}</strong></div>
                  <div><span>State</span><strong>Selected</strong></div>
                  <div><span>Source</span><strong>Demo</strong></div>
                </div>
              </>
            ) : <p className="section-copy">Select a caption from the timeline or Caption Document.</p>}
          </section>
          {activeSection === "transcript" && <ProviderSelector/>}
        </>
      )}

      {activeSection === "styles" && (
        <section className="inspector-section">
          <div className="section-title">
            <div><span className="eyebrow">CAPTION STYLE</span><strong>Visual System</strong></div>
            <Palette size={16} className="section-icon"/>
          </div>
          <button className="preset-row selected-preset"><span>VAV Hybrid Inspirational</span><CheckCircle2 size={15}/></button>
          <button className="preset-row"><span>VAV Clean Bold</span><span>Preset</span></button>
          <p className="section-note">Deep style editing starts after the Remotion caption core is connected.</p>
        </section>
      )}

      {activeSection === "structure" && (
        <Placeholder title="Structure" text="Hero Stack, Balanced and Progressive are frozen concepts. Real structure application arrives with the caption compiler UI."/>
      )}

      {activeSection === "motion" && (
        <section className="inspector-section">
          <div className="section-title">
            <div><span className="eyebrow">CAPTION MOTION</span><strong>Slide Blur Lite</strong></div>
            <Move3D size={16} className="section-icon"/>
          </div>
          <div className="property-list">
            <div><span>Enter</span><strong>Slide + Blur</strong></div>
            <div><span>Active</span><strong>None</strong></div>
            <div><span>Exit</span><strong>Fade</strong></div>
          </div>
          <p className="section-note">Visual Motion contexts remain a separate V10 domain.</p>
        </section>
      )}

      {activeSection === "scene-smart" && (
        <Placeholder title="Scene Smart" text="Scene Smart is intentionally not faked. Scene detection and visual analysis will enable this panel in later corridas."/>
      )}

      {activeSection === "context" && (
        <Placeholder title="Content Context" text="TXT, HTML and JSON content-intent imports are architected in V10. The real import/review workflow is implemented after media/transcription foundations."/>
      )}

      {activeSection === "audio" && (
        <Placeholder title="Audio" text="Waveform and source audio metadata arrive with real media ingest. Audio processing remains outside this shell corrida."/>
      )}

      <section className="inspector-section compact-section">
        <div className="lock-line"><Lock size={13}/><span>Automation respects future field locks and manual overrides.</span></div>
      </section>
    </aside>
  );
};
