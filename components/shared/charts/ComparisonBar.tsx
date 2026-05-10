import { cn } from "@/lib/utils";

interface ComparisonBarProps {
  label: string;
  playerValue: number;
  peerValue: number;
  benchmarkValue: number;
  unit?: string;
  higherIsBetter?: boolean;
  className?: string;
}

const BARS = [
  { key: "player", label: "Du", color: "#005840" },
  { key: "peer", label: "Peer", color: "#9C9990" },
  { key: "benchmark", label: "Sammenligning", color: "#D1F843" },
] as const;

export function ComparisonBar({
  label,
  playerValue,
  peerValue,
  benchmarkValue,
  unit = "",
  className,
}: ComparisonBarProps) {
  const values = { player: playerValue, peer: peerValue, benchmark: benchmarkValue };
  const maxValue = Math.max(playerValue, peerValue, benchmarkValue, 0.01);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <span
        className="text-xs font-medium uppercase tracking-[0.04em]"
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: "#5E5C57",
        }}
      >
        {label}
      </span>

      <div className="flex flex-col gap-2">
        {BARS.map((bar) => {
          const value = values[bar.key];
          const widthPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;

          return (
            <div key={bar.key} className="flex items-center gap-3">
              <span
                className="w-24 shrink-0 text-xs"
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  color: "#5E5C57",
                }}
              >
                {bar.label}
              </span>

              <div className="relative flex-1 h-6 rounded bg-[#EFEDE6]">
                <div
                  className="absolute inset-y-0 left-0 rounded"
                  style={{
                    width: `${Math.max(widthPercent, 2)}%`,
                    backgroundColor: bar.color,
                    transition: "width 320ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </div>

              <span
                className="w-16 shrink-0 text-right text-xs"
                style={{
                  fontFamily:
                    "var(--font-jetbrains-mono), JetBrains Mono, monospace",
                  fontVariantNumeric: "tabular-nums",
                  color: "#0A1F18",
                }}
              >
                {value.toFixed(1)}
                {unit ? ` ${unit}` : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
