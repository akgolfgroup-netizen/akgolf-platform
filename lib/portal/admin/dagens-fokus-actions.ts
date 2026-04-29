/**
 * Server actions for /admin (Dagens fokus).
 *
 * Henter:
 *  - 3 signal-kort: urgent (inaktive), attention (SG-nedgang), opportunity (PR)
 *  - 5 KPI-er (aktive, økter, SG, MRR, forfalte fakturaer)
 *  - Dagens oppgaver (forberede økter, skrive oppsummeringer, godkjenninger)
 *
 * Bruker eksisterende Prisma-modeller — ingen nye migrasjoner.
 */

import { prisma } from "@/lib/portal/prisma";
import { startOfWeek, endOfWeek, subDays, startOfMonth } from "date-fns";

export interface DagensFokusSignal {
  tone: "urgent" | "attention" | "opportunity";
  corner: string;
  iconName: "alert-triangle" | "trending-down" | "award";
  num: string;
  numSuffix: string;
  description: string;
  /** Navn pa de involverte spillerne (for highlight i description) */
  highlights: string[];
  /** Lenker for action-knapper */
  primaryHref: string;
  secondaryHref: string;
}

export interface DagensFokusKpi {
  label: string;
  value: string;
  small?: string;
  delta?: string;
  deltaTone?: "up" | "down";
  alert?: boolean;
}

export interface DagensFokusTask {
  done: boolean;
  label: string;
  who: string;
  pill: string;
  pillTone: "default" | "success" | "warn";
}

// ── Signaler ──────────────────────────────────────────

export async function getDagensFokusSignals(): Promise<DagensFokusSignal[]> {
  const now = new Date();
  const fourteenDaysAgo = subDays(now, 14);
  const thirtyDaysAgo = subDays(now, 30);

  const [inactives, degradations, recentImprovements] = await Promise.all([
    // URGENT: spillere inaktive 14+ dager
    prisma.user.findMany({
      where: {
        role: "STUDENT",
        isActive: true,
        OR: [
          { lastActiveAt: { lt: fourteenDaysAgo } },
          { lastActiveAt: null, createdAt: { lt: fourteenDaysAgo } },
        ],
      },
      take: 5,
      orderBy: { lastActiveAt: "asc" },
      select: { id: true, name: true },
    }),

    // ATTENTION: spillere med SG-nedgang siste 30d (fra DegradationTracking)
    prisma.degradationTracking.findMany({
      where: { lastUpdated: { gte: thirtyDaysAgo } },
      take: 10,
      orderBy: { lastUpdated: "desc" },
      select: {
        userId: true,
        shotType: true,
        User: { select: { name: true } },
      },
    }),

    // OPPORTUNITY: spillere som har slatt PR siste 30d
    // (forenklet — finn brukere med ny lavest totalScore i RoundStats)
    prisma.user.findMany({
      where: {
        role: "STUDENT",
        isActive: true,
        RoundStats: {
          some: {
            date: { gte: thirtyDaysAgo },
            totalScore: { not: null },
          },
        },
      },
      take: 5,
      select: {
        id: true,
        name: true,
        RoundStats: {
          orderBy: { totalScore: "asc" },
          take: 1,
          select: { totalScore: true, date: true },
        },
      },
    }),
  ]);

  const signals: DagensFokusSignal[] = [];

  // URGENT
  if (inactives.length > 0) {
    const names = inactives.slice(0, 2).map((u) => u.name ?? "Ukjent");
    const desc =
      inactives.length === 1
        ? `${names[0]} har ikke logget runder pa 14+ dager. Vurder retention-touch.`
        : `${names.join(" og ")}${inactives.length > 2 ? " m.fl." : ""} har ikke logget runder pa 14+ dager. Vurder retention-touch.`;
    signals.push({
      tone: "urgent",
      corner: "Krever handling",
      iconName: "alert-triangle",
      num: String(inactives.length),
      numSuffix: inactives.length === 1 ? "spiller" : "spillere",
      description: desc,
      highlights: names,
      primaryHref: "/admin/meldinger",
      secondaryHref: "/admin/elever",
    });
  }

  // ATTENTION
  if (degradations.length > 0) {
    const uniqueUsers = new Set(degradations.map((d) => d.userId));
    const count = uniqueUsers.size;
    signals.push({
      tone: "attention",
      corner: "Trender ned",
      iconName: "trending-down",
      num: String(count),
      numSuffix: count === 1 ? "spiller" : "spillere",
      description: `Tekniske nedganger oppdaget siste 30 dager. Vurder a bygge fokus-plan i neste okt.`,
      highlights: [],
      primaryHref: "/admin/treningsplan",
      secondaryHref: "/admin/analytics",
    });
  }

  // OPPORTUNITY
  if (recentImprovements.length > 0) {
    const top = recentImprovements[0];
    const name = top.name ?? "Ukjent";
    signals.push({
      tone: "opportunity",
      corner: "Mulighet",
      iconName: "award",
      num: "1",
      numSuffix: "spiller",
      description: `${name} har gode resultater siste maneden. Foresla turneringsmal.`,
      highlights: [name],
      primaryHref: "/admin/turneringer",
      secondaryHref: `/admin/elever?id=${top.id}`,
    });
  }

  return signals;
}

// ── KPI-strip ─────────────────────────────────────────

