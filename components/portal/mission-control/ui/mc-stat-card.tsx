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
  default: "text-[#0A1F18]",
  success: "text-[var(--color-success)]",
  warning: "text-[#E89C30]",
  error: "text-[var(--color-error)]",
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
        "bg-white rounded-xl border border-[#D5DFDB] p-3",
        className
      )}
    >
      <div className="text-[9px] font-medium text-[#7A8C85] uppercase tracking-[0.5px] mb-1">
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
        <div className="text-[9px] text-[#7A8C85] mt-1">{subtext}</div>
      )}
    </div>
  );
}

// Mini sparkline SVG
function Sparkline({ direction }: { direction: "up" | "down" | "neutral" }) {
  const colors = {
    up: "#2A7D5A",
    down: "#B84233",
    neutral: "#7A8C85",
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
        "bg-white px-5 py-3 border-b border-[#D5DFDB]",
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
            <div className="text-[9px] text-[#7A8C85] leading-tight">
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
                success: "bg-[var(--mc-success-bg)] text-[var(--mc-success-text)]",
                warning: "bg-[#FEF3C7] text-[#92400E]",
                error: "bg-[#FEE2E2] text-[#991B1B]",
                info: "bg-[#DBEAFE] text-[#1E40AF]",
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
