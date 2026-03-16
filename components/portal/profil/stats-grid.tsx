"use client";

import { motion } from "framer-motion";
import { Activity, BookOpen, Trophy, Flame } from "lucide-react";

interface StatsGridProps {
  trainingSessions: number;
  coachingSessions: number;
  tournaments: number;
  streak: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
};

export function StatsGrid({ trainingSessions, coachingSessions, tournaments, streak }: StatsGridProps) {
  const stats = [
    {
      label: "Treningsøkter",
      sublabel: "siste 30 dager",
      value: trainingSessions,
      icon: Activity,
      color: "#22C55E",
    },
    {
      label: "Coaching",
      sublabel: "totalt",
      value: coachingSessions,
      icon: BookOpen,
      color: "#3B82F6",
    },
    {
      label: "Turneringer",
      sublabel: "planlagt",
      value: tournaments,
      icon: Trophy,
      color: "#B8975C",
    },
    {
      label: "Streak",
      sublabel: streak === 1 ? "dag på rad" : "dager på rad",
      value: streak,
      icon: Flame,
      color: "#F97316",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={cardVariant}>
          <div
            className="relative rounded-2xl p-4 overflow-hidden"
            style={{
              background: "rgba(10,25,41,0.7)",
              border: "1px solid rgba(15,41,80,0.8)",
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-4 right-4 h-px rounded-full opacity-60"
              style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
            />

            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-semibold text-[var(--color-snow-dim)]/50 uppercase tracking-widest leading-tight">
                {stat.label}
              </p>
              <stat.icon
                className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                style={{ color: stat.color, opacity: 0.7 }}
              />
            </div>

            <p className="text-2xl font-black text-[var(--color-snow)]">
              {stat.value}
            </p>
            <p className="text-[11px] text-[var(--color-snow-dim)]/40 mt-0.5">
              {stat.sublabel}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
