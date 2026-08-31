/**
 * ABRAXAS Tree of Life Execution State Machine
 * Formally executes and enforces the 8-state Sephirothic transformation ladder.
 */

export type SefirahState =
  | "KETER"
  | "CHOKHMAH"
  | "BINAH"
  | "DAAT"
  | "TIFERET"
  | "HOD"
  | "YESOD"
  | "MALKHUT";

export const SEPHIROTH_ORDER: SefirahState[] = [
  "KETER",
  "CHOKHMAH",
  "BINAH",
  "DAAT",
  "TIFERET",
  "HOD",
  "YESOD",
  "MALKHUT"
];

export interface SephirothicTransitionRecord {
  fromState: SefirahState | "INITIAL";
  toState: SefirahState;
  operator: string;
  passedValidation: boolean;
  timestamp: string;
}

export class TreeOfLifeEngine {
  private currentState: SefirahState = "KETER";
  private readonly history: SephirothicTransitionRecord[] = [];

  public getState(): SefirahState {
    return this.currentState;
  }

  public transition(
    toState: SefirahState,
    operator: string,
    validationContext: { isShimVerified?: boolean; isApproved?: boolean } = {}
  ): SefirahState {
    const currentIndex = SEPHIROTH_ORDER.indexOf(this.currentState);
    const targetIndex = SEPHIROTH_ORDER.indexOf(toState);

    // Enforce strict sequential order or step
    if (targetIndex !== currentIndex + 1) {
      throw new Error(
        `TreeOfLifeError: Illegal transition from ${this.currentState} directly to ${toState}. Must follow canonical Sephiroth ladder.`
      );
    }

    // Strict Da'at to Tiferet Invariant
    if (this.currentState === "DAAT" && toState === "TIFERET" && !validationContext.isShimVerified) {
      throw new Error(
        `TreeOfLifeError: Cannot descend from DAAT to TIFERET without passing empirical SHIM reality verification.`
      );
    }

    // Strict Yesod to Malkhut Invariant
    if (this.currentState === "YESOD" && toState === "MALKHUT" && !validationContext.isApproved) {
      throw new Error(
        `TreeOfLifeError: Cannot manifest into MALKHUT without human approval stamp in HE.`
      );
    }

    this.history.push({
      fromState: this.currentState,
      toState,
      operator,
      passedValidation: true,
      timestamp: new Date().toISOString()
    });

    this.currentState = toState;
    return this.currentState;
  }

  public getHistory(): SephirothicTransitionRecord[] {
    return [...this.history];
  }
}
