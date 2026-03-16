"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";
import { BookingStatus } from "@prisma/client";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, addDays } from "date-fns";

export interface CalendarBooking {
  id: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  student: { name: string | null; email: string | null };
  serviceType: { name: string; color: string | null; duration: number };
  instructor: { id: string; user: { name: string | null } };
  location: { name: string } | null;
  adminNotes: string | null;
}

export async function getBookingsForPeriod(
  startDate: string,
  endDate: string,
  instructorId?: string
): Promise<CalendarBooking[]> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const start = startOfDay(new Date(startDate));
  const end = endOfDay(new Date(endDate));

  return prisma.booking.findMany({
    where: {
      startTime: { gte: start },
      endTime: { lte: end },
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
      ...(instructorId ? { instructorId } : {}),
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      adminNotes: true,
      student: { select: { name: true, email: true } },
      serviceType: { select: { name: true, color: true, duration: true } },
      instructor: { select: { id: true, user: { select: { name: true } } } },
      location: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
  });
}

export async function getInstructors() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  return prisma.instructor.findMany({
    select: {
      id: true,
      user: { select: { name: true, image: true } },
    },
    orderBy: { user: { name: "asc" } },
  });
}

export async function getBookingsForDay(date: string, instructorId?: string) {
  const start = startOfDay(new Date(date));
  const end = endOfDay(new Date(date));
  return getBookingsForPeriod(start.toISOString(), end.toISOString(), instructorId);
}

export async function getBookingsForWeek(date: string, instructorId?: string) {
  const d = new Date(date);
  const start = startOfWeek(d, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(d, { weekStartsOn: 1 }); // Sunday
  return getBookingsForPeriod(start.toISOString(), end.toISOString(), instructorId);
}

export async function markNoShow(bookingId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.NO_SHOW },
  });
}

export async function addAdminNote(bookingId: string, note: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { adminNotes: note },
  });
}
