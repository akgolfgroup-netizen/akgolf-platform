"use client";

import { useState, useEffect } from "react";
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
  type LucideIcon,
} from "lucide-react";
import {
  PortalHeader,
  PortalCard,
  PremiumStatCard,
  PremiumBentoCard,
  PremiumBentoGrid,
  fadeInUp,
  staggerContainer,
} from "@/components/portal/premium";
import { ProgressChart } from "@/components/portal/heritage/progress-chart";
import { QuickAction } from "@/components/portal/heritage/quick-action";

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8"
    >
      {/* Header */}
      <PortalHeader
        label="Profil"
        title="Min profil"
        description="Administrer din profil, mål og prestasjoner"
      />

      {/* Profile Hero */}
      <motion.div variants={fadeInUp}>
        <PortalCard variant="bold" padding="lg" className="overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-white/15 flex items-center justify-center border-2 border-white/25 overflow-hidden backdrop-blur-sm">
                <User className="w-12 h-12 text-white/70" />
              </div>
              <button
                aria-label="Last opp profilbilde"
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[var(--color-accent-cta)] flex items-center justify-center text-[var(--color-primary)] hover:scale-105 transition-transform shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setSaveError(null);
                      }}
                      className="bg-white/15 border border-white/25 rounded-lg px-3 py-1.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cta)]/60"
                    />
                    <button
                      onClick={async () => {
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
                      }}
                      disabled={isSaving}
                      className="p-1.5 rounded-lg bg-[var(--color-accent-cta)] text-[var(--color-primary)] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {saveError && (
                    <p className="text-xs text-[var(--color-accent-cta)] text-center sm:text-left">
                      {saveError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
                  <button
                    aria-label="Rediger navn"
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-accent-cta)] text-[var(--color-primary)] text-xs font-semibold">
                  Elite
                </span>
                <span className="text-white/70 text-sm">Medlem siden 2024</span>
              </div>
            </div>

            {/* Handicap */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 text-center min-w-[120px]">
              <p className="text-xs text-white/70 uppercase tracking-wider">Handicap</p>
              <p className="text-4xl font-bold text-[var(--color-accent-cta)]">
                {handicap.toFixed(1)}
              </p>
              <p className="text-xs text-white/70 mt-1">Nivå: 3</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-white/70 uppercase tracking-wider">Runder</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-white/70 uppercase tracking-wider">Coaching</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-white/70 uppercase tracking-wider">Turneringer</p>
            </div>
          </div>
        </PortalCard>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <PremiumStatCard
          label="Beste score"
          value={78}
          icon={Trophy}
          trend={-2}
          trendLabel="vs. forrige"
          lowerIsBetter
        />
        <PremiumStatCard
          label="Snitt putts"
          value={32.5}
          icon={Target}
          decimals={1}
          trend={-0.8}
          trendLabel="siste 10 runder"
          lowerIsBetter
        />
        <PremiumStatCard
          label="Fairway"
          value={58}
          unit="%"
          icon={TrendingDown}
          trend={4}
          trendLabel="siste 30 dager"
        />
        <PremiumStatCard
          label="GIR"
          value={42}
          unit="%"
          icon={Award}
          trend={3}
          trendLabel="siste 30 dager"
        />
      </motion.div>

      {/* Two Column Layout */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Handicap Chart */}
        <PortalCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Handicap-utvikling
            </h3>
            <span className="text-xs text-[var(--color-muted)]">Siste 6 måneder</span>
          </div>
          <ProgressChart
            data={mockHandicapHistory}
            color="var(--color-primary)"
            height={200}
          />
        </PortalCard>

        {/* Goals */}
        <PortalCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Mine mål</h3>
            <button className="text-xs font-medium text-[var(--color-primary)] hover:underline">
              + Nytt mål
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
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {goal.title}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-muted)]">
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
        </PortalCard>
      </motion.div>

      {/* Achievements */}
      <motion.section variants={fadeInUp} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Prestasjoner
          </h3>
          <span className="text-xs text-[var(--color-muted)]">
            {mockAchievements.filter((a) => a.unlocked).length} / {mockAchievements.length} oppnådd
          </span>
        </div>
        <PremiumBentoGrid columns={3}>
          {mockAchievements.map((achievement) => (
            <PremiumBentoCard
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              badge={achievement.unlocked ? "Oppnådd" : "Låst"}
              badgeVariant={achievement.unlocked ? "success" : "neutral"}
              variant={achievement.unlocked ? "soft" : "default"}
              className={achievement.unlocked ? "" : "opacity-40"}
            />
          ))}
        </PremiumBentoGrid>
      </motion.section>

      {/* Quick Actions */}
      <motion.section variants={fadeInUp}>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">
          Innstillinger
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickAction
            href="/portal/profil/innstillinger"
            icon={User}
            label="Kontoinnstillinger"
          />
          <QuickAction href="/portal/profil/abonnement" icon={Crown} label="Abonnement" />
          <QuickAction href="/portal/profil/personvern" icon={Award} label="Personvern" />
        </div>
      </motion.section>
    </motion.div>
  );
}
