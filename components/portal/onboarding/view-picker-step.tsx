"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { LayoutGrid, Target, BarChart3, TrendingUp, Command } from "lucide-react";
import type { ViewId } from "@/lib/portal/views/registry";

interface ViewPickerStepProps {
  onSelect: (viewId: ViewId) => void;
  onNext: () => void;
}

const VIEW_OPTIONS: { id: ViewId; label: string; description: string; icon: typeof LayoutGrid }[] = [
  {
    id: "opt1",
    label: "Athletic Grid",
    description: "Kraftfull oversikt med modulære widgets",
    icon: LayoutGrid,
  },
  {
    id: "opt2",
    label: "Focus Today",
    description: "Dagens fokus og neste steg",
    icon: Target,
  },
  {
    id: "opt3",
    label: "Data Rich",
    description: "Tall-tung med grafer og trend",
    icon: BarChart3,
  },
  {
    id: "opt4",
    label: "Progress Story",
    description: "Visuell progresjon over tid",
    icon: TrendingUp,
  },
  {
    id: "opt5",
    label: "Command Center",
    description: "Hurtighandlinger og status",
    icon: Command,
  },
];

/**
 * ViewPickerStep — onboarding-steg for å velge default dashboard-view.
 *
 * Viser 5 klikkbare thumbnails med ikon, navn og beskrivelse.
 * Lagrer valget via callback til parent.
 */
export function ViewPickerStep({ onSelect, onNext }: ViewPickerStepProps) {
  const [selected, setSelected] = useState<ViewId | null>(null);

  const handleSelect = (viewId: ViewId) => {
    setSelected(viewId);
    onSelect(viewId);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-surface-container">
          <Icon name="grid_view" className="w-6 h-6 text-on-surface-variant/90" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">
          Velg dashboard-stil
        </h1>
        <p className="text-sm text-on-surface-variant/80">
          Du kan bytte stil når som helst senere
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {VIEW_OPTIONS.map((view) => {
          const isSelected = selected === view.id;
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => handleSelect(view.id)}
              className={
                "flex items-center gap-4 p-4 rounded-xl text-left transition-all border " +
                (isSelected
                  ? "border-primary bg-primary-soft ring-2 ring-primary"
                  : "border-outline-variant/30 bg-surface hover:border-outline-variant/50")
              }
            >
              <div
                className={
                  "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 " +
                  (isSelected ? "bg-primary text-surface" : "bg-surface-container-lowest text-on-surface-variant/80")
                }
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p
                  className={
                    "font-medium " + (isSelected ? "text-primary" : "text-on-surface")
                  }
                >
                  {view.label}
                </p>
                <p className="text-xs text-on-surface-variant/80">{view.description}</p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Icon name="check" className="w-3.5 h-3.5 text-surface" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className={
          "w-full py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed " +
          (selected ? "bg-on-surface text-surface" : "bg-surface-variant text-on-surface-variant/80")
        }
      >
        Neste
      </button>
    </div>
  );
}
