"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Crown, Star, Zap, Award } from "lucide-react";

const MILESTONES = [
  { days: 7, label: "1 uke", icon: Flame, color: "#F97316" },
  { days: 14, label: "2 uker", icon: Zap, color: "#EAB308" },
  { days: 30, label: "1 maned", icon: Star, color: "var(--color-brand)" },
  { days: 60, label: "2 maneder", icon: Award, color: "#3B82F6" },
  { days: 90, label: "3 maneder", icon: Trophy, color: "#8B5CF6" },
  { days: 365, label: "1 ar", icon: Crown, color: "#EC4899" },
];

interface StreakMilestoneProps {
  currentStreak: number;
}

export function StreakMilestone({ currentStreak }: StreakMilestoneProps) {
  // Find next milestone
  const nextMilestone = MILESTONES.find((m) => m.days > currentStreak);
  const achievedMilestones = MILESTONES.filter((m) => m.days <= currentStreak);
  const latestAchieved = achievedMilestones[achievedMilestones.length - 1];

  if (!nextMilestone && !latestAchieved) {
    return null;
  }

  const progress = nextMilestone
    ? Math.round(
        ((currentStreak - (latestAchieved?.days || 0)) /
          (nextMilestone.days - (latestAchieved?.days || 0))) *
          100
      )
    : 100;

  const Icon = latestAchieved?.icon || Flame;
  const NextIcon = nextMilestone?.icon || Crown;

  return (
    <div className="p-4 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: latestAchieved?.color || "#6B7280" }}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-grey-900)]">
              {currentStreak} {currentStreak === 1 ? "dag" : "dager"} streak
            </p>
            {latestAchieved && (
              <p className="text-xs text-[var(--color-grey-500)]">
                {latestAchieved.label} oppnadd!
              </p>
            )}
          </div>
        </div>

        {nextMilestone && (
          <div className="flex items-center gap-2">
            <p className="text-xs text-[var(--color-grey-500)]">
              Neste: {nextMilestone.label}
            </p>
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center opacity-50"
              style={{ backgroundColor: nextMilestone.color }}
            >
              <NextIcon className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>

      {nextMilestone && (
        <div className="relative">
          <div className="h-2 bg-[var(--color-grey-200)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${latestAchieved?.color || "#6B7280"}, ${nextMilestone.color})`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[var(--color-grey-500)]">
              {latestAchieved?.days || 0}d
            </span>
            <span className="text-[10px] text-[var(--color-grey-500)]">
              {nextMilestone.days}d
            </span>
          </div>
        </div>
      )}

      {/* Achieved milestones badges */}
      {achievedMilestones.length > 0 && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--color-grey-200)]">
          {achievedMilestones.map((milestone) => {
            const MIcon = milestone.icon;
            return (
              <motion.div
                key={milestone.days}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: milestone.color }}
                title={milestone.label}
              >
                <MIcon className="w-4 h-4 text-white" />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
