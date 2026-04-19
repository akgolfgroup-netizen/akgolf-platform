"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, subDays, startOfWeek, addDays } from "date-fns";
import { nb } from "date-fns/locale";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { cn } from "@/lib/utils";

interface ActivityData {
  date: Date;
  minutes: number;
  type?: string;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  year?: number;
}

const WEEKS_TO_SHOW = 52;
const DAYS_PER_WEEK = 7;

// Color levels based on training minutes
const getActivityLevel = (minutes: number): number => {
  if (minutes === 0) return 0;
  if (minutes <= 30) return 1;
  if (minutes <= 60) return 2;
  if (minutes <= 90) return 3;
  return 4;
};

const ACTIVITY_COLORS = {
  0: "bg-slate-800",           // Ingen aktivitet
  1: "bg-[#16A34A]/20",        // 1-30 min
  2: "bg-[#16A34A]/50",        // 30-60 min
  3: "bg-[#16A34A]/75",        // 60-90 min
  4: "bg-[#16A34A]",           // 90+ min
};

const ACTIVITY_LABELS = {
  0: "Ingen aktivitet",
  1: "1-30 minutter",
  2: "30-60 minutter",
  3: "60-90 minutter",
  4: "90+ minutter",
};

const DAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export function ActivityHeatmap({ data, year = new Date().getFullYear() }: ActivityHeatmapProps) {
  const heatmapData = useMemo(() => {
    const today = new Date();
    const endDate = today;
    const startDate = subDays(endDate, WEEKS_TO_SHOW * DAYS_PER_WEEK - 1);
    
    // Adjust to start from Monday
    const adjustedStart = startOfWeek(startDate, { weekStartsOn: 1 });
    
    // Create a map of date -> minutes
    const activityMap = new Map<string, number>();
    data.forEach((item) => {
      const dateKey = format(new Date(item.date), "yyyy-MM-dd");
      activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + item.minutes);
    });
    
    // Build weeks array
    const weeks: { date: Date; minutes: number; level: number }[][] = [];
    let currentWeek: { date: Date; minutes: number; level: number }[] = [];
    let currentDate = adjustedStart;
    
    while (currentDate <= endDate) {
      const dateKey = format(currentDate, "yyyy-MM-dd");
      const minutes = activityMap.get(dateKey) || 0;
      
      currentWeek.push({
        date: new Date(currentDate),
        minutes,
        level: getActivityLevel(minutes),
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate = addDays(currentDate, 1);
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [data]);

  const totalDays = useMemo(() => {
    return data.filter(d => d.minutes > 0).length;
  }, [data]);

  const totalMinutes = useMemo(() => {
    return data.reduce((sum, d) => sum + d.minutes, 0);
  }, [data]);

  const longestStreak = useMemo(() => {
    const sortedDates = [...data]
      .filter(d => d.minutes > 0)
      .map(d => format(new Date(d.date), "yyyy-MM-dd"))
      .sort();
    
    if (sortedDates.length === 0) return 0;
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  }, [data]);

  return (
    <PremiumCard padding="lg" className="overflow-hidden">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-grey-400">
            Aktivitet siste år
          </p>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-bold text-black">{totalDays}</span>
            <span className="text-sm text-grey-400">dager med aktivitet</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-grey-400">{Math.round(totalMinutes / 60)} timer totalt</p>
          <p className="text-xs text-grey-400">Lengste streak: {longestStreak} dager</p>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto -mx-2 px-2 pb-2">
        <div className="min-w-[700px]">
          {/* Day labels */}
          <div className="flex gap-1">
            <div className="w-8" /> {/* Spacer for month labels */}
            <div className="flex-1 grid grid-rows-7 gap-1">
              {DAY_LABELS.map((day, i) => (
                <div key={day} className="h-3 text-[9px] text-grey-400 flex items-center">
                  {i % 2 === 0 ? day : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Weeks */}
          <div className="flex gap-1 mt-1">
            <div className="w-8" /> {/* Month labels column */}
            <div className="flex-1 flex gap-1">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: (weekIndex * 7 + dayIndex) * 0.002,
                        duration: 0.2
                      }}
                      className={cn(
                        "w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-offset-1 hover:ring-grey-300",
                        ACTIVITY_COLORS[day.level as keyof typeof ACTIVITY_COLORS]
                      )}
                      title={`${format(day.date, "d. MMMM yyyy", { locale: nb })}: ${day.minutes > 0 ? `${day.minutes} min` : "Ingen aktivitet"}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-grey-200">
        <span className="text-xs text-grey-400">Mindre</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn(
                "w-3 h-3 rounded-sm",
                ACTIVITY_COLORS[level as keyof typeof ACTIVITY_COLORS]
              )}
              title={ACTIVITY_LABELS[level as keyof typeof ACTIVITY_LABELS]}
            />
          ))}
        </div>
        <span className="text-xs text-grey-400">Mer</span>
      </div>
    </PremiumCard>
  );
}
