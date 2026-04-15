import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
}

export const AdminSelect = React.forwardRef<
  HTMLSelectElement,
  AdminSelectProps
>(function AdminSelect(
  {
    label,
    error,
    helper,
    id,
    className,
    containerClassName,
    children,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="admin-label block">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "admin-input appearance-none pr-9",
            error && "border-[var(--color-error)] focus:ring-[var(--color-error)]/20 focus:border-[var(--color-error)]",
            className,
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error
              ? `${selectId}-error`
              : helper
                ? `${selectId}-helper`
                : undefined
          }
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]"
          aria-hidden="true"
        />
      </div>
      {error ? (
        <p
          id={`${selectId}-error`}
          className="text-xs text-[var(--color-error)]"
          role="alert"
        >
          {error}
        </p>
      ) : helper ? (
        <p id={`${selectId}-helper`} className="text-xs text-[var(--color-muted)]">
          {helper}
        </p>
      ) : null}
    </div>
  );
});
