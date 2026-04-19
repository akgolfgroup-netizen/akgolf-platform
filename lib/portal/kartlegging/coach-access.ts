import "server-only";
import { prisma } from "@/lib/portal/prisma";
import { UserRole, Capability, CoachPlayerStatus } from "@prisma/client";
import { hasCapability } from "@/lib/portal/capabilities/check";

export async function canViewPlayer(
  viewerUserId: string,
  playerUserId: string
): Promise<boolean> {
  if (viewerUserId === playerUserId) return true;

  const viewer = await prisma.user.findUnique({
    where: { id: viewerUserId },
    select: { role: true },
  });
  if (!viewer) return false;
  if (viewer.role === UserRole.ADMIN) return true;

  const allPlayers = await hasCapability(
    viewerUserId,
    Capability.KARTLEGGING_VIEW_ANY_AK_PLAYER
  );
  if (allPlayers) return true;

  const relation = await prisma.coachPlayerRelation.findUnique({
    where: {
      coachUserId_playerUserId: {
        coachUserId: viewerUserId,
        playerUserId,
      },
    },
    select: { status: true },
  });
  return relation?.status === CoachPlayerStatus.ACTIVE;
}

export interface CoachPlayerSummary {
  playerUserId: string;
  playerName: string | null;
  playerEmail: string | null;
  status: CoachPlayerStatus;
  startedAt: string;
  note: string | null;
}

export async function getMyPlayers(
  coachUserId: string
): Promise<CoachPlayerSummary[]> {
  const relations = await prisma.coachPlayerRelation.findMany({
    where: {
      coachUserId,
      status: CoachPlayerStatus.ACTIVE,
    },
    include: {
      Player: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { Player: { name: "asc" } },
  });

  return relations.map((r) => ({
    playerUserId: r.Player.id,
    playerName: r.Player.name,
    playerEmail: r.Player.email,
    status: r.status,
    startedAt: r.startedAt.toISOString(),
    note: r.note,
  }));
}

export async function assignPlayerToCoach(input: {
  coachUserId: string;
  playerUserId: string;
  note?: string;
}): Promise<void> {
  await prisma.coachPlayerRelation.upsert({
    where: {
      coachUserId_playerUserId: {
        coachUserId: input.coachUserId,
        playerUserId: input.playerUserId,
      },
    },
    create: {
      coachUserId: input.coachUserId,
      playerUserId: input.playerUserId,
      status: CoachPlayerStatus.ACTIVE,
      note: input.note ?? null,
    },
    update: {
      status: CoachPlayerStatus.ACTIVE,
      endedAt: null,
      note: input.note ?? null,
    },
  });
}

export async function pausePlayerAssignment(input: {
  coachUserId: string;
  playerUserId: string;
}): Promise<void> {
  await prisma.coachPlayerRelation.update({
    where: {
      coachUserId_playerUserId: {
        coachUserId: input.coachUserId,
        playerUserId: input.playerUserId,
      },
    },
    data: { status: CoachPlayerStatus.PAUSED },
  });
}

export async function endPlayerAssignment(input: {
  coachUserId: string;
  playerUserId: string;
}): Promise<void> {
  await prisma.coachPlayerRelation.update({
    where: {
      coachUserId_playerUserId: {
        coachUserId: input.coachUserId,
        playerUserId: input.playerUserId,
      },
    },
    data: {
      status: CoachPlayerStatus.ENDED,
      endedAt: new Date(),
    },
  });
}
