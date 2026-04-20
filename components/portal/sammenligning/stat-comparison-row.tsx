"use client";

import { MonoLabel } from "@/components/portal/patterns";

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

  const myClass =
    isBetter === true
      ? "text-success"
      : isBetter === false
        ? "text-error"
        : "text-text";

  const deltaText =
    myValue !== null && peerValue !== null
      ? `${myValue - peerValue >= 0 ? "+" : ""}${(myValue - peerValue).toFixed(2)}`
      : null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/6 bg-surface-container-lowest/50 px-4 py-3 transition-colors hover:border-primary/15 hover:bg-surface-container-lowest">
      <span className="flex-1 text-sm text-muted">{label}</span>
      <MonoLabel size="md" className={`w-16 text-right font-semibold ${myClass}`}>
        {myValue !== null ? format(myValue) : "—"}
        {unit && myValue !== null && (
          <span className="ml-0.5 text-[10px] font-normal text-muted">{unit}</span>
        )}
      </MonoLabel>
      {deltaText && (
        <MonoLabel
          size="xs"
          className={`w-14 text-center ${
            isBetter === true
              ? "text-success"
              : isBetter === false
                ? "text-error"
                : "text-on-surface-variant"
          }`}
        >
          {deltaText}
        </MonoLabel>
      )}
      <span className="h-4 w-px bg-on-surface/10" />
      <MonoLabel size="md" className="w-16 text-right text-muted">
        {peerValue !== null ? format(peerValue) : "—"}
        {unit && peerValue !== null && <span className="ml-0.5 text-[10px]">{unit}</span>}
      </MonoLabel>
    </div>
  );
}
