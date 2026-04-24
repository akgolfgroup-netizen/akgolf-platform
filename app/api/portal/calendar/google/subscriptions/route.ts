/**
 * CRUD for UserCalendarSubscription — hvilke Google-kalendere som synkes.
 */

import { NextRequest, NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const user = await requirePortalUser();
    if (!user?.id) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("UserCalendarSubscription")
      .select("id, googleCalendarId, displayName, backgroundColor, enabled")
      .eq("userId", user.id);
    return NextResponse.json({ subscriptions: data ?? [] });
  } catch (err) {
    logger.error("[subscriptions GET]", err);
    return NextResponse.json({ error: "Kunne ikke hente" }, { status: 500 });
  }
}

/**
 * POST { calendars: [{ googleCalendarId, displayName?, backgroundColor?, enabled }] }
 * Upserter hele settet for brukeren.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requirePortalUser();
    if (!user?.id) return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
    const supabase = createServiceClient();

    const body = (await req.json()) as {
      calendars?: Array<{
        googleCalendarId: string;
        displayName?: string;
        backgroundColor?: string;
        enabled: boolean;
      }>;
    };
    if (!Array.isArray(body.calendars)) {
      return NextResponse.json({ error: "Mangler calendars" }, { status: 400 });
    }

    for (const cal of body.calendars) {
      const { data: existing } = await supabase
        .from("UserCalendarSubscription")
        .select("id")
        .eq("userId", user.id)
        .eq("googleCalendarId", cal.googleCalendarId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("UserCalendarSubscription")
          .update({
            displayName: cal.displayName ?? null,
            backgroundColor: cal.backgroundColor ?? null,
            enabled: cal.enabled,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("UserCalendarSubscription").insert({
          id: nanoid(),
          userId: user.id,
          googleCalendarId: cal.googleCalendarId,
          displayName: cal.displayName ?? null,
          backgroundColor: cal.backgroundColor ?? null,
          enabled: cal.enabled,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("[subscriptions POST]", err);
    return NextResponse.json({ error: "Kunne ikke lagre" }, { status: 500 });
  }
}
