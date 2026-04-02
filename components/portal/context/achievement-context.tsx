"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AchievementToast } from "@/components/portal/ui/achievement-toast";

interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
}

interface AchievementContextValue {
  showAchievement: (achievement: Achievement) => void;
}

const AchievementContext = createContext<AchievementContextValue | null>(null);

interface AchievementProviderProps {
  children: ReactNode;
}

export function AchievementProvider({ children }: AchievementProviderProps) {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [queue, setQueue] = useState<Achievement[]>([]);

  const showAchievement = useCallback((achievement: Achievement) => {
    if (currentAchievement) {
      // Queue achievement if one is already showing
      setQueue((prev) => [...prev, achievement]);
    } else {
      setCurrentAchievement(achievement);
    }
  }, [currentAchievement]);

  const handleClose = useCallback(() => {
    setCurrentAchievement(null);
    // Show next in queue after a short delay
    setTimeout(() => {
      setQueue((prev) => {
        if (prev.length > 0) {
          const [next, ...rest] = prev;
          setCurrentAchievement(next);
          return rest;
        }
        return prev;
      });
    }, 300);
  }, []);

  return (
    <AchievementContext.Provider value={{ showAchievement }}>
      {children}
      <AchievementToast achievement={currentAchievement} onClose={handleClose} />
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return context;
}
