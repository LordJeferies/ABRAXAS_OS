import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import crypto from "node:crypto";
import {bundle} from "../services/local-engine/node_modules/@remotion/bundler/dist/index.mjs";
import {renderStill, selectComposition} from "../services/local-engine/node_modules/@remotion/renderer/dist/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(root, "../../..");
const outDir = "/tmp/vav_remotion_frames";
fs.mkdirSync(outDir, {recursive: true});

const entryPoint = path.resolve(root, "packages/remotion-composition/src/render-entry.tsx");
console.log("Bundling Remotion entry point:", entryPoint);

const serveUrl = await bundle({
  entryPoint,
  rootDir: repoRoot,
  outDir: "/tmp/vav_bundle_out"
});

console.log("Remotion bundle served at:", serveUrl);

const editLock = {
  editLockId: "lock_e2e_remotion_01",
  contentId: "cnt_e2e",
  deliverableId: "deliv_01",
  cutPlanId: "cp_01",
  cutPlanVersion: 1,
  timeMappingVersion: 1,
  timeMappingHash: "tmh_e2e_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  timebase: {fpsRational: "30/1", fpsNominal: 30, width: 720, height: 1280, durationUs: 6_000_000, totalFrames: 180},
  mappingRanges: [{rangeId: "r1", sourceAssetId: "src_01", sourceStartUs: 0, sourceEndUs: 6_000_000, editedStartUs: 0, editedEndUs: 6_000_000, speedMultiplier: 1.0}],
  removedRanges: [],
  lockedBy: "E2E",
  lockedAt: new Date().toISOString(),
  status: "LOCKED"
};

const {resolveMotionPlan} = await import("../packages/motion-engine/src/index.ts");

const motionPlan = resolveMotionPlan({
  contentId: "cnt_e2e",
  deliverableId: "deliv_01",
  editLock,
  intents: [
    {intentId: "i_push", timelineStartUs: 0, timelineEndUs: 1_500_000, role: "HOOK", suggestedPresetId: "PRESET_PUSH_IN_DYNAMIC_V1"},
    {intentId: "i_pan", timelineStartUs: 1_500_000, timelineEndUs: 3_000_000, role: "DEVELOPMENT", suggestedPresetId: "PRESET_HORIZONTAL_PAN_RIGHT_V1"},
    {intentId: "i_fade", timelineStartUs: 3_000_000, timelineEndUs: 4_500_000, role: "DEVELOPMENT", suggestedPresetId: "PRESET_SMOOTH_FADE_OUT_V1"},
    {intentId: "i_trans", timelineStartUs: 4_500_000, timelineEndUs: 6_000_000, role: "PAYOFF", suggestedPresetId: "PRESET_WHIP_DIP_TRANSITION_V1"}
  ]
});

const composition = await selectComposition({
  serveUrl,
  id: "VAVMotionComposition",
  inputProps: {motionPlan, editLock, frame: 0}
});

console.log("Selected composition:", composition.id, `${composition.width}x${composition.height}`, `${composition.fps}fps`);

const testFrames = [
  {name: "frame_000_neutral", frame: 0, testType: "NEUTRAL_START"},
  {name: "frame_022_push_zoom", frame: 22, testType: "PUSH_ZOOM"},
  {name: "frame_067_pan_translate", frame: 67, testType: "PAN_TRANSLATE"},
  {name: "frame_112_fade_reveal", frame: 112, testType: "FADE_REVEAL"},
  {name: "frame_157_basic_transition", frame: 157, testType: "BASIC_TRANSITION"}
];

const renderedEvidence = [];

for (const tf of testFrames) {
  const outPath = path.join(outDir, `${tf.name}.png`);
  await renderStill({
    composition,
    serveUrl,
    output: outPath,
    inputProps: {motionPlan, editLock, frame: tf.frame},
    frame: tf.frame,
    imageFormat: "png"
  });

  const fileStat = fs.statSync(outPath);
  const fileBuf = fs.readFileSync(outPath);
  const sha = crypto.createHash("sha256").update(fileBuf).digest("hex");

  console.log(`Rendered frame ${tf.frame} (${tf.testType}) -> ${outPath} [size: ${fileStat.size} bytes, sha256: ${sha.substring(0, 16)}...]`);
  renderedEvidence.push({
    testType: tf.testType,
    frame: tf.frame,
    path: outPath,
    sizeBytes: fileStat.size,
    sha256: sha,
    exists: fileStat.size > 0
  });
}

const allExist = renderedEvidence.every((e) => e.exists);
console.log("\n=== REMOTION RENDER EVIDENCE SUMMARY ===");
console.log(JSON.stringify({
  status: allExist ? "PASS" : "FAIL",
  rendererApi: "@remotion/renderer (renderStill)",
  compositionId: composition.id,
  framesRendered: renderedEvidence.length,
  renderedEvidence
}, null, 2));

// Clean up bundle dir
fs.rmSync("/tmp/vav_bundle_out", {recursive: true, force: true});
