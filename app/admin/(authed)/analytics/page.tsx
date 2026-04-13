import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getDashboardData } from "./actions";
import { DashboardClient } from "./dashboard-client";

export default async function AnalyticsPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal/login");

  const data = await getDashboardData("month");
  return <DashboardClient initialData={data} />;
}
