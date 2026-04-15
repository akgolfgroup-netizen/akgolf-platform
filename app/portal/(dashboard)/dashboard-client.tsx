"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, ClipboardList, TrendingUp, Target, Flag } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { NextBookingCard } from "@/components/portal/dashboard/next-booking-card";
import { NumberTicker } from "@/components/portal/dashboard/number-ticker";
import { TrainingPlanCard } from "@/components/portal/dashboard/training-plan-card";
import { CoachInsightCard } from "@/components/portal/dashboard/coach-insight-card";

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

export function DashboardClient({
  userName,
  userImage,
  tier,
  stats,
  handicap,
  nextBooking,
  weekRings,
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

  const now = new Date();
  const dayNames = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
  const monthNames = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
  const dateStr = `${dayNames[now.getDay()]} ${now.getDate()}. ${monthNames[now.getMonth()]}`;

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 pb-12 pt-6 lg:px-6 lg:pt-8">

      {/* ═══ PROFIL-HEADER ═══ */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/portal/profil"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black text-lg font-bold text-white shadow-[0_4px_16px_rgba(10,31,24,0.2)] transition-transform duration-300 hover:scale-105 overflow-hidden"
          >
            {userImage ? (
              <Image src={userImage} alt="" width={56} height={56} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </Link>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-grey-400">
              {dateStr}
            </p>
            <h1 className="text-[24px] font-bold tracking-tight text-black">
              Hei, {firstName}.
            </h1>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <div className="text-center">
            <span className="text-xl font-semibold tracking-tight text-black tabular-nums">
              {handicap.current?.toFixed(1) ?? "—"}
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-grey-400">
              HCP
            </p>
          </div>
          <div className="h-8 w-px bg-grey-200" />
          <div className="text-center">
            <span className="text-xl font-semibold tracking-tight text-black tabular-nums">
              {stats.roundsCount || 0}
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-grey-400">
              Runder
            </p>
          </div>
          <div className="h-8 w-px bg-grey-200" />
          <div className="text-center">
            <span className="text-xl font-semibold tracking-tight text-black tabular-nums">
              {stats.sessionsCount || 0}
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-grey-400">
              Økter
            </p>
          </div>
          <div className="h-8 w-px bg-grey-200" />
          <span className="rounded-full bg-accent-cta px-3 py-1 text-[11px] font-semibold text-black">
            {tierLabel[tier] ?? tier}
          </span>
        </div>
      </div>

      {/* ═══ ROW 1: Neste coaching + Ukens treningsplan ═══ */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
        <NextBookingCard booking={nextBooking} delay={0.1} />
        <TrainingPlanCard delay={0.15} />
      </div>

      {/* ═══ ROW 2: Ukekalender ═══ */}
      <div className="mt-5">
        <PremiumCard delay={0.2} className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-grey-400" />
              <span className="text-sm font-semibold text-black">
                Denne uken
              </span>
            </div>
            <Link
              href="/portal/kalender"
              className="flex items-center gap-1 text-xs font-medium text-black transition-colors hover:text-primary"
            >
              Se kalender
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekRings.days.map((day, i) => {
              const isToday = day.isToday;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center rounded-xl px-2 py-3 transition-all duration-200 ${
                    isToday
                      ? "bg-accent-cta text-black"
                      : "bg-transparent"
                  }`}
                >
                  <span className={`text-[10px] font-medium uppercase tracking-[0.06em] ${
                    isToday ? "text-black/60" : "text-grey-400"
                  }`}>
                    {day.dayLabel}
                  </span>
                  <span className={`mt-1 text-base font-semibold tabular-nums ${
                    isToday ? "text-black" : "text-black"
                  }`}>
                    {day.dateNumber}
                  </span>
                  {day.trained && (
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${
                      isToday ? "bg-black" : "bg-success"
                    }`} />
                  )}
                  {day.hasCoaching && !day.trained && (
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-black" />
                  )}
                  {day.isRest && !day.trained && !day.hasCoaching && (
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </PremiumCard>
      </div>

      {/* ═══ ROW 3: Statistikk + Coach-notater ═══ */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <PremiumCard delay={0.3}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400">
            Treningsstatistikk
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <NumberTicker
                value={handicap.current ?? 12.4}
                decimalPlaces={1}
                delay={0.4}
                className="text-[32px] font-semibold tracking-tight text-black tabular-nums"
              />
              <p className="mt-1 text-[11px] text-grey-400">HCP</p>
            </div>
            <div className="text-center">
              <NumberTicker
                value={stats.roundsCount || 24}
                delay={0.5}
                className="text-[32px] font-semibold tracking-tight text-black tabular-nums"
              />
              <p className="mt-1 text-[11px] text-grey-400">Runder</p>
            </div>
            <div className="text-center">
              <NumberTicker
                value={stats.sessionsCount || 48}
                delay={0.6}
                className="text-[32px] font-semibold tracking-tight text-black tabular-nums"
              />
              <p className="mt-1 text-[11px] text-grey-400">Økter</p>
            </div>
          </div>
          <Link
            href="/portal/statistikk"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[grey-200] bg-[grey-50] px-4 py-2.5 text-[13px] font-medium text-black transition-colors hover:bg-[grey-50]"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Se full statistikk
          </Link>
        </PremiumCard>

        <CoachInsightCard coachInsight={coachInsight} aiInsight={aiInsight} />
      </div>

      {/* ═══ ROW 4: Snarveier ═══ */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <QuickLink href="/portal/dagbok" icon={ClipboardList} label="Logg trening" />
        <QuickLink href="/portal/runde" icon={Flag} label="Registrer runde" />
        <QuickLink href="/portal/bookinger/ny" icon={Calendar} label="Book coaching" />
        <QuickLink href="/portal/ai-coach" icon={Target} label="AI Coach" />
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-[grey-200] bg-white p-4 transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(10,31,24,0.06)] hover:border-[grey-300]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[grey-50]">
        <Icon className="h-4 w-4 text-black" />
      </div>
      <span className="text-[13px] font-medium text-black">{label}</span>
    </Link>
  );
}
