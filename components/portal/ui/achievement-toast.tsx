"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Flame,
  Star,
  Zap,
  Calendar,
  Flag,
  Medal,
  TrendingDown,
  Crown,
  Users,
  BookOpen,
  Map,
  Target,
  Dumbbell,
} from "lucide-react";

interface AchievementToastProps {
  achievement: {
    key: string;
    title: string;
    description: string;
    icon: string;
  } | null;
  onClose: () => void;
}

const ICON_MAP: Record<string, typeof Trophy> = {
  trophy: Trophy,
  flame: Flame,
  star: Star,
  zap: Zap,
  calendar: Calendar,
  flag: Flag,
  medal: Medal,
  "trending-down": TrendingDown,
  crown: Crown,
  users: Users,
  "book-open": BookOpen,
  map: Map,
  target: Target,
  dumbbell: Dumbbell,
};

// Generate particles with seed for consistency
function generateParticles(seed: number) {
  const colors = ["#FFD700", "#FFA500", "#FF6347", "#32CD32", "#1E90FF", "#9370DB"];
  // Simple seeded random for reproducibility
  const seededRandom = (i: number) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 3) * 100,
    delay: seededRandom(i * 5) * 0.5,
    color: colors[Math.floor(seededRandom(i * 7) * colors.length)],
    rotation: seededRandom(i * 11) * 360,
  }));
}

function Confetti({ seed }: { seed: number }) {
  const particles = useMemo(() => generateParticles(seed), [seed]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}%`, opacity: 1, rotate: 0 }}
          animate={{
            y: 200,
            opacity: 0,
            rotate: p.rotation,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color, left: `${p.x}%` }}
        />
      ))}
    </div>
  );
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  // Use achievement key as seed for consistent confetti per achievement
  const confettiSeed = useMemo(() => {
    if (!achievement) return 0;
    let hash = 0;
    for (let i = 0; i < achievement.key.length; i++) {
      hash = ((hash << 5) - hash) + achievement.key.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }, [achievement]);

  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  const Icon = achievement ? ICON_MAP[achievement.icon] || Trophy : Trophy;

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className="relative">
            <Confetti seed={confettiSeed} />
            <div
              className="relative px-6 py-4 rounded-2xl shadow-2xl border-2 border-amber-300"
              style={{
                background: "linear-gradient(135deg, #FFF8E1 0%, #FFE082 100%)",
              }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #FFD700 0%, #FFA000 100%)",
                    boxShadow: "0 4px 12px rgba(255, 193, 7, 0.4)",
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs font-semibold uppercase tracking-wider text-amber-700"
                  >
                    Achievement opplast!
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg font-bold text-amber-900"
                  >
                    {achievement.title}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-amber-700"
                  >
                    {achievement.description}
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
