"use client";


import { Icon } from "@/components/ui/icon";
/**
 * PlayerListSection — følger mc-cards-grid-mønster fra elever-wireframe.
 * Kort-grid istedenfor tabell: avatar + kategori + navn + klubb + stats + sparkline + siste økt.
 */

import { useMemo, useState } from "react";
import Link from "next/link";

import { getSkillLevelByCode } from "@/lib/portal/golf/skill-levels";
import { MonoLabel } from "@/components/portal/patterns";
import type { CoachingBoardPlayerRow } from "../actions";

interface PlayerListSectionProps {
  players: CoachingBoardPlayerRow[];
}

type FilterKey = "all" | "attention" | "stagnation" | "course-heavy" | "on-track";

function getInitials(name: string | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) {
    return <div className="h-[20px] flex items-center text-[10px] text-grey-300">—</div>;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const width = 72;
  const height = 20;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / span) * height}`)
    .join(" ");
  return (
    <svg width={width} height={height}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendIndicator({ value }: { value: number | null }) {
  if (value === null || Math.abs(value) < 0.05) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-grey-400">
        <Icon name="remove" className="h-3 w-3" />
        0.00
      </span>
    );
  }
  const positive = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs tabular-nums font-medium ${
        positive ? "text-success-text" : "text-error-text"
      }`}
    >
      {positive ? (
        <Icon name="trending_up" className="h-3 w-3" />
      ) : (
        <Icon name="trending_down" className="h-3 w-3" />
      )}
      {positive ? "+" : ""}
      {value.toFixed(2)}
    </span>
  );
}

function formatLastTraining(iso: string | null): string {
  if (!iso) return "Ingen økter";
  const daysAgo = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (daysAgo === 0) return "I dag";
  if (daysAgo === 1) return "I går";
  if (daysAgo < 7) return `${daysAgo}d siden`;
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}u siden`;
  return `${Math.floor(daysAgo / 30)}mnd siden`;
}

export function PlayerListSection({ players }: PlayerListSectionProps) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts = useMemo(() => {
    const attention = players.filter(
      (p) => p.signal && p.signal.priorityScore >= 50
    ).length;
    const stagnation = players.filter(
      (p) =>
        p.signal?.kinds.includes("stagnation") ||
        p.signal?.kinds.includes("regression")
    ).length;
    const courseHeavy = players.filter((p) =>
      p.signal?.kinds.includes("course-heavy")
    ).length;
    const onTrack = players.filter((p) =>
      p.signal?.kinds.includes("on-track")
    ).length;
    return { all: players.length, attention, stagnation, courseHeavy, onTrack };
  }, [players]);

  const filtered = useMemo(() => {
    if (filter === "all") return players;
    return players.filter((p) => {
      if (!p.signal) return false;
      if (filter === "attention") return p.signal.priorityScore >= 50;
      if (filter === "stagnation")
        return p.signal.kinds.includes("stagnation") ||
          p.signal.kinds.includes("regression");
      if (filter === "course-heavy")
        return p.signal.kinds.includes("course-heavy");
      if (filter === "on-track") return p.signal.kinds.includes("on-track");
      return true;
    });
  }, [players, filter]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <MonoLabel size="xs" uppercase className="text-primary">
          Mine spillere ({players.length})
        </MonoLabel>

        <div className="flex flex-wrap gap-1.5">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Alle"
            count={counts.all}
          />
          <FilterPill
            active={filter === "attention"}
            onClick={() => setFilter("attention")}
            label="Trenger fokus"
            count={counts.attention}
            tone="error"
          />
          <FilterPill
            active={filter === "stagnation"}
            onClick={() => setFilter("stagnation")}
            label="Stagnasjon"
            count={counts.stagnation}
            tone="warning"
          />
          <FilterPill
            active={filter === "course-heavy"}
            onClick={() => setFilter("course-heavy")}
            label="Bane-overvekt"
            count={counts.courseHeavy}
            tone="warning"
          />
          <FilterPill
            active={filter === "on-track"}
            onClick={() => setFilter("on-track")}
            label="På rett vei"
            count={counts.onTrack}
            tone="success"
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl bg-white shadow-card p-10 text-center text-sm text-grey-500">
          Ingen spillere matcher filteret.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => {
          const level = p.category ? getSkillLevelByCode(p.category) : null;
          return (
            <Link
              key={p.userId}
              href={`/admin/elever/${p.userId}`}
              className="rounded-xl bg-white shadow-card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-xl text-sm font-bold text-white shrink-0"
                  style={{ background: level?.color ?? "#005840" }}
                >
                  {getInitials(p.name)}
                </div>
                {level && (
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-[0.06em] uppercase"
                    style={{
                      background: `${level.color}15`,
                      color: level.color,
                    }}
                  >
                    {level.code}
                  </span>
                )}
              </div>

              <div className="text-sm font-semibold text-grey-900 group-hover:text-primary transition-colors">
                {p.name ?? "Uten navn"}
              </div>
              <div className="text-xs text-grey-500 mt-0.5 truncate">
                {p.email ?? "—"}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-grey-400">USI</div>
                  <div className="text-sm font-semibold tabular-nums text-grey-900">
                    {p.totalUsi !== null ? p.totalUsi.toFixed(2) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-grey-400">Trend 30d</div>
                  <TrendIndicator value={p.trend30d} />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-grey-100">
                <div className="flex items-center justify-between gap-2">
                  <Sparkline
                    data={p.usiSparkline}
                    color={
                      (p.trend30d ?? 0) >= 0
                        ? "var(--color-success)"
                        : "var(--color-error)"
                    }
                  />
                  <span className="text-[11px] text-grey-400">
                    {formatLastTraining(p.lastTrainingAt)}
                  </span>
                </div>
              </div>

              {p.biggestGap && p.biggestGap.value < 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-grey-500">
                  <Icon name="error" className="h-3 w-3 text-warning-text" />
                  <span>
                    Gap i <span className="font-medium text-grey-700">{p.biggestGap.label}</span>
                    <span className="ml-1 tabular-nums">
                      {p.biggestGap.value.toFixed(2)} SG
                    </span>
                  </span>
                </div>
              )}

              {p.signal && p.signal.priorityScore >= 20 && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-warning-light px-2 py-0.5 text-[11px] font-medium text-warning-text">
                  {p.signal.kinds.length} varsel
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  tone = "default",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  tone?: "default" | "success" | "warning" | "error";
}) {
  const toneBg =
    tone === "success"
      ? "text-success-text"
      : tone === "warning"
        ? "text-warning-text"
        : tone === "error"
          ? "text-error-text"
          : "text-grey-500";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : `bg-white border border-grey-200 hover:bg-grey-50 ${toneBg}`
      }`}
    >
      {label}
      <span
        className={`tabular-nums text-[11px] ${
          active ? "opacity-75" : "opacity-60"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
