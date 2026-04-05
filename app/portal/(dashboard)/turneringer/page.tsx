import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { getTournamentsWithPlans } from "@/modules/tournament-planner";
import { getTourSchedule } from "@/lib/portal/datagolf/client";
import { TurneringerClient } from "./turneringer-client";

export const maxDuration = 30;

export default async function TurneringerPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const [tournaments, pgaSchedule, euroSchedule] = await Promise.all([
    getTournamentsWithPlans(prisma, user.id),
    getTourSchedule("pga", undefined, true).catch(() => []),
    getTourSchedule("euro", undefined, true).catch(() => []),
  ]);

  return (
    <TurneringerClient
      tournaments={JSON.parse(JSON.stringify(tournaments))}
      pgaSchedule={JSON.parse(JSON.stringify(pgaSchedule))}
      euroSchedule={JSON.parse(JSON.stringify(euroSchedule))}
      userId={user.id}
    />
  );
}
