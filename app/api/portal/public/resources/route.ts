import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`public:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");

  if (!locationId) {
    return NextResponse.json(
      { error: "Mangler parameter: locationId" },
      { status: 400 }
    );
  }

  try {
    // Use service client for public endpoints to bypass RLS
    const supabase = createServiceClient();

    const { data: resources, error } = await supabase
      .from("Resource")
      .select("id, name, type")
      .eq("locationId", locationId)
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json(resources || []);
  } catch {
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 503 }
    );
  }
}
