import { requirePortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { canViewTalentDashboard } from "./access";
import { TalentStatusClient } from "@/components/portal/talent/v2/talent-status-client";
import { TalentEmptyState } from "@/components/portal/talent/v2/talent-empty-state";
import { fetchMyTalentDashboardData } from "./actions";
import { SubscriptionTier } from "@prisma/client";

export const metadata = {
  title: "Talent-status | AK Golf",
  description: "Personlig USI-bånd, HCP-prognose og anbefalte tiltak",
};

export const dynamic = "force-dynamic";

export default async function TalentPage() {
  const user = await requirePortalUser();
  const canView = await canViewTalentDashboard({
    id: user.id,
    subscriptionTier: user.subscriptionTier as SubscriptionTier,
  });
  if (!canView) {
    redirect("/portal/abonnement?reason=talent");
  }

  // Defensive: hvis datahenting feiler, vis empty-state istedenfor 500
  let data: Awaited<ReturnType<typeof fetchMyTalentDashboardData>> = null;
  try {
    data = await fetchMyTalentDashboardData();
  } catch (err) {
    console.error("[talent] fetchMyTalentDashboardData feilet:", err);
    data = null;
  }

  if (!data) {
    return <TalentEmptyState />;
  }

  return <TalentStatusClient data={data} />;
}
