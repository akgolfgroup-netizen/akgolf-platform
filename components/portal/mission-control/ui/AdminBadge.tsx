import * as React from "react";
import { cn } from "@/lib/utils";

type AdminBadgeVariant = "success" | "warning" | "error" | "info" | "muted";

interface AdminBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: AdminBadgeVariant;
  icon?: React.ReactNode;
}

const variantClass: Record<AdminBadgeVariant, string> = {
  success: "admin-badge-success",
  warning: "admin-badge-warning",
  error: "admin-badge-error",
  info: "admin-badge-info",
  muted: "admin-badge-muted",
};

export function AdminBadge({
  variant = "muted",
  icon,
  className,
  children,
  ...props
}: AdminBadgeProps) {
  return (
    <span
      className={cn("admin-badge", variantClass[variant], className)}
      {...props}
    >
      {icon && (
        <span className="inline-flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
