import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import {
  getTechnicalPlanById,
  createPhase,
} from "@/lib/portal/technical-plan/service";

/**
 * GET /api/portal/admin/technical-plans/[id]/phases
 * Returns phases for a plan.
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
  const plan = await getTechnicalPlanById(id);

  if (!plan) {
    return NextResponse.json({ error: "Plan ikke funnet" }, { status: 404 });
  }

  if (plan.coachId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  return NextResponse.json({ phases: plan.phases });
}

/**
 * POST /api/portal/admin/technical-plans/[id]/phases
 * Adds a new phase to a plan.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { id } = await params;
  const plan = await getTechnicalPlanById(id);

  if (!plan) {
    return NextResponse.json({ error: "Plan ikke funnet" }, { status: 404 });
  }

  if (plan.coachId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.phaseCode || !body.title || body.order === undefined || !body.area) {
    return NextResponse.json(
      { error: "phaseCode, title, order og area er påkrevd" },
      { status: 400 }
    );
  }

  const phase = await createPhase({
    planId: id,
    phaseCode: body.phaseCode,
    title: body.title,
    description: body.description,
    order: body.order,
    drillId: body.drillId,
    customName: body.customName,
    customDescription: body.customDescription,
    customMediaUrls: body.customMediaUrls,
    targetReps: body.targetReps ?? 0,
    targetHours: body.targetHours,
    targetBalls: body.targetBalls,
    area: body.area,
    environment: body.environment ?? "M1",
    startDate: body.startDate ? new Date(body.startDate) : null,
    endDate: body.endDate ? new Date(body.endDate) : null,
  });

  return NextResponse.json({ phase }, { status: 201 });
}
