import { getPortalUser } from "@/lib/portal/auth";
import { NextResponse } from "next/server";
import { analyzeWeakness } from "@/lib/portal/ai/weakness-analysis";
import { hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";

export const maxDuration = 60;

export async function POST() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting per user
  const rateLimit = checkRateLimit(`ai:${user.id}`, RATE_LIMITS.AI_ENDPOINTS);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler. Vent litt og prøv igjen." },
      { status: 429 }
    );
  }

  const userTier = (user.subscriptionTier ?? "VISITOR") as SubscriptionTier;
  if (!hasTierAccess(userTier, SubscriptionTier.ELITE)) {
    return NextResponse.json(
      { error: "Krever Elite-abonnement" },
      { status: 403 }
    );
  }

  try {
    const analysis = await analyzeWeakness(user.id);
    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json({ error: "Analysefeil" }, { status: 500 });
  }
}
