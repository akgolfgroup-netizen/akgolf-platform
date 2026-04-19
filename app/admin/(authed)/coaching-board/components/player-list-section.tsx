"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getSkillLevelByCode } from "@/lib/portal/golf/skill-levels";
import type { CoachingBoardPlayerRow } from "../actions";

interface PlayerListSectionProps {
  players: CoachingBoardPlayerRow[];
}

type FilterKey = "all" | "attention" | "stagnation" | "course-heavy" | "on-track";

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return <span className="text-xs text-[var(--hg-text-muted)]">—</span>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const width = 60;
  const height = 18;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / span) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-primary)"
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
      <span className="inline-flex items-center gap-1 text-xs text-[var(--hg-text-muted)]">
        <Minus className="h-3 w-3" />
        0.00
      </span>
    );
  }
  const positive = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs tabular-nums font-medium ${
        positive ? "text-data-sage" : "text-error-text"
      }`}
    >
      {positive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {positive ? "+" : ""}
      {value.toFixed(2)}
    </span>
  );
}

function MiniDistribution({
  dist,
}: {
  dist: CoachingBoardPlayerRow["distributionPct"];
}) {
  if (!dist) return <span className="text-xs text-[var(--hg-text-muted)]">—</span>;
  const segments = [
    { value: dist.onCourse, color: "var(--color-warning)" },
    { value: dist.skillTechnical, color: "var(--color-primary)" },
    { value: dist.shortGame, color: "var(--color-primary-alt)" },
    { value: dist.putting, color: "var(--color-accent-cta)" },
    { value: dist.physicalMental, color: "var(--color-ai)" },
  ];
  return (
    <div className="flex h-2 w-24 rounded-full overflow-hidden bg-[var(--hg-surface-raised)]">
      {segments.map((s, i) => (
        <div key={i} style={{ width: `${s.value * 100}%`, background: s.color }} />
      ))}
    </div>
  );
}

function formatLastTraining(iso: string | null): string {
  if (!iso) return "—";
  const daysAgo = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (daysAgo === 0) return "I dag";
  if (daysAgo === 1) return "I går";
  if (daysAgo < 7) return `${daysAgo}d siden`;
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}u siden`;
  return `${Math.floor(daysAgo / 30)}mnd siden`;
}

export function PlayerListSection({ players }: PlayerListSectionProps) {
  const [filter, setFilter] = useState<FilterKey>("all");

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--hg-text)] tracking-[-0.01em]">
          Mine spillere ({players.length})
        </h2>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-[var(--hg-surface-raised)] p-[3px]">
          {(
            [
              { id: "all", label: "Alle" },
              { id: "attention", label: "Trenger fokus" },
              { id: "stagnation", label: "Stagnasjon" },
              { id: "course-heavy", label: "Bane-overvekt" },
              { id: "on-track", label: "På rett vei" },
            ] as const
          ).map((o) => (
            <button
              key={o.id}
              onClick={() => setFilter(o.id)}
              className={`rounded-[7px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                filter === o.id
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--hg-text-muted)] hover:text-[var(--hg-text-secondary)]"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--hg-border-subtle)] bg-[var(--hg-surface)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--hg-border-subtle)]">
              <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Spiller
              </th>
              <th className="px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Kat.
              </th>
              <th className="px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                USI
              </th>
              <th className="px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Trend 30d
              </th>
              <th className="px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Sparkline
              </th>
              <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Største gap
              </th>
              <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Fordeling 30d
              </th>
              <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Siste økt
              </th>
              <th className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--hg-text-muted)]">
                Varsler
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-sm text-[var(--hg-text-muted)]"
                >
                  Ingen spillere matcher filteret.
                </td>
              </tr>
            )}
            {filtered.map((p) => {
              const level = p.category ? getSkillLevelByCode(p.category) : null;
              return (
                <tr
                  key={p.userId}
                  className="border-b border-[var(--hg-border-subtle)] last:border-0 hover:bg-[var(--hg-surface-raised)] transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/admin/elever/${p.userId}`}
                      className="text-sm font-medium text-[var(--hg-text)] hover:text-[var(--color-primary)]"
                    >
                      {p.name ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {level ? (
                      <span
                        className="text-sm font-bold tabular-nums"
                        style={{ color: level.color }}
                      >
                        {level.code}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--hg-text-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center text-sm tabular-nums text-[var(--hg-text-secondary)]">
                    {p.totalUsi !== null ? p.totalUsi.toFixed(2) : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <TrendIndicator value={p.trend30d} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="inline-block">
                      <Sparkline data={p.usiSparkline} />
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-left">
                    {p.biggestGap ? (
                      <span className="text-xs text-[var(--hg-text-secondary)] tabular-nums">
                        {p.biggestGap.label} {p.biggestGap.value.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--hg-text-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-left">
                    <MiniDistribution dist={p.distributionPct} />
                  </td>
                  <td className="px-4 py-2.5 text-left text-xs text-[var(--hg-text-secondary)]">
                    {formatLastTraining(p.lastTrainingAt)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {p.signal && p.signal.priorityScore >= 20 ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-warning-light px-2 py-0.5 text-[11px] font-medium text-warning-text tabular-nums">
                        {p.signal.kinds.length}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--hg-text-muted)]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
