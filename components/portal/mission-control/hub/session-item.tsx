import { cn } from "@/lib/portal/utils/cn";
import type { Division } from "../mc-nav-config";

interface SessionItemProps {
  name: string;
  time: string;
  isActive?: boolean;
  subtitle?: string;
  division: Division;
  className?: string;
  onClick?: () => void;
}

const divisionBorders: Record<Division, string> = {
  coaching: "border-l-black",
  junior: "border-l-info",
  gfgk: "border-l-primary",
};

export function SessionItem({
  name,
  time,
  isActive = false,
  subtitle,
  division,
  className,
  onClick,
}: SessionItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-3 py-2.5 bg-[var(--color-surface)] rounded-lg border-l-[3px] transition-colors",
        divisionBorders[division],
        onClick && "cursor-pointer hover:bg-[var(--color-grey-200)]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[var(--color-black)]">{name}</span>
        <span
          className={cn(
            "px-2 py-0.5 rounded text-[9px] font-semibold",
            isActive
              ? "bg-[var(--color-black)] text-white"
              : "bg-[var(--color-grey-200)] text-[var(--color-black)]"
          )}
        >
          {time}
        </span>
      </div>
      {subtitle && (
        <div className="text-[9px] text-[var(--color-grey-500)] mt-1">{subtitle}</div>
      )}
    </div>
  );
}
