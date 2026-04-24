"use client";

import type { DashboardV3Props } from "@/app/portal/(dashboard)/dashboard-types";
import { PlayerHQHero } from "./hero";
import { PlayerHQRowOne } from "./row-one";
import { PlayerHQRowTwo } from "./row-two";

const WEEK_LABELS = ["S", "M", "T", "O", "T", "F", "L"] as const;
const MONTH_LABELS = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function PlayerHQDashboard(props: DashboardV3Props) {
  const {
    userName,
    stats,
    handicap,
    nextBooking,
    weekRings,
    trainingIndex,
    tier,
    memberSince,
  } = props;

  // Week bars from completionPercent (0-100). Peak is the max day.
  const weekPct = weekRings.days.map((d) => (d.completionPercent ?? 0) / 100);
  const peakVal = Math.max(...weekPct, 0);
  const peakIdx = weekPct.indexOf(peakVal);
  const weekBars = weekRings.days.map((d, i) => {
    const v = weekPct[i] ?? 0;
    const peak = i === peakIdx && v > 0.1;
    return {
      d: WEEK_LABELS[i] ?? d.dayLabel.slice(0, 1).toUpperCase(),
      v: Math.max(0.08, v),
      peak,
      peakLabel: peak ? `${Math.round(v * 100)}%` : undefined,
    };
  });

  const weeklyHours = trainingIndex?.weeklyHours ?? 0;

  // KPI pills — demo placeholders (real SG metrics need additional server fetchers)
  const fairwayPct = 58;
  const girPct = 52;
  const scramblingPct = 41;
  const scoringAvg: number | null = null;

  // Time tracker — dagens progresjon estimert fra weekRings + trainingIndex
  const todayIdx = new Date().getDay();
  const todayPct = weekPct[todayIdx] ?? 0;
  const planMinutes = 240;
  const todayMinutes = Math.round(planMinutes * todayPct);

  // Form segments — bruker trainingIndex.distribution hvis tilgjengelig, ellers demo
  const dist = trainingIndex?.distribution;
  const formSegments = dist
    ? [
        {
          label: "Fysisk",
          pct: Math.min(1, dist.physicalMental / 100),
          tone: "accent" as const,
        },
        {
          label: "Mental",
          pct: Math.min(1, (dist.skillTechnical + dist.shortGame) / 200),
          tone: "dark" as const,
        },
        {
          label: "Teknisk",
          pct: Math.min(1, dist.skillTechnical / 100),
          tone: "muted" as const,
        },
      ]
    : [
        { label: "Fysisk", pct: 0.82, tone: "accent" as const },
        { label: "Mental", pct: 0.64, tone: "dark" as const },
        { label: "Teknisk", pct: 0.41, tone: "muted" as const },
      ];
  const formPct = formSegments.reduce((s, seg) => s + seg.pct, 0) / formSegments.length;

  // List card — static groups with equipment
  const listGroups = [
    { label: "Statistikk-sammendrag" },
    {
      label: "Utstyr",
      defaultOpen: true,
      items: [
        { icon: "sports_golf", name: "Driver", detail: "Ping G430 LST" },
        { icon: "sports_golf", name: "Putter", detail: "Scotty Cameron Phantom X" },
      ],
    },
    { label: "Mål & milepæler" },
    { label: "Helsestatus" },
  ];

  // Calendar — week of today with next booking
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const days = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      d: ["Man", "Tir", "Ons", "Tor", "Fre", "Lør"][i] ?? "",
      n: d.getDate(),
      active: d.toDateString() === today.toDateString(),
    };
  });
  const monthLabel = `${MONTH_LABELS[today.getMonth()]} ${today.getFullYear()}`;
  const prevMonth = MONTH_LABELS[(today.getMonth() + 11) % 12] ?? "";
  const nextMonth = MONTH_LABELS[(today.getMonth() + 1) % 12] ?? "";

  const calendarEvents = nextBooking
    ? [
        {
          id: "next-booking",
          dayIndex: (new Date(nextBooking.startTime).getDay() + 6) % 7,
          startMinutes:
            new Date(nextBooking.startTime).getHours() * 60 +
            new Date(nextBooking.startTime).getMinutes(),
          durationMinutes: nextBooking.duration ?? 60,
          title: `Coaching — ${nextBooking.instructorName ?? "Trener"}`,
          subtitle: nextBooking.serviceName ?? "Økt",
          tone: "dark" as const,
          attendees: ["#d2f000", "#afe3cc", "#f5d28f"],
        },
      ]
    : [];

  // Tasks — demo (skal kobles til TrainingPlanSession når getDashboardTrainingIndex returnerer todayTasks)
  const dayLabel = `${today.getDate()}. ${MONTH_LABELS[today.getMonth()]?.toLowerCase()}`;
  const tasks = [
    { id: "1", icon: "local_fire_department", label: "Oppvarming", time: "08:00", done: true },
    { id: "2", icon: "fitness_center", label: "Styrke · underkropp", time: "08:15", done: true },
    { id: "3", icon: "sports_golf", label: "Putting · 2–4 meter", time: "11:00", done: false },
    { id: "4", icon: "videocam", label: "Coaching — Andreas", time: "14:30", done: false },
    { id: "5", icon: "golf_course", label: "9 hull · oppvarming", time: "16:00", done: false },
  ].map((t) => ({ ...t, date: dayLabel }));

  const role =
    tier === "PRO" || tier === "ELITE"
      ? `Pro · AK Golf Group${memberSince ? ` · siden ${memberSince}` : ""}`
      : `AK Golf${memberSince ? ` · siden ${memberSince}` : ""}`;

  return (
    <div className="flex min-h-screen items-start justify-center bg-surface px-5 py-7">
      <div
        className="w-full"
        style={{
          maxWidth: 1240,
        }}
      >
        <div
          className="rounded-[28px] p-7"
          style={{
            background: "var(--color-surface-container-lowest)",
            boxShadow:
              "0 30px 80px rgba(28,28,22,0.08), 0 2px 0 rgba(255,255,255,0.6) inset",
            border: "1px solid var(--color-outline-variant)",
          }}
        >
          <PlayerHQHero
            userName={userName}
            fairwayPct={fairwayPct}
            girPct={girPct}
            scramblingPct={scramblingPct}
            scoringAvg={scoringAvg}
            roundsCount={stats.roundsCount}
            sessionsCount={stats.sessionsCount}
            handicapTrend={handicap.trend}
          />

          <PlayerHQRowOne
            name={userName}
            role={role}
            handicap={handicap.current}
            avatarUrl={null}
            weeklyHours={weeklyHours}
            weekBars={weekBars}
            doneMinutes={todayMinutes}
            planMinutes={planMinutes}
            formPct={formPct}
            formSegments={formSegments}
          />

          <PlayerHQRowTwo
            listGroups={listGroups}
            calendar={{
              monthLabel,
              prevMonth,
              nextMonth,
              days,
              hours: ["08:00", "09:00", "10:00", "11:00", "12:00"],
              events: calendarEvents,
            }}
            tasks={{
              title: "Dagens plan",
              tasks,
              ctaLabel: "Start første økt",
              ctaHref: "/portal/treningsplan",
            }}
          />
        </div>
      </div>
    </div>
  );
}
