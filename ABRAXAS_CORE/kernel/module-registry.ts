/**
 * ABRAXAS Module Registry with Lifecycle Management
 */

export interface AbraxasModule {
  name: string;
  version: string;
  purpose: string;
  status: "ACTIVE" | "INACTIVE";
  dependencies?: string[];
  capabilities?: string[];
  initialize(): Promise<void>;
  healthCheck(): Promise<any>;
  shutdown(): Promise<void>;
}

export class ModuleRegistry {
  private modules: AbraxasModule[] = [];

  constructor() {
    this.bootstrapCanonicalModules();
  }

  private bootstrapCanonicalModules(): void {
    const moduleDefs = [
      { name: "YOD", purpose: "Creative Potential & Opportunity Formulation", capabilities: ["RADAR", "HOOK_TAXONOMY"] },
      { name: "CONTENIDO", purpose: "Identity Spine & CAS DAG Revision Stratigraphy", capabilities: ["CAS_DAG", "REVISIONS"] },
      { name: "SHIM", purpose: "Da'at Reality Metrology & Verification Gate", capabilities: ["METROLOGY", "CERTIFICATES"] },
      { name: "VAV", purpose: "Audiovisual Formation Forge & Lossless Renders", capabilities: ["FFMPEG_CUT", "REMOTION", "CAPTIONS"] },
      { name: "HE", purpose: "Operations Desk, Human Reviews & Publishing Governance", capabilities: ["KANBAN", "APPROVALS"] },
      { name: "ARQUITECTO", purpose: "Cognitive Intention Interface & Telemetry Monitor", capabilities: ["INTENTION_ENGINE", "PLANNER"] },
      { name: "GUARDIAN", purpose: "Autonomous System Health & Drift Daemon", capabilities: ["DRIFT_DETECTION", "AUTO_REPAIR"] },
      { name: "MEMORY", purpose: "Stratigraphic SQLite & Semantic Vector Memory", capabilities: ["EPISODIC", "VECTOR_SEARCH"] }
    ];

    for (const def of moduleDefs) {
      this.register({
        name: def.name,
        version: "5.1.0",
        purpose: def.purpose,
        status: "ACTIVE",
        capabilities: def.capabilities,
        initialize: async () => {},
        healthCheck: async () => ({ status: "HEALTHY", checkedAt: new Date().toISOString() }),
        shutdown: async () => {}
      });
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
    return this.modules;
  }

  public get(name: string): AbraxasModule | undefined {
    return this.modules.find((m) => m.name === name);
  }
}
