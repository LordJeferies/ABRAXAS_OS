import React from "react";
import {useHe} from "./HeContext.tsx";

export const ActivityView: React.FC = () => {
  const {service} = useHe();
  const activity = service.getActivity();

  return (
    <div className="he-view activity-view">
      <h2>Operational Audit Ledger</h2>

      <div className="he-section">
        <h3>{`Immutable Activity Journal (${activity.length})`}</h3>
        {activity.length === 0 ? (
          <p className="he-muted">No activity recorded yet.</p>
        ) : (
          <table className="he-table" data-testid="activity-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Type</th>
                <th>Target</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {activity.slice().reverse().map((act) => (
                <tr key={act.activityId}>
                  <td><code>{act.timestamp}</code></td>
                  <td><strong>{act.actorId}</strong></td>
                  <td><span className="he-tag">{act.entryType}</span></td>
                  <td>{`${act.targetRef.targetType}:${act.targetRef.targetId}`}</td>
                  <td>{act.details || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
