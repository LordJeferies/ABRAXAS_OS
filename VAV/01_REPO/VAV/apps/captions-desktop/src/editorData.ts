export type DemoCaption = Readonly<{
  id: string;
  time: string;
  startFrame: number;
  endFrame: number;
  text: string;
  laneLabel: string;
}>;

export const DEMO_DURATION_FRAMES = 600;
export const DEMO_FPS = 30;

export const demoCaptions: readonly DemoCaption[] = [
  {
    id: "cap-001",
    time: "00:00",
    startFrame: 0,
    endFrame: 119,
    text: "This is where the full subtitle reading experience starts inside VAV.",
    laneLabel: "FULL SUBTITLE VIEW"
  },
  {
    id: "cap-002",
    time: "00:04",
    startFrame: 120,
    endFrame: 269,
    text: "Users can read complete caption blocks instead of depending only on the timeline chips.",
    laneLabel: "READ COMPLETE CAPTIONS"
  },
  {
    id: "cap-003",
    time: "00:09",
    startFrame: 270,
    endFrame: 419,
    text: "The active block stays highlighted and the timeline, document and inspector stay synchronized.",
    laneLabel: "SYNC SELECTION"
  },
  {
    id: "cap-004",
    time: "00:14",
    startFrame: 420,
    endFrame: 509,
    text: "This workspace keeps the Riverside-style reading idea but uses the VAV visual language.",
    laneLabel: "VAV WORKSPACE"
  },
  {
    id: "cap-005",
    time: "00:17",
    startFrame: 510,
    endFrame: 599,
    text: "Real media ingest, probing and transcription arrive in the next corridas.",
    laneLabel: "NEXT: REAL MEDIA"
  }
];

export const getCaptionById = (id: string | null): DemoCaption | null =>
  demoCaptions.find((caption) => caption.id === id) ?? null;

export const captionAtFrame = (frame: number): DemoCaption | null =>
  demoCaptions.find(
    (caption) => frame >= caption.startFrame && frame <= caption.endFrame
  ) ?? null;

export const frameToClock = (frame: number, fps = DEMO_FPS): string => {
  const seconds = Math.max(0, frame) / fps;
  const minutes = Math.floor(seconds / 60);
  const wholeSeconds = Math.floor(seconds % 60);
  const hundredths = Math.floor((seconds % 1) * 100);
  return `${String(minutes).padStart(2, "0")}:${String(wholeSeconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
};
