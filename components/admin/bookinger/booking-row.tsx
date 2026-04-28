import { Check, Eye, MapPin, MoreHorizontal, CalendarPlus } from "lucide-react";
import type { BookingRow as BookingRowType, BookingStatus } from "./mock-data";

const STATUS_STYLES: Record<BookingStatus, { bg: string; color: string; label: string }> = {
  confirmed: { bg: "rgba(42,125,90,0.20)", color: "#6FCBA1", label: "Bekreftet" },
  pending: { bg: "rgba(196,138,50,0.20)", color: "#E8B967", label: "Pending" },
  cancelled: { bg: "rgba(184,66,51,0.20)", color: "#F49283", label: "Avlyst" },
  live: { bg: "rgba(209,248,67,0.18)", color: "#D1F843", label: "● Live" },
};

const ROW_GRID =
  "grid items-center gap-3 px-[18px] py-3 text-[13px] border-b border-white/5 hover:bg-white/[0.025] transition";
const ROW_COLS = {
  gridTemplateColumns:
    "100px 100px 1.5fr 1fr 1fr 110px 90px 90px",
};

export function BookingRow({ row }: { row: BookingRowType }) {
  const status = STATUS_STYLES[row.status];

  // Velg primær-action ikon basert på status
  const primaryAction = (() => {
    if (row.status === "live") return { icon: Eye, title: "Vis" };
    if (row.status === "pending") return { icon: Check, title: "Bekreft" };
    if (row.status === "cancelled") return { icon: CalendarPlus, title: "Reschedule" };
    return { icon: Check, title: "Sjekk inn" };
  })();
  const PrimaryIcon = primaryAction.icon;

  return (
    <div className={ROW_GRID} style={ROW_COLS}>
      {/* Dag */}
      <div className="font-semibold text-white">
        {row.dayLabel}
        <small className="mt-px block font-mono text-[10px] font-normal tracking-wider text-white/50">
          {row.dayShort}
        </small>
      </div>

      {/* Tid */}
      <div className="font-mono text-[12px] font-semibold text-white">
        {row.time}
        <small className="mt-px block font-normal text-white/45">{row.duration}</small>
      </div>

      {/* Spiller */}
      <div className="flex items-center gap-2">
        <div
          className="grid h-[26px] w-[26px] flex-shrink-0 place-items-center rounded-full text-[10px] font-bold text-[#0A1F18]"
          style={{ background: row.player.color }}
        >
          {row.player.initials}
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium text-white">{row.player.name}</div>
          <div className="mt-px font-mono text-[10px] tracking-wider text-white/50">
            {row.player.sub}
          </div>
        </div>
      </div>

      {/* Coach */}
      <div className="text-[12px] text-white/85">
        {row.coach.name}
        <small className="mt-px block font-mono text-[10px] text-white/45">{row.coach.tag}</small>
      </div>

      {/* Lokasjon */}
      <div className="inline-flex items-center gap-1.5 text-[12px] text-white/85">
        <MapPin className="h-3 w-3 text-white/50" strokeWidth={1.8} />
        <span className="truncate">{row.location}</span>
      </div>

      {/* Status */}
      <div>
        <span
          className="inline-block rounded px-2 py-[3px] font-mono text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: status.bg, color: status.color }}
        >
          {status.label}
        </span>
      </div>

      {/* Type */}
      <div className="truncate text-[11px] text-white/70">{row.type}</div>

      {/* Actions */}
      <div className="flex justify-end gap-1">
        <button
          type="button"
          title={primaryAction.title}
          className="grid h-7 w-7 place-items-center rounded-md border border-white/8 bg-white/[0.04] text-white/70 transition hover:bg-accent/10 hover:text-accent"
        >
          <PrimaryIcon className="h-[13px] w-[13px]" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          title="Mer"
          className="grid h-7 w-7 place-items-center rounded-md border border-white/8 bg-white/[0.04] text-white/70 transition hover:bg-accent/10 hover:text-accent"
        >
          <MoreHorizontal className="h-[13px] w-[13px]" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

export function BookingTableHead() {
  return (
    <div
      className="grid items-center gap-3 border-b border-white/5 bg-white/[0.025] px-[18px] py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/45"
      style={ROW_COLS}
    >
      <span>Dag</span>
      <span>Tid</span>
      <span>Spiller</span>
      <span>Coach</span>
      <span>Lokasjon</span>
      <span>Status</span>
      <span>Type</span>
      <span className="text-right">Handling</span>
    </div>
  );
}
