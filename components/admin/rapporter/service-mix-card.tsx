import { SERVICE_MIX } from "./rapporter-data";

export function ServiceMixCard() {
  return (
    <section
      className="rounded-[14px] px-[22px] py-[18px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-3.5 flex items-center justify-between text-[14px] font-bold text-white">
        <span>Tjeneste-mix · 12 mnd</span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
          87 BOOKINGER MND
        </span>
      </h3>

      <div className="grid items-center gap-[18px]" style={{ gridTemplateColumns: "200px 1fr" }}>
        <div className="relative h-[200px] w-[200px]">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="78"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="20"
              fill="none"
            />
            {SERVICE_MIX.map((seg) => (
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
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[24px] font-extrabold tracking-[-0.02em] text-white">
              87
            </div>
            <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.10em] text-white/50">
              PER MND
            </div>
          </div>
        </div>

        <div className="text-[12.5px]">
          {SERVICE_MIX.map((seg) => (
            <div
              key={seg.label}
              className="grid items-center gap-2.5 py-1.5"
              style={{ gridTemplateColumns: "14px 1fr 50px" }}
            >
              <span
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ background: seg.color }}
              />
              <span className="text-white">{seg.label}</span>
              <span className="text-right font-mono font-bold text-white/70">
                {seg.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
