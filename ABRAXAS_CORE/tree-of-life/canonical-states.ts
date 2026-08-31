/**
 * ABRAXAS Unified Cabalistic State Model (Tree of Life)
 */

export interface CabalisticStateDefinition {
  sefirah: "KETER" | "CHOKHMAH" | "BINAH" | "DAAT" | "TIFERET" | "HOD" | "YESOD" | "MALKHUT";
  symbolicName: string;
  technicalPurpose: string;
  associatedOperator: string;
  allowedTransitions: string[];
  validationRequirements: string[];
}

export const CANONICAL_CABALISTIC_TREE: Record<string, CabalisticStateDefinition> = {
  KETER: {
    sefirah: "KETER",
    symbolicName: "Crown / Primordial Intention",
    technicalPurpose: "Deconstruct and structure creator natural language intent",
    associatedOperator: "ARQUITECTO",
    allowedTransitions: ["CHOKHMAH"],
    validationRequirements: ["INTENTION_PARSED", "BOUNDARY_LOCKED"]
  },
  CHOKHMAH: {
    sefirah: "CHOKHMAH",
    symbolicName: "Wisdom / Creative Spark",
    technicalPurpose: "Opportunity formulation & hook hypothesis ranking",
    associatedOperator: "YOD",
    allowedTransitions: ["BINAH"],
    validationRequirements: ["HOOK_SELECTED", "SCORE_GT_0.8"]
  },
  BINAH: {
    sefirah: "BINAH",
    symbolicName: "Understanding / Matrix Spine",
    technicalPurpose: "Instantiate immutable single-piece crystal CAS DAG",
    associatedOperator: "CONTENIDO",
    allowedTransitions: ["DAAT"],
    validationRequirements: ["CAS_DAG_INSTANTIATED", "REVISION_1_COMMITTED"]
  },
  DAAT: {
    sefirah: "DAAT",
    symbolicName: "Knowledge / Reality Metrology",
    technicalPurpose: "Empirical reality alignment between plan and Whisper transcription",
    associatedOperator: "SHIM",
    allowedTransitions: ["TIFERET"],
    validationRequirements: ["SHIM_CERTIFICATE_ISSUED", "GAP_COUNT_ZERO"]
  },
  TIFERET: {
    sefirah: "TIFERET",
    symbolicName: "Beauty / Formation Forge",
    technicalPurpose: "Audiovisual synthesis, lossless cuts and Remotion renders",
    associatedOperator: "VAV",
    allowedTransitions: ["HOD"],
    validationRequirements: ["CAS_RENDER_URI_GENERATED", "LOSSLESS_CUT_VERIFIED"]
  },
  HOD: {
    sefirah: "HOD",
    symbolicName: "Splendor / Kinetic Expression",
    technicalPurpose: "Kinetic typography compilation and word-level hierarchy",
    associatedOperator: "VAV_CAPTIONS",
    allowedTransitions: ["YESOD"],
    validationRequirements: ["SUBTITLE_TIMING_ALIGNED"]
  },
  YESOD: {
    sefirah: "YESOD",
    symbolicName: "Foundation / Master Integration",
    technicalPurpose: "Packaging and verification of immutable CAS delivery bundle",
    associatedOperator: "INTEGRATION",
    allowedTransitions: ["MALKHUT"],
    validationRequirements: ["BUNDLE_CHECKSUM_VALIDATED"]
  },
  MALKHUT: {
    sefirah: "MALKHUT",
    symbolicName: "Kingdom / Manifest Reality",
    technicalPurpose: "Human governance review and multi-platform distribution",
    associatedOperator: "HE",
    allowedTransitions: ["KETER"], // Closed-loop return
    validationRequirements: ["HUMAN_APPROVAL_STAMPED", "PUBLISH_RECEIPTS_DISPATCHED"]
  }
};

export class UnifiedTreeOfLifeEngine {
  private currentSefirah: keyof typeof CANONICAL_CABALISTIC_TREE = "KETER";

  public getCurrentState(): CabalisticStateDefinition {
    return CANONICAL_CABALISTIC_TREE[this.currentSefirah];
  }

  public transition(targetSefirah: keyof typeof CANONICAL_CABALISTIC_TREE, validationContext: { isShimVerified?: boolean; isApproved?: boolean } = {}): CabalisticStateDefinition {
    const currentDef = CANONICAL_CABALISTIC_TREE[this.currentSefirah];

    if (!currentDef.allowedTransitions.includes(targetSefirah)) {
      throw new Error(`TreeOfLifeError: Illegal transition from ${this.currentSefirah} to ${targetSefirah}. Allowed: ${currentDef.allowedTransitions.join(", ")}`);
    }

    if (this.currentSefirah === "DAAT" && targetSefirah === "TIFERET" && validationContext.isShimVerified === false) {
      throw new Error("TreeOfLifeError: Cannot descend from DAAT to TIFERET without empirical SHIM verification certificate.");
    }

    if (this.currentSefirah === "YESOD" && targetSefirah === "MALKHUT" && validationContext.isApproved === false) {
      throw new Error("TreeOfLifeError: Cannot manifest into MALKHUT without human approval stamp in HE.");
    }

    this.currentSefirah = targetSefirah;
    return CANONICAL_CABALISTIC_TREE[this.currentSefirah];
  }
}
