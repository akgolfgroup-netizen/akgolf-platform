"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar, HGCapacityBar } from "@/components/portal/mission-control";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { nb } from "date-fns/locale";

const viewModes = [
  { label: "Måned", value: "month", icon: Grid3X3 },
  { label: "Uke", value: "week", icon: CalendarIcon },
  { label: "Dag", value: "day", icon: List },
];

// Mock events
const mockEvents = [
  { id: "1", title: "Privat Coaching - Olav", date: new Date(), time: "10:00", duration: 50, type: "coaching", coach: "Anders" },
  { id: "2", title: "Videoanalyse - Mari", date: new Date(), time: "11:00", duration: 50, type: "analysis", coach: "Anders" },
  { id: "3", title: "Junior Trening", date: new Date(), time: "14:00", duration: 60, type: "junior", coach: "Maria" },
  { id: "4", title: "Gruppetrening", date: addDays(new Date(), 1), time: "16:00", duration: 90, type: "group", coach: "Anders" },
  { id: "5", title: "Ferie - Anders", date: addDays(new Date(), 3), time: "09:00", duration: 480, type: "blocked", coach: null },
];

const eventTypeStyles = {
  coaching: "bg-[var(--hg-primary-glow)] border-[var(--hg-primary)] text-[var(--hg-primary)]",
  analysis: "bg-[var(--hg-info-bg)] border-[var(--hg-info)] text-[var(--hg-info)]",
  junior: "bg-[var(--hg-success-bg)] border-[var(--hg-success)] text-[var(--hg-success)]",
  group: "bg-[var(--hg-warning-bg)] border-[var(--hg-warning)] text-[var(--hg-warning)]",
  blocked: "bg-[var(--hg-surface-raised)] border-[var(--hg-border)] text-[var(--hg-text-muted)] opacity-60",
};

export default function CalendarPage() {
  const { toggle } = useMCSidebar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter((e) => isSameDay(e.date, date));
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <>
      <MCTopbar
        title="Kalender"
        subtitle="Full oversikt over alle bookinger og hendelser"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Controls */}
        <div className="hg-card p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-[var(--hg-text)] min-w-[150px] text-center">
                {format(currentDate, "MMMM yyyy", { locale: nb })}
              </h2>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="ml-2 hg-btn hg-btn-secondary text-xs"
              >
                I dag
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="hg-tabs">
                {viewModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.value}
                      onClick={() => setViewMode(mode.value)}
                      className={cn(
                        "hg-tab flex items-center gap-1.5",
                        viewMode === mode.value && "active"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <button className="hg-btn hg-btn-secondary">
                <Filter className="w-4 h-4" />
              </button>
              <button className="hg-btn hg-btn-primary">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ny</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Main Calendar */}
          <div className="lg:col-span-3 hg-card overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-[var(--hg-border)]">
              {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((day) => (
                <div
                  key={day}
                  className="px-3 py-2 text-center text-xs font-semibold text-[var(--hg-text-muted)] uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 auto-rows-fr">
              {days.map((date, i) => {
                const events = getEventsForDate(date);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isToday = isSameDay(date, new Date());
                const isSelected = selectedDate && isSameDay(date, selectedDate);

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "min-h-[100px] p-2 border-b border-r border-[var(--hg-border-subtle)] text-left transition-colors",
                      !isCurrentMonth && "bg-[var(--hg-surface-sunken)] opacity-50",
                      isToday && "bg-[var(--hg-primary-glow)]",
                      isSelected && "ring-2 ring-[var(--hg-primary)] ring-inset",
                      "hover:bg-[var(--hg-surface-raised)]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                          isToday
                            ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
                            : "text-[var(--hg-text)]"
                        )}
                      >
                        {format(date, "d")}
                      </span>
                      {events.length > 0 && (
                        <span className="text-[10px] text-[var(--hg-text-muted)]">
                          {events.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "px-1.5 py-0.5 text-[10px] rounded border truncate",
                            eventTypeStyles[event.type as keyof typeof eventTypeStyles]
                          )}
                        >
                          {event.time} {event.title}
                        </div>
                      ))}
                      {events.length > 3 && (
                        <div className="text-[10px] text-[var(--hg-text-muted)] pl-1">
                          +{events.length - 3} flere
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Selected Date Details */}
            <div className="hg-card p-4">
              <h3 className="hg-section-title mb-3">
                {selectedDate
                  ? format(selectedDate, "EEEE d. MMMM", { locale: nb })
                  : "Velg en dato"}
              </h3>
              {selectedDateEvents.length === 0 ? (
                <div className="py-8 text-center">
                  <CalendarIcon className="w-10 h-10 text-[var(--hg-text-muted)] mx-auto mb-2 opacity-50" />
                  <span className="text-sm text-[var(--hg-text-muted)]">
                    Ingen hendelser
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        eventTypeStyles[event.type as keyof typeof eventTypeStyles]
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{event.time}</span>
                      </div>
                      <div className="text-sm font-medium">{event.title}</div>
                      {event.coach && (
                        <div className="text-xs opacity-70 mt-1">Med {event.coach}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <button className="w-full mt-3 hg-btn hg-btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Legg til hendelse
              </button>
            </div>

            {/* Legend */}
            <div className="hg-card p-4">
              <h3 className="hg-section-title mb-3">Type</h3>
              <div className="space-y-2">
                {Object.entries(eventTypeStyles).map(([type, style]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded border", style)} />
                    <span className="text-sm text-[var(--hg-text-secondary)] capitalize">
                      {type === "coaching" && "Coaching"}
                      {type === "analysis" && "Analyse"}
                      {type === "junior" && "Junior"}
                      {type === "group" && "Gruppe"}
                      {type === "blocked" && "Blokkert"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity */}
            <div className="hg-card p-4">
              <h3 className="hg-section-title mb-3">Kapasitet</h3>
              <HGCapacityBar
                current={6}
                max={8}
                label="I dag"
                size="sm"
              />
              <HGCapacityBar
                current={28}
                max={40}
                label="Denne uken"
                size="sm"
                className="mt-3"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
