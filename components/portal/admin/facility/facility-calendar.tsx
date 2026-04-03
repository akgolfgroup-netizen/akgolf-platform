"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { nb } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Loader2,
} from "lucide-react";
import { FacilityCalendarDay } from "./facility-calendar-day";
import { FacilityCalendarWeek } from "./facility-calendar-week";
import { FacilityCalendarMonth } from "./facility-calendar-month";
import { FacilitySelector, type Facility } from "./facility-selector";
import { FacilityLegendCompact } from "./facility-legend";
import { ActivityDetailSheet, type CalendarEvent } from "./activity-detail-sheet";
import Link from "next/link";

type ViewMode = "day" | "week" | "month";

interface Props {
  initialFacilities: Facility[];
}

export function FacilityCalendar({ initialFacilities }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [facilities] = useState<Facility[]>(initialFacilities);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const fetchEvents = useCallback(async (date: Date, mode: ViewMode) => {
    setLoading(true);
    try {
      let startDate: Date;
      let endDate: Date;

      switch (mode) {
        case "day":
          startDate = new Date(date);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(date);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "week":
          startDate = startOfWeek(date, { weekStartsOn: 1 });
          endDate = addDays(startDate, 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "month":
          startDate = startOfMonth(date);
          endDate = endOfMonth(date);
          break;
      }

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const res = await fetch(`/api/portal/facility-calendar?${params}`);
      if (!res.ok) throw new Error("Failed to fetch events");

      const data = await res.json();
      setEvents(data.events);
    } catch {
      // Error handled silently - calendar will show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(currentDate, viewMode);
  }, [currentDate, viewMode, fetchEvents]);

  const navigateBack = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(subDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const navigateForward = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDateLabel = () => {
    switch (viewMode) {
      case "day":
        return format(currentDate, "EEEE d. MMMM yyyy", { locale: nb });
      case "week": {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, "d. MMM", { locale: nb })} — ${format(
          weekEnd,
          "d. MMM yyyy",
          { locale: nb }
        )}`;
      }
      case "month":
        return format(currentDate, "MMMM yyyy", { locale: nb });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/portal/facility-activities/${id}/approve`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to approve");
      await fetchEvents(currentDate, viewMode);
      setSelectedEvent(null);
    } catch {
      // Error handled silently - activity remains unapproved
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Er du sikker på at du vil kansellere denne aktiviteten?")) return;
    try {
      const res = await fetch(`/api/portal/facility-activities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchEvents(currentDate, viewMode);
      setSelectedEvent(null);
    } catch {
      // Error handled silently - activity remains unchanged
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[var(--color-grey-200)] shadow-sm">
        <div className="flex items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={navigateBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-500)] hover:border-[var(--color-grey-400)] hover:text-[var(--color-grey-900)] transition-[background-color,border-color,color]"
            >
              <ChevronLeft className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium rounded-xl text-[var(--color-grey-900)] bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)] transition-[background-color]"
            >
              I dag
            </button>
            <button
              onClick={navigateForward}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--color-grey-200)] bg-white text-[var(--color-grey-500)] hover:border-[var(--color-grey-400)] hover:text-[var(--color-grey-900)] transition-[background-color,border-color,color]"
            >
              <ChevronRight className="w-[18px] h-[18px]" />
            </button>
          </div>

          <span
            className="text-lg font-semibold text-[var(--color-grey-900)] capitalize min-w-[200px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {getDateLabel()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-[var(--color-grey-100)] rounded-xl p-1">
            {(["day", "week", "month"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-[background-color,color,box-shadow] duration-200 ${
                  viewMode === mode
                    ? "bg-[var(--color-grey-900)] text-white shadow-sm"
                    : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)]"
                }`}
              >
                {mode === "day" ? "Dag" : mode === "week" ? "Uke" : "Måned"}
              </button>
            ))}
          </div>

          {/* Facility filter */}
          <div className="w-48">
            <FacilitySelector
              facilities={facilities}
              selectedFacilityId={selectedFacilityId}
              onChange={setSelectedFacilityId}
            />
          </div>

          {/* New activity button */}
          <Link
            href="/portal/admin/fasiliteter/ny-aktivitet"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-grey-900)] text-white text-sm font-medium hover:bg-[var(--color-grey-800)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ny aktivitet
          </Link>
        </div>
      </div>

      {/* Legend */}
      <div className="px-2">
        <FacilityLegendCompact />
      </div>

      {/* Calendar content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[var(--color-grey-400)]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Laster kalender...
        </div>
      ) : viewMode === "day" ? (
        <FacilityCalendarDay
          date={currentDate}
          events={events}
          facilities={facilities}
          selectedFacilityId={selectedFacilityId}
          onSelectEvent={setSelectedEvent}
        />
      ) : viewMode === "week" ? (
        <FacilityCalendarWeek
          date={currentDate}
          events={events}
          facilities={facilities}
          selectedFacilityId={selectedFacilityId}
          onSelectEvent={setSelectedEvent}
        />
      ) : (
        <FacilityCalendarMonth
          date={currentDate}
          events={events}
          facilities={facilities}
          selectedFacilityId={selectedFacilityId}
          onSelectEvent={setSelectedEvent}
        />
      )}

      {/* Event detail sheet */}
      <ActivityDetailSheet
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onApprove={selectedEvent?.type === "activity" ? handleApprove : undefined}
        onDelete={selectedEvent?.type === "activity" ? handleDelete : undefined}
      />
    </div>
  );
}
