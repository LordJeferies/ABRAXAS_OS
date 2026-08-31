import {create} from "zustand";
import {
  DEFAULT_NEUTRAL_POLICY,
  MOKA_FRAME_MATCHED_LEGACY_POLICY,
  type CutCandidate,
  type CutDecision,
  type CutDecisionType,
  type CutDecisionOrigin,
  type CutPolicy,
  type SourceMediaRef
} from "@vav/cut-domain";
import {
  updateCutPlanAction,
  approveCutPlanAction,
  undoCutPlanAction,
  initialCutSessionState,
  type CutSessionState
} from "@vav/project-session";
import {
  STANDARD_MOTION_PRESETS,
  getMotionPreset,
  type MotionPlan,
  type MotionPreset,
  type SimpleMotionFamilyId,
  type TextOwnership
} from "@vav/visual-motion-domain";
import {
  resolveMotionPlan,
  checkMotionPlanLockSync,
  evaluateCaptionMotionCollision,
  type EditorialMotionIntent,
  type CollisionResult
} from "@vav/motion-engine";
import {
  NEUTRAL_SAFE_ZONE,
  SAFE_ZONE_PRESETS,
  type PlatformSafeZonePreset
} from "@vav/platform-safe-zones";
import {parseRationalFps} from "@vav/timebase";

export type VavProductStore = {
  // Media & Cuts state
  sourceMedia: SourceMediaRef | null;
  candidates: CutCandidate[];
  decisions: Record<string, CutDecision>;
  selectedPolicyName: "DEFAULT_NEUTRAL" | "MOKA_FRAME_MATCHED_LEGACY";
  cutSession: CutSessionState;
  cutPlanError: string | null;

  // Motions state
  motionPlan: MotionPlan | null;
  motionIntents: EditorialMotionIntent[];
  selectedPresetId: string;
  currentSafeZone: PlatformSafeZonePreset;
  visualOwnership: TextOwnership;
  motionSyncStatus: "CURRENT" | "OUT_OF_SYNC" | "NO_LOCK";
  collisionResult: CollisionResult;

  // Timeline / Scrubber state
  currentTimeUs: number;
  isPlaying: boolean;

  // Actions
  loadSyntheticProject: () => void;
  clearProject: () => void;
  setCandidateDecision: (
    candidateId: string,
    decisionType: CutDecisionType,
    origin?: CutDecisionOrigin,
    adjustedRange?: {startUs: number; endUs: number},
    targetSeq?: number
  ) => void;
  reorderCandidate: (candidateId: string, targetSequenceIndex: number) => void;
  applyCutPolicy: (policyName: "DEFAULT_NEUTRAL" | "MOKA_FRAME_MATCHED_LEGACY") => void;
  recalculateCutPlan: () => void;
  undoCutPlan: () => void;
  approveCutPlan: (lockedBy?: string) => void;

  // Motions actions
  recalculateMotionPlan: () => void;
  addMotionIntent: (intent: EditorialMotionIntent) => void;
  removeMotionIntent: (intentId: string) => void;
  applyMotionPresetToIntent: (intentId: string, presetId: string) => void;
  setSelectedPreset: (presetId: string) => void;
  setSafeZone: (presetId: string) => void;
  setVisualOwnership: (ownership: TextOwnership) => void;
  checkCollision: (motionBounds: {minX: number; maxX: number; minY: number; maxY: number}, captionBounds: {minX: number; maxX: number; minY: number; maxY: number}) => void;

  // Scrubber actions
  seekTime: (timeUs: number) => void;
  togglePlay: () => void;
  tickPlayback: (deltaMs: number) => void;
};

