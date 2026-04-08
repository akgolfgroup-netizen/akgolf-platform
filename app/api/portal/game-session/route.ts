import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * GET /api/portal/game-session — Liste brukerens aktive spillokter
 */
export async function GET() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const supabase = await createServerSupabase();

  const { data: sessions, error } = await supabase
    .from("GameSession")
    .select(`
      *,
      Course (name, par),
      Players (
        *,
        User (id, name, image)
      ),
      Rounds (
        userId,
        totalScore,
        scoreToPar,
        sgTotal
      )
    `)
    .or(`createdById.eq.${user.id},Players.userId.eq.${user.id}`)
    .order("date", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: "Kunne ikke hente spillokter" }, { status: 500 });
  }

  return NextResponse.json(sessions || []);
}

/**
 * POST /api/portal/game-session — Opprett ny spillokt
 * Body: { courseId, teeColor?, format?, name? }
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const { courseId, teeColor, format, name } = body;

  if (!courseId) {
    return NextResponse.json({ error: "courseId er paakrevd" }, { status: 400 });
  }

  const supabase = await createServerSupabase();

  const { data: course, error: courseError } = await supabase
    .from("Course")
    .select("name")
    .eq("id", courseId)
    .single();

  if (courseError || !course) {
    return NextResponse.json({ error: "Bane ikke funnet" }, { status: 404 });
  }

  // Generer unik join-kode
  let joinCode = generateJoinCode();
  let attempts = 0;
  while (attempts < 10) {
    const { data: existing } = await supabase
      .from("GameSession")
      .select("id")
      .eq("joinCode", joinCode)
      .single();
    if (!existing) break;
    joinCode = generateJoinCode();
    attempts++;
  }

  const sessionId = nanoid();
  const now = new Date().toISOString();

  const { data: session, error: sessionError } = await supabase
    .from("GameSession")
    .insert({
      id: sessionId,
      name: name ?? `Runde pa ${course.name}`,
      courseId,
      date: now,
      teeColor: teeColor ?? "yellow",
      format: format ?? "STROKEPLAY",
      createdById: user.id,
      joinCode,
      updatedAt: now,
    })
    .select()
    .single();

  if (sessionError) {
    return NextResponse.json({ error: "Kunne ikke opprette spillokt" }, { status: 500 });
  }

  // Legg til skaperen som spiller
  const { error: playerError } = await supabase
    .from("GamePlayer")
    .insert({
      id: nanoid(),
      gameSessionId: sessionId,
      userId: user.id,
      displayName: user.name,
    });

  if (playerError) {
    return NextResponse.json({ error: "Kunne ikke legge til spiller" }, { status: 500 });
  }

  return NextResponse.json({
    session,
    joinCode,
    courseName: course.name,
  });
}
