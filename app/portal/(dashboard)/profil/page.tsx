"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Trophy,
  Target,
  Edit2,
  Check,
  Crown,
  Award,
  TrendingDown,
  Camera,
  Loader2,
  Flame,
  Bird,
  Flag,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  HeroHeading,
  DarkStatCard,
  GlassCard,
  Shimmer,
  PremiumBentoCard,
  PremiumBentoGrid,
  EASE,
  fadeInUp,
  staggerContainer,
} from "@/components/portal/premium";
import { ProgressChart } from "@/components/portal/heritage/progress-chart";

// Mock data - replace with actual API calls
const mockHandicapHistory = [
  { date: "2024-01", value: 18.5 },
  { date: "2024-02", value: 17.8 },
  { date: "2024-03", value: 17.2 },
  { date: "2024-04", value: 16.5 },
  { date: "2024-05", value: 15.9 },
  { date: "2024-06", value: 15.2 },
];

interface Goal {
  id: string;
  title: string;
  category: "SCORE" | "PROCESS" | "TOURNAMENT";
  progress: number;
  target: number;
  current: number;
}

const mockGoals: Goal[] = [
  { id: "1", title: "Nå handicap 15", category: "SCORE", progress: 60, target: 15, current: 15.2 },
  { id: "2", title: "Trene 3x per uke", category: "PROCESS", progress: 80, target: 12, current: 10 },
  { id: "3", title: "Spille 5 turneringer", category: "TOURNAMENT", progress: 40, target: 5, current: 2 },
];

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  unlocked: boolean;
}

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Første runde",
    description: "Fullfør din første registrerte runde",
    icon: Target,
    unlocked: true,
  },
  {
    id: "2",
    title: "7-dagers streak",
    description: "Tren syv dager på rad",
    icon: Flame,
    unlocked: true,
  },
  {
    id: "3",
    title: "Handicap 20",
    description: "Nå handicap 20 eller lavere",
    icon: TrendingDown,
    unlocked: true,
  },
  {
    id: "4",
    title: "Birdie",
    description: "Registrer din første birdie",
    icon: Bird,
    unlocked: false,
  },
  {
    id: "5",
    title: "Eagle",
    description: "Registrer din første eagle",
    icon: Trophy,
    unlocked: false,
  },
  {
    id: "6",
    title: "Turneringsspiller",
    description: "Fullfør fem turneringer",
    icon: Flag,
    unlocked: false,
  },
];

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [name, setName] = useState("Anders Kristiansen");
  const [handicap] = useState(15.2);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] ?? "Spiller";
  const lastName = nameParts.slice(1).join(" ") || "";
  const unlockedCount = mockAchievements.filter((a) => a.unlocked).length;

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    try {
      // TODO: erstatt med faktisk API-kall når mock fjernes
      // await updateProfile({ name });
      setIsEditing(false);
    } catch {
      setSaveError("Kunne ikke lagre endringer. Prøv igjen.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* ═══ HERO ═══ */}
      <HeroHeading
        label="Din profil"
        title={
          <>
            {firstName}{" "}
            {lastName && (
              <span className="font-serif italic text-[var(--color-primary)] font-normal">
                {lastName}
              </span>
            )}
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description="Administrer din profil, mål og prestasjoner. Se hvor langt du har kommet."
        actions={
          <>
            {!isEditing ? (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsEditing(true)}
                className="h-11 px-6 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 text-[var(--color-text)] text-[12px] font-semibold hover:bg-white transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Rediger
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={isSaving}
                className="relative h-11 px-6 rounded-full bg-[var(--color-accent-cta)] text-[var(--color-grey-900)] text-[12px] font-bold inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(209,248,67,0.4)] hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)] transition-shadow overflow-hidden group disabled:opacity-60"
              >
                <Shimmer />
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10" />
                ) : (
                  <Check className="w-3.5 h-3.5 relative z-10" />
                )}
                <span className="relative z-10">Lagre</span>
              </motion.button>
            )}
          </>
        }
      />

      {/* ═══ HERO CARD (dark) ═══ */}
      <GlassCard variant="dark" padding="lg">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden backdrop-blur-sm">
              <User className="w-12 h-12 text-white/70" strokeWidth={1.5} />
            </div>
            <button
              aria-label="Last opp profilbilde"
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[var(--color-accent-cta)] flex items-center justify-center text-[var(--color-grey-900)] hover:scale-105 transition-transform shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSaveError(null);
                  }}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cta)]/60 w-full max-w-xs text-2xl font-bold"
                />
                {saveError && (
                  <p className="text-xs text-[#FF6B6B]">{saveError}</p>
                )}
              </div>
            ) : (
              <h2 className="text-[32px] font-[300] tracking-[-0.03em] text-white leading-tight">
                {firstName}{" "}
                {lastName && (
                  <span className="font-serif italic text-[var(--color-accent-cta)] font-normal">
                    {lastName}
                  </span>
                )}
              </h2>
            )}
            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent-cta)]/[0.12] border border-[var(--color-accent-cta)]/25 text-[10px] font-bold tracking-[0.15em] text-[var(--color-accent-cta)] uppercase">
                <Crown className="w-3 h-3" />
                Elite
              </span>
              <span className="text-white/50 text-[12px]">Medlem siden 2024</span>
            </div>
          </div>

          {/* Handicap */}
          <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl p-5 border border-white/10 text-center min-w-[140px]">
            <p className="text-[10px] text-white/50 uppercase tracking-[0.15em] font-bold mb-1">
              Handicap
            </p>
            <p className="text-[42px] font-[300] tracking-[-0.04em] leading-none text-[var(--color-accent-cta)] tabular-nums">
              {handicap.toFixed(1)}
            </p>
            <p className="text-[10px] text-white/40 mt-2 uppercase tracking-[0.1em]">
              Nivå 3
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ═══ STATS GRID ═══ */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-4"
      >
        <div className="col-span-6 md:col-span-3">
          <DarkStatCard
            label="Treningsøkter"
            value={128}
            icon={Target}
            variant="default"
            delay={0}
          />
        </div>
        <div className="col-span-6 md:col-span-3">
          <DarkStatCard
            label="Coaching"
            value={12}
            icon={Award}
            variant="primary"
            delay={0.08}
          />
        </div>
        <div className="col-span-6 md:col-span-3">
          <DarkStatCard
            label="Turneringer"
            value={3}
            icon={Trophy}
            variant="default"
            delay={0.16}
          />
        </div>
        <div className="col-span-6 md:col-span-3">
          <DarkStatCard
            label="Streak"
            value={7}
            unit="dager"
            icon={Flame}
            variant="accent"
            delay={0.24}
          />
        </div>
      </motion.div>

      {/* ═══ TO-KOLONNE: CHART + GOALS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Handicap Chart */}
        <GlassCard variant="light" padding="lg">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-grey-900)] text-[14px]">
                  Handicap-utvikling
                </h3>
                <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">
                  Siste 6 måneder
                </p>
              </div>
            </div>
          </div>
          <ProgressChart
            data={mockHandicapHistory}
            color="var(--color-primary)"
            height={200}
          />
        </GlassCard>

        {/* Goals */}
        <GlassCard variant="light" padding="lg">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-grey-900)] text-[14px]">
                  Mine mål
                </h3>
                <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">
                  {mockGoals.length} aktive
                </p>
              </div>
            </div>
            <button className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1">
              Nytt mål
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-5">
            {mockGoals.map((goal) => {
              const progress =
                goal.target > 0
                  ? Math.min(100, Math.round((goal.current / goal.target) * 100))
                  : 0;
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium text-[var(--color-grey-900)]">
                      {goal.title}
                    </span>
                    <span className="text-[11px] font-bold text-[var(--color-muted)] tabular-nums">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-surface)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-cta)]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* ═══ ACHIEVEMENTS ═══ */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase flex items-center gap-2">
            <span className="w-6 h-px bg-[var(--color-muted)]" />
            Prestasjoner
          </p>
          <span className="text-[11px] text-[var(--color-muted)] tabular-nums">
            {unlockedCount} / {mockAchievements.length} oppnådd
          </span>
        </div>
        <PremiumBentoGrid columns={3}>
          {mockAchievements.map((achievement, i) => (
            <motion.div
              key={achievement.id}
              variants={fadeInUp}
              transition={{ delay: i * 0.05, ease: EASE }}
            >
              <PremiumBentoCard
                title={achievement.title}
                description={achievement.description}
                icon={achievement.icon}
                badge={achievement.unlocked ? "Oppnådd" : "Låst"}
                badgeVariant={achievement.unlocked ? "success" : "neutral"}
                variant={achievement.unlocked ? "soft" : "default"}
                className={achievement.unlocked ? "" : "opacity-40"}
              />
            </motion.div>
          ))}
        </PremiumBentoGrid>
      </motion.section>

      {/* ═══ INNSTILLINGER ═══ */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase mb-4 flex items-center gap-2">
          <span className="w-6 h-px bg-[var(--color-muted)]" />
          Innstillinger
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SettingsLink
            href="/portal/profil/innstillinger"
            icon={User}
            label="Kontoinnstillinger"
            description="Navn, e-post, passord"
          />
          <SettingsLink
            href="/portal/profil/abonnement"
            icon={Crown}
            label="Abonnement"
            description="Pakke og betaling"
          />
          <SettingsLink
            href="/portal/profil/personvern"
            icon={Award}
            label="Personvern"
            description="Data og samtykker"
          />
        </div>
      </motion.section>
    </div>
  );
}

function SettingsLink({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: LucideIcon;
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
