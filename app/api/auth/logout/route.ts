import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  return NextResponse.redirect(
    new URL("/treningsplan", process.env.NEXT_PUBLIC_SITE_URL || "https://akgolf.no")
  );
}
