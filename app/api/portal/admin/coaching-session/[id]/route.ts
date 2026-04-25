import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import { sendPushToUser } from "@/lib/portal/push/send-push";

/**
 * GET /api/portal/admin/coaching-session/[id]
 * Returns the full draft (including transcription) for coach editor.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }
  const { id } = await params;
  const s = await prisma.coachingSession.findUnique({
    where: { id },
    select: {
      id: true,
      sessionDate: true,
      rawTranscript: true,
      aiSummary: true,
      aiKeyPoints: true,
      aiFocusAreas: true,
      aiActionItems: true,
      aiGeneratedAt: true,
      publishedToStudent: true,
      publishedAt: true,
      uploadedFilePath: true,
    },
  });
  if (!s) {
    return NextResponse.json({ error: "Sesjon ikke funnet" }, { status: 404 });
  }
  return NextResponse.json({
    draft: {
      id: s.id,
      sessionDate: s.sessionDate.toISOString(),
      rawTranscript: s.rawTranscript,
      aiSummary: s.aiSummary,
      aiKeyPoints: s.aiKeyPoints,
      aiFocusAreas: s.aiFocusAreas,
      aiActionItems: s.aiActionItems,
      aiGeneratedAt: s.aiGeneratedAt?.toISOString() ?? null,
      publishedToStudent: s.publishedToStudent,
      publishedAt: s.publishedAt?.toISOString() ?? null,
      audioUrl: s.uploadedFilePath,
    },
  });
}

/**
 * PATCH /api/portal/admin/coaching-session/[id]
 *
 * Body:
 *   - aiSummary?: string
 *   - aiKeyPoints?: string[]
 *   - aiFocusAreas?: string[]
 *   - aiActionItems?: string[]
 *   - publish?: boolean — sets publishedToStudent=true + notifies student
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const session = await prisma.coachingSession.findUnique({
    where: { id },
    include: { User: { select: { id: true, name: true } } },
  });
  if (!session) {
    return NextResponse.json({ error: "Sesjon ikke funnet" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof body.aiSummary === "string") updateData.aiSummary = body.aiSummary;
  if (Array.isArray(body.aiKeyPoints)) updateData.aiKeyPoints = body.aiKeyPoints;
  if (Array.isArray(body.aiFocusAreas)) updateData.aiFocusAreas = body.aiFocusAreas;
  if (Array.isArray(body.aiActionItems)) updateData.aiActionItems = body.aiActionItems;

  const wasAlreadyPublished = session.publishedToStudent;
  if (body.publish === true) {
    updateData.publishedToStudent = true;
    updateData.publishedAt = new Date();
  }

  const updated = await prisma.coachingSession.update({
    where: { id },
    data: updateData,
  });

  // If newly published, notify the student + kick off next-session auto-draft
  if (body.publish === true && !wasAlreadyPublished) {
    try {
      await prisma.notification.create({
        data: {
          id: nanoid(),
          userId: session.studentId,
          type: "COACHING_SUMMARY",
          title: "Sammendrag fra coachingøkten er klart",
          message: `Sammendrag fra økten ${session.sessionDate.toLocaleDateString("no-NO")} er nå tilgjengelig.`,
          linkUrl: `/portal/coaching-historikk?session=${id}`,
        },
      });
    } catch (err) {
      logger.error("[coaching-session/publish] notification failed", err);
    }

    sendPushToUser({
      userId: session.studentId,
      title: "Nytt sammendrag fra coachen",
      body: `Sammendrag fra økten ${session.sessionDate.toLocaleDateString("no-NO")} er klart.`,
      url: `/portal/coaching-historikk?session=${id}`,
    }).catch((err) => logger.error("[coaching-session/publish] push failed", err));

    // Background: trigger next-session draft generation (best-effort)
    import("@/lib/portal/agents/runner")
      .then(({ onCoachingSessionPublished }) => onCoachingSessionPublished(id))
      .catch((err) => logger.error("[coaching-session/publish] auto-next failed", err));

    // Cowork-eksport (kun hvis COWORK_SYNC_PATH er satt, typisk lokal dev)
    import("@/lib/portal/cowork/append-session")
      .then(({ appendSessionToCowork }) =>
        appendSessionToCowork({
          studentName: session.User.name ?? "ukjent-elev",
          sessionDate: session.sessionDate,
          primaryFocus: updated.primaryFocus,
          summary: updated.aiSummary,
          keyPoints: updated.aiKeyPoints,
          focusAreas: updated.aiFocusAreas,
          actionItems: updated.aiActionItems,
          rawTranscript: updated.rawTranscript,
          sessionId: id,
        })
      )
      .catch((err) => logger.error("[coaching-session/publish] cowork failed", err));
  }

  return NextResponse.json({ ok: true, session: updated });
}
