import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { prisma } from "@/lib/portal/prisma";

interface PageProps {
  params: Promise<{ childId: string }>;
}

export default async function TurneringerPage({ params }: PageProps) {
  const { childId } = await params;
  const now = new Date();

  const plans = await prisma.playerTournamentPlan.findMany({
    where: {
      studentId: childId,
      Tournament: { startDate: { gte: now } },
    },
    include: {
      Tournament: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          course: true,
          location: true,
          level: true,
        },
      },
    },
    orderBy: { Tournament: { startDate: "asc" } },
    take: 50,
  });

  return (
    <section>
      <h2 className="text-lg font-semibold text-on-surface mb-3">
        Påmeldte turneringer
      </h2>
      {plans.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          Ingen kommende turneringer registrert.
        </p>
      ) : (
        <ul className="space-y-2">
          {plans.map((p) => (
            <li
              key={p.id}
              className="rounded-lg border border-outline-variant/30 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <strong className="text-on-surface">{p.Tournament.name}</strong>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {format(p.Tournament.startDate, "d. MMM", { locale: nb })}
                    {p.Tournament.endDate
                      ? ` – ${format(p.Tournament.endDate, "d. MMM yyyy", { locale: nb })}`
                      : ` ${format(p.Tournament.startDate, "yyyy", { locale: nb })}`}
                    {p.Tournament.course ? ` · ${p.Tournament.course}` : ""}
                    {p.Tournament.location ? ` · ${p.Tournament.location}` : ""}
                  </p>
                  <p className="text-xs text-on-surface-variant/70 mt-1">
                    Nivå: {p.Tournament.level} · Mål: {p.goalType}
                  </p>
                  {p.notes ? (
                    <p className="text-xs text-on-surface-variant mt-2 italic">
                      {p.notes}
                    </p>
                  ) : null}
                </div>
                {p.isRegistered ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success-soft text-success shrink-0">
                    Påmeldt
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-warning-soft text-warning shrink-0">
                    Planlagt
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
