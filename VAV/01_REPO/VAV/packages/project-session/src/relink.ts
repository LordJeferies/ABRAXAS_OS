export type RelinkSignal = Readonly<{
  filenameMatch: boolean;
  byteSizeMatch: boolean;
  durationDeltaMs: number;
  partialHashMatch: boolean;
}>;

export const scoreRelinkCandidate = (signal: RelinkSignal): number =>
  (signal.filenameMatch ? 20 : 0) +
  (signal.byteSizeMatch ? 25 : 0) +
  (signal.durationDeltaMs <= 250 ? 20 : signal.durationDeltaMs <= 1000 ? 8 : 0) +
  (signal.partialHashMatch ? 35 : 0);
