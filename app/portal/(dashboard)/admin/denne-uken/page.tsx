import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getThisWeekTournamentPlans } from "@/modules/tournament-planner/actions";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { nb } from "date-fns/locale";
import { ThisWeekClient } from "./this-week-client";

export default async function DenneUkenPage() {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) redirect("/");

  const now = new Date();
  const from = startOfWeek(now, { weekStartsOn: 1 });
  const to = endOfWeek(now, { weekStartsOn: 1 });

  const plans = await getThisWeekTournamentPlans(prisma, { from, to });

  // Get week stats
  const weekStats = {
    totalPlayers: plans.length,
    tournaments: new Set(plans.map((p) => p.tournamentId)).size,
    registered: plans.filter((p) => p.isRegistered).length,
    weekLabel: `${format(from, "d.", { locale: nb })} - ${format(to, "d. MMMM", { locale: nb })}`,
  };

  return <ThisWeekClient plans={plans} weekStats={weekStats} />;
}
