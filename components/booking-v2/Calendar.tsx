"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const DOWS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"] as const;
const MONTHS_NB = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];

interface Day {
  iso: string | null; // YYYY-MM-DD eller null for muted utfyll
  d: number;
  muted: boolean;
  disabled: boolean;
  today: boolean;
  selected: boolean;
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildMonthGrid({
  year,
  month,
  today,
  maxDate,
  selectedIso,
}: {
  year: number;
  month: number; // 0-indexed
  today: Date;
  maxDate: Date;
  selectedIso: string | null;
}): Day[] {
  const todayStart = startOfDay(today);
  const maxStart = startOfDay(maxDate);

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const firstDow = (firstOfMonth.getDay() + 6) % 7; // 0 = Mon
  const lastDow = (lastOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastOfMonth.getDate();

  const days: Day[] = [];

  // Utfyll fra forrige måned
  if (firstDow > 0) {
    const prevMonthLast = new Date(year, month, 0).getDate();
    for (let d = prevMonthLast - firstDow + 1; d <= prevMonthLast; d++) {
      days.push({
        iso: null,
        d,
        muted: true,
        disabled: true,
        today: false,
        selected: false,
      });
    }
  }

  // Dager i denne måneden
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const past = date < todayStart;
    const futureBeyondMax = date > maxStart;
    const disabled = past || futureBeyondMax;
    const iso = isoDate(date);
    days.push({
      iso,
      d,
      muted: disabled,
      disabled,
      today: iso === isoDate(todayStart),
      selected: !!selectedIso && iso === selectedIso,
    });
  }

  // Utfyll til neste måned
  const trailingNeeded = lastDow === 6 ? 0 : 6 - lastDow;
  for (let d = 1; d <= trailingNeeded; d++) {
    days.push({
      iso: null,
      d,
      muted: true,
      disabled: true,
      today: false,
      selected: false,
    });
  }

  return days;
}

interface CalendarProps {
  /** YYYY-MM-DD (fra URL) — markerer valgt dag og åpner i riktig måned. */
  selectedDate?: string;
  /** Antall dager fram fra i dag som er bookbart. */
  maxAdvanceDays: number;
}

export function Calendar({ selectedDate, maxAdvanceDays }: CalendarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = startOfDay(new Date());
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxAdvanceDays);

  // Vis valgt måned, eller måneden valgt dato ligger i, ellers nåværende måned.
  // Parser ISO som lokal-dato (ikke UTC) — `new Date("2026-04-28")` ville gitt
  // UTC-midnatt og skiftet måned for brukere vest for UTC.
  const initialDate = (() => {
    if (!selectedDate) return today;
    const [y, m, d] = selectedDate.split("-").map(Number);
    if (!y || !m || !d) return today;
    return new Date(y, m - 1, d);
  })();
  const [view, setView] = useState({
    year: initialDate.getFullYear(),
    month: initialDate.getMonth(),
  });

  const grid = buildMonthGrid({
    year: view.year,
    month: view.month,
    today,
    maxDate,
    selectedIso: selectedDate ?? null,
  });

  // Begrens måned-navigasjon til vinduet.
  const minMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonthStart = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  const currentMonthStart = new Date(view.year, view.month, 1);
  const canGoBack = currentMonthStart > minMonthStart;
  const canGoForward = currentMonthStart < maxMonthStart;

  function shiftMonth(delta: number) {
    setView((v) => {
      const next = new Date(v.year, v.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  function selectDate(iso: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", iso);
    // Når dato endres, fjern eventuelt valgt tid — slots-listen er ny.
    params.delete("time");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const todayIso = isoDate(today);

  return (
    <div className="cal">
      <div className="cal-head">
        <div className="cal-month">
          <em>{MONTHS_NB[view.month][0].toUpperCase() + MONTHS_NB[view.month].slice(1)}</em>{" "}
          {view.year}
        </div>
        <div className="cal-nav">
          <button
            disabled={!canGoBack}
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Forrige måned"
          >
            ←
          </button>
          <button
            disabled={!canGoForward}
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Neste måned"
          >
            →
          </button>
        </div>
      </div>
      <div className="cal-grid">
        {DOWS.map((d) => (
          <div key={d} className="dow">
            {d}
          </div>
        ))}
        {grid.map((cell, i) => {
          const cls = ["day"];
          if (cell.muted) cls.push("muted");
          if (cell.today) cls.push("today");
          if (cell.selected) cls.push("selected");
          return (
            <button
              key={i}
              className={cls.join(" ")}
              disabled={cell.disabled}
              type="button"
              onClick={() => {
                if (cell.disabled || !cell.iso) return;
                selectDate(cell.iso);
              }}
            >
              {cell.d}
            </button>
          );
        })}
      </div>
      <div className="cal-legend">
        <span>Velg dag for å se ledige tider</span>
        <span>· I dag: {todayIso.slice(8, 10)}.{" "}{MONTHS_NB[today.getMonth()].slice(0, 3)}</span>
      </div>
    </div>
  );
}
