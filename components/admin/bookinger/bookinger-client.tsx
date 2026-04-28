"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarPlus, ChevronDown, Download, Filter } from "lucide-react";
import { BookingRow, BookingTableHead } from "./booking-row";
import { BookingToolbar } from "./booking-toolbar";
import type { BookingDayGroup, BookingStat, CoachFilter } from "./booking-types";

const TONE: Record<"default" | "warning" | "danger", string> = {
  default: "#fff",
  warning: "#E8B967",
  danger: "#F49283",
};

type Props = {
  groups: BookingDayGroup[];
  stats: BookingStat[];
  coaches: CoachFilter[];
  totalCount: number;
  todayCount: number;
  pendingCount: number;
  weekLabel: string;
};

export function BookingerClient({
  groups,
  stats,
  coaches,
  totalCount,
  todayCount,
  pendingCount,
  weekLabel,
}: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "pending">("all");

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        rows: g.rows.filter((r) => {
          if (filter === "today" && r.dayLabel !== "I dag") return false;
          if (filter === "pending" && r.status !== "pending") return false;
          if (!q) return true;
          return (
            r.player.name.toLowerCase().includes(q) ||
            r.coach.name.toLowerCase().includes(q) ||
            r.location.toLowerCase().includes(q) ||
            r.type.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((g) => g.rows.length > 0);
  }, [groups, search, filter]);

  return (
    <div className="px-7 py-6 text-white" style={{ background: "#102B1E" }}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "#D1F843" }}
          >
            Plan · Bookinger
          </div>
          <h1
            className="mt-2 text-[28px] font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            Alle bookinger
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-white/60">
            Kommende og historiske økter på tvers av coachene. Klikk for detaljer
            eller rediger direkte.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <GhostBtn>
            <Download className="h-3.5 w-3.5" strokeWidth={1.8} /> Eksport
          </GhostBtn>
          <GhostBtn>
            <Filter className="h-3.5 w-3.5" strokeWidth={1.8} /> Filter
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

      <div className="mb-[18px] grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[10px] border border-white/8 bg-white/[0.04] px-3.5 py-3"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
              {s.label}
            </div>
            <div
              className="mt-1 text-[22px] font-bold tracking-tight tabular-nums"
              style={{ color: TONE[s.tone] }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <BookingToolbar
        totalCount={totalCount}
        todayCount={todayCount}
        pendingCount={pendingCount}
        coaches={coaches}
        weekLabel={weekLabel}
        searchValue={search}
        onSearchChange={setSearch}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <div className="overflow-hidden rounded-[14px] border border-white/8 bg-white/[0.04]">
        <BookingTableHead />

        {filteredGroups.length === 0 ? (
          <div className="px-[18px] py-12 text-center text-[13px] text-white/50">
            Ingen bookinger matcher filtrene.
          </div>
        ) : (
          filteredGroups.map((day) => (
            <div key={day.label}>
              <div className="flex items-center justify-between bg-white/[0.03] px-[18px] py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                <span>{day.label}</span>
                <span style={{ color: "#D1F843" }}>{day.rows.length} økter</span>
              </div>
              {day.rows.map((row) => (
                <BookingRow key={row.id} row={row} />
              ))}
            </div>
          ))
        )}

        {filteredGroups.length > 0 && (
          <div className="border-t border-white/5 bg-white/[0.02] px-[18px] py-3.5 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-white/80 transition hover:bg-white/[0.06]"
            >
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} /> Last flere
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GhostBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium text-white/85 transition hover:border-white/16 hover:bg-white/[0.06]"
      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)" }}
    >
      {children}
    </button>
  );
}
