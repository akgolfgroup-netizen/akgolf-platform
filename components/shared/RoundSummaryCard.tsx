import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface RoundSummaryCardProps {
  date: string;
  courseName: string;
  score: number;
  par: number;
  sgTotal: number;
  fairwaysHit: string;
  greensInReg: string;
  putts: number;
  onClick?: () => void;
  className?: string;
}

export function RoundSummaryCard({
  date,
  courseName,
  score,
  par,
  sgTotal,
  fairwaysHit,
  greensInReg,
  putts,
  onClick,
  className,
}: RoundSummaryCardProps) {
  const diff = score - par;
  const diffLabel = diff === 0 ? "E" : diff > 0 ? `+${diff}` : `${diff}`;
  const sgPositive = sgTotal >= 0;

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      {...(onClick ? { onClick, type: "button" as const } : {})}
      className={cn(
        "flex w-full items-center gap-4 rounded-[20px] border bg-white p-4",
        "border-[#E5E3DD]",
        "[box-shadow:0_1px_2px_rgba(15,31,24,0.04),0_4px_12px_rgba(15,31,24,0.04)]",
        onClick && "cursor-pointer transition-colors duration-200 hover:border-[#005840]",
        className
      )}
    >
      {/* Left: score block */}
      <div className="flex shrink-0 flex-col items-center gap-1">
        <span
          className="leading-none"
          style={{
            fontFamily:
              "var(--font-jetbrains-mono), JetBrains Mono, monospace",
            fontSize: 32,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            color: "#0A1F18",
          }}
        >
          {score}
        </span>
        <span
          className="leading-none"
          style={{
            fontFamily:
              "var(--font-jetbrains-mono), JetBrains Mono, monospace",
            fontSize: 12,
            fontWeight: 500,
            color: "#9C9990",
          }}
        >
          {diffLabel}
        </span>
      </div>

      {/* Middle: course info + SG */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className="truncate"
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: "#5E5C57",
          }}
        >
          {courseName}
        </span>
        <span
          style={{
            fontFamily:
              "var(--font-jetbrains-mono), JetBrains Mono, monospace",
            fontSize: 10,
            fontWeight: 400,
            color: "#9C9990",
          }}
        >
          {date}
        </span>
        <div className="mt-1 flex items-center gap-1">
          {sgPositive ? (
            <TrendingUp
              size={14}
              strokeWidth={1.75}
              style={{ color: "#1A7D56" }}
            />
          ) : (
            <TrendingDown
              size={14}
              strokeWidth={1.75}
              style={{ color: "#A32D2D" }}
            />
          )}
          <span
            style={{
              fontFamily:
                "var(--font-jetbrains-mono), JetBrains Mono, monospace",
              fontSize: 12,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
              color: sgPositive ? "#1A7D56" : "#A32D2D",
            }}
          >
            SG {sgTotal >= 0 ? `+${sgTotal.toFixed(1)}` : sgTotal.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Right: compact stats */}
      <div className="flex shrink-0 gap-4">
        <StatColumn label="FIR" value={fairwaysHit} />
        <StatColumn label="GIR" value={greensInReg} />
        <StatColumn label="Putts" value={String(putts)} />
      </div>
    </Wrapper>
  );
}

function StatColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#9C9990",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily:
            "var(--font-jetbrains-mono), JetBrains Mono, monospace",
          fontSize: 14,
          fontWeight: 600,
          fontVariantNumeric: "tabular-nums",
          color: "#0A1F18",
        }}
      >
        {value}
      </span>
    </div>
  );
}
