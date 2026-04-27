"use client";

/**
 * Treningsplan-oversikt (Brand Guide V2.0 — dark cockpit)
 *
 * Spillervennlig lese-modus av treningsplanen. Matcher
 * `public/design-reference/handoff-2026-04-27/screens/a5-treningsplan.html`.
 *
 * All editor-funksjonalitet (drag/drop, plan-creator, modaler) ligger
 * fortsatt i `treningsplan-planner.tsx` og åpnes via `?modus=editor`.
 */

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { addWeeks, format, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight, Plus, Settings2 } from "lucide-react";
import {
  ExerciseLibrary,
  MiniStats,
  SectionHeading,
  TodayCard,
  WeekStrip,
  type LibraryItem,
  type MiniStat,
  type V2EventLite,
} from "@/components/portal/treningsplan/v2";
import { areaToPillKind } from "@/components/portal/treningsplan/v2";
import { cn } from "@/lib/portal/utils/cn";

interface OverviewProps {
  weekOffset: number;
  hasPlan: boolean;
  events: V2EventLite[];
  /** Sum minutter denne uka */
  totalMinutes: number;
  /** Måltimer per uke (volum-mål) */
  weeklyVolumeTargetMinutes: number;
  /** Antall økter denne uka */
  sessionCount: number;
  /** Måltall økter per uke */
  weeklySessionTarget: number;
  /** Avhukede økter / total */
  doneCount: number;
  /** Coach-display-navn */
  coachName: string | null;
  /** Bibliotek-elementer (fra eksisterende exercises) */
  library: LibraryItem[];
}

