import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(root, "../../..");

const required = [
  "packages/visual-motion-domain/src/index.ts",
  "packages/motion-engine/src/index.ts",
  "packages/spatial-scene/src/index.ts",
  "packages/motion-caption-policy/src/index.ts",
  "packages/platform-safe-zones/src/index.ts",
  "packages/remotion-composition/src/index.ts",
  "packages/cut-domain/src/index.ts"
];

const contractRequired = [
  "ABRAXAS_CORE/contracts/av-production/MOTION_PLAN_CONTRACT_V1.md",
  "ABRAXAS_CORE/contracts/av-production/EDIT_LOCK_AND_TIME_MAPPING_CONTRACT_V1.md"
];

const missing = required.filter((p) => !fs.existsSync(path.join(root, p)));
const missingContracts = contractRequired.filter((p) => !fs.existsSync(path.join(repoRoot, p)));

if (missing.length || missingContracts.length) {
  console.error("MOTIONS FOUNDATION MISSING");
  for (const item of missing) console.error(`- VAV/${item}`);
  for (const item of missingContracts) console.error(`- ${item}`);
  process.exit(1);
}

// Perform smoke evaluation on pure TS modules
const {SIMPLE_MOTION_FAMILIES} = await import("../packages/visual-motion-domain/src/index.ts");
const {resolveMotionPlan, evaluateMotionTransform} = await import("../packages/motion-engine/src/index.ts");
const {generateRemotionMotionStyles} = await import("../packages/remotion-composition/src/motion-adapter.ts");

if (SIMPLE_MOTION_FAMILIES.length !== 13) {
  console.error(`Expected 13 Simple Motion Families, found ${SIMPLE_MOTION_FAMILIES.length}`);
  process.exit(1);
}

const dummyLock = {
  editLockId: "smoke_lock_001",
  contentId: "smoke_cnt",
  deliverableId: "deliv_01",
  cutPlanId: "cp_01",
  cutPlanVersion: 1,
  timeMappingVersion: 1,
  timeMappingHash: "tmh_smoke_hash_1234567890abcdef1234567890abcdef1234567890abcdef",
  timebase: {fpsRational: "30/1", fpsNominal: 30, width: 1080, height: 1920, durationUs: 5_000_000, totalFrames: 150},
  mappingRanges: [{rangeId: "r1", sourceAssetId: "src_01", sourceStartUs: 0, sourceEndUs: 5_000_000, editedStartUs: 0, editedEndUs: 5_000_000, speedMultiplier: 1.0}],
  removedRanges: [],
  lockedBy: "SMOKE",
  lockedAt: new Date().toISOString(),
  status: "LOCKED"
};

const smokePlan = resolveMotionPlan({
  contentId: "smoke_cnt",
  deliverableId: "deliv_01",
  editLock: dummyLock,
  intents: [{intentId: "smoke_i1", timelineStartUs: 0, timelineEndUs: 2_000_000, role: "HOOK", suggestedFamily: "MOT_PUSH_IN"}]
});

const styles = generateRemotionMotionStyles(smokePlan, 30, 30, 1080, 1920);
if (!styles.transform.includes("scale")) {
  console.error("Remotion styles smoke evaluation failed");
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  smokeEvaluation: "PASS",
  motionFamiliesCount: SIMPLE_MOTION_FAMILIES.length,
  systems: [
    "visual-motion-domain",
    "motion-engine",
    "spatial-scene",
    "motion-caption-policy",
    "platform-safe-zones",
    "remotion-composition",
    "cut-domain-editlock"
  ]
}, null, 2));
