"use client";

import { useMemo, useState } from "react";
import { format, getISOWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { FocusStrip } from "./focus-strip";
import { CalToolbar, type ViewMode } from "./cal-toolbar";
import { MonthGrid } from "./month-grid";
import { RightSidebar } from "./right-sidebar";
import {
  eventToLevel,
  durationMinutes,
  formatTime,
  type ExerciseTemplate,
  type SessionBlock,
  type SessionLevel,
  type WeekTemplate,
} from "./types";
import type { CalendarEvent } from "@/app/portal/(dashboard)/kalender/actions";

interface KalenderClientV2Props {
  events: CalendarEvent[];
  initialMonth: Date;
}

const DEFAULT_EXERCISES: ExerciseTemplate[] = [
  {
    id: "wedges",
    title: "Wedges 50–100m kontroll",
    level: "slag",
    durationLabel: "60–75 min",
    location: "Range",
    detail: "30 baller",
  },
  {
    id: "driver-tempo",
    title: "Driver tempo · Aim Point",
    level: "tek",
    durationLabel: "45 min",
    location: "Range",
    detail: "20 baller",
  },
  {
    id: "hofte-mobility",
    title: "Hofte-mobility morgen-flow",
    level: "fys",
    durationLabel: "20 min",
    location: "Hjemme",
    detail: "8 øvelser",
  },
  {
    id: "worst-ball",
    title: "Worst-ball · 9 hull",
    level: "spill",
    durationLabel: "2t",
    location: "9-hulls bane",
    detail: "1 spiller",
  },
  {
    id: "pre-turn",
    title: "Pre-turnerings rutine",
    level: "turn",
    durationLabel: "60 min",
    location: "Bane + range",
    detail: "Mental",
  },
];

const DEFAULT_TEMPLATES: WeekTemplate[] = [
  {
    id: "std",
    title: "Standarduke · sesong",
    meta: "5 ØKTER · 8T 30 MIN · SIST BRUKT 10. APR",
    tags: ["fys", "tek", "slag", "spill"],
  },
  {
    id: "pre-tour",
    title: "Pre-turneringsuke",
    meta: "4 ØKTER · 5T · TAPER + REST",
    tags: ["tek", "turn", "spill"],
  },
  {
    id: "rest",
    title: "Restitusjonsuke",
    meta: "2 ØKTER · 1T 30 MIN · KUN MOBILITY",
    tags: ["fys"],
  },
  {
    id: "build-winter",
    title: "Bygg-uke · vinter",
    meta: "6 ØKTER · 9T · STYRKE-FOKUS",
    tags: ["fys", "tek"],
  },
];

export function KalenderClientV2({ events, initialMonth }: KalenderClientV2Props) {
  const [monthDate, setMonthDate] = useState(initialMonth);
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  const sessions: SessionBlock[] = useMemo(
    () =>
      events.map((ev) => {
        const dur = durationMinutes(ev.startDate, ev.endDate);
        const time = ev.allDay ? "Hele dagen" : formatTime(ev.startDate);
        const level = eventToLevel(ev);
        const meta = ev.allDay
          ? `Hele dagen · ${level.toUpperCase()}`
          : dur
            ? `${time} · ${dur} MIN · ${level.toUpperCase()}`
            : `${time} · ${level.toUpperCase()}`;
        return {
          id: ev.id,
          title: ev.title,
          meta,
          level,
          date: ev.startDate,
        };
      }),
    [events],
  );

  // Pyramide-distribusjon basert på faktiske events
  const pyramidDistribution = useMemo<Record<SessionLevel, number>>(() => {
    const counts: Record<SessionLevel, number> = {
      fys: 0,
      tek: 0,
      slag: 0,
      spill: 0,
      turn: 0,
    };
    for (const s of sessions) {
      if (s.level === "ai-suggest") continue;
      counts[s.level as SessionLevel]++;
    }
    const total = Object.values(counts).reduce((sum, v) => sum + v, 0);
    if (total === 0) {
      return { fys: 22, tek: 28, slag: 20, spill: 18, turn: 12 };
    }
    return {
      fys: Math.round((counts.fys / total) * 100),
      tek: Math.round((counts.tek / total) * 100),
      slag: Math.round((counts.slag / total) * 100),
      spill: Math.round((counts.spill / total) * 100),
      turn: Math.round((counts.turn / total) * 100),
    };
  }, [sessions]);

  const weekNumber = getISOWeek(new Date());
  const monthLabel = format(monthDate, "LLLL", { locale: nb });
  const monthLabelTitle = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const onPrev = () => {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() - 1);
    setMonthDate(d);
  };
  const onNext = () => {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() + 1);
    setMonthDate(d);
  };
  const onToday = () => setMonthDate(new Date());

  return (
    <div
      className="flex gap-4 -mx-4 lg:-mx-8 -mt-4 lg:-mt-8 min-h-screen"
      style={{
        background: "#0A1F18",
        padding: "22px 32px",
        fontFamily: "var(--font-inter)",
      }}
    >
      <main className="flex-1 min-w-0">
        <FocusStrip
          weekNumber={weekNumber}
          focusText="Bygg avstandskontroll på 50–100m wedges. Tre hardøkter på range, én testrunde."
          fromMeta="FRA ANDERS · MAN 09:14"
        />
        <CalToolbar
          monthLabel={monthLabelTitle}
          year={monthDate.getFullYear()}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onPrev={onPrev}
          onNext={onNext}
          onToday={onToday}
        />
        <MonthGrid monthDate={monthDate} sessions={sessions} />
      </main>

      <RightSidebar
        exercises={DEFAULT_EXERCISES}
        templates={DEFAULT_TEMPLATES}
        pyramidDistribution={pyramidDistribution}
        weekBias="Du har for mye TEK denne uka og mangler SPILL. Anders foreslår å bytte én range-økt mot en 9-hulls runde."
        aiSuggestion={{
          dateLabel: "fredag 10. apr",
          reason:
            "Wedges 50–100m matcher ukens fokus — du har ikke loggført denne typen siden 2. apr. Ledig slot kl 14:00 på Bærum range.",
        }}
      />
    </div>
  );
}
