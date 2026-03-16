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
      serviceType: {
        select: { id: true, name: true, duration: true },
      },
      instructor: {
        select: {
          id: true,
          user: { select: { name: true } },
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
        <h1 className="text-2xl font-bold text-[#0F2950]">Endre tidspunkt</h1>
        <p className="text-sm text-gray-500 mt-1">
          {booking.serviceType.name} med{" "}
          {booking.instructor.user.name ?? "Instruktor"}
        </p>
      </div>

      <RescheduleForm
        bookingId={booking.id}
        serviceTypeId={booking.serviceType.id}
        instructorId={booking.instructor.id}
        instructorName={booking.instructor.user.name ?? "Instruktor"}
        serviceName={booking.serviceType.name}
        duration={booking.serviceType.duration}
      />
    </div>
  );
}
