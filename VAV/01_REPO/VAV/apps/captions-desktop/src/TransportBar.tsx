import React from "react";
import type {PlayerRef} from "@remotion/player";
import {Expand, Maximize2, Pause, Play, SkipBack, SkipForward} from "lucide-react";
import {DEMO_DURATION_FRAMES, frameToClock} from "./editorData.ts";
import {useUiState} from "./uiState.ts";

type Props = {
  playerRef: React.RefObject<PlayerRef | null>;
  onSeek: (frame: number) => void;
};

export const TransportBar: React.FC<Props> = ({playerRef, onSeek}) => {
  const playing = useUiState((state) => state.playerPlaying);
  const setPlayerPlaying = useUiState((state) => state.setPlayerPlaying);
  const currentFrame = useUiState((state) => state.currentFrame);
  const setNotice = useUiState((state) => state.setNotice);

  const toggle = () => {
    const player = playerRef.current;
    if (!player) return;
    const wasPlaying = player.isPlaying();
    player.toggle();
    setPlayerPlaying(!wasPlaying);
  };

  return (
    <div className="transport">
      <div className="transport-left">
        <button
          className="icon-button compact"
          aria-label="Previous frame"
          title="Previous frame"
          onClick={() => onSeek(Math.max(0, currentFrame - 1))}
        >
          <SkipBack size={16}/>
        </button>
        <button className="transport-play" aria-label="Play or pause" title="Play or pause" onClick={toggle}>
          {playing ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}
        </button>
        <button
          className="icon-button compact"
          aria-label="Next frame"
          title="Next frame"
          onClick={() => onSeek(Math.min(DEMO_DURATION_FRAMES - 1, currentFrame + 1))}
        >
          <SkipForward size={16}/>
        </button>
      </div>

      <div className="transport-time">
        <strong>{frameToClock(currentFrame)}</strong>
        <span>/ 00:20.00</span>
      </div>

      <div className="transport-right">
        <button
          className="icon-button compact"
          aria-label="Fit preview"
          title="Fit preview"
          onClick={() => setNotice({tone: "info", text: "Preview is fitted to the available viewer area."})}
        >
          <Maximize2 size={16}/>
        </button>
        <button
          className="icon-button compact"
          aria-label="Fullscreen"
          title="Fullscreen"
          onClick={() => playerRef.current?.requestFullscreen()}
        >
          <Expand size={16}/>
        </button>
      </div>
    </div>
  );
};
