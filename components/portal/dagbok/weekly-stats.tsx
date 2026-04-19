"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Dumbbell, TrendingUp, TrendingDown, Activity, Target } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { cn } from "@/lib/utils";
import { format, startOfWeek, endOfWeek, isWithinInterval, subWeeks, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import { MonoLabel } from "@/components/portal/patterns";

interface SessionData {
  id: string;
  date: Date | string;
  durationMinutes: number | null;
  intensity?: number | null;
  type?: string;
}

interface WeeklyStatsProps {
  sessions: SessionData[];
}

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

type StatRowProps = {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  color?: "default" | "intensity";
  avgIntensity: number;
};

function StatRow({
  icon: Icon,
  label,
  value,
  unit = "",
  change,
  color = "default",
  avgIntensity,
}: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-grey-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          color === "intensity" && avgIntensity >= 7
            ? "bg-orange-100 text-orange-600"
            : color === "intensity" && avgIntensity >= 4
              ? "bg-green-100 text-green-600"
              : "bg-grey-50 text-grey-400"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-grey-400">{label}</p>
          <p className="text-lg font-semibold text-black tabular-nums">
            {value}
            <span className="text-sm font-normal text-grey-400 ml-1">{unit}</span>
          </p>
        </div>
      </div>

      {change !== undefined && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            change > 0
              ? "bg-green-100 text-green-700"
              : change < 0
                ? "bg-red-100 text-red-700"
                : "bg-grey-100 text-grey-500"
          )}
        >
          {change > 0 ? (
            <TrendingUp className="w-3 h-3" />
          ) : change < 0 ? (
            <TrendingDown className="w-3 h-3" />
          ) : null}
          {change > 0 ? "+" : ""}{change}
        </motion.div>
      )}
    </div>
  );
}

export function WeeklyStats({ sessions }: WeeklyStatsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const currentWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
    
    const lastWeekStart = subWeeks(currentWeekStart, 1);
    const lastWeekEnd = subWeeks(currentWeekEnd, 1);
    
    // Current week sessions
    const currentWeekSessions = sessions.filter(s => {
      const date = typeof s.date === "string" ? parseISO(s.date) : s.date;
      return isWithinInterval(date, { start: currentWeekStart, end: currentWeekEnd });
    });
    
    // Last week sessions
    const lastWeekSessions = sessions.filter(s => {
      const date = typeof s.date === "string" ? parseISO(s.date) : s.date;
      return isWithinInterval(date, { start: lastWeekStart, end: lastWeekEnd });
    });
    
    // Calculate stats
    const currentCount = currentWeekSessions.length;
    const lastCount = lastWeekSessions.length;
    
    const currentMinutes = currentWeekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const lastMinutes = lastWeekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    
    const currentAvgIntensity = currentCount > 0
      ? currentWeekSessions.reduce((sum, s) => sum + (s.intensity || 5), 0) / currentCount
      : 0;
    const lastAvgIntensity = lastCount > 0
      ? lastWeekSessions.reduce((sum, s) => sum + (s.intensity || 5), 0) / lastCount
      : 0;
    
    return {
      count: currentCount,
      countChange: currentCount - lastCount,
      totalMinutes: currentMinutes,
      minutesChange: currentMinutes - lastMinutes,
      avgIntensity: currentAvgIntensity,
      intensityChange: currentAvgIntensity - lastAvgIntensity,
      weekLabel: format(currentWeekStart, "d.", { locale: nb }) + 
                 "–" + 
                 format(currentWeekEnd, "d. MMMM", { locale: nb }),
    };
  }, [sessions]);

  return (
    <PremiumCard padding="lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <MonoLabel as="p" size="xs" uppercase className="text-grey-400 block">Denne uken</MonoLabel>
          <p className="text-xs text-grey-400 mt-1">{stats.weekLabel}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-accent-cta/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-black" />
        </div>
      </div>

      <div className="space-y-1">
        <StatRow
          icon={Dumbbell}
          label="Antall økter"
          value={stats.count}
          change={stats.countChange}
          avgIntensity={stats.avgIntensity}
        />

        <StatRow
          icon={Clock}
          label="Total tid"
          value={Math.round(stats.totalMinutes / 60 * 10) / 10}
          unit="timer"
          change={Math.round(stats.minutesChange / 60 * 10) / 10}
          avgIntensity={stats.avgIntensity}
        />

        <StatRow
          icon={Target}
          label="Gjennomsnittlig intensitet"
          value={stats.avgIntensity > 0 ? stats.avgIntensity.toFixed(1) : "–"}
          unit="/10"
          color="intensity"
          avgIntensity={stats.avgIntensity}
        />
      </div>

      {/* Progress indicator */}
      <div className="mt-4 pt-4 border-t border-grey-200">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-grey-400">Ukentlig mål</span>
          <span className="font-medium text-black">{stats.count} / 4 økter</span>
        </div>
        <div className="h-2 bg-grey-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((stats.count / 4) * 100, 100)}%` }}
            transition={{ duration: 0.8, ease: EASE_APPLE, delay: 0.2 }}
            className={cn(
              "h-full rounded-full",
              stats.count >= 4 ? "bg-accent-cta" : "bg-[#16A34A]"
            )}
          />
        </div>
      </div>
    </PremiumCard>
  );
}
