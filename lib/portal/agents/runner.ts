/**
 * Agent runner - event-triggered automation for CoachHQ.
 *
 * Events:
 *   - onBookingCompleted          — post-session pipeline (transcribe + summarize)
 *   - onCoachingSessionPublished  — auto-draft next session
 *   - onUSISnapshotChanged        — ny: oppdater fokus-anbefaling ved delta > 0.5
 *   - onTestResultLogged          — ny: auto-skeduler retest 8/12 uker frem
 *   - onMetricSnapshotComputed    — ny: oppdater Mission Board ved tilbakegang
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
import { logAgentRun } from "./log";

const AGENT_AUDIO = "post-session-transcriber";
const AGENT_NEXT_SESSION = "next-session-planner";
const AGENT_USI_FOCUS = "usi-focus-updater";
const AGENT_TEST_SCHEDULER = "test-retest-scheduler";
const AGENT_DEGRADATION = "degradation-flagger";

// Standardvalg #USI: significant delta = 0.5
const USI_DELTA_THRESHOLD = 0.5;
// Standardvalg #Test: retest 8 uker for kortsiktig tester, 12 uker for langtid
const TEST_RETEST_DAYS_DEFAULT = 56; // 8 uker

async function logRun(params: {
  agentType: string;
  model: string;
  status: "success" | "error" | "skipped";
  duration?: number;
  input?: string;
  output?: string;
  error?: string;
}) {
  await logAgentRun({
    name: params.agentType,
    model: params.model,
    status: params.status,
    duration: params.duration,
    input: params.input,
    output: params.output,
    error: params.error,
  });
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

/**
 * Event: USI-snapshot for spilleren har endret seg.
 * Hvis delta er over USI_DELTA_THRESHOLD (Standardvalg: 0.5),
 * trigger oppdatering av fokus-anbefaling og varsle coach.
 *
 * TODO: Bekreft USI_DELTA_THRESHOLD med Anders.
 */
export async function onUSISnapshotChanged(
  userId: string,
  oldUSI: number | null,
  newUSI: number,
): Promise<{ ran: boolean; reason?: string; delta?: number }> {
  const started = Date.now();
  try {
    const delta = oldUSI !== null ? Math.abs(newUSI - oldUSI) : USI_DELTA_THRESHOLD;
    if (oldUSI !== null && delta < USI_DELTA_THRESHOLD) {
      await logRun({
        agentType: AGENT_USI_FOCUS,
        model: "rule-based",
        status: "skipped",
        input: JSON.stringify({ userId, oldUSI, newUSI, delta }),
        output: `delta ${delta.toFixed(3)} below threshold ${USI_DELTA_THRESHOLD}`,
      });
      return { ran: false, reason: "below-threshold", delta };
    }

    // Find aktiv coach for spilleren
    const relation = await prisma.coachPlayerRelation.findFirst({
      where: { playerUserId: userId, status: "ACTIVE" },
      include: {
        Coach: { select: { id: true, name: true } },
        Player: { select: { name: true } },
      },
    });

    if (!relation?.Coach?.id) {
      await logRun({
        agentType: AGENT_USI_FOCUS,
        model: "rule-based",
        status: "skipped",
        input: JSON.stringify({ userId, oldUSI, newUSI }),
        output: "no active coach",
      });
      return { ran: false, reason: "no-coach", delta };
    }

    const direction = oldUSI === null
      ? "førstegangs-snapshot"
      : newUSI > oldUSI
      ? "framgang"
      : "tilbakegang";

    const studentName = relation.Player?.name ?? "Eleven";

    await prisma.notification.create({
      data: {
        id: nanoid(),
        userId: relation.Coach.id,
        type: "AI_INSIGHT",
        title: `${studentName} — ${direction} i ferdighetsnivå`,
        message: `USI endret med ${delta.toFixed(2)} (fra ${oldUSI?.toFixed(2) ?? "—"} til ${newUSI.toFixed(2)}). Vurder ny fokusanbefaling.`,
        linkUrl: `/admin/elever/${userId}?tab=forecast`,
      },
    });

    await logRun({
      agentType: AGENT_USI_FOCUS,
      model: "rule-based",
      status: "success",
      duration: Date.now() - started,
      input: JSON.stringify({ userId, oldUSI, newUSI, delta }),
      output: `notified coach ${relation.Coach.id} about ${direction}`,
    });

    return { ran: true, delta };
  } catch (err) {
    await logRun({
      agentType: AGENT_USI_FOCUS,
      model: "rule-based",
      status: "error",
      duration: Date.now() - started,
      input: JSON.stringify({ userId, oldUSI, newUSI }),
      error: err instanceof Error ? err.message : String(err),
    });
    logger.error("[agent-runner] onUSISnapshotChanged failed", err);
    return { ran: false, reason: "error" };
  }
}

/**
 * Event: TestResult lagret.
 * Auto-skedulering av neste retest 8 uker (Standardvalg) eller 12 uker (langtid)
 * frem i tid. Sender varsel til coach + elev.
 *
 * TODO: Bekreft retest-intervaller (8/12 uker) med Anders.
 */
