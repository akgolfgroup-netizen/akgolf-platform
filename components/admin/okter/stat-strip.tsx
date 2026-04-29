import type { OkterStat } from "./mock-data";

export function OkterStatStrip({ stats }: { stats: OkterStat[] }) {
  return (
    <div className="mb-[18px] grid grid-cols-5 gap-3">
      {stats.map((s) => {
        const valueColor =
          s.tone === "accent"
            ? "text-accent"
            : s.tone === "success"
              ? "text-[#6FCBA1]"
              : "text-white";
        return (
          <div
            key={s.label}
            className="rounded-xl border border-[#1a4a3a] bg-[#0D2E23] px-3.5 py-3"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
              {s.label}
            </div>
            <div
              className={
                "mt-1 text-[22px] font-bold leading-none tracking-[-0.02em] tabular-nums " +
                valueColor
              }
            >
              {s.value}
              {s.unit ? (
                <span className="ml-1 text-[11px] text-white/50">{s.unit}</span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
