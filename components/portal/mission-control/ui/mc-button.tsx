import { cn } from "@/lib/portal/utils/cn";
import type { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "lime";
type ButtonSize = "sm" | "md" | "lg";

interface MCButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#0A1F18] text-white hover:bg-[#1A3529]",
  secondary: "bg-white border border-[#D5DFDB] text-[#0A1F18] hover:bg-[#F5F8F7] hover:border-[#A5B2AD]",
  success: "bg-[#1A4D36] text-white hover:bg-[#1A4D36]/90",
  danger: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
  lime: "bg-[#D1F843] text-[#0A1F18] hover:brightness-95",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[11px] rounded-full",
  md: "px-4 py-2 text-xs rounded-full",
  lg: "px-5 py-2.5 text-sm rounded-full",
};

export function MCButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  disabled,
  className,
  onClick,
  type = "button",
}: MCButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-semibold transition-all duration-150 cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {Icon && iconPosition === "left" && <Icon className="w-3.5 h-3.5" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-3.5 h-3.5" />}
    </button>
  );
}
