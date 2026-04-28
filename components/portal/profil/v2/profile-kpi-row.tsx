interface ProfileKpiRowProps {
  currentHcp: number | null;
  hcpDeltaYear: number | null;
  sgPerRound: number | null;
  sgDelta: number | null;
  roundsThisMonth: number;
  roundsDelta: number | null;
}

export function ProfileKpiRow({
  currentHcp,
  hcpDeltaYear,
  sgPerRound,
  sgDelta,
  roundsThisMonth,
  roundsDelta,
}: ProfileKpiRowProps) {
  return (
    <div className="mb-7 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
      <KpiCard
        label="HCP nå"
        value={currentHcp !== null ? currentHcp.toFixed(1) : "—"}
        delta={
          hcpDeltaYear !== null
            ? `${hcpDeltaYear < 0 ? "↓" : "↑"} ${Math.abs(hcpDeltaYear).toFixed(1)} / år`
            : null
        }
        accent
      />
      <KpiCard
        label="Strokes Gained"
        value={
          sgPerRound !== null
            ? `${sgPerRound > 0 ? "+" : ""}${sgPerRound.toFixed(2)}`
            : "—"
        }
        delta={
          sgDelta !== null
            ? `${sgDelta > 0 ? "+" : ""}${sgDelta.toFixed(2)}`
            : null
        }
      />
      <KpiCard
        label="Runder denne mnd"
        value={String(roundsThisMonth)}
        delta={roundsDelta !== null ? `${roundsDelta > 0 ? "+" : ""}${roundsDelta}` : null}
      />
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  accent = false,
}: {
  label: string;
  value: string;
  delta: string | null;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-5 py-4 ${
        accent
          ? "border-[#D1F843]/30 bg-[#D1F843]/[0.06]"
          : "border-[#1a4a3a] bg-[#0D2E23]"
      }`}
    >
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/45">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span
          className={`font-display text-3xl font-extrabold tabular-nums tracking-[-0.03em] ${
            accent ? "text-[#D1F843]" : "text-white"
          }`}
        >
          {value}
        </span>
        {delta ? (
          <small className="text-xs font-semibold text-[#6FCBA1]">{delta}</small>
        ) : null}
      </div>
    </div>
  );
}
