type Kpi = {
  label: string;
  value: string;
  suffix?: string;
  tone?: "alert";
};

export function GroupsKpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="mb-6 grid grid-cols-5 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={
            "rounded-xl border bg-[#0D2E23] px-4 py-3.5 " +
            (kpi.tone === "alert"
              ? "border-[rgba(184,66,51,0.30)]"
              : "border-white/[0.06]")
          }
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.10em] text-white/50">
            {kpi.label}
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span
              className={
                "font-mono text-[22px] font-bold leading-none " +
                (kpi.tone === "alert" ? "text-[#F49283]" : "text-white")
              }
            >
              {kpi.value}
            </span>
            {kpi.suffix ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.10em] text-white/50">
                {kpi.suffix}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
