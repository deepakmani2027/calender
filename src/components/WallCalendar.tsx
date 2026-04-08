import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, MapPin, Plus, Check, X, Notebook } from 'lucide-react';
import { soundManager } from '../lib/SoundManager';

/** * CALENDAR UTILITIES */
const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const MONTH_IMAGES = [
  "/jan.png",
  "/feb.png",
  "/mar.png",
  "/april.png",
  "/may.png",
  "/june.png",
  "/july.png",
  "/aug.png",
  "/sept.png",
  "/oct.png",
  "/nov.png",
  "/dec.png"
];
const MONTH_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#6BCB77", "#FFEEAD", "#00bcd4",
  "#9DE0AD", "#E1F5C4", "#FFD93D", "#6BCB77", "#4D96FF", "#F473B9"
];

const HOLIDAY_EVENTS = {
  '0-1': ["New Year's Day"],
  '0-13': ["Lohri"],
  '0-14': ["Makar Sankranti / Pongal"],
  '0-23': ["Netaji Subhas Chandra Bose Jayanti", "Vasant Panchami"],
  '0-26': ["Republic Day"],
  '2-8': ["International Women's Day"],
  '3-14': ["Dr. B.R. Ambedkar Jayanti", "Vaisakhi / Tamil New Year / Vishu / Bohag Bihu"],
  '3-15': ["Vaisakhi / Tamil New Year / Vishu / Bohag Bihu"],
  '4-1': ["Labour Day / May Day"],
  '4-9': ["Rabindranath Tagore Jayanti"],
  '7-15': ["Independence Day"],
  '8-5': ["Teachers' Day"],
  '9-2': ["Mahatma Gandhi Jayanti"],
  '10-14': ["Children’s Day / Nehru Jayanti"],
  '11-25': ["Christmas Day"],
};

const getHolidayEvents = (day) => HOLIDAY_EVENTS[`${day.month}-${day.date}`] || [];

const isSameDay = (a, b) => a && b && a.date === b.date && a.month === b.month && a.year === b.year;

const isAfter = (day, reference) => {
  const d = new Date(day.year, day.month, day.date).getTime();
  const r = new Date(reference.year, reference.month, reference.date).getTime();
  return d > r;
};

const isInRange = (day, start, end) => {
  if (!start || !end) return false;
  const d = new Date(day.year, day.month, day.date).getTime();
  const s = new Date(start.year, start.month, start.date).getTime();
  const e = new Date(end.year, end.month, end.date).getTime();
  return d >= s && d <= e;
};

const parseDateKey = (key) => {
  const [year, month, date] = key.split('-').map(Number);
  return { year, month, date };
};

const getCalendarDays = (year, month) => {
  const days = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: daysInPrevMonth - i, month: prevMonth, year: prevYear, isCurrentMonth: false });
  }

  const today = new Date();
  for (let date = 1; date <= daysInMonth; date++) {
    const dayOfWeek = (firstDay + date - 1) % 7;
    days.push({
      date, month, year,
      isCurrentMonth: true,
      isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === date,
      isWeekend: dayOfWeek >= 5,
    });
  }

  const remaining = 42 - days.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let date = 1; date <= remaining; date++) {
    days.push({ date, month: nextMonth, year: nextYear, isCurrentMonth: false });
  }
  return days;
};

/** * CUSTOM HOOKS */
const useCalendarNotes = (year, month) => {
  const [data, setData] = useState({ monthly: {}, single: {}, range: {} });

  useEffect(() => {
    const stored = localStorage.getItem("calendar_wall_v8");
    if (stored) setData(JSON.parse(stored));
  }, []);

  const save = (newData) => {
    setData(newData);
    localStorage.setItem("calendar_wall_v8", JSON.stringify(newData));
  };

  return {
    data,
    monthlyNote: data.monthly[`${year}-${month}`] || "",
    updateMonthly: (val) => save({ ...data, monthly: { ...data.monthly, [`${year}-${month}`]: val } }),
    saveSingle: (day, val) => save({ ...data, single: { ...data.single, [`${day.year}-${day.month}-${day.date}`]: val } }),
    saveRange: (s, e, val) => save({ ...data, range: { ...data.range, [`${s.year}-${s.month}-${s.date}_${e.year}-${e.month}-${e.date}`]: val } }),
    hasSingleNote: (day) => !!data.single[`${day.year}-${day.month}-${day.date}`],
    getSingleNote: (day) => data.single[`${day.year}-${day.month}-${day.date}`] || "",
    getRangeNote: (day) => {
      const match = Object.entries(data.range).find(([key]) => {
        const [startKey, endKey] = key.split('_');
        return isInRange(day, parseDateKey(startKey), parseDateKey(endKey));
      });
      return match ? match[1] : "";
    },
    hasRangeNote: (day) => Object.keys(data.range).some(key => {
      const [s, e] = key.split('_').map(parseDateKey);
      return isInRange(day, s, e);
    }),
  };
};

