import { redirect } from "next/navigation";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { AnalyticsClient } from "./analytics-client";
import { CoachKPIClient } from "./coach-kpi-client";

export const metadata = {
  title: "Analytics | AK Golf Portal",
  description: "Elev- og booking-analyse for coaching",
};

export default async function AnalyticsPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-grey-100)] via-[#F0F4F8] to-[var(--color-grey-100)] p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <CoachKPIClient />
        <AnalyticsClient />
      </div>
    </div>
  );
}
