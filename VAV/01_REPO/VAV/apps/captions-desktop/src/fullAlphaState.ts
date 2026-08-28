import {create} from "zustand";
import {defaultDesign} from "./fullAlphaDomain.ts";
import type {
  AbraxasImportRecord,
  CaptionStylePreset,
  ContentCandidate,
  DesignState,
  MediaProbe,
  MotionContext,
  MotionPreset,
  RuntimeCaption,
  SavedProject,
  SceneMark,
  VisionProviderReport
} from "./fullAlphaTypes.ts";

export type Section =
  | "project" | "media" | "transcript" | "captions" | "styles"
  | "structure" | "motion" | "scene-smart" | "context" | "abraxas"
  | "audio" | "diagnostics";

type Status = "idle" | "running" | "done" | "error";
type Notice = {tone: "info" | "success" | "warning"; text: string};

type Snapshot = {
  captions: RuntimeCaption[];
  design: DesignState;
  scenes: SceneMark[];
  contentCandidates: ContentCandidate[];
  motionContexts: MotionContext[];
  reviewComplete: boolean;
  designComplete: boolean;
};

type Store = {
  section: Section;
  media: MediaProbe | null;
  captions: RuntimeCaption[];
  selectedCaptionId: string | null;
  language: string | null;
  provider: "whisper-cpp" | "mlx-whisper";
  modelId: string;
  transcriptionStatus: Status;
  sceneStatus: Status;
  exportStatus: Status;
  design: DesignState;
  scenes: SceneMark[];
  contentCandidates: ContentCandidate[];
  motionContexts: MotionContext[];
  abraxasImports: AbraxasImportRecord[];
  approvedStylePresets: CaptionStylePreset[];
  approvedMotionPresets: MotionPreset[];
  previewStylePreset: CaptionStylePreset | null;
  previewMotionPreset: MotionPreset | null;
  previewReturnDesign: DesignState | null;
  visionReport: VisionProviderReport | null;
  reviewComplete: boolean;
  designComplete: boolean;
  currentFrame: number;
  playing: boolean;
  notice: Notice | null;
  undoStack: Snapshot[];
  redoStack: Snapshot[];

  setSection: (section: Section) => void;
  setProvider: (provider: "whisper-cpp" | "mlx-whisper") => void;
  setModelId: (modelId: string) => void;
  setTranscriptionStatus: (status: Status) => void;
  setSceneStatus: (status: Status) => void;
  setExportStatus: (status: Status) => void;
  replaceCaptions: (captions: RuntimeCaption[], language: string | null) => void;
  selectCaption: (id: string | null) => void;
  editCaption: (id: string, text: string) => void;
  toggleApproved: (id: string) => void;
  splitCaption: (id: string) => void;
  mergePrevious: (id: string) => void;
  markReviewComplete: () => void;
  patchDesign: (patch: Partial<DesignState>) => void;
  markDesignComplete: () => void;
  setScenes: (scenes: SceneMark[]) => void;
  setContentCandidates: (items: ContentCandidate[]) => void;
  setMotionContexts: (items: MotionContext[]) => void;
  addAbraxasImport: (item: AbraxasImportRecord) => void;
  setAbraxasRegistry: (styles: readonly CaptionStylePreset[], motions: readonly MotionPreset[]) => void;
  previewAbraxasImport: (importId: string) => void;
  clearAbraxasPreview: () => void;
  setVisionReport: (report: VisionProviderReport | null) => void;
  setCurrentFrame: (frame: number) => void;
  setPlaying: (playing: boolean) => void;
  setNotice: (notice: Notice | null) => void;
  resetForMedia: (media: MediaProbe) => void;
  undo: () => void;
  redo: () => void;
  serializable: () => SavedProject;
  hydrate: (project: SavedProject) => void;
};

const snapshot = (state: Store): Snapshot => ({
  captions: state.captions.map((caption) => ({...caption})),
  design: {...state.design},
  scenes: state.scenes.map((scene) => ({...scene})),
  contentCandidates: state.contentCandidates.map((candidate) => ({...candidate})),
  motionContexts: state.motionContexts.map((motion) => ({...motion})),
  reviewComplete: state.reviewComplete,
  designComplete: state.designComplete
});

