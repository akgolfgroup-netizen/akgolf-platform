import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { name, startDate, level, location, externalUrl } = await req.json();
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("Tournament")
    .insert({
      id: nanoid(),
      name,
      startDate: new Date(startDate).toISOString(),
      level,
      location: location || null,
      externalUrl: externalUrl || null,
      createdById: user.id,
      updatedAt: new Date().toISOString(),
    });

  if (error) {
    return NextResponse.json({ error: "Kunne ikke opprette turnering" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
