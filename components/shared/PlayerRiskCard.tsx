import { cn } from "@/lib/utils";

interface PlayerRiskCardProps {
  playerName: string;
  playerInitials: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskScore: number;
  factors: string[];
  lastActivity?: string;
  className?: string;
}

const RISK_CONFIG = {
  low: { color: "#1A7D56", label: "Lav", bg: "#E5F1EA" },
  medium: { color: "#B8852A", label: "Middels", bg: "#FFF0D6" },
  high: { color: "#D1F843", label: "Hoy", bg: "rgba(209,248,67,0.12)" },
  critical: { color: "#A32D2D", label: "Kritisk", bg: "#FAE3E3" },
} as const;

function formatLastActivity(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Sist aktiv: i dag";
  if (diffDays === 1) return "Sist aktiv: i gar";
  return `Sist aktiv: ${diffDays} dager siden`;
}

export function PlayerRiskCard({
  playerName,
  playerInitials,
  riskLevel,
  riskScore,
  factors,
  lastActivity,
  className,
}: PlayerRiskCardProps) {
  const config = RISK_CONFIG[riskLevel];
  const visibleFactors = factors.slice(0, 3);

  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E3DD",
        borderRadius: "20px",
        padding: "20px",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      {/* Header: avatar + name */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "9999px",
            backgroundColor: config.color,
            color:
              riskLevel === "high" ? "#0A1F18" : "#FFFFFF",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {playerInitials}
          </span>
        </div>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#0A1F18",
          }}
        >
          {playerName}
        </span>
      </div>

      {/* Risk score + pill */}
      <div className="flex items-center gap-3">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "28px",
            fontWeight: 700,
            color: config.color,
            lineHeight: 1,
          }}
        >
          {riskScore}
        </span>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: 600,
            color: riskLevel === "high" ? "#0A1F18" : config.color,
            backgroundColor: config.bg,
            borderRadius: "9999px",
            padding: "4px 12px",
            lineHeight: 1.2,
          }}
        >
          {config.label}
        </span>
      </div>

      {/* Factors */}
      {visibleFactors.length > 0 && (
        <ul
          className="flex flex-col gap-1"
          style={{
            margin: 0,
            paddingLeft: "16px",
          }}
        >
          {visibleFactors.map((factor) => (
            <li
              key={factor}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#5E5C57",
                lineHeight: 1.5,
              }}
            >
              {factor}
            </li>
          ))}
        </ul>
      )}

      {/* Last activity */}
      {lastActivity && (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: "#9C9990",
            lineHeight: 1,
          }}
        >
          {formatLastActivity(lastActivity)}
        </span>
      )}
    </div>
  );
}
