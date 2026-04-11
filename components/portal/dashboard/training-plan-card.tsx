"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, type LucideIcon, Target, Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_ENTRANCE } from "@/lib/design-tokens";

// ── Types ──────────────────────────────────────────────────────────────────────

interface WeekDay {
  dayLabel: string;
  dateNumber: number;
  hasActivity: boolean;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: number;
  iconName: "Dumbbell" | "Target" | "Waypoints";
}

interface TrainingPlanCardProps {
  days?: WeekDay[];
  exercises?: Exercise[];
  delay?: number;
}

// ── Icon map ───────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Dumbbell,
  Target,
  Waypoints,
};

// ── Mock data (brukes når ingen data sendes inn) ───────────────────────────────

const MOCK_DAYS: WeekDay[] = [
  { dayLabel: "Ma", dateNumber: 7, hasActivity: true },
  { dayLabel: "Ti", dateNumber: 8, hasActivity: true },
  { dayLabel: "On", dateNumber: 9, hasActivity: false },
  { dayLabel: "To", dateNumber: 10, hasActivity: true },
  { dayLabel: "Fr", dateNumber: 11, hasActivity: false },
  { dayLabel: "Lø", dateNumber: 12, hasActivity: true },
  { dayLabel: "Sø", dateNumber: 13, hasActivity: false },
];

const MOCK_EXERCISES: Exercise[] = [
  {
    id: "1",
    title: "Pitch 20-40 meter",
    description: "Variert avstand, 30 baller",
    duration: 20,
    iconName: "Target",
  },
  {
    id: "2",
    title: "Chip rundt green",
    description: "3 posisjoner, opp-og-ned",
    duration: 25,
    iconName: "Waypoints",
  },
  {
    id: "3",
    title: "Putting-drill",
    description: "Gate-drill, 1.5m–3m",
    duration: 15,
    iconName: "Dumbbell",
  },
];

// ── Component ��───────────────────────────���─────────────────────────────────────

export function TrainingPlanCard({
  days = MOCK_DAYS,
  exercises = MOCK_EXERCISES,
  delay = 0,
}: TrainingPlanCardProps) {
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDay, setSelectedDay] = useState(
    Math.min(todayIndex, days.length - 1),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_ENTRANCE }}
      className="rounded-xl bg-white p-5 shadow-card"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Treningsplan
      </p>

      {/* Week selector */}
      <div className="mt-3 flex gap-2">
        {days.map((day, i) => (
          <button
            key={day.dayLabel}
            onClick={() => setSelectedDay(i)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-center transition-colors",
              i === selectedDay
                ? "bg-black text-white"
                : "bg-white text-text hover:bg-grey-50",
            )}
          >
            <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
              {day.dayLabel}
            </span>
            <span className="text-sm font-semibold tabular-nums">
              {day.dateNumber}
            </span>
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                day.hasActivity ? "bg-success" : "bg-transparent",
              )}
            />
          </button>
        ))}
      </div>

      {/* Exercise list */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Dagens økt
        </p>
        <AnimatePresence mode="wait">
          <motion.ul
            key={selectedDay}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-3 divide-y divide-grey-100"
          >
            {exercises.map((ex) => {
              const Icon = ICON_MAP[ex.iconName] ?? Dumbbell;
              return (
                <li key={ex.id} className="flex items-start gap-4 py-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-grey-50">
                    <Icon className="h-5 w-5 text-grey-500" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-black">{ex.title}</p>
                    <p className="text-xs text-muted">{ex.description}</p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-muted">
                    {ex.duration} min
                  </span>
                </li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
