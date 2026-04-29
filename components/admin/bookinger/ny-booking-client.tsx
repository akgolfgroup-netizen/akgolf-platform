import Link from "next/link";
import { X } from "lucide-react";
import { NyBookingForm } from "./ny-booking-form";
import { NyBookingSummary } from "./ny-booking-summary";

export function NyBookingClient() {
  return (
    <div className="px-7 py-6 text-white" style={{ background: "#102B1E" }}>
      {/* Page head */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "#D1F843" }}
          >
            Plan · Ny booking
          </div>
          <h1 className="mt-2 font-inter-tight text-[28px] font-bold tracking-tight text-white">
            Bok ny økt
          </h1>
          <p className="mt-1.5 max-w-2xl text-[13px] text-white/60">
            Velg spiller, type, tid og lokasjon. Konflikter og forslag oppdateres i sanntid.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/bookinger"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium text-white/85 transition hover:bg-white/[0.06]"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.8} /> Avbryt
          </Link>
        </div>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 items-start gap-[18px] xl:grid-cols-[1.4fr_1fr]">
        <NyBookingForm />
        <NyBookingSummary />
      </div>
    </div>
  );
}
