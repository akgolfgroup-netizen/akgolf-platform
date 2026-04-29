import { REVENUE_PER_SERVICE } from "./analytics-data";

export function RevenueDonutCard() {
  return (
    <section
      className="rounded-[14px] px-6 py-[22px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-4 flex items-center justify-between text-[15px] font-bold text-white">
        <span>Inntekt per tjeneste · 90d</span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          428k TOTALT
        </span>
      </h3>

      <div
        className="grid items-center gap-[18px]"
        style={{ gridTemplateColumns: "160px 1fr" }}
      >
        <svg viewBox="0 0 200 200" className="h-[160px] w-[160px]">
          <circle
            cx="100"
            cy="100"
            r="78"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="20"
            fill="none"
          />
          {REVENUE_PER_SERVICE.map((seg) => (
            <circle
              key={seg.label}
              cx="100"
              cy="100"
              r="78"
              stroke={seg.color}
              strokeWidth="20"
              fill="none"
              strokeDasharray={`${seg.dashLen} 490`}
              strokeDashoffset={seg.dashOffset}
              transform="rotate(-90 100 100)"
            />
          ))}
        </svg>

        <div>
          {REVENUE_PER_SERVICE.map((seg) => (
            <div
              key={seg.label}
              className="grid items-center gap-2.5 py-1.5 text-[12.5px]"
              style={{ gridTemplateColumns: "12px 1fr auto" }}
            >
              <span
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ background: seg.color }}
              />
              <span className="text-white/85">{seg.label}</span>
              <span className="font-mono font-bold text-white">{seg.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
