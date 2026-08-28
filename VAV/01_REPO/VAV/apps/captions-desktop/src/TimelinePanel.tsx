import React from "react";
import {DEMO_DURATION_FRAMES, demoCaptions} from "./editorData.ts";
import {useUiState} from "./uiState.ts";

const pct = (frame: number) => `${Math.max(0, Math.min(100, (frame / DEMO_DURATION_FRAMES) * 100))}%`;

export const TimelinePanel: React.FC<{onSeek: (frame: number) => void}> = ({onSeek}) => {
  const selectedCaptionId = useUiState((state) => state.selectedCaptionId);
  const setSelectedCaptionId = useUiState((state) => state.setSelectedCaptionId);
  const currentFrame = useUiState((state) => state.currentFrame);

  return (
    <section className="timeline-shell">
      <div className="timeline-toolbar">
        <div>
          <span className="eyebrow">TIMELINE</span>
          <strong>Scene · Media · Captions · Motion</strong>
        </div>
        <span className="meta-chip">20 SEC DEMO</span>
      </div>

      <div className="timeline-ruler">
        <span>00:00</span><span>00:05</span><span>00:10</span><span>00:15</span><span>00:20</span>
      </div>

      <div className="timeline-grid">
        <button
          className="timeline-seek-surface"
          type="button"
          aria-label="Seek timeline"
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const ratio = (event.clientX - rect.left) / rect.width;
            onSeek(Math.round(Math.max(0, Math.min(1, ratio)) * (DEMO_DURATION_FRAMES - 1)));
          }}
        />

        <div className="playhead" style={{left: pct(currentFrame)}} />

        <div className="lane scene-lane">
          <span className="scene-chip" style={{left:"1%",width:"31%"}}>S01</span>
          <span className="scene-chip" style={{left:"33%",width:"31%"}}>S02</span>
          <span className="scene-chip" style={{left:"65%",width:"34%"}}>S03</span>
        </div>

        <div className="lane media-lane">
          <span className="clip media-clip" style={{left:"1%",width:"98%"}}>Demo composition · real media in C02</span>
        </div>

        <div className="lane caption-lane">
          {demoCaptions.map((caption) => {
            const width = ((caption.endFrame - caption.startFrame + 1) / DEMO_DURATION_FRAMES) * 100;
            return (
              <button
                key={caption.id}
                type="button"
                className={`clip caption-clip ${selectedCaptionId === caption.id ? "selected" : ""}`}
                style={{left: pct(caption.startFrame), width: `${width}%`}}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedCaptionId(caption.id);
                  onSeek(caption.startFrame);
                }}
                title={caption.text}
              >
                {caption.laneLabel}
              </button>
            );
          })}
        </div>

        <div className="lane audio-lane"><span className="waveform-placeholder"/></div>
        <div className="lane motion-lane">
          <span className="clip motion-clip" style={{left:"20%",width:"18%"}}>Slide Blur</span>
          <span className="clip motion-clip secondary" style={{left:"70%",width:"17%"}}>Hero Pop</span>
        </div>
      </div>
    </section>
  );
};
