import React, {useState} from "react";
import {useHe} from "./HeContext.tsx";
import type {CalendarViewMode} from "./types.ts";
import {computeMonthGrid, computeWeekGrid} from "../runtime/calendar-math.ts";

export const CalendarView: React.FC = () => {
  const {service} = useHe();
  const [mode, setMode] = useState<CalendarViewMode>("list");
  const [cursorDate, setCursorDate] = useState<Date>(new Date("2026-09-01T12:00:00Z"));
  const calendar = service.getCalendarProjection();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Navigation handlers
  const handlePrev = () => {
    const next = new Date(cursorDate);
    if (mode === "month") next.setUTCMonth(next.getUTCMonth() - 1);
    else if (mode === "week") next.setUTCDate(next.getUTCDate() - 7);
    else next.setUTCDate(next.getUTCDate() - 30);
    setCursorDate(next);
  };

  const handleNext = () => {
    const next = new Date(cursorDate);
    if (mode === "month") next.setUTCMonth(next.getUTCMonth() + 1);
    else if (mode === "week") next.setUTCDate(next.getUTCDate() + 7);
    else next.setUTCDate(next.getUTCDate() + 30);
    setCursorDate(next);
  };

  const handleToday = () => {
    setCursorDate(new Date("2026-09-01T12:00:00Z"));
  };

  // Pure Math Computations
  const monthGrid = computeMonthGrid(cursorDate, calendar.items);
  const weekGrid = computeWeekGrid(cursorDate, calendar.items);

  return (
    <div className="he-view calendar-view">
      <div className="he-header-row" style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem"}}>
        <h2>Production Calendar</h2>
        <div style={{display: "flex", gap: "0.5rem", alignItems: "center"}}>
          <div className="he-btn-group">
            <button onClick={handlePrev} data-testid="cal-prev-btn">&lt; Prev</button>
            <button onClick={handleToday} data-testid="cal-today-btn">Today</button>
            <button onClick={handleNext} data-testid="cal-next-btn">Next &gt;</button>
          </div>
          <span style={{fontWeight: "bold", fontSize: "0.95rem", minWidth: "150px", textAlign: "center"}} data-testid="cal-cursor-label">
            {mode === "week" ? `${weekGrid.startDateIso} - ${weekGrid.endDateIso}` : monthGrid.monthName}
          </span>
          <div className="he-btn-group">
            <button className={mode === "month" ? "active" : ""} onClick={() => setMode("month")}>Month</button>
            <button className={mode === "week" ? "active" : ""} onClick={() => setMode("week")}>Week</button>
            <button className={mode === "list" ? "active" : ""} onClick={() => setMode("list")}>List</button>
          </div>
        </div>
      </div>

      {mode === "list" && (
        <div className="he-section" data-testid="calendar-list-view">
          <h3>{`Chronological Events & Deadlines (${calendar.items.length})`}</h3>
          {calendar.items.length === 0 ? (
            <p className="he-muted">No scheduled events or deadlines found.</p>
          ) : (
            <ul className="he-calendar-list">
              {[...calendar.items].sort((a, b) => new Date(a.startsAt ?? 0).getTime() - new Date(b.startsAt ?? 0).getTime()).map((item: any) => (
                <li key={item.itemId} className={`he-calendar-item type-${item.itemType.toLowerCase()}`}>
                  <span className="he-tag">{item.itemType}</span>
                  <strong>{item.title}</strong>
                  <span>{`Starts: ${item.startsAt} (${item.timezone ?? "UTC"})`}</span>
                  {item.endsAt && <span>{`Ends: ${item.endsAt}`}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {mode === "month" && (
        <div className="he-section" data-testid="calendar-month-view">
          <h3>{`Month View — ${monthGrid.monthName}`}</h3>
          <div className="he-calendar-month-grid">
            {daysOfWeek.map((d) => (
              <div key={d} className="he-calendar-day-header">{d}</div>
            ))}
            {/* Blank cells before 1st of month */}
            {Array.from({length: monthGrid.blankOffset}).map((_, i) => (
              <div key={`blank-${i}`} className="he-calendar-day-cell empty" style={{opacity: 0.3}} />
            ))}
            {/* Days in Month */}
            {monthGrid.days.map((day) => (
              <div key={day.dateIso} className="he-calendar-day-cell" data-testid={`month-day-${day.dayNumber}`}>
                <div className="he-day-number" style={{fontWeight: "bold", fontSize: "0.8rem"}}>{day.dayNumber}</div>
                {day.items.map((item: any) => (
                  <div key={item.itemId} className="he-calendar-pill" style={{fontSize: "0.75rem", background: "var(--he-surface)", border: "1px solid var(--he-border)", padding: "2px 4px", borderRadius: "3px", marginTop: "2px"}} data-testid={`month-item-${item.itemId}`}>
                    <span style={{color: "var(--he-primary)", fontWeight: "600"}}>{item.itemType === "DEADLINE" ? "⏱" : "●"}</span> {item.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === "week" && (
        <div className="he-section" data-testid="calendar-week-view">
          <h3>{`Week View — ${weekGrid.startDateIso} to ${weekGrid.endDateIso}`}</h3>
          <div className="he-calendar-week-grid">
            {weekGrid.columns.map((col) => (
              <div key={col.dateIso} className="he-calendar-week-col" data-testid={`week-col-${col.dateIso}`}>
                <div className="he-calendar-day-header">{`${col.dayName} ${col.dayNumber}`}</div>
                <div className="he-week-events">
                  {col.items.map((item: any) => (
                    <div key={item.itemId} className="he-card" style={{padding: "0.5rem", marginBottom: "0.5rem", fontSize: "0.8rem"}} data-testid={`week-item-${item.itemId}`}>
                      <span className="he-tag" style={{fontSize: "0.65rem"}}>{item.itemType}</span>
                      <p style={{fontWeight: "bold", marginTop: "2px"}}>{item.title}</p>
                      <p style={{fontSize: "0.7rem", color: "var(--he-muted)"}}>{item.startsAt?.split("T")[1]?.substring(0, 5)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
