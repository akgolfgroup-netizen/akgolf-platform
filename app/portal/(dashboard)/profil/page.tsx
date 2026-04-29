import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import {
  getMyProfile,
  getPlayerStats,
  getHandicapHistory,
  getPlayerSGData,
} from "./actions";
import { ProfilePageClientV2 } from "@/components/portal/profil/v2/profile-page-client-v2";
import { prisma } from "@/lib/portal/prisma";
import { startOfMonth, subMonths } from "date-fns";

export const metadata: Metadata = {
  title: "Profil | PlayersHQ",
  description:
    "Din spillerprofil. Oppdater innstillinger, se abonnement og personlig informasjon.",
  openGraph: {
    title: "Profil | PlayersHQ",
    description:
      "Din spillerprofil. Oppdater innstillinger, se abonnement og personlig informasjon.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profil | PlayersHQ",
    description:
      "Din spillerprofil. Oppdater innstillinger, se abonnement og personlig informasjon.",
  },
};

interface ProfileQueryResult {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: string;
  subscriptionTier: string;
  createdAt: string | null;
  UserGolfId?: { clubName: string | null; handicap: number | null } | null;
}

export default async function ProfilPage() {
  const user = await requirePortalUser();

  const [profile, stats, hcpHistory, sgData] = await Promise.all([
    getMyProfile() as Promise<ProfileQueryResult | null>,
    getPlayerStats(),
    getHandicapHistory(12),
    getPlayerSGData(),
  ]);

  if (!profile) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-[#5C6B62]">
          Kunne ikke laste profil. Prøv å laste siden på nytt.
        </p>
      </div>
    );
  }

  // Member since year — fallback til createdAt
  const memberSinceYear = profile.createdAt
    ? new Date(profile.createdAt).getFullYear()
    : null;

  // HCP year delta — sammenlign mot eldste verdi i historikken
  const hcpHistoryPoints = hcpHistory.map((e) => ({
    date: e.date as string,
    handicapIndex: e.handicapIndex as number,
  }));
  const hcpDeltaYear =
    stats.currentHandicap !== null && hcpHistoryPoints.length > 1
      ? +(stats.currentHandicap - hcpHistoryPoints[0].handicapIndex).toFixed(2)
      : null;

  // Runder denne måneden + coaches — parallell (Vercel best practice: async-parallel)
  const monthStart = startOfMonth(new Date());
  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const [
    roundsThisMonth,
    roundsLastMonth,
    coachRelations,
  ] = await Promise.all([
    prisma.roundStats
      .count({
        where: {
          userId: user.id,
          date: { gte: monthStart },
        },
      })
      .catch(() => 0),
    prisma.roundStats
      .count({
        where: {
          userId: user.id,
          date: { gte: lastMonthStart, lt: monthStart },
        },
      })
      .catch(() => 0),
    prisma.coachPlayerRelation
      .findMany({
        where: {
          OR: [{ playerUserId: user.id }, { playerUserId: profile.id }],
          status: "ACTIVE",
        },
        include: {
          Coach: {
            select: { id: true, name: true, image: true },
          },
        },
        take: 4,
      })
      .catch(() => []),
  ]);

  const roundsDelta =
    roundsThisMonth > 0 || roundsLastMonth > 0
      ? roundsThisMonth - roundsLastMonth
      : null;

  const coachColors = ["#D1F843", "#C896E8", "#7FA3FF", "#F49283"];
  const coaches = coachRelations.map((r, idx) => {
    const coach = r.Coach;
    const name = coach?.name ?? "Coach";
    return {
      id: r.id,
      name,
      initials: name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      role: idx === 0 ? "Hovedcoach" : "Coach",
      color: coachColors[idx % coachColors.length],
    };
  });

  const clubName = profile.UserGolfId?.clubName ?? null;

  return (
    <ProfilePageClientV2
      profile={{
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.image,
        role: profile.role,
        subscriptionTier: profile.subscriptionTier,
        clubName,
        memberSinceYear,
      }}
      stats={{
        currentHandicap: stats.currentHandicap,
        hcpDeltaYear,
        sgPerRound: sgData?.sgTotal ?? null,
        sgDelta: null,
        roundsThisMonth,
        roundsDelta,
      }}
      hcpHistory={hcpHistoryPoints}
      coaches={coaches}
    />
  );
}
