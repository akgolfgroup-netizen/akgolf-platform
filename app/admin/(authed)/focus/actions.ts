"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import type { AdminDivision, AdminTaskStatus, AdminPriority } from "@prisma/client";

// ── Types ──────────────────────────────────────────────────

export interface FocusTask {
  id: string;
  title: string;
  description: string | null;
  division: AdminDivision;
  status: AdminTaskStatus;
  priority: AdminPriority;
  dueDate: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface DivisionStats {
  division: AdminDivision;
  todo: number;
  inProgress: number;
  done: number;
}

// ── Auth helper ────────────────────────────────────────────

async function requireStaffUser() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) throw new Error("Ikke autorisert");
  return user;
}

// ── Read ───────────────────────────────────────────────────

export async function getTasks(division?: AdminDivision): Promise<FocusTask[]> {
  await requireStaffUser();

  const tasks = await prisma.adminTask.findMany({
    where: division ? { division } : undefined,
    include: { CreatedBy: { select: { name: true } } },
    orderBy: [
      { status: "asc" },
      { priority: "asc" },
      { createdAt: "desc" },
    ],
  });

  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    division: t.division,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate?.toISOString() ?? null,
    createdBy: t.CreatedBy.name,
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function getDivisionStats(): Promise<DivisionStats[]> {
  await requireStaffUser();

  const divisions: AdminDivision[] = ["COACHING", "JUNIOR", "GFGK"];
  const counts = await prisma.adminTask.groupBy({
    by: ["division", "status"],
    _count: true,
  });

  return divisions.map((div) => {
    const divCounts = counts.filter((c) => c.division === div);
    return {
      division: div,
      todo: divCounts.find((c) => c.status === "TODO")?._count ?? 0,
      inProgress: divCounts.find((c) => c.status === "IN_PROGRESS")?._count ?? 0,
      done: divCounts.find((c) => c.status === "DONE")?._count ?? 0,
    };
  });
}

export async function getTodayBookingsByDivision() {
  await requireStaffUser();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: {
      startTime: { gte: today, lt: tomorrow },
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    include: {
      User: { select: { name: true } },
      ServiceType: { select: { name: true, category: true } },
    },
    orderBy: { startTime: "asc" },
  });

  return bookings.map((b) => ({
    id: b.id,
    time: b.startTime.toISOString(),
    studentName: b.User?.name ?? "Ukjent",
    serviceName: b.ServiceType?.name ?? "Ukjent",
    category: b.ServiceType?.category ?? "INDIVIDUAL",
  }));
}

// ── Create ─────────────────────────────────────────────────

export async function createTask(data: {
  title: string;
  description?: string;
  division: AdminDivision;
  priority?: AdminPriority;
  dueDate?: string;
}) {
  const user = await requireStaffUser();

  await prisma.adminTask.create({
    data: {
      id: nanoid(),
      title: data.title,
      description: data.description ?? null,
      division: data.division,
      priority: data.priority ?? "NORMAL",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdById: user.id,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/focus");
}

// ── Update ─────────────────────────────────────────────────

export async function updateTaskStatus(taskId: string, status: AdminTaskStatus) {
  await requireStaffUser();

  await prisma.adminTask.update({
    where: { id: taskId },
    data: { status, updatedAt: new Date() },
  });

  revalidatePath("/admin/focus");
}

export async function updateTask(
  taskId: string,
  data: { title?: string; description?: string; priority?: AdminPriority; dueDate?: string | null },
) {
  await requireStaffUser();

  await prisma.adminTask.update({
    where: { id: taskId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/focus");
}

// ── Delete ─────────────────────────────────────────────────

export async function deleteTask(taskId: string) {
  await requireStaffUser();

  await prisma.adminTask.delete({ where: { id: taskId } });

  revalidatePath("/admin/focus");
}
