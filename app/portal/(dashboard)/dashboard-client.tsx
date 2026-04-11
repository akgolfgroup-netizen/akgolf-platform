"use client";

import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  Calendar,
  Target,
  BookOpen,
  BarChart3,
  Sparkles,
  ArrowRight,
  Trophy,
  Activity,
  Flame,
  TrendingDown,
  MapPin,
  Clock,
  Play,
} from "lucide-react";
import {
  HeroHeading,
  DarkStatCard,
  GlassCard,
  AnimatedNumber,
  Shimmer,
  EASE,
  fadeInUp,
  staggerContainer,
} from "@/components/portal/premium";

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

function getCountdown(target: Date | null) {
  if (!target) return null;
  const diff = new Date(target).getTime() - Date.now();
  if (diff < 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
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
  const firstName = userName?.split(" ")[0] ?? "spiller";

  if (!hasData) {
    return <OnboardingView userName={userName} />;
  }

  const countdown = nextBooking ? getCountdown(new Date(nextBooking.startTime)) : null;

  return (
    <div className="space-y-10">
      {/* ═══ HERO ═══ */}
      <HeroHeading
        label={format(now, "EEEE d. MMMM yyyy", { locale: nb })}
        title={
          <>
            Hei,{" "}
            <span className="font-serif italic text-[var(--color-primary)] font-normal">
              {firstName}
            </span>
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description={
          countdown ? (
            <>
              Neste coaching om{" "}
              <span className="font-semibold text-[var(--color-grey-900)] tabular-nums">
                {countdown.days}d {countdown.hours}t {countdown.minutes}m
              </span>
              .{" "}
              {coachInsight?.primaryFocus
                ? `${coachInsight.primaryFocus} er fortsatt ditt største potensial.`
                : "La oss se hva som ligger foran deg."}
            </>
          ) : (
            "Her er din ukentlige oppdatering. Du er på rett spor mot å nå dine mål."
          )
        }
        actions={
          <>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/portal/statistikk/ny-runde"
                className="h-11 px-6 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 text-[var(--color-text)] text-[12px] font-semibold hover:bg-white transition-colors shadow-sm inline-flex items-center"
              >
                Logg runde
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/portal/treningsplan"
                className="relative h-11 px-6 rounded-full bg-[var(--color-accent-cta)] text-[var(--color-grey-900)] text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(209,248,67,0.4)] hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] transition-shadow overflow-hidden group"
              >
                <Shimmer />
                <Play className="w-3 h-3 fill-[var(--color-grey-900)] relative z-10" />
                <span className="relative z-10">Start økt</span>
              </Link>
            </motion.div>
          </>
        }
      />

      {/* ═══ BENTO GRID ═══ */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-4"
      >
        {/* Handicap — stor dark-stat */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <DarkStatCard
            label="Handicap"
            value={handicap.current ?? 0}
            decimals={1}
            trend={handicap.trend}
            trendLabel="siste 30 dager"
            lowerIsBetter
            icon={TrendingDown}
            variant="primary"
            delay={0}
          />
        </div>

        {/* Neste booking — highlight */}
        {nextBooking && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, type: "spring", damping: 20, stiffness: 100 }}
            className="col-span-12 md:col-span-6 lg:col-span-4 relative rounded-[24px] overflow-hidden p-6 shadow-[0_20px_60px_-20px_rgba(10,31,24,0.25)] text-white group"
          >
            <div className="absolute inset-0 bg-[#0A1F18]" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(42,125,90,0.45), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(209,248,67,0.15), transparent 60%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative z-10 flex flex-col h-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-cta)]/[0.12] border border-[var(--color-accent-cta)]/25 backdrop-blur-xl self-start mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-cta)]" />
                <span className="text-[9px] font-bold tracking-[0.18em] text-[var(--color-accent-cta)] uppercase">
                  Neste coaching
                </span>
              </div>

              <p className="text-[10px] text-white/50 uppercase tracking-[0.15em] mb-2">
                {format(new Date(nextBooking.startTime), "EEEE d. MMMM", { locale: nb })}
              </p>
              <h3 className="text-[40px] font-[300] tracking-[-0.04em] leading-none mb-1 tabular-nums">
                {format(new Date(nextBooking.startTime), "HH:mm")}
              </h3>
              <p className="text-[12px] text-white/60 mb-5">
                {nextBooking.serviceName} — {nextBooking.duration} min
              </p>

              <div className="mt-auto flex items-center gap-2 text-[11px] text-white/70">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#0A1F18] flex items-center justify-center text-[var(--color-accent-cta)] text-[10px] font-bold">
                  {nextBooking.instructorName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <span className="font-medium">{nextBooking.instructorName}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Runder */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <DarkStatCard
            label="Runder i 2026"
            value={stats.roundsCount}
            icon={Trophy}
            variant="default"
            delay={0.16}
          />
        </div>

        {/* Treningsøkter */}
        <div className="col-span-6 md:col-span-3 lg:col-span-3">
          <DarkStatCard
            label="Treningsøkter"
            value={stats.sessionsCount}
            icon={Target}
            variant="default"
            delay={0.24}
          />
        </div>

        {/* Streak (accent) */}
        <div className="col-span-6 md:col-span-3 lg:col-span-3">
          <DarkStatCard
            label="Streak"
            value={Math.min(stats.sessionsCount, 14)}
            unit="dager"
            icon={Flame}
            variant="accent"
            delay={0.32}
          />
        </div>

        {/* AI Insight — glass-card spans 6 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", damping: 20, stiffness: 100 }}
          className="col-span-12 lg:col-span-6"
        >
          <div className="relative rounded-[24px] overflow-hidden p-7 h-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_-12px_rgba(10,31,24,0.12)]">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(175,82,222,0.08), transparent 60%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-ai)]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--color-ai)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-grey-900)] text-[14px]">
                    AI-innsikt
                  </h3>
                  <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">
                    Basert på din treningshistorikk
                  </p>
                </div>
              </div>

              <p className="text-[14px] text-[var(--color-text)] leading-relaxed mb-5">
                {aiInsight?.focusTip ||
                  coachInsight?.summary ||
                  "Fokuser på putting denne uken. Din statistikk viser potensial for forbedring innen kortspill."}
              </p>

              {aiInsight?.strengths && aiInsight.strengths.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)] mb-2">
                    Dine styrker
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {aiInsight.strengths.slice(0, 4).map((strength, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white rounded-full text-[11px] font-medium text-[var(--color-text)] border border-[var(--color-grey-200)]"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href="/portal/ai-coach"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-ai)] hover:gap-2 transition-all"
              >
                Snakk med AI Coach
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Coach insight */}
        {coachInsight && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, type: "spring", damping: 20, stiffness: 100 }}
            className="col-span-12 lg:col-span-6"
          >
            <GlassCard variant="light" padding="lg" className="h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-grey-900)] text-[14px]">
                    Fra din coach
                  </h3>
                  <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">
                    {format(new Date(coachInsight.date), "d. MMMM", { locale: nb })}
                  </p>
                </div>
              </div>
              <p className="text-[14px] text-[var(--color-text)] leading-relaxed mb-5">
                {coachInsight.summary}
              </p>
              {coachInsight.focusAreas && coachInsight.focusAreas.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)] mb-2">
                    Fokusområder
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {coachInsight.focusAreas.map((area, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[var(--color-primary)]/5 rounded-full text-[11px] font-medium text-[var(--color-primary)] border border-[var(--color-primary)]/10"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </motion.div>

      {/* ═══ QUICK ACTIONS ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.56, type: "spring", damping: 20, stiffness: 100 }}
      >
        <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase mb-4 flex items-center gap-2">
          <span className="w-6 h-px bg-[var(--color-muted)]" />
          Snarveier
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            href="/booking"
            icon={Calendar}
            label="Book coaching"
            description="Planlegg ny økt"
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
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-3 p-4 rounded-[20px] bg-white/70 backdrop-blur-xl border border-white/80 hover:border-[var(--color-primary)]/20 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(0,88,64,0.2)] transition-all duration-300 will-change-transform"
    >
      <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center transition-transform group-hover:scale-110">
        <Icon className="w-[18px] h-[18px] text-[var(--color-primary)]" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[13px] text-[var(--color-grey-900)] truncate">
          {label}
        </p>
        <p className="text-[11px] text-[var(--color-muted)] truncate">
          {description}
        </p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-[var(--color-muted)] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}

function OnboardingView({ userName }: { userName: string | null }) {
  const firstName = userName?.split(" ")[0] ?? "spiller";
  return (
    <div className="space-y-10">
      <HeroHeading
        label="Velkommen"
        title={
          <>
            Hei,{" "}
            <span className="font-serif italic text-[var(--color-primary)] font-normal">
              {firstName}
            </span>
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description="La oss komme i gang med din golf-reise. Her er tre enkle steg for å starte."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            step: 1,
            icon: Calendar,
            title: "Book en time",
            description: "Start med en coaching-økt for å få din første analyse.",
            href: "/booking",
          },
          {
            step: 2,
            icon: BarChart3,
            title: "Registrer en runde",
            description: "Logg din første golfrunde for å spore fremgangen.",
            href: "/portal/statistikk/ny-runde",
          },
          {
            step: 3,
            icon: Target,
            title: "Sett mål",
            description: "Definer dine golfmål for å få personlige anbefalinger.",
            href: "/portal/profil",
          },
        ].map((item, i) => (
          <motion.div
            key={item.step}
            variants={fadeInUp}
            transition={{ delay: i * 0.1, ease: EASE }}
          >
            <Link
              href={item.href}
              className="group block relative rounded-[24px] overflow-hidden p-6 bg-white/70 backdrop-blur-xl border border-white/80 hover:border-[var(--color-primary)]/20 hover:-translate-y-0.5 transition-all duration-300 will-change-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold tracking-[0.1em] uppercase">
                  Steg {item.step}
                </div>
                <item.icon className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={1.75} />
              </div>
              <h3 className="text-[20px] font-semibold text-[var(--color-grey-900)] mb-2">
                {item.title}
              </h3>
              <p className="text-[13px] text-[var(--color-muted)] leading-relaxed mb-4">
                {item.description}
              </p>
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-primary)] group-hover:gap-2 transition-all">
                Kom i gang
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
