import React from "react";
import {useHe} from "./HeContext.tsx";

export const TeamDashboard: React.FC = () => {
  const {service} = useHe();
  const snapshot = service.getTeamSnapshot();
  const members = service.getTeamMembers();
  const timeEntries = service.getTimeEntries(members[0]?.userId ?? "u_owner");

  return (
    <div className="he-view team-view">
      <h2>Team &amp; Workload Governance</h2>

      <div className="he-metric-grid" style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem"}}>
        <div className="he-metric-card" data-testid="metric-total-active">
          <span className="he-metric-val">{snapshot.memberWorkload.reduce((sum, w) => sum + w.activeTaskCount, 0)}</span>
          <span className="he-metric-lbl">Active Operational Tasks</span>
        </div>
        <div className="he-metric-card" data-testid="metric-blocked">
          <span className="he-metric-val" style={{color: snapshot.blockedWork.length > 0 ? "var(--he-danger)" : "inherit"}}>
            {snapshot.blockedWork.length}
          </span>
          <span className="he-metric-lbl">Blocked Tasks</span>
        </div>
        <div className="he-metric-card" data-testid="metric-overdue">
          <span className="he-metric-val" style={{color: snapshot.overdueTasks.length > 0 ? "var(--he-warning)" : "inherit"}}>
            {snapshot.overdueTasks.length}
          </span>
          <span className="he-metric-lbl">Overdue Tasks</span>
        </div>
        <div className="he-metric-card" data-testid="metric-pending-approvals">
          <span className="he-metric-val">{snapshot.pendingApprovals.length}</span>
          <span className="he-metric-lbl">Pending Approvals</span>
        </div>
      </div>

      <div className="he-section">
        <h3>Team Member Workload &amp; Time Summary</h3>
        <table className="he-table" data-testid="team-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Active Tasks</th>
              <th>Blocked Tasks</th>
              <th>Overdue Tasks</th>
              <th>Tracked Time</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.memberWorkload.map((w) => {
              const memberEntries = timeEntries.filter((e) => e.userId === w.userId);
              const totalSec = memberEntries.reduce((acc, e) => acc + e.durationSeconds, 0);
              const hours = (totalSec / 3600).toFixed(1);

              return (
                <tr key={w.userId} data-testid={`workload-row-${w.userId}`}>
                  <td><strong>{w.displayName}</strong> ({w.userId})</td>
                  <td>{members.find(m => m.userId === w.userId)?.roles.join(", ") || "MEMBER"}</td>
                  <td><span className="he-tag">{members.find(m => m.userId === w.userId)?.status || "ACTIVE"}</span></td>
                  <td>{w.activeTaskCount}</td>
                  <td>
                    <span style={{color: w.blockedTaskCount > 0 ? "var(--he-danger)" : "inherit"}}>
                      {w.blockedTaskCount}
                    </span>
                  </td>
                  <td>
                    <span style={{color: w.overdueTaskCount > 0 ? "var(--he-warning)" : "inherit"}}>
                      {w.overdueTaskCount}
                    </span>
                  </td>
                  <td><strong>{hours}h</strong> ({totalSec}s)</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
