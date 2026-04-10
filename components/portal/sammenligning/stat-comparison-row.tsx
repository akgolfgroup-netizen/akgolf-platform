"use client";

interface StatComparisonRowProps {
  label: string;
  myValue: number | null;
  peerValue: number | null;
  unit?: string;
  higherIsBetter?: boolean;
  format?: (v: number) => string;
}

export function StatComparisonRow({
  label,
  myValue,
  peerValue,
  unit,
  higherIsBetter = true,
  format = (v) => v.toFixed(1),
}: StatComparisonRowProps) {
  const isBetter =
    myValue !== null && peerValue !== null
      ? higherIsBetter
        ? myValue > peerValue
        : myValue < peerValue
      : null;

  const myColor =
    isBetter === true
      ? "var(--color-success)"
      : isBetter === false
        ? "var(--color-error)"
        : "var(--color-text)";

  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3 border border-black/5 bg-white/50 hover:bg-white hover:border-[var(--color-primary)]/15 transition-colors">
      <span className="flex-1 text-sm text-[var(--color-muted)]">{label}</span>
      <span
        className="w-16 text-right text-sm font-bold"
        style={{ color: myColor }}
      >
        {myValue !== null ? format(myValue) : "—"}
        {unit && myValue !== null && (
          <span className="text-[10px] font-normal text-[var(--color-muted)]">
            {unit}
          </span>
        )}
      </span>
      <span className="h-4 w-px bg-black/10" />
      <span className="w-16 text-right text-sm text-[var(--color-muted)]">
        {peerValue !== null ? format(peerValue) : "—"}
        {unit && peerValue !== null && <span className="text-[10px]">{unit}</span>}
      </span>
    </div>
  );
}
