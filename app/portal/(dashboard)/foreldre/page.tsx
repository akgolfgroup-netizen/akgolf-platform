import Link from "next/link";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { getChildrenForParent } from "@/lib/portal/parent/relations";

export const dynamic = "force-dynamic";

interface ChildWithStats {
  id: string;
  name: string | null;
  email: string | null;
  relationType: string;
  upcomingBookings: number;
  upcomingTournaments: number;
  pendingPayments: number;
}

export default async function ForeldrePage() {
  const user = await requirePortalUser();
  const children = await getChildrenForParent(user.id);

  if (children.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-on-surface mb-2">
          Foreldre-oversikt
        </h1>
        <p className="text-on-surface-variant mb-6">
          Du er ikke koblet som forelder til noen spillere ennå.
        </p>
        <div className="rounded-lg border border-outline-variant/30 p-6 bg-surface">
          <p className="text-sm text-on-surface-variant">
            Hvis barnet ditt er medlem hos AK Golf og du skulle vært koblet
            som forelder, ta kontakt med treneren eller send en e-post til{" "}
            <a href="mailto:hei@akgolf.no" className="text-primary underline">
              hei@akgolf.no
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  // Hent enkle nøkkeltall for hvert barn
  const childIds = children.map((c) => c.id);
  const now = new Date();

  const [bookings, tournaments, paymentsRaw] = await Promise.all([
    prisma.booking.groupBy({
      by: ["studentId"],
      where: {
        studentId: { in: childIds },
        startTime: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      _count: true,
    }),
    prisma.playerTournamentPlan.groupBy({
      by: ["studentId"],
      where: {
        studentId: { in: childIds },
        Tournament: { startDate: { gte: now } },
      },
      _count: true,
    }),
    prisma.booking.groupBy({
      by: ["studentId"],
      where: {
        studentId: { in: childIds },
        paymentStatus: "PENDING",
      },
      _count: true,
    }),
  ]);

  const bookingCount = (id: string) =>
    bookings.find((b: { studentId: string; _count: number }) => b.studentId === id)?._count ?? 0;
  const tournamentCount = (id: string) => {
    const row = tournaments.find((t) => t.studentId === id);
    if (!row) return 0;
    const c = (row as { _count?: number })._count;
    return typeof c === "number" ? c : 0;
  };
  const paymentCount = (id: string) =>
    paymentsRaw.find((p: { studentId: string; _count: number }) => p.studentId === id)?._count ?? 0;

  const childrenWithStats: ChildWithStats[] = children.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    relationType: c.relationType,
    upcomingBookings: bookingCount(c.id),
    upcomingTournaments: tournamentCount(c.id),
    pendingPayments: paymentCount(c.id),
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-on-surface mb-2">
        Foreldre-oversikt
      </h1>
      <p className="text-on-surface-variant mb-6">
        {children.length === 1
          ? "Oversikt over barnet ditt"
          : `Oversikt over ${children.length} barn`}{" "}
        — trening, turneringer og betalinger.
      </p>

      <div className="grid gap-4">
        {childrenWithStats.map((child) => (
          <div
            key={child.id}
            className="rounded-xl border border-outline-variant/30 p-5 bg-surface"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-on-surface">
                  {child.name ?? "(uten navn)"}
                </h2>
                <p className="text-sm text-on-surface-variant">
                  {child.email}
                  {child.relationType === "GUARDIAN" ? " · foresatt" : " · forelder"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <Link
                href={`/portal/foreldre/${child.id}/trening`}
                className="rounded-lg border border-outline-variant/30 p-3 hover:bg-surface-container transition-colors"
              >
                <div className="text-xs text-on-surface-variant uppercase tracking-wide">
                  Trening
                </div>
                <div className="text-2xl font-bold text-on-surface mt-1">
                  {child.upcomingBookings}
                </div>
                <div className="text-xs text-on-surface-variant">
                  kommende økter
                </div>
              </Link>
              <Link
                href={`/portal/foreldre/${child.id}/turneringer`}
                className="rounded-lg border border-outline-variant/30 p-3 hover:bg-surface-container transition-colors"
              >
                <div className="text-xs text-on-surface-variant uppercase tracking-wide">
                  Turneringer
                </div>
                <div className="text-2xl font-bold text-on-surface mt-1">
                  {child.upcomingTournaments}
                </div>
                <div className="text-xs text-on-surface-variant">
                  påmeldte
                </div>
              </Link>
              <Link
                href={`/portal/foreldre/${child.id}/betalinger`}
                className="rounded-lg border border-outline-variant/30 p-3 hover:bg-surface-container transition-colors"
              >
                <div className="text-xs text-on-surface-variant uppercase tracking-wide">
                  Betalinger
                </div>
                <div className="text-2xl font-bold text-on-surface mt-1">
                  {child.pendingPayments}
                </div>
                <div className="text-xs text-on-surface-variant">
                  venter
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
