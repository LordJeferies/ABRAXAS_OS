export type BrandKit = Readonly<{
  id: string;
  name: string;
  fontIds: readonly string[];
  colorTokens: readonly string[];
  logoAssetId: string | null;
  allowedStyleIds: readonly string[];
  allowedStructureIds: readonly string[];
  motionIntensity: "low" | "medium" | "high";
  terminologyProfileId: string | null;
}>;
