import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'muted' | 'pro' | 'lime' | 'purple' | 'wang';

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
    default: 'bg-surface-container text-text border border-outline-variant/30',
    secondary: 'bg-surface-container text-on-surface-variant/80 border border-outline-variant/30',
    success: 'bg-success-light text-success-text',
    warning: 'bg-warning-light text-warning-text',
    error: 'bg-error-light text-error-text',
    info: 'bg-info-light text-info-text',
    muted: 'bg-surface text-on-surface-variant border border-outline-variant/30',
    pro: 'bg-secondary-fixed text-secondary-fixed-text',
    lime: 'bg-secondary-fixed text-secondary-fixed-text',
    purple: 'bg-ai-light text-ai-text',
    wang: 'bg-[#2563eb] text-white',
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
