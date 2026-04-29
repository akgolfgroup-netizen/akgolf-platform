import type { WeekKpi } from "./mock-data";

export function WeekSummary({ kpis }: { kpis: WeekKpi[] }) {
  return (
    <div className="mb-[18px] grid grid-cols-4 gap-3.5">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] p-4"
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
            {kpi.label}
          </div>
          <div className="mt-1.5 font-mono text-[28px] font-bold leading-none tracking-[-0.025em] tabular-nums text-white">
            {kpi.value}
            {kpi.delta ? (
              <small className="ml-1.5 text-[11px] font-medium text-[#6FCBA1]">
                {kpi.delta}
              </small>
            ) : null}
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-sm bg-white/[0.06]">
            <div
              className="h-full rounded-sm bg-accent"
              style={{ width: `${Math.max(0, Math.min(100, kpi.barPercent))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
