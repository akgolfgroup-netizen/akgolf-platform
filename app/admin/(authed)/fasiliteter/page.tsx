import { redirect } from "next/navigation";
import { requirePortalUser } from "@/lib/portal/auth";
import { canAccessMissionControl } from "@/lib/portal/rbac";
import FasiliteterClient from "./fasiliteter-client";
import { getWeekBookings } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fasiliteter — CoachHQ" };

export default async function FasiliteterPage() {
  const user = await requirePortalUser();
  if (!canAccessMissionControl(user.role)) {
    redirect("/admin/login");
  }

  const bookings = await getWeekBookings();

  return <FasiliteterClient bookings={bookings} />;
}