const withHistory = (state: Store, patch: Partial<Store>): Partial<Store> => ({
  ...patch,
  undoStack: [...state.undoStack.slice(-49), snapshot(state)],
  redoStack: []
});

export const useFullAlpha = create<Store>((set, get) => ({
  section: "project",
  media: null,
  captions: [],
  selectedCaptionId: null,
  language: null,
  provider: "whisper-cpp",
  modelId: "large-v3-turbo",
  transcriptionStatus: "idle",
  sceneStatus: "idle",
  exportStatus: "idle",
  design: defaultDesign,
  scenes: [],
  contentCandidates: [],
  motionContexts: [],
  abraxasImports: [],
  approvedStylePresets: [],
  approvedMotionPresets: [],
  previewStylePreset: null,
  previewMotionPreset: null,
  previewReturnDesign: null,
  visionReport: null,
  reviewComplete: false,
  designComplete: false,
  currentFrame: 0,
  playing: false,
  notice: null,
  undoStack: [],
  redoStack: [],

  setSection: (section) => set({section}),
  setProvider: (provider) => set({provider}),
  setModelId: (modelId) => set({modelId}),
  setTranscriptionStatus: (transcriptionStatus) => set({transcriptionStatus}),
  setSceneStatus: (sceneStatus) => set({sceneStatus}),
  setExportStatus: (exportStatus) => set({exportStatus}),

  replaceCaptions: (captions, language) => set((state) => withHistory(state, {
    captions, language,
    selectedCaptionId: captions[0]?.id ?? null,
    reviewComplete: false
  })),

  selectCaption: (selectedCaptionId) => set({selectedCaptionId}),

  editCaption: (id, text) => set((state) => withHistory(state, {
    captions: state.captions.map((caption) =>
      caption.id === id ? {...caption, text, approved: false} : caption
    ),
    reviewComplete: false
  })),

  toggleApproved: (id) => set((state) => withHistory(state, {
    captions: state.captions.map((caption) =>
      caption.id === id ? {...caption, approved: !caption.approved} : caption
    )
  })),

  splitCaption: (id) => set((state) => {
    const index = state.captions.findIndex((caption) => caption.id === id);
    if (index < 0) return {};
    const caption = state.captions[index]!;
    const words = caption.text.trim().split(/\s+/);
    if (words.length < 2) return {};

    const mid = Math.ceil(words.length / 2);
    const splitUs = Math.round((caption.startUs + caption.endUs) / 2);
    const stamp = Date.now();

    const left = {...caption, id: `${caption.id}-a-${stamp}`, endUs: splitUs, text: words.slice(0, mid).join(" "), approved: false};
    const right = {...caption, id: `${caption.id}-b-${stamp}`, startUs: splitUs + 1, text: words.slice(mid).join(" "), approved: false};

    return withHistory(state, {
      captions: [...state.captions.slice(0, index), left, right, ...state.captions.slice(index + 1)],
      selectedCaptionId: right.id,
      reviewComplete: false
    });
  }),

  mergePrevious: (id) => set((state) => {
    const index = state.captions.findIndex((caption) => caption.id === id);
    if (index <= 0) return {};
    const previous = state.captions[index - 1]!;
    const current = state.captions[index]!;
    const merged = {...previous, id: `merge-${Date.now()}`, endUs: current.endUs, text: `${previous.text} ${current.text}`.trim(), approved: false};

    return withHistory(state, {
      captions: [...state.captions.slice(0, index - 1), merged, ...state.captions.slice(index + 1)],
      selectedCaptionId: merged.id,
      reviewComplete: false
    });
  }),

  markReviewComplete: () => set((state) => withHistory(state, {
    captions: state.captions.map((caption) => ({...caption, approved: true})),
    reviewComplete: true
  })),

  patchDesign: (patch) => set((state) => withHistory(state, {
    design: {...state.design, ...patch},
    designComplete: false
  })),

  markDesignComplete: () => set((state) => withHistory(state, {designComplete: true})),
  setScenes: (scenes) => set((state) => withHistory(state, {scenes})),
  setContentCandidates: (contentCandidates) => set((state) => withHistory(state, {contentCandidates})),
  setMotionContexts: (motionContexts) => set((state) => withHistory(state, {motionContexts})),

  addAbraxasImport: (item) => set((state) => ({
    abraxasImports: [item, ...state.abraxasImports.filter((x) => x.importId !== item.importId)].slice(0, 200)
  })),

  setAbraxasRegistry: (styles, motions) => set({
    approvedStylePresets: [...styles],
    approvedMotionPresets: [...motions]
  }),

  previewAbraxasImport: (importId) => set((state) => {
    const record = state.abraxasImports.find((x) => x.importId === importId);
    if (!record?.artifact.executable) return {};
    const previewReturnDesign = state.previewReturnDesign ?? state.design;
    const style = record.artifact.stylePreset ? {...record.artifact.stylePreset, status: "candidate" as const} : null;
    const motion = record.artifact.motionPreset ? {...record.artifact.motionPreset, status: "candidate" as const} : null;
    return {
      previewReturnDesign,
      previewStylePreset: style,
      previewMotionPreset: motion,
      design: {
        ...state.design,
        ...(style ? {styleId: style.id, structureId: style.structure.preferred, motionId: style.motion.family} : {}),
        ...(motion ? {motionId: motion.id} : {})
      },
      designComplete: false
    };
  }),

  clearAbraxasPreview: () => set((state) => ({
    design: state.previewReturnDesign ?? state.design,
    previewStylePreset: null,
    previewMotionPreset: null,
    previewReturnDesign: null
  })),

  setVisionReport: (visionReport) => set({visionReport}),
  setCurrentFrame: (currentFrame) => set({currentFrame}),
  setPlaying: (playing) => set({playing}),
  setNotice: (notice) => set({notice}),

  resetForMedia: (media) => set({
    media,
    captions: [],
    selectedCaptionId: null,
    language: null,
    transcriptionStatus: "idle",
    sceneStatus: "idle",
    exportStatus: "idle",
    design: defaultDesign,
    scenes: [],
    contentCandidates: [],
    motionContexts: [],
    previewStylePreset: null,
    previewMotionPreset: null,
    previewReturnDesign: null,
    reviewComplete: false,
    designComplete: false,
    currentFrame: 0,
    undoStack: [],
    redoStack: [],
    section: "media"
  }),

  undo: () => set((state) => {
    const target = state.undoStack.at(-1);
    if (!target) return {};
    return {...target, undoStack: state.undoStack.slice(0, -1), redoStack: [...state.redoStack, snapshot(state)]};
  }),

  redo: () => set((state) => {
    const target = state.redoStack.at(-1);
    if (!target) return {};
    return {...target, redoStack: state.redoStack.slice(0, -1), undoStack: [...state.undoStack, snapshot(state)]};
  }),

  serializable: () => ({
    version: 1,
    media: get().media,
    captions: get().captions,
    design: get().design,
    scenes: get().scenes,
    contentCandidates: get().contentCandidates,
    motionContexts: get().motionContexts,
    reviewComplete: get().reviewComplete,
    designComplete: get().designComplete,
    abraxasImports: get().abraxasImports
  }),

  hydrate: (project) => set({
    media: project.media,
    captions: [...project.captions],
    selectedCaptionId: project.captions[0]?.id ?? null,
    design: {...project.design},
    scenes: [...project.scenes],
    contentCandidates: [...project.contentCandidates],
    motionContexts: [...project.motionContexts],
    abraxasImports: [...(project.abraxasImports ?? [])],
    previewStylePreset: null,
    previewMotionPreset: null,
    previewReturnDesign: null,
    reviewComplete: project.reviewComplete,
    designComplete: project.designComplete,
    transcriptionStatus: project.captions.length ? "done" : "idle",
    sceneStatus: project.scenes.length ? "done" : "idle",
    exportStatus: "idle",
    undoStack: [],
    redoStack: [],
    currentFrame: 0,
    section: "project"
  })
}));
