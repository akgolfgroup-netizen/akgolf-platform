"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";

export type SessionItem = {
  id: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  adminNotes: string | null;
  studentNotes: string | null;
  student: { name: string | null; email: string } | null;
  instructor: { name: string | null } | null;
  service: { name: string; duration: number } | null;
};

export type SessionStats = {
  completed: number;
  cancelled: number;
  noShow: number;
  total: number;
  attendanceRate: number;
};

export type SessionOverviewResult = {
  sessions: SessionItem[];
  stats: SessionStats;
};

const PAST_STATUSES: BookingStatus[] = [
  BookingStatus.COMPLETED,
  BookingStatus.CANCELLED,
  BookingStatus.NO_SHOW,
];

export async function getSessionOverview(options?: {
  from?: Date;
  to?: Date;
  status?: string;
}): Promise<SessionOverviewResult> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return {
      sessions: [],
      stats: { completed: 0, cancelled: 0, noShow: 0, total: 0, attendanceRate: 0 },
    };
  }

  const where: Record<string, unknown> = {
    status: { in: PAST_STATUSES },
  };

  if (options?.from && options?.to) {
    where.startTime = { gte: options.from, lte: options.to };
  }

  if (options?.status && options.status !== "all") {
    const statusMap: Record<string, BookingStatus> = {
      completed: BookingStatus.COMPLETED,
      cancelled: BookingStatus.CANCELLED,
      "no-show": BookingStatus.NO_SHOW,
    };
    const mapped = statusMap[options.status];
    if (mapped) {
      where.status = mapped;
    }
  }

  const [bookings, statusCounts] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        User: { select: { name: true, email: true } },
        Instructor: { include: { User: { select: { name: true } } } },
        ServiceType: { select: { name: true, duration: true } },
      },
      orderBy: { startTime: "desc" },
      take: 50,
    }),
    prisma.booking.groupBy({
      by: ["status"],
      where: { status: { in: PAST_STATUSES } },
      _count: true,
    }),
  ]);

  const completedCount =
    statusCounts.find((s) => s.status === BookingStatus.COMPLETED)?._count ?? 0;
  const cancelledCount =
    statusCounts.find((s) => s.status === BookingStatus.CANCELLED)?._count ?? 0;
  const noShowCount =
    statusCounts.find((s) => s.status === BookingStatus.NO_SHOW)?._count ?? 0;
  const total = completedCount + cancelledCount + noShowCount;
  const attendanceRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const sessions: SessionItem[] = bookings.map((b) => ({
    id: b.id,
    startTime: b.startTime,
    endTime: b.endTime,
    status: b.status,
    adminNotes: b.adminNotes,
    studentNotes: b.studentNotes,
    student: b.User ? { name: b.User.name, email: b.User.email } : null,
    instructor: b.Instructor?.User ? { name: b.Instructor.User.name } : null,
    service: b.ServiceType ? { name: b.ServiceType.name, duration: b.ServiceType.duration } : null,
  }));

  return {
    sessions,
    stats: {
      completed: completedCount,
      cancelled: cancelledCount,
      noShow: noShowCount,
      total,
      attendanceRate,
    },
  };
}

export async function saveSessionNotes(
  bookingId: string,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { success: false, error: "Ikke autorisert" };
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { adminNotes: notes },
    });

    revalidatePath("/portal/admin/okter");
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke lagre notater" };
  }
}
