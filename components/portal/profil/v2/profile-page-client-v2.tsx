"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

import { ProfileShell } from "./profile-shell";
import { ProfileHero } from "./profile-hero";
import { ProfileKpiRow } from "./profile-kpi-row";
import { HcpHistoryCard } from "./hcp-history-card";
import { AchievementsRow } from "./achievements-row";
import { CoachesRow, type CoachItem } from "./coaches-row";
import { SettingsLinkRow } from "./settings-link-row";

export interface ProfileV2Data {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  subscriptionTier: string;
  clubName: string | null;
  memberSinceYear: number | null;
}

export interface StatsV2Data {
  currentHandicap: number | null;
  hcpDeltaYear: number | null;
  sgPerRound: number | null;
  sgDelta: number | null;
  roundsThisMonth: number;
  roundsDelta: number | null;
}

export interface HcpHistoryPoint {
  date: string;
  handicapIndex: number;
}

interface ProfilePageClientV2Props {
  profile: ProfileV2Data;
  stats: StatsV2Data;
  hcpHistory: HcpHistoryPoint[];
  coaches: CoachItem[];
}

const TIER_LABELS: Record<string, string> = {
  VISITOR: "Gjest",
  ACADEMY: "Academy-spiller",
  STARTER: "Starter-spiller",
  PRO: "Performance-spiller",
  ELITE: "Elite-spiller",
  BUSINESS: "Business",
};

const TIER_PLAN_LABEL: Record<string, string> = {
  VISITOR: "Ingen aktiv plan",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Performance 12 mnd",
  ELITE: "Elite 12 mnd",
  BUSINESS: "Business",
};

export function ProfilePageClientV2({
  profile,
  stats,
  hcpHistory,
  coaches,
}: ProfilePageClientV2Props) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    router.push("/portal/login");
  }

  const initials = computeInitials(profile.name);
  const displayName = profile.name ?? "Spiller";
  const tierLabel = TIER_LABELS[profile.subscriptionTier] ?? profile.subscriptionTier;
  const planLabel = TIER_PLAN_LABEL[profile.subscriptionTier] ?? tierLabel;

  return (
    <ProfileShell>
      <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[#D1F843]/80">
        Min side · Profil
      </div>

      <ProfileHero
        name={displayName}
        initials={initials}
        image={profile.image}
        clubName={profile.clubName}
        memberSinceYear={profile.memberSinceYear}
        tierLabel={tierLabel}
        currentHcp={stats.currentHandicap}
        hcpDelta={stats.hcpDeltaYear}
        sgPerRound={stats.sgPerRound}
        roundsThisMonth={stats.roundsThisMonth}
        planLabel={planLabel}
      />

      <ProfileKpiRow
        currentHcp={stats.currentHandicap}
        hcpDeltaYear={stats.hcpDeltaYear}
        sgPerRound={stats.sgPerRound}
        sgDelta={stats.sgDelta}
        roundsThisMonth={stats.roundsThisMonth}
        roundsDelta={stats.roundsDelta}
      />

      <HcpHistoryCard
        history={hcpHistory}
        current={stats.currentHandicap}
        goal={5.0}
      />

      <AchievementsRow
        items={[
          {
            id: "club-champ",
            iconName: "trophy",
            value: "—",
            label: "Klubbmesterskap",
            locked: true,
          },
          {
            id: "hcp-fall",
            iconName: "trending-down",
            value:
              stats.hcpDeltaYear !== null && stats.hcpDeltaYear < 0
                ? stats.hcpDeltaYear.toFixed(1)
                : "—",
            label: "HCP-fall siste år",
            locked: stats.hcpDeltaYear === null || stats.hcpDeltaYear >= 0,
          },
          {
            id: "rounds",
            iconName: "circle-dot",
            value: String(stats.roundsThisMonth),
            label: "Runder denne mnd",
            locked: stats.roundsThisMonth === 0,
          },
          {
            id: "sg",
            iconName: "zap",
            value:
              stats.sgPerRound !== null
                ? `${stats.sgPerRound > 0 ? "+" : ""}${stats.sgPerRound.toFixed(2)}`
                : "—",
            label: "Strokes Gained snitt",
            locked: stats.sgPerRound === null,
          },
          {
            id: "single-hcp",
            iconName: "lock",
            value: "5.0",
            label: "Single-HCP (låst)",
            locked: true,
          },
        ]}
        unlockedCount={countUnlocked(stats)}
        totalCount={5}
      />

      <CoachesRow coaches={coaches} />

      <SettingsLinkRow onSignOut={handleSignOut} />
    </ProfileShell>
  );
}

function computeInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function countUnlocked(stats: StatsV2Data): number {
  let n = 0;
  if (stats.hcpDeltaYear !== null && stats.hcpDeltaYear < 0) n++;
  if (stats.roundsThisMonth > 0) n++;
  if (stats.sgPerRound !== null) n++;
  return n;
}
