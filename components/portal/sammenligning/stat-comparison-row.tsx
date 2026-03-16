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

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--color-border)]">
      <span className="text-xs text-[var(--color-gold-muted)] flex-1">{label}</span>
      <span
        className={`text-sm font-bold w-16 text-right ${
          isBetter === true
            ? "text-green-400"
            : isBetter === false
            ? "text-red-400"
            : "text-[var(--color-snow)]"
        }`}
      >
        {myValue !== null ? format(myValue) : "—"}
        {unit && myValue !== null && (
          <span className="text-[10px] font-normal text-[var(--color-gold-muted)]">{unit}</span>
        )}
      </span>
      <span className="text-xs text-[var(--color-gold-muted)]/50 w-px h-4 bg-[var(--color-border)]" />
      <span className="text-xs text-[var(--color-gold-muted)] w-16 text-right">
        {peerValue !== null ? format(peerValue) : "—"}
        {unit && peerValue !== null && (
          <span className="text-[10px]">{unit}</span>
        )}
      </span>
    </div>
  );
}
