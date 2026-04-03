import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { planTournament, removeTournamentPlan } from "@/modules/tournament-planner";
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

  // Students can only plan for themselves
  if (data.studentId !== user.id && user.role === "STUDENT") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  await planTournament(prisma, data);

  const saved = await prisma.playerTournamentPlan.findUnique({
    where: {
      studentId_tournamentId: {
        studentId: data.studentId,
        tournamentId: data.tournamentId,
      },
    },
  });

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

  if (studentId !== user.id && user.role === "STUDENT") {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  await removeTournamentPlan(prisma, studentId, tournamentId);
  return NextResponse.json({ ok: true });
}
