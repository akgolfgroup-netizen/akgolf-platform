import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
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
import { DashboardV2Client } from "./dashboard-v2-client";

export const metadata: Metadata = {
  title: "Dashboard | AK Golf",
  description:
    "Din personlige golf-dashboard. Se progresjon, kommende bookinger og anbefalinger.",
  openGraph: {
    title: "Dashboard | AK Golf",
    description:
      "Din personlige golf-dashboard. Se progresjon, kommende bookinger og anbefalinger.",
    type: "website",
    locale: "nb_NO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | AK Golf",
    description:
      "Din personlige golf-dashboard. Se progresjon, kommende bookinger og anbefalinger.",
  },
};

export default async function DashboardPage() {
  const user = await requirePortalUser();

  const supabase = await createServerSupabase();
  const { data: userData } = await supabase
    .from("User")
    .select("onboardingCompletedAt, createdAt")
    .eq("id", user.id)
    .single();

  const needsOnboarding = !userData?.onboardingCompletedAt;

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

  return (
    <DashboardV2Client
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
