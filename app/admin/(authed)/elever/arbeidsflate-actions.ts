"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { startOfWeek, endOfWeek, startOfMonth, subDays } from "date-fns";

/**
 * Server actions for /admin/elever 3-panel arbeidsflate.
 *
 * Tre datakilder:
 *  1. getArbeidsflateKpis() — 4 KPI-kort i toppen (aktive elever, økter/uke,
 *     fast inntekt, anbefaling-score)
 *  2. getArbeidsflateStudentList() — spillerliste til venstre panel,
 *     gruppert i seksjoner (I dag / Denne uken / Trenger oppfolging)
 *  3. getArbeidsflateActiveSession() — info om aktiv okt akkurat nå
 *     (for "Aktiv 14:30 · Martin Roen"-kortet i mockup)
 */

export interface ArbeidsflateKpis {
  activeStudents: number;
  activeStudentsTrend: number;
  capacity: number;
  weeklySessions: number;
  weeklySessionsTrendPct: number;
  weeklyHoursLabel: string;
  monthlyRevenueKr: number;
  monthlyRevenueTrendPct: number;
  monthlyRevenueGoalKr: number;
  npsScore: number;
  npsTrend: number;
  npsResponses: number;
}

export interface ArbeidsflateStudent {
  id: string;
  name: string;
  initials: string;
  avatarTone: "accent" | "primary" | "warning" | "danger" | "success" | "muted";
  handicap: number | null;
  category: string | null;
  /** "16:00" om okt i dag, "tor" om i denne uken, etc. */
  timeLabel: string;
  /** Har gronn/gul/red prikk pa avataren */
  statusDot: "active" | "warning" | "muted" | null;
  /** "14 dgr stille", "savnet okt", undefined ellers */
  followupReason: string | null;
}

export interface ArbeidsflateStudentList {
  todayStudents: ArbeidsflateStudent[];
  thisWeekStudents: ArbeidsflateStudent[];
  followupStudents: ArbeidsflateStudent[];
  totalActive: number;
}

export type ArbeidsflateActiveSession = {
  studentName: string;
  serviceName: string;
  durationMinutes: number;
  elapsedMinutes: number;
  startedAt: Date;
} | null;

// ── Hjelpere ──────────────────────────────────────────

