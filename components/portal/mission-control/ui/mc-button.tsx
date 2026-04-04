import { cn } from "@/lib/portal/utils/cn";
import type { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger";
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
  primary: "bg-[#1D1D1F] text-white hover:bg-[#3a3a3c]",
  secondary: "bg-white border border-[#E8E8ED] text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]",
  success: "bg-[#2D6A4F] text-white hover:bg-[#245A42]",
  danger: "bg-[#D14343] text-white hover:bg-[#B93A3A]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-2.5 py-1 text-[9px]",
  md: "px-3.5 py-1.5 text-[10px]",
  lg: "px-4.5 py-2 text-xs",
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
        "inline-flex items-center justify-center gap-1 rounded-md font-medium transition-[background-color,border-color,color,opacity] duration-150 cursor-pointer",
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
