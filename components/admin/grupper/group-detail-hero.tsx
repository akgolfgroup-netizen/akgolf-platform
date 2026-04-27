import { BarChart3, MoreHorizontal, Users } from "lucide-react";
import type { GroupDetail } from "./detail-mock-data";

export function GroupDetailHero({ detail }: { detail: GroupDetail }) {
  return (
    <section
      className="mb-[22px] grid items-center gap-6 rounded-[18px] border border-[rgba(209,248,67,0.30)] bg-[#0D2E23] px-7 py-6"
      style={{ gridTemplateColumns: "1.4fr 1fr" }}
    >
      <div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
          {detail.heroEyebrow}
        </div>
        <h2 className="mt-1.5 font-inter-tight text-[26px] font-extrabold tracking-tight text-white">
          {detail.heroTitle}
        </h2>
        <p className="mt-2.5 max-w-[55ch] text-[13.5px] leading-[1.6] text-white/70">
          {detail.heroLede}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent bg-accent px-3.5 py-2 text-[13px] font-semibold text-ink transition hover:bg-accent/90"
          >
            <Users className="h-3.5 w-3.5" strokeWidth={2} />
            Roster ({detail.roster.length})
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-white/90 transition hover:border-white/20 hover:bg-white/10"
          >
            <BarChart3 className="h-3.5 w-3.5" strokeWidth={1.8} />
            Gruppe-rapport
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-transparent bg-transparent px-3 py-2 text-[13px] font-medium text-white/70 transition hover:bg-white/5"
          >
            <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} />
            Mer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {detail.heroStats.map((s) => (
          <div
            key={s.label}
            className="rounded-[10px] border border-white/[0.06] bg-black/20 px-3.5 py-3"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
              {s.label}
            </div>
            <div className="mt-1 text-[20px] font-extrabold leading-none text-white">
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
