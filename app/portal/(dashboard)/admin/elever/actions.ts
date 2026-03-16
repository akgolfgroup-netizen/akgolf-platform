"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";

export async function searchStudents(query: string, page = 1) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { students: [], total: 0 };
  }

  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where = query
    ? {
        role: "STUDENT" as const,
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : { role: "STUDENT" as const };

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            coachingSessions: true,
          },
        },
      },
      orderBy: { name: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return { students, total };
}

export async function getStudentProfile(studentId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return null;

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
      notionPageId: true,
      subscriptionTier: true,
      bookings: {
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          amount: true,
          paymentStatus: true,
          serviceType: { select: { name: true } },
          instructor: { select: { user: { select: { name: true } } } },
        },
        orderBy: { startTime: "desc" },
        take: 50,
      },
      coachingSessions: {
        select: {
          id: true,
          sessionDate: true,
          primaryFocus: true,
          aiSummary: true,
          aiKeyPoints: true,
          progressRating: true,
        },
        orderBy: { sessionDate: "desc" },
        take: 20,
      },
    },
  });

  return student;
}
