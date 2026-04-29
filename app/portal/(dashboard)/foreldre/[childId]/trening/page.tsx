import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { prisma } from "@/lib/portal/prisma";

interface PageProps {
  params: Promise<{ childId: string }>;
}

export default async function TreningPage({ params }: PageProps) {
  const { childId } = await params;
  const now = new Date();

  // RBAC er sjekket i layout — vi kan stole på det her.
  const [bookings, activePlan] = await Promise.all([
    prisma.booking.findMany({
      where: {
        studentId: childId,
        startTime: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      include: {
        ServiceType: { select: { name: true, duration: true } },
        Instructor: {
          select: { User: { select: { name: true } } },
        },
      },
      orderBy: { startTime: "asc" },
      take: 20,
    }),
    prisma.trainingPlan.findFirst({
      where: { studentId: childId, isActive: true },
      include: {
        TrainingPlanWeek: {
          orderBy: { weekNumber: "asc" },
          take: 4,
          include: {
            TrainingPlanSession: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-on-surface mb-3">
          Kommende økter
        </h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            Ingen kommende økter.
          </p>
        ) : (
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="rounded-lg border border-outline-variant/30 p-3"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-on-surface">
                    {b.ServiceType?.name ?? "Coaching"}
                  </strong>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success-soft text-success">
                    {b.status === "CONFIRMED" ? "Bekreftet" : "Venter"}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">
                  {format(b.startTime, "EEEE d. MMMM 'kl.' HH:mm", {
                    locale: nb,
                  })}{" "}
                  ·{" "}
                  {(b.Instructor?.User as { name?: string } | null)?.name ??
                    "Trener"}
                  {b.ServiceType?.duration
                    ? ` · ${b.ServiceType.duration} min`
                    : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-on-surface mb-3">
          Treningsplan
        </h2>
        {!activePlan ? (
          <p className="text-sm text-on-surface-variant">
            Ingen aktiv treningsplan akkurat nå.
          </p>
        ) : (
          <div className="rounded-lg border border-outline-variant/30 p-4">
            <h3 className="font-semibold text-on-surface mb-1">
              {activePlan.title}
            </h3>
            {activePlan.description ? (
              <p className="text-sm text-on-surface-variant mb-3">
                {activePlan.description}
              </p>
            ) : null}
            <p className="text-xs text-on-surface-variant mb-4">
              {format(activePlan.startDate, "d. MMM", { locale: nb })} –{" "}
              {format(activePlan.endDate, "d. MMM yyyy", { locale: nb })}
            </p>
            {activePlan.TrainingPlanWeek.length > 0 ? (
              <div className="space-y-3">
                {activePlan.TrainingPlanWeek.map((w) => (
                  <div
                    key={w.id}
                    className="rounded-lg border border-outline-variant/30 p-3"
                  >
                    <div className="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
                      Uke {w.weekNumber}
                      {w.focus ? ` · ${w.focus}` : ""}
                    </div>
                    <ul className="text-sm space-y-1">
                      {w.TrainingPlanSession.map((s) => (
                        <li key={s.id} className="text-on-surface">
                          {s.title}
                          {s.durationMinutes
                            ? ` (${s.durationMinutes} min)`
                            : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
