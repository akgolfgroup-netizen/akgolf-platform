import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

/**
 * POST /api/portal/game-session/join — Bli med i spillokt via kode
 * Body: { joinCode: string }
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { joinCode } = await req.json();
  if (!joinCode || typeof joinCode !== "string") {
    return NextResponse.json({ error: "joinCode er paakrevd" }, { status: 400 });
  }

  const supabase = await createServerSupabase();

  const { data: session, error } = await supabase
    .from("GameSession")
    .select(`
      *,
      Course (name, par),
      Players (userId)
    `)
    .eq("joinCode", joinCode.toUpperCase())
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Ugyldig kode" }, { status: 404 });
  }

  if (!session.isActive) {
    return NextResponse.json({ error: "Spillokten er avsluttet" }, { status: 400 });
  }

  if ((session.Players || []).some((p: { userId: string }) => p.userId === user.id)) {
    return NextResponse.json({ error: "Du er allerede med" }, { status: 400 });
  }

  if ((session.Players || []).length >= 4) {
    return NextResponse.json({ error: "Spillokten er full (maks 4)" }, { status: 400 });
  }

  const { error: insertError } = await supabase
    .from("GamePlayer")
    .insert({
      id: nanoid(),
      gameSessionId: session.id,
      userId: user.id,
      displayName: user.name,
    });

  if (insertError) {
    return NextResponse.json({ error: "Kunne ikke bli med i spillokten" }, { status: 500 });
  }

  return NextResponse.json({
    sessionId: session.id,
    courseName: session.Course.name,
    playerCount: (session.Players || []).length + 1,
  });
}
