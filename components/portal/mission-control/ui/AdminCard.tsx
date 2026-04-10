import * as React from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  compact?: boolean;
}

export function AdminCard({
  className,
  children,
  hover = false,
  compact = false,
  ...props
}: AdminCardProps) {
  return (
    <div
      className={cn(
        compact ? "admin-card-sm" : "admin-card",
        hover && "admin-card-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
