"use client";

import { motion } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import {
  User,
  Bell,
  KeyRound,
  Crown,
  ChevronRight,
  LogOut,
  Activity,
  BookOpen,
  Flame,
  Target,
} from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { AvatarUpload } from "./avatar-upload";
import { SkillLevelBadge } from "@/components/portal/statistikk/skill-level-badge";
import { MonoLabel, NightSurface } from "@/components/portal/patterns";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: string;
  subscriptionTier: string;
}

interface StatsData {
  currentHandicap: number | null;
  trainingSessions: number;
  coachingSessions: number;
  streak: number;
}

interface ProfilePageClientProps {
  profile: ProfileData;
  stats: StatsData;
}

/* ------------------------------------------------------------------ */
/*  Mappings                                                           */
/* ------------------------------------------------------------------ */

const EASE_APPLE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const roleLabelMap: Record<string, string> = {
  ADMIN: "Administrator",
  INSTRUCTOR: "Instruktør",
  STUDENT: "Spiller",
};

const tierLabelMap: Record<string, string> = {
  VISITOR: "Gjest",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Pro",
  ELITE: "Elite",
  BUSINESS: "Business",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ProfilePageClient({ profile, stats }: ProfilePageClientProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    router.push("/portal/login");
  }

  return (
    <div className="mx-auto w-full max-w-[680px] space-y-6 pb-12">
      {/* ─── 1. Profil-hero (NightSurface) ─── */}
      <NightSurface variant="ambient" className="rounded-2xl p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
          <AvatarUpload currentImage={profile.image} name={profile.name} />

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <MonoLabel size="xs" uppercase className="mb-2 block text-white/50">
              Spillerprofil
            </MonoLabel>
            <h1 className="text-2xl font-bold leading-tight text-white">
              {profile.name ?? "Ukjent bruker"}
            </h1>
            <p className="mt-1 text-sm text-white/60">
              {profile.email ?? ""}
            </p>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
                {roleLabelMap[profile.role] ?? profile.role}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-cta/20 px-2.5 py-1 text-xs font-semibold text-accent-cta">
                <Crown className="h-3 w-3" />
                {tierLabelMap[profile.subscriptionTier] ?? profile.subscriptionTier}
              </span>
              {stats.currentHandicap !== null && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
                  <MonoLabel size="xs" uppercase className="text-white/50">HCP</MonoLabel>
                  <MonoLabel size="xs" className="text-white">
                    {stats.currentHandicap.toFixed(1)}
                  </MonoLabel>
                </span>
              )}
            </div>
          </div>
        </div>
      </NightSurface>

      {/* ─── 2. Nøkkeltall ─── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatMini
          label="Handicap"
          value={
            stats.currentHandicap !== null
              ? stats.currentHandicap.toFixed(1)
              : "—"
          }
          delay={0.05}
          badge={
            stats.currentHandicap !== null ? (
              <SkillLevelBadge handicap={stats.currentHandicap} />
            ) : undefined
          }
        />
        <StatMini
          label="Økter"
          value={String(stats.trainingSessions)}
          sublabel="siste 30d"
          icon={<Activity className="h-3.5 w-3.5" />}
          delay={0.1}
        />
        <StatMini
          label="Coaching"
          value={String(stats.coachingSessions)}
          sublabel="totalt"
          icon={<BookOpen className="h-3.5 w-3.5" />}
          delay={0.15}
        />
        <StatMini
          label="Streak"
          value={String(stats.streak)}
          sublabel={stats.streak === 1 ? "dag" : "dager"}
          icon={<Flame className="h-3.5 w-3.5" />}
          delay={0.2}
        />
      </div>

      {/* ─── 3. Abonnement ─── */}
      <PremiumCard delay={0.25}>
        <MonoLabel size="xs" uppercase className="mb-3 block text-portal-muted">
          Abonnement
        </MonoLabel>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-portal-text">
                {tierLabelMap[profile.subscriptionTier] ?? profile.subscriptionTier}
              </p>
              <p className="text-xs text-portal-secondary">
                {profile.subscriptionTier === "VISITOR"
                  ? "Ingen aktiv pakke"
                  : "Aktiv"}
              </p>
            </div>
          </div>
          <Link
            href="/portal/profil/abonnement"
            className="text-xs font-medium text-primary hover:underline"
          >
            {profile.subscriptionTier === "VISITOR" ? "Oppgrader" : "Administrer"}
          </Link>
        </div>
      </PremiumCard>

      {/* ─── 4. Innstillinger ─── */}
      <PremiumCard delay={0.3} noHover>
        <MonoLabel size="xs" uppercase className="mb-3 block text-portal-muted">
          Innstillinger
        </MonoLabel>
        <div className="divide-y divide-portal-border">
          <SettingsRow
            href="/portal/profil/innstillinger"
            icon={<User className="h-4 w-4" />}
            label="Konto"
            description="Navn, e-post, telefon"
          />
          <SettingsRow
            href="/portal/profil/varsler"
            icon={<Bell className="h-4 w-4" />}
            label="Varsler"
            description="Push og e-postvarsler"
          />
          <SettingsRow
            href="/portal/profil/passord"
            icon={<KeyRound className="h-4 w-4" />}
            label="Passord"
            description="Endre passord"
          />
        </div>
      </PremiumCard>

      {/* ─── 5. Logg ut ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: EASE_APPLE }}
      >
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-portal-card px-5 py-3.5 text-sm font-medium text-error shadow-portal-card transition-all duration-300 hover:-translate-y-px"
        >
          <LogOut className="h-4 w-4" />
          Logg ut
        </button>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatMini({
  label,
  value,
  sublabel,
  icon,
  badge,
  delay = 0,
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  delay?: number;
}) {
  return (
    <PremiumCard delay={delay} className="text-center">
      <MonoLabel size="xs" uppercase className="mb-1 block text-portal-muted">
        {label}
      </MonoLabel>
      <p className="text-3xl font-extrabold tracking-tight text-portal-text tabular-nums">
        {value}
      </p>
      {badge && <div className="mt-1.5">{badge}</div>}
      {sublabel && !badge && (
        <p className="mt-1 flex items-center justify-center gap-1 text-xs text-portal-secondary">
          {icon}
          {sublabel}
        </p>
      )}
    </PremiumCard>
  );
}

function SettingsRow({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 py-3 transition-colors duration-200 first:pt-0 last:pb-0"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-portal-hover text-portal-secondary transition-colors group-hover:bg-primary-soft group-hover:text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-portal-text">{label}</p>
        <p className="text-xs text-portal-secondary">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-portal-muted opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
