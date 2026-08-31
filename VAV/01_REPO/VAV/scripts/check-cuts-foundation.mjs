import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(root, "../../..");

const required = [
  "packages/cut-domain/src/index.ts",
  "packages/cut-engine/src/index.ts",
  "packages/time-mapping/src/index.ts",
  "packages/timebase/src/index.ts",
  "packages/project-session/src/index.ts",
  "packages/interchange/src/index.ts",
  "packages/export-system/src/index.ts"
];

const contractRequired = [
  "ABRAXAS_CORE/contracts/av-production/CUT_PLAN_CONTRACT_V1.md",
  "ABRAXAS_CORE/contracts/av-production/EDIT_LOCK_AND_TIME_MAPPING_CONTRACT_V1.md"
];

const missing = required.filter((p) => !fs.existsSync(path.join(root, p)));
const missingContracts = contractRequired.filter((p) => !fs.existsSync(path.join(repoRoot, p)));

if (missing.length || missingContracts.length) {
  console.error("CUTS FOUNDATION MISSING");
  for (const item of missing) console.error(`- VAV/${item}`);
  for (const item of missingContracts) console.error(`- ${item}`);
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  systems: [
    "cut-domain",
    "cut-engine",
    "time-mapping",
    "timebase",
    "project-session",
    "interchange",
    "export-system"
  ]
}, null, 2));
