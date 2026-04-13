import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'pro' | 'elite' | 'free' | 'gir' | 'bogey' | 'birdie' | 'success' | 'warning' | 'error' | 'lime' | 'purple';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'free',
  size = 'sm',
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full';
  
  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  
  const variants: Record<BadgeVariant, string> = {
    pro: 'bg-[#D1F843] text-[#0A1F18]',
    elite: 'bg-[#CD7F32] text-white',
    free: 'bg-[#F5F8F7] text-[#5A6E66] border border-[#D5DFDB]',
    gir: 'bg-[#1A4D36] text-white',
    bogey: 'bg-[#F97316] text-white',
    birdie: 'bg-[#3B82F6] text-white',
    success: 'bg-[#E8F5EF] text-[#1A4D36]',
    warning: 'bg-[#FDF4E4] text-[#7A5520]',
    error: 'bg-[#FCEAE8] text-[#7A2C22]',
    lime: 'bg-[#D1F843] text-[#0A1F18]',
    purple: 'bg-[#FAF5FF] text-[#AF52DE]',
  };

  return (
    <span
      className={cn(baseStyles, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
