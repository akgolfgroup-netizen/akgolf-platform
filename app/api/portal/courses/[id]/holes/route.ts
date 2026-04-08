import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * GET /api/portal/courses/:id/holes — Hent alle hull for en bane
 * Query params: ?tee=yellow
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const teeColor = req.nextUrl.searchParams.get("tee") ?? "yellow";
  const supabase = await createServerSupabase();

  const { data: course, error: courseError } = await supabase
    .from("Course")
    .select("id, name, par, courseRating, slopeRating")
    .eq("id", id)
    .single();

  if (courseError || !course) {
    return NextResponse.json({ error: "Bane ikke funnet" }, { status: 404 });
  }

  const { data: holes, error: holesError } = await supabase
    .from("Hole")
    .select("id, holeNumber, par, handicap, lengthMeter, teeColor, latitude, longitude, greenLat, greenLon")
    .eq("courseId", id)
    .eq("teeColor", teeColor)
    .order("holeNumber", { ascending: true });

  if (holesError) {
    return NextResponse.json({ error: "Kunne ikke hente hull" }, { status: 500 });
  }

  return NextResponse.json({ course, holes: holes || [] }, {
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
