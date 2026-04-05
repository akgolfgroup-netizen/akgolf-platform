import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { SpillClient } from "./spill-client";

export const dynamic = "force-dynamic";

export default async function SpillPage() {
  const user = await requirePortalUser();

  // Hent brukerens aktive og nylige spillokter
  const sessions = await prisma.gameSession.findMany({
    where: {
      OR: [
        { createdById: user.id },
        { Players: { some: { userId: user.id } } },
      ],
    },
    orderBy: { date: "desc" },
    take: 20,
    include: {
      Course: { select: { name: true, par: true } },
      Players: {
        include: {
          User: { select: { id: true, name: true, image: true } },
        },
      },
      _count: { select: { Rounds: true } },
    },
  });

  // Hent baner for a opprette ny okt
  const courses = await prisma.course.findMany({
    where: { country: "NO" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, location: true, par: true },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">Spill</h1>
        <p className="text-[var(--color-grey-500)] mt-1">
          Start en gruppe-runde eller bli med via kode
        </p>
      </div>

      <SpillClient
        sessions={sessions.map((s) => ({
          id: s.id,
          name: s.name,
          courseName: s.Course.name,
          coursePar: s.Course.par,
          date: s.date.toISOString(),
          format: s.format,
          joinCode: s.joinCode,
          isActive: s.isActive,
          playerCount: s.Players.length,
          players: s.Players.map((p) => ({
            id: p.User.id,
            name: p.User.name ?? "Spiller",
          })),
          roundCount: s._count.Rounds,
          isCreator: s.createdById === user.id,
        }))}
        courses={courses}
        currentUserId={user.id}
      />
    </div>
  );
}
