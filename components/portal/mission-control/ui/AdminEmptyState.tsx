import * as React from "react";
import { cn } from "@/lib/utils";

interface AdminEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function AdminEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "admin-card flex flex-col items-center justify-center text-center py-12 px-6",
        className,
      )}
    >
      {icon && (
        <div
          className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-surface-container text-on-surface-variant"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-on-surface">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-on-surface-variant">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
