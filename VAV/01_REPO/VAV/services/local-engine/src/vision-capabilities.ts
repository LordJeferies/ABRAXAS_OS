import {existsSync, readdirSync} from "node:fs";
import {homedir, arch, platform} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
import type {VisionCapability, VisionCapabilityId, VisionProviderReport} from "@vav/vision-contracts";

const providersRoot = () => join(homedir(), "Library", "Application Support", "VAV", "providers");
const executable = (path: string) => existsSync(path);

const safeExec = (command: string, args: string[]) => {
  try { return execFileSync(command, args, {encoding: "utf8", timeout: 8000}).trim(); }
  catch { return null; }
};

const swiftAvailable = () => Boolean(safeExec("/usr/bin/xcrun", ["--find", "swift"]));

const nativeSidecarCapabilities = (path: string): ReadonlySet<string> => {
  if (!executable(path)) return new Set();
  try {
    const raw = safeExec(path, ["capabilities"]);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const values = Array.isArray(parsed?.implemented) ? parsed.implemented.map(String) : [];
    return new Set(values);
  } catch {
    return new Set();
  }
};

const appleVisionCapabilities = (sidecarPath: string): VisionCapability[] => {
  const platformReady = platform() === "darwin" && swiftAvailable();
  const implemented = nativeSidecarCapabilities(sidecarPath);
  const foundationIds: VisionCapabilityId[] = [
    "person-segmentation", "face-detection", "face-landmarks", "ocr",
    "saliency-attention", "saliency-objectness"
  ];
  const plannedIds: VisionCapabilityId[] = [
    "person-instance-mask", "foreground-instance-mask", "body-pose-2d", "body-pose-3d",
    "hand-pose", "optical-flow", "object-tracking", "rectangle-tracking", "homography",
    "image-feature-print", "image-aesthetics", "coreml-custom"
  ];

  const foundation = foundationIds.map((id): VisionCapability => ({
    id,
    provider: "apple-vision",
    availability: implemented.has(id)
      ? "available"
      : platformReady ? "installed-unverified" : "unsupported",
    confidence: implemented.has(id) ? 1 : null,
    notes: implemented.has(id)
      ? "Implemented by vav-vision-macos sidecar. Runtime output remains subject to per-frame confidence and quality gates."
      : platformReady
        ? "Apple Vision SDK is present, but this capability is not yet verified through the installed VAV sidecar."
        : "Apple Vision native provider is unavailable on this platform."
  }));

  const planned = plannedIds.map((id): VisionCapability => ({
    id,
    provider: "apple-vision",
    availability: platformReady ? "planned" : "unsupported",
    confidence: null,
    notes: platformReady
      ? "Framework capability is part of the VAV Vision roadmap; not claimed implemented by the current sidecar."
      : "Apple Vision native provider is unavailable on this platform."
  }));

  return [...foundation, ...planned];
};

export const collectVisionProviderReport = (): VisionProviderReport => {
  const root = providersRoot();
  const nativeSidecar = join(root, "vav-vision-macos", "bin", "vav-vision-macos");
  const samRoot = join(root, "sam2");
  const cutieRoot = join(root, "cutie");
  const samRepo = join(samRoot, "repo");
  const samPython = join(samRoot, ".venv", "bin", "python");
  const cutieRepo = join(cutieRoot, "repo");
  const cutiePython = join(cutieRoot, ".venv", "bin", "python");
  const samCheckpoints = join(samRepo, "checkpoints");
  const checkpointCount = existsSync(samCheckpoints)
    ? readdirSync(samCheckpoints).filter((x) => x.endsWith(".pt")).length
    : 0;

  const extra: VisionCapability[] = [
    {
      id: "object-segmentation-advanced",
      provider: "sam2",
      availability: executable(samPython) ? "available" : existsSync(samRepo) ? "installed-unverified" : "missing",
      confidence: executable(samPython) ? .8 : null,
      notes: `SAM2 repo=${existsSync(samRepo)} venv=${executable(samPython)} checkpoints=${checkpointCount}. A ready venv means provider installed, not that every video passes quality gates.`
    },
    {
      id: "mask-tracking-advanced",
      provider: "cutie",
      availability: executable(cutiePython) ? "available" : existsSync(cutieRepo) ? "installed-unverified" : "missing",
      confidence: executable(cutiePython) ? .8 : null,
      notes: `Cutie repo=${existsSync(cutieRepo)} venv=${executable(cutiePython)}. Intended for temporal mask propagation after an initial mask.`
    },
    {
      id: "depth",
      provider: "coreml-depth",
      availability: "planned",
      confidence: null,
      notes: "Provider contract reserved for a Core ML monocular depth implementation. No dense depth renderer is claimed in this corrida."
    }
  ];

  return {
    generatedAt: new Date().toISOString(),
    platform: platform(),
    arch: arch(),
    providersRoot: root,
    capabilities: [...appleVisionCapabilities(nativeSidecar), ...extra]
  };
};
