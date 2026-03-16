import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { generateCoachingSummary } from "@/lib/portal/ai/coaching-summary";
import { isStaff } from "@/lib/portal/rbac";
import { appendCoachingSessionToProfile } from "@/lib/portal/notion/player-profiles";

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { sessionId, notes } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId er påkrevd" }, { status: 400 });
  }

  const coachingSession = await prisma.coachingSession.findUnique({
    where: { id: sessionId },
    include: { booking: { include: { serviceType: true } } },
  });
  if (!coachingSession) {
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

  await prisma.coachingSession.update({
    where: { id: sessionId },
    data: {
      aiSummary: content,
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
      serviceName: coachingSession.booking?.serviceType?.name ?? "Coaching",
      keyPoints: summary.keyPoints,
      focusAreas: summary.focusAreas,
      actionItems: summary.actionItems,
    }).catch((err) =>
      console.error(
        `[coaching-summary] Notion sync failed for ${student.name}:`,
        err
      )
    );
  }

  return NextResponse.json(summary);
}
