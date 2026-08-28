export type EditClipMap = Readonly<{
  clipId: string;
  sourceStartUs: number;
  sourceEndUs: number;
  timelineStartUs: number;
}>;

export const sourceToTimelineUs = (
  sourceUs: number,
  clips: readonly EditClipMap[]
): number | null => {
  const clip = clips.find(
    (item) => sourceUs >= item.sourceStartUs && sourceUs < item.sourceEndUs
  );
  if (!clip) return null;
  return clip.timelineStartUs + (sourceUs - clip.sourceStartUs);
};

export const timelineToSourceUs = (
  timelineUs: number,
  clips: readonly EditClipMap[]
): number | null => {
  const clip = clips.find((item) => {
    const duration = item.sourceEndUs - item.sourceStartUs;
    return timelineUs >= item.timelineStartUs &&
      timelineUs < item.timelineStartUs + duration;
  });
  if (!clip) return null;
  return clip.sourceStartUs + (timelineUs - clip.timelineStartUs);
};
