import type {CutPlan, EditLock} from "@vav/cut-domain";
import {assembleCutPlan, mintEditLock, type AssembleCutPlanInput} from "@vav/cut-engine";

export type CutSessionState = Readonly<{
  activeCutPlan: CutPlan | null;
  history: readonly CutPlan[];
  activeEditLock: EditLock | null;
}>;

export const initialCutSessionState: CutSessionState = {
  activeCutPlan: null,
  history: [],
  activeEditLock: null
};

export const createCutPlanAction = (state: CutSessionState, input: AssembleCutPlanInput): CutSessionState => {
  const plan = assembleCutPlan(input);
  return {
    ...state,
    activeCutPlan: plan,
    history: state.activeCutPlan ? [...state.history, state.activeCutPlan] : []
  };
};

export const updateCutPlanAction = (state: CutSessionState, input: AssembleCutPlanInput): CutSessionState => {
  const version = (state.activeCutPlan?.version ?? 0) + 1;
  const plan = assembleCutPlan({...input, version});
  return {
    ...state,
    activeCutPlan: plan,
    history: state.activeCutPlan ? [...state.history, state.activeCutPlan] : []
  };
};

export const approveCutPlanAction = (state: CutSessionState, lockedBy: string = "USER_EDITORIAL_APPROVAL"): CutSessionState => {
  if (!state.activeCutPlan) {
    throw new Error("Cannot approve CutPlan: no active CutPlan in session");
  }
  const approvedPlan: CutPlan = {
    ...state.activeCutPlan,
    provenance: {
      ...state.activeCutPlan.provenance,
      status: "APPROVED"
    }
  };
  const lock = mintEditLock(approvedPlan, lockedBy);
  return {
    ...state,
    activeCutPlan: approvedPlan,
    activeEditLock: lock
  };
};

export const undoCutPlanAction = (state: CutSessionState): CutSessionState => {
  if (state.history.length === 0) return state;
  const previous = state.history[state.history.length - 1]!;
  return {
    ...state,
    activeCutPlan: previous,
    history: state.history.slice(0, -1)
  };
};
