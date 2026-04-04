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
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--color-grey-200)]">
      <span className="text-xs text-[var(--color-grey-500)] flex-1">{label}</span>
      <span
        className={`text-sm font-bold w-16 text-right ${
          isBetter === true
            ? "text-[#2D6A4F]"
            : isBetter === false
            ? "text-[#D14343]"
            : "text-[var(--color-grey-900)]"
        }`}
      >
        {myValue !== null ? format(myValue) : "—"}
        {unit && myValue !== null && (
          <span className="text-[10px] font-normal text-[var(--color-grey-500)]">{unit}</span>
        )}
      </span>
      <span className="text-xs text-[var(--color-grey-500)]/50 w-px h-4 bg-[var(--color-grey-200)]" />
      <span className="text-xs text-[var(--color-grey-500)] w-16 text-right">
        {peerValue !== null ? format(peerValue) : "—"}
        {unit && peerValue !== null && (
          <span className="text-[10px]">{unit}</span>
        )}
      </span>
    </div>
  );
}
