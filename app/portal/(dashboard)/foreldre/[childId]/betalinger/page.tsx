import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { prisma } from "@/lib/portal/prisma";

interface PageProps {
  params: Promise<{ childId: string }>;
}

const STATUS_LABEL: Record<string, string> = {
  PAID: "Betalt",
  PENDING: "Venter",
  FAILED: "Feilet",
  REFUNDED: "Refundert",
};

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-success-soft text-success",
  PENDING: "bg-warning-soft text-warning",
  FAILED: "bg-error-soft text-error",
  REFUNDED: "bg-info-soft text-info",
};

export default async function BetalingerPage({ params }: PageProps) {
  const { childId } = await params;

  const bookings = await prisma.booking.findMany({
    where: { studentId: childId },
    include: {
      ServiceType: { select: { name: true } },
    },
    orderBy: { startTime: "desc" },
    take: 50,
  });

  // Aggreger
  const totalPaid = bookings
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((sum, b) => sum + b.amount, 0);
  const totalPending = bookings
    .filter((b) => b.paymentStatus === "PENDING")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <section>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border border-outline-variant/30 p-4">
            <div className="text-xs text-on-surface-variant uppercase tracking-wide">
              Betalt
            </div>
            <div className="text-2xl font-bold text-on-surface mt-1 tabular-nums">
              {totalPaid.toLocaleString("nb-NO")} kr
            </div>
          </div>
          <div className="rounded-lg border border-outline-variant/30 p-4">
            <div className="text-xs text-on-surface-variant uppercase tracking-wide">
              Venter
            </div>
            <div className="text-2xl font-bold text-on-surface mt-1 tabular-nums">
              {totalPending.toLocaleString("nb-NO")} kr
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-on-surface mb-3">
          Bookinger og betalinger
        </h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            Ingen bookinger registrert.
          </p>
        ) : (
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="rounded-lg border border-outline-variant/30 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <strong className="text-on-surface">
                      {b.ServiceType?.name ?? "Coaching"}
                    </strong>
                    <p className="text-sm text-on-surface-variant mt-1">
                      {format(b.startTime, "EEEE d. MMMM yyyy", {
                        locale: nb,
                      })}{" "}
                      kl {format(b.startTime, "HH:mm")}
                    </p>
                    {b.paymentMethod && b.paymentMethod !== "NONE" ? (
                      <p className="text-xs text-on-surface-variant/70 mt-1">
                        Metode: {b.paymentMethod}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-base font-semibold text-on-surface tabular-nums">
                      {b.amount.toLocaleString("nb-NO")} kr
                    </div>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                        STATUS_STYLE[b.paymentStatus] ?? "bg-surface-container"
                      }`}
                    >
                      {STATUS_LABEL[b.paymentStatus] ?? b.paymentStatus}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
