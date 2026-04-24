/**
 * Liste alle Google-kalendere brukeren har tilgang til (gjennom OAuth-scopet).
 * Brukes av CalendarSyncSettings for å la brukeren velge hvilke kalendere som skal synkes.
 */

import { NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { fetchCalendarList } from "@/lib/portal/google-calendar/sync";
import { logger } from "@/lib/logger";

interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

export async function GET() {
  try {
    const user = await requirePortalUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
    }

    const supabase = createServiceClient();
    const { data: row } = await supabase
      .from("User")
      .select("googleCalendarTokens")
      .eq("id", user.id)
      .single();

    const tokens = row?.googleCalendarTokens as unknown as GoogleTokens | null;
    if (!tokens?.access_token) {
      return NextResponse.json({ error: "Ikke koblet til Google Calendar" }, { status: 400 });
    }

    const calendars = await fetchCalendarList(tokens.access_token);
    return NextResponse.json({ calendars });
  } catch (err) {
    logger.error("[calendar/google/calendars] Error:", err);
    return NextResponse.json({ error: "Kunne ikke hente kalendere" }, { status: 500 });
  }
}
