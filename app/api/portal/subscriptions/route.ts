import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(`subscription:${getClientIp(request)}`, RATE_LIMITS.SUBSCRIPTIONS);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const supabase = await createServerSupabase();

  const { data: subscriptions, error } = await supabase
    .from("AppSubscription")
    .select(`
      *,
      AppModule (
        slug,
        name,
        icon
      ),
      AppBundle (
        slug,
        name,
        BundleItem (
          AppModule (
            slug,
            name
          )
        )
      )
    `)
    .eq("userId", user.id)
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Kunne ikke hente abonnementer" }, { status: 500 });
  }

  return NextResponse.json(subscriptions || []);
}