export async function getDagensFokusKpis(): Promise<DagensFokusKpi[]> {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subDays(monthStart, 1));
  const thirtyDaysAgo = subDays(now, 30);

  const [
    activeStudents,
    newThisMonth,
    weeklySessions,
    monthRevenue,
    lastMonthRevenue,
    overdueInvoices,
    recentRounds,
  ] = await Promise.all([
    prisma.user.count({
      where: { role: "STUDENT", isActive: true },
    }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        isActive: true,
        createdAt: { gte: monthStart },
      },
    }),
    prisma.booking.count({
      where: {
        startTime: { gte: weekStart, lte: weekEnd },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
    }),
    prisma.paymentTransaction.aggregate({
      where: { createdAt: { gte: monthStart }, status: "PAID" },
      _sum: { grossAmount: true },
    }),
    prisma.paymentTransaction.aggregate({
      where: {
        createdAt: { gte: lastMonthStart, lt: monthStart },
        status: "PAID",
      },
      _sum: { grossAmount: true },
    }),
    prisma.paymentTransaction.count({
      where: { status: "FAILED" },
    }),
    prisma.roundStats.aggregate({
      where: {
        date: { gte: thirtyDaysAgo },
        sgTotal: { not: null },
      },
      _avg: { sgTotal: true },
    }),
  ]);

  const monthlyRevenueKr = monthRevenue._sum.grossAmount ?? 0;
  const lastMonthRevenueKr = lastMonthRevenue._sum.grossAmount ?? 0;
  const revenueDelta =
    lastMonthRevenueKr > 0
      ? Math.round(
          ((monthlyRevenueKr - lastMonthRevenueKr) / lastMonthRevenueKr) * 100,
        )
      : 0;

  const avgSg = recentRounds._avg.sgTotal ?? 0;

  function formatRevenueShort(amount: number): string {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1000) return `${Math.round(amount / 1000)}k`;
    return `${amount}`;
  }

  return [
    {
      label: "Aktive spillere",
      value: String(activeStudents),
      delta: newThisMonth > 0 ? `+${newThisMonth}` : undefined,
    },
    {
      label: "Denne uken",
      value: String(weeklySessions),
      small: "okter",
    },
    {
      label: "Snitt SG",
      value: avgSg > 0 ? `+${avgSg.toFixed(2)}` : avgSg.toFixed(2),
    },
    {
      label: "MRR",
      value: formatRevenueShort(monthlyRevenueKr),
      delta: revenueDelta !== 0 ? `${revenueDelta > 0 ? "+" : ""}${revenueDelta}%` : undefined,
      deltaTone: revenueDelta < 0 ? "down" : "up",
    },
    {
      label: "Forfalte fakturaer",
      value: String(overdueInvoices),
      alert: overdueInvoices > 0,
      deltaTone: "down",
    },
  ];
}

// ── Oppgaver ──────────────────────────────────────────

export async function getDagensFokusTasks(): Promise<DagensFokusTask[]> {
  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0);

  const [
    upcomingUnpreparedBookings,
    pendingApprovals,
    recentCompletedWithoutNotes,
  ] = await Promise.all([
    // Forberede kommende okter (PENDING uten coach-notater)
    prisma.booking.findMany({
      where: {
        startTime: { gte: now, lte: todayEnd },
        status: { in: ["CONFIRMED", "PENDING"] },
        adminNotes: null,
      },
      take: 3,
      orderBy: { startTime: "asc" },
      include: {
        User: { select: { name: true } },
      },
    }),
    // Godkjenninger (PENDING bookinger)
    prisma.booking.count({
      where: { status: "PENDING" },
    }),
    // Skrive opp-summering for fullforte okter siste 24t uten notater
    prisma.booking.findMany({
      where: {
        endTime: { gte: subDays(now, 1), lt: now },
        status: "COMPLETED",
        adminNotes: null,
      },
      take: 2,
      orderBy: { endTime: "desc" },
      include: {
        User: { select: { name: true } },
      },
    }),
  ]);

  const tasks: DagensFokusTask[] = [];

  // Oppgaver fra reelle data
  for (const b of upcomingUnpreparedBookings) {
    const time = b.startTime.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const minutesUntil = Math.round((b.startTime.getTime() - now.getTime()) / 60000);
    tasks.push({
      done: false,
      label: `Forberede ${b.User?.name ?? "okt"} kl ${time}`,
      who: minutesUntil > 0 ? `Forfaller ${time}` : "Pagar na",
      pill: minutesUntil > 60 ? `${Math.round(minutesUntil / 60)}t` : `${minutesUntil}m`,
      pillTone: "warn",
    });
  }

  if (pendingApprovals > 0) {
    tasks.push({
      done: false,
      label: `Godkjenne ${pendingApprovals} ventende booking${pendingApprovals === 1 ? "" : "er"}`,
      who: "Booking · krever deg",
      pill: pendingApprovals > 3 ? `${pendingApprovals}!` : String(pendingApprovals),
      pillTone: pendingApprovals > 3 ? "warn" : "default",
    });
  }

  for (const b of recentCompletedWithoutNotes) {
    tasks.push({
      done: false,
      label: `Skriv oppsummering ${b.User?.name ?? "okt"}`,
      who: "Coaching · siste 24t",
      pill: "I dag",
      pillTone: "default",
    });
  }

  return tasks;
}
