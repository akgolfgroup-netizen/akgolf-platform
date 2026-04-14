"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Play,
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";
import { format, addWeeks, startOfISOWeek, endOfISOWeek, addDays } from "date-fns";
import { nb } from "date-fns/locale";

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

interface V2ExerciseData {
  id: string;
  name: string;
  pyramid: string;
  area: string;
  lPhase: string | null;
  cs: string | null;
  m: string | null;
  pr: string | null;
  pFrom: string | null;
  pTo: string | null;
  slagFocus: string[];
  baller: number;
  bevegelser: number;
}

interface V2Event {
  id: string;
  date: string;
  startH: number;
  startM: number;
  dur: number;
  title: string;
  focus: string;
  exercises: V2ExerciseData[];
  done: boolean;
}

interface TrainingPlanViewerProps {
  events: V2Event[];
  weekOffset: number;
  planId: string | null;
}

const DAY_NAMES = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

const pyramidConfig: Record<string, { label: string; color: string; bg: string }> = {
  FYS: { label: "Fysisk", color: "#C48A32", bg: "#FDF4E4" },
  TEK: { label: "Teknikk", color: "#007AFF", bg: "#EFF6FF" },
  SLAG: { label: "Slag", color: "#005840", bg: "#ECF0EF" },
  SPILL: { label: "Spill", color: "#AF52DE", bg: "#FAF5FF" },
  TURN: { label: "Turnering", color: "#324D45", bg: "#ECF0EF" },
};

export function TrainingPlanViewer({ events, weekOffset, planId }: TrainingPlanViewerProps) {
  const now = new Date();
  const targetWeek = addWeeks(now, weekOffset);
  const weekStart = startOfISOWeek(targetWeek);
  const weekEnd = endOfISOWeek(targetWeek);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayEvents = events.filter((e) => e.date === dateStr);
      return {
        date,
        dateStr,
        dayName: DAY_NAMES[i],
        isToday: format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd"),
        events: dayEvents,
      };
    });
  }, [events, weekStart, now]);

  const weekRange = `${format(weekStart, "d. MMMM", { locale: nb })} – ${format(
    weekEnd,
    "d. MMMM",
    { locale: nb }
  )}`;

  const planned = events.length;
  const completed = events.filter((e) => e.done).length;
  const percentage = planned > 0 ? Math.round((completed / planned) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_APPLE }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A8C85] mb-2">
            Ukevisning
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#0A1F18]">Treningsplan</h1>
          <p className="text-sm text-[#324D45] mt-1">{weekRange}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-full bg-white border border-[#D5DFDB]">
            <Link
              href={`/portal/treningsplan?view=viewer&week=${weekOffset - 1}`}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#7A8C85] hover:text-[#0A1F18] hover:bg-[#F5F8F7] transition-colors"
              aria-label="Forrige uke"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            {weekOffset !== 0 && (
              <Link
                href="/portal/treningsplan?view=viewer"
                className="h-9 px-3 rounded-full text-xs font-semibold text-[#0A1F18] hover:bg-[#F5F8F7] transition-colors inline-flex items-center"
              >
                I dag
              </Link>
            )}
            <Link
              href={`/portal/treningsplan?view=viewer&week=${weekOffset + 1}`}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#7A8C85] hover:text-[#0A1F18] hover:bg-[#F5F8F7] transition-colors"
              aria-label="Neste uke"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/portal/treningsplan">Kalender</Link>
          </Button>
        </div>
      </motion.div>

      {/* Progress summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: EASE_APPLE }}
      >
        <PremiumCard padding="md" radius="large">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85] mb-1">
                Fremgang denne uken
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#0A1F18] tabular-nums">{completed}</span>
                <span className="text-lg font-semibold text-[#7A8C85] tabular-nums">/ {planned}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-[#D5DFDB]/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0A1F18] transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[#7A8C85]">
                  {planned === 0
                    ? "Ingen økter planlagt"
                    : completed === planned
                    ? "Alle økter fullført!"
                    : `${planned - completed} økter gjenstår`}
                </span>
                {completed > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-[#1A4D36]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {percentage}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Weekly calendar */}
      <div className="space-y-4">
        {weekDays.map((day, idx) => (
          <motion.div
            key={day.dateStr}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: EASE_APPLE }}
          >
            <PremiumCard padding="md" radius="large" noHover>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    day.isToday
                      ? "bg-[#0A1F18] text-white"
                      : "bg-[#F5F8F7] text-[#0A1F18]"
                  }`}
                >
                  {format(day.date, "d", { locale: nb })}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0A1F18]">{day.dayName}</p>
                  <p className="text-xs text-[#7A8C85]">
                    {day.events.length > 0
                      ? `${day.events.length} økt${day.events.length > 1 ? "er" : ""}`
                      : "Ingen økter"}
                  </p>
                </div>
              </div>

              {day.events.length > 0 && (
                <div className="space-y-3">
                  {day.events.map((event) => {
                    const cfg = pyramidConfig[event.focus] ?? pyramidConfig.TEK;
                    return (
                      <div
                        key={event.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-[#F5F8F7]/60"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: cfg.bg }}
                          >
                            <Dumbbell className="w-5 h-5" style={{ color: cfg.color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-[#0A1F18]">
                                {event.title}
                              </p>
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                style={{ background: cfg.bg, color: cfg.color }}
                              >
                                {cfg.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-[#7A8C85]">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {String(event.startH).padStart(2, "0")}:
                                {String(event.startM).padStart(2, "0")} — {event.dur} min
                              </span>
                              {event.done && (
                                <span className="text-[#1A4D36] font-medium">Fullført</span>
                              )}
                            </div>
                            {event.exercises.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {event.exercises.map((ex) => (
                                  <li key={ex.id} className="text-xs text-[#324D45]">
                                    • {ex.name}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" size="sm" asChild>
                            <Link href={`/portal/treningsplan/${event.id}`}>
                              <Play className="w-3.5 h-3.5 mr-1" />
                              Start
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </PremiumCard>
          </motion.div>
        ))}
      </div>

      {/* DECADE integration hint */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: EASE_APPLE }}
      >
        <PremiumCard variant="accent" padding="md" radius="large">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#0A1F18] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#0A1F18]">Tips fra AI Coach</p>
              <p className="text-sm text-[#324D45] mt-0.5">
                For SPILL-økter: bruk{" "}
                <Link href="/portal/strategi" className="underline font-medium text-[#0A1F18]">
                  DECADE-strategien
                </Link>{" "}
                før runden for å forberede hull-for-hull plan.
              </p>
            </div>
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
}
