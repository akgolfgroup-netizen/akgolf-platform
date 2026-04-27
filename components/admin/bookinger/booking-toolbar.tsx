import { Calendar, Search, SlidersHorizontal, User } from "lucide-react";
import { COACH_FILTERS } from "./mock-data";

export function BookingToolbar() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      {/* Søk */}
      <div className="flex w-[300px] items-center gap-2 rounded-lg border border-white/8 bg-white/[0.04] px-3 py-2">
        <Search className="h-3.5 w-3.5 text-white/50" strokeWidth={1.8} />
        <input
          placeholder="Søk navn, lokasjon, coach…"
          className="flex-1 border-none bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
        />
      </div>

      {/* Filter chips */}
      <FilterChip active>Alle 18</FilterChip>
      <FilterChip>I dag 6</FilterChip>
      <FilterChip>Pending 3</FilterChip>
      {COACH_FILTERS.map((c) => (
        <FilterChip key={c.name} icon>
          {c.name} <span className="opacity-60">{c.count}</span>
        </FilterChip>
      ))}

      {/* Right side */}
      <div className="ml-auto flex gap-1.5">
        <SmallGhostButton>
          <Calendar className="h-3.5 w-3.5" strokeWidth={1.8} /> Uke 18
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
}: {
  children: React.ReactNode;
  active?: boolean;
  icon?: boolean;
}) {
  return (
    <button
      type="button"
      className={
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition " +
        (active
          ? "border-accent/30 bg-accent/10 text-accent"
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
