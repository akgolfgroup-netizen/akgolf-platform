import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | PlayersHQ",
  description:
    "Din personlige golf-dashboard. Se progresjon, kommende bookinger og anbefalinger.",
  openGraph: {
    title: "Dashboard | PlayersHQ",
    description:
      "Din personlige golf-dashboard. Se progresjon, kommende bookinger og anbefalinger.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | PlayersHQ",
    description:
      "Din personlige golf-dashboard. Se progresjon, kommende bookinger og anbefalinger.",
  },
};
import {
  getDashboardStats,
  getHandicapData,
  getHandicapHistory,
  getNextBooking,
  getCoachInsight,
  getLatestAiInsight,
  getWeekRingsData,
  getAchievements,
  getTrackManData,
  getSocialData,
  getPlayerLevel,
  getSgSummary,
  getDashboardTrainingIndex,
  getTestProgress,
} from "./dashboard-actions";
import { DashboardClientV3 } from "./dashboard-client-v3";
import { DashboardBentoClient } from "./dashboard-bento-client";
import { cookies } from "next/headers";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ dashboard?: string }>;
}) {
  const user = await requirePortalUser();
  const sp = (await searchParams) ?? {};
  const cookieStore = await cookies();
  const wantsBento =
    sp.dashboard === "bento" || cookieStore.get("dashboard")?.value === "bento";

  // Check if onboarding is completed
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase
    .from("User")
    .select("onboardingCompletedAt, createdAt")
    .eq("id", user.id)
    .single();

  const needsOnboarding = !userData?.onboardingCompletedAt;

  // Hent all dashboard-data parallelt
  const [
    stats,
    handicap,
    handicapHistory,
    nextBooking,
    weekRings,
    coachInsight,
    aiInsight,
    achievementsData,
    trackManData,
    socialData,
    playerLevel,
    sgSummary,
    trainingIndex,
    testProgress,
  ] = await Promise.all([
    getDashboardStats(user.id),
    getHandicapData(user.id),
    getHandicapHistory(user.id),
    getNextBooking(user.id),
    getWeekRingsData(user.id),
    getCoachInsight(user.id),
    getLatestAiInsight(user.id),
    getAchievements(user.id),
    getTrackManData(user.id),
    getSocialData(user.id),
    getPlayerLevel(user.id),
    getSgSummary(user.id),
    getDashboardTrainingIndex(user.id),
    getTestProgress(user.id),
  ]);

  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt as string).getFullYear().toString()
    : null;

  const Client = wantsBento ? DashboardBentoClient : DashboardClientV3;

  return (
    <Client
      userName={user.name}
      tier={user.subscriptionTier}
      memberSince={memberSince}
      stats={stats}
      handicap={handicap}
      handicapHistory={handicapHistory}
      nextBooking={nextBooking}
      weekRings={weekRings}
      coachInsight={coachInsight}
      aiInsight={aiInsight}
      trackManData={trackManData || undefined}
      socialData={socialData || undefined}
      achievements={achievementsData.achievements}
      totalAchievements={achievementsData.totalAchievements}
      playerLevel={playerLevel}
      sgSummary={sgSummary}
      trainingIndex={trainingIndex}
      testProgress={testProgress}
      needsOnboarding={needsOnboarding}
    />
  );
}
