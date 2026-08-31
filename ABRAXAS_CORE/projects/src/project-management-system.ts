/**
 * ABRAXAS Project Management System V9.0
 * Handles project lifecycle: Save, Load, Duplicate, Continue, with full Four Worlds state tracking.
 */

import { KabbalisticWorld } from "../../ontology/src/operator-schema.js";
import { SqliteMemoryCore } from "../../memory/src/memory-core.js";

export interface ManagedProject {
  id: string;
  name: string;
  brand: string;
  objective: string;
  assets: {
    sourceMediaUri?: string;
    scriptUri?: string;
    storyboardUri?: string;
    motionManifestUri?: string;
    captionsUri?: string;
    renderMp4Uri?: string;
    casPackageUri?: string;
  };
  currentWorld: KabbalisticWorld;
  currentOperator: string;
  pipelineState: "DRAFT" | "ANALYZING" | "PRODUCING" | "CERTIFIED" | "MANIFESTED";
  outputsCount: number;
  createdAt: string;
  updatedAt: string;
}

export class ProjectManagementSystem {
  private readonly memory: SqliteMemoryCore;

  constructor(dbPath = ":memory:") {
    this.memory = new SqliteMemoryCore(dbPath);
  }

  public saveProject(project: ManagedProject): void {
    this.memory.recordEpisodic(
      `Project Saved: ${project.name}`,
      `World: ${project.currentWorld} | State: ${project.pipelineState}`,
      project,
      0.9,
      ["project_manager", project.id, project.brand.toLowerCase()]
    );
  }

  public loadProject(projectId: string): ManagedProject | undefined {
    const episodes = this.memory.queryEpisodic(0.0);
    const match = episodes.find((e) => e.details?.id === projectId);
    return match?.details as ManagedProject | undefined;
  }

  public duplicateProject(sourceId: string, newName: string): ManagedProject {
    const source = this.loadProject(sourceId);
    if (!source) throw new Error(`Project ${sourceId} not found`);

    const duplicated: ManagedProject = {
      ...source,
      id: `proj_${Date.now()}_copy`,
      name: newName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveProject(duplicated);
    return duplicated;
  }

  public listProjects(): ManagedProject[] {
    const episodes = this.memory.queryEpisodic(0.0);
    return episodes
      .filter((e) => e.tags?.includes("project_manager"))
      .map((e) => e.details as ManagedProject);
  }
}
