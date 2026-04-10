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
  coaching: "border-l-[#0A1F18]",
  junior: "border-l-[#007AFF]",
  gfgk: "border-l-[var(--color-brand)]",
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
        "px-3 py-2.5 bg-[#ECF0EF] rounded-lg border-l-[3px] transition-colors",
        divisionBorders[division],
        onClick && "cursor-pointer hover:bg-[#D5DFDB]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#0A1F18]">{name}</span>
        <span
          className={cn(
            "px-2 py-0.5 rounded text-[9px] font-semibold",
            isActive
              ? "bg-[#0A1F18] text-white"
              : "bg-[#D5DFDB] text-[#0A1F18]"
          )}
        >
          {time}
        </span>
      </div>
      {subtitle && (
        <div className="text-[9px] text-[#5A6E66] mt-1">{subtitle}</div>
      )}
    </div>
  );
}
