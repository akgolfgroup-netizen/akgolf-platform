import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string().min(1),
  auth: z.string().min(1),
});

/**
 * POST /api/portal/notifications/subscribe
 * Subscribe to push notifications
 */
export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const supabase = await createServerSupabase();

  try {
    const body = await req.json();
    const validation = subscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Ugyldig data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { endpoint, p256dh, auth } = validation.data;

    // Upsert push subscription - first check if exists
    const { data: existing } = await supabase
      .from("PushSubscription")
      .select("id")
      .eq("endpoint", endpoint)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from("PushSubscription")
        .update({
          p256dh,
          auth,
          userId: user.id,
        })
        .eq("endpoint", endpoint);

      if (error) {
        return NextResponse.json({ error: "Kunne ikke oppdatere abonnement" }, { status: 500 });
      }
    } else {
      // Create new
      const { error } = await supabase
        .from("PushSubscription")
        .insert({
          id: crypto.randomUUID(),
          userId: user.id,
          endpoint,
          p256dh,
          auth,
        });

      if (error) {
        return NextResponse.json({ error: "Kunne ikke opprette abonnement" }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Push Subscribe] Error:", error);
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}

/**
 * DELETE /api/portal/notifications/subscribe
 * Unsubscribe from push notifications
 */
export async function DELETE(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const supabase = await createServerSupabase();

  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get("endpoint");

    if (endpoint) {
      // Delete specific subscription
      const { error } = await supabase
        .from("PushSubscription")
        .delete()
        .eq("endpoint", endpoint)
        .eq("userId", user.id);

      if (error) {
        return NextResponse.json({ error: "Kunne ikke slette abonnement" }, { status: 500 });
      }
    } else {
      // Delete all subscriptions for user
      const { error } = await supabase
        .from("PushSubscription")
        .delete()
        .eq("userId", user.id);

      if (error) {
        return NextResponse.json({ error: "Kunne ikke slette abonnementer" }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Push Unsubscribe] Error:", error);
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
