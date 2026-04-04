"use client";

import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";
import { BookOpen, BarChart3, Calendar } from "lucide-react";
import { Sparkline } from "@/components/portal/dashboard/sparkline";
import { StreakCard } from "@/components/portal/dashboard/streak-card";
import { SGOverviewCard } from "@/components/portal/dashboard/sg-overview-card";
import { AIRecommendationCard } from "@/components/portal/dashboard/ai-recommendation-card";
import { WeeklyPlanCard } from "@/components/portal/dashboard/weekly-plan-card";

/* ── Animation variants ── */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const blurReveal = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const staggerGrid = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const staggerCard = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

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
  const greeting =
    now.getHours() < 12
      ? "God morgen"
      : now.getHours() < 18
        ? "God ettermiddag"
        : "God kveld";
  const firstName = userName?.split(" ")[0];

  if (!hasData) {
    return <OnboardingView userName={userName} />;
  }

  return (
    <div className="space-y-6">
      {/* ── Greeting ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={blurReveal}
      >
        <h1 className="text-[28px] font-medium tracking-[-0.02em] text-[#1D1D1F]">
          {greeting}
          {firstName ? `, ${firstName}.` : "."}
        </h1>
        <p className="text-sm text-[#86868B] mt-1">
          {format(now, "EEEE d. MMMM yyyy", { locale: nb })}
          {nextBooking && (
            <span className="text-[#1D1D1F] font-medium">
              {" "}
              &middot; Neste okt {formatBookingDate(new Date(nextBooking.startTime))} kl.{" "}
              {format(new Date(nextBooking.startTime), "HH:mm")}
            </span>
          )}
        </p>
      </motion.div>

      {/* ── 4 Stat Cards ── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={staggerGrid}
      >
        {/* Handicap */}
        <motion.div variants={staggerCard} className="portal-stat-card">
          <span className="portal-label">Handicap</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[32px] font-bold text-[#1D1D1F] tabular-nums leading-none">
              {handicap.current !== null
                ? handicap.current.toFixed(1)
                : "\u2014"}
            </span>
            {handicap.trend !== null && (
              <span
                className={`text-sm font-semibold ${
                  handicap.trend < 0
                    ? "text-[#2D6A4F]"
                    : handicap.trend > 0
                      ? "text-[#D14343]"
                      : "text-[#86868B]"
                }`}
              >
                {handicap.trend > 0 ? "+" : ""}
                {handicap.trend.toFixed(1)}
              </span>
            )}
          </div>
          <div className="mt-3">
            <Sparkline
              color={handicap.trend !== null && handicap.trend < 0 ? "#2D6A4F" : "#D14343"}
            />
          </div>
        </motion.div>

        {/* Treningsokter */}
        <motion.div variants={staggerCard} className="portal-stat-card">
          <span className="portal-label">Treningsokter</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[32px] font-bold text-[#1D1D1F] tabular-nums leading-none">
              {stats.sessionsCount}
            </span>
          </div>
          <div className="mt-3">
            <Sparkline />
          </div>
        </motion.div>

        {/* Neste coaching */}
        <motion.div variants={staggerCard} className="portal-stat-card">
          <span className="portal-label">Neste coaching</span>
          {nextBooking ? (
            <div className="mt-2">
              <span className="text-base font-semibold text-[#1D1D1F]">
                {nextBooking.serviceName}
              </span>
              <p className="text-sm text-[#86868B] mt-1">
                {formatBookingDate(new Date(nextBooking.startTime))} kl.{" "}
                {format(new Date(nextBooking.startTime), "HH:mm")}
              </p>
              <p className="text-xs text-[#86868B] mt-0.5">
                {nextBooking.duration} min &middot; {nextBooking.instructorName}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#D2D2D7] mt-2">Ingen planlagt</p>
          )}
        </motion.div>

        {/* Streak */}
        <motion.div variants={staggerCard}>
          <StreakCard
            days={stats.sessionsCount > 0 ? Math.min(stats.sessionsCount, 14) : 0}
          />
        </motion.div>
      </motion.div>

      {/* ── SG + AI Row ── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={staggerGrid}
      >
        <motion.div variants={staggerCard}>
          <SGOverviewCard />
        </motion.div>
        <motion.div variants={staggerCard}>
          <AIRecommendationCard
            recommendation={
              aiInsight?.focusTip || coachInsight?.summary
            }
          />
        </motion.div>
      </motion.div>

      {/* ── Weekly Plan ── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={blurReveal}
      >
        <WeeklyPlanCard />
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={staggerGrid}
      >
        <motion.div variants={staggerCard}>
          <Link
            href="/portal/statistikk/ny-runde"
            className="flex items-center gap-3 px-5 py-4 bg-[#1D1D1F] text-white rounded-[16px] font-semibold text-sm hover:bg-[#3A3A3C] transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Logg runde
          </Link>
        </motion.div>
        <motion.div variants={staggerCard}>
          <Link
            href="/portal/dagbok"
            className="flex items-center gap-3 px-5 py-4 bg-white text-[#1D1D1F] border border-[#E8E8ED] rounded-[16px] font-semibold text-sm hover:bg-[#F5F5F7] transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Logg okt
          </Link>
        </motion.div>
        <motion.div variants={staggerCard}>
          <Link
            href="/portal/bookinger/ny"
            className="flex items-center gap-3 px-5 py-4 bg-[#2D6A4F] text-white rounded-[16px] font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Calendar className="w-5 h-5" />
            Book coaching
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function OnboardingView({ userName }: { userName: string | null }) {
  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={blurReveal}>
        <h1 className="text-[28px] font-medium tracking-[-0.02em] text-[#1D1D1F]">
          Velkommen{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-sm text-[#86868B] mt-1">
          Her er 3 ting du kan gjore for a komme i gang:
        </p>
      </motion.div>

      {/* Mocked preview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-30 pointer-events-none">
        <div className="portal-stat-card">
          <span className="portal-label">HCP</span>
          <span className="block text-[32px] font-bold text-[#D2D2D7] tabular-nums mt-2 leading-none">
            18.4
          </span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-label">Okter</span>
          <span className="block text-[32px] font-bold text-[#D2D2D7] tabular-nums mt-2 leading-none">
            0
          </span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-label">Neste coaching</span>
          <span className="block text-sm text-[#D2D2D7] mt-2">
            Ingen planlagt
          </span>
        </div>
        <div className="portal-stat-card">
          <span className="portal-label">Streak</span>
          <span className="block text-[32px] font-bold text-[#D2D2D7] tabular-nums mt-2 leading-none">
            0
          </span>
        </div>
      </div>

      {/* Onboarding steps */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={staggerGrid}
      >
        <motion.div variants={staggerCard}>
          <OnboardingCard
            step={1}
            href="/portal/bookinger/ny"
            icon={Calendar}
            title="Book en time"
            description="Start med en coaching-okt for a fa din forste analyse"
          />
        </motion.div>
        <motion.div variants={staggerCard}>
          <OnboardingCard
            step={2}
            href="/portal/statistikk/ny-runde"
            icon={BarChart3}
            title="Registrer en runde"
            description="Logg din forste golfrunde for a spore fremgangen"
          />
        </motion.div>
        <motion.div variants={staggerCard}>
          <OnboardingCard
            step={3}
            href="/portal/profil"
            icon={BookOpen}
            title="Sett mal"
            description="Definer dine golfmal for a fa personlige anbefalinger"
          />
        </motion.div>
      </motion.div>
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
      className="block p-6 rounded-[20px] bg-white border border-[#E8E8ED] hover:border-[#2D6A4F]/30 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center">
          {step}
        </span>
        <Icon className="w-5 h-5 text-[#86868B]" />
      </div>
      <p className="font-semibold text-[#1D1D1F] text-[15px]">{title}</p>
      <p className="text-sm text-[#86868B] mt-1">{description}</p>
    </Link>
  );
}

function formatBookingDate(date: Date): string {
  if (isToday(date)) return "i dag";
  if (isTomorrow(date)) return "i morgen";
  return format(date, "EEEE d. MMMM", { locale: nb });
}
