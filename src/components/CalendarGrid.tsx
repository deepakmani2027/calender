import { CalendarDay, DAY_NAMES, isSameDay, isInRange } from "@/lib/calendar-utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarGridProps {
  days: CalendarDay[];
  rangeStart: CalendarDay | null;
  rangeEnd: CalendarDay | null;
  onDayClick: (day: CalendarDay) => void;
}

const CalendarGrid = ({ days, rangeStart, rangeEnd, onDayClick }: CalendarGridProps) => {
  const getDateClasses = (day: CalendarDay) => {
    const base = "relative flex items-center justify-center h-10 w-full text-sm cursor-pointer transition-all duration-200 rounded-lg font-medium";

    if (!day.isCurrentMonth) return `${base} text-muted-foreground/30 opacity-50`;

    const isStart = rangeStart && isSameDay(day, rangeStart);
    const isEnd = rangeEnd && isSameDay(day, rangeEnd);
    const inRange = isInRange(day, rangeStart, rangeEnd);
    const isToday = day.isToday;

    if (isStart || isEnd) {
      return `${base} bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold shadow-lg hover:shadow-xl scale-100 hover:scale-105`;
    }
    if (inRange) {
      return `${base} bg-gradient-to-r from-[hsl(var(--calendar-range))] to-[hsl(var(--calendar-range))] font-semibold`;
    }
    if (isToday) {
      return `${base} bg-[hsl(var(--calendar-today))] text-white font-bold shadow-md hover:shadow-lg`;
    }
    if (day.isWeekend) {
      return `${base} text-[hsl(var(--calendar-weekend))] font-semibold hover:bg-muted/60 hover:text-[hsl(var(--calendar-weekend))]`;
    }
    return `${base} text-foreground hover:bg-gradient-to-br hover:from-muted hover:to-muted/50 hover:text-foreground`;
  };

  return (
    <div className="flex-1">
      {/* Day headers with enhanced styling */}
      <div className="grid grid-cols-7 mb-4 pb-3 border-b-2 border-muted">
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className={`text-center text-xs font-bold tracking-widest py-3 transition-colors ${
              name === "SAT" || name === "SUN"
                ? "text-[hsl(var(--calendar-weekend))] font-extrabold"
                : "text-foreground/80"
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Date grid with improved spacing */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, idx) => {
          const cellContent = (
            <button
              key={idx}
              className={`${getDateClasses(day)} active:scale-95 transition-all duration-200`}
              onClick={() => day.isCurrentMonth && onDayClick(day)}
              disabled={!day.isCurrentMonth}
            >
              {day.date}
              {day.isToday && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[hsl(var(--calendar-today))] shadow-lg" />
              )}
              {day.holiday && day.isCurrentMonth && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse shadow-md" />
              )}
            </button>
          );

          if (day.holiday && day.isCurrentMonth) {
            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {day.holiday}
                </TooltipContent>
              </Tooltip>
            );
          }

          return cellContent;
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