export const useVavProductStore = create<VavProductStore>((set, get) => ({
  sourceMedia: null,
  candidates: [],
  decisions: {},
  selectedPolicyName: "DEFAULT_NEUTRAL",
  cutSession: initialCutSessionState,
  cutPlanError: null,

  motionPlan: null,
  motionIntents: [],
  selectedPresetId: "PRESET_SLOW_ZOOM_IN_V1",
  currentSafeZone: NEUTRAL_SAFE_ZONE, // Neutral default
  visualOwnership: "visual-motion",
  motionSyncStatus: "NO_LOCK",
  collisionResult: "CLEAR",

  currentTimeUs: 0,
  isPlaying: false,

  loadSyntheticProject: () => {
    const syntheticSource: SourceMediaRef = {
      sourceAssetId: "src_synthetic_moka_01",
      pathOrUri: "/tmp/synthetic_master.mp4",
      durationUs: 30_000_000,
      timebase: {fpsRational: "30/1", fpsNominal: 30, width: 1080, height: 1920}
    };

    const syntheticCandidates: CutCandidate[] = [
      {
        candidateId: "cand_01_hook",
        sourceAssetId: "src_synthetic_moka_01",
        sourceRange: {startUs: 1_000_000, endUs: 5_000_000},
        editorialRole: "HOOK",
        confidence: 0.98,
        speaker: {speakerId: "SPK_01"},
        rationale: "Strong narrative opening proposition"
      },
      {
        candidateId: "cand_02_filler",
        sourceAssetId: "src_synthetic_moka_01",
        sourceRange: {startUs: 6_000_000, endUs: 12_000_000},
        editorialRole: "FILLER",
        confidence: 0.35,
        speaker: {speakerId: "SPK_01"},
        rationale: "Long pause and redundant hesitation"
      },
      {
        candidateId: "cand_03_payoff",
        sourceAssetId: "src_synthetic_moka_01",
        sourceRange: {startUs: 14_000_000, endUs: 20_000_000},
        editorialRole: "PAYOFF",
        confidence: 0.95,
        speaker: {speakerId: "SPK_01"},
        rationale: "High-value conclusion punchline"
      }
    ];

    set({
      sourceMedia: syntheticSource,
      candidates: syntheticCandidates,
      decisions: {},
      cutSession: initialCutSessionState,
      motionPlan: null,
      motionIntents: [],
      cutPlanError: null,
      motionSyncStatus: "NO_LOCK",
      currentTimeUs: 0
    });
  },

  clearProject: () => {
    set({
      sourceMedia: null,
      candidates: [],
      decisions: {},
      cutSession: initialCutSessionState,
      motionPlan: null,
      motionIntents: [],
      cutPlanError: null,
      motionSyncStatus: "NO_LOCK",
      currentTimeUs: 0
    });
  },

  setCandidateDecision: (candidateId, decisionType, origin = "USER", adjustedRange, targetSeq) => {
    const nextDecisions = {
      ...get().decisions,
      [candidateId]: {
        decisionId: `dec_${candidateId}_${Date.now()}`,
        candidateId,
        decisionType,
        decisionOrigin: origin,
        ...(adjustedRange ? {adjustedRange} : {}),
        ...(targetSeq !== undefined ? {targetSequenceIndex: targetSeq} : {})
      }
    };
    set({decisions: nextDecisions});
    get().recalculateCutPlan();
  },

  reorderCandidate: (candidateId, targetSequenceIndex) => {
    const existing = get().decisions[candidateId];
    const nextDecisions = {
      ...get().decisions,
      [candidateId]: {
        decisionId: existing?.decisionId ?? `dec_${candidateId}_${Date.now()}`,
        candidateId,
        decisionType: "REORDER" as CutDecisionType,
        decisionOrigin: (existing?.decisionOrigin ?? "USER") as CutDecisionOrigin,
        ...(existing?.adjustedRange ? {adjustedRange: existing.adjustedRange} : {}),
        targetSequenceIndex
      }
    };
    set({decisions: nextDecisions});
    get().recalculateCutPlan();
  },

  applyCutPolicy: (policyName) => {
    set({selectedPolicyName: policyName});
    get().recalculateCutPlan();
  },

  recalculateCutPlan: () => {
    const {sourceMedia, candidates, decisions, selectedPolicyName, cutSession} = get();
    if (!sourceMedia) return;

    const decList = Object.values(decisions);
    if (decList.length !== candidates.length) {
      set({cutPlanError: `Pending decisions: ${candidates.length - decList.length} undecided candidate(s)`});
      return;
    }

    try {
      const policy: CutPolicy = selectedPolicyName === "MOKA_FRAME_MATCHED_LEGACY"
        ? MOKA_FRAME_MATCHED_LEGACY_POLICY
        : DEFAULT_NEUTRAL_POLICY;

      const updatedSession = updateCutPlanAction(cutSession, {
        contentId: "cnt_project_01",
        deliverableId: "deliv_vertical_01",
        formatId: "FMT_SHORT_VERTICAL_VIDEO",
        sourceMedia: [sourceMedia],
        candidates,
        decisions: decList,
        policy
      });

      let motionSync: "CURRENT" | "OUT_OF_SYNC" | "NO_LOCK" = "NO_LOCK";
      if (get().motionPlan) {
        if (!updatedSession.activeEditLock || updatedSession.activeCutPlan?.version !== updatedSession.activeEditLock.cutPlanVersion) {
          motionSync = "OUT_OF_SYNC";
        } else {
          const syncResult = checkMotionPlanLockSync(get().motionPlan!, updatedSession.activeEditLock);
          motionSync = syncResult.status;
        }
      }

      set({
        cutSession: updatedSession,
        cutPlanError: null,
        motionSyncStatus: motionSync
      });
    } catch (err: any) {
      set({cutPlanError: err.message});
    }
  },

  undoCutPlan: () => {
    const undoneSession = undoCutPlanAction(get().cutSession);
    set({cutSession: undoneSession});
  },

  approveCutPlan: (lockedBy = "USER_EDITORIAL_APPROVAL") => {
    try {
      const approvedSession = approveCutPlanAction(get().cutSession, lockedBy);
      set({
        cutSession: approvedSession,
        cutPlanError: null
      });
      get().recalculateMotionPlan();
    } catch (err: any) {
      set({cutPlanError: err.message});
    }
  },

  recalculateMotionPlan: () => {
    const {cutSession, motionIntents, visualOwnership} = get();
    const activeLock = cutSession.activeEditLock;
    if (!activeLock) {
      set({motionSyncStatus: "NO_LOCK", motionPlan: null});
      return;
    }

    const resolvedPlan = resolveMotionPlan({
      contentId: activeLock.contentId,
      deliverableId: activeLock.deliverableId,
      editLock: activeLock,
      intents: motionIntents,
      defaultOwnership: visualOwnership
    });

    set({
      motionPlan: resolvedPlan,
      motionSyncStatus: "CURRENT"
    });
  },

  addMotionIntent: (intent) => {
    const nextIntents = [...get().motionIntents, intent];
    set({motionIntents: nextIntents});
    get().recalculateMotionPlan();
  },

  removeMotionIntent: (intentId) => {
    const nextIntents = get().motionIntents.filter((i) => i.intentId !== intentId);
    set({motionIntents: nextIntents});
    get().recalculateMotionPlan();
  },

  applyMotionPresetToIntent: (intentId, presetId) => {
    const preset = getMotionPreset(presetId);
    if (!preset) return;
    const nextIntents = get().motionIntents.map((i) => {
      if (i.intentId !== intentId) return i;
      return {
        ...i,
        suggestedPresetId: preset.presetId,
        suggestedFamily: preset.motionFamilyId,
        parameters: preset.parameters
      };
    });
    set({motionIntents: nextIntents, selectedPresetId: presetId});
    get().recalculateMotionPlan();
  },

  setSelectedPreset: (presetId) => set({selectedPresetId: presetId}),

  setSafeZone: (presetId) => {
    const sz = SAFE_ZONE_PRESETS.find((p) => p.presetId === presetId) ?? NEUTRAL_SAFE_ZONE;
    set({currentSafeZone: sz});
  },

  setVisualOwnership: (ownership) => {
    set({visualOwnership: ownership});
    get().recalculateMotionPlan();
  },

  checkCollision: (motionBounds, captionBounds) => {
    const {sourceMedia, visualOwnership, currentSafeZone} = get();
    const width = sourceMedia?.timebase.width ?? 1080;
    const height = sourceMedia?.timebase.height ?? 1920;

    const res = evaluateCaptionMotionCollision(
      motionBounds,
      captionBounds,
      width,
      height,
      visualOwnership,
      currentSafeZone
    );
    set({collisionResult: res});
  },

  seekTime: (timeUs) => {
    const maxDur = get().cutSession.activeEditLock?.timebase.durationUs ?? (get().sourceMedia?.durationUs ?? 30_000_000);
    set({currentTimeUs: Math.max(0, Math.min(maxDur, timeUs))});
  },

  togglePlay: () => set((state) => ({isPlaying: !state.isPlaying})),

  tickPlayback: (deltaMs) => {
    const {isPlaying, currentTimeUs, cutSession, sourceMedia} = get();
    if (!isPlaying) return;
    const maxDur = cutSession.activeEditLock?.timebase.durationUs ?? (sourceMedia?.durationUs ?? 30_000_000);
    const nextUs = currentTimeUs + deltaMs * 1_000;
    if (nextUs >= maxDur) {
      set({currentTimeUs: 0, isPlaying: false});
    } else {
      set({currentTimeUs: nextUs});
    }
  }
}));
