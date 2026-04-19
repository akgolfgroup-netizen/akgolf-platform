"use client";


import { Icon } from "@/components/ui/icon";
import { useMemo } from "react";

import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  startOfDay,
  subDays,
} from "date-fns";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { fadeInUp } from "@/components/portal/premium";
import { StreakMilestone } from "@/components/portal/gamification/streak-milestone";
import { cn } from "@/lib/portal/utils/cn";
import { MonoLabel } from "@/components/portal/patterns";

interface TrainingLogEntry {
  id: string;
  date: Date | string;
  durationMinutes: number | null;
  focusArea: string | null;
  notes: string | null;
  rating: number | null;
  deviatedFromPlan: boolean;
  deviationReason: string | null;
  planSessionId: string | null;
  TrainingPlanSession: {
    id: string;
    title: string;
    focusArea: string | null;
    durationMinutes: number | null;
  } | null;
}

interface DagbokStatsProps {
  logs: TrainingLogEntry[];
}

const WEEK_DAYS = ["M", "T", "O", "T", "F", "L", "S"];

function calculateStreak(logs: TrainingLogEntry[]): number {
  if (logs.length === 0) return 0;
  const logDates = new Set(
    logs.map((l) => format(new Date(l.date), "yyyy-MM-dd"))
  );
  const today = startOfDay(new Date());
  let streak = 0;
  let checkDate = today;
  if (!logDates.has(format(checkDate, "yyyy-MM-dd"))) {
    checkDate = subDays(checkDate, 1);
  }
  while (logDates.has(format(checkDate, "yyyy-MM-dd"))) {
    streak++;
    checkDate = subDays(checkDate, 1);
  }
  return streak;
}

function getStreakDays(logs: TrainingLogEntry[]) {
  const logDates = new Set(
    logs.map((l) => format(new Date(l.date), "yyyy-MM-dd"))
  );
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(today, { weekStartsOn: 1 }),
  });
  return days.map((d) => ({
    day: WEEK_DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1],
    active: logDates.has(format(d, "yyyy-MM-dd")),
    today: isToday(d),
  }));
}

function buildCategories(logs: TrainingLogEntry[]) {
  const counts: Record<string, number> = {};
  for (const log of logs) {
    const area = log.focusArea || log.TrainingPlanSession?.focusArea || "Annet";
    counts[area] = (counts[area] || 0) + 1;
  }
  const total = logs.length || 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 4).map(([name, count]) => ({
    name,
    count: `${count} ${count === 1 ? "okt" : "okter"}`,
    progress: Math.round((count / total) * 100),
  }));
}

export function DagbokStats({ logs }: DagbokStatsProps) {
  const streak = useMemo(() => calculateStreak(logs), [logs]);
  const streakDays = useMemo(() => getStreakDays(logs), [logs]);
  const categories = useMemo(() => buildCategories(logs), [logs]);

  return (
    <div className="space-y-6">
      {/* Streak card */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <PremiumCard glow="green">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Icon name="local_fire_department" className="w-5 h-5 text-primary" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-semibold text-on-surface text-sm">
                Treningsstreak
              </h3>
              <MonoLabel as="p" size="xs" uppercase className="text-outline block">{streak > 0 ? "Fortsett det gode arbeidet" : "Start i dag"}</MonoLabel>
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-4xl font-extrabold tabular-nums tracking-tight text-on-surface">
              {streak}
            </span>
            <MonoLabel size="xs" uppercase className="text-outline">{streak === 1 ? "dag på rad" : "dager på rad"}</MonoLabel>
          </div>
          <div className="flex gap-1.5 mb-4">
            {streakDays.map((d, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex-1 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold transition-colors",
                  d.active && "bg-primary text-white",
                  d.today && !d.active &&
                    "bg-white border-2 border-primary text-primary",
                  !d.active && !d.today &&
                    "bg-surface-container border border-outline-variant text-outline"
                )}
              >
                {d.day}
              </div>
            ))}
          </div>
          {streak > 0 && <StreakMilestone currentStreak={streak} />}
        </PremiumCard>
      </motion.div>

      {/* Categories breakdown */}
      {categories.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-outline mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-surface-container-high" />
            Treningskategorier
          </p>
          <PremiumCard glow="green">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container border border-outline-variant hover:border-primary/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10">
                    <Icon name="my_location" className="w-5 h-5 text-primary" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {cat.name}
                    </p>
                    <MonoLabel as="p" size="xs" uppercase className="text-outline block">{cat.count}</MonoLabel>
                    <div className="h-1 bg-outline-variant rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${cat.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>
      )}
    </div>
  );
}
