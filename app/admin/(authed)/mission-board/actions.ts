"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { BookingStatus } from "@prisma/client";

export type MissionStatus = "todo" | "in_progress" | "done";

export interface MissionCard {
  id: string;
  title: string;
  playerName: string | null;
  initials: string;
  avatarColor: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueText: string;
  assignee: string | null;
  tags: string[];
  status: MissionStatus;
  href: string;
}

export interface MissionBoardData {
  columns: Record<MissionStatus, MissionCard[]>;
  counts: Record<MissionStatus, number>;
}

const AVATAR_PALETTE = [
  "#6FCBA1",
  "#6FB3FF",
  "#E8B967",
  "#C896E8",
  "#F49283",
  "#D1F843",
];

function avatarColorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function initialsFor(name: string | null | undefined): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDue(date: Date): string {
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `${Math.abs(diffDays)}d forbi`;
  if (diffDays === 0) return "I dag";
  if (diffDays === 1) return "I morgen";
  return `${diffDays}d`;
}

export async function fetchMissionBoardKanban(): Promise<MissionBoardData> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return { columns: { todo: [], in_progress: [], done: [] }, counts: { todo: 0, in_progress: 0, done: 0 } };
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14);
  const windowEnd = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14);

  const [bookings, goals] = await Promise.all([
    prisma.booking.findMany({
      where: {
        startTime: { gte: windowStart, lte: windowEnd },
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        User: { select: { id: true, name: true } },
        ServiceType: { select: { name: true } },
        Instructor: { select: { User: { select: { name: true } } } },
      },
      orderBy: { startTime: "asc" },
      take: 150,
    }),
    prisma.goal.findMany({
      where: { status: "ACTIVE", targetDate: { gte: windowStart, lte: windowEnd } },
      select: {
        id: true,
        title: true,
        targetDate: true,
        currentValue: true,
        targetValue: true,
        User: { select: { id: true, name: true } },
      },
      take: 50,
    }),
  ]);

  const todo: MissionCard[] = [];
  const inProgress: MissionCard[] = [];
  const done: MissionCard[] = [];

  for (const b of bookings) {
    const name = b.User?.name ?? "Ukjent";
    const isFuture = b.startTime > now;
    const isPast = b.endTime < now;
    const isLive = b.startTime <= now && b.endTime >= now && b.status === BookingStatus.CONFIRMED;

    const card: MissionCard = {
      id: `b-${b.id}`,
      title: b.ServiceType?.name ?? "Booking",
      playerName: name,
      initials: initialsFor(name),
      avatarColor: avatarColorFor(b.User?.id ?? b.id),
      priority: isLive ? "urgent" : isFuture && b.startTime.getTime() - now.getTime() < 86400000 ? "high" : "medium",
      dueText: formatDue(b.startTime),
      assignee: b.Instructor?.User?.name ?? null,
      tags: [b.status === BookingStatus.PENDING ? "Venter" : "Bekreftet"],
      status: isLive ? "in_progress" : isPast ? "done" : "todo",
      href: `/admin/bookinger?id=${b.id}`,
    };

    if (card.status === "todo") todo.push(card);
    else if (card.status === "in_progress") inProgress.push(card);
    else done.push(card);
  }

  for (const g of goals) {
    const name = g.User?.name ?? "Ukjent";
    const progress = g.targetValue && g.targetValue > 0 ? (g.currentValue ?? 0) / g.targetValue : 0;
    const card: MissionCard = {
      id: `g-${g.id}`,
      title: g.title,
      playerName: name,
      initials: initialsFor(name),
      avatarColor: avatarColorFor(g.User?.id ?? g.id),
      priority: progress > 0.7 ? "medium" : "high",
      dueText: g.targetDate ? formatDue(g.targetDate) : "—",
      assignee: null,
      tags: ["Mål"],
      status: progress >= 1 ? "done" : progress > 0 ? "in_progress" : "todo",
      href: `/admin/elever/${g.User?.id ?? ""}`,
    };

    if (card.status === "todo") todo.push(card);
    else if (card.status === "in_progress") inProgress.push(card);
    else done.push(card);
  }

  // Sorter: urgent først, så etter due date
  const sortCards = (a: MissionCard, b: MissionCard) => {
    const pMap = { urgent: 0, high: 1, medium: 2, low: 3 };
    return pMap[a.priority] - pMap[b.priority];
  };

  todo.sort(sortCards);
  inProgress.sort(sortCards);
  done.sort(sortCards);

  return {
    columns: { todo, in_progress: inProgress, done },
    counts: { todo: todo.length, in_progress: inProgress.length, done: done.length },
  };
}

// Tidligere getMissionBoardCharts — fjernet ved rewrite til Kanban.
// Charts-data hentes via fetchMissionBoardKanban() nå.
