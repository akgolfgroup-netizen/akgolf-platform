import type { DagensFokusKpi } from "./mock-data";

export function KpiStrip({ kpis }: { kpis: DagensFokusKpi[] }) {
  return (
    <div className="mb-[18px] grid grid-cols-5 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={
            "rounded-xl border p-[14px_16px] " +
            (kpi.alert
              ? "border-[rgba(184,66,51,0.45)] bg-[rgba(184,66,51,0.10)]"
              : "border-[#1a4a3a] bg-[#0D2E23]")
          }
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
            {kpi.label}
          </div>
          <div
            className={
              "mt-1 font-mono text-[26px] font-bold leading-none tracking-[-0.025em] tabular-nums " +
              (kpi.alert ? "text-[#F49283]" : "text-white")
            }
          >
            {kpi.value}
            {kpi.delta ? (
              <small
                className={
                  "ml-1.5 text-[11px] font-medium " +
                  (kpi.deltaTone === "down"
                    ? "text-[#F49283]"
                    : "text-[#6FCBA1]")
                }
              >
                {kpi.delta}
              </small>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
