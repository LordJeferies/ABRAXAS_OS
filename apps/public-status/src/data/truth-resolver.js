export function resolvePublicCapabilityState(moduleId, publicKnowledge = {}, evidenceIndex = {}) {
  const items = evidenceIndex.items || [];
  const modules = publicKnowledge.modules || [];
  const modData = modules.find((m) => m.id === moduleId);

  if (!modData) {
    return {
      moduleId,
      name: moduleId,
      domain: 'Unknown',
      role: 'Unknown',
      truthLayer: 'UNKNOWN',
      status: 'UNKNOWN',
      evidenceId: null,
      runtimeEvidence: false
    };
  }

  // Find exact public evidence record
  const ev = items.find((item) => {
    if (moduleId === 'HE' && item.evidenceId === 'evidence:he-operations-desk') return true;
    if (moduleId === 'VAV' && (item.evidenceId === 'evidence:cuts-ffmpeg-local' || item.evidenceId === 'evidence:vav-motion-remotion-render')) return true;
    if (moduleId === 'LIENZO' && item.evidenceId === 'evidence:lienzo-domain-core') return true;
    if (moduleId === 'SHIM' && item.evidenceId === 'evidence:shim-observation-core') return true;
    if (moduleId === 'ARQUITECTO' && item.evidenceId === 'evidence:public-architect-v1') return true;
    if (moduleId === 'PIPELINE_ENGINE' && item.evidenceId === 'evidence:pipeline-orchestrator') return true;
    return false;
  });

  // Strict public-safe truth layer classification:
  // 1. RELEASED_CURRENT: HE, VAV (verified frozen release product runtimes)
  // 2. POST_RC1_CANDIDATE: YOD, LIENZO, SHIM, ARQUITECTO (verified candidate domain runtimes)
  // 3. CONTRACT_ONLY: PIPELINE_ENGINE, AI_RUNTIME, PUBLISHING, METRICS, UNIVERSAL_INTAKE, EVENTS, ARTIFACTS (blueprint schemas, DAGs, contracts)
  let truthLayer = 'CONTRACT_ONLY';
  let hasRuntime = false;

  if (moduleId === 'HE' || moduleId === 'VAV') {
    truthLayer = 'RELEASED_CURRENT';
    hasRuntime = true;
  } else if (['YOD', 'LIENZO', 'SHIM', 'ARQUITECTO'].includes(moduleId)) {
    truthLayer = 'POST_RC1_CANDIDATE';
    hasRuntime = true;
  } else if (['PIPELINE_ENGINE', 'AI_RUNTIME', 'PUBLISHING', 'METRICS', 'UNIVERSAL_INTAKE', 'EVENTS', 'ARTIFACTS'].includes(moduleId)) {
    truthLayer = 'CONTRACT_ONLY';
    hasRuntime = false;
  } else {
    truthLayer = 'UNKNOWN';
  }

  return {
    moduleId,
    name: modData.name,
    domain: modData.domain,
    role: modData.role,
    truthLayer,
    status: modData.status,
    evidenceId: ev?.evidenceId || null,
    runtimeEvidence: hasRuntime
  };
}
