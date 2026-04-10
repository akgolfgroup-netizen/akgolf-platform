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
  ChevronRight,
  Award,
  Activity,
} from "lucide-react";
import { WeekRings } from "@/components/portal/dashboard/week-rings";
import { DailyChecklist } from "@/components/portal/dashboard/daily-checklist";
import { AchievementShowcase } from "@/components/portal/dashboard/achievement-showcase";
import { PersonalInsights } from "@/components/portal/dashboard/personal-insights";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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
      {/* ── Hero Section ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#000000]/5"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#00594C] mb-2">
              {format(now, "EEEE d. MMMM yyyy", { locale: nb })}
            </p>
            <h1 
              className="text-3xl lg:text-4xl font-bold text-black tracking-tight"
              style={{ letterSpacing: '-0.025em' }}
            >
              {greeting}
              {firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="text-[#36454F] mt-2 max-w-md">
              Her er din ukentlige oppdatering. Du er på rett spor mot å nå dine mål!
            </p>
          </div>

          {nextBooking ? (
            <div className="bg-[#E6F3F1] rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00594C] flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#627C75] uppercase tracking-wider font-semibold">
                    Neste økt
                  </p>
                  <p className="font-semibold text-black">{nextBooking.serviceName}</p>
                  <p className="text-sm text-[#36454F]">
                    {formatBookingDate(new Date(nextBooking.startTime))} kl{" "}
                    {format(new Date(nextBooking.startTime), "HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#00594C] text-white px-6 py-4 rounded-full font-semibold hover:bg-[#004940] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Book din første økt
            </Link>
          )}
        </div>
      </motion.div>

      {/* ── Bento Stats Grid ── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Handicap Card - Large */}
        <motion.div
          variants={fadeInUp}
          className="col-span-2 bg-white rounded-[24px] p-6 border border-[#000000]/5"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85] mb-1">
                Handicap
              </p>
              <p className="text-4xl font-bold text-black tabular-nums">
                {handicap.current !== null ? handicap.current.toFixed(1) : "—"}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              handicap.trend !== null && handicap.trend < 0 
                ? 'bg-[#2A7D5A]/10' 
                : 'bg-[#B84233]/10'
            }`}>
              {handicap.trend !== null && handicap.trend < 0 ? (
                <TrendingDown className="w-5 h-5 text-[#2A7D5A]" />
              ) : (
                <TrendingUp className="w-5 h-5 text-[#B84233]" />
              )}
            </div>
          </div>
          
          {handicap.trend !== null && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                handicap.trend < 0 ? 'text-[#2A7D5A]' : 'text-[#B84233]'
              }`}>
                {handicap.trend > 0 ? '+' : ''}{handicap.trend.toFixed(1)}
              </span>
              <span className="text-sm text-[#7A8C85]">siste 30 dager</span>
            </div>
          )}
          
          {/* Mini chart placeholder */}
          <div className="mt-4 h-16 flex items-end gap-1">
            {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-[#00594C]/10 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Sessions Card */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-[24px] p-6 border border-[#000000]/5"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E6F3F1] flex items-center justify-center mb-4">
            <Target className="w-5 h-5 text-[#00594C]" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85] mb-1">
            Treningsøkter
          </p>
          <p className="text-3xl font-bold text-black tabular-nums">
            {stats.sessionsCount}
          </p>
        </motion.div>

        {/* Rounds Card */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-[24px] p-6 border border-[#000000]/5"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center mb-4">
            <Trophy className="w-5 h-5 text-[#C48A32]" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85] mb-1">
            Runder spilt
          </p>
          <p className="text-3xl font-bold text-black tabular-nums">
            {stats.roundsCount}
          </p>
        </motion.div>
      </motion.div>

      {/* ── Second Row: AI Insight & Quick Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="bg-[#F3EEFC] rounded-[24px] p-6 border border-[#8E5CE6]/10 h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#8E5CE6] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-black">AI-innsikt</h3>
                <p className="text-xs text-[#8E5CE6]">Basert på din treningshistorikk</p>
              </div>
            </div>
            
            <p className="text-[#36454F] leading-relaxed mb-4">
              {aiInsight?.focusTip ||
                coachInsight?.summary ||
                "Basert på din treningshistorikk anbefaler vi å fokusere på putting denne uken. Din statistikk viser potensial for forbedring innen kortspill."}
            </p>
            
            {aiInsight?.strengths && aiInsight.strengths.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8E5CE6] mb-2">
                  Dine styrker
                </p>
                <div className="flex flex-wrap gap-2">
                  {aiInsight.strengths.map((strength, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white rounded-full text-sm text-[#36454F]"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <Link
              href="/portal/ai-coach"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#8E5CE6] hover:underline"
            >
              Snakk med AI Coach
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Streak & Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4"
        >
          {/* Streak Card */}
          <div className="bg-white rounded-[24px] p-6 border border-[#000000]/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E6F3F1] flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#00594C]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85]">
                  Streak
                </p>
                <p className="text-2xl font-bold text-black">
                  {Math.min(stats.sessionsCount, 14)} dager
                </p>
              </div>
            </div>
          </div>
          
          {/* Goal Progress */}
          <div className="bg-white rounded-[24px] p-6 border border-[#000000]/5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8C85]">
                Mål: Handicap 10
              </p>
              <span className="text-sm font-semibold text-[#00594C]">
                {handicap.current ? Math.round(((handicap.current - 10) / (handicap.current - 10 + 5)) * 100) : 0}%
              </span>
            </div>
            <div className="h-2 bg-[#E6F3F1] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00594C] rounded-full transition-all"
                style={{ 
                  width: `${handicap.current ? Math.max(0, Math.min(100, ((handicap.current - 10) / (handicap.current - 10 + 5)) * 100)) : 0}%` 
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="text-sm font-semibold text-black mb-4">Snarveier</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            href="/booking"
            icon={Calendar}
            label="Book coaching"
            description="Planlegg ny økt"
            variant="primary"
          />
          <QuickAction
            href="/portal/statistikk/ny-runde"
            icon={BarChart3}
            label="Logg runde"
            description="Registrer score"
          />
          <QuickAction
            href="/portal/dagbok"
            icon={BookOpen}
            label="Treningsdagbok"
            description="Logg økt"
          />
          <QuickAction
            href="/portal/treningsplan"
            icon={Target}
            label="Treningsplan"
            description="Se ukens plan"
          />
        </div>
      </motion.div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  description,
  variant = 'default',
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  variant?: 'primary' | 'default';
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-4 rounded-[20px] transition-all duration-300 group ${
        variant === 'primary'
          ? 'bg-[#00594C] text-white hover:bg-[#004940]'
          : 'bg-white border border-[#000000]/5 hover:border-[#00594C]/20 hover:shadow-lg'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        variant === 'primary'
          ? 'bg-white/10'
          : 'bg-[#E6F3F1]'
      }`}>
        <Icon className={`w-6 h-6 ${
          variant === 'primary' ? 'text-white' : 'text-[#00594C]'
        }`} />
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${
          variant === 'primary' ? 'text-white' : 'text-black'
        }`}>
          {label}
        </p>
        <p className={`text-sm ${
          variant === 'primary' ? 'text-white/70' : 'text-[#7A8C85]'
        }`}>
          {description}
        </p>
      </div>
      <ChevronRight className={`w-5 h-5 ${
        variant === 'primary' ? 'text-white/50' : 'text-[#7A8C85]'
      }`} />
    </Link>
  );
}

function OnboardingView({ userName }: { userName: string | null }) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[24px] p-6 lg:p-8 border border-[#000000]/5"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#E6F3F1] flex items-center justify-center">
            <Award className="w-6 h-6 text-[#00594C]" />
          </div>
          <div>
            <h1 
              className="text-2xl lg:text-3xl font-bold text-black tracking-tight"
              style={{ letterSpacing: '-0.025em' }}
            >
              Velkommen{userName ? `, ${userName.split(" ")[0]}` : ""}!
            </h1>
          </div>
        </div>
        <p className="text-[#36454F] max-w-md">
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
            href: "/booking",
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
              className="block p-6 bg-white rounded-[24px] border border-[#000000]/5 hover:border-[#00594C]/20 hover:shadow-lg transition-all duration-300 group h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-[#00594C] text-white text-sm font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <item.icon className="w-5 h-5 text-[#7A8C85] group-hover:text-[#00594C] transition-colors" />
              </div>
              <h3 className="font-semibold text-black text-lg">{item.title}</h3>
              <p className="text-sm text-[#36454F] mt-1">{item.description}</p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-[#00594C]">
                Kom i gang
                <ArrowRight className="w-4 h-4" />
              </div>
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
