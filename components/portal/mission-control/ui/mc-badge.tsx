import { cn } from "@/lib/portal/utils/cn";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface MCBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[#1A4D36]/10 text-[#1A4D36]",
  warning: "bg-[#C48A32]/10 text-[#C48A32]",
  error: "bg-[#EF4444]/10 text-[#EF4444]",
  info: "bg-[#0A1F18]/10 text-[#0A1F18]",
  neutral: "bg-[#F5F8F7] text-[#5A6E66]",
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
  junior: "bg-[#C48A32]",
  gfgk: "bg-[#1A4D36]",
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
    junior: "border-l-[#C48A32]",
    gfgk: "border-l-[#1A4D36]",
  };
  return borders[division];
}
