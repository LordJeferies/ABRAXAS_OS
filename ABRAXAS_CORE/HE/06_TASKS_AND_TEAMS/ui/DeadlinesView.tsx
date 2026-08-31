import React, {useState} from "react";
import {useHe} from "./HeContext.tsx";
import type {Deadline, DeadlineTargetType} from "../runtime/types.ts";

export const DeadlinesView: React.FC = () => {
  const {service, session, refresh} = useHe();
  const deadlineEvals = service.getDeadlineEvaluations();
  const deadlines = service.getDeadlines();

  const [targetType, setTargetType] = useState<DeadlineTargetType>("TASK");
  const [targetId, setTargetId] = useState("");
  const [dueAt, setDueAt] = useState("2026-09-05T18:00:00Z");
  const [error, setError] = useState<string | undefined>();

  // Edit Deadline State
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [editDueAt, setEditDueAt] = useState("");
  const [editTimezone, setEditTimezone] = useState("America/Bogota");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      service.setDeadline({targetType, targetId, dueAt, timezone: "America/Bogota"}, session.currentActorId);
      setTargetId("");
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleOpenEdit = (dl: Deadline) => {
    setEditingDeadline(dl);
    setEditDueAt(dl.dueAt);
    setEditTimezone(dl.timezone);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeadline) return;
    setError(undefined);
    try {
      service.editDeadline(editingDeadline.deadlineId, {dueAt: editDueAt, timezone: editTimezone}, session.currentActorId);
      setEditingDeadline(null);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="he-view deadlines-view">
      <h2>Deadlines &amp; Milestone Tracking</h2>

      {error && <div className="he-error-banner">{error}</div>}

      {/* Edit Deadline Form */}
      {editingDeadline && (
        <form onSubmit={handleSaveEdit} className="he-form he-edit-modal" data-testid="edit-deadline-form">
          <h3>{`Edit Deadline: ${editingDeadline.deadlineId}`}</h3>
          <div className="he-form-row">
            <label style={{display: "flex", flexDirection: "column", flex: 2}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Due At (ISO):</span>
              <input type="text" value={editDueAt} onChange={(e) => setEditDueAt(e.target.value)} required />
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Timezone:</span>
              <input type="text" value={editTimezone} onChange={(e) => setEditTimezone(e.target.value)} required />
            </label>
            <button type="submit" style={{alignSelf: "flex-end", height: "38px"}}>Save Deadline</button>
            <button type="button" onClick={() => setEditingDeadline(null)} style={{alignSelf: "flex-end", height: "38px"}}>Cancel</button>
          </div>
        </form>
      )}

      {/* Set Deadline Form */}
      <form onSubmit={handleCreate} className="he-form" data-testid="set-deadline-form">
        <h3>Set Target Operational Deadline</h3>
        <div className="he-form-row">
          <label style={{display: "flex", flexDirection: "column", flex: 1}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Target Type:</span>
            <select value={targetType} onChange={(e) => setTargetType(e.target.value as DeadlineTargetType)}>
              <option value="TASK">TASK</option>
              <option value="LIENZO">LIENZO</option>
              <option value="PLAN">PLAN</option>
              <option value="COMPONENT">COMPONENT</option>
              <option value="RECORDING_SESSION">RECORDING_SESSION</option>
              <option value="PUBLICATION_TARGET">PUBLICATION_TARGET</option>
            </select>
          </label>
          <label style={{display: "flex", flexDirection: "column", flex: 2}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Target ID:</span>
            <input
              type="text"
              placeholder="Target ID (e.g. tsk_1)..."
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              data-testid="deadline-target-id-input"
              required
            />
          </label>
          <label style={{display: "flex", flexDirection: "column", flex: 2}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Due At (ISO):</span>
            <input
              type="text"
              placeholder="Due At (ISO)..."
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              required
            />
          </label>
          <button type="submit" style={{alignSelf: "flex-end", height: "38px"}}>Set Deadline</button>
        </div>
      </form>

      <div className="he-section">
        <h3>{`Evaluated Operational Deadlines (${deadlineEvals.length})`}</h3>
        {deadlineEvals.length === 0 ? (
          <p className="he-muted">No active deadlines registered.</p>
        ) : (
          <table className="he-table" data-testid="deadlines-table">
            <thead>
              <tr>
                <th>Target</th>
                <th>Due At</th>
                <th>Status</th>
                <th>Risk State</th>
                <th>Evaluated Reasons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deadlineEvals.map((d) => {
                const raw = deadlines.find((x) => x.deadlineId === d.deadlineId);
                return (
                  <tr key={d.deadlineId} data-testid={`deadline-row-${d.deadlineId}`}>
                    <td><strong>{`${d.targetType}: ${d.targetId}`}</strong></td>
                    <td>{d.dueAt}</td>
                    <td><span className="he-tag">{raw?.status ?? "ACTIVE"}</span></td>
                    <td>
                      <span className={`he-tag ${d.riskState === 'OVERDUE' ? 'error' : d.riskState === 'COMPLETED' ? 'verified' : ''}`}>
                        {d.riskState}
                      </span>
                    </td>
                    <td>
                      {d.riskReasons.length > 0 ? (
                        <ul style={{paddingLeft: "1.2rem", margin: 0, fontSize: "0.8rem", color: "var(--he-warning)"}}>
                          {d.riskReasons.map((r: string, i: number) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{color: "var(--he-success)", fontSize: "0.8rem"}}>On Track / None</span>
                      )}
                    </td>
                    <td>
                      {raw && (
                        <button onClick={() => handleOpenEdit(raw)} style={{fontSize: "0.8rem"}}>
                          ✎ Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
