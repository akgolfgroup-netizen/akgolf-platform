import * as React from "react";
import { cn } from "@/lib/utils";

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
}

export const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  function AdminInput(
    { label, error, helper, id, className, containerClassName, ...props },
    ref,
  ) {
    const inputId = id ?? React.useId();

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="admin-label block">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "admin-input",
            error && "border-[var(--color-error)] focus:ring-[var(--color-error)]/20 focus:border-[var(--color-error)]",
            className,
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error ? (
          <p
            id={`${inputId}-error`}
            className="text-xs text-[var(--color-error)]"
            role="alert"
          >
            {error}
          </p>
        ) : helper ? (
          <p id={`${inputId}-helper`} className="text-xs text-[var(--color-muted)]">
            {helper}
          </p>
        ) : null}
      </div>
    );
  },
);
