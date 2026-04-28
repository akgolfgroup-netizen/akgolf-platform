import Link from "next/link";
import { CalendarPlus, ChevronDown, Download, Filter } from "lucide-react";
import { BOOKING_DAYS, BOOKING_STATS } from "./mock-data";
import { BookingRow, BookingTableHead } from "./booking-row";
import { BookingToolbar } from "./booking-toolbar";

const TONE: Record<"default" | "warning" | "danger", string> = {
  default: "#fff",
  warning: "#E8B967",
  danger: "#F49283",
};

export function BookingerClient() {
  return (
    <div className="px-7 py-6 text-white" style={{ background: "#102B1E" }}>
      {/* Page head */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "#D1F843" }}
          >
            Plan · Bookinger
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold tracking-tight text-white">
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
            href="/portal/admin/bookinger/ny"
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition hover:opacity-90"
            style={{ background: "#D1F843", color: "#0A1F18" }}
          >
            <CalendarPlus className="h-3.5 w-3.5" strokeWidth={2} /> Ny booking
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-[18px] grid grid-cols-5 gap-3">
        {BOOKING_STATS.map((s) => (
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

      {/* Toolbar */}
      <BookingToolbar />

      {/* Table */}
      <div className="overflow-hidden rounded-[14px] border border-white/8 bg-white/[0.04]">
        <BookingTableHead />

        {BOOKING_DAYS.map((day) => (
          <div key={day.label}>
            <div className="flex items-center justify-between bg-white/[0.03] px-[18px] py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
              <span>{day.label}</span>
              <span style={{ color: "#D1F843" }}>{day.count} økter</span>
            </div>
            {day.rows.map((row) => (
              <BookingRow key={row.id} row={row} />
            ))}
          </div>
        ))}

        <div className="border-t border-white/5 bg-white/[0.02] px-[18px] py-3.5 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-white/80 transition hover:bg-white/[0.06]"
          >
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} /> Vis 3 økter til denne uken
          </button>
        </div>
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
