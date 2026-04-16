import { requirePortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
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
} from "./dashboard-actions";
import { DashboardClientV3 } from "./dashboard-client-v3";

export default async function DashboardPage() {
  const user = await requirePortalUser();

  // Check if onboarding is completed
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase
    .from("User")
    .select("onboardingCompletedAt, createdAt")
    .eq("id", user.id)
    .single();

  const needsOnboarding = !userData?.onboardingCompletedAt;

  if (needsOnboarding) {
    redirect("/portal/onboarding");
  }

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
  ]);

  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt as string).getFullYear().toString()
    : null;

  return (
    <DashboardClientV3
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
    />
  );
}
