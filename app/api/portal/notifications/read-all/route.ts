/**
 * POST /api/portal/notifications/read-all
 * Marker alle notifikasjoner som lest
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { markAllNotificationsAsRead } from "@/lib/portal/notifications/create";

const markAllReadSchema = z.object({
  isAdminNotification: z.boolean().optional(),
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
    const body = await req.json().catch(() => ({}));
    const validation = markAllReadSchema.safeParse(body);

    const filter = validation.success && validation.data.isAdminNotification !== undefined
      ? { isAdminNotification: validation.data.isAdminNotification }
      : undefined;

    const result = await markAllNotificationsAsRead(user.id, filter);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, count: result.count });
  } catch {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
