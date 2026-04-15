"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Target, Zap } from "lucide-react";
import { NumberTicker } from "@/components/portal/dashboard/number-ticker";
import { PulseDot } from "@/components/portal/dashboard/pulse-dot";
import { PerformanceChart } from "@/components/portal/dashboard/performance-chart";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  userImage: string | null;
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

// Mock TrackMan season bests — ready to be replaced with real data
const trackmanBests = [
  { label: "Ball Speed", value: 162.4, unit: "mph", isPR: true },
  { label: "Carry", value: 248, unit: "m", isPR: false },
  { label: "Smash Factor", value: 1.48, unit: "", isPR: true, decimalPlaces: 2 },
];

export function DashboardClient({
  userName,
  userImage,
  tier,
  stats,
  handicap,
  handicapHistory,
  coachInsight,
  aiInsight,
}: DashboardProps) {
  const firstName = userName?.split(" ")[0] ?? "spiller";
  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "SP";

  const tierLabel: Record<string, string> = {
    VISITOR: "Gratis",
    ACADEMY: "Academy",
    STARTER: "Starter",
    PRO: "Pro",
    ELITE: "Elite",
  };

  const isTrendPositive = handicap.trend !== null && handicap.trend < 0;
  const isTrendNegative = handicap.trend !== null && handicap.trend > 0;

  // Transform handicapHistory into chart data with mock dates
  const chartData = handicapHistory.map((h, i) => ({
    date: `${i + 1}. uke`,
    handicap: h,
  }));

  // Fallback chart data if history is empty
  const fallbackChartData = [
    { date: "Jan", handicap: 14.2 },
    { date: "Feb", handicap: 13.8 },
    { date: "Mar", handicap: 13.5 },
    { date: "Apr", handicap: 12.9 },
    { date: "Mai", handicap: 12.4 },
    { date: "Jun", handicap: 11.8 },
  ];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-6 lg:px-8 lg:pt-10">
      {/* ═══════════════════════════════════════════════════════════════════════
       * 1. PERFORMANCE HERO
       * ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative mb-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-white shadow-[0_4px_20px_rgba(10,31,24,0.12)]">
              {userImage ? (
                <AvatarImage src={userImage} alt={firstName} />
              ) : null}
              <AvatarFallback className="bg-black text-lg font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 flex h-6 items-center justify-center rounded-full bg-[#D1F843] px-2 text-[10px] font-bold text-[#0A1F18] shadow-sm">
              {tierLabel[tier] ?? tier}
            </span>
          </div>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-grey-400">
              Velkommen tilbake
            </p>
            <h1 className="text-[26px] font-bold tracking-tight text-black">
              Hei, {firstName}.
            </h1>
          </div>
        </div>

        {/* Handicap Hero Stat */}
        <div className="relative flex items-center gap-4 rounded-[32px] bg-white px-8 py-5 shadow-[0_2px_8px_rgba(10,31,24,0.04),0_8px_32px_rgba(10,31,24,0.06),0_16px_48px_rgba(10,31,24,0.04)]">
          {/* Subtle lime glow behind handicap */}
          <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_30%_50%,rgba(209,248,67,0.12),transparent_60%)]" />
          
          <div className="relative text-center">
            <NumberTicker
              value={handicap.current ?? 12.4}
              decimalPlaces={1}
              delay={0.2}
              className="stat-xl text-black"
            />
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400">
              Nåværende HCP
            </p>
          </div>

          <div className="relative h-10 w-px bg-grey-200" />

          <div className="relative flex flex-col items-start gap-1">
            {handicap.trend !== null ? (
              <>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isTrendPositive
                      ? "bg-[#E8F5EF] text-[#2A7D5A]"
                      : isTrendNegative
                      ? "bg-[#FCEAE8] text-[#B84233]"
                      : "bg-grey-100 text-grey-500"
                  }`}
                >
                  {isTrendPositive ? (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  ) : isTrendNegative ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : null}
                  {Math.abs(handicap.trend).toFixed(1)}
                </div>
                <p className="text-[11px] font-medium text-grey-400">
                  {isTrendPositive ? "Bedre" : isTrendNegative ? "Dårligere" : "Uendret"} siste måned
                </p>
              </>
            ) : (
              <p className="text-xs font-medium text-grey-400">Ingen trenddata</p>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
       * 2. AI COACH INSIGHT (Bento-kort)
       * ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mb-6">
        <div className="performance-card relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[#D1F843] md:w-1/4" />
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#D1F843] via-[#D1F843] to-transparent md:w-2/5" />
          
          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#D1F843]" fill="#D1F843" />
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-grey-400">
                  AI Coach Innsikt
                </span>
              </div>
              <h2 className="text-lg font-semibold leading-snug text-black">
                {aiInsight?.focusTip ?? coachInsight?.summary ??
                  "Basert på din siste TrackMan-økt på Onsøy GK: Din 'Face to Path' er for åpen på 7-jernet. Fokus på 'Release' i neste økt."}
              </h2>
              <p className="mt-2 text-sm text-grey-500">
                {aiInsight?.summary ??
                  "Vi har analysert dine siste 3 økter og identifisert et mønster. Jobb med håndposisjonen ved impact for å redusere skjev treff."}
              </p>
            </div>

            <div className="relative z-10 flex shrink-0 flex-col items-start gap-3 md:items-end">
              <Button variant="accent" size="md" asChild>
                <Link href="/portal/treningsplan">
                  <Target className="mr-1.5 h-4 w-4" />
                  Se treningsplan
                </Link>
              </Button>
              <span className="text-[11px] font-medium text-[#0A1F18]/70">
                Oppdatert i dag
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
       * 3. TRACKMAN POWER-GRID
       * ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mb-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-grey-400" />
          <span className="text-sm font-semibold text-black">Sesongbeste — TrackMan</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {trackmanBests.map((stat, i) => (
            <div
              key={stat.label}
              className="performance-stat flex items-center justify-between"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-grey-400">
                  {stat.label}
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <NumberTicker
                    value={stat.value}
                    decimalPlaces={stat.decimalPlaces ?? (stat.value % 1 !== 0 ? 1 : 0)}
                    delay={0.3 + i * 0.1}
                    className="stat-lg text-black"
                  />
                  {stat.unit && (
                    <span className="text-sm font-medium text-grey-400">
                      {stat.unit}
                    </span>
                  )}
                </div>
              </div>
              {stat.isPR && (
                <div className="flex flex-col items-end gap-1.5">
                  <PulseDot color="lime" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#D1F843]">
                    Ny PR
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
       * 4. PROGRESS CHART (Handicap-reise)
       * ═══════════════════════════════════════════════════════════════════════ */}
      <section className="mb-8">
        <div className="performance-card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-black">Handicap-reisen</p>
              <p className="text-[12px] text-grey-400">
                {chartData.length > 0 ? "Dine siste registrerte handicap" : "Simulert utvikling basert på sesongdata"}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#E8F5EF] px-3 py-1">
              <ArrowDownRight className="h-3.5 w-3.5 text-[#2A7D5A]" />
              <span className="text-xs font-semibold text-[#2A7D5A]">
                -{((handicapHistory[handicapHistory.length - 1] ?? 12.4) - (handicapHistory[0] ?? 14.2)).toFixed(1)} i år
              </span>
            </div>
          </div>
          <PerformanceChart
            data={chartData.length > 0 ? chartData : fallbackChartData}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
       * 5. SNARVEIER
       * ═══════════════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <QuickLink href="/portal/dagbok" label="Logg trening" />
        <QuickLink href="/portal/runde" label="Registrer runde" />
        <QuickLink href="/portal/bookinger/ny" label="Book coaching" />
        <QuickLink href="/portal/ai-coach" label="AI Coach" />
      </section>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-[rgba(10,31,24,0.06)] bg-white px-5 py-4 shadow-[0_2px_8px_rgba(10,31,24,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(10,31,24,0.10)] hover:shadow-[0_4px_16px_rgba(10,31,24,0.06)]"
    >
      <span className="text-[13px] font-semibold text-black">{label}</span>
      <ArrowUpRight className="h-4 w-4 text-grey-400 transition-colors group-hover:text-black" />
    </Link>
  );
}
