"use client";

interface MilestoneCardProps {
  goalSessions: number;
  currentSessions: number;
  goalRounds: number;
  weeksAhead: number; // positiv = pa skjema, negativ = bak
}

/**
 * Milepel-kort for dagbok v2.
 */
export function MilestoneCard({
  goalSessions,
  currentSessions,
  goalRounds,
  weeksAhead,
}: MilestoneCardProps) {
  const pct = Math.min(
    100,
    Math.round((currentSessions / Math.max(1, goalSessions)) * 100)
  );

  const aheadLabel =
    weeksAhead === 0
      ? "Pa plan"
      : weeksAhead > 0
        ? `+${weeksAhead}u`
        : `${weeksAhead}u`;
  const aheadColor =
    weeksAhead >= 0 ? "var(--color-success, #2A7D5A)" : "#B84233";

  return (
    <div className="bg-card border border-[color:var(--color-line)] rounded-2xl p-5">
      <h3 className="m-0 mb-0.5 text-sm font-bold">Milepeler 2026</h3>
      <div className="font-mono text-[11px] text-[#7A8C85] tracking-wider uppercase">
        Mal · {goalSessions} okter · {goalRounds} runder
      </div>

      <div className="mt-4">
        <svg viewBox="0 0 400 140" style={{ width: "100%" }}>
          <line
            x1="0"
            y1="100"
            x2="400"
            y2="100"
            stroke="#ECF0EF"
            strokeWidth="1"
          />
          <path
            d="M0,100 L40,94 L80,86 L120,78 L160,70 L200,62 L240,54 L280,46 L320,38 L360,30 L400,22"
            fill="none"
            stroke="#D1F843"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
          <path
            d="M0,100 L30,96 L60,90 L90,84 L120,78 L150,73 L180,66 L210,60 L230,56"
            fill="none"
            stroke="#2A7D5A"
            strokeWidth="2.5"
          />
          <circle cx="230" cy="56" r="5" fill="#2A7D5A" />
          <g fontFamily="JetBrains Mono" fontSize="9" fill="#5A6E66">
            <text x="0" y="120">JAN</text>
            <text x="80" y="120">FEB</text>
            <text x="160" y="120">MAR</text>
            <text x="240" y="120">APR</text>
            <text x="320" y="120">MAI</text>
          </g>
          <text
            x="230"
            y="44"
            textAnchor="middle"
            fontSize="10"
            fill="#2A7D5A"
            fontWeight="700"
            fontFamily="JetBrains Mono"
          >
            {currentSessions} OKTER · I DAG
          </text>
        </svg>
      </div>

      <div className="flex gap-4 mt-2.5">
        <div>
          <div className="font-mono text-[9px] text-[#7A8C85] tracking-[0.14em] uppercase">
            Fullfort
          </div>
          <div className="text-xl font-bold text-ink">{pct}%</div>
        </div>
        <div>
          <div className="font-mono text-[9px] text-[#7A8C85] tracking-[0.14em] uppercase">
            Etter plan
          </div>
          <div className="text-xl font-bold" style={{ color: aheadColor }}>
            {aheadLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
