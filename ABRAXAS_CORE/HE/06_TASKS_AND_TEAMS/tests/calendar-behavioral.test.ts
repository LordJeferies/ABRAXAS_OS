import {describe, expect, it} from "vitest";
import {computeMonthGrid, computeWeekGrid} from "../runtime/calendar-math.ts";
import type {CalendarItem} from "../runtime/types.ts";

describe("Calendar Date Mathematics & Isolation (Section 18)", () => {
  const sampleItems: CalendarItem[] = [
    {
      itemId: "cal_1",
      itemType: "DEADLINE",
      sourceId: "dl_1",
      title: "Master Cut Due",
      startsAt: "2026-09-02T18:00:00Z",
      status: "ACTIVE"
    },
    {
      itemId: "cal_2",
      itemType: "RECORDING_SESSION",
      sourceId: "rec_1",
      title: "Studio Batch A",
      startsAt: "2026-09-15T10:00:00Z",
      endsAt: "2026-09-15T14:00:00Z",
      status: "CONFIRMED"
    }
  ];

  it("calculates September 2026 weekday offset and days count accurately", () => {
    const cursor = new Date("2026-09-01T12:00:00Z");
    const grid = computeMonthGrid(cursor, sampleItems);

    expect(grid.year).toBe(2026);
    expect(grid.month).toBe(8); // September is 8 (0-indexed)
    expect(grid.firstDayWeekday).toBe(2); // Sep 1, 2026 is Tuesday (0=Sun, 1=Mon, 2=Tue)
    expect(grid.totalDays).toBe(30);
    expect(grid.days.length).toBe(30);
  });

  it("places September 2 event ONLY on September 2 cell without leak to other days", () => {
    const cursor = new Date("2026-09-01T12:00:00Z");
    const grid = computeMonthGrid(cursor, sampleItems);

    const day1 = grid.days.find(d => d.dayNumber === 1);
    const day2 = grid.days.find(d => d.dayNumber === 2);
    const day3 = grid.days.find(d => d.dayNumber === 3);

    expect(day1?.items.length).toBe(0);
    expect(day2?.items.length).toBe(1);
    expect(day2?.items[0]?.itemId).toBe("cal_1");
    expect(day3?.items.length).toBe(0);
  });

  it("places week event strictly in the matching date column", () => {
    // Week containing Sep 2, 2026: Sunday Aug 30 to Saturday Sep 5
    const cursor = new Date("2026-09-02T12:00:00Z");
    const weekGrid = computeWeekGrid(cursor, sampleItems);

    expect(weekGrid.columns.length).toBe(7);
    const wednesday = weekGrid.columns.find(c => c.dateIso === "2026-09-02");
    const tuesday = weekGrid.columns.find(c => c.dateIso === "2026-09-01");

    expect(wednesday?.items.length).toBe(1);
    expect(wednesday?.items[0]?.itemId).toBe("cal_1");
    expect(tuesday?.items.length).toBe(0);
  });

  it("computes previous, today, and next periods without date corruption", () => {
    const cursor = new Date("2026-09-01T12:00:00Z");

    const prevMonth = new Date(cursor);
    prevMonth.setUTCMonth(prevMonth.getUTCMonth() - 1);
    const prevGrid = computeMonthGrid(prevMonth, sampleItems);
    expect(prevGrid.month).toBe(7); // August
    expect(prevGrid.totalDays).toBe(31);

    const nextMonth = new Date(cursor);
    nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
    const nextGrid = computeMonthGrid(nextMonth, sampleItems);
    expect(nextGrid.month).toBe(9); // October
    expect(nextGrid.totalDays).toBe(31);
  });
});
