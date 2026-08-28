export type ModuleId =
  | "source-media"
  | "transcript"
  | "edit-map"
  | "scene-map"
  | "content-intent"
  | "motion-context"
  | "caption-semantics"
  | "caption-plan"
  | "render";

export const moduleDependencies: Readonly<Record<ModuleId, readonly ModuleId[]>> = {
  "source-media": [],
  "transcript": ["source-media"],
  "edit-map": ["source-media"],
  "scene-map": ["source-media"],
  "content-intent": [],
  "motion-context": [],
  "caption-semantics": ["transcript"],
  "caption-plan": [
    "caption-semantics",
    "edit-map",
    "scene-map",
    "content-intent",
    "motion-context"
  ],
  "render": ["caption-plan"]
};

export const invalidatedByMotionChange = [
  "motion-context",
  "caption-plan",
  "render"
] as const;
