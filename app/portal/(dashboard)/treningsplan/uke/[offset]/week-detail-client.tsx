"use client";

import Link from "next/link";
import { addWeeks, format, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarPlus, History, MessageCircle } from "lucide-react";
import {
  DayBlock,
  PlanDetailHero,
  WeekNote,
  WeekTabs,
  pyramidLabel,
  type DayBlockData,
  type DayBlockExercise,
  type PlanDetailMeta,
  type V2EventLite,
  type WeekTab,
} from "@/components/portal/treningsplan/v2";
import { cn } from "@/lib/portal/utils/cn";

interface PeriodizationInfo {
  periodType: string;
  label: string | null;
  weekNumber: number;
  totalWeeks: number;
  focusAllocation: Record<string, number> | null;
}

interface CoachFeedback {
  text: string;
  at: string | null;
}

interface NeighborWeek {
  offset: number;
  events: V2EventLite[];
}

interface Props {
  weekOffset: number;
  planTitle: string;
  planId: string | null;
  periodization: PeriodizationInfo | null;
  events: V2EventLite[];
  neighborWeeks: { prev: NeighborWeek; next: NeighborWeek };
  coachName: string | null;
  coachFeedback: CoachFeedback | null;
}

export function WeekDetailClient({
  weekOffset,
  planTitle,
  periodization,
  events,
  neighborWeeks,
  coachName,
  coachFeedback,
}: Props) {
  const baseMonday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentMonday = addWeeks(baseMonday, weekOffset);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() + i);
    return d;
  });
  const weekNumber = format(currentMonday, "I", { locale: nb });

  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const totalMinutes = events.reduce((s, e) => s + (e.dur ?? 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1).replace(".", ",");
  const doneCount = events.filter((e) => e.done).length;
  const planProgressPct = events.length > 0
    ? Math.round((doneCount / events.length) * 100)
    : 0;

  const focusList = pickPrimaryFocus(events);

  const meta: PlanDetailMeta[] = [
    {
      label: "Periode",
      value: `${format(weekDates[0], "d. MMM", { locale: nb })} – ${format(
        weekDates[6],
        "d. MMM",
        { locale: nb },
      )}`,
    },
    {
      label: "Fokus",
      value: focusList.length > 0 ? focusList.join(" · ") : "Tilpasset",
      small: true,
    },
    { label: "Volum", value: `${totalHours}t` },
    { label: "Coach", value: coachName ?? "—", small: true },
  ];

  // Bygg week-tabs fra forrige + nåværende + neste uke.
  const tabs = buildWeekTabs(weekOffset, events, neighborWeeks);

  // Bygg dag-blokker
  const days: DayBlockData[] = weekDates.map((d, i) =>
    buildDayBlock(d, i, events, todayIso),
  );

  return (
    <div
      className={cn(
        "-m-4 -mt-4 min-h-screen p-6 lg:-m-8 lg:-mt-8 lg:p-8",
        "bg-[#102B1E] text-white",
      )}
    >
      <PlanDetailHero
        breadcrumbHref="/portal/treningsplan"
        breadcrumbLabel="Treningsplan"
        trail={`Uke ${weekNumber} · ${planTitle}`}
        title={`${planTitle} — uke ${weekNumber}`}
        lede={
          periodization
            ? `${periodization.label ?? periodization.periodType} · uke ${periodization.weekNumber} av ${periodization.totalWeeks}.`
            : undefined
        }
        meta={meta}
        progressPct={planProgressPct}
      />

      <SectionHead
        title="Uke-for-uke"
        sub={tabSubtext(tabs)}
      />
      <WeekTabs weeks={tabs} />

      <div className="space-y-3">
        {days.map((day) => (
          <DayBlock key={day.weekdayIndex} day={day} />
        ))}
      </div>

      {coachFeedback && (
        <WeekNote
          coachInitials={(coachName ?? "AK")
            .split(" ")
            .map((p) => p[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase()}
          coachName={coachName ?? "Coach"}
          weekLabel={`uke ${weekNumber}`}
          body={coachFeedback.text}
          timeAgo={coachFeedback.at ? formatTimeAgo(coachFeedback.at) : undefined}
        />
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/portal/meldinger"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--akgolf-accent,#D1F843)] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-[#0A1F18] hover:brightness-95"
        >
          <MessageCircle className="h-4 w-4" /> Spør coach om uka
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-white/85 hover:bg-white/[0.08]"
        >
          <CalendarPlus className="h-4 w-4" /> Eksporter til kalender
        </button>
        <Link
          href={`/portal/treningsplan?week=${weekOffset - 1}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-white/85 hover:bg-white/[0.08]"
        >
          <History className="h-4 w-4" /> Forrige uke
        </Link>
      </div>
    </div>
  );
}

function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-3.5 mt-5 flex items-end justify-between">
      <h2 className="m-0 text-[20px] font-extrabold tracking-[-0.025em] text-white">
        {title}
      </h2>
      {sub && (
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
          {sub}
        </div>
      )}
    </div>
  );
}

function tabSubtext(tabs: WeekTab[]): string {
  const activeIdx = tabs.findIndex((t) => t.state === "active");
  if (activeIdx === -1) return tabs.map((t) => t.num).join(" · ");
  return tabs
    .map((t, i) => {
      if (t.state === "done") return `${t.num} ✓`;
      if (i === activeIdx) return `${t.num} PÅGÅR`;
      return t.num;
    })
    .join(" · ");
}

function buildWeekTabs(
  currentOffset: number,
  currentEvents: V2EventLite[],
  neighbors: { prev: NeighborWeek; next: NeighborWeek },
): WeekTab[] {
  const baseMonday = startOfWeek(new Date(), { weekStartsOn: 1 });

  function tabFor(offset: number, events: V2EventLite[], state: WeekTab["state"]): WeekTab {
    const monday = addWeeks(baseMonday, offset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const weekNum = format(monday, "I", { locale: nb });
    const range = `${format(monday, "d.", { locale: nb })}–${format(sunday, "d. MMM", { locale: nb })}`;
    const total = events.length;
    const done = events.filter((e) => e.done).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return {
      num: `UKE ${weekNum}${state === "active" ? " · NÅ" : ""}`,
      range,
      pct,
      state,
      href: `/portal/treningsplan/uke/${offset}`,
    };
  }

  return [
    tabFor(neighbors.prev.offset, neighbors.prev.events, "done"),
    tabFor(currentOffset, currentEvents, "active"),
    tabFor(neighbors.next.offset, neighbors.next.events, "future"),
  ];
}

function buildDayBlock(
  date: Date,
  weekdayIndex: number,
  events: V2EventLite[],
  todayIso: string,
): DayBlockData {
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const dayEvents = events.filter((e) => e.date === iso);
  const isToday = iso === todayIso;

  if (dayEvents.length === 0) {
    return {
      weekdayIndex,
      dayNumber: date.getDate(),
      isToday,
      isRest: true,
      title: "Hviledag",
      meta: "AKTIV RESTITUSJON · 30 MIN GANGE",
      focus: "FYS",
      statusText: "Anbefalt",
      exercises: [],
    };
  }

  const totalDur = dayEvents.reduce((s, e) => s + e.dur, 0);
  const totalEx = dayEvents.reduce((s, e) => s + e.exercises.length, 0);
  const doneEx = dayEvents.reduce(
    (s, e) => s + (e.done ? e.exercises.length : 0),
    0,
  );
  const allDone = dayEvents.every((e) => e.done);

  const primaryEvent = dayEvents[0];
  const exercises: DayBlockExercise[] = dayEvents.flatMap((ev) =>
    ev.exercises.map((ex) => ({
      ...ex,
      durationMinutes: Math.max(
        5,
        Math.round(ev.dur / Math.max(1, ev.exercises.length)),
      ),
      done: ev.done,
      meta: buildExerciseMeta(ex.area, ex.lPhase),
    })),
  );

  const startTime = `${String(primaryEvent.startH).padStart(2, "0")}:${String(primaryEvent.startM).padStart(2, "0")}`;
  const titleParts = dayEvents.map((e) => e.title);
  const title = titleParts.join(" + ");
  const meta = `${totalDur} MIN · ${startTime}`;

  return {
    weekdayIndex,
    dayNumber: date.getDate(),
    isToday,
    isRest: false,
    title,
    meta,
    focus: primaryEvent.focus,
    statusText: `${doneEx} / ${totalEx} ferdig`,
    loggedPill: allDone,
    showStart: !allDone,
    exercises,
  };
}

function buildExerciseMeta(area: string | null | undefined, lPhase: string | null): string[] {
  const out: string[] = [];
  if (area) {
    const map: Record<string, string> = {
      TEE: "Tee",
      INN200: "Innspill 200+m",
      INN150: "Innspill 150–200m",
      INN100: "Innspill 100–150m",
      INN50: "Innspill 50–100m",
      CHIP: "Chip",
      PITCH: "Pitch",
      LOB: "Lob",
      BUNKER: "Bunker",
    };
    out.push(map[area] ?? area);
  }
  if (lPhase) {
    const stepMap: Record<string, string> = {
      "L-KROPP": "Steg 1",
      "L-ARM": "Steg 2",
      "L-KØLLE": "Steg 3",
      "L-BALL": "Steg 4",
      "L-AUTO": "Steg 5",
    };
    out.push(stepMap[lPhase] ?? lPhase);
  }
  return out;
}

function pickPrimaryFocus(events: V2EventLite[]): string[] {
  const counts = new Map<string, number>();
  for (const ev of events) {
    if (!ev.focus) continue;
    counts.set(ev.focus, (counts.get(ev.focus) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([code]) => pyramidLabel(code));
}

function formatTimeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const hours = Math.round(ms / (1000 * 60 * 60));
  if (hours < 1) return "AKKURAT NÅ";
  if (hours < 24) return `${hours}T SIDEN`;
  const days = Math.round(hours / 24);
  return `${days}D SIDEN`;
}
