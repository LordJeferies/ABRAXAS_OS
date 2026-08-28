export type Rational = Readonly<{num: number; den: number}>;

export const MICROSECONDS_PER_SECOND = 1_000_000;

export const secondsToUs = (seconds: number): number =>
  Math.round(seconds * MICROSECONDS_PER_SECOND);

export const usToSeconds = (timeUs: number): number =>
  timeUs / MICROSECONDS_PER_SECOND;

export const usToFrame = (timeUs: number, fps: Rational): number => {
  if (fps.num <= 0 || fps.den <= 0) throw new Error("Invalid FPS rational");
  return Math.round((timeUs * fps.num) / (fps.den * MICROSECONDS_PER_SECOND));
};
