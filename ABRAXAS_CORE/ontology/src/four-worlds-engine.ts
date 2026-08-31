/**
 * ABRAXAS Four Worlds Orchestration Engine V8.0
 * Manages the top-to-bottom descent of creative intention across:
 * ATZILUT -> BERIAH -> YETZIRAH -> ASSIAH
 */

import {
  KabbalisticWorld,
  AbraxasOperatorSchema,
  CANONICAL_OPERATOR_REGISTRY
} from "./operator-schema.js";

export interface WorldTransitionContext {
  currentWorld: KabbalisticWorld;
  currentOperator: AbraxasOperatorSchema;
  currentSephiroticFunction: string;
  stepIndex: number;
  progressPercentage: number;
  casArtifactsCollected: string[];
}

export class FourWorldsEngine {
  private readonly operators = CANONICAL_OPERATOR_REGISTRY;

  public getWorldForOperator(operatorName: string): KabbalisticWorld {
    const op = this.operators[operatorName];
    if (!op) throw new Error(`Operator ${operatorName} not registered in ontology.`);
    return op.world;
  }

  public getDescentChain(): AbraxasOperatorSchema[] {
    return [
      this.operators["ARQUITECTO"], // ATZILUT (ALEPH: Keter)
      this.operators["YOD"],        // BERIAH (YOD: Chokhmah)
      this.operators["CONTENIDO"],  // BERIAH (MEM: Binah)
      this.operators["SHIM"],       // YETZIRAH (SHIN: Da'at Reality Gate)
      this.operators["VAV"],        // YETZIRAH (VAV: Tiferet)
      this.operators["HOD"],        // YETZIRAH (PE: Hod)
      this.operators["YESOD"],      // YETZIRAH (TAV: Yesod)
      this.operators["HE"]          // ASSIAH (HE: Malkhut)
    ];
  }

  public validateDescentInvariants(currentStep: number, isShimCertified: boolean, isApproved: boolean): boolean {
    // Da'at reality gate invariant (Step 3 -> Step 4 requires isShimCertified)
    if (currentStep >= 4 && !isShimCertified) {
      return false;
    }
    // Malkhut manifest gate invariant (Step 7 requires isApproved)
    if (currentStep >= 7 && !isApproved) {
      return false;
    }
    return true;
  }
}
