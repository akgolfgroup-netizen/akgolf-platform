import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const data = await req.json();
  const supabase = await createServerSupabase();

  // Students can only plan for themselves
  if (data.studentId !== user.id && user.role === "STUDENT") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  // Upsert the plan
  const { data: saved, error } = await supabase
    .from("PlayerTournamentPlan")
    .upsert({
      studentId: data.studentId,
      tournamentId: data.tournamentId,
      priority: data.priority || 1,
      notes: data.notes || null,
      status: data.status || "INTERESTED",
      plannedRounds: data.plannedRounds || null,
      updatedAt: new Date().toISOString(),
    }, {
      onConflict: "studentId,tournamentId"
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Kunne ikke lagre plan" }, { status: 500 });
  }

  return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { studentId, tournamentId } = await req.json();
  const supabase = await createServerSupabase();

  if (studentId !== user.id && user.role === "STUDENT") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { error } = await supabase
    .from("PlayerTournamentPlan")
    .delete()
    .eq("studentId", studentId)
    .eq("tournamentId", tournamentId);

  if (error) {
    return NextResponse.json({ error: "Kunne ikke fjerne plan" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
