"use client";

import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { nb } from "date-fns/locale";
import { BookOpen, BarChart3, Calendar } from "lucide-react";
import { Sparkline } from "@/components/portal/dashboard/sparkline";
import { StreakCard } from "@/components/portal/dashboard/streak-card";
import { SGOverviewCard } from "@/components/portal/dashboard/sg-overview-card";
import { AIRecommendationCard } from "@/components/portal/dashboard/ai-recommendation-card";
import { WeeklyPlanCard } from "@/components/portal/dashboard/weekly-plan-card";

interface WeeklyInsight {
  summary: string;
  strengths: string[];
  improvements: string[];
  focusTip: string;
  generatedAt: string | Date;
}

interface DashboardProps {
  userName: string | null;
  stats: { sessionsCount: number; roundsCount: number };
  handicap: { current: number | null; trend: number | null };
  nextBooking: {
    id: string;
    instructorName: string;
    serviceName: string;
    duration: number;
    startTime: Date;
  } | null;
  coachInsight: {
    focusAreas: string[] | null;
    primaryFocus: string | null;
    summary: string | null;
    date: Date;
  } | null;
  aiInsight: WeeklyInsight | null;
}

export function DashboardClient({
  userName,
  stats,
  handicap,
  nextBooking,
  coachInsight,
  aiInsight,
}: DashboardProps) {
  const hasData = stats.sessionsCount > 0 || handicap.current !== null;
  const now = new Date();
  const greeting = now.getHours() < 12 ? "God morgen" : now.getHours() < 18 ? "God ettermiddag" : "God kveld";
  const firstName = userName?.split(" ")[0];

  if (!hasData) {
    return <OnboardingView userName={userName} />;
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-[22px] font-bold text-[#1D1D1F]">
          {greeting}{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-xs text-[#86868B] mt-1">
          {format(now, "EEEE d. MMMM yyyy", { locale: nb })}
        </p>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Handicap */}
        <div className="bg-white border border-[#E8E8ED] rounded-[14px] p-4">
          <span className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium">HCP</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[26px] font-extrabold text-[#1D1D1F] tabular-nums">
              {handicap.current !== null ? handicap.current.toFixed(1) : "\u2014"}
            </span>
            {handicap.trend !== null && (
              <span className={`text-[11px] font-semibold ${handicap.trend < 0 ? "text-[#2D6A4F]" : handicap.trend > 0 ? "text-[#D14343]" : "text-[#86868B]"}`}>
                {handicap.trend > 0 ? "+" : ""}{handicap.trend.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Okter med sparkline */}
        <div className="bg-white border border-[#E8E8ED] rounded-[14px] p-4">
          <span className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium">Okter</span>
          <div className="flex items-end justify-between mt-1">
            <span className="text-[26px] font-extrabold text-[#1D1D1F] tabular-nums">{stats.sessionsCount}</span>
            <Sparkline />
          </div>
        </div>

        {/* Neste coaching */}
        <div className="bg-white border border-[#E8E8ED] rounded-[14px] p-4">
          <span className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium">Neste coaching</span>
          {nextBooking ? (
            <div className="mt-1">
              <span className="text-sm font-semibold text-[#1D1D1F]">
                {formatBookingDate(new Date(nextBooking.startTime))}
              </span>
              <p className="text-xs text-[#86868B] mt-0.5">
                kl. {format(new Date(nextBooking.startTime), "HH:mm")} m/ {nextBooking.instructorName}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#D2D2D7] mt-1">Ingen planlagt</p>
          )}
        </div>

        {/* Streak */}
        <StreakCard days={stats.sessionsCount > 0 ? Math.min(stats.sessionsCount, 7) : 0} />
      </div>

      {/* SG + AI row */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <SGOverviewCard />
        <AIRecommendationCard recommendation={aiInsight?.focusTip || coachInsight?.summary} />
      </div>

      {/* Weekly plan */}
      <WeeklyPlanCard />

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link
          href="/portal/statistikk/ny-runde"
          className="flex items-center gap-3 px-5 py-4 bg-[#1D1D1F] text-white rounded-[14px] font-semibold text-sm hover:bg-[#3A3A3C] transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          Logg runde
        </Link>
        <Link
          href="/portal/dagbok"
          className="flex items-center gap-3 px-5 py-4 bg-white text-[#1D1D1F] border border-[#E8E8ED] rounded-[14px] font-semibold text-sm hover:bg-[#F5F5F7] transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          Logg okt
        </Link>
        <Link
          href="/portal/bookinger/ny"
          className="flex items-center gap-3 px-5 py-4 bg-[#2D6A4F] text-white rounded-[14px] font-semibold text-sm hover:bg-[#1B4332] transition-colors"
        >
          <Calendar className="w-5 h-5" />
          Book coaching
        </Link>
      </div>
    </div>
  );
}

function OnboardingView({ userName }: { userName: string | null }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-[#1D1D1F]">
          Velkommen{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-sm text-[#86868B] mt-1">
          Her er 3 ting du kan gjore for a komme i gang:
        </p>
      </div>

      {/* Mocked preview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-40 pointer-events-none">
        <div className="bg-white border border-[#E8E8ED] rounded-[14px] p-4">
          <span className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium">HCP</span>
          <span className="block text-[26px] font-extrabold text-[#D2D2D7] tabular-nums mt-1">18.4</span>
        </div>
        <div className="bg-white border border-[#E8E8ED] rounded-[14px] p-4">
          <span className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium">Okter</span>
          <span className="block text-[26px] font-extrabold text-[#D2D2D7] tabular-nums mt-1">0</span>
        </div>
        <div className="bg-white border border-[#E8E8ED] rounded-[14px] p-4">
          <span className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium">Neste coaching</span>
          <span className="block text-sm text-[#D2D2D7] mt-1">Ingen planlagt</span>
        </div>
        <div className="bg-[#FFFBF5] border border-[#F5E6CC] rounded-[14px] p-4">
          <span className="text-[10px] uppercase tracking-[1px] text-[#86868B] font-medium">Streak</span>
          <span className="block text-[26px] font-extrabold text-[#D2D2D7] tabular-nums mt-1">0</span>
        </div>
      </div>

      {/* Onboarding steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OnboardingCard
          step={1}
          href="/portal/bookinger/ny"
          icon={Calendar}
          title="Book en time"
          description="Start med en coaching-okt for a fa din forste analyse"
        />
        <OnboardingCard
          step={2}
          href="/portal/statistikk/ny-runde"
          icon={BarChart3}
          title="Registrer en runde"
          description="Logg din forste golfrunde for a spore fremgangen"
        />
        <OnboardingCard
          step={3}
          href="/portal/profil"
          icon={BookOpen}
          title="Sett mal"
          description="Definer dine golfmal for a fa personlige anbefalinger"
        />
      </div>
    </div>
  );
}

function OnboardingCard({
  step,
  href,
  icon: Icon,
  title,
  description,
}: {
  step: number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block p-5 rounded-[14px] bg-white border border-[#E8E8ED] hover:border-[#2D6A4F]/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center">
          {step}
        </span>
        <Icon className="w-5 h-5 text-[#86868B]" />
      </div>
      <p className="font-semibold text-[#1D1D1F] text-sm">{title}</p>
      <p className="text-xs text-[#86868B] mt-1">{description}</p>
    </Link>
  );
}

function formatBookingDate(date: Date): string {
  if (isToday(date)) return "I dag";
  if (isTomorrow(date)) return "I morgen";
  return format(date, "EEEE d. MMMM", { locale: nb });
}
