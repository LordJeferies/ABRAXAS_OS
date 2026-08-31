/**
 * Visual Interactive Tree of Life Control Center Model
 * Surfaces Meaning, Technical function, Current process, Active module, Input, Output for all Sephiroth.
 */

export interface SefirahDetailCard {
  sefirah: string;
  name: string;
  meaning: string;
  technicalFunction: string;
  currentProcess: string;
  activeModule: string;
  input: string;
  output: string;
  status: "ONLINE" | "ACTIVE" | "VERIFIED" | "MANIFESTED";
}

export class TreeOfLifeControlCenterProvider {
  public getSephirothDetails(): SefirahDetailCard[] {
    return [
      {
        sefirah: "KETER",
        name: "Primordial Intention",
        meaning: "The root purpose and boundary of the creative act",
        technicalFunction: "Natural language intention deconstruction & parameter extraction",
        currentProcess: "Active Intention Resolver",
        activeModule: "ARQUITECTO",
        input: "Human natural language prompt / voice command",
        output: "Structured Intention Object & boundary constraints",
        status: "ONLINE"
      },
      {
        sefirah: "CHOKHMAH",
        name: "Creative Spark",
        meaning: "The raw flash of insight and angle of attack",
        technicalFunction: "Opportunity scoring, hook taxonomy & retention hypothesis",
        currentProcess: "Radar & Hook Formulator",
        activeModule: "YOD",
        input: "Structured Intention & historical audience weights",
        output: "Ranked hook candidates & title hypothesis",
        status: "ACTIVE"
      },
      {
        sefirah: "BINAH",
        name: "Matrix & Structure",
        meaning: "The structural lattice that gives identity permanence",
        technicalFunction: "Immutable Content CAS DAG & revision stratigraphy",
        currentProcess: "Lienzo Crystal Spine",
        activeModule: "CONTENIDO",
        input: "Hook hypothesis & narrative parameters",
        output: "Lienzo entity & structural storyboard DAG",
        status: "ACTIVE"
      },
      {
        sefirah: "DAAT",
        name: "Reality Metrology Gate",
        meaning: "The empirical abyss between concept and physical reality",
        technicalFunction: "Whisper transcript vs script metrology & certificate issuance",
        currentProcess: "Da'at Reality Gatekeeper",
        activeModule: "SHIM",
        input: "Raw audiovisual stream & planned narrative beats",
        output: "ShimVerificationCertificate (blocks unverified renders)",
        status: "VERIFIED"
      },
      {
        sefirah: "TIFERET",
        name: "Formation Forge",
        meaning: "The radiant synthesis of harmony, sound, and light",
        technicalFunction: "Lossless multi-segment video cuts, Remotion compositions & color",
        currentProcess: "Audiovisual Production Engine",
        activeModule: "VAV",
        input: "Verified Lienzo & Da'at certificate",
        output: "Lossless master video render (cas://...)",
        status: "MANIFESTED"
      },
      {
        sefirah: "HOD",
        name: "Splendor & Typography",
        meaning: "The kinetic expression of word-level rhythmic cadence",
        technicalFunction: "Word-level kinetic subtitle compilation & typography styling",
        currentProcess: "Caption Engine",
        activeModule: "VAV_CAPTIONS",
        input: "Time-aligned Whisper words & visual priors",
        output: "Kinetic subtitle animation layers",
        status: "MANIFESTED"
      },
      {
        sefirah: "YESOD",
        name: "Foundation & Bundle",
        meaning: "The unified integration of all component layers",
        technicalFunction: "Master CAS delivery bundle generation & checksum validation",
        currentProcess: "CAS Artifact Registry",
        activeModule: "INTEGRATION",
        input: "Rendered video, kinetic subtitles, and metadata",
        output: "Immutable CAS bundle (cas://<sha256>)",
        status: "MANIFESTED"
      },
      {
        sefirah: "MALKHUT",
        name: "Kingdom & Manifestation",
        meaning: "Physical distribution and sovereign reality in the world",
        technicalFunction: "Human governance review desk & multi-platform publishing",
        currentProcess: "Operations Desk & Dispatcher",
        activeModule: "HE",
        input: "Master CAS bundle & human review stamp",
        output: "Signed PublishReceipts & platform distribution manifests",
        status: "MANIFESTED"
      }
    ];
  }
}
