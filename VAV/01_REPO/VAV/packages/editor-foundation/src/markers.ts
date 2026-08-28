export type MarkerKind = "review" | "error" | "client" | "style" | "scene" | "custom";

export type Marker = Readonly<{
  id: string;
  timeUs: number;
  kind: MarkerKind;
  label: string;
}>;
