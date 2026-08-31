import React, {useState} from "react";
import {useHe} from "./HeContext.tsx";
import type {RecordingLocationType, RecordingSession, SessionParticipant} from "../runtime/types.ts";

export const RecordingSessionsView: React.FC = () => {
  const {service, session, refresh} = useHe();
  const sessions = service.getRecordingSessions();

  // Create Form State
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("2026-09-02T10:00:00Z");
  const [endsAt, setEndsAt] = useState("2026-09-02T14:00:00Z");
  const [timezone, setTimezone] = useState("America/Bogota");
  const [locationType, setLocationType] = useState<RecordingLocationType>("PHYSICAL");
  const [locationDetails, setLocationDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | undefined>();

  // Complete Edit Session Modal State
  const [editingSession, setEditingSession] = useState<RecordingSession | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStartsAt, setEditStartsAt] = useState("");
  const [editEndsAt, setEditEndsAt] = useState("");
  const [editTimezone, setEditTimezone] = useState("America/Bogota");
  const [editLocationType, setEditLocationType] = useState<RecordingLocationType>("PHYSICAL");
  const [editLocationDetails, setEditLocationDetails] = useState("");
  const [editPeople, setEditPeople] = useState<string>("");
  const [editRelatedLienzoIds, setEditRelatedLienzoIds] = useState("");
  const [editRelatedTaskIds, setEditRelatedTaskIds] = useState("");
  const [editPreparationTaskIds, setEditPreparationTaskIds] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      const payload: any = {
        title,
        startsAt,
        endsAt,
        timezone,
        locationType,
        people: [{userId: session.currentActorId, role: "Director"}]
      };
      if (locationDetails) payload.locationDetails = locationDetails;
      if (notes) payload.notes = notes;
      service.createRecordingSession(payload, session.currentActorId);
      setTitle("");
      setLocationDetails("");
      setNotes("");
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleOpenEdit = (s: RecordingSession) => {
    setEditingSession(s);
    setEditTitle(s.title);
    setEditStartsAt(s.startsAt);
    setEditEndsAt(s.endsAt);
    setEditTimezone(s.timezone);
    setEditLocationType(s.locationType);
    setEditLocationDetails(s.locationDetails ?? "");
    setEditPeople(s.people.map(p => `${p.userId}:${p.role}`).join(", "));
    setEditRelatedLienzoIds(s.relatedLienzoIds.join(", "));
    setEditRelatedTaskIds(s.relatedTaskIds.join(", "));
    setEditPreparationTaskIds(s.preparationTaskIds.join(", "));
    setEditNotes(s.notes ?? "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    setError(undefined);
    try {
      const parsedPeople: SessionParticipant[] = editPeople
        .split(",")
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => {
          const [userId, role] = p.split(":");
          return {userId: userId?.trim() ?? session.currentActorId, role: role?.trim() ?? "Participant"};
        });

      const parsedLienzoIds = editRelatedLienzoIds.split(",").map(x => x.trim()).filter(Boolean);
      const parsedTaskIds = editRelatedTaskIds.split(",").map(x => x.trim()).filter(Boolean);
      const parsedPrepIds = editPreparationTaskIds.split(",").map(x => x.trim()).filter(Boolean);

      service.editRecordingSession(editingSession.recordingSessionId, {
        title: editTitle,
        startsAt: editStartsAt,
        endsAt: editEndsAt,
        timezone: editTimezone,
        locationType: editLocationType,
        locationDetails: editLocationDetails || undefined,
        people: parsedPeople.length > 0 ? parsedPeople : editingSession.people,
        relatedLienzoIds: parsedLienzoIds,
        relatedTaskIds: parsedTaskIds,
        preparationTaskIds: parsedPrepIds,
        notes: editNotes || undefined
      }, session.currentActorId);
      setEditingSession(null);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleConfirm = (sessionId: string) => {
    setError(undefined);
    try {
      service.confirmRecordingSession(sessionId, session.currentActorId);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCancel = (sessionId: string) => {
    setError(undefined);
    try {
      service.cancelRecordingSession(sessionId, session.currentActorId);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="he-view recording-view">
      <h2>Recording Sessions</h2>

      {error && <div className="he-error-banner" data-testid="recording-error-banner">{error}</div>}

      {/* Complete Edit Session Modal */}
      {editingSession && (
        <form onSubmit={handleSaveEdit} className="he-form he-edit-modal" data-testid="edit-recording-form" style={{border: "1px solid var(--he-primary)", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem"}}>
          <h3>{`Edit Recording Session: ${editingSession.recordingSessionId}`}</h3>
          <div className="he-form-row" style={{marginBottom: "0.5rem"}}>
            <label style={{display: "flex", flexDirection: "column", flex: 2}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Title:</span>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required data-testid="edit-recording-title" />
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Starts At:</span>
              <input type="text" value={editStartsAt} onChange={(e) => setEditStartsAt(e.target.value)} required data-testid="edit-recording-startsAt" />
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Ends At:</span>
              <input type="text" value={editEndsAt} onChange={(e) => setEditEndsAt(e.target.value)} required data-testid="edit-recording-endsAt" />
            </label>
          </div>

          <div className="he-form-row" style={{marginBottom: "0.5rem"}}>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Timezone:</span>
              <input type="text" value={editTimezone} onChange={(e) => setEditTimezone(e.target.value)} required />
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Location Type:</span>
              <select value={editLocationType} onChange={(e) => setEditLocationType(e.target.value as RecordingLocationType)} data-testid="edit-recording-locationType">
                <option value="PHYSICAL">PHYSICAL</option>
                <option value="REMOTE">REMOTE</option>
                <option value="TBD">TBD</option>
              </select>
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 2}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Location Details:</span>
              <input type="text" value={editLocationDetails} onChange={(e) => setEditLocationDetails(e.target.value)} placeholder="Studio A / Zoom link..." />
            </label>
          </div>

          <div className="he-form-row" style={{marginBottom: "0.5rem"}}>
            <label style={{display: "flex", flexDirection: "column", flex: 2}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>People &amp; Roles (comma separated userId:role):</span>
              <input type="text" value={editPeople} onChange={(e) => setEditPeople(e.target.value)} placeholder="u_owner:Director, u_editor:Assistant..." data-testid="edit-recording-people" />
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Related Lienzo IDs:</span>
              <input type="text" value={editRelatedLienzoIds} onChange={(e) => setEditRelatedLienzoIds(e.target.value)} placeholder="l_1, l_2..." />
            </label>
          </div>

          <div className="he-form-row" style={{marginBottom: "0.5rem"}}>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Related Task IDs:</span>
              <input type="text" value={editRelatedTaskIds} onChange={(e) => setEditRelatedTaskIds(e.target.value)} placeholder="t_1, t_2..." />
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 1}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Preparation Task IDs:</span>
              <input type="text" value={editPreparationTaskIds} onChange={(e) => setEditPreparationTaskIds(e.target.value)} placeholder="prep_1..." />
            </label>
            <label style={{display: "flex", flexDirection: "column", flex: 2}}>
              <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Notes:</span>
              <input type="text" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Session briefing notes..." />
            </label>
          </div>

          <div className="he-btn-group" style={{marginTop: "0.75rem"}}>
            <button type="submit" data-testid="save-edit-recording-btn">Save Session</button>
            <button type="button" onClick={() => setEditingSession(null)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Schedule Form */}
      <form onSubmit={handleCreate} className="he-form" data-testid="create-recording-form">
        <h3>Schedule Recording Session</h3>
        <div className="he-form-row" style={{marginBottom: "0.5rem"}}>
          <label style={{display: "flex", flexDirection: "column", flex: 2}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Session Title:</span>
            <input
              type="text"
              placeholder="Session title (e.g. Studio Batch A)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label style={{display: "flex", flexDirection: "column", flex: 1}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Starts At (ISO):</span>
            <input type="text" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required />
          </label>
          <label style={{display: "flex", flexDirection: "column", flex: 1}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Ends At (ISO):</span>
            <input type="text" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} required />
          </label>
        </div>
        <div className="he-form-row">
          <label style={{display: "flex", flexDirection: "column", flex: 1}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Location Type:</span>
            <select value={locationType} onChange={(e) => setLocationType(e.target.value as RecordingLocationType)}>
              <option value="PHYSICAL">PHYSICAL</option>
              <option value="REMOTE">REMOTE</option>
              <option value="TBD">TBD</option>
            </select>
          </label>
          <label style={{display: "flex", flexDirection: "column", flex: 2}}>
            <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Location / Studio Details:</span>
            <input type="text" placeholder="Studio Room 4 / Zoom Link..." value={locationDetails} onChange={(e) => setLocationDetails(e.target.value)} />
          </label>
          <button type="submit" style={{alignSelf: "flex-end", height: "38px"}}>Schedule Session</button>
        </div>
      </form>

      <div className="he-section">
        <h3>{`Production Sessions (${sessions.length})`}</h3>
        {sessions.length === 0 ? (
          <p className="he-muted">No recording sessions scheduled.</p>
        ) : (
          <ul className="he-session-list">
            {sessions.map((s) => (
              <li key={s.recordingSessionId} className="he-session-card" data-testid={`session-card-${s.recordingSessionId}`}>
                <div className="he-session-header" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <strong>{s.title}</strong>
                  <span className="he-tag">{s.status}</span>
                </div>
                <p>{`Time: ${s.startsAt} to ${s.endsAt} (${s.timezone})`}</p>
                <p style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>
                  {`Location: ${s.locationType}${s.locationDetails ? ` (${s.locationDetails})` : ""} | People: ${s.people.map(p => `${p.userId} (${p.role})`).join(", ")}`}
                </p>
                {s.notes && <p style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>Notes: {s.notes}</p>}
                <div className="he-btn-group" style={{marginTop: "0.5rem"}}>
                  {s.status === "DRAFT" && (
                    <button onClick={() => handleConfirm(s.recordingSessionId)}>Confirm Session</button>
                  )}
                  {s.status !== "CANCELLED" && (
                    <button onClick={() => handleOpenEdit(s)} data-testid={`edit-session-btn-${s.recordingSessionId}`}>✎ Edit</button>
                  )}
                  {s.status !== "CANCELLED" && (
                    <button onClick={() => handleCancel(s.recordingSessionId)} style={{background: "var(--he-danger)"}}>Cancel</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
