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

      {/* RAD 4: Coach Insight + Snarveier */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        <CoachInsightCard coachInsight={coachInsight} />
        <ShortcutPills />
      </motion.div>
    </motion.div>
  );
}

function EmptyKpiCard({
  label,
  message,
  href,
}: {
  label: string;
  message: string;
  href: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-grey-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-grey-200 hover:shadow-md">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-400">
          {label}
        </p>
        <p className="mt-2 text-sm text-grey-400">{message}</p>
        <a
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: colors.primary.main }}
        >
          Kom i gang
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
