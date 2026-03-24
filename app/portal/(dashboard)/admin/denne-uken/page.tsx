import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getThisWeekTournamentPlans } from "@/modules/tournament-planner/actions";
import { ThisWeekTournaments } from "@/modules/tournament-planner/components/ThisWeekTournaments";
import { startOfWeek, endOfWeek } from "date-fns";

export default async function DenneUkenPage() {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) redirect("/");

  const now = new Date();
  const from = startOfWeek(now, { weekStartsOn: 1 });
  const to = endOfWeek(now, { weekStartsOn: 1 });

  const plans = await getThisWeekTournamentPlans(prisma, { from, to });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-snow)]">Denne uken</h1>

      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-snow)]">
            Spillere i turnering
          </h2>
          <span className="text-xs text-[var(--color-ink-40)]">
            {plans.length} spillerplan{plans.length !== 1 ? "er" : ""}
          </span>
        </div>

        <ThisWeekTournaments plans={plans} />
      </div>
    </div>
  );
}
