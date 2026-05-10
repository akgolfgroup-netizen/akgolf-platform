import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GoalProgressCardProps {
  title: string;
  currentValue: number;
  targetValue: number;
  unit?: string;
  deadline?: string;
  icon?: ReactNode;
  className?: string;
}

function formatDeadline(isoDate: string): string {
  const date = new Date(isoDate);
  const months = [
    "jan", "feb", "mar", "apr", "mai", "jun",
    "jul", "aug", "sep", "okt", "nov", "des",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `Frist: ${day}. ${month} ${year}`;
}

function isDeadlinePassed(isoDate: string): boolean {
  return new Date(isoDate) < new Date();
}

export function GoalProgressCard({
  title,
  currentValue,
  targetValue,
  unit,
  deadline,
  icon,
  className,
}: GoalProgressCardProps) {
  const percent =
    targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
  const clampedPercent = Math.min(percent, 100);
  const goalReached = percent >= 100;

  // Fill color: lime normally, success-green if target reached
  const fillColor = goalReached ? "#1A7D56" : "#D1F843";

  // Percent text color
  let percentColor = "#A32D2D"; // under 50%
  if (percent >= 80) {
    percentColor = "#1A7D56";
  } else if (percent >= 50) {
    percentColor = "#B8852A";
  }

  // Border: red if deadline passed and goal not reached
  const deadlinePassed = deadline ? isDeadlinePassed(deadline) : false;
  const borderColor =
    deadlinePassed && !goalReached ? "#A32D2D" : "#E5E3DD";

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${borderColor}`,
        borderRadius: "20px",
        padding: "20px",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      {/* Title row */}
      <div className="flex items-center gap-2">
        {icon && (
          <span
            style={{
              color: "#005840",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </span>
        )}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#0A1F18",
          }}
        >
          {title}
        </span>
      </div>

      {/* Progress bar + percent */}
      <div className="flex items-center gap-3">
        <div
          className="flex-1"
          style={{
            height: "8px",
            borderRadius: "9999px",
            backgroundColor: "#EFEDE6",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${clampedPercent}%`,
              height: "100%",
              borderRadius: "9999px",
              backgroundColor: fillColor,
              transition: "width 200ms ease-out",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "20px",
            fontWeight: 700,
            color: percentColor,
            lineHeight: 1,
            minWidth: "48px",
            textAlign: "right",
          }}
        >
          {Math.round(percent)}%
        </span>
      </div>

      {/* Value and deadline */}
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            fontWeight: 500,
            color: "#0A1F18",
            lineHeight: 1,
          }}
        >
          {currentValue} / {targetValue}
          {unit ? ` ${unit}` : ""}
        </span>

        {deadline && (
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              color: deadlinePassed && !goalReached ? "#A32D2D" : "#9C9990",
              lineHeight: 1,
            }}
          >
            {formatDeadline(deadline)}
          </span>
        )}
      </div>
    </div>
  );
}
