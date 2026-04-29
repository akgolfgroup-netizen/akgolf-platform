"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CalendarPlus, ChevronDown, Download, Filter, List, CalendarDays } from "lucide-react";
import { McPageHead, McButton, McKpiCard } from "@/components/admin/mc-v2";
import type { BookingDayGroup, BookingRow, BookingStat, CoachFilter } from "@/components/admin/bookinger/booking-types";

type ViewMode = "list" | "calendar";

interface Props {
  groups: BookingDayGroup[];
  stats: BookingStat[];
  coaches: CoachFilter[];
  totalCount: number;
  todayCount: number;
  pendingCount: number;
  weekLabel: string;
}

export function BookingerClientV2({ groups, stats, coaches, totalCount, todayCount, pendingCount, weekLabel }: Props) {
  const [view, setView] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "pending">("all");
  const [visibleDays, setVisibleDays] = useState(14);

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

  function handleExport() {
    const rows = groups.flatMap((g) =>
      g.rows.map((r) => `"${g.label}","${r.dayLabel}","${r.player.name}","${r.coach.name}","${r.location}","${r.type}","${r.status}"`),
    );
    const csv = ["Dag,Dagslabel,Spiller,Coach,Sted,Type,Status", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookinger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <McPageHead
        eyebrow="Plan · Bookinger"
        title="Alle bookinger"
        description="Kommende og historiske økter på tvers av coachene."
        actions={
          <>
            <McButton variant="ghost" icon={<Download className="w-3.5 h-3.5" />} onClick={handleExport}>
              Eksport
            </McButton>
            <McButton variant="ghost" icon={<Filter className="w-3.5 h-3.5" />} onClick={() => { setSearch(""); setFilter("all"); }}>
              Nullstill filter
            </McButton>
            <Link href="/admin/bookinger/ny" className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition hover:opacity-90 no-underline" style={{ background: "#D1F843", color: "#0A1F18" }}>
              <CalendarPlus className="w-3.5 h-3.5" strokeWidth={2} /> Ny booking
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s) => (
          <McKpiCard
            key={s.label}
            label={s.label}
            value={s.value}
            tone={s.tone === "warning" ? "warning" : s.tone === "danger" ? "danger" : "default"}
          />
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            type="button"
            onClick={() => setView("list")}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors"
            style={view === "list" ? { background: "rgba(209,248,67,0.12)", color: "#D1F843" } : { color: "rgba(255,255,255,0.55)" }}
          >
            <List className="w-3 h-3" /> LISTE
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors"
            style={view === "calendar" ? { background: "rgba(209,248,67,0.12)", color: "#D1F843" } : { color: "rgba(255,255,255,0.55)" }}
          >
            <CalendarDays className="w-3 h-3" /> KALENDER
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 min-w-[180px] max-w-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Filter className="w-3.5 h-3.5 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søk spiller, coach, sted…"
            className="bg-transparent outline-none border-none text-[13px] text-white flex-1 placeholder:text-white/35"
          />
        </div>

        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Alle</FilterChip>
        <FilterChip active={filter === "today"} onClick={() => setFilter("today")}>I dag</FilterChip>
        <FilterChip active={filter === "pending"} onClick={() => setFilter("pending")}>Pending</FilterChip>

        <span className="ml-auto font-mono text-[10px] text-white/40">{weekLabel}</span>
      </div>

      {/* Content */}
      {view === "list" ? (
        <ListView groups={filteredGroups} visibleDays={visibleDays} onLoadMore={() => setVisibleDays((n) => n + 14)} />
      ) : (
        <CalendarView groups={filteredGroups} />
      )}
    </div>
  );
}

/* ─── List View ─── */

function ListView({ groups, visibleDays, onLoadMore }: { groups: BookingDayGroup[]; visibleDays: number; onLoadMore: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Header */}
      <div className="grid px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35" style={{ gridTemplateColumns: "60px 1fr 120px 100px 80px", gap: 12, background: "rgba(255,255,255,0.02)" }}>
        <span>Tid</span>
        <span>Spiller</span>
        <span>Type</span>
        <span>Coach</span>
        <span>Status</span>
      </div>

      {groups.length === 0 ? (
        <div className="px-4 py-12 text-center text-[13px] text-white/40">Ingen bookinger matcher filtrene.</div>
      ) : (
        groups.slice(0, visibleDays).map((day) => (
          <div key={day.label}>
            <div className="flex items-center justify-between px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.45)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <span>{day.label}</span>
              <span style={{ color: "#D1F843" }}>{day.rows.length} økter</span>
            </div>
            {day.rows.map((row) => (
              <ListRow key={row.id} row={row} />
            ))}
          </div>
        ))
      )}

      {groups.length > visibleDays && (
        <div className="border-t px-4 py-3 text-center" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
          <McButton variant="ghost" icon={<ChevronDown className="w-3.5 h-3.5" />} onClick={onLoadMore}>
            Last flere
          </McButton>
        </div>
      )}
    </div>
  );
}

function ListRow({ row }: { row: BookingRow }) {
  const statusColor = row.status === "confirmed" || row.status === "live" ? "#6FCBA1" : row.status === "pending" ? "#E8B967" : "#F49283";
  return (
    <div
      className="grid items-center px-4 py-2.5 text-[13px] transition-colors hover:bg-white/[0.02] cursor-pointer"
      style={{ gridTemplateColumns: "60px 1fr 120px 100px 80px", gap: 12, borderTop: "1px solid rgba(255,255,255,0.03)" }}
    >
      <span className="font-mono text-[11px] text-white/50">{row.time}</span>
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 rounded-full grid place-items-center text-[9px] font-bold shrink-0" style={{ background: row.player.color, color: "#0A1F18" }}>
          {row.player.initials}
        </div>
        <span className="truncate text-white/80">{row.player.name}</span>
      </div>
      <span className="text-white/50 truncate">{row.type}</span>
      <span className="text-white/50 truncate">{row.coach.name}</span>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider" style={{ color: statusColor }}>{row.status}</span>
    </div>
  );
}

/* ─── Calendar View ─── */

function CalendarView({ groups }: { groups: BookingDayGroup[] }) {
  // Flatten all rows and group by day of week
  const allRows = groups.flatMap((g) => g.rows);
  const days = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
  const byDay: Record<string, BookingRow[]> = { Man: [], Tir: [], Ons: [], Tor: [], Fre: [], Lør: [], Søn: [] };

  for (const row of allRows) {
    // Map dayLabel to weekday
    const label = row.dayLabel.toLowerCase();
    let day = "";
    if (label.includes("dag") || label.includes("morgen")) {
      // For "I dag" / "I morgen", use actual date
      day = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    } else {
      const map: Record<string, string> = { mandag: "Man", tirsdag: "Tir", onsdag: "Ons", torsdag: "Tor", fredag: "Fre", lørdag: "Lør", søndag: "Søn" };
      for (const [key, val] of Object.entries(map)) {
        if (label.includes(key)) { day = val; break; }
      }
    }
    if (day) byDay[day].push(row);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">
      {days.map((day) => (
        <div key={day} className="rounded-xl p-2.5 min-h-[300px]" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40 mb-2 text-center">{day}</div>
          <div className="flex flex-col gap-1.5">
            {byDay[day].length === 0 ? (
              <div className="text-[10px] text-center py-4 text-white/20 font-mono uppercase tracking-wider">Ingen</div>
            ) : (
              byDay[day].map((row) => (
                <div key={row.id} className="rounded-lg p-2 cursor-pointer hover:bg-white/[0.03] transition-colors" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="font-mono text-[10px] text-white/50">{row.time}</div>
                  <div className="text-[11px] font-medium text-white/80 truncate">{row.player.name}</div>
                  <div className="text-[10px] text-white/40 truncate">{row.type}</div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Helpers ─── */

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-colors"
      style={active ? { background: "rgba(209,248,67,0.12)", color: "#D1F843", border: "1px solid rgba(209,248,67,0.25)" } : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {children}
    </button>
  );
}
