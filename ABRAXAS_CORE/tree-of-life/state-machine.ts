/**
 * ABRAXAS Tree of Life Execution State Machine
 */

export enum State {
  KETER = "INTENTION",
  CHOKHMAH = "IDEA",
  BINAH = "STRUCTURE",
  DAAT = "VALIDATION",
  TIFERET = "CREATION",
  HOD = "EXPRESSION",
  YESOD = "FOUNDATION",
  MALKHUT = "MANIFESTATION"
}

export type SefirahKey = keyof typeof State;

export const SEPHIROTH_LADDER: State[] = [
  State.KETER,
  State.CHOKHMAH,
  State.BINAH,
  State.DAAT,
  State.TIFERET,
  State.HOD,
  State.YESOD,
  State.MALKHUT
];

export class TreeEngine {
  public current: State = State.KETER;
  private readonly transitionsHistory: Array<{ from: State; to: State; timestamp: string }> = [];

  public getState(): State {
    return this.current;
  }

  public transition(next: State, validationContext: { isShimVerified?: boolean; isApproved?: boolean } = {}): State {
    // Da'at reality gate check
    if (this.current === State.DAAT && next === State.TIFERET && validationContext.isShimVerified === false) {
      throw new Error("TreeOfLifeError: Cannot descend from DAAT (VALIDATION) to TIFERET (CREATION) without empirical SHIM verification.");
    }

    // Malkhut manifestation check
    if (this.current === State.YESOD && next === State.MALKHUT && validationContext.isApproved === false) {
      throw new Error("TreeOfLifeError: Cannot manifest into MALKHUT without human approval stamp.");
    }

    this.transitionsHistory.push({
      from: this.current,
      to: next,
      timestamp: new Date().toISOString()
    });

    this.current = next;
    return this.current;
  }

  public getHistory() {
    return [...this.transitionsHistory];
  }
}

export const TreeOfLifeEngine = TreeEngine;
