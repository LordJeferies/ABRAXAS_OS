import type {TeamMember} from "../runtime/types.ts";

export type HeNavView =
  | "solo"
  | "team"
  | "tasks"
  | "kanban"
  | "calendar"
  | "deadlines"
  | "recordings"
  | "reviews"
  | "time"
  | "notifications"
  | "people"
  | "activity";

export type CalendarViewMode = "month" | "week" | "list";

export type HeGlobalState =
  | "FIRST_RUN"
  | "EMPTY"
  | "LOADING"
  | "READY"
  | "ERROR"
  | "PERMISSION_DENIED";

export type ProductSession = {
  currentActorId: string;
  currentMember: TeamMember | undefined;
  availableMembers: readonly TeamMember[];
};
