import React from "react";
import {useHe} from "./HeContext.tsx";

export const TeamDashboardView: React.FC = () => {
  const {service} = useHe();
  const snapshot = service.getTeamSnapshot();

  return (
    <div className="he-view team-dashboard-view">
      <h2>Team Operations Dashboard</h2>

      <div className="he-section" data-testid="team-workload">
        <h3>{`Member Workload & Active Work (${snapshot.memberWorkload.length})`}</h3>
        <div className="he-grid-3">
          {snapshot.memberWorkload.map((m: any) => (
            <div key={m.userId} className="he-card member-card" data-testid={`workload-${m.userId}`}>
              <h4>{`${m.displayName} (${m.userId})`}</h4>
              <p>{`Active: ${m.activeTaskCount} | Blocked: ${m.blockedTaskCount} | Overdue: ${m.overdueTaskCount}`}</p>
              {m.activeTasks.length > 0 && (
                <div className="he-active-tasks">
                  <h5>Active Tasks:</h5>
                  <ul>
                    {m.activeTasks.map((t: any) => (
                      <li key={t.taskId}>
                        <span>{t.title}</span> <span className="he-tag">{t.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="he-section" data-testid="team-blocked-work">
        <h3>{`Blocked Work & Waiting-For Graph (${snapshot.blockedWork.length})`}</h3>
        {snapshot.blockedWork.length === 0 ? (
          <p className="he-muted">No active team work is currently blocked.</p>
        ) : (
          <ul className="he-blocked-list">
            {snapshot.blockedWork.map((b: any) => (
              <li key={b.taskId} className="he-blocked-card" data-testid={`blocked-task-${b.taskId}`}>
                <strong>{`Task: ${b.taskTitle} (${b.taskId})`}</strong>
                <p>{`Assignees: ${b.assigneeIds.join(", ") || "None"}`}</p>
                <p>{`Waiting For Tasks: ${b.waitingForTaskIds.join(", ") || "None"}`}</p>
                <p>{`Waiting For Users: ${b.waitingForUserIds.join(", ") || "None"}`}</p>
                <ul>
                  {b.reasons.map((r: any, i: number) => <li key={i}>{r}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="he-grid-3">
        <div className="he-section">
          <h3>{`Overdue Tasks (${snapshot.overdueTasks.length})`}</h3>
          <ul>{snapshot.overdueTasks.map((t: any) => <li key={t.taskId}>{t.title}</li>)}</ul>
        </div>
        <div className="he-section">
          <h3>{`Pending Approvals (${snapshot.pendingApprovals.length})`}</h3>
          <ul>{snapshot.pendingApprovals.map((a: any) => <li key={a.approvalId}>{`${a.targetType}: ${a.targetId}`}</li>)}</ul>
        </div>
        <div className="he-section">
          <h3>{`Upcoming Recordings (${snapshot.upcomingRecordingSessions.length})`}</h3>
          <ul>{snapshot.upcomingRecordingSessions.map((r: any) => <li key={r.recordingSessionId}>{`${r.title} (${r.startsAt})`}</li>)}</ul>
        </div>
      </div>
    </div>
  );
};
