"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, Dumbbell } from "lucide-react";
import { QuickCompleteButton } from "@/components/portal/dagbok/quick-complete-button";
import { format, addDays, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";

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

const THEME = {
  navy: "#0F2950",
  gold: "#B8975C",
  text: "#02060D",
  textSecondary: "#64748B",
  textTertiary: "#9CA3AF",
  bg: "#FFFFFF",
  bgSubtle: "#FAFBFC",
  border: "#EBE5DA",
  blue: "#3B82F6",
  green: "#22C55E",
  orange: "#F97316",
  purple: "#8B5CF6",
};

const focusColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  range: { 
    bg: "#EFF6FF", 
    border: "#BFDBFE", 
    text: "#1E40AF",
    icon: "#3B82F6"
  },
  naerspill: {
    bg: "#FFFBEB",
    border: "#FDE68A",
    text: "#92400E",
    icon: "#B8975C"
  },
  putting: { 
    bg: "#F0FDF4", 
    border: "#BBF7D0", 
    text: "#166534",
    icon: "#22C55E"
  },
  bane: { 
    bg: "#FAF5FF", 
    border: "#E9D5FF", 
    text: "#6B21A8",
    icon: "#8B5CF6"
  },
  styrke: { 
    bg: "#FFF7ED", 
    border: "#FED7AA", 
    text: "#9A3412",
    icon: "#F97316"
  },
  restitusjon: { 
    bg: "#F3F4F6", 
    border: "#D1D5DB", 
    text: "#4B5563",
    icon: "#9CA3AF"
  },
};

const DAY_NAMES = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const FULL_DAY_NAMES = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

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
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
            style={{ 
              background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.gold})`,
              color: "#FFFFFF",
            }}
          >
            {week.weekNumber}
          </div>
          <div>
            <h3 
              className="font-semibold text-lg"
              style={{ color: THEME.navy }}
            >
              Uke {week.weekNumber}
            </h3>
            {week.focus && (
              <p style={{ color: THEME.textSecondary }}>{week.focus}</p>
            )}
          </div>
        </div>
        {week.volumeLabel && (
          <span 
            className="text-sm px-4 py-2 rounded-full font-medium"
            style={{ 
              background: THEME.bgSubtle,
              color: THEME.textSecondary,
              border: `1px solid ${THEME.border}`,
            }}
          >
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
                className="text-center py-3 rounded-xl mb-3"
                style={{
                  background: isToday ? `${THEME.gold}15` : "transparent",
                  border: isToday ? `1px solid ${THEME.gold}40` : "1px solid transparent",
                }}
              >
                <p 
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: isToday ? THEME.gold : THEME.textTertiary }}
                >
                  {dayName}
                </p>
                <p 
                  className="text-xl font-semibold mt-1"
                  style={{ color: isToday ? THEME.navy : THEME.text }}
                >
                  {dateNum}
                </p>
              </div>

              {/* Sessions for this day */}
              <div className="flex flex-col gap-2 min-h-[100px]">
                {sessions.length === 0 ? (
                  <div 
                    className="flex-1 rounded-xl flex items-center justify-center min-h-[80px]"
                    style={{ 
                      background: THEME.bgSubtle,
                      border: `1px dashed ${THEME.border}`,
                    }}
                  >
                    <span style={{ color: THEME.textTertiary }}>–</span>
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
                          background: isLogged ? "#F0FDF4" : focusStyle.bg,
                          border: `1px solid ${isLogged ? "#BBF7D0" : focusStyle.border}`,
                        }}
                      >
                        {/* Focus area badge */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <Dumbbell className="w-3 h-3" style={{ color: isLogged ? THEME.green : focusStyle.icon }} />
                          <span 
                            className="text-[10px] font-medium uppercase tracking-wide"
                            style={{ color: isLogged ? THEME.green : focusStyle.text }}
                          >
                            {s.focusArea || "Trening"}
                          </span>
                        </div>

                        {/* Title */}
                        <p 
                          className="text-xs font-semibold leading-tight mb-2"
                          style={{ color: THEME.text }}
                        >
                          {s.title}
                        </p>

                        {/* Duration */}
                        {s.durationMinutes && (
                          <p 
                            className="text-[10px] flex items-center gap-1 mb-2"
                            style={{ color: THEME.textSecondary }}
                          >
                            <Clock className="w-3 h-3" />
                            {s.durationMinutes} min
                          </p>
                        )}

                        {/* Complete button or logged indicator */}
                        {showCompleteButton && (
                          <div className="mt-2">
                            {isLogged ? (
                              <div 
                                className="flex items-center gap-1.5 text-[10px] font-medium"
                                style={{ color: THEME.green }}
                              >
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
