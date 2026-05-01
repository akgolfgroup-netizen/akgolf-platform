import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { createServiceClient } from "@/lib/supabase/server";
import {
  updatePhase,
  deletePhase,
} from "@/lib/portal/technical-plan/service";

async function canModifyPhase(userId: string, role: string, phaseId: string) {
  const supabase = createServiceClient();
  const { data: phase, error } = await supabase
    .from("technical_plan_phases")
    .select("plan:plan_id(coach_id)")
    .eq("id", phaseId)
    .single();

  if (error || !phase) return { ok: false };

  const coachId = (phase.plan as unknown as { coach_id: string }[])?.[0]?.coach_id;
  if (coachId !== userId && role !== "ADMIN") {
    return { ok: false };
  }
  return { ok: true };
}

/**
 * PATCH /api/portal/admin/technical-plans/phases/[phaseId]
 * Updates a phase.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ phaseId: string }> }
) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { phaseId } = await params;
  const { ok } = await canModifyPhase(user.id, user.role, phaseId);
  if (!ok) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const body = await req.json();

  const updated = await updatePhase(phaseId, {
    title: body.title,
    description: body.description,
    order: body.order,
    drillId: body.drillId,
    customName: body.customName,
    customDescription: body.customDescription,
    customMediaUrls: body.customMediaUrls,
    targetReps: body.targetReps,
    targetHours: body.targetHours,
    targetBalls: body.targetBalls,
    area: body.area,
    environment: body.environment,
    status: body.status,
    startDate: body.startDate ? new Date(body.startDate) : null,
    endDate: body.endDate ? new Date(body.endDate) : null,
  });

  return NextResponse.json({ phase: updated });
}

/**
 * DELETE /api/portal/admin/technical-plans/phases/[phaseId]
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ phaseId: string }> }
) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { phaseId } = await params;
  const { ok } = await canModifyPhase(user.id, user.role, phaseId);
  if (!ok) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  await deletePhase(phaseId);
  return NextResponse.json({ ok: true });
}
