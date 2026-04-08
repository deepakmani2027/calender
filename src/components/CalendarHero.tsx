import { MONTH_IMAGES, MONTH_NAMES } from "@/lib/calendar-utils";

interface CalendarHeroProps {
  month: number;
  year: number;
  accentColor: string;
}

const CalendarHero = ({ month, year, accentColor }: CalendarHeroProps) => {
  return (
    <div className="relative w-full h-[300px] md:h-[360px] overflow-hidden bg-muted group">
      {/* Hero Image with zoom effect */}
      <img
        src={MONTH_IMAGES[month]}
        alt={`${MONTH_NAMES[month]} scenery`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="eager"
      />

      {/* Multi-layer light overlay for sophisticated depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

      {/* Diagonal overlay with enhanced design */}
      <svg
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`monthGradient${month}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`hsl(${accentColor})`} stopOpacity="1" />
            <stop offset="100%" stopColor={`hsl(${accentColor})`} stopOpacity="0.8" />
          </linearGradient>
          <filter id="shadowFilter">
            <feDropShadow dx="0" dy="-3" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>
        <polygon
          points="500,0 1000,0 1000,120 0,120"
          fill={`hsl(${accentColor})`}
          filter="url(#shadowFilter)"
        />
        <polygon
          points="400,40 1000,0 1000,120 0,120"
          fill={`hsl(${accentColor} / 0.6)`}
        />
      </svg>

      {/* Month/Year badge with enhanced styling */}
      <div className="absolute bottom-6 right-6 text-right z-10">
        <div className="text-primary-foreground text-3xl md:text-4xl font-bold tracking-widest drop-shadow-xl" style={{ textShadow: "3px 3px 8px rgba(0,0,0,0.4)" }}>
          {year}
        </div>
        <div
          className="text-primary-foreground text-2xl md:text-3xl font-extrabold tracking-widest uppercase drop-shadow-xl"
          style={{
            textShadow: "3px 3px 8px rgba(0,0,0,0.4)",
            letterSpacing: "0.15em"
          }}
        >
          {MONTH_NAMES[month]}
        </div>
      </div>
    </div>
  );
};

export default CalendarHero;
