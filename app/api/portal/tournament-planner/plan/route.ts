import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { planTournament, removeTournamentPlan } from "@/modules/tournament-planner";

export async function POST(req: NextRequest) {
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
