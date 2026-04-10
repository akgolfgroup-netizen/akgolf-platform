import * as React from "react";
import { cn } from "@/lib/utils";

interface AdminTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
}

export const AdminTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AdminTextareaProps
>(function AdminTextarea(
  { label, error, helper, id, className, containerClassName, rows = 4, ...props },
  ref,
) {
  const textareaId = id ?? React.useId();

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="admin-label block">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          "admin-input resize-y",
          error && "border-[var(--color-error)] focus:ring-[var(--color-error)]/20 focus:border-[var(--color-error)]",
          className,
        )}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={
          error
            ? `${textareaId}-error`
            : helper
              ? `${textareaId}-helper`
              : undefined
        }
        {...props}
      />
      {error ? (
        <p
          id={`${textareaId}-error`}
          className="text-xs text-[var(--color-error)]"
          role="alert"
        >
          {error}
        </p>
      ) : helper ? (
        <p id={`${textareaId}-helper`} className="text-xs text-[var(--color-muted)]">
          {helper}
        </p>
      ) : null}
    </div>
  );
});
