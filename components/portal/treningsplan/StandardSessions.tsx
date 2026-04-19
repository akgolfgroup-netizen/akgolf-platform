"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";

import { StandardTemplate } from "./types";

interface StandardSessionsProps {
  onAddSession: (template: StandardTemplate) => void;
}

const STANDARD_TEMPLATES: StandardTemplate[] = [
  {
    id: "std-putting",
    title: "Putting-drill",
    duration: 20,
    focus: "TEK",
    exercises: [
      { id: "e1", name: "3-fots cirkel", pyramid: "TEK", area: "PUTT3-6" },
      { id: "e2", name: "Avstandskontroll", pyramid: "TEK", area: "PUTT20-40" },
    ],
  },
  {
    id: "std-shortgame",
    title: "Short game",
    duration: 30,
    focus: "SLAG",
    exercises: [
      { id: "e3", name: "Chipping rutine", pyramid: "SLAG", area: "CHIP" },
      { id: "e4", name: "Pitching 30m", pyramid: "SLAG", area: "PITCH" },
      { id: "e5", name: "Bunker basis", pyramid: "SLAG", area: "BUNKER" },
    ],
  },
  {
    id: "std-driving",
    title: "Driving range",
    duration: 45,
    focus: "SLAG",
    exercises: [
      { id: "e6", name: "Oppvarming", pyramid: "TEK", area: "INN50" },
      { id: "e7", name: "Iron-sekvens", pyramid: "SLAG", area: "INN150" },
      { id: "e8", name: "Driver treff", pyramid: "SLAG", area: "TEE" },
    ],
  },
  {
    id: "std-styrke",
    title: "Styrke-økt",
    duration: 50,
    focus: "FYS",
    exercises: [
      { id: "e9", name: "Kjerneaktivering", pyramid: "FYS", area: "KROPP" },
      { id: "e10", name: "Rotasjonsstyrke", pyramid: "FYS", area: "KROPP" },
      { id: "e11", name: "Mobilitet", pyramid: "FYS", area: "KROPP" },
    ],
  },
  {
    id: "std-9hull",
    title: "Spill 9 hull",
    duration: 120,
    focus: "SPILL",
    exercises: [
      { id: "e12", name: "Banemanagement", pyramid: "SPILL", area: "TEE" },
      { id: "e13", name: "Scoring", pyramid: "SPILL", area: "PUTT3-6" },
    ],
  },
  {
    id: "std-analyse",
    title: "Svinganalyse",
    duration: 40,
    focus: "TEK",
    exercises: [
      { id: "e14", name: "Videoanalyse", pyramid: "TEK", area: "INN100" },
      { id: "e15", name: "Teknikk-justering", pyramid: "TEK", area: "INN150" },
    ],
  },
];

const FOCUS_COLORS: Record<string, string> = {
  FYS: "#3B82F6",
  TEK: "#16A34A",
  SLAG: "#D4AF37",
  SPILL: "#F97316",
  TURN: "#EF4444",
};

const FOCUS_ICONS: Record<string, React.ReactNode> = {
  FYS: <Icon name="fitness_center" className="w-4 h-4" />,
  TEK: <Icon name="my_location" className="w-4 h-4" />,
  SLAG: <Icon name="sports_golf" className="w-4 h-4" />,
  SPILL: <Icon name="monitoring" className="w-4 h-4" />,
  TURN: <Icon name="emoji_events" className="w-4 h-4" />,
};

export function StandardSessions({ onAddSession }: StandardSessionsProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, template: StandardTemplate) => {
    setDraggedItem(template.id);
    e.dataTransfer.setData("application/json", JSON.stringify(template));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleClick = (template: StandardTemplate) => {
    onAddSession(template);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        Standard økter
      </h3>

      <div className="space-y-2">
        {STANDARD_TEMPLATES.map((template) => {
          const isDragging = draggedItem === template.id;
          const color = FOCUS_COLORS[template.focus];
          const icon = FOCUS_ICONS[template.focus];

          return (
            <div
              key={template.id}
              draggable
              onDragStart={(e) => handleDragStart(e, template)}
              onDragEnd={handleDragEnd}
              className={`
                group relative p-3 rounded-lg border cursor-move
                transition-all duration-200
                ${isDragging
                  ? "opacity-50 scale-95 border-slate-600"
                  : "border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50"
                }
              `}
            >
              {/* Drag handle */}
              <div className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-slate-400">
                <Icon name="drag_indicator" className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="pl-4 pr-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-slate-200 group-hover:text-white">
                    {template.title}
                  </h4>
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {template.focus}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Icon name="schedule" className="w-3 h-3" />
                    {template.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    {icon}
                    {template.exercises.length} øvelser
                  </span>
                </div>
              </div>

              {/* Add button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(template);
                }}
                className={`
                  absolute right-2 top-1/2 -translate-y-1/2
                  w-7 h-7 rounded-full flex items-center justify-center
                  transition-all duration-200
                  ${isDragging
                    ? "opacity-0"
                    : "opacity-0 group-hover:opacity-100 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                  }
                `}
                aria-label={`Legg til ${template.title}`}
              >
                <Icon name="add" className="w-4 h-4" />
              </button>

              {/* Focus indicator line */}
              <div
                className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: color }}
              />
            </div>
          );
        })}
      </div>

      {/* Drag hint */}
      <p className="text-xs text-slate-500 text-center">
        Dra til kalenderen eller klikk + for å legge til
      </p>
    </div>
  );
}
