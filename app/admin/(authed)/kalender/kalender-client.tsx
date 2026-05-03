"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  addDays,
  endOfWeek,
  format,
  getISOWeek,
  startOfWeek,
} from "date-fns";
import { nb } from "date-fns/locale";
import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Printer,
} from "lucide-react";
import type { CalendarBooking, Instructor } from "./actions";
import { getBookingsForPeriod } from "./actions";
import {
  buildCoachMap,
  buildLegend,
  computeWeekStats,
} from "./kalender-week-data";
import { KalenderWeekGrid } from "@/components/admin/kalender/kalender-week-grid";
import GoogleCalendarPicker from "@/components/admin/kalender/google-calendar-picker";

type Props = {
  initialBookings: CalendarBooking[];
  instructors: Instructor[];
  initialWeekStart: string;
};

const VIEWS = [
  { id: "day", label: "DAG" },
  { id: "week", label: "UKE" },
  { id: "month", label: "MÅNED" },
  { id: "agenda", label: "AGENDA" },
] as const;

type View = (typeof VIEWS)[number]["id"];

export default function KalenderClient({
  initialBookings,
  initialWeekStart,
}: Props) {
  const [weekStart, setWeekStart] = useState<Date>(new Date(initialWeekStart));
  const [bookings, setBookings] = useState<CalendarBooking[]>(initialBookings);
  const [view, setView] = useState<View>("week");
  const [, startTransition] = useTransition();
  const [hiddenCoaches, setHiddenCoaches] = useState<Set<string>>(new Set());

  const now = new Date();
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekNum = getISOWeek(weekStart);
  const weekRange = `${format(weekStart, "d. MMM", { locale: nb })} – ${format(weekEnd, "d. MMM", { locale: nb })}`;

  const coachMap = useMemo(() => buildCoachMap(bookings), [bookings]);
  const legend = useMemo(() => buildLegend(bookings, coachMap), [bookings, coachMap]);
  const stats = useMemo(() => computeWeekStats(bookings), [bookings]);

  const visibleBookings = useMemo(
    () => bookings.filter((b) => !hiddenCoaches.has(b.instructor.id)),
    [bookings, hiddenCoaches],
  );

  function navigate(direction: "prev" | "today" | "next") {
    const newStart =
      direction === "today"
        ? startOfWeek(new Date(), { weekStartsOn: 1 })
        : addDays(weekStart, direction === "prev" ? -7 : 7);
    setWeekStart(newStart);
    const newEnd = endOfWeek(newStart, { weekStartsOn: 1 });
    startTransition(async () => {
      const data = await getBookingsForPeriod(
        newStart.toISOString(),
        newEnd.toISOString(),
      );
      setBookings(data);
    });
  }

  function toggleCoach(id: string) {
    setHiddenCoaches((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="px-7 py-6 text-white" style={{ background: "#102B1E" }}>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "#D1F843" }}
          >
            Plan · Kalender
          </div>
          <h1
            className="mt-2 text-[28px] font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Uke {weekNum} · {weekRange}
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-white/60">
            Drag-drop for å flytte. Fargene er per coach. Klikk en blokk for handlinger.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <GhostBtn onClick={() => setHiddenCoaches(new Set())}>
            <Filter className="h-3.5 w-3.5" strokeWidth={1.8} /> Vis alle coacher
          </GhostBtn>
          <GhostBtn onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" strokeWidth={1.8} /> Print
          </GhostBtn>
          <Link
            href="/admin/bookinger/ny"
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition hover:opacity-90"
            style={{ background: "#D1F843", color: "#0A1F18" }}
          >
            <CalendarPlus className="h-3.5 w-3.5" strokeWidth={2} /> Ny booking
          </Link>
        </div>
      </div>

      {/* Google Calendar-synk (lys-tema-wrapper for å matche pickerens design-tokens) */}
      <div className="mb-5 rounded-xl bg-surface text-on-surface">
        <GoogleCalendarPicker />
      </div>

      {/* Toolbar */}
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <div
          className="inline-flex rounded-lg border bg-white/[0.04] p-0.5"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <button
            type="button"
            onClick={() => navigate("prev")}
            className="grid place-items-center rounded-md p-1.5 text-white hover:bg-white/[0.06]"
            title="Forrige"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => navigate("today")}
            className="rounded-md px-2.5 py-1 font-mono text-[11px] tracking-wider text-white hover:bg-white/[0.06]"
          >
            I DAG
          </button>
          <button
            type="button"
            onClick={() => navigate("next")}
            className="grid place-items-center rounded-md p-1.5 text-white hover:bg-white/[0.06]"
            title="Neste"
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>

        <div
          className="text-[18px] font-semibold tracking-tight text-white"
          style={{ fontFamily: "var(--font-inter-tight)" }}
        >
          Uke {weekNum} · {weekStart.getFullYear()}
          <small className="mt-0.5 block font-mono text-[10px] font-normal tracking-wider text-white/50">
            {format(weekStart, "dd MMM", { locale: nb }).toUpperCase()} –{" "}
            {format(weekEnd, "dd MMM", { locale: nb }).toUpperCase()}
          </small>
        </div>

        <div
          className="inline-flex rounded-lg border bg-white/[0.04] p-0.5"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={
                "rounded-md px-3 py-1.5 font-mono text-[12px] tracking-wider transition " +
                (view === v.id
                  ? "text-[#D1F843]"
                  : "text-white/60 hover:bg-white/[0.06]")
              }
              style={view === v.id ? { background: "rgba(209,248,67,0.14)" } : undefined}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Coach legend */}
        <div className="ml-auto flex flex-wrap items-center gap-2.5">
          {legend.map((c) => {
            const hidden = hiddenCoaches.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCoach(c.id)}
                className={
                  "inline-flex items-center gap-1.5 rounded-full border bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-white/85 transition " +
                  (hidden ? "opacity-40" : "")
                }
                style={{ borderColor: "rgba(255,255,255,0.10)" }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: c.key === "coach-other" ? "#A5B2AD" : undefined }}
                />
                {c.name}
                <span className="font-mono text-[10px] text-white/50">{c.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {view === "week" && (
        <KalenderWeekGrid
          weekStart={weekStart}
          bookings={visibleBookings}
          coachMap={coachMap}
          now={now}
        />
      )}
      {view !== "week" && (
        <div
          className="rounded-[14px] border bg-white/[0.04] px-6 py-12 text-center text-[13px] text-white/60"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          {view.toUpperCase()}-visning kommer snart. Bruk UKE-visning for nå.
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-3.5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Total økter" value={String(stats.total)} />
        <Stat label="Utnyttelse" value={`${stats.utilization}%`} tone="accent" />
        <Stat label="Pending" value={String(stats.pending)} tone="warning" />
        <Stat label="Ledige timer" value={String(stats.freeHours)} />
        <Stat
          label="Inntekt uke"
          value={`${stats.revenueKr.toLocaleString("nb-NO")}`}
          unit="kr"
          tone="success"
        />
      </div>
    </div>
  );
}

function GhostBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium text-white/85 transition hover:bg-white/[0.06]"
      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)" }}
    >
      {children}
    </button>
  );
}

function Stat({
  label,
  value,
  unit,
  tone = "default",
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: "default" | "accent" | "warning" | "success";
}) {
  const color =
    tone === "accent"
      ? "#D1F843"
      : tone === "warning"
        ? "#E8B967"
        : tone === "success"
          ? "#6FCBA1"
          : "#fff";
  return (
    <div
      className="rounded-[10px] border bg-white/[0.04] px-3.5 py-3"
      style={{ borderColor: "rgba(255,255,255,0.10)" }}
    >
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
        {label}
      </div>
      <div className="mt-1 text-[22px] font-bold tracking-tight tabular-nums" style={{ color }}>
        {value}
        {unit && <span className="ml-1 text-[11px] font-medium text-white/50">{unit}</span>}
      </div>
    </div>
  );
}
