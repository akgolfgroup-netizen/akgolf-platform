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

  const bookings = await prisma.booking.findMany({
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
      User: { select: { name: true, email: true } },
      ServiceType: { select: { name: true, color: true, duration: true } },
      Instructor: { select: { id: true, User: { select: { name: true } } } },
      Location: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
  });

  return bookings.map((b) => ({
    id: b.id,
    startTime: b.startTime,
    endTime: b.endTime,
    status: b.status,
    student: { name: b.User?.name ?? null, email: b.User?.email ?? null },
    serviceType: { name: b.ServiceType.name, color: b.ServiceType.color, duration: b.ServiceType.duration },
    instructor: { id: b.Instructor.id, user: { name: b.Instructor.User?.name ?? null } },
    location: b.Location ? { name: b.Location.name } : null,
    adminNotes: b.adminNotes,
  }));
}

export async function getInstructors() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const instructors = await prisma.instructor.findMany({
    select: {
      id: true,
      User: { select: { name: true, image: true } },
    },
    orderBy: { User: { name: "asc" } },
  });

  return instructors.map((i) => ({
    id: i.id,
    user: { name: i.User.name, image: i.User.image },
  }));
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
