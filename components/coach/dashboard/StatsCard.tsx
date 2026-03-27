interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatsCardProps) {
  return (
    <div className="rounded-xl bg-ink-95 p-6 border border-ink-90">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-ink-90 p-3">{icon}</div>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-ink-40">{title}</p>
        {subtitle && <p className="text-xs text-ink-50 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
