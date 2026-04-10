"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ─── Typer ──────────────────────────────────────────────

export type GameSessionPlayer = {
  userId: string;
  User: { id: string; name: string | null; image: string | null } | null;
};

export type GameSessionRound = {
  userId: string;
  totalScore: number | null;
  scoreToPar: number | null;
  sgTotal: number | null;
};

export type GameSessionData = {
  id: string;
  name: string | null;
  courseId: string;
  date: string;
  teeColor: string;
  format: string;
  createdById: string;
  joinCode: string;
  isActive: boolean;
  Course: { name: string; par: number } | null;
  Players: GameSessionPlayer[];
  Rounds: GameSessionRound[];
};

export type CourseData = {
  id: string;
  name: string;
  location: string | null;
  par: number;
  courseRating: number | null;
  slopeRating: number | null;
};

export type ChallengeData = {
  id: string;
  title: string;
  type: string;
  metric: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  Creator: { name: string | null } | null;
  Participants: { userId: string; currentValue: number | null; rank: number | null }[];
  _participantCount: number;
};

// ─── Server Actions ─────────────────────────────────────

/**
 * Hent brukerens spillokter (nyeste forst)
 */
export async function getGameSessions(): Promise<GameSessionData[]> {
  const user = await requirePortalUser();
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: sessions, error } = await supabase
    .from("GameSession")
    .select(`
      id, name, courseId, date, teeColor, format, createdById, joinCode, isActive,
      Course:courseId (name, par),
      Players:GamePlayer (
        userId,
        User:userId (id, name, image)
      ),
      Rounds:Round (
        userId,
        totalScore,
        scoreToPar,
        sgTotal
      )
    `)
    .or(`createdById.eq.${user.id},GamePlayer.userId.eq.${user.id}`)
    .order("date", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Feil ved henting av spillokter:", error);
    return [];
  }

  return (sessions as unknown as GameSessionData[]) || [];
}

/**
 * Hent nylige baner (norske, sortert alfabetisk)
 */
export async function getRecentCourses(): Promise<CourseData[]> {
  await requirePortalUser();
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: courses, error } = await supabase
    .from("Course")
    .select("id, name, location, par, courseRating, slopeRating")
    .eq("country", "NO")
    .order("name", { ascending: true })
    .limit(12);

  if (error) {
    console.error("Feil ved henting av baner:", error);
    return [];
  }

  return (courses as CourseData[]) || [];
}

/**
 * Hent aktive utfordringer (Challenge) brukeren deltar i eller som er offentlige
 */
export async function getChallenges(): Promise<ChallengeData[]> {
  const user = await requirePortalUser();
  const supabase = createClient(supabaseUrl, supabaseKey);

  const now = new Date().toISOString();

  // Hent offentlige utfordringer som ikke har utlopt
  const { data: challenges, error } = await supabase
    .from("Challenge")
    .select(`
      id, title, type, metric, startDate, endDate, isPublic,
      Creator:createdById (name),
      Participants:ChallengeParticipant (userId, currentValue, rank)
    `)
    .or(`isPublic.eq.true,createdById.eq.${user.id}`)
    .gte("endDate", now)
    .order("endDate", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Feil ved henting av utfordringer:", error);
    return [];
  }

  return (
    (challenges || []).map((c) => ({
      ...(c as unknown as ChallengeData),
      _participantCount: Array.isArray(c.Participants) ? c.Participants.length : 0,
    }))
  );
}

/**
 * Opprett ny spillokt
 */
export async function createGameSession(data: {
  courseId: string;
  name?: string;
  teeColor?: string;
  format?: string;
}): Promise<{ success: boolean; sessionId?: string; joinCode?: string; error?: string }> {
  const user = await requirePortalUser();
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { courseId, name, teeColor, format } = data;

  if (!courseId) {
    return { success: false, error: "Velg en bane" };
  }

  // Sjekk at banen finnes
  const { data: course, error: courseError } = await supabase
    .from("Course")
    .select("name")
    .eq("id", courseId)
    .single();

  if (courseError || !course) {
    return { success: false, error: "Bane ikke funnet" };
  }

  // Generer unik join-kode
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let joinCode = "";
  for (let attempt = 0; attempt < 10; attempt++) {
    joinCode = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    const { data: existing } = await supabase
      .from("GameSession")
      .select("id")
      .eq("joinCode", joinCode)
      .single();

    if (!existing) break;
  }

  const sessionId = nanoid();
  const now = new Date().toISOString();

  const { error: sessionError } = await supabase
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
    });

  if (sessionError) {
    console.error("Feil ved oppretting av spillokt:", sessionError);
    return { success: false, error: "Kunne ikke opprette spillokt" };
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
    console.error("Feil ved tillegging av spiller:", playerError);
    return { success: false, error: "Kunne ikke legge til spiller" };
  }

  revalidatePath("/portal/spill");
  return { success: true, sessionId, joinCode };
}

/**
 * Bli med i spillokt via kode
 */
export async function joinGameSession(
  joinCode: string
): Promise<{ success: boolean; sessionId?: string; courseName?: string; error?: string }> {
  const user = await requirePortalUser();
  const supabase = createClient(supabaseUrl, supabaseKey);

  if (!joinCode || joinCode.length < 4) {
    return { success: false, error: "Ugyldig kode" };
  }

  const { data: session, error } = await supabase
    .from("GameSession")
    .select(`
      id, isActive,
      Course:courseId (name),
      Players:GamePlayer (userId)
    `)
    .eq("joinCode", joinCode.toUpperCase())
    .single();

  if (error || !session) {
    return { success: false, error: "Fant ingen spillokt med denne koden" };
  }

  const typedSession = session as unknown as {
    id: string;
    isActive: boolean;
    Course: { name: string } | null;
    Players: { userId: string }[];
  };

  if (!typedSession.isActive) {
    return { success: false, error: "Spillokten er avsluttet" };
  }

  if (typedSession.Players.some((p) => p.userId === user.id)) {
    return { success: false, error: "Du er allerede med i dette spillet" };
  }

  if (typedSession.Players.length >= 4) {
    return { success: false, error: "Spillokten er full (maks 4 spillere)" };
  }

  const { error: insertError } = await supabase
    .from("GamePlayer")
    .insert({
      id: nanoid(),
      gameSessionId: typedSession.id,
      userId: user.id,
      displayName: user.name,
    });

  if (insertError) {
    console.error("Feil ved joining av spillokt:", insertError);
    return { success: false, error: "Kunne ikke bli med i spillokten" };
  }

  revalidatePath("/portal/spill");
  return {
    success: true,
    sessionId: typedSession.id,
    courseName: typedSession.Course?.name ?? undefined,
  };
}

/**
 * Sok etter baner (for ny-spill-dialogen)
 */
export async function searchCourses(query: string): Promise<CourseData[]> {
  await requirePortalUser();
  const supabase = createClient(supabaseUrl, supabaseKey);

  let dbQuery = supabase
    .from("Course")
    .select("id, name, location, par, courseRating, slopeRating")
    .eq("country", "NO")
    .order("name", { ascending: true })
    .limit(20);

  if (query.length > 0) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,location.ilike.%${query}%`);
  }

  const { data, error } = await dbQuery;

  if (error) {
    console.error("Feil ved banesok:", error);
    return [];
  }

  return (data as CourseData[]) || [];
}
