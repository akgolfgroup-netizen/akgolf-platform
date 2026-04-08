import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

/**
 * GET /api/portal/rounds — List brukerens runder
 */
export async function GET() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const supabase = await createServerSupabase();

  const { data: rounds, error } = await supabase
    .from("Round")
    .select(`
      *,
      Course (
        name,
        par,
        location
      ),
      HoleResult (
        count
      )
    `)
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: "Kunne ikke hente runder" }, { status: 500 });
  }

  // Transform data to match Prisma's _count format
  const transformedRounds = (rounds || []).map((round: {
    HoleResult: { count: number }[];
    [key: string]: unknown;
  }) => ({
    ...round,
    _count: {
      HoleResult: round.HoleResult?.length || 0
    },
    HoleResult: undefined
  }));

  return NextResponse.json(transformedRounds);
}

/**
 * POST /api/portal/rounds — Start ny runde
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const { courseId, teeColor, weather, windSpeed, windDir, temperature } = body;

  if (!courseId) {
    return NextResponse.json({ error: "courseId er paakrevd" }, { status: 400 });
  }

  const supabase = await createServerSupabase();

  // Fetch course with holes
  const { data: course, error: courseError } = await supabase
    .from("Course")
    .select(`
      *,
      Hole (
        *
      )
    `)
    .eq("id", courseId)
    .eq("Hole.teeColor", teeColor ?? "yellow")
    .order("holeNumber", { foreignTable: "Hole", ascending: true })
    .single();

  if (courseError || !course) {
    return NextResponse.json({ error: "Bane ikke funnet" }, { status: 404 });
  }

  const now = new Date().toISOString();

  const { data: round, error: createError } = await supabase
    .from("Round")
    .insert({
      id: nanoid(),
      userId: user.id,
      courseId,
      date: now,
      startTime: now,
      teeColor: teeColor ?? "yellow",
      weather: weather ?? null,
      windSpeed: windSpeed ?? null,
      windDir: windDir ?? null,
      temperature: temperature ?? null,
      source: "LIVE",
      updatedAt: now,
    })
    .select()
    .single();

  if (createError) {
    return NextResponse.json({ error: "Kunne ikke opprette runde" }, { status: 500 });
  }

  return NextResponse.json({
    round,
    holes: course.Hole || [],
    courseName: course.name,
    coursePar: course.par,
  });
}
