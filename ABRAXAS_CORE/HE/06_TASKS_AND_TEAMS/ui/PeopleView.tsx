import React from "react";
import {useHe} from "./HeContext.tsx";

export const PeopleView: React.FC = () => {
  const {session, service} = useHe();
  const snapshot = service.getTeamSnapshot();
  const members = session.availableMembers;

  return (
    <div className="he-view people-view">
      <h2>Team & Operational Workload</h2>

      <div className="he-section">
        <h3>{`Registered Team Members (${members.length})`}</h3>
        <div className="he-grid-3">
          {members.map((m) => {
            const workload = snapshot.memberWorkload.find((w: any) => w.userId === m.userId);
            return (
              <div key={m.userId} className="he-card">
                <h4>{m.displayName}</h4>
                <p>{`ID: ${m.userId}`}</p>
                <p>Status: <span className="he-tag">{m.status}</span></p>
                <p>{`Roles: ${m.roles.join(", ")}`}</p>
                <p>{`Active Tasks: ${workload?.activeTaskCount ?? 0}`}</p>
                <p>{`Blocked Tasks: ${workload?.blockedTaskCount ?? 0}`}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
