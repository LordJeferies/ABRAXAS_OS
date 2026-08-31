import { describe, it, expect } from "vitest";
import {
  CANONICAL_OPERATOR_REGISTRY,
  KabbalisticWorld
} from "../ontology/src/operator-schema.js";
import { FourWorldsEngine } from "../ontology/src/four-worlds-engine.js";
import { CreativeStudioEngine } from "../studio/src/creative-studio-engine.js";

describe("ABRAXAS OS V8.0 — Ontological Architecture & Four Worlds Suite", () => {
  // 1. Four Worlds & Hebrew Letter Operators Registry
  it("defines comprehensive ontological schemas for all 8 canonical operators", () => {
    const operators = Object.values(CANONICAL_OPERATOR_REGISTRY);
    expect(operators.length).toBe(8);

    // ATZILUT (ALEPH: Keter)
    const arquitecto = CANONICAL_OPERATOR_REGISTRY["ARQUITECTO"];
    expect(arquitecto.world).toBe("ATZILUT");
    expect(arquitecto.hebrewLetter).toBe("ALEPH");
    expect(arquitecto.letterSymbol).toBe("א");
    expect(arquitecto.sephiroticFunctions).toContain("KETER");

    // BERIAH (YOD: Chokhmah & MEM: Binah)
    const yod = CANONICAL_OPERATOR_REGISTRY["YOD"];
    expect(yod.world).toBe("BERIAH");
    expect(yod.hebrewLetter).toBe("YOD");
    expect(yod.letterSymbol).toBe("י");
    expect(yod.sephiroticFunctions).toContain("CHOKHMAH");

    const contenido = CANONICAL_OPERATOR_REGISTRY["CONTENIDO"];
    expect(contenido.world).toBe("BERIAH");
    expect(contenido.hebrewLetter).toBe("MEM");
    expect(contenido.letterSymbol).toBe("מ");
    expect(contenido.sephiroticFunctions).toContain("BINAH");

    // YETZIRAH (SHIN: Da'at, VAV: Tiferet, PE: Hod, TAV: Yesod)
    const shim = CANONICAL_OPERATOR_REGISTRY["SHIM"];
    expect(shim.world).toBe("YETZIRAH");
    expect(shim.hebrewLetter).toBe("SHIN");
    expect(shim.letterSymbol).toBe("ש");
    expect(shim.sephiroticFunctions).toContain("DAAT");

    const vav = CANONICAL_OPERATOR_REGISTRY["VAV"];
    expect(vav.world).toBe("YETZIRAH");
    expect(vav.hebrewLetter).toBe("VAV");
    expect(vav.letterSymbol).toBe("ו");
    expect(vav.sephiroticFunctions).toContain("TIFERET");

    const hod = CANONICAL_OPERATOR_REGISTRY["HOD"];
    expect(hod.world).toBe("YETZIRAH");
    expect(hod.hebrewLetter).toBe("PE");
    expect(hod.sephiroticFunctions).toContain("HOD");

    const yesod = CANONICAL_OPERATOR_REGISTRY["YESOD"];
    expect(yesod.world).toBe("YETZIRAH");
    expect(yesod.hebrewLetter).toBe("TAV");
    expect(yesod.sephiroticFunctions).toContain("YESOD");

    // ASSIAH (HE: Malkhut)
    const he = CANONICAL_OPERATOR_REGISTRY["HE"];
    expect(he.world).toBe("ASSIAH");
    expect(he.hebrewLetter).toBe("HE");
    expect(he.letterSymbol).toBe("ה");
    expect(he.sephiroticFunctions).toContain("MALKHUT");
  });

  // 2. Four Worlds Descent Chain & Invariants
  it("enforces top-to-bottom descent invariants across the Four Worlds", () => {
    const engine = new FourWorldsEngine();
    const chain = engine.getDescentChain();

    expect(chain.length).toBe(8);
    expect(chain[0].world).toBe("ATZILUT");
    expect(chain[1].world).toBe("BERIAH");
    expect(chain[2].world).toBe("BERIAH");
    expect(chain[3].world).toBe("YETZIRAH");
    expect(chain[4].world).toBe("YETZIRAH");
    expect(chain[5].world).toBe("YETZIRAH");
    expect(chain[6].world).toBe("YETZIRAH");
    expect(chain[7].world).toBe("ASSIAH");

    // Da'at Reality Gate blocking verification
    expect(engine.validateDescentInvariants(4, false, false)).toBe(false); // Step 4 blocked without Shim cert
    expect(engine.validateDescentInvariants(4, true, false)).toBe(true);  // Step 4 unblocked with Shim cert

    // Malkhut Governance Gate blocking verification
    expect(engine.validateDescentInvariants(7, true, false)).toBe(false); // Step 7 blocked without human approval
    expect(engine.validateDescentInvariants(7, true, true)).toBe(true);   // Step 7 manifested with approval
  });

  // 3. End-to-End Creation with Ontological Alignment
  it("executes full creative intention through the Four Worlds descent", async () => {
    const studio = new CreativeStudioEngine(":memory:");

    const result = await studio.createFromZero({
      idea: "Ontological Four Worlds Proof",
      product: "ABRAXAS Organism",
      targetAudience: "Systems Architects",
      objective: "Demonstrate unified symbolic and computational convergence"
    });

    expect(result.currentSefirah).toBe("MALKHUT");
    expect(result.casArtifactUri.startsWith("cas://")).toBe(true);
    expect(result.publishedReceiptsCount).toBeGreaterThan(0);
  });
});
