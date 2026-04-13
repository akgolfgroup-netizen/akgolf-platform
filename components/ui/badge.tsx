import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'pro' | 'elite' | 'free' | 'gir' | 'bogey' | 'birdie' | 'success' | 'warning' | 'error';

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
  const baseStyles = 'inline-flex items-center font-medium rounded-full';
  
  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  
  const variants: Record<BadgeVariant, string> = {
    pro: 'bg-[#D4AF37] text-[#0F172A]',           // Gull for Pro
    elite: 'bg-[#CD7F32] text-white',              // Bronse for Elite
    free: 'bg-[#334155] text-white',               // Grå for Free
    gir: 'bg-[#16A34A] text-white',                // Grønn for GIR
    bogey: 'bg-[#F97316] text-white',              // Oransje for Bogey
    birdie: 'bg-[#3B82F6] text-white',             // Blå for Birdie
    success: 'bg-[#16A34A] text-white',
    warning: 'bg-[#F97316] text-white',
    error: 'bg-[#EF4444] text-white',
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
