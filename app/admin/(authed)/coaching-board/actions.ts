"use server";

import { UserRole, Capability, BookingStatus } from "@prisma/client";
import { requirePortalUser } from "@/lib/portal/auth";
import { hasCapability } from "@/lib/portal/capabilities/check";
import { prisma } from "@/lib/portal/prisma";
import { computeCoachingSignalsForUsers } from "@/lib/portal/coaching-signals";
import { getMyPlayers } from "@/lib/portal/kartlegging";
import { getTrainingIndex } from "@/lib/portal/kartlegging/training-index";
import type { CoachingSignal } from "@/lib/portal/coaching-signals";
import type {
  KanbanCard,
  ColumnTone,
} from "./components/kanban-types";

export interface CoachingBoardPlayerRow {
  userId: string;
  name: string | null;
  email: string | null;
  category: string | null;
  averageScore: number | null;
  totalUsi: number | null;
  trend30d: number | null;
  usiSparkline: number[];
  biggestGap: {
    label: string;
    value: number;
  } | null;
  distributionPct: {
    onCourse: number;
    skillTechnical: number;
    shortGame: number;
    putting: number;
    physicalMental: number;
  } | null;
  lastTrainingAt: string | null;
  signal: CoachingSignal | null;
}

export interface CoachingBoardGroupHealth {
  totalPlayers: number;
  avgUsiChange30d: number;
  groupPlanAdherencePct: number;
  courseHeavyCount: number;
  missingTestsCount: number;
  distributionAvg: {
    onCourse: number;
    skillTechnical: number;
    shortGame: number;
    putting: number;
    physicalMental: number;
  };
}

export interface CoachingBoardData {
  players: CoachingBoardPlayerRow[];
  groupHealth: CoachingBoardGroupHealth;
  viewMode: "own" | "all";
  coachName: string | null;
}

export async function fetchCoachingBoardData(): Promise<CoachingBoardData> {
  const user = await requirePortalUser();

  const hasOwn =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.MB_VIEW_OWN_PLAYERS));
  const hasAll =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.MB_VIEW_ALL_PLAYERS));

  if (!hasOwn && !hasAll) {
    throw new Error("Manglende tilgang til Coaching Mission Board.");
  }

  const viewMode: "own" | "all" = hasAll ? "all" : "own";

  let userIds: string[] = [];
  const coachName: string | null = user.name ?? null;

  if (viewMode === "all") {
    const students = await prisma.user.findMany({
      where: { role: UserRole.STUDENT, isActive: true },
      select: { id: true },
      take: 200,
    });
    userIds = students.map((s) => s.id);
  } else {
    const relations = await getMyPlayers(user.id);
    userIds = relations.map((r) => r.playerUserId);
  }

  if (userIds.length === 0) {
    return {
      players: [],
      groupHealth: emptyGroupHealth(),
      viewMode,
      coachName,
    };
  }

  const [users, usis, snapshots, signals, lastTrainings] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    }),
    prisma.unifiedSkillIndex.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        totalUsi: true,
        sgOtt: true,
        sgApp: true,
        sgArg: true,
        sgPutt: true,
        trendMomentum: true,
        estimatedCategory: true,
        estimatedHandicap: true,
      },
    }),
    prisma.unifiedSkillSnapshot.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: "desc" },
      take: userIds.length * 5,
      select: { userId: true, totalUsi: true, createdAt: true },
    }),
    computeCoachingSignalsForUsers(userIds),
    prisma.trainingLog.findMany({
      where: { userId: { in: userIds } },
      orderBy: { date: "desc" },
      take: userIds.length * 2,
      select: { userId: true, date: true },
    }),
  ]);

  const usiMap = new Map(usis.map((u) => [u.userId, u]));
  const signalMap = new Map(signals.map((s) => [s.userId, s]));

  const snapshotsByUser = new Map<string, typeof snapshots>();
  for (const s of snapshots) {
    const arr = snapshotsByUser.get(s.userId) ?? [];
    arr.push(s);
    snapshotsByUser.set(s.userId, arr);
  }

  const lastTrainingByUser = new Map<string, Date>();
  for (const log of lastTrainings) {
    if (!lastTrainingByUser.has(log.userId)) {
      lastTrainingByUser.set(log.userId, log.date);
    }
  }

  const trainingIdxs = await Promise.all(
    userIds.map(async (id) => {
      try {
        const idx = await getTrainingIndex(id, {
          category: usiMap.get(id)?.estimatedCategory,
        });
        return { userId: id, idx };
      } catch {
        return { userId: id, idx: null };
      }
    })
  );
  const trainingIdxMap = new Map(trainingIdxs.map((t) => [t.userId, t.idx]));

  const players: CoachingBoardPlayerRow[] = users.map((u) => {
    const usi = usiMap.get(u.id);
    const signal = signalMap.get(u.id) ?? null;
    const userSnapshots = snapshotsByUser.get(u.id) ?? [];
    const idx = trainingIdxMap.get(u.id);

    const sparkline = userSnapshots.slice(0, 5).map((s) => s.totalUsi).reverse();
    const trend =
      userSnapshots.length >= 2
        ? (userSnapshots[0].totalUsi -
            userSnapshots[userSnapshots.length - 1].totalUsi)
        : 0;

    const biggestGap = findBiggestGap(usi);

    return {
      userId: u.id,
      name: u.name,
      email: u.email,
      category: usi?.estimatedCategory ?? null,
      averageScore: null,
      totalUsi: usi?.totalUsi ?? null,
      trend30d: trend,
      usiSparkline: sparkline,
      biggestGap,
      distributionPct: idx?.distribution ?? null,
      lastTrainingAt: lastTrainingByUser.get(u.id)?.toISOString() ?? null,
      signal,
    };
  });

  players.sort(
    (a, b) => (b.signal?.priorityScore ?? 0) - (a.signal?.priorityScore ?? 0)
  );

  return {
    players,
    groupHealth: computeGroupHealth(players),
    viewMode,
    coachName,
  };
}

