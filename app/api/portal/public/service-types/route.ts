import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export const dynamic = "force-dynamic";

// Bruk Supabase direkte for å unngå Prisma-tilkoblingsproblemer lokalt
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(`public:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const excludeParam = searchParams.get("exclude");
    const excludePatterns = excludeParam ? excludeParam.split(",").map(s => s.trim().toLowerCase()) : [];

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Hent service types med tilhørende instruktører
    const { data: types, error } = await supabase
      .from("ServiceType")
      .select(`
        id,
        name,
        description,
        category,
        duration,
        price,
        color,
        minNoticeHours,
        maxAdvanceDays,
        allowStripe,
        allowVipps,
        Instructor (
          id,
          title,
          User (
            name,
            image
          )
        )
      `)
      .eq("isPublic", true)
      .eq("isActive", true)
      .order("sortOrder", { ascending: true });

    if (error) {
      console.error("[ServiceTypes] Supabase error:", error);
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 503, headers: { "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no" } }
      );
    }

    let filteredTypes = types || [];
    if (excludePatterns.length > 0) {
      filteredTypes = filteredTypes.filter(
        (t: { name: string }) => !excludePatterns.some(pattern => t.name.toLowerCase().includes(pattern))
      );
    }

    return NextResponse.json(filteredTypes, {
      headers: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[ServiceTypes] Error:", error);
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 503, headers: { "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no" } }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
