"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, Dumbbell } from "lucide-react";
import { QuickCompleteButton } from "@/components/portal/dagbok/quick-complete-button";
import { format } from "date-fns";

interface TrainingSession {
  id: string;
  dayOfWeek: number;
  title: string;
  description?: string | null;
  durationMinutes?: number | null;
  focusArea?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exercises: any;
}

interface TrainingWeek {
  id: string;
  weekNumber: number;
  weekStart: Date;
  focus?: string | null;
  volumeLabel?: string | null;
  sessions: TrainingSession[];
}

// Mørkt tema farger for fokusområder
const focusColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  range: {
    bg: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.4)",
    text: "#93C5FD",
    icon: "#38BDF8"
  },
  naerspill: {
    bg: "var(--color-grey-200)",
    border: "var(--color-grey-200)",
    text: "#E8D4B0",
    icon: "#B07D4F"
  },
  putting: {
    bg: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.4)",
    text: "#86EFAC",
    icon: "#10B981"
  },
  bane: {
    bg: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.4)",
    text: "#C4B5FD",
    icon: "#8B5CF6"
  },
  styrke: {
    bg: "rgba(249,115,22,0.15)",
    border: "rgba(249,115,22,0.4)",
    text: "#FDBA74",
    icon: "#F97316"
  },
  restitusjon: {
    bg: "rgba(156,163,175,0.15)",
    border: "rgba(156,163,175,0.4)",
    text: "#D1D5DB",
    icon: "#9CA3AF"
  },
};

const DAY_NAMES = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

function getFocusStyle(focusArea?: string | null) {
  if (!focusArea) return focusColors.range;
  const key = focusArea.toLowerCase();
  return focusColors[key] ?? focusColors.range;
}

function getSessionDate(weekStart: Date, dayOfWeek: number): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + (dayOfWeek - 1));
  return format(d, "yyyy-MM-dd");
}

function getDateForDay(weekStart: Date, dayOfWeek: number): Date {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + (dayOfWeek - 1));
  return d;
}

interface WeekViewProps {
  week: TrainingWeek;
  loggedSessionIds?: string[];
  showCompleteButton?: boolean;
}

export function WeekView({
  week,
  loggedSessionIds = [],
  showCompleteButton = false,
}: WeekViewProps) {
  const sessionsByDay = new Map<number, TrainingSession[]>();
  for (const s of week.sessions) {
    if (!sessionsByDay.has(s.dayOfWeek)) sessionsByDay.set(s.dayOfWeek, []);
    sessionsByDay.get(s.dayOfWeek)!.push(s);
  }

  const today = new Date();
  const weekStart = new Date(week.weekStart);

  return (
    <div>
      {/* Week Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg bg-[var(--color-grey-900)] text-white">
            {week.weekNumber}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-[var(--color-grey-900)]">
              Uke {week.weekNumber}
            </h3>
            {week.focus && (
              <p className="text-[var(--color-grey-500)]">{week.focus}</p>
            )}
          </div>
        </div>
        {week.volumeLabel && (
          <span className="text-sm px-4 py-2 rounded-full font-medium bg-[var(--color-grey-100)] text-[var(--color-grey-500)] border border-[var(--color-grey-200)]">
            {week.volumeLabel}
          </span>
        )}
      </div>

      {/* Calendar Grid - Days as columns */}
      <div className="grid grid-cols-7 gap-3">
        {[1, 2, 3, 4, 5, 6, 7].map((day) => {
          const sessions = sessionsByDay.get(day) ?? [];
          const date = getDateForDay(weekStart, day);
          const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
          const dayName = DAY_NAMES[day - 1];
          const dateNum = format(date, "d");

          return (
            <div key={day} className="flex flex-col">
              {/* Day Header */}
              <div
                className={`text-center py-3 rounded-xl mb-3 ${
                  isToday
                    ? "bg-[var(--color-grey-100)] border border-[var(--color-grey-200)]"
                    : "bg-transparent border border-transparent"
                }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${
                    isToday ? "text-[var(--color-grey-900)]" : "text-[var(--color-grey-400)]"
                  }`}
                >
                  {dayName}
                </p>
                <p
                  className={`text-xl font-semibold mt-1 ${
                    isToday ? "text-[var(--color-grey-900)]" : "text-[var(--color-grey-900)]"
                  }`}
                >
                  {dateNum}
                </p>
              </div>

              {/* Sessions for this day */}
              <div className="flex flex-col gap-2 min-h-[100px]">
                {sessions.length === 0 ? (
                  <div className="flex-1 rounded-xl flex items-center justify-center min-h-[80px] bg-transparent border border-dashed border-[var(--color-grey-200)]">
                    <span className="text-[var(--color-grey-400)]">–</span>
                  </div>
                ) : (
                  sessions.map((s) => {
                    const focusStyle = getFocusStyle(s.focusArea);
                    const isLogged = loggedSessionIds.includes(s.id);

                    return (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="rounded-xl p-3 cursor-default transition-shadow hover:shadow-md"
                        style={{
                          background: isLogged ? "rgba(34,197,94,0.15)" : focusStyle.bg,
                          border: `1px solid ${isLogged ? "rgba(34,197,94,0.4)" : focusStyle.border}`,
                        }}
                      >
                        {/* Focus area badge */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <Dumbbell className="w-3 h-3" style={{ color: isLogged ? "#10B981" : focusStyle.icon }} />
                          <span
                            className="text-[10px] font-medium uppercase tracking-wide"
                            style={{ color: isLogged ? "#86EFAC" : focusStyle.text }}
                          >
                            {s.focusArea || "Trening"}
                          </span>
                        </div>

                        {/* Title */}
                        <p className="text-xs font-semibold leading-tight mb-2 text-[var(--color-grey-900)]">
                          {s.title}
                        </p>

                        {/* Duration */}
                        {s.durationMinutes && (
                          <p className="text-[10px] flex items-center gap-1 mb-2 text-[var(--color-grey-500)]">
                            <Clock className="w-3 h-3" />
                            {s.durationMinutes} min
                          </p>
                        )}

                        {/* Complete button or logged indicator */}
                        {showCompleteButton && (
                          <div className="mt-2">
                            {isLogged ? (
                              <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#10B981]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Fullført
                              </div>
                            ) : (
                              <QuickCompleteButton
                                sessionId={s.id}
                                sessionDate={getSessionDate(week.weekStart, s.dayOfWeek)}
                                focusArea={s.focusArea}
                                durationMinutes={s.durationMinutes}
                                isLogged={false}
                              />
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
