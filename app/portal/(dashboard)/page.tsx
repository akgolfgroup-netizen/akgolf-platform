import { requirePortalUser } from "@/lib/portal/auth";
import {
  getDashboardStats,
  getHandicapData,
  getNextBooking,
  getCoachInsight,
} from "./dashboard-actions";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await requirePortalUser();

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
