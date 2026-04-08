import { useEffect, useState } from "react";
import { CalendarDay, isInRange } from "@/lib/calendar-utils";

const STORAGE_KEY = "calendar_notes";

type NotesStore = {
  monthly: Record<string, string>;
  singleDate: Record<string, string>;
  range: Record<string, string>;
};

const createEmptyStore = (): NotesStore => ({
  monthly: {},
  singleDate: {},
  range: {},
});

const readStore = (): NotesStore => {
  if (typeof window === "undefined") {
    return createEmptyStore();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return createEmptyStore();

    const parsed = JSON.parse(stored) as Partial<NotesStore>;
    return {
      monthly: parsed.monthly || {},
      singleDate: parsed.singleDate || {},
      range: parsed.range || {},
    };
  } catch {
    return createEmptyStore();
  }
};

const writeStore = (store: NotesStore) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const removeKey = (store: Record<string, string>, key: string) => {
  const nextStore = { ...store };
  delete nextStore[key];
  return nextStore;
};

export function useCalendarNotes(year: number, month: number) {
  const [notes, setNotes] = useState<NotesStore>(() => readStore());

  useEffect(() => {
    setNotes(readStore());
  }, []);

  useEffect(() => {
    writeStore(notes);
  }, [notes]);

  const monthlyKey = `${year}-${month}`;
  const currentNote = notes.monthly[monthlyKey] || "";

  const setNote = (text: string) => {
    setNotes((prev) => ({
      ...prev,
      monthly: {
        ...prev.monthly,
        [monthlyKey]: text,
      },
    }));
  };

  const saveSingleDateNote = (day: CalendarDay, text: string) => {
    const key = `${day.year}-${day.month}-${day.date}`;

    setNotes((prev) => ({
      ...prev,
      singleDate: text.trim() === "" ? removeKey(prev.singleDate, key) : { ...prev.singleDate, [key]: text },
    }));
  };

  const saveRangeNote = (start: CalendarDay, end: CalendarDay, text: string) => {
    const startTime = new Date(start.year, start.month, start.date).getTime();
    const endTime = new Date(end.year, end.month, end.date).getTime();
    const rangeStart = startTime <= endTime ? start : end;
    const rangeEnd = startTime <= endTime ? end : start;
    const key = `${rangeStart.year}-${rangeStart.month}-${rangeStart.date}_${rangeEnd.year}-${rangeEnd.month}-${rangeEnd.date}`;

    setNotes((prev) => ({
      ...prev,
      range: text.trim() === "" ? removeKey(prev.range, key) : { ...prev.range, [key]: text },
    }));
  };

  const getSingleDateNote = (day: CalendarDay): string => {
    const key = `${day.year}-${day.month}-${day.date}`;
    return notes.singleDate[key] || "";
  };

  const getRangeNote = (start: CalendarDay, end: CalendarDay): string => {
    const startTime = new Date(start.year, start.month, start.date).getTime();
    const endTime = new Date(end.year, end.month, end.date).getTime();
    const rangeStart = startTime <= endTime ? start : end;
    const rangeEnd = startTime <= endTime ? end : start;
    const key = `${rangeStart.year}-${rangeStart.month}-${rangeStart.date}_${rangeEnd.year}-${rangeEnd.month}-${rangeEnd.date}`;
    return notes.range[key] || "";
  };

  const hasSingleDateNote = (day: CalendarDay): boolean => {
    const key = `${day.year}-${day.month}-${day.date}`;
    return Boolean(notes.singleDate[key]);
  };

  const hasRangeNote = (day: CalendarDay): boolean => {
    return Object.keys(notes.range).some((key) => {
      const [startKey, endKey] = key.split("_");
      const [startYear, startMonth, startDate] = startKey.split("-").map(Number);
      const [endYear, endMonth, endDate] = endKey.split("-").map(Number);

      return isInRange(
        day,
        { year: startYear, month: startMonth, date: startDate, isCurrentMonth: true, isToday: false, isWeekend: false },
        { year: endYear, month: endMonth, date: endDate, isCurrentMonth: true, isToday: false, isWeekend: false }
      );
    });
  };

  return {
    currentNote,
    monthlyNote: currentNote,
    setNote,
    saveMonthlyNote: setNote,
    getSingleDateNote,
    getRangeNote,
    saveSingleDateNote,
    saveRangeNote,
    hasSingleDateNote,
    hasRangeNote,
  };
}