export function TreningsplanOverview({
  weekOffset,
  hasPlan,
  events,
  totalMinutes,
  weeklyVolumeTargetMinutes,
  sessionCount,
  weeklySessionTarget,
  doneCount,
  coachName,
  library,
}: OverviewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const baseMonday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentMonday = addWeeks(baseMonday, weekOffset);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() + i);
    return d;
  });
  const weekNumber = format(currentMonday, "I", { locale: nb });
  const weekRange = `${format(weekDates[0], "d. MMM", { locale: nb }).toUpperCase()} – ${format(
    weekDates[6],
    "d. MMM",
    { locale: nb },
  ).toUpperCase()}`;

  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const todayEvent = events.find((e) => e.date === todayIso) ?? null;

  const totalHours = (totalMinutes / 60).toFixed(1).replace(".", ",");
  const targetHours = Math.round(weeklyVolumeTargetMinutes / 60);
  const volumePct = weeklyVolumeTargetMinutes > 0
    ? Math.round((totalMinutes / weeklyVolumeTargetMinutes) * 100)
    : 0;
  const sessionPct = weeklySessionTarget > 0
    ? Math.round((sessionCount / weeklySessionTarget) * 100)
    : 0;
  const adherencePct = sessionCount > 0 ? Math.round((doneCount / sessionCount) * 100) : 0;

  const stats: MiniStat[] = [
    {
      label: "Volum denne uka",
      value: `${totalHours}t`,
      suffix: `/ ${targetHours}t`,
      pct: volumePct,
    },
    {
      label: "Økter",
      value: `${sessionCount}`,
      suffix: `/ ${weeklySessionTarget} plan`,
      pct: sessionPct,
      barColor: "#6FCBA1",
    },
    {
      label: "Fullført",
      value: `${adherencePct}%`,
      suffix: `${doneCount}/${sessionCount}`,
      pct: adherencePct,
    },
    {
      label: "Plan-status",
      value: hasPlan ? "Aktiv" : "—",
      suffix: hasPlan ? "" : "Ingen plan",
      pct: hasPlan ? 100 : 0,
      barColor: "#E8B967",
    },
  ];

  function changeWeek(delta: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("week", String(weekOffset + delta));
    router.push(`/portal/treningsplan?${params.toString()}`);
  }
  function jumpToToday() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("week");
    const qs = params.toString();
    router.push(`/portal/treningsplan${qs ? `?${qs}` : ""}`);
  }

  function todayCardData() {
    if (!todayEvent) return null;
    const exercises = todayEvent.exercises.map((ex) => {
      const meta = [
        ex.area && areaLabel(ex.area),
        ex.lPhase,
      ]
        .filter(Boolean)
        .join(" · ");
      const perExerciseDur = todayEvent.exercises.length > 0
        ? Math.round(todayEvent.dur / todayEvent.exercises.length)
        : todayEvent.dur;
      return {
        id: ex.id,
        name: ex.name,
        meta: meta || undefined,
        durationMinutes: perExerciseDur,
        done: false,
      };
    });
    return { event: todayEvent, exercises };
  }

  const tdc = todayCardData();
  const detailHref = `/portal/treningsplan/uke/${weekOffset}`;

  return (
    <div
      className={cn(
        "-m-4 -mt-4 min-h-screen p-6 lg:-m-8 lg:-mt-8 lg:p-8",
        "bg-[#102B1E] text-white",
      )}
    >
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--akgolf-accent,#D1F843)]">
            Spill · Treningsplan
          </div>
          <h1 className="m-0 mt-1 text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
            Uke {weekNumber}
          </h1>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white/55">
            {weekRange}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => changeWeek(-1)}
            aria-label="Forrige uke"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-white/85 hover:bg-white/[0.08]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={jumpToToday}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-white/85 hover:bg-white/[0.08]"
          >
            <Calendar className="h-4 w-4" /> I dag
          </button>
          <button
            type="button"
            onClick={() => changeWeek(1)}
            aria-label="Neste uke"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-white/85 hover:bg-white/[0.08]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <Link
            href="/portal/treningsplan?modus=editor"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-white/85 hover:bg-white/[0.08]"
          >
            <Settings2 className="h-4 w-4" /> Editor
          </Link>
        </div>
      </header>

      <WeekStrip
        weekDates={weekDates}
        events={events}
        weekOffset={weekOffset}
        todayIso={todayIso}
      />

      <MiniStats stats={stats} />

      {tdc ? (
        <>
          <SectionHeading
            title="Dagens økt"
            sub={`${format(today, "EEE d. MMM", { locale: nb }).toUpperCase()} · ${tdc.event.dur} MIN`}
          />
          <TodayCard
            event={tdc.event}
            exercises={tdc.exercises}
            coachName={coachName ?? undefined}
            weekDetailHref={detailHref}
          />
        </>
      ) : (
        <NoTodayCard hasPlan={hasPlan} />
      )}

      <SectionHeading
        title="Øvelses-bibliotek"
        sub={
          coachName
            ? `TILDELT AV ${coachName.toUpperCase()} · ${library.length} ØVELSER`
            : `${library.length} ØVELSER`
        }
      />
      {library.length > 0 ? (
        <ExerciseLibrary items={library} />
      ) : (
        <div className="rounded-2xl border border-[var(--akgolf-line-dark,#1a4a3a)] bg-[var(--akgolf-card-dark,#0D2E23)] p-8 text-center text-[14px] text-white/60">
          Ingen øvelser tildelt enda. Coachen din legger til øvelser etter hvert.
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href={detailHref}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-white/85 hover:bg-white/[0.08]"
        >
          <Plus className="h-4 w-4" /> Se hele uka i detalj
        </Link>
      </div>
    </div>
  );
}

function NoTodayCard({ hasPlan }: { hasPlan: boolean }) {
  return (
    <div className="my-5 rounded-2xl border border-[var(--akgolf-line-dark,#1a4a3a)] bg-[var(--akgolf-card-dark,#0D2E23)] p-7 text-center">
      <p className="text-[14px] text-white/70">
        {hasPlan
          ? "Ingen økt planlagt i dag — bra mulighet for hvile eller spontan trening."
          : "Du har ingen aktiv treningsplan. Be coach om å sette opp en — eller bygg selv via editor."}
      </p>
    </div>
  );
}

function areaLabel(code: string): string {
  // Kort, lesbar etikett for area-kode i metadata-felt.
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
    "PUTT0-3": "Putt 0–3 ft",
    "PUTT3-5": "Putt 3–5 ft",
    "PUTT5-10": "Putt 5–10 ft",
    "PUTT10-15": "Putt 10–15 ft",
    "PUTT15-25": "Putt 15–25 ft",
    "PUTT25-40": "Putt 25–40 ft",
    "PUTT40+": "Putt 40+ ft",
  };
  return map[code] ?? code;
}

// Forhindre lint-warning hvis areaToPillKind importeres uten bruk
void areaToPillKind;
