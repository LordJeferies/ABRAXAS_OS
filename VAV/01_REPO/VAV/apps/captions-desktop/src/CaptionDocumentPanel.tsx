import React from "react";
import {demoCaptions} from "./editorData.ts";
import {useUiState} from "./uiState.ts";

export const CaptionDocumentPanel: React.FC<{onSeek: (frame: number) => void}> = ({onSeek}) => {
  const selectedCaptionId = useUiState((state) => state.selectedCaptionId);
  const setSelectedCaptionId = useUiState((state) => state.setSelectedCaptionId);

  return (
    <section className="caption-doc-shell">
      <div className="caption-doc-header">
        <div>
          <span className="eyebrow">CAPTION DOCUMENT</span>
          <strong>Full Reading View</strong>
        </div>
        <span className="meta-chip synced">SYNCED</span>
      </div>

      <div className="caption-doc-body">
        {demoCaptions.map((block) => (
          <button
            key={block.id}
            className={`caption-doc-block ${selectedCaptionId === block.id ? "active" : ""}`}
            type="button"
            onClick={() => {
              setSelectedCaptionId(block.id);
              onSeek(block.startFrame);
            }}
          >
            <span className="caption-doc-time">{block.time}</span>
            <span className="caption-doc-text">{block.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
