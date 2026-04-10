"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Flame, Trophy, Target, Zap } from "lucide-react";
import Link from "next/link";

interface HeroStatsProps {
  handicap: number | null;
  handicapChange: number | null;
  handicapHistory: number[];
  streak: number;
  sessionsThisMonth: number;
  achievements: number;
  totalAchievements: number;
  hasActiveStreak: boolean;
}

export function HeroStats({
  handicap,
  handicapChange,
  handicapHistory,
  streak,
  sessionsThisMonth,
  achievements,
  totalAchievements,
  hasActiveStreak,
}: HeroStatsProps) {
  const isImproving = handicapChange !== null && handicapChange > 0;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Hero Handicap Card - Takes 5 columns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-12 md:col-span-5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-grey-100)] via-white to-[var(--color-grey-100)] border border-[var(--portal-card-border)] p-6"
      >
        {/* Subtle golf pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='%23B07D4F' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--portal-text-muted)] mb-1">
                Handicap Index
              </p>
              <div className="flex items-baseline gap-3">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-5xl font-bold text-white tabular-nums"
                >
                  {handicap !== null ? handicap.toFixed(1) : "—"}
                </motion.span>
                {handicapChange !== null && handicapChange !== 0 && (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${
                      isImproving
                        ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
                        : "bg-[var(--color-error)]/20 text-[var(--color-error)]"
                    }`}
                  >
                    {isImproving ? (
                      <TrendingDown className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5" />
                    )}
                    {Math.abs(handicapChange).toFixed(1)}
                  </motion.div>
                )}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-grey-200)] to-[var(--color-grey-100)] flex items-center justify-center">
              <Target className="w-6 h-6 text-[var(--color-grey-900)]" />
            </div>
          </div>

          {/* Mini trend visualization */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-[var(--portal-text-muted)]">
              <span>Siste 6 runder</span>
              <Link
                href="/portal/statistikk"
                className="text-[var(--color-grey-400)] hover:text-[var(--color-grey-500)] transition-colors"
              >
                Se utvikling
              </Link>
            </div>
            <div className="flex items-end gap-1 mt-2 h-8">
              {(handicapHistory.length > 0
                ? handicapHistory.slice(-6)
                : [handicap ?? 0]
              ).map((val, i, arr) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(20, 100 - (val - 15) * 10)}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  className={`flex-1 rounded-t ${
                    i === arr.length - 1 ? "bg-[var(--color-grey-900)]" : "bg-[var(--color-grey-200)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Secondary stats - 7 columns */}
      <div className="col-span-12 md:col-span-7 grid grid-cols-3 gap-4">
        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 p-5"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative">
                <Flame className={`w-5 h-5 ${hasActiveStreak ? "text-orange-500" : "text-[var(--portal-text-muted)]"}`} />
                {hasActiveStreak && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-full bg-orange-500/30 blur-sm"
                  />
                )}
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--portal-text-muted)]">
                Streak
              </span>
            </div>
            <div className="mt-auto">
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-3xl font-bold text-white"
              >
                {streak}
              </motion.span>
              <span className="text-lg font-medium text-[var(--portal-text-muted)] ml-1">dager</span>
            </div>
            {streak > 0 && (
              <p className="text-xs text-orange-400/80 mt-2">
                {streak >= 7 ? "Fantastisk dedikasjon!" : streak >= 3 ? "Sterk innsats!" : "Fortsett slik!"}
              </p>
            )}
          </div>
        </motion.div>

        {/* Sessions This Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-5"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--portal-text-muted)]">
                Denne mnd
              </span>
            </div>
            <div className="mt-auto">
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-3xl font-bold text-white"
              >
                {sessionsThisMonth}
              </motion.span>
              <span className="text-lg font-medium text-[var(--portal-text-muted)] ml-1">økter</span>
            </div>
            {/* Progress to monthly goal */}
            <div className="mt-3">
              <div className="h-1.5 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (sessionsThisMonth / 12) * 100)}%` }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
              <p className="text-xs text-[var(--portal-text-muted)] mt-1">
                {sessionsThisMonth}/12 mal
              </p>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 p-5"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--portal-text-muted)]">
                Achievements
              </span>
            </div>
            <div className="mt-auto">
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-3xl font-bold text-white"
              >
                {achievements}
              </motion.span>
              <span className="text-lg font-medium text-[var(--portal-text-muted)]">/{totalAchievements}</span>
            </div>
            {/* Achievement badges preview */}
            <div className="flex -space-x-2 mt-3">
              {[...Array(Math.min(4, achievements))].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="w-6 h-6 rounded-full bg-yellow-500/20 border-2 border-[var(--portal-bg)] flex items-center justify-center"
                >
                  <Trophy className="w-3 h-3 text-yellow-500" />
                </motion.div>
              ))}
              {achievements > 4 && (
                <div className="w-6 h-6 rounded-full bg-[var(--portal-surface-sunken)] border-2 border-[var(--portal-bg)] flex items-center justify-center text-[10px] font-medium text-[var(--portal-text-muted)]">
                  +{achievements - 4}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
