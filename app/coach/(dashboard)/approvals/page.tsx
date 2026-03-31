import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { ApprovalsClient } from "./approvals-client";

export default async function ApprovalsPage() {
  const user = await requirePortalUser();

  // Hent ventende bookinger
  const pendingBookings = await prisma.booking.findMany({
    where: {
      instructorId: user.id,
      status: "PENDING",
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      ServiceType: {
        select: {
          name: true,
          price: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Hent ventende treningsplaner (hvis implementert)
  // const pendingPlans = await prisma.trainingPlan.findMany({ ... });

  const formattedBookings = pendingBookings.map((b) => ({
    id: b.id,
    type: "booking" as const,
    studentName: b.User?.name || "Ukjent",
    studentEmail: b.User?.email || "",
    serviceName: b.ServiceType?.name || "Ukjent",
    price: b.ServiceType?.price || 0,
    requestedTime: b.startTime,
    createdAt: b.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Godkjenninger</h1>
        <p className="text-[var(--color-ink-40)] mt-1">
          {formattedBookings.length} ventende godkjenninger
        </p>
      </div>

      <ApprovalsClient pendingItems={formattedBookings} />
    </div>
  );
}
