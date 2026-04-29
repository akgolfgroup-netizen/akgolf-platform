"use client";

import { Calendar, Search, SlidersHorizontal, User } from "lucide-react";
import type { CoachFilter } from "./booking-types";

type Props = {
  totalCount: number;
  todayCount: number;
  pendingCount: number;
  coaches: CoachFilter[];
  weekLabel: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeFilter: "all" | "today" | "pending";
  onFilterChange: (filter: "all" | "today" | "pending") => void;
};

export function BookingToolbar({
  totalCount,
  todayCount,
  pendingCount,
  coaches,
  weekLabel,
  searchValue,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <div className="flex w-[300px] items-center gap-2 rounded-lg border border-white/8 bg-white/[0.04] px-3 py-2">
        <Search className="h-3.5 w-3.5 text-white/50" strokeWidth={1.8} />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Søk navn, lokasjon, coach…"
          className="flex-1 border-none bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
        />
      </div>

      <FilterChip active={activeFilter === "all"} onClick={() => onFilterChange("all")}>
        Alle {totalCount}
      </FilterChip>
      <FilterChip active={activeFilter === "today"} onClick={() => onFilterChange("today")}>
        I dag {todayCount}
      </FilterChip>
      <FilterChip active={activeFilter === "pending"} onClick={() => onFilterChange("pending")}>
        Pending {pendingCount}
      </FilterChip>
      {coaches.map((c) => (
        <FilterChip key={c.name} icon>
          {c.name} <span className="opacity-60">{c.count}</span>
        </FilterChip>
      ))}

      <div className="ml-auto flex gap-1.5">
        <SmallGhostButton>
          <Calendar className="h-3.5 w-3.5" strokeWidth={1.8} /> {weekLabel}
        </SmallGhostButton>
        <SmallGhostButton>
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.8} /> Filter
        </SmallGhostButton>
      </div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  icon,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  icon?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition " +
        (active
          ? "border-[#D1F843]/30 bg-[#D1F843]/10 text-[#D1F843]"
          : "border-white/8 bg-white/[0.04] text-white/70 hover:bg-white/[0.06]")
      }
    >
      {icon && <User className="h-3 w-3" strokeWidth={1.8} />}
      <span>{children}</span>
    </button>
  );
}

function SmallGhostButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-md border border-transparent px-2.5 py-1.5 text-[11px] text-white/80 transition hover:bg-white/5"
    >
      {children}
    </button>
  );
}