/** * UI COMPONENTS */
const BindingBar = () => (
  <div className="absolute -top-3 left-0 w-full flex justify-around px-8 sm:px-16 z-50">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="relative">
        <div
          className="w-1.5 sm:w-2 h-7 rounded-full shadow-inner border-t border-white/10"
          style={{ background: 'linear-gradient(to bottom, #727278 0%, #3a3a3e 100%)' }}
        />
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/20 blur-[2px] rounded-full -z-10" />
      </div>
    ))}
  </div>
);

const CalendarHero = ({ month, year, color }) => (
  <div className="relative h-28 sm:h-56 w-full overflow-hidden rounded-t-xl shrink-0">
    <img
      src={MONTH_IMAGES[month]}
      alt="Hero"
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
    />
    <div
      className="absolute inset-0 transition-colors duration-700"
      style={{
        backgroundColor: color,
        clipPath: 'polygon(0 80%, 100% 45%, 100% 100%, 0% 100%)',
        mixBlendMode: 'multiply'
      }}
    />
    <div className="absolute bottom-3 right-5 text-right text-white drop-shadow-xl z-10">
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none drop-shadow-lg">{year}</h1>
      <h2 className="text-2xl sm:text-4xl font-black tracking-wide leading-none drop-shadow-lg uppercase">{MONTH_NAMES[month]}</h2>
    </div>
  </div>
);

