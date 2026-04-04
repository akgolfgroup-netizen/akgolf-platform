"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  Flame,
  Calendar,
  ArrowRight,
  RefreshCw,
  Brain,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

type InsightType = "tip" | "trend" | "suggestion" | "achievement" | "reminder";
type InsightPriority = "low" | "medium" | "high";

interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  priority: InsightPriority;
}

interface PersonalInsightsProps {
  insights: Insight[];
  userName?: string;
  handicap?: number;
  streak?: number;
}

const typeConfig: Record<InsightType, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  tip: { icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10" },
  trend: { icon: TrendingUp, color: "text-[#2D6A4F]", bg: "bg-[#2D6A4F]/10" },
  suggestion: { icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
  achievement: { icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  reminder: { icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
};

// Generate dynamic insights based on user data
function generateInsights(
  handicap?: number,
  streak?: number,
  userName?: string
): Insight[] {
  const insights: Insight[] = [];
  const firstName = userName?.split(" ")[0] ?? "du";

  // Streak-based insights
  if (streak !== undefined) {
    if (streak === 0) {
      insights.push({
        id: "start-streak",
        type: "suggestion",
        title: "Start din treningsstreak i dag",
        description: "Logg en treningsokt for a starte en ny streak. Konsistens er nokkel til forbedring!",
        action: { label: "Logg okt", href: "/portal/dagbok" },
        priority: "high",
      });
    } else if (streak >= 7) {
      insights.push({
        id: "streak-celebration",
        type: "achievement",
        title: `${streak} dager i rad, ${firstName}!`,
        description: "Imponerende dedikasjon! Fortsett slik for a na dine mal raskere.",
        priority: "medium",
      });
    } else if (streak >= 3) {
      insights.push({
        id: "streak-motivation",
        type: "tip",
        title: "Streaken din vokser!",
        description: `${streak} dager med trening. 4 dager til for a na ukemal!`,
        priority: "low",
      });
    }
  }

  // Handicap-based insights
  if (handicap !== undefined) {
    if (handicap > 20) {
      insights.push({
        id: "focus-short-game",
        type: "tip",
        title: "Fokuser pa kortspillet",
        description: "Spillere med HCP over 20 sparer flest slag pa putting og naerspill. Prioriter dette!",
        action: { label: "Se ovelser", href: "/portal/trening/ovelser" },
        priority: "high",
      });
    } else if (handicap <= 10) {
      insights.push({
        id: "course-management",
        type: "suggestion",
        title: "Banemanagement er nokkel",
        description: "Pa ditt niva handler det om a ta smarte valg. Analyser dine runder for bedre strategi.",
        action: { label: "Se statistikk", href: "/portal/statistikk" },
        priority: "medium",
      });
    }
  }

  // Time-based insights
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) {
    insights.push({
      id: "morning-practice",
      type: "tip",
      title: "Morgentrening er effektivt",
      description: "Studier viser at ovelser gjort om morgenen huskes bedre. Perfekt tid for en okt!",
      priority: "low",
    });
  }

  // Default fallback insight
  if (insights.length === 0) {
    insights.push({
      id: "general-tip",
      type: "tip",
      title: "Tips for dagen",
      description: "Visualisering for en runde kan forbedre prestasjon med opptil 10%. Prov det!",
      priority: "low",
    });
  }

  return insights;
}

export function PersonalInsights({
  insights: providedInsights,
  userName,
  handicap,
  streak,
}: PersonalInsightsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use provided insights or generate them
  const insights = providedInsights.length > 0
    ? providedInsights
    : generateInsights(handicap, streak, userName);

  const currentInsight = insights[currentIndex];
  const config = typeConfig[currentInsight.type];
  const Icon = config.icon;

  // Auto-rotate insights
  useEffect(() => {
    if (insights.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [insights.length]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentIndex((prev) => (prev + 1) % insights.length);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="portal-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <Brain className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Personlige innsikter
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </h3>
            <p className="text-[10px] text-[var(--portal-text-muted)] uppercase tracking-wider">
              AI-drevet
            </p>
          </div>
        </div>

        {insights.length > 1 && (
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
            aria-label="Neste innsikt"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <RefreshCw className="w-4 h-4 text-[var(--portal-text-muted)]" />
            </motion.div>
          </button>
        )}
      </div>

      {/* Insight content */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentInsight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white mb-1">
                  {currentInsight.title}
                </h4>
                <p className="text-xs text-[var(--portal-text-muted)] leading-relaxed">
                  {currentInsight.description}
                </p>

                {currentInsight.action && (
                  <Link
                    href={currentInsight.action.href}
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[var(--color-grey-900)] hover:text-[var(--color-grey-500)] transition-colors"
                  >
                    {currentInsight.action.label}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination dots */}
        {insights.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {insights.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-[width,background-color] cursor-pointer ${
                  idx === currentIndex
                    ? "w-4 bg-[var(--color-grey-900)]"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Innsikt ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
