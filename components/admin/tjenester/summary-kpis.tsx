import { SUMMARY_KPIS } from "./mock-data";

export function SummaryKpis() {
  return (
    <div className="mb-6 grid grid-cols-4 gap-3">
      {SUMMARY_KPIS.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-xl border border-[#1a4a3a] bg-[#0D2E23] px-4 py-3"
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.10em] text-white/55">
            {kpi.label}
          </div>
          <div className="mt-1 font-inter-tight text-[22px] font-bold leading-tight text-white">
            {kpi.value}
            {kpi.unit && (
              <span className="ml-1 text-[12px] font-medium text-white/55">
                {kpi.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
