import { FUNNEL } from "./analytics-data";

export function FunnelCard() {
  return (
    <section
      className="rounded-[14px] px-6 py-[22px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-4 flex items-center justify-between text-[15px] font-bold text-white">
        <span>Konverterings-trakt · besøk → betalt</span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          90D
        </span>
      </h3>

      {FUNNEL.map((step, i) => (
        <div
          key={step.head}
          className={`grid items-center gap-3.5 py-2.5 ${
            i === 0 ? "" : "border-t border-white/[0.04]"
          }`}
          style={{ gridTemplateColumns: "1fr 60px" }}
        >
          <div>
            <div className="text-[13px] font-semibold text-white">{step.head}</div>
            <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.06em] text-white/55">
              {step.meta}
            </div>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-[3px]"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <span
                className="block h-full"
                style={{ width: `${step.barPct}%`, background: "#6BB1FF" }}
              />
            </div>
          </div>
          <div className="text-right font-mono text-[14px] font-bold text-white tabular-nums">
            {step.value}
          </div>
        </div>
      ))}
    </section>
  );
}
