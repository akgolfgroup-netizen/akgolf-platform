"use client";

import { Flame, Target, TrendingDown, BarChart3 } from "lucide-react";
import {
  GreetingHeader,
  PlayerProfileCompactCard,
  NextBookingCard,
  WeekRingsGrid,
  DailyChecklistCard,
  QuickActionsRow,
  AchievementShowcase,
} from "@/components/portal/dashboard";
import { StatCard } from "@/components/portal/dashboard/stat-card";
import { StrokesGainedCard } from "@/components/portal/dashboard/strokes-gained-card";
import { HandicapSparklineCard } from "@/components/portal/dashboard/handicap-sparkline-card";
import { TrainingPlanCard } from "@/components/portal/dashboard/training-plan-card";
import { AiInsightCard } from "@/components/portal/dashboard/ai-insight-card";
import { CoachInsightCard } from "@/components/portal/dashboard/coach-insight-card";

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

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  href?: string;
}

type Rarity = "common" | "rare" | "epic" | "legendary";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  unlockedAt?: string;
  progress?: number;
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
  checklist: ChecklistItem[];
  achievements: {
    achievements: Achievement[];
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
  tier,
  memberSince,
  stats,
  handicap,
  handicapHistory,
  nextBooking,
  weekRings,
  checklist,
  achievements,
  coachInsight,
  aiInsight,
}: DashboardProps) {
  const weekProgressPercent = Math.round(
    (weekRings.days.filter((d) => d.trained).length / weekRings.days.length) * 100,
  );
  const streakDays = Math.min(stats.sessionsCount, 14);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 md:pb-10 lg:px-6">
      <GreetingHeader userName={userName} />

      {/* Row 1: 4 stat-kort */}
      <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <PlayerProfileCompactCard
          name={userName}
          tier={tier}
          handicap={handicap.current}
          trend={handicap.trend}
          memberSince={memberSince}
          roundsCount={stats.roundsCount}
          index={0}
        />
        <StatCard
          label="Handicap"
          value={handicap.current ?? 0}
          decimalPlaces={1}
          change={
            handicap.trend !== null
              ? { value: Math.abs(handicap.trend), positive: handicap.trend > 0 }
              : null
          }
          icon={TrendingDown}
          accentColor="var(--color-primary)"
          lowerIsBetter
          index={1}
        />
        <StatCard
          label="Ukemål"
          value={weekProgressPercent}
          unit="%"
          change={null}
          icon={Target}
          accentColor="var(--color-success)"
          index={2}
        />
        <StatCard
          label="Streak"
          value={streakDays}
          unit="dager"
          change={null}
          icon={Flame}
          accentColor="var(--color-warning)"
          index={3}
        />
      </section>

      {/* Row 2: Bento grid — 12 kolonner */}
      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
        {/* Neste coaching — span 4 */}
        <div className="md:col-span-3 lg:col-span-4">
          <NextBookingCard booking={nextBooking} delay={0.3} />
        </div>

        {/* Ukens aktivitet — span 4 */}
        <div className="md:col-span-3 lg:col-span-4">
          <WeekRingsGrid days={weekRings.days} weekStart={weekRings.weekStart} />
        </div>

        {/* AI-innsikt — span 4 */}
        <div className="md:col-span-6 lg:col-span-4">
          <AiInsightCard insight={aiInsight} delay={0.4} />
        </div>
      </section>

      {/* Row 3: Chart + Strokes Gained */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Handicap sparkline — span 8 */}
        <div className="lg:col-span-8">
          <HandicapSparklineCard
            history={handicapHistory}
            currentHcp={handicap.current}
            delay={0.5}
          />
        </div>

        {/* Strokes Gained — span 4 */}
        <div className="lg:col-span-4">
          <StrokesGainedCard delay={0.55} />
        </div>
      </section>

      {/* Row 4: Treningsplan + Coach + Sjekkliste */}
      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
        {/* Treningsplan — span 4 */}
        <div className="md:col-span-3 lg:col-span-4">
          <TrainingPlanCard delay={0.6} />
        </div>

        {/* Coach-innsikt — span 4 */}
        <div className="md:col-span-3 lg:col-span-4">
          <CoachInsightCard coachInsight={coachInsight} aiInsight={aiInsight} />
        </div>

        {/* Sjekkliste — span 4 */}
        <div className="md:col-span-6 lg:col-span-4">
          <DailyChecklistCard items={checklist} />
        </div>
      </section>

      {/* Row 5: Achievements + Quick actions */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <AchievementShowcase
            achievements={achievements.achievements}
            totalAchievements={achievements.totalAchievements}
          />
        </div>
        <div className="lg:col-span-4">
          <div className="rounded-xl bg-white p-5 shadow-card">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Snarveier
            </p>
            <QuickActionsRow />
          </div>
        </div>
      </section>
    </div>
  );
}
