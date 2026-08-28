import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "packages/ficha-domain/src/index.ts",
  "packages/content-import/src/index.ts",
  "packages/content-intent/src/index.ts",
  "packages/time-mapping/src/index.ts",
  "packages/visual-motion-domain/src/index.ts",
  "packages/motion-caption-policy/src/index.ts",
  "packages/module-graph/src/index.ts",
  "packages/interchange/src/index.ts",
  "packages/caption-compiler/src/index.ts",
  "schemas/interchange/vav-motion-manifest.example.json",
  "schemas/content/content-intent.example.json"
];

const missing = required.filter((p) => !fs.existsSync(path.join(root, p)));
if (missing.length) {
  console.error("CONTENT/MOTION BRIDGE MISSING");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  systems: [
    "ficha-domain",
    "content-import",
    "content-intent",
    "time-mapping",
    "visual-motion-domain",
    "motion-caption-policy",
    "module-graph",
    "interchange",
    "caption-compiler"
  ]
}, null, 2));