const CalendarGrid = ({ days, rangeStart, rangeEnd, onDayClick, hasSingleNote, hasRangeNote }) => (
  <div className="p-2 sm:p-5 sm:flex-1 shrink-0">
    <div className="grid grid-cols-7 mb-2 sm:mb-4">
      {DAY_NAMES.map(n => (
        <span key={n} className={`text-[11px] sm:text-sm font-black text-center ${n === 'SAT' || n === 'SUN' ? 'text-red-500' : 'text-gray-400 opacity-80'}`}>
          {n}
        </span>
      ))}
    </div>
    <div className="grid grid-cols-7 gap-2 sm:gap-3">
      {days.map((day, i) => {
        const isSelStart = isSameDay(day, rangeStart);
        const isSelEnd = isSameDay(day, rangeEnd);
        const inRange = isInRange(day, rangeStart, rangeEnd);
        const holidayEvents = day.isCurrentMonth ? getHolidayEvents(day) : [];

        let containerCls = "relative flex items-center justify-center transition-all rounded-lg ";
        let textCls = "text-sm sm:text-base md:text-lg font-bold ";
        const boxSize = "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 ";

        if (!day.isCurrentMonth) {
          textCls += "text-gray-300 dark:text-gray-600";
          containerCls += "opacity-40";
        } else {
          if (day.isToday) {
            containerCls += "bg-indigo-600 shadow-md ";
            textCls += "text-white ";
          }
          else if (isSelStart || isSelEnd) {
            containerCls += "bg-orange-500 shadow-md scale-105 z-10 ";
            textCls += "text-white ";
          }
          else if (inRange) {
            containerCls += "bg-orange-100 dark:bg-orange-900/40 ";
            textCls += "text-orange-600 dark:text-orange-300 ";
          }
          else if (day.isWeekend) {
            textCls += "text-red-500 dark:text-red-400 ";
          } else {
            textCls += "text-gray-700 dark:text-gray-200 ";
          }
        }

        return (
          <div key={i} className="flex justify-center items-center">
            <button onClick={() => onDayClick(day)} className={`${containerCls} ${boxSize}`} disabled={!day.isCurrentMonth}>
              {day.isToday && day.isCurrentMonth && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rotate-45 rounded-sm z-[-1]" />
              )}
              <span className={textCls}>{day.date}</span>
              <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 flex gap-1">
                {day.isCurrentMonth && hasSingleNote(day) && !day.isToday && !isSelStart && !isSelEnd && <span className="w-1 h-1 bg-green-500 rounded-full" />}
                {day.isCurrentMonth && hasRangeNote(day) && !day.isToday && !isSelStart && !isSelEnd && <span className="w-1 h-1 bg-blue-500 rounded-full" />}
                {holidayEvents.length > 0 && !day.isToday && !isSelStart && !isSelEnd && <span className="w-1 h-1 bg-amber-500 rounded-full" />}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  </div>
);

const CalendarNotes = ({ note, onNoteChange, rangeStart, rangeEnd, saveSingle, saveRange, holidayEvents = [], selectedNoteEntries = [] }) => {
  const [singleTxt, setSingleTxt] = useState("");
  const [rangeTxt, setRangeTxt] = useState("");
  const [mode, setMode] = useState('monthly');

  const hasRange = rangeStart && rangeEnd;
  const hasSingle = rangeStart && !rangeEnd;

  return (
    <div className={`
      w-full sm:w-[38%] border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-800 
      p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 bg-white dark:bg-slate-900 z-10
      overflow-y-auto max-h-[42vh] sm:flex sm:flex-col sm:h-full sm:overflow-y-auto
    `}>
      <div className="flex items-center gap-2 border-b border-gray-50 dark:border-gray-800 pb-2 shrink-0">
        <Notebook size={16} className="text-gray-400" />
        <h3 className="text-xs sm:text-sm font-black text-gray-400 tracking-widest uppercase">Planning & Notes</h3>
      </div>

      <div className="flex flex-col gap-3 shrink-0">
        {rangeStart && (
          <div className="flex flex-col gap-2">
            <div className="text-[11px] sm:text-xs font-black text-orange-500 flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full w-fit">
              <MapPin size={12} fill="currentColor" /> {hasRange ? `Selected Range` : `Focus Day ${rangeStart.date}`}
            </div>

            {selectedNoteEntries.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-3 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 mb-2">Selected Note</p>
                <div className="flex flex-col gap-2">
                  {selectedNoteEntries.map(({ label, text }) => (
                    <div key={`${label}-${text}`} className="rounded-xl bg-white/80 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 p-2">
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-1">
                        {label}
                      </div>
                      <div className="text-[11px] sm:text-sm font-medium text-slate-700 dark:text-slate-100 whitespace-pre-wrap">
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {holidayEvents.length > 0 && (
              <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/15 p-3 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300 mb-2">Festival</p>
                <div className="flex flex-col gap-1">
                  {holidayEvents.map((event) => (
                    <div key={event} className="text-[11px] sm:text-sm font-semibold text-amber-900 dark:text-amber-100">
                      {event}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              {hasSingle && mode !== 'single' && (
                <button 
                  onClick={() => setMode('single')} 
                  className="flex-1 text-[10px] sm:text-xs font-bold text-green-600 border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10 px-3 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
                >
                  <Plus size={14} /> ADD DAY NOTE
                </button>
              )}

              {hasRange && mode !== 'range' && (
                <button 
                  onClick={() => setMode('range')} 
                  className="flex-1 text-[10px] sm:text-xs font-bold text-blue-600 border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 px-3 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                >
                  <Plus size={14} /> ADD RANGE NOTE
                </button>
              )}
            </div>
          </div>
        )}

        {mode === 'single' && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black text-green-600 mb-2 uppercase">New note for Day {rangeStart?.date}</p>
            <textarea value={singleTxt} onChange={e => setSingleTxt(e.target.value)} className="w-full h-16 bg-transparent text-[11px] sm:text-sm focus:outline-none resize-none placeholder-green-400" placeholder="What's happening this day?..." />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setMode('monthly')} className="text-[10px] font-bold text-gray-500 px-3 py-1.5 rounded-lg hover:bg-white/50">CANCEL</button>
              <button onClick={() => { saveSingle(rangeStart, singleTxt); setMode('monthly'); setSingleTxt(""); }} className="bg-green-600 text-white text-[10px] px-4 py-1.5 rounded-lg font-bold shadow-md flex items-center gap-1"><Check size={12}/> SAVE</button>
            </div>
          </div>
        )}

        {mode === 'range' && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black text-blue-600 mb-2 uppercase">Range Memo</p>
            <textarea value={rangeTxt} onChange={e => setRangeTxt(e.target.value)} className="w-full h-16 bg-transparent text-[11px] sm:text-sm focus:outline-none resize-none placeholder-blue-400" placeholder="Describe this period..." />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setMode('monthly')} className="text-[10px] font-bold text-gray-500 px-3 py-1.5 rounded-lg hover:bg-white/50">CANCEL</button>
              <button onClick={() => { saveRange(rangeStart, rangeEnd, rangeTxt); setMode('monthly'); setRangeTxt(""); }} className="bg-blue-600 text-white text-[10px] px-4 py-1.5 rounded-lg font-bold shadow-md flex items-center gap-1"><Check size={12}/> SAVE</button>
            </div>
          </div>
        )}
      </div>

      {/* Monthly textarea - now grows with content, scroll handled by parent */}
      <div className="relative w-full mt-2 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/50">
        <textarea
          value={note}
          onChange={e => onNoteChange(e.target.value)}
          placeholder={`General monthly reminders...`}
          className="w-full min-h-[200px] sm:min-h-[240px] bg-transparent text-sm sm:text-base text-gray-600 dark:text-gray-300 focus:outline-none resize-y leading-[26px] sm:leading-[34px]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '100% 26px',
          }}
        />
      </div>
    </div>
  );
};

const LayeredPageStack = ({ children, isAnimating, direction, isMobile }) => (
  <div className={`relative w-full ${isMobile ? 'h-auto max-h-[92vh]' : 'h-full'} perspective-1000 bg-white dark:bg-slate-900 rounded-3xl shadow-[0_35px_70px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 border border-white/20`}>
    <div className={`w-full h-full transition-all duration-700 transform-gpu ease-in-out ${isAnimating ? (direction === 'forward' ? '-rotate-x-12 -translate-y-8 scale-95 opacity-40' : 'rotate-x-12 translate-y-8 scale-95 opacity-40') : 'rotate-x-0'}`}>
      {children}
    </div>
  </div>
);

/** * MAIN APP */
export default function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flipDir, setFlipDir] = useState('forward');

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);
  const { monthlyNote, updateMonthly, saveSingle, saveRange, hasSingleNote, hasRangeNote, getSingleNote, getRangeNote } = useCalendarNotes(year, month);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const navigate = (dir) => {
    if (isAnimating) return;
    soundManager.playPageFlip();
    setIsAnimating(true);
    setFlipDir(dir === 1 ? 'forward' : 'backward');
    setTimeout(() => {
      let nm = month + dir;
      let ny = year;
      if (nm > 11) { nm = 0; ny++; }
      if (nm < 0) { nm = 11; ny--; }
      setMonth(nm);
      setYear(ny);
      setRangeStart(null);
      setRangeEnd(null);
    }, 350);
    setTimeout(() => setIsAnimating(false), 750);
  };

  const handleDayClick = (day) => {
    if (!day.isCurrentMonth) return;
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
    } else {
      if (isAfter(day, rangeStart)) setRangeEnd(day);
      else { setRangeStart(day); setRangeEnd(null); }
    }
  };

  const selectedNoteEntries = rangeStart
    ? [
        getSingleNote(rangeStart) ? { label: 'Specific Date Note', text: getSingleNote(rangeStart) } : null,
        getRangeNote(rangeStart) ? { label: 'Date Range Note', text: getRangeNote(rangeStart) } : null,
      ].filter(Boolean)
    : [];

  const selectedHolidayEvents = rangeStart ? getHolidayEvents(rangeStart) : [];

  return (
    <div className={`${isDark ? 'dark' : ''} h-screen w-screen flex items-center justify-center p-3 sm:p-8 transition-colors duration-500 overflow-hidden`}>
      <style>{`
        .dark { --background: 240 10% 3.9%; --foreground: 0 0% 98%; }
        .perspective-1000 { perspective: 1200px; }
        .rotate-x-12 { transform: rotateX(12deg); }
        .-rotate-x-12 { transform: rotateX(-12deg); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .leather-strap {
          background: linear-gradient(90deg, #5c2c06 0%, #8b4513 50%, #5c2c06 100%);
          box-shadow: inset 0 0 5px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3);
        }
        .brass-peg {
          background: radial-gradient(circle at 30% 30%, #ffd700, #b8860b 80%, #5c4033);
          box-shadow: 0 4px 8px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.4);
        }
      `}</style>

      {/* Main container */}
      <div className="relative w-full h-full max-w-5xl flex flex-col items-center justify-start sm:justify-center pt-0 sm:pt-0 top-0 sm:top-11">
        
        {/* HANGER: Leather strap & Brass Peg */}
        <div className="hidden sm:flex absolute sm:-top-14 flex-col items-center z-20">
          <div className="brass-peg w-5 h-5 sm:w-8 sm:h-8 rounded-full z-30 flex items-center justify-center border border-yellow-600/30 shadow-md">
            <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
          </div>
          <div className="relative -mt-1">
            <div className="leather-strap w-6 sm:w-10 h-6 sm:h-14 rounded-t-lg flex justify-between px-1 sm:px-2 pt-1 sm:pt-2">
              <div className="h-full border-l border-dashed border-white/20 opacity-40" />
              <div className="h-full border-r border-dashed border-white/20 opacity-40" />
            </div>
            <div className="absolute inset-0 bg-black/20 blur-md -z-10 translate-y-1 translate-x-1" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex w-full items-center justify-start gap-8 absolute top-7">
          <button onClick={() => navigate(-1)} className="p-5 rounded-full bg-white shadow-xl hover:scale-110 active:scale-95 transition-all text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700">
            <ChevronLeft size={32} />
          </button>

          {/* Card container */}
          <div className="w-full max-w-3xl h-[680px] sm:h-[650px] relative">
            <BindingBar />
            <LayeredPageStack isAnimating={isAnimating} direction={flipDir} isMobile={false}>
              <CalendarHero month={month} year={year} color={MONTH_COLORS[month]} />
              {/* Desktop: flex row with min-h-0 to allow children to shrink */}
              <div className="flex flex-row h-full min-h-0 overflow-hidden bg-transparent transition-colors duration-500">
                <CalendarNotes
                  note={monthlyNote}
                  onNoteChange={updateMonthly}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  saveSingle={saveSingle}
                  saveRange={saveRange}
                  holidayEvents={selectedHolidayEvents}
                  selectedNoteEntries={selectedNoteEntries}
                />
                <CalendarGrid
                  days={days}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  onDayClick={handleDayClick}
                  hasSingleNote={hasSingleNote}
                  hasRangeNote={hasRangeNote}
                />
              </div>
            </LayeredPageStack>
          </div>

          <button onClick={() => navigate(1)} className="p-5 rounded-full bg-white shadow-xl hover:scale-110 active:scale-95 transition-all text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700">
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Mobile Calendar */}
        <div className="sm:hidden w-full flex flex-col items-center justify-center px-4 mt-0">
          <div className="w-full max-w-[360px] relative">
            <BindingBar />
            <LayeredPageStack isAnimating={isAnimating} direction={flipDir} isMobile={true}>
              <CalendarHero month={month} year={year} color={MONTH_COLORS[month]} />
              <div className="flex flex-col bg-transparent transition-colors duration-500">
                <CalendarGrid
                  days={days}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  onDayClick={handleDayClick}
                  hasSingleNote={hasSingleNote}
                  hasRangeNote={hasRangeNote}
                />
                <CalendarNotes
                  note={monthlyNote}
                  onNoteChange={updateMonthly}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  saveSingle={saveSingle}
                  saveRange={saveRange}
                  holidayEvents={selectedHolidayEvents}
                  selectedNoteEntries={selectedNoteEntries}
                />
              </div>
            </LayeredPageStack>
          </div>
          
          <div className="w-full max-w-[360px] mt-3 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-3 rounded-full bg-white shadow-xl text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-full bg-white shadow-2xl text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700">
              {isDark ? <Sun size={24} className="text-yellow-500" /> : <Moon size={24} className="text-blue-500" />}
            </button>
            <button onClick={() => navigate(1)} className="p-3 rounded-full bg-white shadow-xl text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Desktop Theme Toggle */}
        <div className="hidden sm:flex mt-10 gap-4 items-center absolute bottom-80">
          <button onClick={() => setIsDark(!isDark)} className="p-5 rounded-full bg-white shadow-2xl hover:rotate-12 transition-transform text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700">
            {isDark ? <Sun size={28} className="text-yellow-500" /> : <Moon size={28} className="text-blue-500" />}
          </button>
        </div>
      </div>
    </div>
  );
}