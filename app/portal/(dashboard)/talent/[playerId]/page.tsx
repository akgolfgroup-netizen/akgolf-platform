import { requirePortalUser } from "@/lib/portal/auth";
import { redirect, notFound } from "next/navigation";
import { canViewTalentDashboard } from "../access";
import { fetchPlayerProfile } from "../actions";
import { PlayerProfile } from "./player-profile";
import { SubscriptionTier } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function TalentPlayerPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const user = await requirePortalUser();
  const canView = await canViewTalentDashboard({
    id: user.id,
    subscriptionTier: user.subscriptionTier as SubscriptionTier,
  });
  if (!canView) redirect("/portal/abonnement?reason=talent");

  const profile = await fetchPlayerProfile(playerId);
  if (!profile) notFound();

  return <PlayerProfile profile={profile} />;
}
