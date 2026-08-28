export type HistoryState<T> = Readonly<{
  past: readonly T[];
  present: T;
  future: readonly T[];
}>;

export const createHistory = <T>(present: T): HistoryState<T> => ({
  past: [],
  present,
  future: []
});

export const commitHistory = <T>(history: HistoryState<T>, next: T): HistoryState<T> => ({
  past: [...history.past, history.present],
  present: next,
  future: []
});

export const undoHistory = <T>(history: HistoryState<T>): HistoryState<T> => {
  const previous = history.past.at(-1);
  if (previous === undefined) return history;
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future]
  };
};

export const redoHistory = <T>(history: HistoryState<T>): HistoryState<T> => {
  const next = history.future[0];
  if (next === undefined) return history;
  return {
    past: [...history.past, history.present],
    present: next,
    future: history.future.slice(1)
  };
};
