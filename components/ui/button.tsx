import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'destructive' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  asChild = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-secondary-fixed text-secondary-fixed-text hover:brightness-95 focus:ring-accent-cta active:scale-95',
    secondary: 'bg-surface-container-lowest border border-outline-variant/30 text-text hover:border-outline-variant/50 focus:ring-grey-200',
    dark: 'bg-on-surface text-surface hover:bg-inverse-surface focus:ring-black active:scale-95',
    destructive: 'bg-error text-surface hover:bg-error-text focus:ring-error',
    ghost: 'bg-transparent text-on-surface-variant/80 hover:text-on-surface hover:bg-surface',
    accent: 'bg-secondary-fixed text-secondary-fixed-text hover:opacity-90 focus:ring-accent-cta active:scale-95',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-full',
    md: 'px-5 py-2.5 text-sm rounded-full',
    lg: 'px-6 py-3 text-base rounded-full',
  };

  const computedClassName = cn(baseStyles, variants[variant], sizes[size], className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{ className?: string }>,
      {
        className: cn(computedClassName, (children.props as { className?: string }).className),
        ...props,
      }
    );
  }

  return (
    <button
      className={computedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Laster...
        </>
      ) : (
        children
      )}
    </button>
  );
};
