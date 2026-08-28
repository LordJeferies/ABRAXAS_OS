export type FontStatus = "available" | "missing" | "fallback" | "license-warning";

export type FontRegistryEntry = Readonly<{
  id: string;
  family: string;
  source: "system" | "bundled" | "project-local";
  status: FontStatus;
  assetPath: string | null;
}>;
