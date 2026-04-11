import { cn } from "@/lib/portal/utils/cn";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface MCBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success-light text-success-text",
  warning: "bg-warning-light text-warning-text",
  error: "bg-error-light text-error-text",
  info: "bg-info-light text-info-text",
  neutral: "bg-surface text-grey-500",
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
  coaching: "bg-black",
  junior: "bg-info",
  gfgk: "bg-primary",
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
    coaching: "border-l-black",
    junior: "border-l-info",
    gfgk: "border-l-primary",
  };
  return borders[division];
}
