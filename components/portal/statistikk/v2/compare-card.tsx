import { TrendingDown, TrendingUp } from "lucide-react";

interface BarValue {
  value: number;
  display: string;
}

interface CompareCardProps {
  title: string;
  subtitle: string;
  percentile: number;
  you: BarValue;
  peer: BarValue;
  pyramid: BarValue;
  /** Hvor mye 100% av baren tilsvarer i kontekst (f.eks. max yards). */
  scaleMax?: number;
  /** Lavere er bedre? Snur bar-utregning + delta-tegn. */
  lowerIsBetter?: boolean;
  delta: { value: number; suffix?: string };
}

/**
 * Sammenlignings-kort fra a13-sammenligning.html.
 * Hvit Brand Guide V2.0-stil med tre stablete barer (Du / Peer / Pyramide).
 */
export function CompareCard({
  title,
  subtitle,
  percentile,
  you,
  peer,
  pyramid,
  scaleMax,
  lowerIsBetter = false,
  delta,
}: CompareCardProps) {
  const max = scaleMax ?? Math.max(you.value, peer.value, pyramid.value, 1);
  const widthFor = (v: number) => {
    if (max === 0) return 0;
    if (lowerIsBetter) {
      // Inverter: laveste verdi = lengste bar
      const ratio = max > 0 ? Math.max(0, 1 - (v - max * 0.6) / (max * 0.4)) : 0;
      return Math.max(8, Math.min(100, ratio * 100));
    }
    return Math.max(4, Math.min(100, (v / max) * 100));
  };

  let percChip: { bg: string; color: string; label: string };
  if (percentile >= 60) {
    percChip = {
      bg: "rgba(42, 125, 90, 0.16)",
      color: "#1A4D36",
      label: `${percentile}. perc`,
    };
  } else if (percentile >= 35) {
    percChip = {
      bg: "rgba(196, 138, 50, 0.18)",
      color: "#7A5520",
      label: `${percentile}. perc`,
    };
  } else {
    percChip = {
      bg: "rgba(184, 66, 51, 0.16)",
      color: "#7A2C22",
      label: `${percentile}. perc`,
    };
  }

  const deltaIsGood = lowerIsBetter ? delta.value < 0 : delta.value > 0;
  const DeltaIcon = deltaIsGood ? TrendingUp : TrendingDown;

  return (
    <div
      className="rounded-2xl border bg-card p-6"
      style={{
        borderColor: "var(--color-line, #E4EAE6)",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className="text-sm font-semibold"
            style={{ color: "var(--color-ink, #0A1F18)" }}
          >
            {title}
          </div>
          <div
            className="mt-0.5 text-[11px]"
            style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
          >
            {subtitle}
          </div>
        </div>
        <span
          className="rounded-md px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ background: percChip.bg, color: percChip.color }}
        >
          {percChip.label}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {[
          {
            label: "Du",
            value: you,
            color: "#005840",
            width: widthFor(you.value),
          },
          {
            label: "Peer",
            value: peer,
            color: "#6BB1FF",
            width: widthFor(peer.value),
          },
          {
            label: "Pyramide",
            value: pyramid,
            color: "rgba(10, 31, 24, 0.2)",
            width: widthFor(pyramid.value),
          },
        ].map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--color-ink-muted, #5C6B62)" }}
              >
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: row.color }}
                />
                {row.label}
              </span>
              <span
                className="font-mono text-[12px] font-bold tabular-nums"
                style={{
                  color: "var(--color-ink, #0A1F18)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {row.value.display}
              </span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full"
              style={{ background: "rgba(10, 31, 24, 0.05)" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${row.width}%`, background: row.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-5 flex items-center justify-between border-t pt-4"
        style={{ borderColor: "var(--color-line-soft, #EDF1EE)" }}
      >
        <span
          className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]"
          style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
        >
          vs peer
        </span>
        <span
          className="inline-flex items-center gap-1 font-mono text-[12px] font-bold tabular-nums"
          style={{
            color: deltaIsGood
              ? "var(--color-success, #2A7D5A)"
              : "var(--color-danger, #B84233)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <DeltaIcon className="h-3.5 w-3.5" />
          {delta.value > 0 ? "+" : ""}
          {delta.value}
          {delta.suffix ?? ""}
        </span>
      </div>
    </div>
  );
}
