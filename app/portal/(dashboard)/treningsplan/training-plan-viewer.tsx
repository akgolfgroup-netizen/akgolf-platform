"use client";


import { Icon } from "@/components/ui/icon";
import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { Button } from "@/components/ui/button";
import { format, addWeeks, startOfISOWeek, endOfISOWeek, addDays } from "date-fns";
import { nb } from "date-fns/locale";

import { MonoLabel } from "@/components/portal/patterns";
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

export function TrainingPlanViewer({ events, weekOffset }: TrainingPlanViewerProps) {
  const weekDays = useMemo(() => {
    const now = new Date();
    const targetWeek = addWeeks(now, weekOffset);
    const weekStart = startOfISOWeek(targetWeek);
    const nowStr = format(now, "yyyy-MM-dd");

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayEvents = events.filter((e) => e.date === dateStr);
      return {
        date,
        dateStr,
        dayName: DAY_NAMES[i],
        isToday: dateStr === nowStr,
        events: dayEvents,
      };
    });
  }, [events, weekOffset]);

  const weekRange = useMemo(() => {
    const now = new Date();
    const targetWeek = addWeeks(now, weekOffset);
    const weekStart = startOfISOWeek(targetWeek);
    const weekEnd = endOfISOWeek(targetWeek);
    return `${format(weekStart, "d. MMMM", { locale: nb })} – ${format(
      weekEnd,
      "d. MMMM",
      { locale: nb }
    )}`;
  }, [weekOffset]);

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
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400 mb-2">
            Ukevisning
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-black">Treningsplan</h1>
          <p className="text-sm text-grey-400 mt-1">{weekRange}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-full bg-white border border-grey-200">
            <Link
              href={`/portal/treningsplan?view=viewer&week=${weekOffset - 1}`}
              className="w-9 h-9 flex items-center justify-center rounded-full text-grey-400 hover:text-black hover:bg-grey-50 transition-colors"
              aria-label="Forrige uke"
            >
              <Icon name="chevron_left" className="w-4 h-4" />
            </Link>
            {weekOffset !== 0 && (
              <Link
                href="/portal/treningsplan?view=viewer"
                className="h-9 px-3 rounded-full text-xs font-semibold text-black hover:bg-grey-50 transition-colors inline-flex items-center"
              >
                I dag
              </Link>
            )}
            <Link
              href={`/portal/treningsplan?view=viewer&week=${weekOffset + 1}`}
              className="w-9 h-9 flex items-center justify-center rounded-full text-grey-400 hover:text-black hover:bg-grey-50 transition-colors"
              aria-label="Neste uke"
            >
              <Icon name="chevron_right" className="w-4 h-4" />
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
              <MonoLabel as="p" size="xs" uppercase className="text-grey-400 block mb-1">Fremgang denne uken</MonoLabel>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-black tabular-nums">{completed}</span>
                <span className="text-lg font-semibold text-grey-400 tabular-nums">/ {planned}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-grey-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-black transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-grey-400">
                  {planned === 0
                    ? "Ingen økter planlagt"
                    : completed === planned
                    ? "Alle økter fullført!"
                    : `${planned - completed} økter gjenstår`}
                </span>
                {completed > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-success">
                    <Icon name="trending_up" className="w-3.5 h-3.5" />
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
                      ? "bg-black text-white"
                      : "bg-grey-50 text-black"
                  }`}
                >
                  {format(day.date, "d", { locale: nb })}
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">{day.dayName}</p>
                  <p className="text-xs text-grey-400">
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
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-grey-50/60"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: cfg.bg }}
                          >
                            <Icon name="fitness_center" className="w-5 h-5" style={{ color: cfg.color }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-black">
                                {event.title}
                              </p>
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                style={{ background: cfg.bg, color: cfg.color }}
                              >
                                {cfg.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-grey-400">
                              <span className="flex items-center gap-1">
                                <Icon name="schedule" className="w-3 h-3" />
                                {String(event.startH).padStart(2, "0")}:
                                {String(event.startM).padStart(2, "0")} — {event.dur} min
                              </span>
                              {event.done && (
                                <span className="text-success font-medium">Fullført</span>
                              )}
                            </div>
                            {event.exercises.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {event.exercises.map((ex) => (
                                  <li key={ex.id} className="text-xs text-grey-400">
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
                              <Icon name="play_arrow" className="w-3.5 h-3.5 mr-1" />
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
            <Icon name="lightbulb" className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-black">Tips fra AI Coach</p>
              <p className="text-sm text-grey-400 mt-0.5">
                For SPILL-økter: bruk{" "}
                <Link href="/portal/strategi" className="underline font-medium text-black">
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
