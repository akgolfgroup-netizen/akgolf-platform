"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/portal/utils/cn";
import { format, addWeeks, startOfWeek, addDays } from "date-fns";
import { nb } from "date-fns/locale";

const DAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const DAYS_FULL = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00–21:00

export interface TimeplanEvent {
  id: string;
  title: string;
  dayOfWeek: number; // 0=Mon, 6=Sun
  startH: number;
  startM: number;
  duration: number;
  type: "booking" | "training" | "group";
  subtitle?: string;
  href?: string;
}

interface TimeplanClientProps {
  weekOffset: number;
  events: TimeplanEvent[];
  stats: {
    bookingCount: number;
    trainingCount: number;
    groupCount: number;
    totalHours: number;
  };
  onCreateSession?: (data: {
    weekOffset: number;
    dayOfWeek: number;
    title: string;
    durationMinutes: number;
    startH: number;
    startM: number;
    focusArea?: string;
  }) => Promise<{ success: boolean; sessionId?: string }>;
}

function eventColor(type: TimeplanEvent["type"]) {
  switch (type) {
    case "booking":
      return {
        bg: "bg-blue-500/15",
        border: "border-blue-500/30",
        text: "text-blue-500",
        dot: "bg-blue-400",
        hover: "hover:bg-blue-500/25",
      };
    case "group":
      return {
        bg: "bg-purple-500/15",
        border: "border-purple-500/30",
        text: "text-purple-500",
        dot: "bg-purple-400",
        hover: "hover:bg-purple-500/25",
      };
    case "training":
    default:
      return {
        bg: "bg-green-500/15",
        border: "border-green-500/30",
        text: "text-green-600",
        dot: "bg-green-400",
        hover: "hover:bg-green-500/25",
      };
  }
}

