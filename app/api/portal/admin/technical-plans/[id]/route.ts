import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import {
  getTechnicalPlanById,
  updateTechnicalPlan,
  deleteTechnicalPlan,
} from "@/lib/portal/technical-plan/service";

/**
 * GET /api/portal/admin/technical-plans/[id]
 * Returns full technical plan with phases and drill details.
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

  // Coaches can only view their own plans; admins can view all
  if (plan.coachId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  return NextResponse.json({ plan });
}

/**
 * PATCH /api/portal/admin/technical-plans/[id]
 * Updates plan metadata.
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

  const plan = await getTechnicalPlanById(id);
  if (!plan) {
    return NextResponse.json({ error: "Plan ikke funnet" }, { status: 404 });
  }

  if (plan.coachId !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const updated = await updateTechnicalPlan(id, {
    title: body.title,
    description: body.description,
    startDate: body.startDate ? new Date(body.startDate) : undefined,
    endDate: body.endDate ? new Date(body.endDate) : undefined,
    status: body.status,
  });

  return NextResponse.json({ plan: updated });
}

/**
 * DELETE /api/portal/admin/technical-plans/[id]
 */
export async function DELETE(
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

  await deleteTechnicalPlan(id);
  return NextResponse.json({ ok: true });
}
