import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { getTournamentsWithPlans } from "@/modules/tournament-planner";
import { getPeriodizationForDateRange } from "@/modules/tournament-planner/actions";
import { Topbar } from "@/components/portal/layout/topbar";
import { TournamentListWithPeriods } from "./tournament-list-with-periods";
import { startOfYear, endOfYear } from "date-fns";

export default async function TurneringsplanPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const tournaments = await getTournamentsWithPlans(prisma, user.id, {
    from: new Date(),
  });

  const now = new Date();
  const periods = await getPeriodizationForDateRange(
    prisma,
    user.id,
    startOfYear(now),
    endOfYear(now)
  );

  return (
    <div>
      <Topbar title="Turneringsplan" />
      <div className="p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--color-snow)]">
            Kommende turneringer
          </h2>
          <span className="text-xs text-[var(--color-gold-muted)]">
            {tournaments.length} turneringer
          </span>
        </div>

        <TournamentListWithPeriods
          tournaments={tournaments}
          studentId={user.id}
          periods={periods}
        />
      </div>
    </div>
  );
}
