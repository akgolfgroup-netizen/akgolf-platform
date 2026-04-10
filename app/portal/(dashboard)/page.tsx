import { requirePortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  getDashboardStats,
  getHandicapData,
  getNextBooking,
  getCoachInsight,
  getLatestAiInsight,
} from "./dashboard-actions";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await requirePortalUser();

  // Check if onboarding is completed
  const supabase = await createServerSupabase();
  const { data: userData } = await supabase
    .from("User")
    .select("onboardingCompletedAt")
    .eq("id", user.id)
    .single();

  const needsOnboarding = !userData?.onboardingCompletedAt;

  if (needsOnboarding) {
    redirect("/portal/onboarding");
  }

  const [
    stats,
    handicap,
    nextBooking,
    coachInsight,
    aiInsight,
  ] = await Promise.all([
    getDashboardStats(user.id),
    getHandicapData(user.id),
    getNextBooking(user.id),
    getCoachInsight(user.id),
    getLatestAiInsight(user.id),
  ]);

  return (
    <DashboardClient
      userName={user.name}
      stats={stats}
      handicap={handicap}
      nextBooking={nextBooking}
      coachInsight={coachInsight}
      aiInsight={aiInsight}
    />
  );
}
