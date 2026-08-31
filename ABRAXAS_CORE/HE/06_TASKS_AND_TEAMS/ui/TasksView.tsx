import React, {useState} from "react";
import {useHe} from "./HeContext.tsx";
import type {Task, TaskPriority, TaskStatus, TaskTargetType} from "../runtime/types.ts";

export const TasksView: React.FC = () => {
  const {service, session, refresh} = useHe();
  const tasks = service.getTasks();
  const assignments = service.getAssignments();
  const dependencies = service.getDependencies();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [targetType, setTargetType] = useState<TaskTargetType>("NONE_EXTERNAL");
  const [targetId, setTargetId] = useState("");
  const [scheduledStartAt, setScheduledStartAt] = useState("");
  const [scheduledEndAt, setScheduledEndAt] = useState("");
  const [actionError, setActionError] = useState<string | undefined>();

  // Task Edit Modal State
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<TaskPriority>("MEDIUM");
  const [editStartAt, setEditStartAt] = useState("");
  const [editEndAt, setEditEndAt] = useState("");

  // Blocker override modal state
  const [selectedTaskForOverride, setSelectedTaskForOverride] = useState<string | null>(null);
  const [overrideDepId, setOverrideDepId] = useState<string>("");
  const [overrideReason, setOverrideReason] = useState<string>("");

  // Overflow menu open state per task
  const [openOverflowTaskId, setOpenOverflowTaskId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(undefined);
    try {
      const payload: any = { title, priority };
      if (description) payload.description = description;
      if (targetType !== "NONE_EXTERNAL" && targetId) payload.targetRef = { targetType, targetId };
      if (scheduledStartAt || scheduledEndAt) {
        payload.schedule = { timezone: "America/Bogota" };
        if (scheduledStartAt) payload.schedule.scheduledStartAt = scheduledStartAt;
        if (scheduledEndAt) payload.schedule.scheduledEndAt = scheduledEndAt;
      }
      service.createTask(payload, session.currentActorId);
      setTitle("");
      setDescription("");
      setTargetId("");
      setScheduledStartAt("");
      setScheduledEndAt("");
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setEditPriority(task.priority);
    setEditStartAt(task.schedule?.scheduledStartAt ?? "");
    setEditEndAt(task.schedule?.scheduledEndAt ?? "");
    setOpenOverflowTaskId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    setActionError(undefined);
    try {
      const payload: any = {
        title: editTitle,
        description: editDescription || undefined,
        priority: editPriority
      };
      if (editStartAt || editEndAt) {
        payload.schedule = {
          scheduledStartAt: editStartAt || undefined,
          scheduledEndAt: editEndAt || undefined,
          timezone: "America/Bogota"
        };
      }
      service.editTask(editingTask.taskId, payload, session.currentActorId);
      setEditingTask(null);
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  const handleTransition = (taskId: string, nextStatus: TaskStatus) => {
    setActionError(undefined);
    try {
      service.transitionTask(taskId, nextStatus, session.currentActorId);
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  const handleAssign = (taskId: string, userId: string) => {
    setActionError(undefined);
    try {
      service.assignTask(taskId, userId, session.currentActorId);
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  const handleUnassign = (assignmentId: string) => {
    setActionError(undefined);
    try {
      service.unassignTask(assignmentId, session.currentActorId);
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForOverride || !overrideDepId) return;
    setActionError(undefined);
    try {
      service.overrideDependency(selectedTaskForOverride, overrideDepId, overrideReason, session.currentActorId);
      setSelectedTaskForOverride(null);
      setOverrideDepId("");
      setOverrideReason("");
      refresh();
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  return (
    <div className="he-view tasks-view">
      <h2>Tasks Manager</h2>

      {actionError && <div className="he-error-banner" data-testid="task-error-banner">{actionError}</div>}

      {/* Task Edit Modal */}
      {editingTask && (
        <form onSubmit={handleSaveEdit} className="he-form he-edit-modal" data-testid="edit-task-modal">
          <h3>{`Edit Task: ${editingTask.taskId}`}</h3>
          <div className="he-form-row" style={{marginBottom: "0.5rem"}}>
            <label style={{display: "flex", flexDirection: "column", flex: 2}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Title:</span>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                data-testid="edit-task-title-input"
              />
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Priority:</span>
              <select value={editPriority} onChange={(e) => setEditPriority(e.target.value as TaskPriority)}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </label>
          </div>
          <div className="he-form-row" style={{marginBottom: "0.5rem"}}>
            <label style={{display: "flex", flexDirection: "column", flex: 2}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Description:</span>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Start At:</span>
              <input type="text" value={editStartAt} onChange={(e) => setEditStartAt(e.target.value)} />
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>End At:</span>
              <input type="text" value={editEndAt} onChange={(e) => setEditEndAt(e.target.value)} />
            </label>
          </div>
          <div className="he-btn-group">
            <button type="submit" data-testid="save-edit-task-btn">Save Changes</button>
            <button type="button" onClick={() => setEditingTask(null)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Task Creation Form */}
      <form onSubmit={handleCreate} className="he-form" data-testid="create-task-form">
        <h3>Create New Operational Task</h3>
        <div className="he-form-row" style={{marginBottom: "0.5rem"}}>
          <label style={{display: "flex", flexDirection: "column", flex: 2}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Task Title:</span>
            <input
              type="text"
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="new-task-title-input"
              required
            />
          </label>
          <label style={{display: "flex", flexDirection: "column", flex: 1}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Priority:</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </label>
          <label style={{display: "flex", flexDirection: "column", flex: 1}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Target Type:</span>
            <select value={targetType} onChange={(e) => setTargetType(e.target.value as TaskTargetType)}>
              <option value="NONE_EXTERNAL">No Target</option>
              <option value="LIENZO">LIENZO</option>
              <option value="PLAN">PLAN</option>
              <option value="COMPONENT">COMPONENT</option>
              <option value="RECORDING_SESSION">RECORDING_SESSION</option>
              <option value="MOTION_PLAN">MOTION_PLAN</option>
            </select>
          </label>
          {targetType !== "NONE_EXTERNAL" && (
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Target ID:</span>
              <input
                type="text"
                placeholder="Target ID..."
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              />
            </label>
          )}
          <button type="submit" data-testid="create-task-btn" style={{alignSelf: "flex-end", height: "38px"}}>Create Task</button>
        </div>
        <div className="he-form-row">
          <label style={{display: "flex", flexDirection: "column", flex: 2}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Briefing / Notes:</span>
            <input
              type="text"
              placeholder="Task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label style={{display: "flex", flexDirection: "column", flex: 1}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Schedule Start:</span>
            <input
              type="text"
              placeholder="Start At (ISO)..."
              value={scheduledStartAt}
              onChange={(e) => setScheduledStartAt(e.target.value)}
            />
          </label>
          <label style={{display: "flex", flexDirection: "column", flex: 1}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Schedule End:</span>
            <input
              type="text"
              placeholder="End At (ISO)..."
              value={scheduledEndAt}
              onChange={(e) => setScheduledEndAt(e.target.value)}
            />
          </label>
        </div>
      </form>

      {/* Blocker Override Form */}
      {selectedTaskForOverride && (
        <form onSubmit={handleApplyOverride} className="he-form he-override-form" data-testid="override-dependency-form">
          <h3>{`Override Blocker for Task: ${selectedTaskForOverride}`}</h3>
          <div className="he-form-row">
            <select value={overrideDepId} onChange={(e) => setOverrideDepId(e.target.value)} required>
              <option value="">Select Blocker Dependency...</option>
              {dependencies.filter((d) => d.downstreamId === selectedTaskForOverride).map((d) => (
                <option key={d.dependencyId} value={d.dependencyId}>
                  {`${d.dependencyKind} from ${d.upstreamType}:${d.upstreamId}`}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Mandatory justification reason..."
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              required
              data-testid="override-reason-input"
            />
            <button type="submit" data-testid="apply-override-btn">Authorize Override</button>
            <button type="button" onClick={() => setSelectedTaskForOverride(null)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Tasks Ledger Table */}
      <div className="he-section">
        <h3>{`All Operational Tasks (${tasks.length})`}</h3>
        {tasks.length === 0 ? (
          <p className="he-muted">No tasks created yet.</p>
        ) : (
          <table className="he-table" data-testid="tasks-table">
            <thead>
              <tr>
                <th>Title &amp; Target</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignees</th>
                <th>Blockers</th>
                <th>Primary Action</th>
                <th>Contextual / Overflow</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const taskAsgs = assignments.filter((a) => a.taskId === t.taskId && a.status === "ACTIVE");
                const taskDeps = dependencies.filter((d) => d.downstreamId === t.taskId);
                const isOverflowOpen = openOverflowTaskId === t.taskId;

                return (
                  <tr key={t.taskId} data-testid={`task-row-${t.taskId}`}>
                    <td>
                      <strong>{t.title}</strong>
                      {t.targetRef && <span style={{display: "block", fontSize: "0.75rem", color: "var(--he-muted)"}}>{`Target: ${t.targetRef.targetType}:${t.targetRef.targetId}`}</span>}
                    </td>
                    <td><span className="he-tag">{t.status}</span></td>
                    <td>{t.priority}</td>
                    <td>
                      {taskAsgs.length > 0 ? (
                        taskAsgs.map((a) => (
                          <span key={a.assignmentId} style={{display: "inline-block", marginRight: "4px"}}>
                            {a.userId}
                          </span>
                        ))
                      ) : "Unassigned"}
                    </td>
                    <td>
                      {taskDeps.length > 0 ? (
                        <button onClick={() => setSelectedTaskForOverride(t.taskId)}>
                          {`${taskDeps.length} Blocker(s)`}
                        </button>
                      ) : "None"}
                    </td>
                    <td>
                      {/* ONE Primary Dominant Action */}
                      {t.status === "BACKLOG" && <button onClick={() => handleTransition(t.taskId, "READY")} style={{background: "var(--he-primary)", color: "#fff"}}>Start Task</button>}
                      {t.status === "READY" && <button onClick={() => handleTransition(t.taskId, "IN_PROGRESS")} style={{background: "var(--he-primary)", color: "#fff"}}>Work on Task</button>}
                      {t.status === "IN_PROGRESS" && <button onClick={() => handleTransition(t.taskId, "DONE")} style={{background: "var(--he-success)", color: "#fff"}}>Complete Task</button>}
                      {t.status === "BLOCKED" && <button onClick={() => setSelectedTaskForOverride(t.taskId)} style={{background: "var(--he-danger)", color: "#fff"}}>Review Blocker</button>}
                      {t.status === "REVIEW" && <button onClick={() => handleTransition(t.taskId, "DONE")} style={{background: "var(--he-success)", color: "#fff"}}>Approve Task</button>}
                      {t.status === "DONE" && <span style={{color: "var(--he-success)", fontSize: "0.8rem"}}>Completed</span>}
                    </td>
                    <td>
                      {/* ONE Contextual Secondary + Overflow Menu */}
                      <div style={{position: "relative", display: "flex", gap: "0.25rem", alignItems: "center"}}>
                        {session.availableMembers.length > 0 && taskAsgs.length === 0 && (
                          <button onClick={() => handleAssign(t.taskId, session.availableMembers[0]?.userId ?? "")} style={{fontSize: "0.8rem"}}>
                            {`Assign ${session.availableMembers[0]?.displayName}`}
                          </button>
                        )}
                        <button
                          onClick={() => setOpenOverflowTaskId(isOverflowOpen ? null : t.taskId)}
                          style={{padding: "0.25rem 0.5rem", fontSize: "0.9rem"}}
                          title="More actions"
                        >
                          ⋯
                        </button>

                        {/* Overflow Dropdown */}
                        {isOverflowOpen && (
                          <div style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            background: "var(--he-surface-elevated)",
                            border: "1px solid var(--he-border)",
                            borderRadius: "6px",
                            padding: "0.4rem",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                            zIndex: 100,
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.25rem",
                            minWidth: "140px"
                          }}>
                            <button onClick={() => handleOpenEdit(t)} style={{textAlign: "left", fontSize: "0.8rem"}}>
                              ✎ Edit Task
                            </button>
                            {taskDeps.length > 0 && (
                              <button onClick={() => { setSelectedTaskForOverride(t.taskId); setOpenOverflowTaskId(null); }} style={{textAlign: "left", fontSize: "0.8rem"}}>
                                ⚠ Override Blocker
                              </button>
                            )}
                            {taskAsgs.map((a) => (
                              <button key={a.assignmentId} onClick={() => { handleUnassign(a.assignmentId); setOpenOverflowTaskId(null); }} style={{textAlign: "left", fontSize: "0.8rem"}}>
                                {`✕ Unassign ${a.userId}`}
                              </button>
                            ))}
                            {t.status !== "CANCELLED" && t.status !== "DONE" && (
                              <button onClick={() => { handleTransition(t.taskId, "CANCELLED"); setOpenOverflowTaskId(null); }} style={{textAlign: "left", fontSize: "0.8rem", color: "var(--he-danger)"}}>
                                ✕ Cancel Task
                              </button>
                            )}
                          </div>
                        )}
                      </div>
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
