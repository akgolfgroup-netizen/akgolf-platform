"use client";

import { motion } from "framer-motion";
import { Dumbbell, Flag, CalendarPlus, Bot, Activity, ArrowRight } from "lucide-react";
import { WelcomeSection } from "@/components/portal/dashboard/welcome-section";
import { NextBookingCard } from "@/components/portal/dashboard/next-booking-card";
import { WeekRings } from "@/components/portal/dashboard/week-rings";
import { KpiCard } from "@/components/portal/dashboard/kpi-card";
import { CoachInsightCard } from "@/components/portal/dashboard/coach-insight-card";
import { ShortcutCard } from "@/components/portal/dashboard/shortcut-card";

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
      className="mx-auto w-full max-w-[1200px] space-y-6 pb-12 pt-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* RAD 1: Velkomst + Neste booking */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center">
          <WelcomeSection
            userName={userName}
            tier={tier}
            memberSince={memberSince}
          />
        </div>
        <NextBookingCard booking={nextBooking} />
      </motion.div>

      {/* RAD 2: Ukekalender */}
      <motion.div variants={item}>
        <WeekRings days={weekRings.days} />
      </motion.div>

      {/* RAD 3: KPI-kort + Coach Insight */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <KpiCard
          label="Handicap"
          value={handicap.current ?? 0}
          decimalPlaces={1}
          sparklineData={handicapSparkline}
          change={handicap.trend}
          changeLabel="siste maned"
        />

        {stats.roundsCount > 0 ? (
          <KpiCard
            label="Runder"
            value={stats.roundsCount}
            sparklineData={roundsSparkline}
          />
        ) : (
          <EmptyKpiCard
            label="Runder"
            message="Registrer din forste runde for a se handicap-trend"
            href="/portal/runde/ny"
          />
        )}

        {stats.sessionsCount > 0 ? (
          <KpiCard
            label="Treningsokter"
            value={stats.sessionsCount}
            sparklineData={sessionsSparkline}
          />
        ) : (
          <EmptyKpiCard
            label="Treningsokter"
            message="Logg din forste okt i dagboken"
            href="/portal/dagbok"
          />
        )}

        <div className="md:col-span-2 lg:col-span-1">
          <CoachInsightCard coachInsight={coachInsight} aiInsight={aiInsight} />
        </div>
      </motion.div>

      {/* RAD 4: Snarveier */}
      <motion.div
        variants={item}
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <ShortcutCard
          href="/portal/dagbok"
          icon={Dumbbell}
          title="Logg trening"
          subtitle="Registrer dagens okt"
        />
        <ShortcutCard
          href="/portal/runde/ny"
          icon={Flag}
          title="Registrer runde"
          subtitle="Hull-for-hull"
        />
        <ShortcutCard
          href="/portal/bookinger/ny"
          icon={CalendarPlus}
          title="Book coaching"
          subtitle="Velg trener og tid"
        />
        <ShortcutCard
          href="/portal/ai-coach"
          icon={Bot}
          title="AI Coach"
          subtitle="Spor om hva som helst"
        />
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
    <div className="flex flex-col justify-between rounded-2xl border border-grey-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-grey-50">
        <Activity className="h-5 w-5 text-grey-300" />
      </div>
      <div className="mt-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-grey-400">
          {label}
        </p>
        <p className="mt-2 text-sm text-grey-400">{message}</p>
        <a
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Kom i gang
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
