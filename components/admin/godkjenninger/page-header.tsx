import { Settings2, CheckCheck } from "lucide-react";

interface Props {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function GodkjenningerPageHeader({ eyebrow, title, subtitle }: Props) {
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
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:bg-white/10"
        >
          <Settings2 className="h-3.5 w-3.5" strokeWidth={1.8} /> Regler
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:bg-white/10"
        >
          <CheckCheck className="h-3.5 w-3.5" strokeWidth={1.8} /> Bulk-godkjenn
        </button>
      </div>
    </div>
  );
}
