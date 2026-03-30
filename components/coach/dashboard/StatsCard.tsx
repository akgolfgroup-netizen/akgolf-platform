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
    <div className="rounded-xl bg-white p-6 border border-[var(--color-grey-200)]">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-[var(--color-grey-100)] p-3">{icon}</div>
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
        <p className="text-3xl font-bold text-[var(--color-grey-900)]">{value}</p>
        <p className="text-sm text-[var(--color-grey-400)]">{title}</p>
        {subtitle && <p className="text-xs text-[var(--color-grey-500)] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
