import {createHash} from "node:crypto";
import {existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {homedir} from "node:os";
import {basename, dirname, extname, join} from "node:path";
import {approveArtifact, forceCandidate, parseAbraxasArtifact, type AbraxasArtifact, type CaptionStylePreset, type MotionPreset} from "@vav/abraxas-import";

export type AbraxasRegistry = Readonly<{
  schemaVersion: 1;
  updatedAt: string;
  approvedStyles: readonly CaptionStylePreset[];
  approvedMotions: readonly MotionPreset[];
  provenance: readonly Readonly<{
    sourceName: string;
    sourcePath: string;
    sha256: string;
    kind: string;
    importedAt: string;
  }>[];
}>;

export const abraxasRegistryPath = () =>
  join(homedir(), "Library", "Application Support", "VAV", "presets", "abraxas-registry.json");

const emptyRegistry = (): AbraxasRegistry => ({
  schemaVersion: 1,
  updatedAt: new Date(0).toISOString(),
  approvedStyles: [],
  approvedMotions: [],
  provenance: []
});

export const loadAbraxasRegistry = (): AbraxasRegistry => {
  const path = abraxasRegistryPath();
  if (!existsSync(path)) return emptyRegistry();
  const raw = JSON.parse(readFileSync(path, "utf8"));
  if (raw?.schemaVersion !== 1) throw new Error("ABRAXAS registry incompatible.");
  return {
    schemaVersion: 1,
    updatedAt: String(raw.updatedAt ?? new Date(0).toISOString()),
    approvedStyles: Array.isArray(raw.approvedStyles) ? raw.approvedStyles : [],
    approvedMotions: Array.isArray(raw.approvedMotions) ? raw.approvedMotions : [],
    provenance: Array.isArray(raw.provenance) ? raw.provenance : []
  };
};

const saveRegistry = (registry: AbraxasRegistry) => {
  const path = abraxasRegistryPath();
  mkdirSync(dirname(path), {recursive: true});
  writeFileSync(path, JSON.stringify(registry, null, 2), "utf8");
  return {path, registry};
};

const fileHash = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");

export const importAbraxasFile = (path: string, trust: "candidate" | "approved" = "candidate") => {
  const extension = extname(path).toLowerCase();
  if (![".txt", ".md", ".json", ".html", ".htm"].includes(extension)) {
    throw new Error("ABRAXAS import acepta TXT, MD, JSON o HTML como datos de referencia; no ejecuta TS/JS.");
  }

  const sourceName = basename(path);
  const text = readFileSync(path, "utf8");
  let artifact: AbraxasArtifact;

  if (extension === ".html" || extension === ".htm") {
    artifact = {
      artifactId: `artifact-${sourceName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
      kind: "quick-reference",
      status: "reference-only",
      sourceName,
      title: sourceName,
      confidence: null,
      executable: false,
      rawHeader: "HTML_REFERENCE",
      sections: {},
      warnings: ["HTML se conserva solo como referencia. VAV no ejecuta scripts ni estilos del archivo importado."],
      stylePreset: null,
      motionPreset: null,
      rawJson: null
    };
  } else {
    artifact = parseAbraxasArtifact(text, sourceName);
    artifact = trust === "approved" && artifact.executable
      ? approveArtifact(artifact)
      : forceCandidate(artifact);
  }

  return {
    artifact,
    provenance: {
      sourceName,
      sourcePath: path,
      sha256: fileHash(path),
      kind: artifact.kind,
      importedAt: new Date().toISOString()
    }
  };
};

export const approveImportedArtifact = (artifact: AbraxasArtifact, sourcePath: string | null = null) => {
  const approved = approveArtifact(artifact);
  const registry = loadAbraxasRegistry();
  const approvedStyles = approved.stylePreset
    ? [...registry.approvedStyles.filter((x) => x.id !== approved.stylePreset!.id), approved.stylePreset]
    : [...registry.approvedStyles];
  const approvedMotions = approved.motionPreset
    ? [...registry.approvedMotions.filter((x) => x.id !== approved.motionPreset!.id), approved.motionPreset]
    : [...registry.approvedMotions];

  const provenance = sourcePath && existsSync(sourcePath)
    ? [...registry.provenance.filter((x) => x.sourcePath !== sourcePath), {
        sourceName: basename(sourcePath),
        sourcePath,
        sha256: fileHash(sourcePath),
        kind: approved.kind,
        importedAt: new Date().toISOString()
      }]
    : [...registry.provenance];

  return saveRegistry({
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    approvedStyles,
    approvedMotions,
    provenance
  });
};

export const persistTrustedImport = (path: string) => {
  const imported = importAbraxasFile(path, "approved");
  if (!imported.artifact.executable) return {artifact: imported.artifact, registry: loadAbraxasRegistry(), path: abraxasRegistryPath()};
  const saved = approveImportedArtifact(imported.artifact, path);
  return {artifact: imported.artifact, ...saved};
};
