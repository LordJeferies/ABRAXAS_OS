import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const required = [
  "packages/editor-foundation/src/history.ts",
  "packages/editor-foundation/src/commands.ts",
  "packages/editor-foundation/src/selection.ts",
  "packages/editor-foundation/src/snapping.ts",
  "packages/project-session/src/session.ts",
  "packages/project-session/src/recovery.ts",
  "packages/project-session/src/migrations.ts",
  "packages/project-session/src/relink.ts",
  "packages/project-session/src/fonts.ts",
  "packages/caption-tracks/src/modes.ts",
  "packages/export-system/src/qc.ts",
  "packages/export-system/src/queue.ts",
  "packages/brand-presets/src/versioned-preset.ts",
  "config/default-workspace-layout.json"
];

const missing = required.filter((relative) => !fs.existsSync(path.join(root, relative)));

if (missing.length > 0) {
  console.error("PRO FOUNDATION MISSING:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log(JSON.stringify({
  status: "PASS",
  filesChecked: required.length,
  systems: [
    "history",
    "commands",
    "selection",
    "snapping",
    "project-session",
    "recovery",
    "migrations",
    "relink",
    "fonts",
    "caption-tracks",
    "qc",
    "export-queue",
    "preset-versioning",
    "workspace-layout"
  ]
}, null, 2));
