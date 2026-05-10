"use client";

import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  id: string;
  label: string;
  type: "select" | "multi-select" | "date-range";
  options?: FilterOption[];
}

interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, string | string[]>;
  onChange: (values: Record<string, string | string[]>) => void;
  onReset?: () => void;
  className?: string;
}

export function FilterPanel({ filters, values, onChange, onReset, className }: FilterPanelProps) {
  const update = useCallback(
    (id: string, val: string | string[]) => {
      onChange({ ...values, [id]: val });
    },
    [values, onChange]
  );

  const toggleMulti = useCallback(
    (id: string, option: string) => {
      const current = (values[id] as string[]) ?? [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      update(id, next);
    },
    [values, update]
  );

  return (
    <div className={cn("flex flex-wrap items-end gap-4", className)}>
      {filters.map((f) => (
        <div key={f.id} className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#9C9990]">
            {f.label}
          </span>

          {f.type === "select" && f.options && (
            <Select
              value={(values[f.id] as string) ?? ""}
              onValueChange={(v) => update(f.id, v)}
            >
              <SelectTrigger className="h-9 min-w-[140px] rounded-[10px] border-[#E5E3DD] bg-white text-sm text-[#0A1F18]">
                <SelectValue placeholder="Velg..." />
              </SelectTrigger>
              <SelectContent className="rounded-[12px] border-[#E5E3DD]">
                {f.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {f.type === "multi-select" && f.options && (
            <MultiSelectFilter
              options={f.options}
              selected={(values[f.id] as string[]) ?? []}
              onToggle={(v) => toggleMulti(f.id, v)}
            />
          )}

          {f.type === "date-range" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={((values[f.id] as string[]) ?? [])[0] ?? ""}
                onChange={(e) => {
                  const arr = (values[f.id] as string[]) ?? ["", ""];
                  update(f.id, [e.target.value, arr[1] ?? ""]);
                }}
                className="h-9 rounded-[10px] border border-[#E5E3DD] bg-white px-2 text-sm text-[#0A1F18] focus:border-[#005840] focus:outline-none focus:ring-1 focus:ring-[#005840]/20"
              />
              <span className="text-xs text-[#9C9990]">til</span>
              <input
                type="date"
                value={((values[f.id] as string[]) ?? [])[1] ?? ""}
                onChange={(e) => {
                  const arr = (values[f.id] as string[]) ?? ["", ""];
                  update(f.id, [arr[0] ?? "", e.target.value]);
                }}
                className="h-9 rounded-[10px] border border-[#E5E3DD] bg-white px-2 text-sm text-[#0A1F18] focus:border-[#005840] focus:outline-none focus:ring-1 focus:ring-[#005840]/20"
              />
            </div>
          )}
        </div>
      ))}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mb-px h-9 rounded-[12px] px-3 text-sm font-medium text-[#5E5C57] transition-colors hover:bg-[#EFEDE6]"
        >
          Nullstill
        </button>
      )}
    </div>
  );
}

function MultiSelectFilter({
  options,
  selected,
  onToggle,
}: {
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const label = selected.length === 0 ? "Velg..." : `${selected.length} valgt`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 min-w-[140px] items-center justify-between gap-2 rounded-[10px] border border-[#E5E3DD] bg-white px-3 text-sm text-[#0A1F18] transition-colors hover:border-[#9C9990]"
        >
          <span className={cn(selected.length === 0 && "text-[#9C9990]")}>{label}</span>
          <ChevronDown className="h-4 w-4 text-[#9C9990]" strokeWidth={1.75} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] rounded-[12px] border-[#E5E3DD] p-2">
        <div className="flex max-h-[200px] flex-col gap-1 overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1.5 text-sm text-[#0A1F18] hover:bg-[#EFEDE6]"
            >
              <Checkbox
                checked={selected.includes(opt.value)}
                onCheckedChange={() => onToggle(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
