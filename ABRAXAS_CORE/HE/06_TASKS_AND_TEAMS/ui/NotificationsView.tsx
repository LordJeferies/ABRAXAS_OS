import React, {useState} from "react";
import {useHe} from "./HeContext.tsx";

export const NotificationsView: React.FC = () => {
  const {service, session, refresh} = useHe();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const notifications = session.currentActorId ? service.getNotifications(session.currentActorId, unreadOnly) : [];
  const unreadCount = session.currentActorId ? service.getNotifications(session.currentActorId, true).length : 0;

  const handleMarkRead = (notificationId: string) => {
    service.markNotificationRead(notificationId, session.currentActorId);
    refresh();
  };

  const handleMarkAllRead = () => {
    service.markAllNotificationsRead(session.currentActorId, session.currentActorId);
    refresh();
  };

  return (
    <div className="he-view notifications-view">
      <div className="he-header-row" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h2>{`Notification Center (${unreadCount} Unread)`}</h2>
        <div className="he-btn-group">
          <button className={!unreadOnly ? "active" : ""} onClick={() => setUnreadOnly(false)}>All</button>
          <button className={unreadOnly ? "active" : ""} onClick={() => setUnreadOnly(true)}>Unread Only</button>
          {unreadCount > 0 && <button onClick={handleMarkAllRead} data-testid="mark-all-read-btn">Mark All Read</button>}
        </div>
      </div>

      <div className="he-section" data-testid="notifications-list-section">
        {notifications.length === 0 ? (
          <p className="he-muted">{unreadOnly ? "No unread notifications." : "No notifications on record."}</p>
        ) : (
          <ul className="he-session-list">
            {notifications.map((n) => (
              <li key={n.notificationId} className={`he-session-card severity-${n.severity.toLowerCase()}`} data-testid={`notif-card-${n.notificationId}`}>
                <div className="he-session-header">
                  <span className={`he-tag severity-${n.severity.toLowerCase()}`}>{n.severity}</span>
                  <span className="he-tag">{n.type}</span>
                  <span className="he-muted" style={{fontSize: "0.75rem", marginLeft: "auto"}}>{n.createdAt}</span>
                </div>
                <p style={{margin: "0.5rem 0"}}><strong>{n.message}</strong></p>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <span style={{fontSize: "0.8rem", color: "var(--he-muted)"}}>{`Target: ${n.targetRef.targetType}:${n.targetRef.targetId}`}</span>
                  {!n.readAt && (
                    <button onClick={() => handleMarkRead(n.notificationId)} data-testid={`mark-read-${n.notificationId}`}>
                      Mark Read
                    </button>
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
