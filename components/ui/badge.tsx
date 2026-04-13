import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'muted' | 'pro' | 'lime' | 'purple';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
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
    default: 'bg-grey-100 text-text border border-grey-200',
    secondary: 'bg-grey-100 text-grey-500 border border-grey-200',
    success: 'bg-success-light text-success-text',
    warning: 'bg-warning-light text-warning-text',
    error: 'bg-error-light text-error-text',
    info: 'bg-info-light text-info-text',
    muted: 'bg-grey-50 text-grey-400 border border-grey-200',
    pro: 'bg-accent-cta text-accent-cta-text',
    lime: 'bg-accent-cta text-accent-cta-text',
    purple: 'bg-ai-light text-ai-text',
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
