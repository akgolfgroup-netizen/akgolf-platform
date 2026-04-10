import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { generateSessionPlan } from "@/lib/portal/ai/session-planner";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { isStaff } from "@/lib/portal/rbac";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const user = await getPortalUser();

  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  }

  const rateLimit = checkRateLimit(
    `session-plan:${user.id}`,
    RATE_LIMITS.AI_ENDPOINTS
  );
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const body = await req.json() as { bookingId?: unknown };
  const { bookingId } = body;

  if (!bookingId || typeof bookingId !== "string") {
    return NextResponse.json({ error: "bookingId er påkrevd" }, { status: 400 });
  }

  const supabase = await createServerSupabase();

  const { data: booking, error } = await supabase
    .from("Booking")
    .select(`
      id, focusArea, playerNotes, startTime,
      ServiceType:serviceTypeId (name, duration),
      User:studentId (name, handicap),
      Instructor:instructorId (User:userId (name))
    `)
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    logger.error("[session-plan] Booking ikke funnet:", error);
    return NextResponse.json({ error: "Booking ikke funnet" }, { status: 404 });
  }

  if (!booking.focusArea) {
    return NextResponse.json(
      { error: "Ingen fokusområde valgt for denne bookingen" },
      { status: 400 }
    );
  }

  // Hent nylige coaching-sesjoner for denne spilleren
  const studentRel = booking.User as unknown as
    | { name: string | null; handicap: number | null }
    | Array<{ name: string | null; handicap: number | null }>
    | null;

  const student = Array.isArray(studentRel) ? studentRel[0] : studentRel;

  const serviceRel = booking.ServiceType as unknown as
    | { name: string; duration: number }
    | Array<{ name: string; duration: number }>
    | null;

  const service = Array.isArray(serviceRel) ? serviceRel[0] : serviceRel;

  // Hent de siste 3 coaching-sesjonene for spilleren (via bookingId-relasjon)
  const { data: recentSessions } = await supabase
    .from("CoachingSession")
    .select("aiSummary, instructorNotes, sessionDate")
    .eq("studentId", (booking.User as unknown as { id?: string } | null)?.id ?? "")
    .order("sessionDate", { ascending: false })
    .limit(3);

  const previousSessions = (recentSessions ?? [])
    .map((s) => (s.aiSummary ?? s.instructorNotes ?? "") as string)
    .filter((s) => s.length > 0);

  const plan = await generateSessionPlan({
    focusArea: booking.focusArea as string,
    playerNotes: booking.playerNotes ?? undefined,
    playerName: student?.name ?? "Spiller",
    serviceDuration: service?.duration ?? 50,
    playerHandicap: student?.handicap ?? undefined,
    previousSessions,
  });

  return NextResponse.json({ plan });
}
