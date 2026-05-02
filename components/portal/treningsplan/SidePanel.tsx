"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";

import { StandardSessions } from "./StandardSessions";
import { PyramidFilter } from "./PyramidFilter";
import { ExerciseBank } from "./ExerciseBank";
import { StandardTemplate } from "./types";

interface SidePanelProps {
  onAddSession: (template: StandardTemplate) => void;
  onFilterChange: (focus: string | null) => void;
  selectedFilter: string | null;
}

export function SidePanel({
  onAddSession,
  onFilterChange,
  selectedFilter,
}: SidePanelProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-500 text-surface rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="Åpne øvelsesbank"
      >
        <Icon name="menu" className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-on-surface/60 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Side panel */}
      <aside
        className={`
          fixed lg:static inset-y-0 right-0 z-50
          w-[320px] bg-[#0F172A] border-l border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          flex flex-col h-full
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-inverse-on-surface">Øvelsesbank</h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-inverse-on-surface/60 hover:text-inverse-on-surface hover:bg-inverse-surface rounded-lg transition-colors"
            aria-label="Lukk"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Treningspyramide */}
          <div className="p-4 border-b border-slate-800">
            <PyramidFilter
              selectedFilter={selectedFilter}
              onFilterChange={onFilterChange}
            />
          </div>

          {/* Standard økter */}
          <div className="p-4 border-b border-slate-800">
            <StandardSessions onAddSession={onAddSession} />
          </div>

          {/* Øvelsesbank */}
          <div className="p-4">
            <ExerciseBank
              selectedFilter={selectedFilter}
              onAddSession={onAddSession}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
