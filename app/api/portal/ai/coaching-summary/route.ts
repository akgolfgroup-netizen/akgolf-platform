import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createServerSupabase } from "@/lib/supabase/server";
import { generateCoachingSummary } from "@/lib/portal/ai/coaching-summary";
import { isStaff } from "@/lib/portal/rbac";
import { appendCoachingSessionToProfile } from "@/lib/portal/notion/player-profiles";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const rateLimit = checkRateLimit(`ai:${user.id}`, RATE_LIMITS.AI_ENDPOINTS);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange AI-forespørsler" }, { status: 429 });
  }

  const supabase = await createServerSupabase();

  const { sessionId, notes } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId er påkrevd" }, { status: 400 });
  }

  // Fetch coaching session with related data
  const { data: coachingSession, error: sessionError } = await supabase
    .from("CoachingSession")
    .select(
      `
      id,
      studentId,
      instructorNotes,
      studentNotes,
      sessionDate,
      Booking (ServiceType (name))
    `
    )
    .eq("id", sessionId)
    .single();

  if (sessionError || !coachingSession) {
    return NextResponse.json({ error: "Sesjon ikke funnet" }, { status: 404 });
  }

  const content = notes || coachingSession.instructorNotes || coachingSession.studentNotes;
  if (!content) {
    return NextResponse.json(
      { error: "Ingen notater å analysere" },
      { status: 400 }
    );
  }

  const summary = await generateCoachingSummary(content);

  // Update session with AI summary
  const { error: updateError } = await supabase
    .from("CoachingSession")
    .update({
      aiSummary: content,
      aiKeyPoints: summary.keyPoints,
      aiFocusAreas: summary.focusAreas,
      aiActionItems: summary.actionItems,
      aiGeneratedAt: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (updateError) {
    logger.error("[coaching-summary] Failed to update session:", updateError);
  }

  // Sync to Notion player profile (non-blocking)
  const { data: student } = await supabase
    .from("User")
    .select("notionPageId, name")
    .eq("id", coachingSession.studentId)
    .single();

  if (student?.notionPageId) {
    appendCoachingSessionToProfile(student.notionPageId, {
      date: new Date(coachingSession.sessionDate).toISOString(),
      serviceName: (coachingSession.Booking as unknown as { ServiceType?: { name: string } })?.ServiceType?.name ?? "Coaching",
      keyPoints: summary.keyPoints,
      focusAreas: summary.focusAreas,
      actionItems: summary.actionItems,
    }).catch((err) =>
      logger.error(`[coaching-summary] Notion sync failed for ${student.name}`, err)
    );
  }

  return NextResponse.json(summary);
}
