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
  getDailyChecklist,
  getAchievements,
} from "./dashboard-actions";
import { DashboardClient } from "./dashboard-client";

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

  const [
    stats,
    handicap,
    handicapHistory,
    nextBooking,
    weekRings,
    checklist,
    achievements,
    coachInsight,
    aiInsight,
  ] = await Promise.all([
    getDashboardStats(user.id),
    getHandicapData(user.id),
    getHandicapHistory(user.id),
    getNextBooking(user.id),
    getWeekRingsData(user.id),
    getDailyChecklist(user.id),
    getAchievements(user.id),
    getCoachInsight(user.id),
    getLatestAiInsight(user.id),
  ]);

  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt as string).getFullYear().toString()
    : null;

  return (
    <DashboardClient
      userName={user.name}
      tier={user.subscriptionTier}
      memberSince={memberSince}
      stats={stats}
      handicap={handicap}
      handicapHistory={handicapHistory}
      nextBooking={nextBooking}
      weekRings={weekRings}
      checklist={checklist}
      achievements={achievements}
      coachInsight={coachInsight}
      aiInsight={aiInsight}
    />
  );
}
