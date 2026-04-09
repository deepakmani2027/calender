import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, MapPin, Plus, Check, X, Notebook } from 'lucide-react';

/** * CALENDAR UTILITIES */
const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const MONTH_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#6BCB77", "#FFEEAD", "#00bcd4",
  "#9DE0AD", "#E1F5C4", "#FFD93D", "#6BCB77", "#4D96FF", "#F473B9"
];

const MONTH_IMAGES = [
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

/** * SOUND UTILITY */
const playFlipSound = () => {
  try {
    const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    const audioCtx = new AudioContextCtor();
    
    // Create white noise for the 'rustle' sound
    const bufferSize = audioCtx.sampleRate * 0.15;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    // Filter the noise to make it sound like paper
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noise.start();
    noise.stop(audioCtx.currentTime + 0.15);
  } catch (e) {
    console.warn("Audio playback failed", e);
  }
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
  <div className="relative h-28 sm:h-52 w-full overflow-hidden rounded-t-xl shrink-0">
    <img
      src={MONTH_IMAGES[month]}
      alt="Hero"
      className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
    />
    <div
      className="absolute inset-0 transition-colors duration-700 z-10"
      style={{
        backgroundColor: color,
        clipPath: 'polygon(0 80%, 100% 45%, 100% 100%, 0% 100%)',
        mixBlendMode: 'multiply'
      }}
    />
    <div className="absolute bottom-3 right-5 text-right text-white drop-shadow-xl z-20">
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none drop-shadow-lg">{year}</h1>
      <h2 className="text-2xl sm:text-4xl font-black tracking-wide leading-none drop-shadow-lg uppercase">{MONTH_NAMES[month]}</h2>
    </div>
  </div>
);

const CalendarGrid = ({ days, rangeStart, rangeEnd, onDayClick, hasSingleNote, hasRangeNote }) => (
  <div className="p-2 sm:p-3 flex-1 min-w-0">
    <div className="grid grid-cols-7 mb-1.5 sm:mb-3">
      {DAY_NAMES.map(n => (
        <span key={n} className={`text-[9px] sm:text-xs font-black text-center ${n === 'SAT' || n === 'SUN' ? 'text-red-500' : 'text-gray-400 opacity-80'}`}>
          {n}
        </span>
      ))}
    </div>
    <div className="grid grid-cols-7 gap-1 sm:gap-2.5">
      {days.map((day, i) => {
        const isSelStart = isSameDay(day, rangeStart);
        const isSelEnd = isSameDay(day, rangeEnd);
        const inRange = isInRange(day, rangeStart, rangeEnd);
        const holidayEvents = day.isCurrentMonth ? getHolidayEvents(day) : [];

        let containerCls = "relative flex items-center justify-center transition-all rounded-xl ";
        let textCls = "text-xs sm:text-sm md:text-lg font-bold ";
        const boxSize = "w-7 h-7 sm:w-10 sm:h-10 md:w-11 md:h-11 ";

        if (!day.isCurrentMonth) {
          textCls += "text-gray-300 dark:text-gray-600";
          containerCls += "opacity-30 pointer-events-none";
        } else {
          if (day.isToday) {
            containerCls += "bg-indigo-600 shadow-lg scale-110 ";
            textCls += "text-white ";
          }
          else if (isSelStart || isSelEnd) {
            containerCls += "bg-orange-500 shadow-lg scale-110 z-10 ";
            textCls += "text-white ";
          }
          else if (inRange) {
            containerCls += "bg-orange-100 dark:bg-orange-900/40 ";
            textCls += "text-orange-600 dark:text-orange-300 ";
          }
          else if (day.isWeekend) {
            textCls += "text-red-500 dark:text-red-400 ";
            containerCls += "hover:bg-red-50 dark:hover:bg-red-950/20 ";
          } else {
            textCls += "text-gray-700 dark:text-gray-200 ";
            containerCls += "hover:bg-gray-100 dark:hover:bg-gray-800 ";
          }
        }

        return (
          <div key={i} className="flex justify-center items-center">
            <button onClick={() => onDayClick(day)} className={`${containerCls} ${boxSize}`}>
              <span className={textCls}>{day.date}</span>
              <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 flex gap-1">
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
          <div className="w-full sm:w-[34%] border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-800 flex flex-col bg-white dark:bg-slate-900 overflow-hidden min-h-0">
      {/* Pinned Header */}
      <div className="flex items-center gap-2 p-3 sm:p-4 pb-3 shrink-0 border-b border-gray-50 dark:border-gray-800/50">
        <Notebook size={16} className="text-gray-400" />
        <h3 className="text-xs sm:text-sm font-black text-gray-400 tracking-widest uppercase">Planning & Notes</h3>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 pt-2 space-y-3 min-h-0">
        {rangeStart && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="text-[11px] sm:text-xs font-black text-orange-500 flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-full w-fit">
              <MapPin size={12} fill="currentColor" /> {hasRange ? `Selected Range` : `Focus Day ${rangeStart.date}`}
            </div>

            {/* Selected Notes Display */}
            {selectedNoteEntries.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-3 shadow-sm space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Selected Note</p>
                <div className="flex flex-col gap-3">
                  {selectedNoteEntries.map(({ label, text }, idx) => (
                    <div key={idx} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-3 shadow-sm">
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-1.5">
                        {label}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Festival/Holiday Section */}
            {holidayEvents.length > 0 && (
              <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/15 p-3 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300 mb-3">Festival</p>
                <div className="flex flex-col gap-2">
                  {holidayEvents.map((event) => (
                    <div key={event} className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-100 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      {event}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {hasSingle && mode !== 'single' && (
                <button 
                  onClick={() => setMode('single')} 
                  className="flex-1 text-[10px] sm:text-xs font-bold text-blue-600 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10 px-3 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all active:scale-95"
                >
                  <Plus size={14} /> ADD DAY NOTE
                </button>
              )}

              {hasRange && mode !== 'range' && (
                <button 
                  onClick={() => setMode('range')} 
                  className="flex-1 text-[10px] sm:text-xs font-bold text-blue-600 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10 px-3 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all active:scale-95"
                >
                  <Plus size={14} /> ADD RANGE NOTE
                </button>
              )}
            </div>
          </div>
        )}

        {/* Note Inputs (Single) */}
        {mode === 'single' && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black text-green-600 mb-2 uppercase">New note for Day {rangeStart?.date}</p>
            <textarea 
              autoFocus
              value={singleTxt} 
              onChange={e => setSingleTxt(e.target.value)} 
              className="w-full h-20 bg-transparent text-xs sm:text-sm focus:outline-none resize-none placeholder-green-400" 
              placeholder="What's happening this day?..." 
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setMode('monthly')} className="text-[10px] font-bold text-gray-500 px-3 py-2 rounded-lg hover:bg-white/50">CANCEL</button>
              <button onClick={() => { saveSingle(rangeStart, singleTxt); setMode('monthly'); setSingleTxt(""); }} className="bg-green-600 text-white text-[10px] px-4 py-2 rounded-lg font-bold shadow-md flex items-center gap-1"><Check size={12}/> SAVE</button>
            </div>
          </div>
        )}

        {/* Note Inputs (Range) */}
        {mode === 'range' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black text-blue-600 mb-2 uppercase">Range Memo</p>
            <textarea 
              autoFocus
              value={rangeTxt} 
              onChange={e => setRangeTxt(e.target.value)} 
              className="w-full h-20 bg-transparent text-xs sm:text-sm focus:outline-none resize-none placeholder-blue-400" 
              placeholder="Describe this period..." 
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setMode('monthly')} className="text-[10px] font-bold text-gray-500 px-3 py-2 rounded-lg hover:bg-white/50">CANCEL</button>
              <button onClick={() => { saveRange(rangeStart, rangeEnd, rangeTxt); setMode('monthly'); setRangeTxt(""); }} className="bg-blue-600 text-white text-[10px] px-4 py-2 rounded-lg font-bold shadow-md flex items-center gap-1"><Check size={12}/> SAVE</button>
            </div>
          </div>
        )}

        {/* Monthly Scratchpad (Integrated into scroll) */}
          <div className="relative w-full pt-2 min-h-[150px]">
            <div className="flex items-center gap-2 mb-2">
             <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
             <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Monthly Scratchpad</span>
             <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
           </div>
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-0 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <textarea
              value={note}
              onChange={e => onNoteChange(e.target.value)}
              placeholder={`Write monthly reminders here...`}
              className="w-full min-h-[180px] p-3 bg-transparent text-sm sm:text-base text-gray-600 dark:text-gray-300 focus:outline-none resize-none leading-[24px]"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
                backgroundSize: '100% 24px',
                backgroundAttachment: 'local'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const LayeredPageStack = ({ children, isAnimating, direction, isMobile }) => (
  <div className={`relative w-full ${isMobile ? 'h-full max-h-[95vh]' : 'h-full'} flex flex-col perspective-1000 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300 border border-white/20 min-h-0`}>
    <div className={`w-full flex-1 flex flex-col transition-all duration-700 transform-gpu ease-in-out min-h-0 ${isAnimating ? (direction === 'forward' ? '-rotate-x-12 -translate-y-8 scale-95 opacity-40' : 'rotate-x-12 translate-y-8 scale-95 opacity-40') : 'rotate-x-0'}`}>
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
    
    // Play the unique flip sound effect
    playFlipSound();
    
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
    <div className={`${isDark ? 'dark' : ''} h-screen w-screen flex items-center justify-center p-4 sm:p-12 transition-colors duration-500 overflow-hidden`}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); }
        .perspective-1000 { perspective: 1800px; }
        .rotate-x-12 { transform: rotateX(12deg); }
        .-rotate-x-12 { transform: rotateX(-12deg); }
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
      <div className="relative w-full h-full max-w-[940px] flex flex-col items-center justify-center min-h-0">
        
        {/* HANGER Decoration (Hidden on mobile) */}
        <div className="hidden sm:flex absolute top-20 flex-col items-center z-20">
          <div className="brass-peg w-8 h-8 rounded-full z-30 flex items-center justify-center border border-yellow-600/30 shadow-md">
            <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
          </div>
          <div className="relative -mt-1">
            <div className="leather-strap w-12 h-20 rounded-t-lg flex justify-between px-3 pt-4">
              <div className="h-full border-l border-dashed border-white/20 opacity-40" />
              <div className="h-full border-r border-dashed border-white/20 opacity-40" />
            </div>
            <div className="absolute inset-0 bg-black/20 blur-md -z-10 translate-y-1 translate-x-1" />
          </div>
        </div>

        {/* Calendar Card Area */}
        <div className="w-full flex-1 max-h-[640px] flex flex-col sm:flex-row items-center gap-3 sm:gap-5 relative min-h-0">
          
          {/* Navigation - Left */}
          <button onClick={() => navigate(-1)} className="hidden sm:flex p-5 rounded-full bg-white shadow-xl hover:scale-110 active:scale-95 transition-all text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 shrink-0">
            <ChevronLeft size={32} />
          </button>

          {/* Core App Container */}
          <div className="w-full h-full relative flex flex-col min-h-0 max-w-[940px]">
            <BindingBar />
            <LayeredPageStack isAnimating={isAnimating} direction={flipDir} isMobile={false}>
              <CalendarHero month={month} year={year} color={MONTH_COLORS[month]} />
              
              {/* Main Content Split: Grid (Main) + Notes (Side) */}
              <div className="flex-1 min-h-0 flex flex-col sm:flex-row overflow-hidden bg-transparent transition-colors duration-500">
                {/* MOBILE: Grid (top), Notes (bottom)
                    DESKTOP: Grid (left), Notes (right)
                */}
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

          {/* Navigation - Right */}
          <button onClick={() => navigate(1)} className="hidden sm:flex p-5 rounded-full bg-white shadow-xl hover:scale-110 active:scale-95 transition-all text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 shrink-0">
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Mobile Controls & Theme Toggle */}
        <div className="w-full flex items-center justify-between mt-6 px-4 shrink-0">
          <div className="flex sm:hidden gap-3">
             <button onClick={() => navigate(-1)} className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-md border dark:border-slate-700"><ChevronLeft size={24} /></button>
             <button onClick={() => navigate(1)} className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-md border dark:border-slate-700"><ChevronRight size={24} /></button>
          </div>

          <button onClick={() => setIsDark(!isDark)} className="p-4 rounded-full bg-white shadow-xl hover:rotate-12 transition-transform text-gray-800 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 ml-auto">
            {isDark ? <Sun size={24} className="text-yellow-500" /> : <Moon size={24} className="text-blue-500" />}
          </button>
        </div>
      </div>
    </div>
  );
}