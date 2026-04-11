import { cn } from "@/lib/portal/utils/cn";

type StatVariant = "default" | "success" | "warning" | "error";

interface MCStatCardProps {
  label: string;
  value: string | number;
  variant?: StatVariant;
  subtext?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

const valueColors: Record<StatVariant, string> = {
  default: "text-black",
  success: "text-success",
  warning: "text-[var(--color-warning)]",
  error: "text-error",
};

export function MCStatCard({
  label,
  value,
  variant = "default",
  subtext,
  trend,
  className,
}: MCStatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-grey-200 p-3",
        className
      )}
    >
      <div className="text-[9px] font-medium text-[var(--color-grey-400)] uppercase tracking-[0.5px] mb-1">
        {label}
      </div>
      <div className="flex items-center gap-2">
        <div className={cn("text-2xl font-bold", valueColors[variant])}>
          {value}
        </div>
        {trend && (
          <Sparkline direction={trend.direction} />
        )}
      </div>
      {subtext && (
        <div className="text-[9px] text-[var(--color-grey-400)] mt-1">{subtext}</div>
      )}
    </div>
  );
}

// Mini sparkline SVG
function Sparkline({ direction }: { direction: "up" | "down" | "neutral" }) {
  const colors = {
    up: "#2A7D5A",
    down: "#B84233",
    neutral: "var(--color-grey-400)",
  };

  const paths = {
    up: "0,12 8,10 16,8 24,6 32,4 40,2",
    down: "0,2 8,4 16,6 24,8 32,10 40,12",
    neutral: "0,8 8,7 16,8 24,7 32,8 40,7",
  };

  return (
    <svg width="40" height="16" viewBox="0 0 40 16" className="inline-block">
      <polyline
        fill="none"
        stroke={colors[direction]}
        strokeWidth="1.5"
        points={paths[direction]}
      />
    </svg>
  );
}

// KPI Strip component
interface KPIItem {
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: StatVariant;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
}

interface MCKPIStripProps {
  items: KPIItem[];
  alerts?: { label: string; variant: "success" | "warning" | "error" | "info" }[];
  className?: string;
}

export function MCKPIStrip({ items, alerts, className }: MCKPIStripProps) {
  return (
    <div
      className={cn(
        "bg-white px-5 py-3 border-b border-grey-200",
        className
      )}
    >
      <div className="flex items-center gap-6">
        {items.map((item, index) => (
          <div key={item.label} className="flex items-center gap-2">
            {index > 0 && (
              <div className="w-px h-8 bg-[#D5DFDB] -ml-3 mr-3" />
            )}
            <div className={cn("text-2xl font-bold", valueColors[item.variant || "default"])}>
              {item.value}
            </div>
            <div className="text-[9px] text-[var(--color-grey-400)] leading-tight">
              {item.label.toUpperCase()}
              {item.sublabel && <br />}
              {item.sublabel?.toUpperCase()}
            </div>
            {item.trend && <Sparkline direction={item.trend.direction} />}
          </div>
        ))}

        {/* Alerts */}
        {alerts && alerts.length > 0 && (
          <div className="ml-auto flex gap-2">
            {alerts.map((alert) => {
              const alertColors = {
                success: "bg-success-light text-success-text",
                warning: "bg-warning-light text-warning-text",
                error: "bg-error-light text-error-text",
                info: "bg-info-light text-info-text",
              };
              return (
                <span
                  key={alert.label}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-medium",
                    alertColors[alert.variant]
                  )}
                >
                  {alert.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
