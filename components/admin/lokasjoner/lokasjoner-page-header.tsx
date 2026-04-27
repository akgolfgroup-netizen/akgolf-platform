import { Map, Plus } from "lucide-react";

interface Props {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function LokasjonerPageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="mb-6 flex items-end justify-between border-b border-[#1a4a3a] pb-5">
      <div>
        <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
          {eyebrow}
        </div>
        <h1 className="mt-2 font-inter-tight text-[28px] font-bold leading-tight tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-[13px] text-white/60">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:border-white/20 hover:bg-white/10"
        >
          <Map className="h-3.5 w-3.5" strokeWidth={1.8} /> Vis kart
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#00422F]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.8} /> Ny lokasjon
        </button>
      </div>
    </div>
  );
}
