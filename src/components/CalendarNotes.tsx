import { MONTH_NAMES } from "@/lib/calendar-utils";

interface CalendarNotesProps {
  month: number;
  year: number;
  note: string;
  onNoteChange: (text: string) => void;
  rangeSummary?: string;
}

const CalendarNotes = ({ month, note, onNoteChange, rangeSummary }: CalendarNotesProps) => {
  return (
    <div className="w-full md:w-48 lg:w-56 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-bold text-foreground tracking-widest uppercase">
          Notes
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-muted to-transparent" />
      </div>

      {rangeSummary && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/15 to-primary/5 text-xs text-primary font-semibold backdrop-blur border border-primary/20 shadow-sm">
          📍 {rangeSummary}
        </div>
      )}

      <div className="relative flex-1 min-h-[200px] rounded-xl overflow-hidden border border-transparent transition-all hover:shadow-md group focus-within:shadow-md">
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder={`Notes for ${MONTH_NAMES[month]}...`}
          className="w-full h-full min-h-[200px] resize-none bg-transparent lined-paper text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none leading-[28px] pt-[12px] px-4 transition-all duration-200 group-focus:ring-1 group-focus:ring-primary/30"
        />
      </div>
    </div>
  );
};

export default CalendarNotes;
