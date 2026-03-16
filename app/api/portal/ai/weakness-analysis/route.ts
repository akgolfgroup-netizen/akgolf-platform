import { getPortalUser } from "@/lib/portal/auth";
import { NextResponse } from "next/server";
import { analyzeWeakness } from "@/lib/portal/ai/weakness-analysis";
import { hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";

export async function POST() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userTier = (user.subscriptionTier ?? "FREE") as SubscriptionTier;
  if (!hasTierAccess(userTier, SubscriptionTier.ELITE)) {
    return NextResponse.json(
      { error: "Krever Elite-abonnement" },
      { status: 403 }
    );
  }

  try {
    const analysis = await analyzeWeakness(user.id);
    return NextResponse.json(analysis);
  } catch (e) {
    console.error("Weakness analysis error:", e);
    return NextResponse.json({ error: "Analysefeil" }, { status: 500 });
  }
}
