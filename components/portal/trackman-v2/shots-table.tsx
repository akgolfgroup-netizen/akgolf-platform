"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export interface ShotRow {
  id: string;
  shotNumber: number;
  club: string;
  carry: number | null;
  ballSpeed: number | null;
  smash: number | null;
  spin: number | null;
  launch: number | null;
  offline: number | null;
  date: string; // ISO
}

type SortKey =
  | "shotNumber"
  | "club"
  | "carry"
  | "ballSpeed"
  | "smash"
  | "spin"
  | "launch"
  | "offline"
  | "date";

type SortDir = "asc" | "desc";

interface ShotsTableProps {
  shots: ShotRow[];
  /** Maks antall rader som vises (default 30) */
  limit?: number;
}

export function ShotsTable({ shots, limit = 30 }: ShotsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const arr = [...shots];
    arr.sort((a, b) => {
      const av = (a[sortKey] ?? Number.NEGATIVE_INFINITY) as string | number;
      const bv = (b[sortKey] ?? Number.NEGATIVE_INFINITY) as string | number;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr.slice(0, limit);
  }, [shots, sortKey, sortDir, limit]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  if (shots.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#121614] p-5">
        <h3 className="text-[13px] font-bold text-[#F7FAF8] mb-1">Siste slag</h3>
        <div className="font-mono text-[10px] text-white/45 tracking-[0.10em] uppercase mb-4">
          INGEN DATA
        </div>
        <p className="text-sm text-white/55">
          Det finnes ingen slag-data ennå. Last opp en TrackMan-CSV for å se detaljene her.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#121614] p-5">
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div>
          <h3 className="text-[13px] font-bold text-[#F7FAF8] mb-1">Siste slag</h3>
          <div className="font-mono text-[10px] text-white/45 tracking-[0.10em] uppercase">
            {shots.length} TOTALT · VISER {Math.min(shots.length, limit)}
          </div>
        </div>
      </div>

      {/* Mobil: enklere kort-liste */}
      <div className="lg:hidden flex flex-col gap-2">
        {sorted.map((s) => (
          <div
            key={s.id}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
          >
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[#D1F843] text-xs font-bold">
                #{s.shotNumber} · {s.club}
              </div>
              <div className="font-mono text-[10px] text-white/45">
                {formatDate(s.date)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 font-mono tabular-nums text-xs text-white/85">
              <div>
                <span className="text-white/45 text-[9px] uppercase tracking-[0.1em] block">Carry</span>
                {fmtNum(s.carry, 1)}m
              </div>
              <div>
                <span className="text-white/45 text-[9px] uppercase tracking-[0.1em] block">Ball</span>
                {fmtNum(s.ballSpeed, 1)}
              </div>
              <div>
                <span className="text-white/45 text-[9px] uppercase tracking-[0.1em] block">Smash</span>
                {fmtNum(s.smash, 2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: full tabell */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="font-mono text-[9px] text-white/45 tracking-[0.14em] uppercase border-b border-white/10">
              <Th label="#" sortKey="shotNumber" current={sortKey} dir={sortDir} onSort={handleSort} align="left" />
              <Th label="Klubbe" sortKey="club" current={sortKey} dir={sortDir} onSort={handleSort} align="left" />
              <Th label="Carry m" sortKey="carry" current={sortKey} dir={sortDir} onSort={handleSort} align="right" />
              <Th label="Ball mph" sortKey="ballSpeed" current={sortKey} dir={sortDir} onSort={handleSort} align="right" />
              <Th label="Smash" sortKey="smash" current={sortKey} dir={sortDir} onSort={handleSort} align="right" />
              <Th label="Spin rpm" sortKey="spin" current={sortKey} dir={sortDir} onSort={handleSort} align="right" />
              <Th label="Launch°" sortKey="launch" current={sortKey} dir={sortDir} onSort={handleSort} align="right" />
              <Th label="Offline m" sortKey="offline" current={sortKey} dir={sortDir} onSort={handleSort} align="right" />
              <Th label="Dato" sortKey="date" current={sortKey} dir={sortDir} onSort={handleSort} align="right" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr
                key={s.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition"
              >
                <td className="py-2.5 font-mono text-white/55 text-xs">{s.shotNumber}</td>
                <td className="py-2.5 font-mono text-[#D1F843] text-xs font-bold">{s.club}</td>
                <td className="py-2.5 text-right font-mono tabular-nums text-white/85">{fmtNum(s.carry, 1)}</td>
                <td className="py-2.5 text-right font-mono tabular-nums text-white/85">{fmtNum(s.ballSpeed, 1)}</td>
                <td className="py-2.5 text-right font-mono tabular-nums text-white/85">{fmtNum(s.smash, 2)}</td>
                <td className="py-2.5 text-right font-mono tabular-nums text-white/85">
                  {s.spin != null ? formatThousand(s.spin) : "—"}
                </td>
                <td className="py-2.5 text-right font-mono tabular-nums text-white/85">{fmtNum(s.launch, 1)}</td>
                <td className="py-2.5 text-right font-mono tabular-nums text-white/85">{fmtNum(s.offline, 1)}</td>
                <td className="py-2.5 text-right font-mono text-[11px] text-white/55">{formatDate(s.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  label,
  sortKey,
  current,
  dir,
  onSort,
  align,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
  align: "left" | "right";
}) {
  const active = current === sortKey;
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th className={`py-2 ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 hover:text-white transition ${
          active ? "text-[#D1F843]" : ""
        } ${align === "right" ? "flex-row-reverse" : ""}`}
      >
        {label}
        <Icon className="w-3 h-3" />
      </button>
    </th>
  );
}

function fmtNum(v: number | null, decimals: number): string {
  if (v == null || !Number.isFinite(v)) return "—";
  return v.toFixed(decimals);
}

function formatThousand(n: number): string {
  return Math.round(n).toLocaleString("nb-NO").replace(/,/g, " ");
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("nb-NO", { day: "2-digit", month: "short" });
  } catch {
    return "—";
  }
}
