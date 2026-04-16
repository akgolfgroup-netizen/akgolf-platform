import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { z } from "zod";
import { validateRequest } from "@/lib/api/validation";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";

  const supabase = await createServerSupabase();

  let query = supabase
    .from("Notification")
    .select("*")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false })
    .limit(50);

  if (unreadOnly) {
    query = query.eq("read", false);
  }

  const { data: notifications, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Kunne ikke hente notifikasjoner" }, { status: 500 });
  }

  const { count: unreadCount } = await supabase
    .from("Notification")
    .select("*", { count: "exact", head: true })
    .eq("userId", user.id)
    .eq("read", false);

  return NextResponse.json({ 
    notifications: notifications || [], 
    unreadCount: unreadCount || 0 
  });
}

const markReadSchema = z.object({
  notificationIds: z.array(z.string().min(1)).min(1),
});

export async function PATCH(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const validation = await validateRequest(req, markReadSchema);
  if (!validation.success) return validation.response;

  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("Notification")
    .update({ read: true })
    .in("id", validation.data.notificationIds)
    .eq("userId", user.id);

  if (error) {
    return NextResponse.json({ error: "Kunne ikke oppdatere notifikasjoner" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
