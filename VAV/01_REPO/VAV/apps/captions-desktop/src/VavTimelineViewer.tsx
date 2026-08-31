import React, {useEffect} from "react";
import {Play, Pause, FastForward, Rewind, MonitorPlay, AlertTriangle} from "lucide-react";
import {useVavProductStore} from "./vavProductState.ts";
import {generateRemotionMotionStyles} from "@vav/remotion-composition";
import {parseRationalFps, usToFrame} from "@vav/timebase";

export const VavTimelineViewer: React.FC = () => {
  const {
    sourceMedia,
    cutSession,
    motionPlan,
    currentTimeUs,
    isPlaying,
    seekTime,
    togglePlay,
    tickPlayback,
    currentSafeZone,
    motionSyncStatus
  } = useVavProductStore();

  const activeLock = cutSession.activeEditLock;
  const fpsRationalStr = activeLock?.timebase.fpsRational ?? (sourceMedia?.timebase.fpsRational ?? "30/1");
  const fps = parseRationalFps(fpsRationalStr);
  const fpsNominal = fps.num / fps.den;
  const durationUs = activeLock?.timebase.durationUs ?? (sourceMedia?.durationUs ?? 30_000_000);

  // Playback ticker timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      tickPlayback(50);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, tickPlayback]);

  // Authoritative rational frame from @vav/timebase
  const currentFrame = usToFrame(currentTimeUs, fps);
  const styles = generateRemotionMotionStyles(motionPlan, currentFrame, fpsNominal, 1080, 1920);

  return (
    <div className="timeline-viewer p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4 max-w-4xl mx-auto text-slate-100 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <MonitorPlay size={15} className="text-indigo-400" />
          Preview Remotion en Tiempo Real
        </span>

        <span className="font-mono text-slate-400">
          FPS: {fpsRationalStr} ({fpsNominal.toFixed(2)} fps) | Frame: #{currentFrame}
        </span>
      </div>

      {motionSyncStatus === "OUT_OF_SYNC" && (
        <div className="p-2 bg-amber-950/80 border border-amber-600/60 rounded text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle size={14} className="shrink-0" />
          Preview desactualizado respecto al CutPlan editado (OUT_OF_SYNC).
        </div>
      )}

      {/* Visual Canvas Simulator */}
      <div className="relative w-full aspect-[9/16] max-h-96 bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
        {/* Animated Layer using real Remotion Motion styles */}
        <div
          className="w-48 h-48 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-2xl transition-all duration-75"
          style={{
            transform: styles.transform,
            opacity: styles.opacity,
            clipPath: styles.clipPath
          }}
        >
          <div className="text-center">
            <span className="block text-2xl font-extrabold">VAV</span>
            <span className="text-[10px] font-mono opacity-80">{(currentTimeUs / 1_000_000).toFixed(2)}s</span>
          </div>
        </div>

        {/* Safe Zone Overlay */}
        <div
          className="absolute border border-dashed border-amber-400/40 pointer-events-none"
          style={{
            top: `${currentSafeZone.topMarginPercent}%`,
            bottom: `${currentSafeZone.bottomMarginPercent}%`,
            left: `${currentSafeZone.leftMarginPercent}%`,
            right: `${currentSafeZone.rightMarginPercent}%`
          }}
        />

        {/* HUD Info */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded font-mono text-[10px] text-slate-300">
          Transform: {styles.transform} | Opacidad: {styles.opacity.toFixed(2)}
        </div>
      </div>

      {/* Scrubber & Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>{(currentTimeUs / 1_000_000).toFixed(2)}s</span>
          <span>{((durationUs - currentTimeUs) / 1_000_000).toFixed(2)}s restantes</span>
        </div>

        <input
          type="range"
          min="0"
          max={durationUs}
          value={currentTimeUs}
          onChange={(e) => seekTime(Number(e.target.value))}
          className="w-full accent-indigo-500 cursor-pointer"
        />

        <div className="flex items-center justify-center gap-3 pt-2">
          <button className="p-2 hover:bg-slate-800 rounded text-slate-300" onClick={() => seekTime(currentTimeUs - 1_000_000)}>
            <Rewind size={16} />
          </button>
          <button className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition" onClick={togglePlay}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button className="p-2 hover:bg-slate-800 rounded text-slate-300" onClick={() => seekTime(currentTimeUs + 1_000_000)}>
            <FastForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
