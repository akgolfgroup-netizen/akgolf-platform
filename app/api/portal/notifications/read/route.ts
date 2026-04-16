/**
 * POST /api/portal/notifications/read
 * Marker notifikasjoner som lest
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { markNotificationAsRead } from "@/lib/portal/notifications/create";

const markReadSchema = z.object({
  notificationId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = markReadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Ugyldig data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { notificationId } = validation.data;
    const result = await markNotificationAsRead(notificationId, user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
