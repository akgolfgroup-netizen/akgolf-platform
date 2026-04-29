import Link from "next/link";
import { CalendarPlus, Filter, Printer } from "lucide-react";
import { CalendarGrid } from "./calendar-grid";
import { CalendarToolbar } from "./calendar-toolbar";
import { FOOTER_STATS } from "./mock-data";

export function KalenderClient() {
  return (
    <div className="px-7 py-6 text-white" style={{ background: "#102B1E" }}>
      {/* Page head */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "#D1F843" }}
          >
            Plan · Kalender
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold tracking-tight text-white">
            Uke 18 · 28 apr–4 mai
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-white/60">
            Drag-drop for å flytte. Fargene er per coach. Klikk en blokk for handlinger.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <GhostBtn>
            <Filter className="h-3.5 w-3.5" strokeWidth={1.8} /> Filter
          </GhostBtn>
          <GhostBtn>
            <Printer className="h-3.5 w-3.5" strokeWidth={1.8} /> Print
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

      <CalendarToolbar />
      <CalendarGrid />

      {/* Footer stats */}
      <div className="mt-3.5 grid grid-cols-5 gap-3">
        {FOOTER_STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-[10px] border border-white/8 bg-white/[0.04] px-3.5 py-3"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
              {s.label}
            </div>
            <div
              className="mt-1 text-[22px] font-bold tracking-tight tabular-nums"
              style={{ color: s.color }}
            >
              {s.value}
              {s.suffix && (
                <span className="ml-1 text-[11px] font-medium text-white/50">{s.suffix}</span>
              )}
            </div>
          </div>
        ))}
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
