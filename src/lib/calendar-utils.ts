export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=500&fit=crop", // Jan - snowy mountain
  "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800&h=500&fit=crop", // Feb - winter forest
  "https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=800&h=500&fit=crop", // Mar - spring blossoms
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&h=500&fit=crop", // Apr - flowers
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=500&fit=crop", // May - green landscape
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop", // Jun - beach
  "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&h=500&fit=crop", // Jul - sunset
  "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800&h=500&fit=crop", // Aug - summer field
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop", // Sep - autumn
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop", // Oct - mountains
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=500&fit=crop", // Nov - fog
  "https://images.unsplash.com/photo-1482442120256-9c03866de390?w=800&h=500&fit=crop", // Dec - winter
];

export const MONTH_THEMES: Record<number, string> = {
  0: "207 90% 54%",   // Jan - cool blue
  1: "220 80% 60%",   // Feb - steel blue
  2: "150 60% 50%",   // Mar - spring green
  3: "340 70% 60%",   // Apr - pink
  4: "120 50% 45%",   // May - green
  5: "190 80% 50%",   // Jun - cyan
  6: "30 90% 55%",    // Jul - orange
  7: "45 90% 50%",    // Aug - golden
  8: "15 70% 50%",    // Sep - burnt orange
  9: "280 50% 50%",   // Oct - purple
  10: "35 60% 45%",   // Nov - brown
  11: "210 70% 45%",  // Dec - deep blue
};

export const US_HOLIDAYS: Record<string, string> = {
  "1-1": "New Year's Day",
  "1-15": "MLK Day",
  "2-14": "Valentine's Day",
  "2-19": "Presidents' Day",
  "3-17": "St. Patrick's Day",
  "5-27": "Memorial Day",
  "6-19": "Juneteenth",
  "7-4": "Independence Day",
  "9-2": "Labor Day",
  "10-14": "Columbus Day",
  "10-31": "Halloween",
  "11-11": "Veterans Day",
  "11-28": "Thanksgiving",
  "12-25": "Christmas",
  "12-31": "New Year's Eve",
};

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Convert to Mon=0
}

export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holiday?: string;
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  // Previous month days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i;
    const dayOfWeek = (firstDay - i - 1 + 7) % 7;
    days.push({
      date,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: dayOfWeek >= 5,
    });
  }

  // Current month days
  for (let date = 1; date <= daysInMonth; date++) {
    const dayOfWeek = (firstDay + date - 1) % 7;
    const holidayKey = `${month + 1}-${date}`;
    days.push({
      date,
      month,
      year,
      isCurrentMonth: true,
      isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === date,
      isWeekend: dayOfWeek >= 5,
      holiday: US_HOLIDAYS[holidayKey],
    });
  }

  // Next month days
  const remaining = 42 - days.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let date = 1; date <= remaining; date++) {
    const dayOfWeek = (days.length) % 7;
    days.push({
      date,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: dayOfWeek >= 5,
    });
  }

  return days;
}

export function isSameDay(a: CalendarDay, b: CalendarDay): boolean {
  return a.date === b.date && a.month === b.month && a.year === b.year;
}

export function isInRange(day: CalendarDay, start: CalendarDay | null, end: CalendarDay | null): boolean {
  if (!start || !end) return false;
  const d = new Date(day.year, day.month, day.date).getTime();
  const s = new Date(start.year, start.month, start.date).getTime();
  const e = new Date(end.year, end.month, end.date).getTime();
  return d >= s && d <= e;
}

export function isAfter(day: CalendarDay, reference: CalendarDay): boolean {
  const d = new Date(day.year, day.month, day.date).getTime();
  const r = new Date(reference.year, reference.month, reference.date).getTime();
  return d > r;
}

export function getRangeLength(start: CalendarDay, end: CalendarDay): number {
  const s = new Date(start.year, start.month, start.date).getTime();
  const e = new Date(end.year, end.month, end.date).getTime();
  return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
}

export function formatDate(day: CalendarDay): string {
  return `${MONTH_NAMES[day.month]} ${day.date}, ${day.year}`;
}
