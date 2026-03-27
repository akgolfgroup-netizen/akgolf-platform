import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { AddTournamentForm } from "./add-tournament-form";
import { TournamentAdminList } from "./tournament-admin-list";

export default async function AdminTuringeringerPage() {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) redirect("/");

  const rawTournaments = await prisma.tournament.findMany({
    orderBy: { startDate: "asc" },
    include: {
      _count: { select: { PlayerTournamentPlan: true } },
      PlayerTournamentPlan: {
        include: {
          User: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  const tournaments = rawTournaments.map((t) => ({
    ...t,
    _count: { playerPlans: t._count.PlayerTournamentPlan },
    playerPlans: t.PlayerTournamentPlan.map((pp) => ({
      ...pp,
      student: { id: pp.User.id, name: pp.User.name, image: pp.User.image },
    })),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-snow)]">Administrer turneringer</h1>

      <div className="max-w-2xl space-y-10">
        <TournamentAdminList tournaments={tournaments} />

        <div>
          <h2 className="text-lg font-semibold text-[var(--color-snow)] mb-6">
            Legg til turnering
          </h2>
          <AddTournamentForm />
        </div>
      </div>
    </div>
  );
}
