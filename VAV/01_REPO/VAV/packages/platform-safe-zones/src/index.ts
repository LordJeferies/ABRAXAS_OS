export type PlatformSafeZonePreset = Readonly<{
  presetId: string;
  platform: "TIKTOK" | "REELS" | "SHORTS" | "GENERIC_VERTICAL" | "CUSTOM" | "NEUTRAL";
  version: number;
  provenance: {
    source: string;
    version: string;
  };
  topMarginPercent: number;
  bottomMarginPercent: number;
  leftMarginPercent: number;
  rightMarginPercent: number;
}>;

export const NEUTRAL_SAFE_ZONE: PlatformSafeZonePreset = {
  presetId: "SZ_NEUTRAL_FULL_CANVAS",
  platform: "NEUTRAL",
  version: 1,
  provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
  topMarginPercent: 0.0,
  bottomMarginPercent: 0.0,
  leftMarginPercent: 0.0,
  rightMarginPercent: 0.0
};

export const TIKTOK_SAFE_ZONE_V1: PlatformSafeZonePreset = {
  presetId: "SZ_TIKTOK_V1",
  platform: "TIKTOK",
  version: 1,
  provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
  topMarginPercent: 12.0,
  bottomMarginPercent: 20.0,
  leftMarginPercent: 8.0,
  rightMarginPercent: 8.0
};

export const REELS_SAFE_ZONE_V1: PlatformSafeZonePreset = {
  presetId: "SZ_REELS_V1",
  platform: "REELS",
  version: 1,
  provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
  topMarginPercent: 14.0,
  bottomMarginPercent: 18.0,
  leftMarginPercent: 8.0,
  rightMarginPercent: 8.0
};

export const SHORTS_SAFE_ZONE_V1: PlatformSafeZonePreset = {
  presetId: "SZ_SHORTS_V1",
  platform: "SHORTS",
  version: 1,
  provenance: {source: "Internal Guidelines (Unverified Baseline)", version: "1.0"},
  topMarginPercent: 10.0,
  bottomMarginPercent: 16.0,
  leftMarginPercent: 8.0,
  rightMarginPercent: 8.0
};

export const SAFE_ZONE_PRESETS: readonly PlatformSafeZonePreset[] = [
  NEUTRAL_SAFE_ZONE,
  TIKTOK_SAFE_ZONE_V1,
  REELS_SAFE_ZONE_V1,
  SHORTS_SAFE_ZONE_V1
];

export const getSafeBoundingBox = (
  width: number,
  height: number,
  safeZone: PlatformSafeZonePreset = NEUTRAL_SAFE_ZONE
): {minX: number; maxX: number; minY: number; maxY: number} => {
  const minX = (safeZone.leftMarginPercent / 100) * width;
  const maxX = width - (safeZone.rightMarginPercent / 100) * width;
  const minY = (safeZone.topMarginPercent / 100) * height;
  const maxY = height - (safeZone.bottomMarginPercent / 100) * height;
  return {minX, maxX, minY, maxY};
};
