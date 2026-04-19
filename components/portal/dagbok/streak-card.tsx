"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Snowflake } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { cn } from "@/lib/utils";
import { MonoLabel } from "@/components/portal/patterns";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastTrainingDate: Date;
  streakFreezesRemaining: number;
}

interface StreakCardProps {
  data: StreakData;
  onUseFreeze?: () => void;
}

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export function StreakCard({ data, onUseFreeze }: StreakCardProps) {
  const { currentStreak, longestStreak, streakFreezesRemaining } = data;
  
  const isNewRecord = currentStreak > 0 && currentStreak >= longestStreak;
  const isLongStreak = currentStreak >= 7;

  return (
    <PremiumCard 
      variant={isLongStreak ? "accent" : "default"} 
      padding="lg"
      className="relative overflow-hidden"
    >
      {/* Animated flame background for long streaks */}
      {isLongStreak && (
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 bg-accent-cta/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      <div className="relative">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <MonoLabel as="p" size="xs" uppercase className="text-grey-400 block">Treningsstreak</MonoLabel>
            <motion.div 
              className="flex items-baseline gap-2 mt-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_APPLE }}
            >
              <span className="text-4xl font-bold text-black tabular-nums tracking-tight">
                {currentStreak}
              </span>
              <span className="text-sm text-grey-400">
                {currentStreak === 1 ? "dag" : "dager"}
              </span>
            </motion.div>
          </div>
          
          <motion.div 
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center",
              isLongStreak 
                ? "bg-accent-cta shadow-lg shadow-accent-cta/30" 
                : "bg-grey-50"
            )}
            animate={isLongStreak ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Flame 
              className={cn(
                "w-7 h-7",
                isLongStreak ? "text-black" : "text-grey-400"
              )} 
              strokeWidth={isLongStreak ? 2.5 : 2}
            />
          </motion.div>
        </div>

        {/* Streak message */}
        <div className="mb-4">
          {currentStreak === 0 ? (
            <p className="text-sm text-grey-400">
              Start din streak i dag! 🔥
            </p>
          ) : isNewRecord ? (
            <p className="text-sm text-black font-medium">
              🎉 Ny personlig rekord!
            </p>
          ) : (
            <p className="text-sm text-grey-400">
              {currentStreak >= 7 
                ? "Imponerende konsistens!" 
                : currentStreak >= 3 
                  ? "Bra momentum!" 
                  : "God start!"}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-4 border-t border-grey-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-grey-400" />
            <div>
              <p className="text-xs text-grey-400">Rekord</p>
              <p className="text-sm font-semibold text-black">{longestStreak} dager</p>
            </div>
          </div>
          
          {/* Streak freeze indicator */}
          <div className="flex-1 flex justify-end">
            {streakFreezesRemaining > 0 ? (
              <motion.button
                onClick={onUseFreeze}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
              >
                <Snowflake className="w-3.5 h-3.5" />
                {streakFreezesRemaining} freeze{streakFreezesRemaining !== 1 ? "s" : ""}
              </motion.button>
            ) : (
              <span className="text-xs text-grey-300">
                Ingen freezes igjen
              </span>
            )}
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
