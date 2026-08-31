/**
 * ABRAXAS Module Registry
 * Central registry for all 13 canonical operational modules.
 */

export interface AbraxasModule {
  name: string;
  version: string;
  status: "ACTIVE" | "INACTIVE";
  dependencies: string[];
  capabilities: string[];
}

export class ModuleRegistry {
  private modules: AbraxasModule[] = [];

  constructor() {
    this.bootstrapCanonicalModules();
  }

  private bootstrapCanonicalModules(): void {
    const canonicalModules: AbraxasModule[] = [
      { name: "YOD", version: "4.0.0", status: "ACTIVE", dependencies: [], capabilities: ["OPPORTUNITY_RADAR", "HOOK_TAXONOMY", "BRAND_VOICE"] },
      { name: "CONTENIDO", version: "4.0.0", status: "ACTIVE", dependencies: ["backbone"], capabilities: ["IMMUTABLE_CAS_DAG", "REVISION_STRATIGRAPHY"] },
      { name: "SHIM", version: "4.0.0", status: "ACTIVE", dependencies: ["CONTENIDO", "transcription"], capabilities: ["DAAT_REALITY_METROLOGY", "GAP_DETECTION"] },
      { name: "VAV", version: "4.0.0", status: "ACTIVE", dependencies: ["SHIM", "CONTENIDO"], capabilities: ["LOSSLESS_CUTS", "KINETIC_TYPOGRAPHY", "REMOTION_MOTION"] },
      { name: "HE", version: "4.0.0", status: "ACTIVE", dependencies: ["CONTENIDO"], capabilities: ["OPERATIONS_DESK", "KANBAN", "CALENDAR", "APPROVALS"] },
      { name: "ARQUITECTO", version: "4.0.0", status: "ACTIVE", dependencies: ["kernel"], capabilities: ["COGNITIVE_PLANNER", "INTENTION_ENGINE", "TELEMETRY_MONITOR"] },
      { name: "PIPELINE", version: "4.0.0", status: "ACTIVE", dependencies: ["kernel"], capabilities: ["DAG_RUNNER", "TREE_OF_LIFE_ENGINE"] },
      { name: "AI_RUNTIME", version: "4.0.0", status: "ACTIVE", dependencies: [], capabilities: ["TOKEN_BROKER", "DETERMINISTIC_CACHE", "PROVIDER_ROUTING"] },
      { name: "UNIVERSAL_INTAKE", version: "4.0.0", status: "ACTIVE", dependencies: ["SHIM"], capabilities: ["MEDIA_PROBING", "CAS_HASHING"] },
      { name: "PUBLISHING", version: "4.0.0", status: "ACTIVE", dependencies: ["HE"], capabilities: ["PLATFORM_MANIFESTS", "PUBLISH_RECEIPTS"] },
      { name: "METRICS", version: "4.0.0", status: "ACTIVE", dependencies: ["PUBLISHING"], capabilities: ["AUDIENCE_TELEMETRY", "PERFORMANCE_VECTORS"] },
      { name: "EVENTS", version: "4.0.0", status: "ACTIVE", dependencies: [], capabilities: ["NEURAL_EVENT_STREAM", "AUDIT_PERSISTENCE"] },
      { name: "ARTIFACTS", version: "4.0.0", status: "ACTIVE", dependencies: [], capabilities: ["CAS_REGISTRY", "BYTE_INTEGRITY"] }
    ];

    for (const mod of canonicalModules) {
      this.register(mod);
    }
  }

  public register(module: AbraxasModule): void {
    const existingIndex = this.modules.findIndex((m) => m.name === module.name);
    if (existingIndex >= 0) {
      this.modules[existingIndex] = module;
    } else {
      this.modules.push(module);
    }
  }

  public list(): AbraxasModule[] {
    return [...this.modules];
  }

  public get(name: string): AbraxasModule | undefined {
    return this.modules.find((m) => m.name === name);
  }
}
