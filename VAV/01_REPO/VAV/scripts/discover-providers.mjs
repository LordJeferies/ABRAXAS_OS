import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const home = os.homedir();

const which = (command) => {
  try {
    const tool = process.platform === "win32" ? "where" : "which";
    return execFileSync(tool, [command], {encoding: "utf8"}).trim().split(/\r?\n/)[0] || null;
  } catch {
    return null;
  }
};

const whisperModelPath = process.platform === "darwin"
  ? path.join(home, "Library", "Application Support", "VAV", "models", "whisper", "ggml-large-v3-turbo.bin")
  : path.join(home, ".vav", "models", "whisper", "ggml-large-v3-turbo.bin");

const roots = ["Desktop", "Documents", "Downloads", "Developer", "Projects"]
  .map((name) => path.join(home, name))
  .filter((candidate) => fs.existsSync(candidate));

const skipNames = new Set([
  "node_modules", ".git", "Library", ".Trash", "Caches", "target", "dist"
]);

const foundExecutables = [];
const foundModels = new Map();
let visited = 0;
const MAX_VISITED = 60000;
const MAX_DEPTH = 6;

const walk = (dir, depth) => {
  if (depth > MAX_DEPTH || visited >= MAX_VISITED) return;
  let entries;
  try {
    entries = fs.readdirSync(dir, {withFileTypes: true});
  } catch {
    return;
  }

  for (const entry of entries) {
    visited += 1;
    if (visited >= MAX_VISITED) return;
    if (skipNames.has(entry.name)) continue;
    const full = path.join(dir, entry.name);

    if (entry.isFile() && entry.name === "mlx_whisper") {
      foundExecutables.push(full);
      continue;
    }

    if (entry.isDirectory()) {
      if (entry.name === "whisper-large-v3-turbo") {
        foundModels.set("large-v3-turbo", full);
        continue;
      }
      if (entry.name === "whisper-large-v3") {
        foundModels.set("large-v3", full);
        continue;
      }
      walk(full, depth + 1);
    }
  }
};

for (const candidate of roots) walk(candidate, 0);

const providerRoot = process.platform === "darwin"
  ? path.join(home, "Library", "Application Support", "VAV", "providers")
  : path.join(home, ".vav", "providers");

const executableFile = (candidate) => {
  try { fs.accessSync(candidate, fs.constants.X_OK); return true; } catch { return false; }
};

const pythonImportReady = (python, module) => {
  if (!executableFile(python)) return false;
  try {
    execFileSync(python, ["-c", `import ${module}`], {
      stdio: "ignore",
      env: {...process.env, PYTORCH_ENABLE_MPS_FALLBACK: "1"}
    });
    return true;
  } catch {
    return false;
  }
};

const sam2Root = path.join(providerRoot, "sam2");
const sam2Repo = path.join(sam2Root, "repo");
const sam2Python = path.join(sam2Root, ".venv", "bin", "python");
const sam2Checkpoints = path.join(sam2Repo, "checkpoints");
const sam2CheckpointCount = fs.existsSync(sam2Checkpoints)
  ? fs.readdirSync(sam2Checkpoints).filter((name) => name.endsWith(".pt")).length
  : 0;

const cutieRoot = path.join(providerRoot, "cutie");
const cutieRfRepo = path.join(cutieRoot, "rf-repo");
const cutieLegacyRepo = path.join(cutieRoot, "repo");
const cutieRepo = fs.existsSync(cutieRfRepo) ? cutieRfRepo : cutieLegacyRepo;
const cutiePython = path.join(cutieRoot, ".venv", "bin", "python");
const opencvRoot = path.join(providerRoot, "opencv");
const opencvPython = path.join(opencvRoot, ".venv", "bin", "python");
const visionSidecar = path.join(providerRoot, "vav-vision-macos", "bin", "vav-vision-macos");

const mlxSupported = process.platform === "darwin" && process.arch === "arm64";
const mlxExecutable = foundExecutables[0] ?? null;
const mlxModels = [
  foundModels.has("large-v3-turbo") ? {
    id: "large-v3-turbo",
    label: "Large V3 Turbo",
    path: foundModels.get("large-v3-turbo"),
    installed: true
  } : null,
  foundModels.has("large-v3") ? {
    id: "large-v3",
    label: "Large V3",
    path: foundModels.get("large-v3"),
    installed: true
  } : null
].filter(Boolean);

const state = {
  generatedAt: new Date().toISOString(),
  platform: process.platform,
  arch: process.arch,
  whisperCpp: {
    available: Boolean(which("whisper-cli")) && fs.existsSync(whisperModelPath),
    executable: which("whisper-cli"),
    model: {
      id: "large-v3-turbo",
      label: "Large V3 Turbo FULL",
      path: whisperModelPath,
      installed: fs.existsSync(whisperModelPath)
    }
  },
  mlx: {
    supported: mlxSupported,
    available: mlxSupported && Boolean(mlxExecutable) && mlxModels.length > 0,
    reason: mlxSupported ? null : "apple-silicon-only",
    executable: mlxSupported ? mlxExecutable : null,
    models: mlxSupported ? mlxModels : []
  },
  vision: {
    supported: process.platform === "darwin",
    sidecar: {
      executable: visionSidecar,
      installed: executableFile(visionSidecar)
    },
    sam2: {
      repo: sam2Repo,
      repoInstalled: fs.existsSync(sam2Repo),
      python: sam2Python,
      venvReady: pythonImportReady(sam2Python, "sam2"),
      checkpointCount: sam2CheckpointCount
    },
    cutie: {
      repo: cutieRepo,
      repoInstalled: fs.existsSync(cutieRepo),
      python: cutiePython,
      venvReady: pythonImportReady(cutiePython, "cutie"),
      packaging: fs.existsSync(cutieRfRepo) ? "rf-cutie" : "legacy-upstream"
    },
    opencv: {
      python: opencvPython,
      venvReady: pythonImportReady(opencvPython, "cv2")
    }
  }
};

const generatedPath = path.join(
  root, "apps", "captions-desktop", "src", "generated", "provider-state.json"
);
const configPath = path.join(root, "config", "providers.local.json");

fs.mkdirSync(path.dirname(generatedPath), {recursive: true});
fs.mkdirSync(path.dirname(configPath), {recursive: true});
fs.writeFileSync(generatedPath, JSON.stringify(state, null, 2) + "\n");
fs.writeFileSync(configPath, JSON.stringify(state, null, 2) + "\n");

console.log(JSON.stringify(state, null, 2));
