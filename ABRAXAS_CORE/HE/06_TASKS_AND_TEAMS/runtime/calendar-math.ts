import type {CalendarItem} from "./types.ts";

export interface MonthDayCell {
  dayNumber: number;
  dateIso: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  items: CalendarItem[];
}

export interface MonthGrid {
  year: number;
  month: number; // 0-11
  monthName: string;
  firstDayWeekday: number; // 0 (Sun) - 6 (Sat)
  totalDays: number;
  blankOffset: number;
  days: MonthDayCell[];
}

export interface WeekDayColumn {
  dayName: string;
  dayNumber: number;
  dateIso: string; // YYYY-MM-DD
  items: CalendarItem[];
}

export interface WeekGrid {
  startDateIso: string;
  endDateIso: string;
  columns: WeekDayColumn[];
}

export function computeMonthGrid(cursorDate: Date, items: readonly CalendarItem[]): MonthGrid {
  const year = cursorDate.getUTCFullYear();
  const month = cursorDate.getUTCMonth();
  const monthName = cursorDate.toLocaleString("en-US", {month: "long", year: "numeric", timeZone: "UTC"});

  const firstDay = new Date(Date.UTC(year, month, 1));
  const firstDayWeekday = firstDay.getUTCDay();
  const totalDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const days: MonthDayCell[] = [];
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const dayStr = dayNum.toString().padStart(2, "0");
    const monthStr = (month + 1).toString().padStart(2, "0");
    const dateIso = `${year}-${monthStr}-${dayStr}`;

    const dayItems = items.filter((item) => {
      if (!item.startsAt) return false;
      return item.startsAt.startsWith(dateIso);
    });

    days.push({
      dayNumber: dayNum,
      dateIso,
      isCurrentMonth: true,
      items: dayItems
    });
  }

  return {
    year,
    month,
    monthName,
    firstDayWeekday,
    totalDays,
    blankOffset: firstDayWeekday,
    days
  };
}

export function computeWeekGrid(cursorDate: Date, items: readonly CalendarItem[]): WeekGrid {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDayOfWeek = cursorDate.getUTCDay();

  const weekStart = new Date(cursorDate);
  weekStart.setUTCDate(cursorDate.getUTCDate() - currentDayOfWeek);

  const columns: WeekDayColumn[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setUTCDate(weekStart.getUTCDate() + i);

    const year = d.getUTCFullYear();
    const monthStr = (d.getUTCMonth() + 1).toString().padStart(2, "0");
    const dayStr = d.getUTCDate().toString().padStart(2, "0");
    const dateIso = `${year}-${monthStr}-${dayStr}`;

    const dayItems = items.filter((item) => {
      if (!item.startsAt) return false;
      return item.startsAt.startsWith(dateIso);
    });

    columns.push({
      dayName: daysOfWeek[i] ?? "Day",
      dayNumber: d.getUTCDate(),
      dateIso,
      items: dayItems
    });
  }

  return {
    startDateIso: columns[0]?.dateIso ?? "",
    endDateIso: columns[6]?.dateIso ?? "",
    columns
  };
}
