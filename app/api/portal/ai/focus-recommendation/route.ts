import { getPortalUser } from "@/lib/portal/auth";
import { hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";
import { generateFocusRecommendation } from "@/lib/portal/ai/focus-recommendation";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const tier = (user.subscriptionTier ?? "FREE") as SubscriptionTier;
  if (!hasTierAccess(tier, SubscriptionTier.PRO)) {
    return NextResponse.json({ error: "Krever Pro-abonnement" }, { status: 403 });
  }

  try {
    const recommendation = await generateFocusRecommendation(user.id);
    return NextResponse.json(recommendation);
  } catch (error) {
    return NextResponse.json({ error: "Kunne ikke generere anbefaling" }, { status: 500 });
  }
}
