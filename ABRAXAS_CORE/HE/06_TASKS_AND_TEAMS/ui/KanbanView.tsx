import React, {useState} from "react";
import {useHe} from "./HeContext.tsx";
import type {TaskStatus} from "../runtime/types.ts";

export const KanbanView: React.FC = () => {
  const {service, session, refresh} = useHe();
  const kanban = service.getKanbanProjection();
  const [transitionError, setTransitionError] = useState<string | undefined>();

  const handleMove = (taskId: string, targetStatus: TaskStatus) => {
    setTransitionError(undefined);
    try {
      service.transitionTask(taskId, targetStatus, session.currentActorId);
      refresh();
    } catch (err) {
      setTransitionError((err as Error).message);
    }
  };

  const columns: {title: string; status: TaskStatus; cards: readonly any[]}[] = [
    {title: "Backlog", status: "BACKLOG", cards: kanban.backlog},
    {title: "Ready", status: "READY", cards: kanban.ready},
    {title: "In Progress", status: "IN_PROGRESS", cards: kanban.inProgress},
    {title: "Review", status: "REVIEW", cards: kanban.review},
    {title: "Blocked", status: "BLOCKED", cards: kanban.blocked},
    {title: "Done", status: "DONE", cards: kanban.done}
  ];

  return (
    <div className="he-view kanban-view">
      <h2>Operational Kanban</h2>

      {transitionError && (
        <div className="he-error-banner" data-testid="kanban-error-banner">
          {transitionError}
        </div>
      )}

      <div className="he-kanban-board" style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1rem"}}>
        {columns.map((col) => (
          <div key={col.status} className="he-kanban-col" data-testid={`kanban-col-${col.status.toLowerCase()}`}>
            <h3>{`${col.title} (${col.cards.length})`}</h3>
            <div className="he-kanban-cards">
              {col.cards.map((card) => (
                <div key={card.task.taskId} className="he-kanban-card" data-testid={`kanban-card-${card.task.taskId}`}>
                  <h4>{card.task.title}</h4>
                  <p className="he-tag">{card.task.priority}</p>
                  {card.isBlocked && <span className="he-tag error">BLOCKED</span>}
                  <div className="he-card-actions">
                    {col.status !== "IN_PROGRESS" && (
                      <button onClick={() => handleMove(card.task.taskId, "IN_PROGRESS")}>Start</button>
                    )}
                    {col.status !== "DONE" && (
                      <button onClick={() => handleMove(card.task.taskId, "DONE")}>Done</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
