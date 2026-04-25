import { NextRequest, NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { renderPlanPdf } from "@/lib/portal/training/pdf-export";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  const user = await requirePortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = await params;

  const plan = await prisma.trainingPlan.findUnique({
    where: { id: planId },
    include: {
      User_TrainingPlan_studentIdToUser: {
        select: { id: true, name: true, email: true },
      },
      TrainingPlanWeek: {
        orderBy: { weekNumber: "asc" },
        include: {
          TrainingPlanSession: {
            orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }],
          },
        },
      },
    },
  });

  if (!plan) {
    return NextResponse.json({ error: "Plan ikke funnet" }, { status: 404 });
  }

  // Tilgangs-sjekk: spilleren kan eksportere egen plan, staff kan eksportere alle
  const isOwner = plan.studentId === user.id;
  const isAdmin = isStaff(user.role);
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const studentName =
    plan.User_TrainingPlan_studentIdToUser.name ??
    plan.User_TrainingPlan_studentIdToUser.email ??
    "Spiller";

  const buffer = await renderPlanPdf({
    title: plan.title,
    description: plan.description,
    goals: plan.goals,
    studentName,
    periodType: plan.periodType,
    startDate: plan.startDate.toISOString().slice(0, 10),
    endDate: plan.endDate.toISOString().slice(0, 10),
    aiGenerated: plan.aiGenerated,
    coachFeedback: plan.coachFeedback,
    coachFeedbackAt: plan.coachFeedbackAt?.toISOString() ?? null,
    weeks: plan.TrainingPlanWeek.map((w) => ({
      weekNumber: w.weekNumber,
      weekStart: w.weekStart.toISOString().slice(0, 10),
      focus: w.focus,
      volumeLabel: w.volumeLabel,
      restDays: w.restDays,
      sessions: w.TrainingPlanSession.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        title: s.title,
        durationMinutes: s.durationMinutes,
        focusArea: s.focusArea,
      })),
    })),
    generatedAt: new Date().toISOString(),
  });

  const filename = `treningsplan-${slugify(plan.title)}-${plan.startDate
    .toISOString()
    .slice(0, 10)}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[æå]/g, "a")
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
