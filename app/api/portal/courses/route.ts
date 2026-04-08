import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * GET /api/portal/courses — Sok etter baner
 * Query params: ?q=oslo&country=NO
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const country = req.nextUrl.searchParams.get("country") ?? "NO";
  const supabase = await createServerSupabase();

  let query = supabase
    .from("Course")
    .select("id, name, location, par, courseRating, slopeRating, totalLength, latitude, longitude")
    .eq("country", country)
    .order("name", { ascending: true })
    .limit(50);

  if (q) {
    // Use ilike for case-insensitive search
    query = query.or(`name.ilike.%${q}%,location.ilike.%${q}%`);
  }

  const { data: courses, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Kunne ikke hente baner" }, { status: 500 });
  }

  return NextResponse.json(courses || [], {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
