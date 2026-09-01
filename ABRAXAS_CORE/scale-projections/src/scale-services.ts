/**
 * Unified Search Index, Command Registry, and Version Diff Explorer
 */

import { SearchEntityType, SearchIndexItem, NavigationCommand, VersionDiffResult } from "./types.js";
import { Lienzo } from "../../LIENZO/src/types.js";

export class SearchIndexService {
  private items: SearchIndexItem[] = [];

  public indexItem(item: SearchIndexItem): void {
    this.items = this.items.filter((i) => !(i.id === item.id && i.type === item.type));
    this.items.push(item);
  }

  public search(query: string, typeFilter?: SearchEntityType): SearchIndexItem[] {
    const q = query.toLowerCase().trim();
    return this.items.filter((item) => {
      if (typeFilter && item.type !== typeFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }
}

export class NavigationCommandRegistry {
  private commands: NavigationCommand[] = [];

  constructor() {
    this.seedDefaultCommands();
  }

  private seedDefaultCommands(): void {
    this.commands.push({
      commandId: "cmd_nav_calendar",
      title: "Go to Calendar",
      category: "NAVIGATION",
      route: "/calendar"
    });
    this.commands.push({
      commandId: "cmd_nav_tasks",
      title: "Go to Tasks Kanban",
      category: "NAVIGATION",
      route: "/tasks"
    });
    this.commands.push({
      commandId: "cmd_action_create_lienzo",
      title: "Create New Content Lienzo",
      category: "ACTION",
      actionKey: "LIENZO_CREATE",
      requiredRole: "PRODUCER"
    });
  }

  public registerCommand(cmd: NavigationCommand): void {
    this.commands.push(cmd);
  }

  public listCommands(role?: string): NavigationCommand[] {
    if (!role) return [...this.commands];
    return this.commands.filter((c) => !c.requiredRole || c.requiredRole === role || role === "OWNER");
  }
}

export class VersionDiffExplorer {
  public diffLienzoRevisions(lienzo: Lienzo, fromRev: number, toRev: number): VersionDiffResult {
    const historyFrom = lienzo.history.find((h) => h.revision === fromRev);
    const historyTo = lienzo.history.find((h) => h.revision === toRev);

    if (!historyFrom || !historyTo) {
      throw new Error(`Revision range [${fromRev}..${toRev}] not found in Lienzo history`);
    }

    const changes: Array<{ field: string; before: unknown; after: unknown }> = [];

    for (let r = fromRev + 1; r <= toRev; r++) {
      const step = lienzo.history.find((h) => h.revision === r);
      if (step?.componentChanges) {
        for (const c of step.componentChanges) {
          changes.push({
            field: `component:${c.componentId}`,
            before: c.before?.status ?? "NONE",
            after: c.after?.status ?? "NONE"
          });
        }
      }
      if (step?.lifecycleChange) {
        changes.push({
          field: "lifecycle",
          before: step.lifecycleChange.before,
          after: step.lifecycleChange.after
        });
      }
    }

    return {
      entityType: "LIENZO",
      entityId: lienzo.contentId,
      fromRevision: fromRev,
      toRevision: toRev,
      changes
    };
  }
}
