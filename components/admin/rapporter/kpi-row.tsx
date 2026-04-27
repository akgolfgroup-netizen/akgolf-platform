import { KPIS } from "./rapporter-data";

export function KpiRow() {
  return (
    <div className="mb-[18px] grid grid-cols-4 gap-3">
      {KPIS.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-[12px] px-4 py-3.5"
          style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
        >
          <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
            {kpi.label}
          </div>
          <div className="mt-1 font-mono text-[26px] font-bold leading-none tracking-[-0.025em] text-white tabular-nums">
            {kpi.value}
            {kpi.small && (
              <small
                className="ml-1.5 text-[11px] font-medium"
                style={{ color: "#6FCBA1" }}
              >
                {kpi.small}
              </small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