export function TimeplanClient({ weekOffset, events, stats, onCreateSession }: TimeplanClientProps) {
  const router = useRouter();
  const [currentOffset, setCurrentOffset] = useState(weekOffset);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [activeDayMobile, setActiveDayMobile] = useState<number | null>(null);

  const baseMonday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentMonday = addWeeks(baseMonday, currentOffset);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentMonday, i));
  const weekLabel = `${format(weekDates[0], "d.", { locale: nb })}–${format(weekDates[6], "d. MMMM", { locale: nb })}`;
  const weekNumber = format(currentMonday, "I");

  const eventMap = new Map<string, TimeplanEvent[]>();
  for (const ev of events) {
    const key = `${ev.dayOfWeek}-${ev.startH}`;
    const existing = eventMap.get(key) ?? [];
    existing.push(ev);
    eventMap.set(key, existing);
  }

  const today = new Date();
  const isCurrentWeek = currentOffset === 0;

  const handleWeekNav = useCallback(
    (dir: number) => {
      const newOffset = currentOffset + dir;
      setCurrentOffset(newOffset);
      router.push(`/portal/timeplan?week=${newOffset}`);
    },
    [currentOffset, router]
  );

  const handleCreateTraining = useCallback(
    async (dayIndex: number, hour: number) => {
      if (!onCreateSession) return;
      await onCreateSession({
        weekOffset: currentOffset,
        dayOfWeek: dayIndex + 1,
        title: "Egenøkt",
        durationMinutes: 60,
        startH: hour,
        startM: 0,
        focusArea: "TEK",
      });
      router.refresh();
    },
    [onCreateSession, currentOffset, router]
  );

  // Mobile: show only active day or all days with horizontal scroll
  const showMobileDayView = activeDayMobile !== null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* ─── Header ─── */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-4 pt-5 pb-2 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary/50">
              Uke {weekNumber}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
              Min timeplan
            </h1>
          </div>
          <div className="hidden h-10 w-px bg-outline-variant sm:block" />
          <div className="hidden items-center gap-2 rounded-full bg-surface-container px-3 py-1 sm:flex">
            <button
              onClick={() => handleWeekNav(-1)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-container-high"
            >
              <Icon name="chevron_left" size={16} className="text-primary" />
            </button>
            <span className="font-mono text-[11px] uppercase tracking-tighter text-on-surface-variant">
              {weekLabel}
            </span>
            <button
              onClick={() => handleWeekNav(1)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-container-high"
            >
              <Icon name="chevron_right" size={16} className="text-primary" />
            </button>
          </div>
        </div>

        {/* Mobile week nav */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => handleWeekNav(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container"
          >
            <Icon name="chevron_left" size={16} className="text-primary" />
          </button>
          <span className="font-mono text-[10px] uppercase text-on-surface-variant">
            {weekLabel}
          </span>
          <button
            onClick={() => handleWeekNav(1)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container"
          >
            <Icon name="chevron_right" size={16} className="text-primary" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="hidden sm:inline">Booking</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="hidden sm:inline">Treningsøkt</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="hidden sm:inline">Gruppe</span>
          </span>
        </div>
      </header>

      {/* ─── Stats bar ─── */}
      <div className="mx-4 sm:mx-6 mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-3 py-2 text-[11px]">
          <span className="flex items-center gap-1 text-on-surface-variant">
            <Icon name="schedule" size={14} className="text-primary/60" />
            <span className="font-mono font-bold text-primary">{stats.totalHours}t</span>
            <span className="hidden sm:inline">planlagt</span>
          </span>
          <span className="h-3 w-px bg-outline-variant/40" />
          <span className="flex items-center gap-1 text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="font-mono font-bold text-primary">{stats.bookingCount}</span>
            <span className="hidden sm:inline">booking</span>
          </span>
          <span className="h-3 w-px bg-outline-variant/40" />
          <span className="flex items-center gap-1 text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="font-mono font-bold text-primary">{stats.trainingCount}</span>
            <span className="hidden sm:inline">trenings</span>
          </span>
          <span className="h-3 w-px bg-outline-variant/40" />
          <span className="flex items-center gap-1 text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="font-mono font-bold text-primary">{stats.groupCount}</span>
            <span className="hidden sm:inline">gruppe</span>
          </span>
        </div>

        {isCurrentWeek && stats.totalHours === 0 && (
          <div className="flex items-center gap-2 rounded-2xl bg-secondary-fixed/15 px-3 py-2 text-[11px] text-on-secondary-fixed">
            <Icon name="lightbulb" size={14} />
            <span>Ingen aktiviteter denne uken.</span>
            <Link
              href="/portal/bookinger/ny"
              className="font-bold underline underline-offset-2 hover:no-underline"
            >
              Book en time
            </Link>
            <span>eller</span>
            <Link
              href="/portal/treningsplan"
              className="font-bold underline underline-offset-2 hover:no-underline"
            >
              legg til økt
            </Link>
          </div>
        )}
      </div>

      {/* ─── Mobile day selector ─── */}
      <div className="mx-4 mb-2 flex gap-1 overflow-x-auto pb-1 sm:hidden">
        <button
          onClick={() => setActiveDayMobile(null)}
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-[10px] font-bold transition-colors",
            activeDayMobile === null
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant"
          )}
        >
          Hele uken
        </button>
        {DAYS.map((dayName, i) => {
          const d = weekDates[i];
          const isToday = isCurrentWeek && d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
          return (
            <button
              key={dayName}
              onClick={() => setActiveDayMobile(i)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[10px] font-bold transition-colors",
                activeDayMobile === i
                  ? "bg-primary text-on-primary"
                  : isToday
                    ? "bg-secondary-fixed text-on-secondary-fixed"
                    : "bg-surface-container text-on-surface-variant"
              )}
            >
              {dayName} {format(d, "d.")}
            </button>
          );
        })}
      </div>

      {/* ─── Kalender-grid ─── */}
      <div className="flex-1 overflow-auto px-4 pb-6 sm:px-6">
        <div
          className={cn(
            "rounded-3xl border border-outline-variant/10 bg-surface-container-lowest",
            !showMobileDayView && "min-w-[800px]"
          )}
        >
          {/* Dagerad */}
          <div
            className={cn(
              "border-b border-outline-variant/10",
              showMobileDayView
                ? "grid grid-cols-[60px_1fr]"
                : "grid grid-cols-[60px_repeat(7,1fr)]"
            )}
          >
            <div className="border-r border-outline-variant/10" />
            {DAYS.map((dayName, i) => {
              if (showMobileDayView && i !== activeDayMobile) return null;
              const d = weekDates[i];
              const isToday = isCurrentWeek && d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
              return (
                <div
                  key={dayName}
                  className={cn(
                    "p-2 sm:p-3 text-center border-r border-outline-variant/10 last:border-r-0",
                    isToday && "bg-primary/5"
                  )}
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {dayName}
                  </span>
                  <span
                    className={cn(
                      "ml-1 sm:ml-2 inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-xs sm:text-sm font-bold",
                      isToday ? "bg-primary text-surface" : "text-primary"
                    )}
                  >
                    {format(d, "d")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Timerader */}
          {HOURS.map((h) => (
            <div
              key={h}
              className={cn(
                "border-b border-outline-variant/5",
                showMobileDayView
                  ? "grid grid-cols-[60px_1fr]"
                  : "grid grid-cols-[60px_repeat(7,1fr)]"
              )}
            >
              <div className="flex items-start justify-end border-r border-outline-variant/10 pr-2 pt-1">
                <span className="font-mono text-[10px] uppercase tracking-tight text-on-surface-variant">
                  {String(h).padStart(2, "0")}:00
                </span>
              </div>
              {Array.from({ length: 7 }, (_, dayIndex) => {
                if (showMobileDayView && dayIndex !== activeDayMobile) return null;
                const key = `${dayIndex}-${h}`;
                const slotEvents = eventMap.get(key) ?? [];
                const isHovered = hoveredSlot === key;
                const hasEvents = slotEvents.length > 0;

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "relative h-14 border-r border-outline-variant/5 last:border-r-0 transition-colors",
                      !hasEvents && "hover:bg-surface-container-low/50"
                    )}
                    onMouseEnter={() => setHoveredSlot(key)}
                    onMouseLeave={() => setHoveredSlot(null)}
                  >
                    {/* Existing events */}
                    {slotEvents.map((ev) => {
                      const colors = eventColor(ev.type);
                      const Wrapper = ev.href ? Link : "div";
                      return (
                        <Wrapper
                          key={ev.id}
                          href={ev.href ?? "#"}
                          className={cn(
                            "absolute inset-1 rounded-lg px-2 py-1 text-[10px] font-bold leading-tight shadow-sm border transition-all",
                            colors.bg,
                            colors.border,
                            colors.text,
                            colors.hover,
                            ev.href && "cursor-pointer"
                          )}
                        >
                          <span className="flex items-center gap-1">
                            <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
                            {ev.title}
                          </span>
                          {ev.subtitle && (
                            <span className="block font-mono text-[9px] opacity-70 truncate">
                              {ev.subtitle}
                            </span>
                          )}
                          <span className="block font-mono text-[9px] opacity-60">
                            {String(ev.startH).padStart(2, "0")}:{String(ev.startM).padStart(2, "0")} · {ev.duration}min
                          </span>
                        </Wrapper>
                      );
                    })}

                    {/* Empty slot actions (hover / mobile tap) */}
                    {!hasEvents && isHovered && (
                      <div className="absolute inset-0 flex items-center justify-center gap-1 z-10">
                        <button
                          onClick={() => router.push("/portal/bookinger/ny")}
                          className="flex items-center gap-1 rounded-md bg-blue-500/90 px-2 py-1 text-[9px] font-bold text-white shadow-sm hover:bg-blue-600 transition-colors"
                          title="Book coaching-time"
                        >
                          <Icon name="calendar_add_on" size={12} />
                          <span className="hidden sm:inline">Book</span>
                        </button>
                        <button
                          onClick={() => handleCreateTraining(dayIndex, h)}
                          className="flex items-center gap-1 rounded-md bg-green-500/90 px-2 py-1 text-[9px] font-bold text-white shadow-sm hover:bg-green-600 transition-colors"
                          title="Legg til egenøkt"
                        >
                          <Icon name="add" size={12} />
                          <span className="hidden sm:inline">Økt</span>
                        </button>
                      </div>
                    )}

                    {/* Mobile: always show tap hint on empty slots in current week */}
                    {!hasEvents && !isHovered && isCurrentWeek && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 sm:opacity-0">
                        <span className="text-[8px] text-on-surface-variant/30">+</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Mobile floating action (when day selected) ─── */}
      {showMobileDayView && (
        <div className="sm:hidden fixed bottom-4 left-4 right-4 flex gap-2 z-50">
          <Link
            href="/portal/bookinger/ny"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-bold text-white shadow-lg"
          >
            <Icon name="calendar_add_on" size={18} />
            Book time
          </Link>
          <button
            onClick={() => {
              // Open training plan to add session
              router.push("/portal/treningsplan");
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-4 py-3 text-sm font-bold text-white shadow-lg"
          >
            <Icon name="fitness_center" size={18} />
            Legg til økt
          </button>
        </div>
      )}
    </div>
  );
}
