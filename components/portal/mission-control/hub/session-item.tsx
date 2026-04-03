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
  coaching: "border-l-[#1D1D1F]",
  junior: "border-l-[#007AFF]",
  gfgk: "border-l-[#34C759]",
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
        "px-3 py-2.5 bg-[#F5F5F7] rounded-lg border-l-[3px] transition-colors",
        divisionBorders[division],
        onClick && "cursor-pointer hover:bg-[#E8E8ED]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#1D1D1F]">{name}</span>
        <span
          className={cn(
            "px-2 py-0.5 rounded text-[9px] font-semibold",
            isActive
              ? "bg-[#1D1D1F] text-white"
              : "bg-[#E8E8ED] text-[#1D1D1F]"
          )}
        >
          {time}
        </span>
      </div>
      {subtitle && (
        <div className="text-[9px] text-[#6E6E73] mt-1">{subtitle}</div>
      )}
    </div>
  );
}
