"use client";


import { Icon } from "@/components/ui/icon";
import { Grid3X3, Filter } from "lucide-react";
import { format, subMonths, addMonths, subWeeks, addWeeks } from "date-fns";
import { nb } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { AdminSelect } from "@/components/portal/mission-control/ui";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import type { Instructor } from "./actions";

type ViewMode = "month" | "week" | "availability";

const viewTabs: TabItem[] = [
  { id: "month", label: "Måned", icon: <Grid3X3 className="w-3.5 h-3.5" /> },
  { id: "week", label: "Uke", icon: <Icon name="calendar_today"Icon className="w-3.5 h-3.5" /> },
  {
    id: "availability",
    label: "Tilgjengelighet",
    icon: <Icon name="shield" className="w-3.5 h-3.5" />,
  },
];

interface KalenderControlsProps {
  currentDate: Date;
  viewMode: ViewMode;
  selectedInstructorId: string;
  instructors: Instructor[];
  isPending: boolean;
  onNavigate: (date: Date) => void;
  onViewChange: (view: ViewMode) => void;
  onInstructorChange: (id: string) => void;
  onNewEvent: () => void;
}

export default function KalenderControls({
  currentDate,
  viewMode,
  selectedInstructorId,
  instructors,
  isPending,
  onNavigate,
  onViewChange,
  onInstructorChange,
  onNewEvent,
}: KalenderControlsProps) {
  const handlePrev = () => {
    if (viewMode === "week") {
      onNavigate(subWeeks(currentDate, 1));
    } else {
      onNavigate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "week") {
      onNavigate(addWeeks(currentDate, 1));
    } else {
      onNavigate(addMonths(currentDate, 1));
    }
  };

  const dateLabel =
    viewMode === "week"
      ? `Uke ${format(currentDate, "w, yyyy", { locale: nb })}`
      : format(currentDate, "MMMM yyyy", { locale: nb });

  return (
    <div className="bg-white rounded-xl border border-grey-200 p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg hover:bg-grey-50 text-grey-500 transition-colors"
            aria-label="Forrige"
          >
            <Icon name="chevron_left" className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-black min-w-[180px] text-center capitalize">
            {dateLabel}
          </h2>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg hover:bg-grey-50 text-grey-500 transition-colors"
            aria-label="Neste"
          >
            <Icon name="chevron_right" className="w-5 h-5" />
          </button>
          <Button
            variant="secondary"
            onClick={() => onNavigate(new Date())}
            className="ml-2"
          >
            I dag
          </Button>
          {isPending && (
            <Icon name="progress_activity" className="w-4 h-4 animate-spin text-grey-400" />
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <AdminSelect
            value={selectedInstructorId}
            onChange={(e) => onInstructorChange(e.target.value)}
            containerClassName="min-w-[180px]"
          >
            <option value="">Alle instruktører</option>
            {instructors.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.user.name || "Ukjent"}
              </option>
            ))}
          </AdminSelect>

          <Button variant="secondary">
            <Icon name="filter_list" className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="accent" onClick={onNewEvent}>
            <Icon name="add" className="w-4 h-4" />
            <span className="hidden sm:inline">Ny</span>
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <Tabs
          items={viewTabs}
          value={viewMode}
          onValueChange={(v) => onViewChange(v as ViewMode)}
          size="sm"
        />
      </div>
    </div>
  );
}
