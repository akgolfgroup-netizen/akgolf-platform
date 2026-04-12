"use client";

import { useMemo } from "react";
import { Target, Flame } from "lucide-react";
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
import { GlassCard, fadeInUp } from "@/components/portal/premium";
import { StreakMilestone } from "@/components/portal/gamification/streak-milestone";
import { cn } from "@/lib/portal/utils/cn";

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
        <GlassCard variant="light" padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-cta)]/15 flex items-center justify-center">
              <Flame className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-portal-text)] text-[14px]">
                Treningsstreak
              </h3>
              <p className="text-[10px] text-[var(--color-portal-muted)] uppercase tracking-wider">
                {streak > 0 ? "Fortsett det gode arbeidet" : "Start i dag"}
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-[64px] font-[300] text-[var(--color-portal-text)] leading-none tabular-nums tracking-[-0.04em]">
              {streak}
            </span>
            <span className="text-[13px] text-[var(--color-portal-muted)]">
              {streak === 1 ? "dag pa rad" : "dager pa rad"}
            </span>
          </div>
          <div className="flex gap-1.5 mb-4">
            {streakDays.map((d, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex-1 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold transition-colors",
                  d.active && "bg-[var(--color-primary)] text-white",
                  d.today && !d.active &&
                    "bg-white border-2 border-[var(--color-accent-cta)] text-[var(--color-primary)]",
                  !d.active && !d.today &&
                    "bg-white/60 border border-[var(--color-portal-border)] text-[var(--color-portal-muted)]"
                )}
              >
                {d.day}
              </div>
            ))}
          </div>
          {streak > 0 && <StreakMilestone currentStreak={streak} />}
        </GlassCard>
      </motion.div>

      {/* Categories breakdown */}
      {categories.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-portal-muted)] uppercase mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-[var(--color-portal-muted)]" />
            Treningskategorier
          </p>
          <GlassCard variant="light" padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 border border-white/80 hover:border-[var(--color-primary)]/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[var(--color-primary)]/10">
                    <Target className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--color-portal-text)] truncate">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-[var(--color-portal-muted)]">{cat.count}</p>
                    <div className="h-1 bg-[var(--color-portal-border)] rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)]"
                        style={{ width: `${cat.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
