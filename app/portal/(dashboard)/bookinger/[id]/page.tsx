import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { notFound } from "next/navigation";
import { BookingDetailClient } from "./booking-detail-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requirePortalUser();

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      studentId: user.id,
    },
    include: {
      ServiceType: {
        select: { name: true, category: true, duration: true, color: true },
      },
      Instructor: {
        select: {
          User: { select: { name: true, image: true } },
          title: true,
        },
      },
      Location: { select: { name: true } },
    },
  });

  if (!booking) notFound();

  return (
    <BookingDetailClient
      booking={{
        id: booking.id,
        serviceName: booking.ServiceType.name,
        serviceCategory: booking.ServiceType.category,
        serviceColor: booking.ServiceType.color ?? undefined,
        instructorName: booking.Instructor.User.name ?? "Instruktor",
        instructorTitle: booking.Instructor.title ?? undefined,
        instructorImage: booking.Instructor.User.image ?? undefined,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        duration: booking.ServiceType.duration,
        location: booking.Location?.name ?? undefined,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        amount: booking.amount,
        studentNotes: booking.studentNotes ?? undefined,
        cancelReason: booking.cancelReason ?? undefined,
        cancelledAt: booking.cancelledAt?.toISOString() ?? undefined,
      }}
    />
  );
}
