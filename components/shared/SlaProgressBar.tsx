import { cn } from "@/lib/utils";

interface SlaProgressBarProps {
  elapsedMinutes: number;
  slaMinutes: number;
  label?: string;
  className?: string;
}

export function SlaProgressBar({
  elapsedMinutes,
  slaMinutes,
  label,
  className,
}: SlaProgressBarProps) {
  const percent = slaMinutes > 0 ? (elapsedMinutes / slaMinutes) * 100 : 0;
  const clampedPercent = Math.min(percent, 100);
  const isOverSla = elapsedMinutes > slaMinutes;

  let fillColor = "#1A7D56"; // success
  if (percent > 90) {
    fillColor = "#A32D2D"; // danger
  } else if (percent >= 70) {
    fillColor = "#B8852A"; // warning
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: "6px",
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

      {/* Label and time */}
      <div className="flex items-center justify-between">
        {label && (
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: "#5E5C57",
              lineHeight: 1,
            }}
          >
            {label}
          </span>
        )}
        {!label && <span />}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            fontWeight: 500,
            color: isOverSla ? "#A32D2D" : "#5E5C57",
            lineHeight: 1,
          }}
        >
          {elapsedMinutes}m / {slaMinutes}m
        </span>
      </div>
    </div>
  );
}
