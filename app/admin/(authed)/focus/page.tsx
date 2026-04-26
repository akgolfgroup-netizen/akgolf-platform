import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getTasks, getDivisionStats, getTodayBookingsByDivision } from "./actions";
import { FocusClient } from "./focus-client";

export const metadata = {
  title: "Focus | AK Golf CoachHQ",
};

export default async function FocusPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const [tasks, stats, todayBookings] = await Promise.all([
    getTasks(),
    getDivisionStats(),
    getTodayBookingsByDivision(),
  ]);

  return (
    <FocusClient
      initialTasks={tasks}
      initialStats={stats}
      todayBookings={todayBookings}
    />
  );
}
