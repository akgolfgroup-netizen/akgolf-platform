import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { TrackManClient } from "./trackman-client";

export const dynamic = "force-dynamic";

export default async function TrackManPage() {
  const user = await requirePortalUser();

  const sessions = await prisma.trackmanSession.findMany({
    where: { userId: user.id },
    orderBy: { sessionDate: "desc" },
    take: 50,
  });

  // Aggreger per klubb pa tvers av alle okter
  const clubMap = new Map<string, {
    club: string;
    totalShots: number;
    avgCarry: number;
    avgTotal: number;
    avgOffline: number;
    avgClubSpeed: number | null;
    avgBallSpeed: number | null;
    avgSmashFactor: number | null;
    avgSpinRate: number | null;
    avgLaunchAngle: number | null;
    carryStdDev: number;
    lateralStdDev: number;
  }>();

  for (const session of sessions) {
    const avg = session.averages as Record<string, number | null>;
    const existing = clubMap.get(session.club);

    if (existing) {
      const totalShots = existing.totalShots + (avg.count as number ?? 0);
      const w1 = existing.totalShots / totalShots;
      const w2 = (avg.count as number ?? 0) / totalShots;

      clubMap.set(session.club, {
        club: session.club,
        totalShots,
        avgCarry: existing.avgCarry * w1 + (avg.avgCarry as number ?? 0) * w2,
        avgTotal: existing.avgTotal * w1 + (avg.avgTotal as number ?? 0) * w2,
        avgOffline: existing.avgOffline * w1 + (avg.avgOffline as number ?? 0) * w2,
        avgClubSpeed: avg.avgClubSpeed as number ?? existing.avgClubSpeed,
        avgBallSpeed: avg.avgBallSpeed as number ?? existing.avgBallSpeed,
        avgSmashFactor: avg.avgSmashFactor as number ?? existing.avgSmashFactor,
        avgSpinRate: avg.avgSpinRate as number ?? existing.avgSpinRate,
        avgLaunchAngle: avg.avgLaunchAngle as number ?? existing.avgLaunchAngle,
        carryStdDev: avg.carryStdDev as number ?? 0,
        lateralStdDev: avg.lateralStdDev as number ?? 0,
      });
    } else {
      clubMap.set(session.club, {
        club: session.club,
        totalShots: avg.count as number ?? 0,
        avgCarry: avg.avgCarry as number ?? 0,
        avgTotal: avg.avgTotal as number ?? 0,
        avgOffline: avg.avgOffline as number ?? 0,
        avgClubSpeed: avg.avgClubSpeed as number ?? null,
        avgBallSpeed: avg.avgBallSpeed as number ?? null,
        avgSmashFactor: avg.avgSmashFactor as number ?? null,
        avgSpinRate: avg.avgSpinRate as number ?? null,
        avgLaunchAngle: avg.avgLaunchAngle as number ?? null,
        carryStdDev: avg.carryStdDev as number ?? 0,
        lateralStdDev: avg.lateralStdDev as number ?? 0,
      });
    }
  }

  const clubData = Array.from(clubMap.values())
    .sort((a, b) => b.avgCarry - a.avgCarry)
    .map((c) => ({
      ...c,
      avgCarry: Math.round(c.avgCarry * 10) / 10,
      avgTotal: Math.round(c.avgTotal * 10) / 10,
      avgOffline: Math.round(c.avgOffline * 10) / 10,
      carryStdDev: Math.round(c.carryStdDev * 10) / 10,
      lateralStdDev: Math.round(c.lateralStdDev * 10) / 10,
    }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">TrackMan Data</h1>
        <p className="text-[var(--color-grey-500)] mt-1">
          Spredning, teknikk-profil og klubb-analyse
        </p>
      </div>

      <TrackManClient
        clubData={clubData}
        sessionCount={sessions.length}
      />
    </div>
  );
}
