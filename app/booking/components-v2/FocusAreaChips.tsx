"use client";

import { Flag, Target, Disc, Circle } from "lucide-react";

const FOCUS_AREAS = [
  { id: "TEE_TOTAL", label: "Langt spill", Icon: Flag },
  { id: "APPROACH", label: "Innspill", Icon: Target },
  { id: "SHORT_GAME", label: "Naerspill", Icon: Disc },
  { id: "PUTTING", label: "Putting", Icon: Circle },
] as const;

interface FocusAreaChipsProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export function FocusAreaChips({ selected, onToggle }: FocusAreaChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FOCUS_AREAS.map(({ id, label, Icon }) => {
        const isSelected = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onToggle(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium border-2 transition-all ${
              isSelected
                ? "bg-primary text-surface border-primary"
                : "bg-surface text-on-surface border-transparent hover:border-primary"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
