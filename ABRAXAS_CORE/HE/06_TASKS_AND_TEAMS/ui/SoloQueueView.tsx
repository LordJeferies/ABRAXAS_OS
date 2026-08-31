import React from "react";
import {useHe} from "./HeContext.tsx";
import type {Task} from "../runtime/types.ts";

export const SoloQueueView: React.FC = () => {
  const {service, session, refresh} = useHe();
  const queue = session.currentActorId ? service.getSoloQueue(session.currentActorId) : null;

  if (!queue) {
    return <div className="he-empty-state">No active user selected for Solo Queue.</div>;
  }

  const renderTaskList = (title: string, tasks: readonly Task[], emptyText: string) => (
    <div className="he-section" data-testid={`solo-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <h3>{`${title} (${tasks.length})`}</h3>
      {tasks.length === 0 ? (
        <p className="he-muted">{emptyText}</p>
      ) : (
        <ul className="he-task-list">
          {tasks.map((t) => (
            <li key={t.taskId} className={`he-task-card priority-${t.priority.toLowerCase()}`}>
              <div className="he-task-header">
                <span className="he-task-title">{t.title}</span>
                <span className="he-tag">{t.priority}</span>
              </div>
              <div className="he-task-meta">
                <span>{`Status: ${t.status}`}</span>
                {t.description && <p>{t.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="he-view solo-view">
      <h2>{`Solo Queue: ${session.currentMember?.displayName ?? session.currentActorId}`}</h2>

      {queue.pendingApprovalsForUser.length > 0 && (
        <div className="he-section he-approval-alert" data-testid="solo-pending-approvals">
          <h3>{`Pending Approvals Waiting on You (${queue.pendingApprovalsForUser.length})`}</h3>
          <ul>
            {queue.pendingApprovalsForUser.map((a: any) => (
              <li key={a.approvalId} className="he-approval-item">
                <span>{`Target: ${a.targetType} (${a.targetId})`}</span>
                <button onClick={() => { service.decideApproval(a.approvalId, "APPROVED", session.currentActorId); refresh(); }}>Approve</button>
                <button onClick={() => { service.decideApproval(a.approvalId, "REJECTED", session.currentActorId); refresh(); }}>Reject</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="he-grid-3">
        {renderTaskList("In Progress", queue.inProgress, "No tasks currently in progress")}
        {renderTaskList("Next Action", queue.next, "Solo queue is clear")}
        {renderTaskList("Review Required", queue.reviewRequired, "No tasks awaiting review")}
      </div>

      <div className="he-grid-3" style={{marginTop: "1.5rem"}}>
        {renderTaskList("Blocked", queue.blocked, "No blocked tasks")}
        {renderTaskList("Due Soon", queue.dueSoon, "No urgent deadlines approaching")}
        {renderTaskList("Overdue", queue.overdue, "No overdue tasks")}
      </div>
    </div>
  );
};
