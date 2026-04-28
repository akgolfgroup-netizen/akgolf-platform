import { Plus, Wrench } from "lucide-react";

export function FasiliteterPageHeader() {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
          / DRIFT · FASILITETER
        </div>
        <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-white">
          Treningsbays, studio, lab.
        </h1>
        <p className="mt-1.5 max-w-3xl text-[13px] text-white/60">
          Hver fasilitet har eget utstyrs-register, vedlikeholds-historikk og
          live-belegg. Skullerud studio B er ledig nå — Bogstad bay 04 er i bruk fram
          til 17:30.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:border-white/20 hover:bg-white/10"
        >
          <Wrench className="h-3.5 w-3.5" strokeWidth={1.8} /> Vedlikehold
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-[13px] font-semibold text-ink transition hover:bg-[#bfe535]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.8} /> Ny fasilitet
        </button>
      </div>
    </div>
  );
}