export async function onTestResultLogged(
  testResultId: string,
): Promise<{ ran: boolean; reason?: string; nextRetestDate?: Date }> {
  const started = Date.now();
  try {
    const test = await prisma.testResult.findUnique({
      where: { id: testResultId },
      include: {
        TestDefinition: { select: { name: true, category: true } },
        User: { select: { id: true, name: true } },
      },
    });

    if (!test) {
      await logRun({
        agentType: AGENT_TEST_SCHEDULER,
        model: "rule-based",
        status: "skipped",
        input: testResultId,
        output: "test not found",
      });
      return { ran: false, reason: "no-test" };
    }

    // 8 uker for de fleste; lag stub for 12-ukers test-typer (kan utvides senere)
    const retestDays = TEST_RETEST_DAYS_DEFAULT;
    const nextRetestDate = new Date();
    nextRetestDate.setDate(nextRetestDate.getDate() + retestDays);

    // Finn coach
    const relation = await prisma.coachPlayerRelation.findFirst({
      where: { playerUserId: test.User.id, status: "ACTIVE" },
      select: { coachUserId: true },
    });

    // Notify spilleren
    await prisma.notification.create({
      data: {
        id: nanoid(),
        userId: test.User.id,
        type: "AI_INSIGHT",
        title: `Retest planlagt: ${test.TestDefinition?.name ?? "test"}`,
        message: `Neste gjennomføring anbefales ${nextRetestDate.toLocaleDateString("nb-NO")} (${retestDays / 7} uker frem). Vi minner deg uken før.`,
        linkUrl: `/portal/statistikk`,
      },
    });

    // Notify coach (hvis finnes)
    if (relation?.coachUserId) {
      await prisma.notification.create({
        data: {
          id: nanoid(),
          userId: relation.coachUserId,
          type: "AI_INSIGHT",
          title: `${test.User.name ?? "Elev"} — retest skedulert`,
          message: `${test.TestDefinition?.name ?? "Test"} skedulert til ${nextRetestDate.toLocaleDateString("nb-NO")}.`,
          linkUrl: `/admin/elever/${test.User.id}?tab=tests`,
        },
      });
    }

    await logRun({
      agentType: AGENT_TEST_SCHEDULER,
      model: "rule-based",
      status: "success",
      duration: Date.now() - started,
      input: testResultId,
      output: `scheduled retest at ${nextRetestDate.toISOString().slice(0, 10)}`,
    });

    return { ran: true, nextRetestDate };
  } catch (err) {
    await logRun({
      agentType: AGENT_TEST_SCHEDULER,
      model: "rule-based",
      status: "error",
      duration: Date.now() - started,
      input: testResultId,
      error: err instanceof Error ? err.message : String(err),
    });
    logger.error("[agent-runner] onTestResultLogged failed", err);
    return { ran: false, reason: "error" };
  }
}

/**
 * Event: MetricSnapshot beregnet (typisk fra compute-usi-CRON).
 * Sjekker DegradationTracking — hvis tilbakegang oppdaget, trigger
 * oppdatering av Dagens fokus (Mission Board) og varsle coach.
 */
export async function onMetricSnapshotComputed(
  snapshotId: string,
): Promise<{ ran: boolean; reason?: string; degradationFound?: boolean }> {
  const started = Date.now();
  try {
    const snapshot = await prisma.metricSnapshot.findUnique({
      where: { id: snapshotId },
      include: {
        PlayerMetrics: {
          select: {
            userId: true,
            User: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!snapshot?.PlayerMetrics) {
      await logRun({
        agentType: AGENT_DEGRADATION,
        model: "rule-based",
        status: "skipped",
        input: snapshotId,
        output: "snapshot not found",
      });
      return { ran: false, reason: "no-snapshot" };
    }

    const userId = snapshot.PlayerMetrics.userId;
    const user = snapshot.PlayerMetrics.User;

    // Sjekk om det finnes nylig DegradationTracking for spilleren
    const recentDegradation = await prisma.degradationTracking.findFirst({
      where: {
        userId,
        startedAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) }, // siste 7 dager
      },
      orderBy: { startedAt: "desc" },
    });

    if (!recentDegradation) {
      await logRun({
        agentType: AGENT_DEGRADATION,
        model: "rule-based",
        status: "skipped",
        input: snapshotId,
        output: "no recent degradation",
      });
      return { ran: false, reason: "no-degradation", degradationFound: false };
    }

    // Finn coach
    const relation = await prisma.coachPlayerRelation.findFirst({
      where: { playerUserId: userId, status: "ACTIVE" },
      select: { coachUserId: true },
    });

    if (relation?.coachUserId) {
      await prisma.notification.create({
        data: {
          id: nanoid(),
          userId: relation.coachUserId,
          type: "AI_INSIGHT",
          title: `${user?.name ?? "Elev"} — tilbakegang oppdaget`,
          message: `Sporing av tilbakegang er aktiv. Vurder å justere fokus eller booke ekstra økt.`,
          linkUrl: `/admin/elever/${userId}?tab=signaler`,
        },
      });
    }

    await logRun({
      agentType: AGENT_DEGRADATION,
      model: "rule-based",
      status: "success",
      duration: Date.now() - started,
      input: snapshotId,
      output: `flagged degradation for ${userId}`,
    });

    return { ran: true, degradationFound: true };
  } catch (err) {
    await logRun({
      agentType: AGENT_DEGRADATION,
      model: "rule-based",
      status: "error",
      duration: Date.now() - started,
      input: snapshotId,
      error: err instanceof Error ? err.message : String(err),
    });
    logger.error("[agent-runner] onMetricSnapshotComputed failed", err);
    return { ran: false, reason: "error" };
  }
}
