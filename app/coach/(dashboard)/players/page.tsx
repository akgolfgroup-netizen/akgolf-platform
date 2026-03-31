import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { PlayersClient } from "./players-client";

export default async function PlayersPage() {
  const user = await requirePortalUser();

  // Hent alle spillere (STUDENT rolle) med siste handicap
  const players = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subscriptionTier: true,
      createdAt: true,
      _count: {
        select: {
          Booking: true,
        },
      },
      HandicapEntry: {
        orderBy: { date: "desc" },
        take: 1,
        select: { handicapIndex: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const formattedPlayers = players.map((p) => ({
    id: p.id,
    name: p.name || "Ukjent",
    email: p.email || "",
    phone: p.phone,
    handicap: p.HandicapEntry[0]?.handicapIndex ?? null,
    tier: p.subscriptionTier,
    sessionsCompleted: p._count.Booking,
    memberSince: p.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Spillere</h1>
        <p className="text-[var(--color-ink-40)] mt-1">
          {formattedPlayers.length} registrerte spillere
        </p>
      </div>

      <PlayersClient players={formattedPlayers} />
    </div>
  );
}
