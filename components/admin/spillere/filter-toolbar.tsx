"use client";

import { Search, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface FilterChipDef {
  id: string;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

interface FilterToolbarProps {
  searchPlaceholder: string;
  chips: FilterChipDef[];
  activeChip: string;
  onChipChange: (id: string) => void;
  rightSlot?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function FilterToolbar({
  searchPlaceholder,
  chips,
  activeChip,
  onChipChange,
  rightSlot,
  searchValue,
  onSearchChange,
}: FilterToolbarProps) {
  return (
    <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
      <div className="flex w-[320px] items-center gap-2 rounded-lg border border-[#1a4a3a] bg-[#0D2E23] px-3 py-2 text-[13px]">
        <Search className="h-3.5 w-3.5 text-white/50" strokeWidth={1.8} />
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="flex-1 border-none bg-transparent text-white outline-none placeholder:text-white/40"
        />
      </div>

      {chips.map((chip) => {
        const Icon = chip.icon;
        const isActive = chip.id === activeChip;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onChipChange(chip.id)}
            className={
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition " +
              (isActive
                ? "border-[rgba(209,248,67,0.30)] bg-[rgba(209,248,67,0.10)] text-[#D1F843]"
                : "border-[#1a4a3a] bg-[#0D2E23] text-white/70 hover:border-white/15 hover:bg-white/5")
            }
          >
            {Icon ? <Icon className="h-3 w-3" strokeWidth={1.8} /> : null}
            <span>{chip.label}</span>
            {typeof chip.count === "number" ? (
              <span className="opacity-60">{chip.count}</span>
            ) : null}
          </button>
        );
      })}

      {rightSlot ? <div className="ml-auto flex items-center gap-2">{rightSlot}</div> : null}
    </div>
  );
}
