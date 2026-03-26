import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { generateCoachingSummary } from "@/lib/portal/ai/coaching-summary";
import { transcribeAudio } from "@/lib/portal/ai/transcribe-audio";
import { isStaff } from "@/lib/portal/rbac";
import { appendCoachingSessionToProfile } from "@/lib/portal/notion/player-profiles";

const ALLOWED_EXTENSIONS = [".m4a", ".mp3", ".wav", ".webm", ".mp4", ".ogg"];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const formData = await req.formData();
  const sessionId = formData.get("sessionId") as string;
  const file = formData.get("audio") as File | null;

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId er påkrevd" },
      { status: 400 }
    );
  }
  if (!file) {
    return NextResponse.json(
      { error: "Ingen lydfil lastet opp" },
      { status: 400 }
    );
  }

  // Validate file extension
  const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      {
        error: `Filtype ${ext} er ikke støttet. Bruk: ${ALLOWED_EXTENSIONS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: `Filen er for stor (${(file.size / 1024 / 1024).toFixed(1)} MB). Maks 25 MB.`,
      },
      { status: 400 }
    );
  }

  // Verify session exists
  const coachingSession = await prisma.coachingSession.findUnique({
    where: { id: sessionId },
    include: { booking: { include: { serviceType: true } } },
  });
  if (!coachingSession) {
    return NextResponse.json(
      { error: "Sesjon ikke funnet" },
      { status: 404 }
    );
  }

  // Transcribe audio via Whisper
  const { text: transcription } = await transcribeAudio(file);
  if (!transcription) {
    return NextResponse.json(
      { error: "Transkribering ga tomt resultat" },
      { status: 500 }
    );
  }

  // Generate AI summary from transcription
  const summary = await generateCoachingSummary(transcription);

  // Persist transcription + AI summary
  await prisma.coachingSession.update({
    where: { id: sessionId },
    data: {
      transcriptionText: transcription,
      aiSummary: transcription,
      aiKeyPoints: summary.keyPoints,
      aiFocusAreas: summary.focusAreas,
      aiActionItems: summary.actionItems,
      aiGeneratedAt: new Date(),
    },
  });

  // Sync to Notion player profile (non-blocking)
  const student = await prisma.user.findUnique({
    where: { id: coachingSession.studentId },
    select: { notionPageId: true, name: true },
  });
  if (student?.notionPageId) {
    appendCoachingSessionToProfile(student.notionPageId, {
      date: coachingSession.sessionDate.toISOString(),
      serviceName:
        coachingSession.booking?.serviceType?.name ?? "Coaching",
      keyPoints: summary.keyPoints,
      focusAreas: summary.focusAreas,
      actionItems: summary.actionItems,
    }).catch((err) =>
      console.error(
        `[coaching-transcription] Notion sync failed for ${student.name}:`,
        err
      )
    );
  }

  return NextResponse.json({
    transcription,
    ...summary,
  });
}