function findBiggestGap(
  usi:
    | {
        sgOtt: number;
        sgApp: number;
        sgArg: number;
        sgPutt: number;
      }
    | undefined
): { label: string; value: number } | null {
  if (!usi) return null;
  const values: { label: string; value: number }[] = [
    { label: "Langspill", value: usi.sgOtt },
    { label: "Innspill", value: usi.sgApp },
    { label: "Kortspill", value: usi.sgArg },
    { label: "Putting", value: usi.sgPutt },
  ];
  const worst = values.reduce((a, b) => (a.value < b.value ? a : b));
  return worst;
}

function emptyGroupHealth(): CoachingBoardGroupHealth {
  return {
    totalPlayers: 0,
    avgUsiChange30d: 0,
    groupPlanAdherencePct: 0,
    courseHeavyCount: 0,
    missingTestsCount: 0,
    distributionAvg: {
      onCourse: 0,
      skillTechnical: 0,
      shortGame: 0,
      putting: 0,
      physicalMental: 0,
    },
  };
}

function computeGroupHealth(
  players: CoachingBoardPlayerRow[]
): CoachingBoardGroupHealth {
  if (players.length === 0) return emptyGroupHealth();

  const withTrend = players.filter((p) => p.trend30d !== null);
  const avgTrend =
    withTrend.length > 0
      ? withTrend.reduce((acc, p) => acc + (p.trend30d ?? 0), 0) /
        withTrend.length
      : 0;

  const withDistribution = players.filter((p) => p.distributionPct !== null);
  const distAvg = {
    onCourse: 0,
    skillTechnical: 0,
    shortGame: 0,
    putting: 0,
    physicalMental: 0,
  };
  for (const p of withDistribution) {
    if (!p.distributionPct) continue;
    distAvg.onCourse += p.distributionPct.onCourse;
    distAvg.skillTechnical += p.distributionPct.skillTechnical;
    distAvg.shortGame += p.distributionPct.shortGame;
    distAvg.putting += p.distributionPct.putting;
    distAvg.physicalMental += p.distributionPct.physicalMental;
  }
  const n = withDistribution.length || 1;
  distAvg.onCourse /= n;
  distAvg.skillTechnical /= n;
  distAvg.shortGame /= n;
  distAvg.putting /= n;
  distAvg.physicalMental /= n;

  const courseHeavy = players.filter(
    (p) => (p.distributionPct?.onCourse ?? 0) > 0.6
  ).length;

  const missingTests = players.filter((p) =>
    p.signal?.kinds.includes("test-gap")
  ).length;

  return {
    totalPlayers: players.length,
    avgUsiChange30d: Math.round(avgTrend * 100) / 100,
    groupPlanAdherencePct: 0,
    courseHeavyCount: courseHeavy,
    missingTestsCount: missingTests,
    distributionAvg: distAvg,
  };
}

/* ============================================================
 * Coaching Board Kanban — bookings + sessions mappet til 4 faser
 *
 *   preparation → kommende bookinger (PENDING/CONFIRMED, startTime > nå)
 *   active      → bookinger som pågår nå (CONFIRMED, start <= nå <= end)
 *   followup    → fullførte sessions uten followUpSent
 *   done        → fullførte sessions med followUpSent=true (kappet til 4)
 *
 * Vinduet er ±10 dager fra nå, slik at både ferdige og fremtidige økter
 * tas med uten å overgrave kolonnene.
 * ========================================================== */

