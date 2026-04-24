import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { createServerSupabase } from "@/lib/supabase/server";
import { generateCoachingSummary } from "@/lib/portal/ai/coaching-summary";
import { transcribeAudio } from "@/lib/portal/ai/transcribe-audio";
import { isStaff } from "@/lib/portal/rbac";
import { appendCoachingSessionToProfile } from "@/lib/portal/notion/player-profiles";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { prisma } from "@/lib/portal/prisma";

const ALLOWED_EXTENSIONS = [".m4a", ".mp3", ".wav", ".webm", ".mp4", ".ogg"];
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const AUDIO_BUCKET = "coaching-audio";

export const maxDuration = 300;

/**
 * POST /api/portal/ai/coaching-transcription
 *
 * Body (multipart/form-data):
 *   - audio: File (required) — .m4a/.mp3/.wav/.webm/.mp4/.ogg, max 25MB
 *   - sessionId: string (optional) — existing CoachingSession.id to update
 *   - bookingId: string (optional) — if provided and no sessionId, creates new CoachingSession
 *   - trackmanContext: string (optional) — JSON-stringified TrackMan averages to use as context
 *
 * Creates/updates a CoachingSession with:
 *   - uploadedFilePath: Supabase Storage path to raw audio
 *   - rawTranscript: full Whisper transcription
 *   - aiSummary: 2-4 sentences prose
 *   - aiKeyPoints, aiFocusAreas, aiActionItems: structured arrays
 *   - aiGeneratedAt: timestamp
 *   - publishedToStudent: false (coach must manually publish)
 */
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
  const formData = await req.formData();

  const sessionIdInput = formData.get("sessionId") as string | null;
  const bookingIdInput = formData.get("bookingId") as string | null;
  const trackmanContextRaw = formData.get("trackmanContext") as string | null;
  const file = formData.get("audio") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Ingen lydfil lastet opp" }, { status: 400 });
  }

  const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: `Filtype ${ext} er ikke støttet. Bruk: ${ALLOWED_EXTENSIONS.join(", ")}` },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `Filen er for stor (${(file.size / 1024 / 1024).toFixed(1)} MB). Maks 25 MB.` },
      { status: 400 }
    );
  }

  if (!sessionIdInput && !bookingIdInput) {
    return NextResponse.json(
      { error: "Enten sessionId eller bookingId må oppgis" },
      { status: 400 }
    );
  }

  // Resolve or create CoachingSession
  let coachingSession = sessionIdInput
    ? await prisma.coachingSession.findUnique({
        where: { id: sessionIdInput },
        include: {
          Booking: { include: { ServiceType: true } },
          User: { select: { id: true, name: true, supabaseId: true, notionPageId: true } },
        },
      })
    : null;

  if (!coachingSession && bookingIdInput) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingIdInput },
      include: {
        ServiceType: true,
        User: { select: { id: true, name: true, supabaseId: true, notionPageId: true } },
        Instructor: { select: { id: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking ikke funnet" }, { status: 404 });
    }
    if (!booking.instructorId || !booking.studentId) {
      return NextResponse.json(
        { error: "Booking mangler instruktør eller elev" },
        { status: 400 }
      );
    }

    const existing = await prisma.coachingSession.findUnique({
      where: { bookingId: booking.id },
      include: {
        Booking: { include: { ServiceType: true } },
        User: { select: { id: true, name: true, supabaseId: true, notionPageId: true } },
      },
    });

    if (existing) {
      coachingSession = existing;
    } else {
      const created = await prisma.coachingSession.create({
        data: {
          id: nanoid(),
          bookingId: booking.id,
          studentId: booking.studentId,
          instructorId: booking.instructorId,
          sessionDate: booking.startTime,
          updatedAt: new Date(),
        },
        include: {
          Booking: { include: { ServiceType: true } },
          User: { select: { id: true, name: true, supabaseId: true, notionPageId: true } },
        },
      });
      coachingSession = created;
    }
  }

  if (!coachingSession) {
    return NextResponse.json({ error: "Sesjon ikke funnet" }, { status: 404 });
  }

  // Upload raw audio to Supabase Storage
  const storagePath = `${coachingSession.User.supabaseId ?? coachingSession.studentId}/${coachingSession.id}/${Date.now()}${ext}`;
  const audioBuffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(AUDIO_BUCKET)
    .upload(storagePath, audioBuffer, {
      contentType: file.type || "audio/mpeg",
      upsert: false,
    });

  if (uploadError) {
    logger.error("[coaching-transcription] Storage upload failed:", uploadError);
    // Non-blocking — vi kan fortsatt transkribere og lagre sammendraget
  }

  // Transcribe audio via Whisper
  const { text: transcription } = await transcribeAudio(file);
  if (!transcription) {
    return NextResponse.json(
      { error: "Transkribering ga tomt resultat" },
      { status: 500 }
    );
  }

  // Parse optional trackman context
  let trackmanAverages: Record<string, unknown> | undefined;
  if (trackmanContextRaw) {
    try {
      trackmanAverages = JSON.parse(trackmanContextRaw);
    } catch {
      logger.warn("[coaching-transcription] Invalid trackmanContext JSON");
    }
  }

  // Generate structured summary
  const summary = await generateCoachingSummary(transcription, {
    trackmanAverages,
    playerName: coachingSession.User.name ?? undefined,
    primaryFocus: coachingSession.primaryFocus ?? undefined,
    sessionDate: coachingSession.sessionDate.toISOString().slice(0, 10),
  });

  // Persist to CoachingSession
  const updated = await prisma.coachingSession.update({
    where: { id: coachingSession.id },
    data: {
      rawTranscript: transcription,
      aiSummary: summary.summary,
      aiKeyPoints: summary.keyPoints,
      aiFocusAreas: summary.focusAreas,
      aiActionItems: summary.actionItems,
      aiGeneratedAt: new Date(),
      uploadedFilePath: uploadError ? null : storagePath,
      updatedAt: new Date(),
    },
  });

  // Notify coach that draft is ready (NOT student — requires explicit publish)
  // Instructor.userId is the User.id of the coach; fall back to the uploader if linkage missing
  const coachUser = await prisma.instructor.findUnique({
    where: { id: coachingSession.instructorId },
    select: { userId: true },
  });
  const notifyUserId = coachUser?.userId ?? user.id;

  await prisma.notification.create({
    data: {
      id: nanoid(),
      userId: notifyUserId,
      type: "COACHING_SUMMARY_DRAFT",
      title: "Sammendrag klart for gjennomgang",
      message: `AI-utkast for ${coachingSession.User.name ?? "elev"} er klart. Åpne for å redigere og publisere.`,
      linkUrl: `/admin/elever/${coachingSession.studentId}?tab=sammendrag&session=${coachingSession.id}`,
    },
  });

  // Sync to Notion (non-blocking, preserves existing behavior)
  const serviceName = coachingSession.Booking?.ServiceType?.name ?? "Coaching";
  if (coachingSession.User.notionPageId) {
    appendCoachingSessionToProfile(coachingSession.User.notionPageId, {
      date: coachingSession.sessionDate.toISOString(),
      serviceName,
      keyPoints: summary.keyPoints,
      focusAreas: summary.focusAreas,
      actionItems: summary.actionItems,
    }).catch((err) =>
      logger.error(`[coaching-transcription] Notion sync failed`, err)
    );
  }

  return NextResponse.json({
    sessionId: updated.id,
    transcription,
    ...summary,
    storagePath: uploadError ? null : storagePath,
  });
}
