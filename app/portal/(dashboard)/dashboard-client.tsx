"use client";

import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  Target,
  BookOpen,
  BarChart3,
  Sparkles,
  ArrowRight,
  Trophy,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/portal/heritage/stat-card";
import { QuickAction } from "@/components/portal/heritage/quick-action";
import { ProgressChart } from "@/components/portal/heritage/progress-chart";

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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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

  // Mock data for handicap chart
  const handicapData = [
    { date: "2024-01", value: handicap.current ? handicap.current + 2 : 18 },
    { date: "2024-02", value: handicap.current ? handicap.current + 1.5 : 17 },
    { date: "2024-03", value: handicap.current ? handicap.current + 1 : 16 },
    { date: "2024-04", value: handicap.current ? handicap.current + 0.5 : 15 },
    { date: "2024-05", value: handicap.current ? handicap.current : 14 },
    { date: "2024-06", value: handicap.current ? handicap.current - 0.5 : 13.5 },
  ];

  return (
    <div className="space-y-8">
      {/* ── Hero Section ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={blurReveal}
        className="bg-gradient-to-br from-[#154212] to-[#0d2e0c] rounded-3xl p-6 lg:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-[#d2f000] text-sm font-medium mb-1">
              {format(now, "EEEE d. MMMM yyyy", { locale: nb })}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              {greeting}
              {firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="text-white/70 mt-2 max-w-md">
              Her er din ukentlige oppdatering. Du er på rett spor mot å nå dine mål!
            </p>
          </div>

          {nextBooking && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#d2f000] flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#1c1c16]" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">
                    Neste økt
                  </p>
                  <p className="font-semibold">{nextBooking.serviceName}</p>
                  <p className="text-sm text-white/70">
                    {formatBookingDate(new Date(nextBooking.startTime))} kl{" "}
                    {format(new Date(nextBooking.startTime), "HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Stats Grid ── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={staggerGrid}
      >
        <StatCard
          label="Handicap"
          value={handicap.current !== null ? handicap.current.toFixed(1) : "—"}
          trend={
            handicap.trend !== null
              ? {
                  value: handicap.trend,
                  label: "siste 30 dager",
                }
              : undefined
          }
          icon={handicap.trend !== null && handicap.trend < 0 ? TrendingDown : TrendingUp}
          iconColor={handicap.trend !== null && handicap.trend < 0 ? "#22c55e" : "#ef4444"}
          delay={0}
        />

        <StatCard
          label="Treningsøkter"
          value={stats.sessionsCount}
          icon={Target}
          iconColor="#154212"
          delay={0.1}
        />

        <StatCard
          label="Runder spilt"
          value={stats.roundsCount}
          icon={Trophy}
          iconColor="#f59e0b"
          delay={0.2}
        />

        <StatCard
          label="Streak"
          value={`${Math.min(stats.sessionsCount, 14)} dager`}
          icon={Clock}
          iconColor="#d2f000"
          delay={0.3}
        />
      </motion.div>

      {/* ── Charts & AI Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Handicap Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ProgressChart
            data={handicapData}
            title="Handicap-utvikling"
            color="#154212"
            height={180}
          />
        </motion.div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="bg-[#f7f3ea] rounded-2xl p-6 border border-[#c2c9bb]/50 h-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
              </div>
              <h3 className="font-semibold text-[#1c1c16]">AI-innsikt</h3>
            </div>
            <p className="text-sm text-[#42493e] leading-relaxed">
              {aiInsight?.focusTip ||
                coachInsight?.summary ||
                "Basert på din treningshistorikk anbefaler vi å fokusere på putting denne uken. Din statistikk viser potensial for forbedring innen kortspill."}
            </p>
            <Link
              href="/portal/ai-coach"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#154212] mt-4 hover:underline"
            >
              Snakk med AI Coach
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="text-sm font-semibold text-[#1c1c16] mb-4">Snarveier</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            href="/portal/bookinger/ny"
            icon={Calendar}
            label="Book coaching"
            description="Planlegg ny økt"
            variant="primary"
            delay={0.5}
          />
          <QuickAction
            href="/portal/statistikk/ny-runde"
            icon={BarChart3}
            label="Logg runde"
            description="Registrer score"
            delay={0.55}
          />
          <QuickAction
            href="/portal/dagbok"
            icon={BookOpen}
            label="Treningsdagbok"
            description="Logg økt"
            delay={0.6}
          />
          <QuickAction
            href="/portal/treningsplan"
            icon={Target}
            label="Treningsplan"
            description="Se ukens plan"
            delay={0.65}
          />
        </div>
      </motion.div>
    </div>
  );
}

function OnboardingView({ userName }: { userName: string | null }) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#154212] to-[#0d2e0c] rounded-3xl p-6 lg:p-8 text-white"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Velkommen{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-white/70 mt-2 max-w-md">
          La oss komme i gang med din golf-reise. Her er tre enkle steg:
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            step: 1,
            icon: Calendar,
            title: "Book en time",
            description: "Start med en coaching-økt for å få din første analyse",
            href: "/portal/bookinger/ny",
          },
          {
            step: 2,
            icon: BarChart3,
            title: "Registrer en runde",
            description: "Logg din første golfrunde for å spore fremgangen",
            href: "/portal/statistikk/ny-runde",
          },
          {
            step: 3,
            icon: Target,
            title: "Sett mål",
            description: "Definer dine golfmål for å få personlige anbefalinger",
            href: "/portal/profil",
          },
        ].map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Link
              href={item.href}
              className="block p-6 bg-white rounded-2xl border border-[#c2c9bb]/50 hover:border-[#154212]/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#154212] text-white text-sm font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <item.icon className="w-5 h-5 text-[#8a9385] group-hover:text-[#154212] transition-colors" />
              </div>
              <h3 className="font-semibold text-[#1c1c16]">{item.title}</h3>
              <p className="text-sm text-[#6b7366] mt-1">{item.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function formatBookingDate(date: Date): string {
  if (isToday(date)) return "i dag";
  if (isTomorrow(date)) return "i morgen";
  return format(date, "EEEE d. MMMM", { locale: nb });
}