export interface KanbanBoardData {
  columns: Record<ColumnTone, KanbanCard[]>;
  totalsByColumn: Record<ColumnTone, number>;
  weekSessionCount: number;
  doneOverflow: number;
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
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const NO_DAY_SHORT = ["SØN", "MAN", "TIR", "ONS", "TOR", "FRE", "LØR"];

function formatWhen(date: Date, now: Date): string {
  const sameWeek =
    Math.abs(date.getTime() - now.getTime()) < 1000 * 60 * 60 * 24 * 7;
  const day = NO_DAY_SHORT[date.getDay()];
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  if (sameWeek) {
    return `${day} ${hh}:${mm}`;
  }
  const dd = date.getDate().toString().padStart(2, "0");
  const monthShort = [
    "jan",
    "feb",
    "mar",
    "apr",
    "mai",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "des",
  ][date.getMonth()];
  return `${day} ${dd} ${monthShort}`;
}

function formatLiveWhen(start: Date, end: Date, now: Date): string {
  const minutesLeft = Math.max(
    0,
    Math.round((end.getTime() - now.getTime()) / 60000)
  );
  const hh = start.getHours().toString().padStart(2, "0");
  const mm = start.getMinutes().toString().padStart(2, "0");
  return minutesLeft > 0 ? `${hh}:${mm} NÅ` : `${hh}:${mm} NÅ`;
}

export async function fetchKanbanBoardData(): Promise<KanbanBoardData> {
  const user = await requirePortalUser();

  const hasOwn =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.MB_VIEW_OWN_PLAYERS));
  const hasAll =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.MB_VIEW_ALL_PLAYERS));

  if (!hasOwn && !hasAll) {
    return {
      columns: {
        preparation: [],
        active: [],
        followup: [],
        done: [],
      },
      totalsByColumn: { preparation: 0, active: 0, followup: 0, done: 0 },
      weekSessionCount: 0,
      doneOverflow: 0,
    };
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10);
  const windowEnd = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10);

  // Hvis brukeren er coach (ikke admin) og kun har OWN-tilgang, filtrer på instructorId via Instructor-relasjonen.
  const myInstructor = await prisma.instructor
    .findUnique({ where: { userId: user.id }, select: { id: true } })
    .catch(() => null);

  const instructorFilter =
    !hasAll && myInstructor ? { instructorId: myInstructor.id } : {};

  const bookings = await prisma.booking.findMany({
    where: {
      ...instructorFilter,
      startTime: { gte: windowStart, lte: windowEnd },
      status: {
        in: [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.COMPLETED,
        ],
      },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      isGroupBooking: true,
      adminNotes: true,
      studentNotes: true,
      User: {
        select: { id: true, name: true, email: true },
      },
      ServiceType: {
        select: { name: true, category: true },
      },
      CoachingSession: {
        select: {
          id: true,
          primaryFocus: true,
          secondaryFocus: true,
          followUpSent: true,
          aiSummary: true,
        },
      },
    },
    orderBy: { startTime: "asc" },
    take: 200,
  });

  const startOfWeek = new Date(now);
  const dayOfWeek = (startOfWeek.getDay() + 6) % 7; // mon=0
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const weekSessionCount = bookings.filter(
    (b) => b.startTime >= startOfWeek && b.startTime < endOfWeek
  ).length;

  const columns: Record<ColumnTone, KanbanCard[]> = {
    preparation: [],
    active: [],
    followup: [],
    done: [],
  };

  for (const booking of bookings) {
    const student = booking.User;
    const name = booking.isGroupBooking
      ? booking.ServiceType?.name ?? "Gruppe-økt"
      : student?.name ?? student?.email ?? "Ukjent spiller";
    const initials = booking.isGroupBooking
      ? "GR"
      : initialsFor(student?.name ?? student?.email ?? "??");
    const avatarColor = avatarColorFor(student?.id ?? booking.id);
    const focusText =
      booking.CoachingSession?.primaryFocus ??
      booking.adminNotes ??
      booking.ServiceType?.name ??
      "Coaching-økt";

    const isLive =
      booking.startTime <= now &&
      booking.endTime >= now &&
      booking.status === BookingStatus.CONFIRMED;
    const isFuture = booking.startTime > now;
    const isPast = booking.endTime < now;

    if (isLive) {
      columns.active.push({
        id: booking.id,
        initials,
        avatarColor: "#D1F843",
        name,
        when: formatLiveWhen(booking.startTime, booking.endTime, now),
        focus: focusText,
        progress: clamp01(
          (now.getTime() - booking.startTime.getTime()) /
            Math.max(
              1,
              booking.endTime.getTime() - booking.startTime.getTime()
            )
        ),
        footerLeft: "Live",
        iconRight: [{ name: "circle-dot" }],
        variant: "live",
        href: `/admin/bookinger?id=${booking.id}`,
      });
      continue;
    }

    if (isFuture) {
      const minutesUntil =
        (booking.startTime.getTime() - now.getTime()) / 60000;
      const isUrgent = minutesUntil < 60 && !booking.CoachingSession;
      // Placeholder: prep-progress beregnes ut fra om coachingsession-rad finnes
      // og om primaryFocus + adminNotes er satt. Dette er en tilnærming —
      // ekte prep-tracking kommer i Sprint 2 (TODO: prep-checklist på CoachingSession).
      const hasFocus = !!booking.CoachingSession?.primaryFocus;
      const hasNotes = !!booking.adminNotes;
      const prepProgress = (hasFocus ? 0.6 : 0.2) + (hasNotes ? 0.2 : 0);

      columns.preparation.push({
        id: booking.id,
        initials,
        avatarColor,
        name,
        when: formatWhen(booking.startTime, now),
        focus: focusText,
        progress: clamp01(prepProgress),
        footerLeft: isUrgent
          ? `Forfaller ${booking.startTime.getHours()}:${booking.startTime
              .getMinutes()
              .toString()
              .padStart(2, "0")}`
          : `${Math.round(prepProgress * 5)}/5 steg`,
        iconRight: isUrgent
          ? [{ name: "alert" }]
          : [{ name: "paperclip", count: hasFocus ? 1 : 0 }],
        variant: isUrgent ? "urgent" : "default",
        href: `/admin/bookinger?id=${booking.id}`,
      });
      continue;
    }

    if (isPast) {
      const followUpSent = booking.CoachingSession?.followUpSent ?? false;
      if (booking.status === BookingStatus.COMPLETED && followUpSent) {
        columns.done.push({
          id: booking.id,
          initials,
          avatarColor,
          name,
          when: formatWhen(booking.startTime, now).replace(
            /\s\d{2}:\d{2}$/,
            ""
          ),
          focus: focusText,
          footerLeft: `Lukket ${formatWhen(booking.startTime, now).toLowerCase()}`,
          iconRight: [{ name: "check" }],
          variant: "faded",
          href: `/admin/elever/${student?.id ?? ""}`,
        });
      } else {
        // Etterarbeid: økt er over, men oppfølging mangler
        const hasSummary = !!booking.CoachingSession?.aiSummary;
        const tasksDone = (hasSummary ? 1 : 0) + (followUpSent ? 1 : 0);
        const totalTasks = 4;
        columns.followup.push({
          id: booking.id,
          initials,
          avatarColor,
          name,
          when: formatWhen(booking.startTime, now),
          focus: focusText,
          progress: tasksDone / totalTasks,
          footerLeft: `${tasksDone}/${totalTasks} oppgaver`,
          iconRight: [
            { name: hasSummary ? "sparkles" : "file" },
          ],
          href: `/admin/elever/${student?.id ?? ""}`,
        });
      }
    }
  }

  // Sortering — kommende først kronologisk, etterarbeid eldst først, ferdig nyeste først
  columns.preparation.sort((a, b) => a.when.localeCompare(b.when));
  columns.followup.sort((a, b) => a.when.localeCompare(b.when));
  columns.done.sort((a, b) => b.when.localeCompare(a.when));

  // Vis maks 3 ferdig-kort + en "+N flere lukket"-rad hvis det er flere
  const doneVisible = columns.done.slice(0, 3);
  const doneOverflow = columns.done.length - doneVisible.length;
  if (doneOverflow > 0) {
    doneVisible.push({
      id: "done-overflow",
      initials: `+${doneOverflow}`,
      avatarColor: "#7A8C85",
      name: `${doneOverflow} flere lukket`,
      when: `UKE ${getISOWeek(now)}`,
      focus: "Vis arkiv →",
      footerLeft: "Vis arkiv →",
      iconRight: [{ name: "archive" }],
      variant: "faded",
      href: "/admin/bookinger?status=completed",
    });
  }
  columns.done = doneVisible;

  return {
    columns,
    totalsByColumn: {
      preparation: columns.preparation.length,
      active: columns.active.length,
      followup: columns.followup.length,
      done: columns.done.length + Math.max(0, doneOverflow),
    },
    weekSessionCount,
    doneOverflow,
  };
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function getISOWeek(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
