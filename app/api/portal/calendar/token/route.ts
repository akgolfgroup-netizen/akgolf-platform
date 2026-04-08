import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";
import { hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userTier = (user.subscriptionTier ?? "VISITOR") as SubscriptionTier;
  if (!hasTierAccess(userTier, SubscriptionTier.PRO)) {
    return NextResponse.json({ error: "Krever Pro-abonnement" }, { status: 403 });
  }

  const token = randomBytes(32).toString("hex");

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("User")
    .update({ calendarToken: token })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: "Kunne ikke generere token" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akgolf.no";
  const feedUrl = `${baseUrl}/api/portal/calendar/feed/${token}`;

  return NextResponse.json({ feedUrl });
}

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data: dbUser } = await supabase
    .from("User")
    .select("calendarToken")
    .eq("id", user.id)
    .single();

  if (!dbUser?.calendarToken) {
    return NextResponse.json({ feedUrl: null });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akgolf.no";
  return NextResponse.json({
    feedUrl: `${baseUrl}/api/portal/calendar/feed/${dbUser.calendarToken}`,
  });
}
