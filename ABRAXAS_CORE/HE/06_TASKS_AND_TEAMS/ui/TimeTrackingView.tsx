import React, {useState} from "react";
import {useHe} from "./HeContext.tsx";

export const TimeTrackingView: React.FC = () => {
  const {service, session, refresh} = useHe();
  const tasks = service.getTasks();
  const activeTimer = session.currentActorId ? service.getActiveTimerSession(session.currentActorId) : undefined;
  const report = service.getTimeReport(session.currentActorId, {userId: session.currentActorId});

  const [selectedTask, setSelectedTask] = useState(tasks[0]?.taskId ?? "");
  const [manualMinutes, setManualMinutes] = useState(30);
  const [manualNote, setManualNote] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleStartTimer = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      service.startTimer(selectedTask || (tasks[0]?.taskId ?? ""), session.currentActorId);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePause = () => {
    if (!activeTimer) return;
    setError(undefined);
    try {
      service.pauseTimer(activeTimer.timerId, session.currentActorId);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleResume = () => {
    if (!activeTimer) return;
    setError(undefined);
    try {
      service.resumeTimer(activeTimer.timerId, session.currentActorId);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleStop = () => {
    if (!activeTimer) return;
    setError(undefined);
    try {
      service.stopTimer(activeTimer.timerId, session.currentActorId);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      service.addManualTimeEntry({
        taskId: selectedTask || (tasks[0]?.taskId ?? ""),
        durationSeconds: manualMinutes * 60,
        note: manualNote
      }, session.currentActorId);
      setManualNote("");
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const formatHours = (secs: number) => (secs / 3600).toFixed(2);

  return (
    <div className="he-view time-view">
      <h2>Operational Time Tracking</h2>

      {error && <div className="he-error-banner" data-testid="time-error-banner">{error}</div>}

      <div className="he-grid-3">
        <div className="he-section" data-testid="active-timer-card">
          <h3>Active Timer</h3>
          {activeTimer ? (
            <div className="he-timer-active">
              <p>Task: <strong>{activeTimer.taskId}</strong></p>
              <p>Status: <span className="he-tag">{activeTimer.status}</span></p>
              <p>Started: {activeTimer.startedAt}</p>
              <div className="he-btn-group">
                {activeTimer.status === "RUNNING" ? (
                  <button onClick={handlePause} data-testid="pause-timer-btn">Pause</button>
                ) : (
                  <button onClick={handleResume} data-testid="resume-timer-btn">Resume</button>
                )}
                <button onClick={handleStop} data-testid="stop-timer-btn">Stop &amp; Save</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleStartTimer} data-testid="start-timer-form">
              <p className="he-muted">No timer currently running.</p>
              <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
                {tasks.map((t) => (
                  <option key={t.taskId} value={t.taskId}>{`${t.title} (${t.taskId})`}</option>
                ))}
              </select>
              <button type="submit" style={{marginTop: "0.5rem"}} data-testid="start-timer-btn">Start Timer</button>
            </form>
          )}
        </div>

        <div className="he-section" data-testid="manual-entry-card">
          <h3>Manual Time Entry</h3>
          <form onSubmit={handleManualSubmit}>
            <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
              {tasks.map((t) => (
                <option key={t.taskId} value={t.taskId}>{`${t.title} (${t.taskId})`}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={manualMinutes}
              onChange={(e) => setManualMinutes(Number(e.target.value))}
              placeholder="Minutes..."
              style={{marginTop: "0.5rem"}}
            />
            <input
              type="text"
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="Work note..."
              style={{marginTop: "0.5rem"}}
            />
            <button type="submit" style={{marginTop: "0.5rem"}}>Record Entry</button>
          </form>
        </div>

        <div className="he-section" data-testid="time-summary-card">
          <h3>Personal Time Summary</h3>
          <p>{`Total Tracked: ${formatHours(report.totalSeconds)} hours`}</p>
          <p>{`Completed Entries: ${report.entryCount}`}</p>
        </div>
      </div>

      <div className="he-section" style={{marginTop: "1.5rem"}}>
        <h3>{`Logged Time Entries (${report.entries.length})`}</h3>
        {report.entries.length === 0 ? (
          <p className="he-muted">No time entries logged yet.</p>
        ) : (
          <table className="he-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Duration</th>
                <th>Source</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {report.entries.map((entry) => (
                <tr key={entry.timeEntryId}>
                  <td>{entry.taskId}</td>
                  <td>{`${Math.round(entry.durationSeconds / 60)} min`}</td>
                  <td><span className="he-tag">{entry.source}</span></td>
                  <td>{entry.note || "-"}</td>
                  <td>{entry.startedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
