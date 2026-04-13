import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'training' | 'stat';
  borderColor?: 'none' | 'green' | 'lime' | 'blue' | 'purple';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  borderColor = 'none',
  className,
  ...props
}) => {
  const baseStyles = 'rounded-xl bg-white p-5 border border-[#D5DFDB]';
  
  const variants = {
    default: '',
    hover: 'transition-all duration-200 hover:border-[#A5B2AD] hover:-translate-y-0.5 cursor-pointer',
    training: 'border-l-4',
    stat: '',
  };
  
  const borderColors = {
    none: '',
    green: borderColor === 'green' && variant === 'training' ? 'border-l-[#1A4D36]' : 'border-[#1A4D36]',
    lime: borderColor === 'lime' && variant === 'training' ? 'border-l-[#D1F843]' : 'border-[#D1F843]',
    blue: borderColor === 'blue' && variant === 'training' ? 'border-l-[#3B82F6]' : 'border-[#3B82F6]',
    purple: borderColor === 'purple' && variant === 'training' ? 'border-l-[#AF52DE]' : 'border-[#AF52DE]',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], borderColors[borderColor], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex items-center justify-between mb-4', className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn('text-lg font-semibold text-[#0A1F18]', className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('text-[#324D45]', className)} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex items-center justify-between mt-4 pt-4 border-t border-[#D5DFDB]', className)} {...props} />
);
