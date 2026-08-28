import {create} from "zustand";

export type ActiveSection =
  | "project"
  | "media"
  | "transcript"
  | "captions"
  | "styles"
  | "structure"
  | "motion"
  | "scene-smart"
  | "context"
  | "audio"
  | "diagnostics";

export type PendingMedia = Readonly<{
  name: string;
  size: number;
  type: string;
}>;

type Notice = Readonly<{
  tone: "info" | "success" | "warning";
  text: string;
}>;

type UiState = {
  activeSection: ActiveSection;
  selectedCaptionId: string | null;
  pendingMedia: PendingMedia | null;
  exportOpen: boolean;
  playerPlaying: boolean;
  currentFrame: number;
  notice: Notice | null;
  setActiveSection: (section: ActiveSection) => void;
  setSelectedCaptionId: (captionId: string | null) => void;
  setPendingMedia: (media: PendingMedia | null) => void;
  setExportOpen: (open: boolean) => void;
  setPlayerPlaying: (playing: boolean) => void;
  setCurrentFrame: (frame: number) => void;
  setNotice: (notice: Notice | null) => void;
};

export const useUiState = create<UiState>((set) => ({
  activeSection: "project",
  selectedCaptionId: "cap-002",
  pendingMedia: null,
  exportOpen: false,
  playerPlaying: false,
  currentFrame: 120,
  notice: null,
  setActiveSection: (activeSection) => set({activeSection}),
  setSelectedCaptionId: (selectedCaptionId) => set({selectedCaptionId}),
  setPendingMedia: (pendingMedia) => set({pendingMedia}),
  setExportOpen: (exportOpen) => set({exportOpen}),
  setPlayerPlaying: (playerPlaying) => set({playerPlaying}),
  setCurrentFrame: (currentFrame) => set({currentFrame}),
  setNotice: (notice) => set({notice})
}));
