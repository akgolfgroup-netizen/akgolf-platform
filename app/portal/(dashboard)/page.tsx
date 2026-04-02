import { requirePortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import {
  getDashboardStats,
  getHandicapData,
  getNextBooking,
  getCoachInsight,
} from "./dashboard-actions";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await requirePortalUser();

  // Check if onboarding is completed
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      onboardingCompletedAt: true,
    },
  });

  const needsOnboarding = !userData?.onboardingCompletedAt;

  if (needsOnboarding) {
    redirect("/portal/onboarding");
  }

  const [stats, handicap, nextBooking, coachInsight] = await Promise.all([
    getDashboardStats(user.id),
    getHandicapData(user.id),
    getNextBooking(user.id),
    getCoachInsight(user.id),
  ]);

  return (
    <DashboardClient
      userName={user.name}
      stats={stats}
      handicap={handicap}
      nextBooking={nextBooking}
      coachInsight={coachInsight}
    />
  );
}
