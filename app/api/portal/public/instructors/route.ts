import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(`public:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }
  try {
    const supabase = await createServerSupabase();

    // For public endpoints, use service role client to bypass RLS
    const { data: instructors, error } = await supabase
      .from("Instructor")
      .select(
        `
        id,
        title,
        bio,
        specialization,
        User (name, image)
      `
      );

    if (error) throw error;

    // Format the response to match the original structure
    const formattedInstructors = instructors?.map((instructor) => ({
      id: instructor.id,
      title: instructor.title,
      bio: instructor.bio,
      specialization: instructor.specialization,
      User: instructor.User as unknown as { name: string; image: string },
    })) || [];

    return NextResponse.json(formattedInstructors, {
      headers: {
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
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
