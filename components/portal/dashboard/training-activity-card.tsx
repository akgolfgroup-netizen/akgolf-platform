"use client";

import { useState } from "react";
import { PremiumCard } from "./premium-card";

interface TrainingActivityCardProps {
  weeklyHours: number[];
  delay?: number;
}

const DAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];
const BAR_HEIGHT = 90;

const CHIPS = ["Alle", "Putting", "Short game", "Long game"];

const CATEGORIES = [
  { label: "Putting", pct: 35, color: "var(--color-primary)" },
  { label: "Short game", pct: 25, color: "var(--color-warning)" },
  { label: "Long game", pct: 20, color: "var(--color-green-bright)" },
  { label: "Spill", pct: 20, color: "var(--color-portal-muted)" },
];

// Demo data for when real data is 0
const DEMO_HOURS = [1.5, 0.8, 2.0, 0, 1.2, 2.5, 0.2];

function DonutChart({ size = 110 }: { size?: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-[0_0_6px_rgba(0,88,64,0.15)]"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="9"
        />
        {CATEGORIES.map((cat) => {
          const dash = (cat.pct / 100) * circ;
          const gap = circ - dash;
          const el = (
            <circle
              key={cat.label}
              cx={size / 2} cy={size / 2} r={r}
              fill="none" stroke={cat.color} strokeWidth="9"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[26px] font-extrabold tracking-[-0.04em] text-[var(--color-portal-text)]">
          5
        </span>
        <span className="text-[9px] uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
          Okter
        </span>
      </div>
    </div>
  );
}

export function TrainingActivityCard({
  weeklyHours,
  delay = 0,
}: TrainingActivityCardProps) {
  const [activeChip, setActiveChip] = useState(0);

  // Use demo data if all hours are 0
  const hasData = weeklyHours.some((h) => h > 0);
  const hours = hasData ? weeklyHours : DEMO_HOURS;
  const maxH = Math.max(...hours, 1);
  const totalHours = hours.reduce((a, b) => a + b, 0);

  return (
    <PremiumCard delay={delay} className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-portal-text)]">
            Treningsoversikt
          </p>
          <p className="text-[11px] text-[var(--color-portal-muted)]">Siste 7 dager</p>
        </div>
        <span className="rounded-md border border-primary/15 bg-primary/[0.08] px-2.5 py-1 text-[11px] font-medium text-primary">
          Aktiv uke
        </span>
      </div>

      {/* Chip tabs */}
      <div className="mb-4 flex gap-[6px]">
        {CHIPS.map((chip, i) => (
          <button
            key={chip}
            onClick={() => setActiveChip(i)}
            className={`rounded-[20px] px-3 py-[5px] text-[12px] font-medium transition-all duration-200 ${
              activeChip === i
                ? "bg-primary text-white shadow-[0_2px_8px_rgba(0,88,64,0.25)]"
                : "border border-[var(--color-portal-border)] bg-transparent text-[var(--color-portal-muted)] hover:bg-[var(--color-portal-hover)] hover:text-[var(--color-portal-secondary)]"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Donut + legend */}
      <div className="mb-5 flex items-center gap-5">
        <DonutChart />
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="flex items-center gap-2 text-xs text-[var(--color-portal-secondary)]">
              <span
                className="h-[6px] w-[6px] shrink-0 rounded-full"
                style={{ background: cat.color }}
              />
              {cat.label}
              <strong className="ml-auto font-semibold text-[var(--color-portal-text)]">
                {cat.pct}%
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Activity bars */}
      <p className="mb-1 text-[11px] text-[var(--color-portal-muted)]">
        Aktivitet denne uken
      </p>
      <div className="flex items-end gap-[5px]" style={{ height: BAR_HEIGHT }}>
        {hours.map((h, i) => {
          const heightPx = h > 0 ? Math.max((h / maxH) * BAR_HEIGHT, 4) : 4;
          const isTop = h === maxH && h > 0;
          const isSunday = i === 6;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className="w-full min-h-[2px] rounded-t-[4px]"
                style={{
                  height: heightPx,
                  background:
                    h > 0
                      ? isTop
                        ? "linear-gradient(180deg, var(--color-primary-alt), var(--color-primary))"
                        : "var(--color-primary)"
                      : "var(--color-portal-hover)",
                  opacity: h > 0 ? (isTop ? 1 : isSunday ? 0.3 : 0.5 + (h / maxH) * 0.3) : 1,
                  boxShadow: isTop ? "0 0 10px rgba(0,88,64,0.2)" : "none",
                  border: h <= 0 ? "1px dashed var(--color-portal-muted)" : "none",
                  borderRadius: h <= 0 ? "4px" : undefined,
                }}
              />
              <span
                className="text-[10px]"
                style={{
                  color: isSunday
                    ? "var(--color-portal-secondary)"
                    : "var(--color-portal-muted)",
                }}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mini stats */}
      <div className="mt-4 flex justify-between border-t border-[var(--color-portal-border-subtle)] pt-3.5">
        <MiniStat value={`${totalHours.toFixed(1)}t`} label="Total tid" />
        <MiniStat value="420" label="Baller" />
        <MiniStat value="18" label="Hull" />
      </div>
    </PremiumCard>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <span className="block text-base font-bold tracking-[-0.02em] text-[var(--color-portal-text)] tabular-nums">
        {value}
      </span>
      <span className="text-[10px] text-[var(--color-portal-muted)]">{label}</span>
    </div>
  );
}