function getInitials(name: string | null): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Avatar-fargetone basert pa fornavn — deterministisk hash. */
function avatarToneForName(
  name: string | null,
): ArbeidsflateStudent["avatarTone"] {
  if (!name) return "muted";
  const tones: ArbeidsflateStudent["avatarTone"][] = [
    "primary",
    "warning",
    "danger",
    "success",
    "accent",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return tones[Math.abs(hash) % tones.length];
}

function formatTimeLabel(date: Date): string {
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  // Ukedag forkortet (man, tir, ons, ...)
  return date.toLocaleDateString("nb-NO", { weekday: "short" }).toLowerCase().slice(0, 3);
}

// ── Actions ───────────────────────────────────────────

export async function getArbeidsflateKpis(): Promise<ArbeidsflateKpis> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return EMPTY_KPIS;
  }

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subDays(monthStart, 1));
  const thirtyDaysAgo = subDays(now, 30);

  const [
    activeStudents,
    newThisMonth,
    weeklyBookings,
    monthRevenue,
    lastMonthRevenue,
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
    prisma.booking.findMany({
      where: {
        startTime: { gte: weekStart, lte: weekEnd },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      select: { startTime: true, endTime: true },
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
  ]);

  const weeklySessions = weeklyBookings.length;
  const weeklyMinutes = weeklyBookings.reduce((sum, b) => {
    if (!b.endTime) return sum;
    return sum + (b.endTime.getTime() - b.startTime.getTime()) / 60000;
  }, 0);
  const weeklyHours = Math.floor(weeklyMinutes / 60);
  const weeklyHoursRemainder = Math.round(weeklyMinutes % 60);
  const weeklyHoursLabel = `${weeklyHours} t ${weeklyHoursRemainder} min belegg`;

  const monthlyRevenueKr = monthRevenue._sum.grossAmount ?? 0;
  const lastMonthRevenueKr = lastMonthRevenue._sum.grossAmount ?? 0;
  const monthlyRevenueTrendPct =
    lastMonthRevenueKr > 0
      ? Math.round(
          ((monthlyRevenueKr - lastMonthRevenueKr) / lastMonthRevenueKr) * 100,
        )
      : 0;

  // Trend for okter — sammenlign med forrige uke
  const prevWeekStart = subDays(weekStart, 7);
  const prevWeekEnd = subDays(weekEnd, 7);
  const prevWeeklyBookings = await prisma.booking.count({
    where: {
      startTime: { gte: prevWeekStart, lte: prevWeekEnd },
      status: { in: ["CONFIRMED", "COMPLETED"] },
    },
  });
  const weeklySessionsTrendPct =
    prevWeeklyBookings > 0
      ? Math.round(((weeklySessions - prevWeeklyBookings) / prevWeeklyBookings) * 100)
      : 0;

  // NPS — bruker NpsResponse hvis modellen finnes, ellers placeholder.
  // Foreløpig placeholder til NPS-data er aktivert.
  const npsScore = 71;
  const npsTrend = 6;
  const npsResponses = await prisma.user.count({
    where: { role: "STUDENT", lastActiveAt: { gte: thirtyDaysAgo } },
  });

  return {
    activeStudents,
    activeStudentsTrend: newThisMonth,
    capacity: 60,
    weeklySessions,
    weeklySessionsTrendPct,
    weeklyHoursLabel,
    monthlyRevenueKr,
    monthlyRevenueTrendPct,
    monthlyRevenueGoalKr: 250000,
    npsScore,
    npsTrend,
    npsResponses,
  };
}

const EMPTY_KPIS: ArbeidsflateKpis = {
  activeStudents: 0,
  activeStudentsTrend: 0,
  capacity: 60,
  weeklySessions: 0,
  weeklySessionsTrendPct: 0,
  weeklyHoursLabel: "0 t 0 min belegg",
  monthlyRevenueKr: 0,
  monthlyRevenueTrendPct: 0,
  monthlyRevenueGoalKr: 250000,
  npsScore: 0,
  npsTrend: 0,
  npsResponses: 0,
};

/**
 * Henter spillerliste til venstre-panel. Gruppert i tre seksjoner:
 *  - todayStudents: spillere med okt i dag (sortert etter starttid)
 *  - thisWeekStudents: ukens kommende okter
 *  - followupStudents: spillere som trenger oppfolging (>14 dager stille
 *    eller savnet okt siste 30 dager)
 */
export async function getArbeidsflateStudentList(): Promise<ArbeidsflateStudentList> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return {
      todayStudents: [],
      thisWeekStudents: [],
      followupStudents: [],
      totalActive: 0,
    };
  }

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const fourteenDaysAgo = subDays(now, 14);

  // Hent dagens og ukens bookinger med spiller-info
  const [todaysBookings, weekBookings, totalActive] = await Promise.all([
    prisma.booking.findMany({
      where: {
        startTime: { gte: today, lt: tomorrow },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      orderBy: { startTime: "asc" },
      select: {
        startTime: true,
        User: {
          select: {
            id: true,
            name: true,
            HandicapEntry: {
              orderBy: { date: "desc" },
              take: 1,
              select: { handicapIndex: true },
            },
            lastActiveAt: true,
          },
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        startTime: { gt: tomorrow, lte: weekEnd },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      orderBy: { startTime: "asc" },
      take: 30,
      select: {
        startTime: true,
        User: {
          select: {
            id: true,
            name: true,
            HandicapEntry: {
              orderBy: { date: "desc" },
              take: 1,
              select: { handicapIndex: true },
            },
            lastActiveAt: true,
          },
        },
      },
    }),
    prisma.user.count({
      where: { role: "STUDENT", isActive: true },
    }),
  ]);

  function bookingToStudent(b: {
    startTime: Date;
    User: {
      id: string;
      name: string | null;
      HandicapEntry: { handicapIndex: number }[];
      lastActiveAt: Date | null;
    } | null;
  }): ArbeidsflateStudent | null {
    const u = b.User;
    if (!u) return null;
    const lastActive = u.lastActiveAt;
    const isActiveRecently =
      lastActive !== null && lastActive > subDays(now, 7);
    const isStale = lastActive === null || lastActive < fourteenDaysAgo;
    return {
      id: u.id,
      name: u.name ?? "Ukjent spiller",
      initials: getInitials(u.name),
      avatarTone: avatarToneForName(u.name),
      handicap: u.HandicapEntry[0]?.handicapIndex ?? null,
      category: null,
      timeLabel: formatTimeLabel(b.startTime),
      statusDot: isActiveRecently ? "active" : isStale ? "muted" : "warning",
      followupReason: null,
    };
  }

  const todayStudents = todaysBookings
    .map(bookingToStudent)
    .filter((x): x is ArbeidsflateStudent => x !== null);

  // Dedupliser i ukens liste — om en spiller har flere okter, vis bare en
  const thisWeekSeen = new Set<string>();
  const thisWeekStudents = weekBookings
    .map(bookingToStudent)
    .filter((s): s is ArbeidsflateStudent => {
      if (s === null) return false;
      if (thisWeekSeen.has(s.id)) return false;
      thisWeekSeen.add(s.id);
      return true;
    });

  // Oppfolging: spillere som ikke har vaert aktive pa 14+ dager
  const followupCandidates = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      isActive: true,
      OR: [
        { lastActiveAt: null },
        { lastActiveAt: { lt: fourteenDaysAgo } },
      ],
    },
    take: 10,
    orderBy: { lastActiveAt: "asc" },
    select: {
      id: true,
      name: true,
      lastActiveAt: true,
    },
  });

  const followupStudents: ArbeidsflateStudent[] = followupCandidates.map((u) => {
    const daysStale = u.lastActiveAt
      ? Math.floor((now.getTime() - u.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24))
      : null;
    const followupReason = daysStale
      ? `${daysStale} dgr stille`
      : "ingen aktivitet";
    return {
      id: u.id,
      name: u.name ?? "Ukjent spiller",
      initials: getInitials(u.name),
      avatarTone: "muted",
      handicap: null,
      category: null,
      timeLabel: "",
      statusDot: "warning",
      followupReason,
    };
  });

  return {
    todayStudents,
    thisWeekStudents,
    followupStudents,
    totalActive,
  };
}

/**
 * Henter info om aktiv okt akkurat nå — for "Aktiv 14:30"-kortet.
 * Returnerer null om ingen okt pågår.
 */
export async function getArbeidsflateActiveSession(): Promise<ArbeidsflateActiveSession> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return null;

  const now = new Date();
  const booking = await prisma.booking.findFirst({
    where: {
      startTime: { lte: now },
      endTime: { gte: now },
      status: { in: ["CONFIRMED", "COMPLETED"] },
    },
    select: {
      startTime: true,
      endTime: true,
      User: { select: { name: true } },
      ServiceType: { select: { name: true } },
    },
  });

  if (!booking || !booking.endTime) return null;

  const durationMinutes = Math.round(
    (booking.endTime.getTime() - booking.startTime.getTime()) / 60000,
  );
  const elapsedMinutes = Math.round(
    (now.getTime() - booking.startTime.getTime()) / 60000,
  );

  return {
    studentName: booking.User?.name ?? "Ukjent",
    serviceName: booking.ServiceType?.name ?? "Okt",
    durationMinutes,
    elapsedMinutes,
    startedAt: booking.startTime,
  };
}
