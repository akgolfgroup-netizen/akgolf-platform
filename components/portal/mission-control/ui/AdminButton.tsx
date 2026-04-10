import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface AdminButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const variantClass: Record<AdminButtonVariant, string> = {
  primary: "admin-btn-primary",
  secondary: "admin-btn-secondary",
  ghost: "admin-btn-ghost",
  danger: "admin-btn-danger",
};

export function AdminButton({
  variant = "primary",
  icon,
  iconPosition = "left",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: AdminButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        "admin-btn",
        variantClass[variant],
        isDisabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : icon && iconPosition === "left" ? (
        <span className="inline-flex items-center" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
      {!loading && icon && iconPosition === "right" ? (
        <span className="inline-flex items-center" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </button>
  );
}
