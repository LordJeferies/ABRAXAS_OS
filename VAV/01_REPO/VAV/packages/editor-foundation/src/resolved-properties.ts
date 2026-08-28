export const propertyPrecedence = [
  "profile",
  "style",
  "structure",
  "caption-override",
  "word-override",
  "scene-smart",
  "manual-override"
] as const;

export type PropertySource = typeof propertyPrecedence[number];

export type ResolvedProperty<T> = Readonly<{
  value: T;
  source: PropertySource;
  locked: boolean;
}>;
