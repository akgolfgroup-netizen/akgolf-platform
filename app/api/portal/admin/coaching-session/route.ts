import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/admin/coaching-session?studentId=<id>
 * Returns a list of coaching sessions for a student (admin view).
 */
export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const studentId = req.nextUrl.searchParams.get("studentId");
  if (!studentId) {
    return NextResponse.json({ error: "studentId er påkrevd" }, { status: 400 });
  }

  const rows = await prisma.coachingSession.findMany({
    where: { studentId },
    orderBy: { sessionDate: "desc" },
    take: 50,
    select: {
      id: true,
      sessionDate: true,
      primaryFocus: true,
      publishedToStudent: true,
      aiSummary: true,
      aiGeneratedAt: true,
    },
  });

  const sessions = rows.map((r) => ({
    id: r.id,
    sessionDate: r.sessionDate.toISOString(),
    primaryFocus: r.primaryFocus,
    publishedToStudent: r.publishedToStudent,
    hasSummary: Boolean(r.aiSummary),
  }));

  return NextResponse.json({ sessions });
}
