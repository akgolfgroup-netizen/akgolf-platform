"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import { Award, Star, Flame, Trophy, Target, Zap, Crown, Medal } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Trophy,
  Star,
  Flame,
  Zap,
  Crown,
  Medal,
  Award,
};

const rarityColors = {
  common: "border-inverse-on-surface/20 bg-inverse-surface/50 text-inverse-on-surface/60",
  rare: "border-blue-500/50 bg-blue-500/10 text-blue-400",
  epic: "border-purple-500/50 bg-purple-500/10 text-purple-400",
  legendary: "border-amber-500/50 bg-amber-500/10 text-amber-400",
};

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
  progress?: number;
}

interface AchievementsWidgetProps {
  achievements: Achievement[];
  totalAchievements: number;
}

export function AchievementsWidget({ achievements, totalAchievements }: AchievementsWidgetProps) {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const recentAchievements = achievements
    .filter(a => a.unlockedAt)
    .slice(0, 3);
  
  const inProgress = achievements
    .filter(a => !a.unlockedAt && a.progress && a.progress > 0)
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-800 bg-inverse-surface/50 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="emoji_events" className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-inverse-on-surface">Prestasjoner</h3>
        </div>
        <span className="text-xs text-inverse-on-surface/60">
          {unlockedCount}/{totalAchievements}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-inverse-surface rounded-full h-2 mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(unlockedCount / totalAchievements) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2 rounded-full"
        />
      </div>

      {/* Recent unlocks */}
      {recentAchievements.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-xs text-inverse-on-surface/70">Nylig oppnådd</p>
          {recentAchievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Star;
            return (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`flex items-center gap-3 p-2 rounded-lg border ${rarityColors[achievement.rarity]}`}
              >
                <Icon className="w-5 h-5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{achievement.name}</p>
                  <p className="text-xs opacity-70 truncate">{achievement.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* In progress */}
      {inProgress.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-inverse-on-surface/70">På vei</p>
          {inProgress.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center gap-3 p-2 bg-inverse-surface/30 rounded-lg"
            >
              <Icon name="lock" className="w-4 h-4 text-inverse-on-surface/70" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-inverse-on-surface/60 truncate">{achievement.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-inverse-surface/80 rounded-full h-1">
                    <div
                      className="bg-inverse-surface/60 h-1 rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-inverse-on-surface/70">{achievement.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
