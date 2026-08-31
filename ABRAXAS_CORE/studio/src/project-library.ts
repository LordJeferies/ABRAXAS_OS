/**
 * ABRAXAS Project Library Manager
 * Stores and manages creator studio projects with SQLite persistence.
 */

import { SqliteMemoryCore } from "../../memory/src/memory-core.js";
import { StudioProjectOutput } from "./creative-studio-engine.js";

export class StudioProjectLibrary {
  private readonly memory: SqliteMemoryCore;

  constructor(dbPath = ":memory:") {
    this.memory = new SqliteMemoryCore(dbPath);
  }

  public saveProject(project: StudioProjectOutput): void {
    this.memory.recordEpisodic(
      `Project: ${project.title}`,
      `Mode: ${project.mode} | CAS: ${project.casArtifactUri}`,
      {
        projectId: project.projectId,
        title: project.title,
        mode: project.mode,
        selectedOption: project.selectedOption,
        casArtifactUri: project.casArtifactUri,
        scriptContent: project.scriptContent,
        completedAt: project.completedAt
      },
      0.9,
      ["project_library", project.mode, project.projectId]
    );
  }

  public listProjects(): any[] {
    const episodes = this.memory.queryEpisodic(0.0);
    return episodes
      .filter((e) => e.tags && e.tags.includes("project_library"))
      .map((e) => e.details || {});
  }
}
