import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'training' | 'stat';
  borderColor?: 'none' | 'green' | 'gold' | 'bronze' | 'blue';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  borderColor = 'none',
  className,
  ...props
}) => {
  const baseStyles = 'rounded-xl bg-[#1E293B] p-5';
  
  const variants = {
    default: '',
    hover: 'transition-all duration-200 hover:bg-[#334155] hover:-translate-y-0.5 cursor-pointer',
    training: 'border-l-4',
    stat: 'border border-[#334155]',
  };
  
  const borderColors = {
    none: '',
    green: borderColor === 'green' && variant === 'training' ? 'border-l-[#16A34A]' : 'border-[#16A34A]',
    gold: borderColor === 'gold' && variant === 'training' ? 'border-l-[#D4AF37]' : 'border-[#D4AF37]',
    bronze: borderColor === 'bronze' && variant === 'training' ? 'border-l-[#CD7F32]' : 'border-[#CD7F32]',
    blue: borderColor === 'blue' && variant === 'training' ? 'border-l-[#3B82F6]' : 'border-[#3B82F6]',
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

// Sub-komponenter for Card
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex items-center justify-between mb-4', className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn('text-lg font-semibold text-white', className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('text-white/70', className)} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex items-center justify-between mt-4 pt-4 border-t border-[#334155]', className)} {...props} />
);
