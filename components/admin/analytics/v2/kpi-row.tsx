import { KPIS } from "./analytics-data";

export function KpiRow() {
  return (
    <div className="mb-[18px] grid grid-cols-5 gap-3">
      {KPIS.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-[12px] px-[18px] py-4"
          style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
        >
          <div className="font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
            {kpi.label}
          </div>
          <div className="mt-1.5 font-mono text-[24px] font-extrabold leading-none tracking-[-0.02em] text-white tabular-nums">
            {kpi.value}
            {kpi.suffix && (
              <small className="ml-0.5 text-[13px] font-medium text-white/55">
                {kpi.suffix}
              </small>
            )}
          </div>
          <div
            className="mt-1 font-mono text-[10px] font-bold tracking-[0.06em]"
            style={{ color: kpi.up ? "#6FCBA1" : "#F49283" }}
          >
            {kpi.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
