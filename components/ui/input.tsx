"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const hasError = Boolean(error);
    const hasHelper = Boolean(helperText);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-grey-700)] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-grey-500)]" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : hasHelper ? helperId : undefined
            }
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white",
              "text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]",
              "transition-[border-color,box-shadow] duration-200",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-400)]/50 focus:border-[var(--color-grey-900)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              hasError && "border-[var(--color-error)] focus:ring-[var(--color-error)]/50 focus:border-[var(--color-error)]",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-grey-500)]" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {hasError && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-error)]" role="alert">
            {error}
          </p>
        )}
        {!hasError && hasHelper && (
          <p id={helperId} className="mt-1.5 text-sm text-[var(--color-grey-500)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
