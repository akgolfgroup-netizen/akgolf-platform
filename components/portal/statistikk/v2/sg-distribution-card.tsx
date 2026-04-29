"use client";

interface SgDistributionCardProps {
  offTheTee: number | null;
  approach: number | null;
  aroundTheGreen: number | null;
  putting: number | null;
  total: number | null;
  roundCount: number;
}

interface BarRow {
  label: string;
  value: number | null;
}

/**
 * Strokes Gained-fordeling med +/- barer rundt 0-linjen.
 * Brand Guide V2.0 hvitt kort.
 */
export function SgDistributionCard({
  offTheTee,
  approach,
  aroundTheGreen,
  putting,
  total,
  roundCount,
}: SgDistributionCardProps) {
  const rows: BarRow[] = [
    { label: "Tee", value: offTheTee },
    { label: "Approach", value: approach },
    { label: "Around green", value: aroundTheGreen },
    { label: "Putting", value: putting },
  ];

  const hasData = rows.some((r) => r.value !== null);

  // Skala: maks-bar tilsvarer 50% av sporet
  const allValues = rows
    .map((r) => r.value)
    .filter((v): v is number => v !== null);
  const maxAbs = allValues.length > 0
    ? Math.max(...allValues.map((v) => Math.abs(v)), 1.5)
    : 1.5;

  const widthPct = (v: number) =>
    Math.min(48, Math.abs(v) / maxAbs * 48);

  return (
    <section
      className="col-span-12 lg:col-span-7 rounded-2xl border bg-card p-6"
      style={{
        borderColor: "var(--color-line, #E4EAE6)",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div
            className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
          >
            Strokes Gained · {roundCount} runder
          </div>
          <h3
            className="mt-1.5 font-inter-tight text-[22px] font-bold tracking-[-0.025em]"
            style={{ color: "var(--color-ink, #0A1F18)" }}
          >
            {hasData ? "Hvor vinner du slagene?" : "Logg runder for å se SG"}
          </h3>
        </div>
        {total !== null ? (
          <div
            className="rounded-md px-2.5 py-1.5 font-mono text-[12px] font-bold tabular-nums"
            style={{
              background:
                total >= 0
                  ? "rgba(42, 125, 90, 0.12)"
                  : "rgba(184, 66, 51, 0.12)",
              color:
                total >= 0
                  ? "var(--color-success, #2A7D5A)"
                  : "var(--color-danger, #B84233)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {total >= 0 ? "+" : ""}
            {total.toFixed(2)} total
          </div>
        ) : null}
      </div>

      {hasData ? (
        <div className="mt-5 flex flex-col gap-2.5">
          {rows.map((r) => {
            const v = r.value;
            const isPos = v !== null && v >= 0;
            const pct = v !== null ? widthPct(v) : 0;
            return (
              <div key={r.label} className="flex items-center gap-3">
                <div
                  className="w-[100px] text-[13px] font-semibold"
                  style={{ color: "var(--color-ink, #0A1F18)" }}
                >
                  {r.label}
                </div>
                <div
                  className="relative h-7 flex-1 overflow-hidden rounded-md"
                  style={{ background: "rgba(10, 31, 24, 0.04)" }}
                >
                  <div
                    className="absolute top-0 bottom-0 w-px"
                    style={{
                      left: "50%",
                      background: "rgba(10, 31, 24, 0.12)",
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
                          ? "var(--color-success, #2A7D5A)"
                          : "var(--color-danger, #B84233)",
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
                  className="w-14 text-right font-mono text-xs font-bold tabular-nums"
                  style={{
                    color:
                      v === null
                        ? "var(--color-ink-subtle, #6F7A74)"
                        : v >= 0
                          ? "var(--color-success, #2A7D5A)"
                          : "var(--color-danger, #B84233)",
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
        <div
          className="mt-5 rounded-lg p-5 text-sm"
          style={{
            background: "var(--color-surface-soft, #EDF1EE)",
            color: "var(--color-ink-muted, #5C6B62)",
          }}
        >
          Du må registrere minst én runde med SG-data for å se fordelingen.
        </div>
      )}
    </section>
  );
}
