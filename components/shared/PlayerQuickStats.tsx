import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface PlayerQuickStatsProps {
  handicap: number | null;
  sgTotal: number | null;
  streakDays: number;
  compliancePercent?: number;
  className?: string;
}

export function PlayerQuickStats({
  handicap,
  sgTotal,
  streakDays,
  compliancePercent,
  className,
}: PlayerQuickStatsProps) {
  const nullPlaceholder = (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "13px",
        fontWeight: 700,
        color: "#C4C0B8",
      }}
    >
      &ndash;
    </span>
  );

  const sgColor =
    sgTotal === null
      ? "#C4C0B8"
      : sgTotal >= 0
        ? "#D1F843"
        : "#A32D2D";

  return (
    <div className={cn("inline-flex items-center gap-4", className)}>
      {/* HCP */}
      <div className="flex flex-col items-center gap-0.5">
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "9px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#9C9990",
            lineHeight: 1,
          }}
        >
          HCP
        </span>
        {handicap !== null ? (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
              fontWeight: 700,
              color: "#0A1F18",
              lineHeight: 1,
            }}
          >
            {handicap.toFixed(1)}
          </span>
        ) : (
          nullPlaceholder
        )}
      </div>

      {/* SG */}
      <div className="flex flex-col items-center gap-0.5">
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "9px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#9C9990",
            lineHeight: 1,
          }}
        >
          SG
        </span>
        {sgTotal !== null ? (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
              fontWeight: 500,
              color: sgColor,
              lineHeight: 1,
            }}
          >
            {sgTotal >= 0 ? "+" : ""}
            {sgTotal.toFixed(1)}
          </span>
        ) : (
          nullPlaceholder
        )}
      </div>

      {/* Streak */}
      <div className="flex items-center gap-0.5">
        <Flame size={12} strokeWidth={1.75} color="#B8852A" />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            fontWeight: 500,
            color: "#0A1F18",
            lineHeight: 1,
          }}
        >
          {streakDays}d
        </span>
      </div>

      {/* Compliance */}
      {compliancePercent !== undefined && (
        <div className="flex items-center gap-1.5">
          <div
            style={{
              width: "40px",
              height: "4px",
              borderRadius: "9999px",
              backgroundColor: "#EFEDE6",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(compliancePercent, 100)}%`,
                height: "100%",
                borderRadius: "9999px",
                backgroundColor: "#1A7D56",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              fontWeight: 500,
              color: "#5E5C57",
              lineHeight: 1,
            }}
          >
            {compliancePercent}%
          </span>
        </div>
      )}
    </div>
  );
}
