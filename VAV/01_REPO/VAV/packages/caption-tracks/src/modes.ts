export type CaptionTrackMode = "dialogue-subtitles" | "closed-captions" | "translation";

export type CaptionTrack = Readonly<{
  id: string;
  language: string;
  mode: CaptionTrackMode;
  sourceTrackId: string | null;
}>;
