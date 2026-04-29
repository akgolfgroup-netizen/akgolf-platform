// Server Component — Strokes Gained-barer rendres rent som markup.
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
      className="col-span-12 md:col-span-6 rounded-2xl bg-card p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-subtle">
            Strokes Gained · Siste {summary.roundCount || 0} runder
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-[-0.02em] text-ink">
            {hasData ? "Hvor vinner du slagene?" : "Logg runder for å se SG"}
          </h3>
        </div>
        <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-ink-muted">
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
                <div className="w-[90px] text-xs font-semibold text-ink-muted">
                  {r.label}
                </div>
                <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-surface-soft">
                  <div className="absolute top-0 bottom-0 z-10 w-px left-1/2 bg-line" />
                  {v !== null ? (
                    <div
                      className="absolute flex items-center px-2 text-[11px] font-bold tabular-nums text-white"
                      style={{
                        top: "4px",
                        bottom: "4px",
                        borderRadius: "4px",
                        background: isPos ? "var(--color-success)" : "var(--color-error)",
                        ...(isPos ? { left: "50%", width: `${pct}%` } : { right: "50%", width: `${pct}%` }),
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
                        ? "var(--color-line)"
                        : v >= 0
                          ? "var(--color-success)"
                          : "var(--color-error)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {v === null ? "—" : v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-surface-soft p-4 text-sm text-ink-muted">
          Du må registrere minst én runde for å se Strokes Gained-fordeling.
        </div>
      )}
    </div>
  );
}
