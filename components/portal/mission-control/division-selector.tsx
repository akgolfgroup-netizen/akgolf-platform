"use client";

import { cn } from "@/lib/portal/utils/cn";
import { DIVISIONS, type Division } from "./mc-nav-config";

interface DivisionSelectorProps {
  selected: Division;
  onChange: (division: Division) => void;
  className?: string;
}

export function DivisionSelector({
  selected,
  onChange,
  className,
}: DivisionSelectorProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {DIVISIONS.map((division) => (
        <button
          key={division.id}
          onClick={() => onChange(division.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer",
            selected === division.id
              ? "bg-[#1D1D1F] text-white"
              : "bg-white border border-[#E8E8ED] text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
          )}
        >
          <span
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: division.color }}
          />
          {division.label}
        </button>
      ))}
    </div>
  );
}

// Compact division tabs for Focus mode header
interface DivisionTabsProps {
  selected: Division;
  onChange: (division: Division) => void;
  className?: string;
}

export function DivisionTabs({ selected, onChange, className }: DivisionTabsProps) {
  return (
    <div className={cn("flex bg-[#E8E8ED] rounded-lg p-0.5", className)}>
      {DIVISIONS.map((division) => (
        <button
          key={division.id}
          onClick={() => onChange(division.id)}
          className={cn(
            "px-4 py-1.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer",
            selected === division.id
              ? "text-white"
              : "text-[#6E6E73] hover:text-[#1D1D1F]"
          )}
          style={{
            backgroundColor: selected === division.id ? division.color : "transparent",
          }}
        >
          {division.label}
        </button>
      ))}
    </div>
  );
}
