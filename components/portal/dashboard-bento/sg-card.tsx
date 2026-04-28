"use client";

import type { SgSummary } from "@/app/portal/(dashboard)/dashboard-types";

interface SgCardProps {
  summary: SgSummary;
  peerLabel?: string;
}

interface BarRow {
  label: string;
  value: number | null;
}

function clampPct(v: number) {
  // 0..1 → 0..50 (each side of zero takes 50%)
  return Math.min(50, Math.abs(v) * 30);
}

export function SgCard({ summary, peerLabel = "vs peer" }: SgCardProps) {
  const rows: BarRow[] = [
    { label: "Off-the-tee", value: summary.offTheTee },
    { label: "Approach", value: summary.approach },
    { label: "Around green", value: summary.aroundTheGreen },
    { label: "Putting", value: summary.putting },
  ];

  const hasData = rows.some((r) => r.value !== null);

  return (
    <div
      className="col-span-12 md:col-span-6 rounded-[22px] bg-white p-5"
      style={{
        boxShadow:
          "0 0 0 1px rgba(10, 31, 24, 0.05), 0 1px 2px rgba(10, 31, 24, 0.03), 0 6px 20px rgba(10, 31, 24, 0.05)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ak-g-400,#7A8C85)]">
            Strokes Gained · Siste {summary.roundCount || 0} runder
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-[-0.02em]">
            {hasData ? "Hvor vinner du slagene?" : "Logg runder for å se SG"}
          </h3>
        </div>
        <span
          className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
          style={{
            borderColor: "var(--ak-border, rgba(10, 31, 24, 0.08))",
            color: "var(--ak-g-600, #3D5249)",
          }}
        >
          {peerLabel}
        </span>
      </div>

      {hasData ? (
        <div className="mt-3.5 flex flex-col gap-2.5">
          {rows.map((r) => {
            const v = r.value;
            const isPos = v !== null && v >= 0;
            const pct = v !== null ? clampPct(v) : 0;
            return (
              <div key={r.label} className="flex items-center gap-3">
                <div className="w-[90px] text-xs font-semibold text-[var(--ak-g-700,#324D45)]">
                  {r.label}
                </div>
                <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-[var(--ak-g-50,#F5F8F7)]">
                  <div
                    className="absolute top-0 bottom-0 z-10 w-px"
                    style={{
                      left: "50%",
                      background: "var(--ak-g-200, #D5DFDB)",
                    }}
                  />
                  {v !== null ? (
                    <div
                      className="absolute flex items-center px-2 text-[11px] font-bold tabular-nums text-white"
                      style={{
                        top: "4px",
                        bottom: "4px",
                        borderRadius: "4px",
                        background: isPos
                          ? "var(--ak-success, #2A7D5A)"
                          : "var(--ak-error, #B84233)",
                        ...(isPos
                          ? { left: "50%", width: `${pct}%` }
                          : { right: "50%", width: `${pct}%` }),
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
                    </div>
                  ) : null}
                </div>
                <div
                  className="w-12 text-right text-xs font-bold tabular-nums"
                  style={{
                    color:
                      v === null
                        ? "var(--ak-g-300, #A5B2AD)"
                        : v >= 0
                          ? "var(--ak-success, #2A7D5A)"
                          : "var(--ak-error, #B84233)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {v === null
                    ? "—"
                    : v >= 0
                      ? `+${v.toFixed(2)}`
                      : v.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-[var(--ak-g-50,#F5F8F7)] p-4 text-sm text-[var(--ak-g-500,#5A6E66)]">
          Du må registrere minst én runde for å se Strokes Gained-fordeling.
        </div>
      )}
    </div>
  );
}
