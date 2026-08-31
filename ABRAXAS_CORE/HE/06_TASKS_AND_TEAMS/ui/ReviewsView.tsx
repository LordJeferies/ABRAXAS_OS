import React, {useState} from "react";
import {useHe} from "./HeContext.tsx";
import type {ApprovalTargetType} from "../runtime/types.ts";

export const ReviewsView: React.FC = () => {
  const {service, session, refresh} = useHe();
  const approvals = service.getApprovals();
  const [targetType, setTargetType] = useState<ApprovalTargetType>("EDIT_LOCK");
  const [targetId, setTargetId] = useState("");
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();

  const handleToggleReviewer = (userId: string) => {
    setSelectedReviewers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (selectedReviewers.length === 0) {
      setError("Please select at least one active reviewer");
      return;
    }
    try {
      service.requestApproval({
        targetType,
        targetId,
        reviewers: selectedReviewers,
        comments: "Requested review via UI"
      }, session.currentActorId);
      setTargetId("");
      setSelectedReviewers([]);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDecide = (approvalId: string, decision: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED") => {
    setError(undefined);
    try {
      service.decideApproval(approvalId, decision, session.currentActorId);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCancel = (approvalId: string) => {
    setError(undefined);
    try {
      service.cancelApproval(approvalId, session.currentActorId);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="he-view reviews-view">
      <h2>Reviews &amp; Approvals</h2>

      {error && <div className="he-error-banner">{error}</div>}

      <form onSubmit={handleRequest} className="he-form" data-testid="request-approval-form">
        <h3>Request Operational Review</h3>
        <div className="he-form-row" style={{marginBottom: "0.5rem"}}>
          <select value={targetType} onChange={(e) => setTargetType(e.target.value as ApprovalTargetType)}>
            <option value="EDIT_LOCK">EDIT_LOCK</option>
            <option value="MOTION_PLAN">MOTION_PLAN</option>
            <option value="LIENZO_COMPONENT">LIENZO_COMPONENT</option>
            <option value="TASK">TASK</option>
            <option value="PUBLICATION_TARGET">PUBLICATION_TARGET</option>
          </select>
          <input
            type="text"
            placeholder="Target ID (e.g. lz_comp_1)..."
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            required
          />
          <button type="submit">Submit Review Request</button>
        </div>
        <div style={{fontSize: "0.85rem", marginTop: "0.5rem"}}>
          <strong>Select Reviewers:</strong>
          <div style={{display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.25rem"}}>
            {session.availableMembers.filter((m) => m.status === "ACTIVE").map((m) => (
              <label key={m.userId} style={{display: "flex", gap: "0.25rem", alignItems: "center", cursor: "pointer"}}>
                <input
                  type="checkbox"
                  checked={selectedReviewers.includes(m.userId)}
                  onChange={() => handleToggleReviewer(m.userId)}
                />
                {`${m.displayName} (${m.userId})`}
              </label>
            ))}
          </div>
        </div>
      </form>

      <div className="he-section">
        <h3>{`Review Ledger (${approvals.length})`}</h3>
        {approvals.length === 0 ? (
          <p className="he-muted">No review requests recorded.</p>
        ) : (
          <ul className="he-approval-list">
            {approvals.map((a) => (
              <li key={a.approvalId} className="he-card" data-testid={`approval-item-${a.approvalId}`}>
                <div className="he-card-header" style={{display: "flex", justifyContent: "space-between"}}>
                  <strong>{`${a.targetType}: ${a.targetId}`}</strong>
                  <span className={`he-tag status-${a.decision.toLowerCase()}`}>{a.decision}</span>
                </div>
                <p>{`Reviewers: ${a.reviewers.join(", ")} | Requested By: ${a.requestedBy}`}</p>
                {a.decision === "PENDING" && (
                  <div className="he-btn-group" style={{marginTop: "0.5rem"}}>
                    <button onClick={() => handleDecide(a.approvalId, "APPROVED")}>Approve</button>
                    <button onClick={() => handleDecide(a.approvalId, "CHANGES_REQUESTED")}>Request Changes</button>
                    <button onClick={() => handleDecide(a.approvalId, "REJECTED")}>Reject</button>
                    <button onClick={() => handleCancel(a.approvalId)} style={{background: "var(--he-surface-elevated)"}}>Cancel Review</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
