"use client";

import { Check } from "lucide-react";
import type { PrepChecklist as PrepChecklistType } from "../types";

const DEFAULT_CHECKLIST: PrepChecklistType = {
  equipment: [
    { label: "Klubber rengjort og sjekket", checked: false },
    { label: "Baller (minst 6)", checked: false },
    { label: "Tees, ballmerker, pitchfork", checked: false },
    { label: "Regnklær og ekstra klær", checked: false },
    { label: "Avstandsmåler / GPS", checked: false },
  ],
  mental: [
    { label: "Gått gjennom banestrategi", checked: false },
    { label: "Pusteøvelse / rutine planlagt", checked: false },
    { label: "Positiv visualisering gjort", checked: false },
  ],
  physical: [
    { label: "God søvn natten før", checked: false },
    { label: "Frokost planlagt", checked: false },
    { label: "Oppvarming planlagt", checked: false },
    { label: "Vann og snacks pakket", checked: false },
  ],
  logistics: [
    { label: "Starttid bekreftet", checked: false },
    { label: "Transport planlagt", checked: false },
    { label: "Parkering/ankomst sjekket", checked: false },
  ],
};

interface PrepChecklistProps {
  checklist: PrepChecklistType | null;
  onChange: (checklist: PrepChecklistType) => void;
}

const SECTION_LABELS: Record<keyof PrepChecklistType, string> = {
  equipment: "Utstyr",
  mental: "Mental",
  physical: "Fysisk",
  logistics: "Logistikk",
};

export function PrepChecklistComponent({ checklist, onChange }: PrepChecklistProps) {
  const data = checklist ?? DEFAULT_CHECKLIST;

  function toggle(section: keyof PrepChecklistType, index: number) {
    const updated = { ...data };
    updated[section] = [...updated[section]];
    updated[section][index] = {
      ...updated[section][index],
      checked: !updated[section][index].checked,
    };
    onChange(updated);
  }

  const totalItems = Object.values(data).flat().length;
  const checkedItems = Object.values(data).flat().filter((i) => i.checked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--color-gold-muted)] uppercase tracking-wider">
          Sjekkliste
        </span>
        <span className="text-xs text-[var(--color-gold-muted)]">
          {checkedItems}/{totalItems}
        </span>
      </div>

      {(Object.keys(SECTION_LABELS) as (keyof PrepChecklistType)[]).map((section) => (
        <div key={section}>
          <p className="text-[10px] font-semibold text-[var(--color-gold-dim)] uppercase tracking-widest mb-1.5">
            {SECTION_LABELS[section]}
          </p>
          <div className="space-y-1">
            {data[section].map((item, i) => (
              <button
                key={i}
                onClick={() => toggle(section, i)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-[var(--color-muted)]/50 transition-colors"
              >
                <span
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors"
                  style={{
                    borderColor: item.checked ? "#22C55E" : "rgba(184,151,92,0.3)",
                    background: item.checked ? "rgba(34,197,94,0.15)" : "transparent",
                  }}
                >
                  {item.checked && <Check className="w-2.5 h-2.5 text-green-400" />}
                </span>
                <span
                  className={`text-xs ${item.checked ? "line-through text-[var(--color-gold-muted)]/50" : "text-[var(--color-snow)]"}`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
