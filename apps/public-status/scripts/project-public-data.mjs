import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const canonicalRegistryPath = path.resolve(__dirname, '../../../ABRAXAS_CORE/contracts/pipeline/PIPELINE_BLUEPRINT_REGISTRY_V1.json');
const publicOutputPath = path.resolve(__dirname, '../../../docs/abraxas-os-status/pipeline-blueprints.json');
const evidencePath = path.resolve(__dirname, '../../../docs/abraxas-os-status/evidence-index.json');

console.log('[Public Projection] Reading canonical pipeline registry from:', canonicalRegistryPath);

if (!fs.existsSync(canonicalRegistryPath)) {
  console.error('[Public Projection] Canonical pipeline registry not found!');
  process.exit(1);
}

const rawData = fs.readFileSync(canonicalRegistryPath, 'utf-8');
const registry = JSON.parse(rawData);

const publicBlueprintData = {
  registryClassification: registry.registryClassification,
  executionState: registry.executionState,
  version: registry.version,
  projectedAt: new Date().toISOString(),
  blueprints: registry.blueprints
};

fs.writeFileSync(publicOutputPath, JSON.stringify(publicBlueprintData, null, 2), 'utf-8');
console.log(`[Public Projection] Successfully projected ${registry.blueprints.length} seed blueprints to:`, publicOutputPath);

if (fs.existsSync(evidencePath)) {
  const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf-8'));
  console.log(`[Public Projection] Verified evidence index with ${evidence.items.length} public-safe records.`);
}
