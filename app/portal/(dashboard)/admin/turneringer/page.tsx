import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { Topbar } from "@/components/portal/layout/topbar";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { AddTournamentForm } from "./add-tournament-form";
import { TournamentAdminList } from "./tournament-admin-list";

export default async function AdminTuringeringerPage() {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) redirect("/");

  const tournaments = await prisma.tournament.findMany({
    orderBy: { startDate: "asc" },
    include: {
      _count: { select: { playerPlans: true } },
      playerPlans: {
        include: {
          student: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });

  return (
    <div>
      <Topbar title="Administrer turneringer" />
      <div className="p-6 max-w-2xl">
        <TournamentAdminList tournaments={tournaments} />

        <h2 className="text-lg font-bold text-[var(--color-snow)] mb-6 mt-10">
          Legg til turnering
        </h2>
        <AddTournamentForm />
      </div>
    </div>
  );
}
