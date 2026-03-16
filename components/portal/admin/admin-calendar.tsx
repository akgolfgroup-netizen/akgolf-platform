"use client";

import { useState } from "react";
import { format, addDays, subDays, addWeeks, subWeeks, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { AdminCalendarDay } from "./admin-calendar-day";
import { AdminCalendarWeek } from "./admin-calendar-week";
import { BookingDetailSheet } from "./booking-detail-sheet";
import { getBookingsForDay, getBookingsForWeek, type CalendarBooking } from "@/app/portal/(dashboard)/admin/kalender/actions";

type ViewMode = "day" | "week";

interface Props {
  instructors: Array<{ id: string; user: { name: string | null; image: string | null } }>;
}

export function AdminCalendar({ instructors }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("");
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);

  const fetchBookings = async (date: Date, mode: ViewMode, instructorId: string) => {
    setLoading(true);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const data =
        mode === "day"
          ? await getBookingsForDay(dateStr, instructorId || undefined)
          : await getBookingsForWeek(dateStr, instructorId || undefined);
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setInitialized(true);
    fetchBookings(currentDate, viewMode, selectedInstructorId);
  }

  const navigateBack = () => {
    const newDate = viewMode === "day" ? subDays(currentDate, 1) : subWeeks(currentDate, 1);
    setCurrentDate(newDate);
    fetchBookings(newDate, viewMode, selectedInstructorId);
  };

  const navigateForward = () => {
    const newDate = viewMode === "day" ? addDays(currentDate, 1) : addWeeks(currentDate, 1);
    setCurrentDate(newDate);
    fetchBookings(newDate, viewMode, selectedInstructorId);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    fetchBookings(today, viewMode, selectedInstructorId);
  };

  const switchView = (mode: ViewMode) => {
    setViewMode(mode);
    fetchBookings(currentDate, mode, selectedInstructorId);
  };

  const filterByInstructor = (id: string) => {
    setSelectedInstructorId(id);
    fetchBookings(currentDate, viewMode, id);
  };

  const dateLabel =
    viewMode === "day"
      ? format(currentDate, "EEEE d. MMMM yyyy", { locale: nb })
      : (() => {
          const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
          const weekEnd = addDays(weekStart, 6);
          return `${format(weekStart, "d. MMM", { locale: nb })} — ${format(weekEnd, "d. MMM yyyy", { locale: nb })}`;
        })();

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={navigateBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            I dag
          </button>
          <button
            onClick={navigateForward}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <span className="text-sm font-semibold text-[#0F2950] capitalize min-w-[200px]">
          {dateLabel}
        </span>

        {/* View toggle */}
        <div className="flex bg-gray-100 rounded-lg p-0.5 ml-auto">
          <button
            onClick={() => switchView("day")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === "day"
                ? "bg-white text-[#0F2950] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Dag
          </button>
          <button
            onClick={() => switchView("week")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === "week"
                ? "bg-white text-[#0F2950] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Uke
          </button>
        </div>

        {/* Instructor filter */}
        <select
          value={selectedInstructorId}
          onChange={(e) => filterByInstructor(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="">Alle instruktører</option>
          {instructors.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.user.name ?? "Ukjent"}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <CalendarIcon className="w-5 h-5 animate-pulse mr-2" />
          Laster...
        </div>
      ) : viewMode === "day" ? (
        <AdminCalendarDay
          date={currentDate}
          bookings={bookings}
          onSelectBooking={setSelectedBooking}
        />
      ) : (
        <AdminCalendarWeek
          date={currentDate}
          bookings={bookings}
          onSelectBooking={setSelectedBooking}
        />
      )}

      {/* Booking detail sheet */}
      {selectedBooking && (
        <BookingDetailSheet
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onRefresh={() => fetchBookings(currentDate, viewMode, selectedInstructorId)}
        />
      )}
    </div>
  );
}
