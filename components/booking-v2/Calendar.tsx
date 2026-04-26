"use client";

import { useState } from "react";

const DOWS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"] as const;

interface Day {
  d: number;
  muted: boolean;
  disabled: boolean;
  available: boolean;
  today: boolean;
  selected: boolean;
}

function buildAprilGrid(selectedDay: number): Day[] {
  // April 2026 starts on Wednesday → 2 muted leading from March
  const days: Day[] = [];
  [30, 31].forEach((d) => days.push({ d, muted: true, disabled: true, available: false, today: false, selected: false }));
  for (let d = 1; d <= 30; d++) {
    const dow = (d + 2) % 7; // 0 = Mon
    const isWeekend = dow === 5 || dow === 6;
    const past = d < 26;
    const today = d === 26;
    const available = !past && !isWeekend && d % 3 !== 0;
    days.push({
      d,
      muted: past,
      disabled: past,
      available,
      today,
      selected: d === selectedDay,
    });
  }
  [1, 2, 3].forEach((d) => days.push({ d, muted: true, disabled: true, available: false, today: false, selected: false }));
  return days;
}

interface CalendarProps {
  initialDay?: number;
  onSelect?: (day: number) => void;
}

export function Calendar({ initialDay = 28, onSelect }: CalendarProps) {
  const [day, setDay] = useState(initialDay);
  const grid = buildAprilGrid(day);

  return (
    <div className="cal">
      <div className="cal-head">
        <div className="cal-month">
          <em>April</em> 2026
        </div>
        <div className="cal-nav">
          <button disabled type="button">←</button>
          <button type="button">→</button>
        </div>
      </div>
      <div className="cal-grid">
        {DOWS.map((d) => (
          <div key={d} className="dow">{d}</div>
        ))}
        {grid.map((cell, i) => {
          const cls = ["day"];
          if (cell.muted) cls.push("muted");
          if (cell.today) cls.push("today");
          if (cell.selected) cls.push("selected");
          if (cell.available) cls.push("available");
          return (
            <button
              key={i}
              className={cls.join(" ")}
              disabled={cell.disabled}
              type="button"
              onClick={() => {
                if (cell.disabled) return;
                setDay(cell.d);
                onSelect?.(cell.d);
              }}
            >
              {cell.d}
              {cell.available ? <span className="dot" /> : null}
            </button>
          );
        })}
      </div>
      <div className="cal-legend">
        <span><span className="dot" /> Ledig</span>
        <span><span className="dot full" /> Fullbooket</span>
        <span>· I dag: 26. apr</span>
      </div>
    </div>
  );
}
