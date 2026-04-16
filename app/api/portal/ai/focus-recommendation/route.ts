import { getPortalUser } from "@/lib/portal/auth";
import { hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";
import { generateFocusRecommendation } from "@/lib/portal/ai/focus-recommendation";
import { NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";

export const maxDuration = 60;

export async function POST() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  // Rate limiting per user
  const rateLimit = checkRateLimit(`ai:${user.id}`, RATE_LIMITS.AI_ENDPOINTS);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler. Vent litt og prøv igjen." },
      { status: 429 }
    );
  }

  const tier = (user.subscriptionTier ?? "VISITOR") as SubscriptionTier;
  if (!hasTierAccess(tier, SubscriptionTier.PRO)) {
    return NextResponse.json({ error: "Krever Pro-abonnement" }, { status: 403 });
  }

  try {
    const recommendation = await generateFocusRecommendation(user.id);
    return NextResponse.json(recommendation);
  } catch {
    return NextResponse.json({ error: "Kunne ikke generere anbefaling" }, { status: 500 });
  }
}
