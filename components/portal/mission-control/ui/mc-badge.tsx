import { cn } from "@/lib/portal/utils/cn";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface MCBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[var(--mc-success-bg)] text-[var(--mc-success-text)]",
  warning: "bg-[#FEF3C7] text-[#92400E]",
  error: "bg-[#FEE2E2] text-[#991B1B]",
  info: "bg-[#DBEAFE] text-[#1E40AF]",
  neutral: "bg-[#ECF0EF] text-[#5A6E66]",
};

export function MCBadge({ children, variant = "neutral", className }: MCBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Division dot indicator
type DivisionColor = "coaching" | "junior" | "gfgk";

interface DivisionDotProps {
  division: DivisionColor;
  className?: string;
}

const divisionColors: Record<DivisionColor, string> = {
  coaching: "bg-[#0A1F18]",
  junior: "bg-[#007AFF]",
  gfgk: "bg-[var(--color-brand)]",
};

export function DivisionDot({ division, className }: DivisionDotProps) {
  return (
    <span
      className={cn("w-2 h-2 rounded-sm", divisionColors[division], className)}
    />
  );
}

// Division border (for session items)
export function getDivisionBorderClass(division: DivisionColor): string {
  const borders: Record<DivisionColor, string> = {
    coaching: "border-l-[#0A1F18]",
    junior: "border-l-[#007AFF]",
    gfgk: "border-l-[var(--color-brand)]",
  };
  return borders[division];
}
