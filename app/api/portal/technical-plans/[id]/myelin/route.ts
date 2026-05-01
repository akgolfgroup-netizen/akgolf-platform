/**
 * GET /api/portal/technical-plans/[id]/myelin
 *
 * Returnerer myelin-status for alle faser i en teknisk plan.
 * Viser hvilke faser som trenger vedlikehold basert på
 * dager siden siste økt.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { createServiceClient } from "@/lib/supabase/server";
import {
  checkPlanMyelinStatus,
  formatDaysSince,
} from "@/lib/portal/training-research/myelin-decay";
import type { MyelinPhaseStatus } from "@/lib/portal/training-research/myelin-decay";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }

  const { id } = await params;

  const supabase = createServiceClient();

  // Hent plan med tilgangssjekk
  const { data: plan, error: planError } = await supabase
    .from("technical_plans")
    .select("player_id, coach_id")
    .eq("id", id)
    .single();

  if (planError || !plan) {
    return NextResponse.json({ error: "Plan ikke funnet" }, { status: 404 });
  }

  if (plan.player_id !== user.id && plan.coach_id !== user.id && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  // Hent faser
  const { data: phases } = await supabase
    .from("technical_plan_phases")
    .select("id, title, status, last_session_at")
    .eq("plan_id", id)
    .order("order", { ascending: true });

  if (!phases) {
    return NextResponse.json({
      items: [],
      summary: { healthy: 0, warning: 0, critical: 0, decayed: 0 },
    });
  }

  const statuses = checkPlanMyelinStatus(
    phases.map((p) => ({
      id: p.id,
      title: p.title,
      lastSessionAt: p.last_session_at,
      status: p.status as MyelinPhaseStatus,
    }))
  );

  const summary = {
    healthy: phases.length - statuses.length,
    warning: statuses.filter((s) => s.status === "warning").length,
    critical: statuses.filter((s) => s.status === "critical").length,
    decayed: statuses.filter((s) => s.status === "decayed").length,
  };

  return NextResponse.json({
    items: statuses.map((s) => ({
      ...s,
      daysSinceFormatted: formatDaysSince(s.daysSinceLastSession),
    })),
    summary,
    totalPhases: phases.length,
  });
}
