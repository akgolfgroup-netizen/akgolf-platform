import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder:text-white/40',
            'focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]',
            'transition-colors duration-200',
            icon && 'pl-10',
            error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
};

// TextArea variant
export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder:text-white/40',
          'focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]',
          'transition-colors duration-200 resize-none',
          error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
};
