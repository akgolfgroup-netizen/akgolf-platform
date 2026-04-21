"use client";

import { motion } from "framer-motion";
import { WelcomeSection } from "@/components/portal/dashboard/welcome-section";
import { NextBookingCard } from "@/components/portal/dashboard/next-booking-card";
import { WeekCalendar } from "@/components/portal/dashboard/week-calendar";
import { KpiCard } from "@/components/portal/dashboard/kpi-card";
import { CoachInsightCard } from "@/components/portal/dashboard/coach-insight-card";
import { PlayerProfileCard } from "@/components/portal/dashboard/player-profile-card";
import { TrainingActivityCard } from "@/components/portal/dashboard/training-activity-card";
import { AiInsightCard } from "@/components/portal/dashboard/ai-insight-card";
import { ShortcutPills } from "@/components/portal/dashboard/shortcut-pills";
import { HandicapTrendChart } from "@/components/portal/dashboard/handicap-trend-chart";
import { SessionsDonut } from "@/components/portal/dashboard/sessions-donut";
import { SGRadarCard } from "@/components/portal/dashboard/sg-radar-card";
import { EmptyKpiCard } from "@/components/portal/dashboard/empty-kpi-card";
import { colors } from "@/lib/design-tokens";

interface WeekDay {
  dayLabel: string;
  dateNumber: number;
  trained: boolean;
  hasCoaching: boolean;
  isToday: boolean;
  isRest: boolean;
  completionPercent: number;
}

interface NextBooking {
  id: string;
  instructorName: string;
  serviceName: string;
  duration: number;
  startTime: Date | string;
}

interface CoachInsight {
  focusAreas: string[] | null;
  primaryFocus: string | null;
  summary: string | null;
  date: Date | string;
}

interface AiInsight {
  summary: string;
  strengths: string[];
  improvements: string[];
  focusTip: string;
  generatedAt: Date | string;
}

interface DashboardProps {
  userName: string | null;
  tier: string;
  memberSince: string | null;
  stats: { sessionsCount: number; roundsCount: number };
  handicap: { current: number | null; trend: number | null };
  handicapHistory: number[];
  nextBooking: NextBooking | null;
  weekRings: { days: WeekDay[]; weekStart: string };
  coachInsight: CoachInsight | null;
  aiInsight: AiInsight | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

function generateFallbackSparkline(baseValue: number, points: number): number[] {
  return Array.from({ length: points }, (_, i) =>
    Math.max(0, baseValue + Math.sin(i) * 2)
  );
}

export function DashboardClient({
  userName,
  tier,
  memberSince,
  stats,
  handicap,
  handicapHistory,
  nextBooking,
  weekRings,
  coachInsight,
  aiInsight,
}: DashboardProps) {
  const handicapSparkline =
    handicapHistory.length > 0
      ? handicapHistory
      : generateFallbackSparkline(handicap.current ?? 14, 10);

  const roundsSparkline =
    stats.roundsCount > 0 ? generateFallbackSparkline(stats.roundsCount, 6) : [];

  const sessionsSparkline =
    stats.sessionsCount > 0
      ? generateFallbackSparkline(stats.sessionsCount, 8)
      : [];

  return (
    <motion.div
      className="mx-auto w-full max-w-[1200px] space-y-5 pb-12 pt-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* RAD 1: Velkomst + Neste booking + Profil */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-5 lg:grid-cols-12"
      >
        <div className="space-y-5 lg:col-span-8">
          <WelcomeSection
            userName={userName}
            tier={tier}
            memberSince={memberSince}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <NextBookingCard booking={nextBooking} />
            <AiInsightCard
              summary={
                aiInsight?.summary ?? "Kort spill er ditt største potensial"
              }
              metrics={[
                { label: "Kort Spill", value: "-2.1", highlight: true },
                { label: "Driving", value: "+1.4", highlight: false },
                { label: "Putting", value: "+0.8", highlight: false },
              ]}
            />
          </div>
        </div>
        <div className="lg:col-span-4">
          <PlayerProfileCard
            userName={userName}
            tier={tier}
            memberSince={memberSince}
            handicap={handicap.current}
            roundsCount={stats.roundsCount}
          />
        </div>
      </motion.div>

      {/* RAD 2: Ukekalender */}
      <motion.div variants={item}>
        <WeekCalendar days={weekRings.days} />
      </motion.div>

      {/* RAD 3: Treningsaktivitet + KPI-kort */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TrainingActivityCard
          sessionsCount={stats.sessionsCount}
          streak={12}
        />

        <KpiCard
          label="Handicap"
          value={handicap.current ?? 0}
          decimalPlaces={1}
          sparklineData={handicapSparkline}
          change={handicap.trend}
          changeLabel="siste måned"
          accentColor={colors.primary.main}
        />

        <div className="flex flex-col gap-5">
          {stats.roundsCount > 0 ? (
            <KpiCard
              label="Runder"
              value={stats.roundsCount}
              sparklineData={roundsSparkline}
              accentColor={colors.data.coral}
            />
          ) : (
            <EmptyKpiCard
              label="Runder"
              message="Registrer din første runde for å se handicap-trend"
              href="/portal/runde/ny"
            />
          )}

          {stats.sessionsCount > 0 ? (
            <KpiCard
              label="Treningsøkter"
              value={stats.sessionsCount}
              sparklineData={sessionsSparkline}
              accentColor={colors.primary.main}
            />
          ) : (
            <EmptyKpiCard
              label="Treningsøkter"
              message="Logg din første økt i dagboken"
              href="/portal/dagbok"
            />
          )}
        </div>
      </motion.div>

      {/* RAD 3.5: Diagrammer */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-5 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <HandicapTrendChart data={handicapHistory} />
        </div>
        <div className="lg:col-span-5">
          <SessionsDonut />
        </div>
      </motion.div>

      {/* RAD 4: SG Radar + Coach Insight + Snarveier */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-5 lg:grid-cols-12"
      >
        <div className="lg:col-span-4">
          <SGRadarCard />
        </div>
        <div className="lg:col-span-5">
          <CoachInsightCard coachInsight={coachInsight} />
        </div>
        <div className="lg:col-span-3">
          <ShortcutPills />
        </div>
      </motion.div>
    </motion.div>
  );
}


