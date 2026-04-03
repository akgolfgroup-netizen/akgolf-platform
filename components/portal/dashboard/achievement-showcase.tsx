"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Flame,
  Target,
  Star,
  Zap,
  Award,
  Crown,
  Medal,
  Lock,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

type Rarity = "common" | "rare" | "epic" | "legendary";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  unlockedAt?: string;
  progress?: number; // 0-100 for locked achievements
}

interface AchievementShowcaseProps {
  achievements: Achievement[];
  totalAchievements: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Flame,
  Target,
  Star,
  Zap,
  Award,
  Crown,
  Medal,
};

const rarityConfig: Record<Rarity, { gradient: string; glow: string; label: string; border: string }> = {
  common: {
    gradient: "from-zinc-400 to-zinc-600",
    glow: "shadow-zinc-500/20",
    label: "Vanlig",
    border: "border-zinc-500/30",
  },
  rare: {
    gradient: "from-blue-400 to-blue-600",
    glow: "shadow-blue-500/30",
    label: "Sjelden",
    border: "border-blue-500/30",
  },
  epic: {
    gradient: "from-purple-400 to-purple-600",
    glow: "shadow-purple-500/30",
    label: "Episk",
    border: "border-purple-500/30",
  },
  legendary: {
    gradient: "from-amber-400 via-yellow-500 to-orange-500",
    glow: "shadow-amber-500/40",
    label: "Legendarisk",
    border: "border-amber-500/40",
  },
};

function AchievementCard({
  achievement,
  index,
  onSelect,
}: {
  achievement: Achievement;
  index: number;
  onSelect: () => void;
}) {
  const isUnlocked = !!achievement.unlockedAt;
  const Icon = iconMap[achievement.icon] || Trophy;
  const rarity = rarityConfig[achievement.rarity];

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative flex flex-col items-center p-4 rounded-xl border transition-[opacity,background] duration-300 cursor-pointer ${
        isUnlocked
          ? `${rarity.border} bg-gradient-to-b from-white/5 to-transparent hover:from-white/10`
          : "border-white/5 bg-white/[0.02] opacity-60 hover:opacity-80"
      }`}
    >
      {/* Glow effect for unlocked */}
      {isUnlocked && (
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-b ${rarity.gradient} opacity-5 blur-xl`}
        />
      )}

      {/* Badge container */}
      <div className="relative mb-3">
        {isUnlocked ? (
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rarity.gradient} flex items-center justify-center shadow-lg ${rarity.glow}`}
          >
            <Icon className="w-7 h-7 text-white drop-shadow-md" />
          </motion.div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-[var(--portal-surface-sunken)] flex items-center justify-center border border-white/5">
            <Lock className="w-6 h-6 text-[var(--portal-text-muted)]" />
          </div>
        )}

        {/* Rarity indicator */}
        {isUnlocked && achievement.rarity === "legendary" && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 rounded-2xl border border-amber-500/30"
            style={{ borderStyle: "dashed" }}
          />
        )}

        {/* Progress ring for locked achievements */}
        {!isUnlocked && achievement.progress !== undefined && achievement.progress > 0 && (
          <svg
            className="absolute -inset-1 w-16 h-16 -rotate-90"
            viewBox="0 0 64 64"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="var(--portal-card-border)"
              strokeWidth="2"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="var(--color-grey-900)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 176" }}
              animate={{
                strokeDasharray: `${achievement.progress * 1.76} 176`,
              }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </svg>
        )}
      </div>

      {/* Name */}
      <p
        className={`text-xs font-medium text-center leading-tight ${
          isUnlocked ? "text-white" : "text-[var(--portal-text-muted)]"
        }`}
      >
        {achievement.name}
      </p>

      {/* Date or progress */}
      <p className="text-[10px] text-[var(--portal-text-muted)] mt-1">
        {isUnlocked
          ? achievement.unlockedAt
          : achievement.progress !== undefined
          ? `${achievement.progress}%`
          : "Last"}
      </p>
    </motion.button>
  );
}

export function AchievementShowcase({
  achievements,
  totalAchievements,
}: AchievementShowcaseProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <>
      <div className="portal-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Achievements</h3>
                <p className="text-xs text-[var(--portal-text-muted)]">
                  {unlockedCount} av {totalAchievements} opplast
                </p>
              </div>
            </div>

            {/* Level indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-medium text-amber-500">
                Level {Math.floor(unlockedCount / 3) + 1}
              </span>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] text-[var(--portal-text-muted)] mb-1">
              <span>{(unlockedCount % 3) * 100} / 300 XP</span>
              <span>Neste level</span>
            </div>
            <div className="h-1.5 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((unlockedCount % 3) / 3) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* Achievement grid */}
        <div className="p-4">
          <div className="grid grid-cols-4 gap-3">
            {achievements.slice(0, 8).map((achievement, idx) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={idx}
                onSelect={() => setSelectedAchievement(achievement)}
              />
            ))}
          </div>

          {/* View all link */}
          {totalAchievements > 8 && (
            <button className="w-full mt-4 py-2 text-xs font-medium text-[var(--portal-text-muted)] hover:text-[var(--color-grey-500)] transition-colors cursor-pointer">
              Se alle {totalAchievements} achievements
            </button>
          )}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[var(--portal-card-bg-solid)] rounded-2xl border border-[var(--portal-card-border)] p-6 text-center"
            >
              {(() => {
                const Icon = iconMap[selectedAchievement.icon] || Trophy;
                const rarity = rarityConfig[selectedAchievement.rarity];
                const isUnlocked = !!selectedAchievement.unlockedAt;

                return (
                  <>
                    <div className="relative inline-flex mb-4">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        className={`w-20 h-20 rounded-2xl ${
                          isUnlocked
                            ? `bg-gradient-to-br ${rarity.gradient}`
                            : "bg-[var(--portal-surface-sunken)]"
                        } flex items-center justify-center shadow-xl ${isUnlocked ? rarity.glow : ""}`}
                      >
                        {isUnlocked ? (
                          <Icon className="w-10 h-10 text-white drop-shadow-md" />
                        ) : (
                          <Lock className="w-8 h-8 text-[var(--portal-text-muted)]" />
                        )}
                      </motion.div>
                    </div>

                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-2 ${
                        isUnlocked
                          ? `bg-gradient-to-r ${rarity.gradient} text-white`
                          : "bg-[var(--color-grey-200)] text-[var(--portal-text-muted)]"
                      }`}
                    >
                      {rarity.label}
                    </span>

                    <h3 className="text-lg font-semibold text-white mb-2">
                      {selectedAchievement.name}
                    </h3>
                    <p className="text-sm text-[var(--portal-text-muted)] mb-4">
                      {selectedAchievement.description}
                    </p>

                    {isUnlocked ? (
                      <p className="text-xs text-[var(--portal-text-muted)]">
                        Opplast {selectedAchievement.unlockedAt}
                      </p>
                    ) : (
                      <div className="mt-4">
                        <div className="h-2 bg-[var(--color-grey-100)] rounded-full overflow-hidden mb-2">
                          <motion.div
                            className="h-full bg-[var(--color-grey-900)] rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${selectedAchievement.progress ?? 0}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-[var(--portal-text-muted)]">
                          {selectedAchievement.progress ?? 0}% fullfort
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedAchievement(null)}
                      className="mt-6 px-6 py-2 rounded-lg bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)] text-sm font-medium text-white transition-colors cursor-pointer"
                    >
                      Lukk
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
