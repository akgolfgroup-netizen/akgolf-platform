"use client";

import { Sparkles, TrendingUp } from "lucide-react";
import { HeroCard } from "@/components/portal/dashboard/hero-card";
import { StatCard } from "@/components/portal/dashboard/stat-card";
import { TrainingActivityCard } from "@/components/portal/dashboard/training-activity-card";
import { ScoreRingCard } from "@/components/portal/dashboard/score-ring-card";
import { HandicapSparklineCard } from "@/components/portal/dashboard/handicap-sparkline-card";
import { StrokesGainedCard } from "@/components/portal/dashboard/strokes-gained-card";
import { VisualCard } from "@/components/portal/dashboard/visual-card";
import { NextBookingCard } from "@/components/portal/dashboard/next-booking-card";
import { AiInsightCard } from "@/components/portal/dashboard/ai-insight-card";
import { TrainingPlanCard } from "@/components/portal/dashboard/training-plan-card";

// ── Types ──────────────────────────────────────────────────────────────────────

interface WeeklyInsight {
  summary: string;
  strengths: string[];
  improvements: string[];
  focusTip: string;
  generatedAt: string | Date;
}

interface WeekDay {
  dayLabel: string;
  dateNumber: number;
  trained: boolean;
  hasCoaching: boolean;
  isToday: boolean;
  isRest: boolean;
  completionPercent: number;
}

interface DashboardProps {
  userName: string | null;
  tier: string;
  memberSince: string | null;
  stats: { sessionsCount: number; roundsCount: number };
  handicap: { current: number | null; trend: number | null };
  handicapHistory: number[];
  nextBooking: {
    id: string;
    instructorName: string;
    serviceName: string;
    duration: number;
    startTime: Date | string;
  } | null;
  weekRings: { days: WeekDay[]; weekStart: string };
  checklist: { id: string; label: string; completed: boolean; href?: string }[];
  achievements: {
    achievements: {
      id: string; name: string; description: string; icon: string;
      rarity: "common" | "rare" | "epic" | "legendary";
      unlockedAt?: string; progress?: number;
    }[];
    totalAchievements: number;
  };
  coachInsight: {
    focusAreas: string[] | null;
    primaryFocus: string | null;
    summary: string | null;
    date: Date | string;
  } | null;
  aiInsight: WeeklyInsight | null;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function DashboardClient({
  userName,
  stats,
  handicap,
  handicapHistory,
  nextBooking,
  weekRings,
  aiInsight,
}: DashboardProps) {
  const weeklyHours = weekRings.days.map((d) =>
    d.trained ? 1 + d.completionPercent * 0.02 : 0,
  );

  const heroStats = [
    {
      value: handicap.current ?? 78.2,
      label: "Snitt score",
      change: "-1.4",
      positive: true,
      decimals: 1,
    },
    { value: 4.2, label: "Spredning", change: "-0.8", positive: true, decimals: 1 },
    { value: 68, label: "GIR", change: "+5%", positive: true, decimals: 0 },
    { value: stats.sessionsCount || 12, label: "Okter", change: "+3", decimals: 0 },
  ];

  return (
    <div className="mx-auto w-full max-w-[1480px] px-6 pb-10 pt-6">

      {/* ═══ TOP ROW: Hero + 2 stat-kort ═══ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <HeroCard
          userName={userName}
          stats={heroStats}
          subtitle="Din treningsinnsats denne uken er over gjennomsnittet. Fortsett slik."
        />
        <div className="flex flex-col gap-4">
          <StatCard
            label="Beste runde"
            value={74}
            icon={TrendingUp}
            accentColor="var(--color-green-bright)"
            glowType="green"
            badge="Ny personlig rekord"
            index={0}
          />
          <StatCard
            label="AI-anbefalinger"
            value={3}
            icon={Sparkles}
            accentColor="var(--color-ai)"
            glowType="ai"
            badge="Se innsikt"
            index={1}
          />
        </div>
      </div>

      {/* ═══ MAIN 3-COL GRID ═══ */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr_320px]">

        {/* ── LEFT: Treningsoversikt (spans all center rows) ── */}
        <div className="lg:row-span-3">
          <TrainingActivityCard weeklyHours={weeklyHours} delay={0.15} />
        </div>

        {/* ── CENTER: Scoring + Chart + Fokus ── */}
        <div className="flex flex-col gap-4">
          <ScoreRingCard
            score={handicap.current ?? 78}
            metrics={[
              { label: "Beste runde", value: "74", trend: "up" },
              { label: "Siste 5 runder", value: "-1.2", trend: "up" },
              { label: "Spredning", value: "4.2", trend: "up" },
              { label: "Fairway", value: "64%" },
            ]}
            delay={0.2}
          />
          <HandicapSparklineCard
            history={handicapHistory}
            currentHcp={handicap.current}
            delay={0.3}
          />
          <StrokesGainedCard delay={0.4} />
        </div>

        {/* ── RIGHT: Visual + Booking + AI + Visual + Plan ── */}
        <div className="flex flex-col gap-4">
          <VisualCard
            imageSrc="/images/sections/putting.jpg"
            tag="Siste okt"
            title="Putting-drill med Anders"
            meta="Onsdag 9. april \u00b7 30 min"
            delay={0.15}
          />
          <NextBookingCard booking={nextBooking} delay={0.25} />
          <AiInsightCard insight={aiInsight} delay={0.35} />
          <VisualCard
            imageSrc="/images/sections/banecoaching.jpg"
            tag="Kommende"
            title="Banecoaching 9 hull"
            meta="Lordag 12. april \u00b7 Ettermiddag"
            delay={0.4}
          />
          <TrainingPlanCard delay={0.45} />
        </div>
      </div>
    </div>
  );
}
