"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Search, SlidersHorizontal } from "lucide-react";
import type { SessionItem, SessionStats } from "./actions";
import {
  buildHeatmap,
  groupSessions,
  type SessionDayGroup,
} from "./okter-data";
import { OkterHeatmap } from "@/components/admin/okter/heatmap";
import { SessionTableHead, SessionTableRow } from "@/components/admin/okter/session-row";

type Props = {
  initialSessions: SessionItem[];
  stats: SessionStats;
};

const TABS = [
  { id: "all", label: "ALLE" },
  { id: "completed", label: "FULLFØRT" },
  { id: "upcoming", label: "PLANLAGT" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function OkterClient({ initialSessions, stats }: Props) {
  const [tab, setTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");

  const now = new Date();
  const heat = useMemo(() => buildHeatmap(initialSessions, now), [initialSessions, now]);

  const filtered = useMemo<SessionDayGroup[]>(() => {
    const q = search.trim().toLowerCase();
    const items = initialSessions.filter((s) => {
      if (tab === "completed" && s.status !== "COMPLETED") return false;
      if (tab === "upcoming" && s.status !== "PENDING" && s.status !== "CONFIRMED") return false;
      if (!q) return true;
      const name = (s.student?.name ?? s.student?.email ?? "").toLowerCase();
      const coach = (s.instructor?.name ?? "").toLowerCase();
      const svc = (s.service?.name ?? "").toLowerCase();
      return name.includes(q) || coach.includes(q) || svc.includes(q);
    });
    return groupSessions(items, now);
  }, [initialSessions, tab, search, now]);

  const totalShown = filtered.reduce((s, g) => s + g.count, 0);

  // Approx avg
  const avgLen =
    initialSessions.length > 0
      ? Math.round(
          initialSessions.reduce(
            (sum, s) => sum + (s.service?.duration ?? 60),
            0,
          ) / initialSessions.length,
        )
      : 0;

  const upcoming = initialSessions.filter(
    (s) => s.status === "PENDING" || s.status === "CONFIRMED",
  ).length;

  return (
    <div className="px-7 py-6 text-white" style={{ background: "#102B1E" }}>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "#D1F843" }}
          >
            Plan · Økter
          </div>
          <h1
            className="mt-2 text-[28px] font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Alle treningsøkter
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-white/60">
            Fullførte og planlagte. Filtrer på type, coach eller spiller. Klikk for full øktdetalj.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <GhostBtn>
            <Download className="h-3.5 w-3.5" strokeWidth={1.8} /> Eksport
          </GhostBtn>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition hover:opacity-90"
            style={{ background: "#D1F843", color: "#0A1F18" }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Logg økt
          </button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="mb-[18px] grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Fullført 30d" value={String(stats.completed)} />
        <Stat label="Planlagt" value={String(upcoming)} />
        <Stat label="Snitt-lengde" value={String(avgLen)} unit="min" />
        <Stat label="Avlyst 30d" value={String(stats.cancelled)} tone="warning" />
        <Stat label="Oppmøterate" value={`${stats.attendanceRate}%`} tone="success" />
      </div>

      {/* Heatmap */}
      <div className="mb-[18px]">
        <OkterHeatmap rows={heat} />
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div
          className="inline-flex rounded-lg border bg-white/[0.04] p-0.5"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                "rounded-md px-3.5 py-1.5 font-mono text-[12px] tracking-wider transition " +
                (tab === t.id
                  ? "text-[#D1F843]"
                  : "text-white/60 hover:bg-white/[0.06]")
              }
              style={tab === t.id ? { background: "rgba(209,248,67,0.14)" } : undefined}
            >
              {t.label}{" "}
              {t.id === "all"
                ? `${stats.total + upcoming}`
                : t.id === "completed"
                  ? stats.completed
                  : upcoming}
            </button>
          ))}
        </div>
        <div className="flex w-[280px] items-center gap-2 rounded-lg border border-white/8 bg-white/[0.04] px-3 py-2">
          <Search className="h-3.5 w-3.5 text-white/50" strokeWidth={1.8} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søk type, spiller, coach…"
            className="flex-1 border-none bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
          />
        </div>
        <button
          type="button"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/70 hover:bg-white/[0.06]"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <SlidersHorizontal className="h-3 w-3" strokeWidth={1.8} /> Filter
        </button>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-[14px] border bg-white/[0.04]"
        style={{ borderColor: "rgba(255,255,255,0.10)" }}
      >
        <SessionTableHead />

        {totalShown === 0 ? (
          <div className="px-[18px] py-12 text-center text-[13px] text-white/50">
            Ingen økter matcher filtrene.
          </div>
        ) : (
          filtered.map((day) => (
            <div key={day.label}>
              <div className="flex items-center justify-between bg-white/[0.03] px-[18px] py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                <span>{day.label}</span>
                <span style={{ color: "#D1F843" }}>{day.rows.length} økter</span>
              </div>
              {day.rows.map((row) => (
                <SessionTableRow key={row.id} row={row} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function GhostBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
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
  tone?: "default" | "warning" | "success" | "danger";
}) {
  const color =
    tone === "warning"
      ? "#E8B967"
      : tone === "success"
        ? "#6FCBA1"
        : tone === "danger"
          ? "#F49283"
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
