export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const MONTH_IMAGES = [
  // "/jan.png",
  // "/feb.png",
  // "/mar.png",
  // "/april.png",
  // "/may.png",
  // "/june.png",
  // "/july.png",
  // "/aug.png",
  // "/sept.png",
  // "/oct.png",
  // "/nov.png",
  // "/dec.png",
    "https://wallpapers.com/images/hd/hd-winter-background-w4gyfr2fzb9kkq5r.jpg",
  "https://c4.wallpaperflare.com/wallpaper/134/543/610/mountain-grass-landscape-valley-wallpaper-preview.jpg",
  "https://t4.ftcdn.net/jpg/07/20/51/01/360_F_720510112_6uaPxOpU8KKtmoPO6pHgOA28inRdJ5ve.jpg",
  "https://static.webcafe.bg/uploads/images/85/5785/255785/768x432.jpg?_=1680330105",
  "https://w0.peakpx.com/wallpaper/486/1016/HD-wallpaper-spring-mountain-mountain-purple-flowers-nature-clouds-meadows-landscape.jpg",
  "https://t4.ftcdn.net/jpg/00/99/00/15/360_F_99001587_atLjVZf7eBpvgfWnJdGOcKTjh9WXM7em.jpg",
  "https://wallpaperbat.com/img/62897-mountain-sunset-4k-wallpaper-top-free-mountain-sunset-4k.jpg",
  "https://png.pngtree.com/thumb_back/fh260/background/20240703/pngtree-beach-with-wave-and-blue-sea-water-background-image_15851460.jpg",
  "https://img.freepik.com/free-photo/small-lake-surrounded-by-leaves-trees-sunlight-forest-autumn_181624-18871.jpg?semt=ais_hybrid&w=740&q=80",
  "https://static.vecteezy.com/system/resources/thumbnails/049/855/471/small/nature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-free-photo.jpg",
  "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI1LTA0L3Jhd3BpeGVsX29mZmljZV80NV9jdXRlX3NpbXBsaWZpZWRfdGlueV9yb3Nlc19ncmFkaWVudF9iYWNrZ3JvdV80MzJkZjFhYi1lOTgyLTRiZDQtOWE3Mi1mYjFkNDMwOGZjMWUtam9iMjAxNC1tOWplMHUzOC5qcGc.jpg",
  "https://wallpapers.com/images/hd/white-tree-rirrb82gld64c7yi.jpg",
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
