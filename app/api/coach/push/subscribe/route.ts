import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    const { subscription, deviceType } = await request.json();
    const supabase = await createServerSupabase();

    // Check if subscription exists
    const { data: existing } = await supabase
      .from("PushSubscription")
      .select("id")
      .eq("endpoint", subscription.endpoint)
      .single();

    if (existing) {
      // Update existing subscription
      const { error } = await supabase
        .from("PushSubscription")
        .update({
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          deviceType,
        })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      // Create new subscription
      const { error } = await supabase.from("PushSubscription").insert({
        id: nanoid(),
        userId: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        deviceType,
      });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Push subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    const { endpoint } = await request.json();
    const supabase = await createServerSupabase();

    const { error } = await supabase
      .from("PushSubscription")
      .delete()
      .eq("userId", user.id)
      .eq("endpoint", endpoint);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Push unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
