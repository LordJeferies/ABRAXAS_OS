import React, {useState} from "react";
import {useHe} from "./HeContext.tsx";
import type {HeNavView} from "./types.ts";
import {SoloQueueView} from "./SoloQueueView.tsx";
import {TeamDashboardView} from "./TeamDashboardView.tsx";
import {TasksView} from "./TasksView.tsx";
import {KanbanView} from "./KanbanView.tsx";
import {CalendarView} from "./CalendarView.tsx";
import {DeadlinesView} from "./DeadlinesView.tsx";
import {RecordingSessionsView} from "./RecordingSessionsView.tsx";
import {ReviewsView} from "./ReviewsView.tsx";
import {TimeTrackingView} from "./TimeTrackingView.tsx";
import {NotificationsView} from "./NotificationsView.tsx";
import {PeopleView} from "./PeopleView.tsx";
import {ActivityView} from "./ActivityView.tsx";
import {OperationalSpatialLandmark} from "./OperationalSpatialLandmark.tsx";

export const HeProductShell: React.FC = () => {
  const {session, activeView, setActiveView, globalState, errorMessage, setCurrentActorId, bootstrapOwner, service} = useHe();
  const [bootstrapName, setBootstrapName] = useState("Lead Producer");
  const [bootstrapId, setBootstrapId] = useState("u_owner");

  const unreadNotifs = session.currentActorId ? service.getNotifications(session.currentActorId, true).length : 0;

  if (globalState === "FIRST_RUN") {
    return (
      <div className="he-shell first-run-screen" data-testid="first-run-screen">
        <div className="he-modal">
          <h2>Welcome to He Operations Core</h2>
          <p>The operations store is uninitialized. Bootstrap the Lead Owner to begin.</p>
          <form onSubmit={(e) => { e.preventDefault(); bootstrapOwner({userId: bootstrapId, displayName: bootstrapName}); }}>
            <div className="he-form-row">
              <input type="text" placeholder="User ID" value={bootstrapId} onChange={(e) => setBootstrapId(e.target.value)} />
              <input type="text" placeholder="Display Name" value={bootstrapName} onChange={(e) => setBootstrapName(e.target.value)} />
              <button type="submit" data-testid="bootstrap-btn">Initialize He Core</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (globalState === "LOADING") {
    return <div className="he-shell loading" data-testid="loading-screen">Loading He Operations...</div>;
  }

  if (globalState === "ERROR") {
    return <div className="he-shell error" data-testid="error-screen">{`Error: ${errorMessage}`}</div>;
  }

  const navItems: {key: HeNavView; label: string; badge?: number}[] = [
    {key: "solo", label: "Solo Queue"},
    {key: "team", label: "Team Dashboard"},
    {key: "tasks", label: "Tasks"},
    {key: "kanban", label: "Kanban"},
    {key: "calendar", label: "Calendar"},
    {key: "deadlines", label: "Deadlines"},
    {key: "recordings", label: "Recordings"},
    {key: "reviews", label: "Reviews"},
    {key: "time", label: "Time Tracking"},
    {key: "notifications", label: "Notifications", badge: unreadNotifs},
    {key: "people", label: "People & Roles"},
    {key: "activity", label: "Activity"}
  ];

  return (
    <div className="he-product-shell" data-testid="he-product-shell">
      <header className="he-topbar">
        <div className="he-brand">
          <h1>He</h1>
          <span className="he-badge">Operations Core</span>
        </div>
        <div className="he-session-controls">
          <label>Active Actor: </label>
          <select
            value={session.currentActorId}
            onChange={(e) => setCurrentActorId(e.target.value)}
            data-testid="actor-switcher"
          >
            {session.availableMembers.map((m) => (
              <option key={m.userId} value={m.userId}>
                {`${m.displayName} (${m.roles.join(", ")})`}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="he-main-layout">
        <nav className="he-navrail" data-testid="he-navrail">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`he-nav-btn ${activeView === item.key ? "active" : ""}`}
              onClick={() => setActiveView(item.key)}
              data-testid={`nav-${item.key}`}
            >
              {item.label}
              {typeof item.badge === "number" && item.badge > 0 ? (
                <span className="he-tag" style={{background: "var(--he-primary)", color: "#fff", marginLeft: "auto"}}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
          <OperationalSpatialLandmark />
        </nav>

        <main className="he-content-pane">
          {activeView === "solo" && <SoloQueueView />}
          {activeView === "team" && <TeamDashboardView />}
          {activeView === "tasks" && <TasksView />}
          {activeView === "kanban" && <KanbanView />}
          {activeView === "calendar" && <CalendarView />}
          {activeView === "deadlines" && <DeadlinesView />}
          {activeView === "recordings" && <RecordingSessionsView />}
          {activeView === "reviews" && <ReviewsView />}
          {activeView === "time" && <TimeTrackingView />}
          {activeView === "notifications" && <NotificationsView />}
          {activeView === "people" && <PeopleView />}
          {activeView === "activity" && <ActivityView />}
        </main>
      </div>
    </div>
  );
};
