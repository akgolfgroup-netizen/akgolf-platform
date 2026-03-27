"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { BookingStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { addMinutes } from "date-fns";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

const bookingSelect = {
  id: true,
  startTime: true,
  endTime: true,
  status: true,
  amount: true,
  paymentMethod: true,
  paymentStatus: true,
  cancelledAt: true,
  cancelReason: true,
  adminNotes: true,
  createdAt: true,
  User: { select: { id: true, name: true, email: true, phone: true } },
  ServiceType: { select: { name: true, color: true, duration: true } },
  Instructor: { select: { id: true, User: { select: { name: true } } } },
  Location: { select: { name: true } },
} as const;

export async function searchBookings(query: string, status?: string, page = 1) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return { bookings: [], total: 0 };

  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};

  if (status && status !== "ALL") {
    where.status = status as BookingStatus;
  }

  if (query) {
    where.OR = [
      { User: { name: { contains: query, mode: "insensitive" } } },
      { User: { email: { contains: query, mode: "insensitive" } } },
      { ServiceType: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      select: bookingSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, total };
}

export async function adminCancelBooking(bookingId: string, reason?: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelReason: reason ?? "Avbestilt av admin",
    },
  });

  revalidatePath("/admin/bookinger");
}

export async function adminCreateBooking(data: {
  studentEmail: string;
  studentName: string;
  serviceTypeId: string;
  instructorId: string;
  startTime: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  // Find or create student
  let student = await prisma.user.findUnique({
    where: { email: data.studentEmail },
    select: { id: true },
  });

  if (!student) {
    student = await prisma.user.create({
      data: {
        id: nanoid(),
        updatedAt: new Date(),
        email: data.studentEmail,
        name: data.studentName,
        role: "STUDENT",
      },
      select: { id: true },
    });
  }

  const serviceType = await prisma.serviceType.findUnique({
    where: { id: data.serviceTypeId },
    select: { duration: true, price: true, vatRate: true },
  });

  if (!serviceType) throw new Error("Tjeneste ikke funnet");

  const start = new Date(data.startTime);
  const end = addMinutes(start, serviceType.duration);
  const vatAmount = Math.round((serviceType.price * serviceType.vatRate) / 100);

  const booking = await prisma.booking.create({
    data: {
      id: nanoid(),
      updatedAt: new Date(),
      studentId: student.id,
      instructorId: data.instructorId,
      serviceTypeId: data.serviceTypeId,
      startTime: start,
      endTime: end,
      status: BookingStatus.CONFIRMED,
      paymentMethod: PaymentMethod.NONE,
      paymentStatus: PaymentStatus.PENDING,
      amount: serviceType.price,
      vatAmount,
    },
  });

  revalidatePath("/admin/bookinger");
  return booking.id;
}
