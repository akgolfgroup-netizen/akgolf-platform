import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { redirect, notFound } from "next/navigation";
import { RescheduleForm } from "@/components/portal/booking/reschedule-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReschedulePage({ params }: Props) {
  const { id } = await params;
  const user = await requirePortalUser();
  if (!user?.id) redirect("/login");

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      ServiceType: {
        select: { id: true, name: true, duration: true },
      },
      Instructor: {
        select: {
          id: true,
          User: { select: { name: true } },
        },
      },
    },
  });

  if (!booking || booking.studentId !== user.id) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">Endre tidspunkt</h1>
        <p className="text-sm text-[var(--color-grey-500)] mt-1">
          {booking.ServiceType.name} med{" "}
          {booking.Instructor.User.name ?? "Instruktor"}
        </p>
      </div>

      <RescheduleForm
        bookingId={booking.id}
        serviceTypeId={booking.ServiceType.id}
        instructorId={booking.Instructor.id}
        instructorName={booking.Instructor.User.name ?? "Instruktor"}
        serviceName={booking.ServiceType.name}
        duration={booking.ServiceType.duration}
      />
    </div>
  );
}
