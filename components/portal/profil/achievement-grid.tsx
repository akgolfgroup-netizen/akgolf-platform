"use client";

import { motion } from "framer-motion";
import {
  Trophy, Flame, Star, Zap, Calendar, Flag, TrendingDown,
  Crown, Users, BookOpen, MapIcon, Target, Medal, Dumbbell,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy, flame: Flame, star: Star, zap: Zap,
  calendar: Calendar, flag: Flag, "trending-down": TrendingDown,
  crown: Crown, users: Users, "book-open": BookOpen,
  map: MapIcon, target: Target, medal: Medal, dumbbell: Dumbbell,
};

interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  sortOrder: number;
}

interface PlayerAchievement {
  achievementDefinitionId: string;
  unlockedAt: Date;
}

interface AchievementGridProps {
  definitions: Achievement[];
  unlocked: PlayerAchievement[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export function AchievementGrid({ definitions, unlocked }: AchievementGridProps) {
  const unlockedIds = new Set(unlocked.map((u) => u.achievementDefinitionId));
  const sorted = [...definitions].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--color-grey-100)", border: "1px solid var(--color-grey-200)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-[var(--color-grey-900)]" />
        <h2 className="text-sm font-semibold text-[var(--color-grey-900)]">Prestasjoner</h2>
        <span className="text-xs text-[var(--color-grey-500)] ml-auto">
          {unlocked.length}/{definitions.length}
        </span>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 sm:grid-cols-5 gap-3"
      >
        {sorted.map((def) => {
          const isUnlocked = unlockedIds.has(def.id);
          const Icon = ICON_MAP[def.icon] ?? Trophy;

          return (
            <motion.div
              key={def.id}
              variants={item}
              className="group relative flex flex-col items-center text-center"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1.5 transition-all ${
                  isUnlocked ? "shadow-lg" : "opacity-30 grayscale"
                }`}
                style={{
                  background: isUnlocked
                    ? "linear-gradient(135deg, var(--color-grey-200) 0%, var(--color-grey-200) 100%)"
                    : "var(--color-grey-200)",
                  border: isUnlocked
                    ? "1px solid var(--color-grey-200)"
                    : "1px solid var(--color-grey-200)",
                }}
              >
                <Icon
                  className={`w-5 h-5 ${isUnlocked ? "text-[var(--color-grey-900)]" : "text-[var(--color-grey-500)]"}`}
                />
              </div>
              <span
                className={`text-[10px] leading-tight ${
                  isUnlocked ? "text-[var(--color-grey-900)]" : "text-[var(--color-grey-500)]/50"
                }`}
              >
                {def.title}
              </span>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                <div
                  className="px-3 py-2 rounded-lg text-xs max-w-[160px]"
                  style={{ background: "white", border: "1px solid var(--color-grey-200)" }}
                >
                  <p className="font-semibold text-[var(--color-grey-900)] mb-0.5">{def.title}</p>
                  <p className="text-[var(--color-grey-500)]">{def.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
