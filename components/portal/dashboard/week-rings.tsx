"use client";

import { motion } from "framer-motion";
import { Check, Flame, Target, Bed } from "lucide-react";
import Link from "next/link";

interface WeekDay {
  dayLabel: string;
  dateNumber: number;
  trained: boolean;
  hasCoaching: boolean;
  isToday: boolean;
  isRest: boolean;
  completionPercent: number; // 0-100
}

interface WeekRingsProps {
  days: WeekDay[];
  weekStart: string; // e.g., "23. - 29. mars"
}

export function WeekRings({ days, weekStart }: WeekRingsProps) {
  const completedDays = days.filter((d) => d.trained || d.isRest).length;
  const totalTrainingDays = days.filter((d) => !d.isRest).length;

  return (
    <div className="portal-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Ukens fremgang</h3>
          <p className="text-xs text-[var(--portal-text-muted)] mt-0.5">{weekStart}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-medium text-emerald-400">
              {completedDays}/{days.length} dager
            </span>
          </div>
        </div>
      </div>

      {/* Week grid */}
      <div className="p-5">
        <div className="grid grid-cols-7 gap-3">
          {days.map((day, idx) => (
            <motion.div
              key={day.dayLabel}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="flex flex-col items-center"
            >
              {/* Day label */}
              <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--portal-text-muted)] mb-2">
                {day.dayLabel}
              </span>

              {/* Progress ring */}
              <div className="relative">
                <svg
                  className="w-12 h-12 transform -rotate-90"
                  viewBox="0 0 48 48"
                >
                  {/* Background ring */}
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="var(--portal-card-border)"
                    strokeWidth="3"
                  />
                  {/* Progress ring */}
                  {(day.trained || day.isRest) && (
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke={day.isRest ? "var(--portal-text-muted)" : day.hasCoaching ? "#3B82F6" : "var(--color-gold)"}
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 126" }}
                      animate={{ strokeDasharray: `${day.completionPercent * 1.26} 126` }}
                      transition={{ delay: 0.3 + idx * 0.05, duration: 0.5 }}
                    />
                  )}
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {day.isRest ? (
                    <Bed className="w-4 h-4 text-[var(--portal-text-muted)]" />
                  ) : day.trained ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.05, type: "spring" }}
                    >
                      <Check className="w-5 h-5 text-emerald-400" />
                    </motion.div>
                  ) : day.isToday ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Target className="w-4 h-4 text-gold" />
                    </motion.div>
                  ) : (
                    <span className="text-sm font-semibold text-[var(--portal-text-primary)]">
                      {day.dateNumber}
                    </span>
                  )}
                </div>

                {/* Today indicator */}
                {day.isToday && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold"
                  />
                )}
              </div>

              {/* Coaching indicator */}
              {day.hasCoaching && (
                <div className="mt-2 px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/30">
                  <span className="text-[9px] font-medium text-blue-400">Coaching</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Week summary */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[var(--portal-surface-sunken)] to-transparent border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {completedDays === 0
                    ? "Start uken sterkt!"
                    : completedDays === days.length
                    ? "Fantastisk uke!"
                    : `${totalTrainingDays - days.filter((d) => d.trained).length} økter igjen`}
                </p>
                <p className="text-xs text-[var(--portal-text-muted)]">
                  {completedDays === 0
                    ? "Logg din første økt i dag"
                    : completedDays === days.length
                    ? "Alle økter fullført"
                    : "Fortsett den gode innsatsen"}
                </p>
              </div>
            </div>
            <Link
              href="/portal/dagbok"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
            >
              Logg økt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
