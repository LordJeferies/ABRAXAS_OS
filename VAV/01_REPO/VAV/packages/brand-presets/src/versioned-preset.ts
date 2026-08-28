export type VersionedPresetRef = Readonly<{
  id: string;
  version: number;
}>;

export const samePresetVersion = (a: VersionedPresetRef, b: VersionedPresetRef): boolean =>
  a.id === b.id && a.version === b.version;
