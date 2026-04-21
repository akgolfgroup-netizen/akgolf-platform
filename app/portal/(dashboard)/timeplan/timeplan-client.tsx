"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/portal/utils/cn";
import { format, addWeeks, startOfWeek, addDays } from "date-fns";
import { nb } from "date-fns/locale";

const DAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00–21:00

interface TimeplanEvent {
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
}

function eventColor(type: TimeplanEvent["type"]) {
  switch (type) {
    case "booking":
      return {
        bg: "bg-blue-500/15",
        border: "border-blue-500/30",
        text: "text-blue-400",
        dot: "bg-blue-400",
      };
    case "group":
      return {
        bg: "bg-purple-500/15",
        border: "border-purple-500/30",
        text: "text-purple-400",
        dot: "bg-purple-400",
      };
    case "training":
    default:
      return {
        bg: "bg-green-500/15",
        border: "border-green-500/30",
        text: "text-green-400",
        dot: "bg-green-400",
      };
  }
}

export function TimeplanClient({ weekOffset, events }: TimeplanClientProps) {
  const [currentOffset, setCurrentOffset] = useState(weekOffset);

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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-2">
        <div className="flex items-center gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary/50">
              Uke {weekNumber}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              Min timeplan
            </h1>
          </div>
          <div className="hidden h-10 w-px bg-outline-variant sm:block" />
          <div className="hidden items-center gap-2 rounded-full bg-surface-container px-3 py-1 sm:flex">
            <button
              onClick={() => setCurrentOffset((o) => o - 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-container-high"
            >
              <Icon name="chevron_left" size={16} className="text-primary" />
            </button>
            <span className="font-mono text-[11px] uppercase tracking-tighter text-on-surface-variant">
              {weekLabel}
            </span>
            <button
              onClick={() => setCurrentOffset((o) => o + 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-container-high"
            >
              <Icon name="chevron_right" size={16} className="text-primary" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Booking
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Treningsøkt
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Gruppe
          </span>
        </div>
      </header>

      {/* Kalender-grid */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="min-w-[800px] rounded-3xl border border-outline-variant/10 bg-surface-container-lowest">
          {/* Dagerad */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-outline-variant/10">
            <div className="border-r border-outline-variant/10" />
            {DAYS.map((dayName, i) => {
              const d = weekDates[i];
              const isToday = isCurrentWeek && d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
              return (
                <div
                  key={dayName}
                  className={cn(
                    "p-3 text-center border-r border-outline-variant/10 last:border-r-0",
                    isToday && "bg-primary/5"
                  )}
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {dayName}
                  </span>
                  <span
                    className={cn(
                      "ml-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold",
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
              className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-outline-variant/5"
            >
              <div className="flex items-start justify-end border-r border-outline-variant/10 pr-2 pt-1">
                <span className="font-mono text-[10px] uppercase tracking-tight text-on-surface-variant">
                  {String(h).padStart(2, "0")}:00
                </span>
              </div>
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const key = `${dayIndex}-${h}`;
                const slotEvents = eventMap.get(key) ?? [];
                return (
                  <div
                    key={dayIndex}
                    className="relative h-14 border-r border-outline-variant/5 last:border-r-0"
                  >
                    {slotEvents.map((ev) => {
                      const colors = eventColor(ev.type);
                      const Wrapper = ev.href ? Link : "div";
                      return (
                        <Wrapper
                          key={ev.id}
                          href={ev.href ?? "#"}
                          className={cn(
                            "absolute inset-1 rounded-lg px-2 py-1 text-[10px] font-bold leading-tight shadow-sm border",
                            colors.bg,
                            colors.border,
                            colors.text,
                            ev.href && "cursor-pointer hover:opacity-80 transition-opacity"
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
                        </Wrapper>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
