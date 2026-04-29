import { NEW_PLAYERS_BARS } from "./analytics-data";

export function NewPlayersCard() {
  return (
    <section
      className="rounded-[14px] px-6 py-[22px]"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      <h3 className="mb-4 text-[15px] font-bold text-white">
        Ny-spillere · siste 12 uker
      </h3>

      <svg viewBox="0 0 320 160" style={{ width: "100%", height: "160px" }}>
        <g stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2">
          <line x1="0" y1="40" x2="320" y2="40" />
          <line x1="0" y1="80" x2="320" y2="80" />
          <line x1="0" y1="120" x2="320" y2="120" />
        </g>
        <g fill="#D1F843">
          {NEW_PLAYERS_BARS.map((bar) => (
            <rect
              key={bar.x}
              x={bar.x}
              y={bar.y}
              width="14"
              height={bar.h}
              rx="2"
            />
          ))}
        </g>
        <text x="0" y="158" fontFamily="JetBrains Mono" fontSize="9" fill="rgba(255,255,255,0.45)">
          UKE 6
        </text>
        <text x="280" y="158" fontFamily="JetBrains Mono" fontSize="9" fill="rgba(255,255,255,0.45)">
          UKE 18
        </text>
      </svg>

      <div className="mt-3 border-t border-white/[0.06] pt-3 text-[11.5px] leading-[1.5] text-white/55">
        Trend: <strong className="font-bold" style={{ color: "#6FCBA1" }}>+12 %</strong> uke-på-uke vekst. Uke 18: <strong className="font-bold text-white">12 nye spillere</strong>.
      </div>
    </section>
  );
}
