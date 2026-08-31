import type {Permission, TeamMember, TeamRole} from "./types.ts";

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecurityError";
  }
}

export const ROLE_PERMISSIONS: Record<TeamRole, readonly Permission[]> = {
  OWNER: [
    "task.create", "task.edit", "task.assign", "task.change_state", "task.override_dependency", "task.review",
    "deadline.create", "deadline.edit", "recording.create", "recording.edit", "recording.confirm",
    "approval.request", "approval.decide", "approval.decide_any", "team.view", "team.manage",
    "lienzo.view", "lienzo.edit", "publication.view", "publication.schedule", "metrics.view", "provider.configure",
    "time.track", "time.manual", "time.view_own", "time.view_team", "time.edit"
  ],
  MANAGER: [
    "task.create", "task.edit", "task.assign", "task.change_state", "task.override_dependency", "task.review",
    "deadline.create", "deadline.edit", "recording.create", "recording.edit", "recording.confirm",
    "approval.request", "approval.decide", "approval.decide_any", "team.view", "team.manage",
    "lienzo.view", "lienzo.edit", "publication.view", "publication.schedule", "metrics.view",
    "time.track", "time.manual", "time.view_own", "time.view_team", "time.edit"
  ],
  EDITOR: [
    "task.create", "task.edit", "task.change_state", "task.review",
    "recording.create", "recording.edit",
    "approval.request", "approval.decide",
    "team.view", "lienzo.view", "lienzo.edit", "publication.view",
    "time.track", "time.manual", "time.view_own"
  ],
  DIRECTOR: [
    "task.create", "task.edit", "task.assign", "task.change_state", "task.review",
    "recording.create", "recording.edit", "recording.confirm",
    "approval.request", "approval.decide",
    "team.view", "lienzo.view", "lienzo.edit", "publication.view",
    "time.track", "time.manual", "time.view_own"
  ],
  TALENT: [
    "task.change_state", "team.view", "lienzo.view",
    "time.track", "time.manual", "time.view_own"
  ],
  VIEWER: [
    "team.view", "lienzo.view", "publication.view", "metrics.view",
    "time.view_own"
  ],
  DESIGNER: [
    "task.create", "task.edit", "task.change_state", "team.view", "lienzo.view", "time.track", "time.manual", "time.view_own"
  ],
  CUSTOM: [
    "task.create", "task.edit", "team.view", "time.track", "time.view_own"
  ]
};

export function hasPermission(member: TeamMember | undefined, permission: Permission): boolean {
  if (!member || member.status !== "ACTIVE") {
    return false;
  }
  if (member.customPermissions && member.customPermissions.includes(permission)) {
    return true;
  }
  for (const role of member.roles) {
    const permissions = ROLE_PERMISSIONS[role];
    if (permissions && permissions.includes(permission)) {
      return true;
    }
  }
  return false;
}

export function assertPermission(member: TeamMember | undefined, permission: Permission, actionDescription: string): void {
  if (!hasPermission(member, permission)) {
    const memberName = member ? `${member.displayName} (${member.userId})` : "Unauthenticated Actor";
    throw new SecurityError(`Access Denied: ${memberName} lacks required permission '${permission}' to ${actionDescription}.`);
  }
}
