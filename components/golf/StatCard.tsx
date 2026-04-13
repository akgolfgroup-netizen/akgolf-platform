import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'green' | 'blue' | 'gold' | 'default';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  subtitle,
  icon,
  color = 'default',
}) => {
  const colorStyles = {
    green: 'text-[#16A34A]',
    blue: 'text-[#3B82F6]',
    gold: 'text-[#D4AF37]',
    default: 'text-white',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-[#16A34A]' : trend === 'down' ? 'text-[#EF4444]' : 'text-white/50';

  return (
    <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-white/50">{title}</span>
        {icon && <div className="text-white/30">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={cn("text-3xl font-bold", colorStyles[color])}>
          {value}
        </span>
        {unit && <span className="text-white/50 text-sm">{unit}</span>}
      </div>
      
      {(trend || subtitle) && (
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
              <TrendIcon size={14} />
              <span>{trendValue}</span>
            </div>
          )}
          {subtitle && <span className="text-sm text-white/40">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
