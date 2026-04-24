/**
 * Agent runner - event-triggered automation for CoachHQ.
 *
 * Events:
 *   - BookingCompleted: runs post-session pipeline if audio is available
 *   - CoachingSessionPublished: schedules next-session draft for the upcoming booking
 *
 * Each run is logged in AgentLog for observability.
 */
import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { generateNextSessionDraft } from "@/lib/portal/ai/next-session-orchestrator";
import { generateCoachingSummary } from "@/lib/portal/ai/coaching-summary";
import { transcribeAudio } from "@/lib/portal/ai/transcribe-audio";
import { createServiceClient } from "@/lib/supabase/server";

const AGENT_AUDIO = "post-session-transcriber";
const AGENT_NEXT_SESSION = "next-session-planner";

async function logRun(params: {
  agentType: string;
  model: string;
  status: "success" | "error" | "skipped";
  duration?: number;
  input?: string;
  output?: string;
  error?: string;
}) {
  try {
    await prisma.agentLog.create({
      data: {
        id: nanoid(),
        agentType: params.agentType,
        model: params.model,
        status: params.status,
        duration: params.duration,
        input: params.input,
        output: params.output,
        error: params.error,
      },
    });
  } catch (err) {
    logger.error("[agent-runner] log failed", err);
  }
}

/**
 * Event: Booking.status changed to COMPLETED.
 * Checks if a CoachingSession exists and has a pre-uploaded audio waiting.
 * If found, kicks off transcription + summary in the background.
 *
 * This is intentionally best-effort — no audio = no-op.
 */
export async function onBookingCompleted(bookingId: string): Promise<{
  ran: boolean;
  reason?: string;
}> {
  const started = Date.now();
  try {
    const session = await prisma.coachingSession.findUnique({
      where: { bookingId },
      include: {
        User: { select: { name: true } },
      },
    });

    if (!session) {
      await logRun({
        agentType: AGENT_AUDIO,
        model: "none",
        status: "skipped",
        input: bookingId,
        output: "no coaching session",
      });
      return { ran: false, reason: "no-session" };
    }

    if (session.aiSummary) {
      await logRun({
        agentType: AGENT_AUDIO,
        model: "none",
        status: "skipped",
        input: bookingId,
        output: "already summarized",
      });
      return { ran: false, reason: "already-summarized" };
    }

    if (!session.uploadedFilePath) {
      await logRun({
        agentType: AGENT_AUDIO,
        model: "none",
        status: "skipped",
        input: bookingId,
        output: "no audio",
      });
      return { ran: false, reason: "no-audio" };
    }

    // Fetch audio from Supabase Storage
    const supabase = createServiceClient();
    const { data: audioBlob, error } = await supabase.storage
      .from("coaching-audio")
      .download(session.uploadedFilePath);

    if (error || !audioBlob) {
      throw new Error(`Could not fetch audio: ${error?.message}`);
    }

    const file = new File([audioBlob], "session.m4a", {
      type: audioBlob.type || "audio/mpeg",
    });
    const { text: transcript } = await transcribeAudio(file);
    if (!transcript) throw new Error("empty transcript");

    const summary = await generateCoachingSummary(transcript, {
      playerName: session.User.name ?? undefined,
      primaryFocus: session.primaryFocus ?? undefined,
      sessionDate: session.sessionDate.toISOString().slice(0, 10),
    });

    await prisma.coachingSession.update({
      where: { id: session.id },
      data: {
        rawTranscript: transcript,
        aiSummary: summary.summary,
        aiKeyPoints: summary.keyPoints,
        aiFocusAreas: summary.focusAreas,
        aiActionItems: summary.actionItems,
        aiGeneratedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Notify coach to review
    const coach = await prisma.instructor.findUnique({
      where: { id: session.instructorId },
      select: { userId: true },
    });
    if (coach?.userId) {
      await prisma.notification.create({
        data: {
          id: nanoid(),
          userId: coach.userId,
          type: "COACHING_SUMMARY_DRAFT",
          title: "AI-utkast klart (auto)",
          message: `Automatisk transkribert og analysert etter booking ${bookingId.slice(0, 8)}. Åpne for å publisere.`,
          linkUrl: `/admin/elever/${session.studentId}?tab=sammendrag&session=${session.id}`,
        },
      });
    }

    await logRun({
      agentType: AGENT_AUDIO,
      model: "whisper+claude-sonnet-4-5",
      status: "success",
      duration: Date.now() - started,
      input: bookingId,
      output: `summary for ${session.id}`,
    });

    return { ran: true };
  } catch (err) {
    await logRun({
      agentType: AGENT_AUDIO,
      model: "whisper+claude-sonnet-4-5",
      status: "error",
      duration: Date.now() - started,
      input: bookingId,
      error: err instanceof Error ? err.message : String(err),
    });
    logger.error("[agent-runner] onBookingCompleted failed", err);
    return { ran: false, reason: "error" };
  }
}

/**
 * Event: CoachingSession.publishedToStudent set to true.
 * Auto-drafts next-session plan in background for the coach to review.
 */
export async function onCoachingSessionPublished(sessionId: string): Promise<{
  ran: boolean;
  reason?: string;
}> {
  const started = Date.now();
  try {
    const session = await prisma.coachingSession.findUnique({
      where: { id: sessionId },
      select: { studentId: true, instructorId: true },
    });
    if (!session) return { ran: false, reason: "no-session" };

    const draft = await generateNextSessionDraft({
      studentId: session.studentId,
      durationMinutes: 60,
    });

    const coach = await prisma.instructor.findUnique({
      where: { id: session.instructorId },
      select: { userId: true },
    });
    if (coach?.userId) {
      await prisma.notification.create({
        data: {
          id: nanoid(),
          userId: coach.userId,
          type: "AI_INSIGHT",
          title: "Utkast til neste økt klart",
          message: `Automatisk utkast generert etter publisering. ${draft.focus.areas[0]?.title ?? "Fokusområde klart"}.`,
          linkUrl: `/admin/elever/${session.studentId}?tab=neste`,
        },
      });
    }

    await logRun({
      agentType: AGENT_NEXT_SESSION,
      model: "claude-sonnet-4-5",
      status: "success",
      duration: Date.now() - started,
      input: sessionId,
      output: JSON.stringify(draft.focus).slice(0, 500),
    });

    return { ran: true };
  } catch (err) {
    await logRun({
      agentType: AGENT_NEXT_SESSION,
      model: "claude-sonnet-4-5",
      status: "error",
      duration: Date.now() - started,
      input: sessionId,
      error: err instanceof Error ? err.message : String(err),
    });
    logger.error("[agent-runner] onCoachingSessionPublished failed", err);
    return { ran: false, reason: "error" };
  }
}
