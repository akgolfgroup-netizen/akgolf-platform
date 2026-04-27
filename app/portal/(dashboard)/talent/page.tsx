import { requirePortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { canViewTalentDashboard } from "./access";
import { fetchLeaderboard } from "./actions";
import { TalentLeaderboard } from "./talent-leaderboard";
import { SubscriptionTier } from "@prisma/client";

export const metadata = {
  title: "Talent | AK Golf",
  description: "Scouting og talentanalyse av norske golfutøvere",
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

  const initialData = await fetchLeaderboard({ year: 2025, holesSegment: 18 });

  return <TalentLeaderboard initialData={initialData} />;
}
