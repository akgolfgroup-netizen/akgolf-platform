import { Copy, Plus } from "lucide-react";

export function TilgjengelighetPageHeader() {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
          / DRIFT · TILGJENGELIGHET
        </div>
        <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-white">
          Når du er bookbar.
        </h1>
        <p className="mt-1.5 max-w-3xl text-[13px] text-white/60">
          Sett standard arbeidsuke, spesifikke unntak (ferie, kurs, helligdager).
          Spillere ser bare timer som er lyse-grønne. Booking-buffer er 60 min mellom økter.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:border-white/20 hover:bg-white/10"
        >
          <Copy className="h-3.5 w-3.5" strokeWidth={1.8} /> Kopier til neste uke
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-semibold text-ink transition hover:bg-[#bfe535]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.8} /> Legg til unntak
        </button>
      </div>
    </div>
  );
}
