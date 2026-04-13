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
        <label className="block text-sm font-medium text-[#5A6E66] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A5B2AD]">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-white border border-[#D5DFDB] rounded-lg px-4 py-3 text-[#0A1F18] placeholder:text-[#A5B2AD]',
            'focus:outline-none focus:border-[#0A1F18] focus:ring-1 focus:ring-[#0A1F18]',
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

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#5A6E66] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full bg-white border border-[#D5DFDB] rounded-lg px-4 py-3 text-[#0A1F18] placeholder:text-[#A5B2AD]',
          'focus:outline-none focus:border-[#0A1F18] focus:ring-1 focus:ring-[#0A1F18]',
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
