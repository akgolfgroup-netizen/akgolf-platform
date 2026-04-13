"use client";

import { useState } from "react";
import { format, addDays, subDays, addWeeks, subWeeks, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { AdminCalendarDay } from "./admin-calendar-day";
import { AdminCalendarWeek } from "./admin-calendar-week";
import { BookingDetailSheet } from "./booking-detail-sheet";
import { getBookingsForDay, getBookingsForWeek, type CalendarBooking } from "@/app/admin/(authed)/kalender/actions";

type ViewMode = "day" | "week";

interface Props {
  instructors: Array<{ id: string; user: { name: string | null; image: string | null } }>;
}

export function AdminCalendar({ instructors }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
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
      {/* Toolbar - Apple glassmorphism style */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-white border border-[#D5DFDB] duration-300 hover:">
        <div className="flex items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={navigateBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#D5DFDB] bg-white text-[#7A8C85] hover:border-[#0A1F18] hover:bg-[#ECF0EF] hover:text-[#0A1F18] transition-[background-color,border-color,color] duration-200"
            >
              <ChevronLeft className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium rounded-xl text-[#0A1F18] bg-[#ECF0EF]/50 hover:bg-[#ECF0EF] transition-[background-color] duration-200"
            >
              I dag
            </button>
            <button
              onClick={navigateForward}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#D5DFDB] bg-white text-[#7A8C85] hover:border-[#0A1F18] hover:bg-[#ECF0EF] hover:text-[#0A1F18] transition-[background-color,border-color,color] duration-200"
            >
              <ChevronRight className="w-[18px] h-[18px]" />
            </button>
          </div>

          <span className="text-lg font-semibold text-[#0A1F18] capitalize min-w-[200px]" style={{ fontFamily: "var(--font-display)" }}>
            {dateLabel}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-[#ECF0EF] rounded-xl p-1">
            <button
              onClick={() => switchView("day")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-[background-color,color] duration-200 ${ viewMode === "day" ? "bg-[#0A1F18] text-white " : "text-[#7A8C85] hover:text-[#0A1F18]" }`}
            >
              Dag
            </button>
            <button
              onClick={() => switchView("week")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-[background-color,color] duration-200 ${ viewMode === "week" ? "bg-[#0A1F18] text-white " : "text-[#7A8C85] hover:text-[#0A1F18]" }`}
            >
              Uke
            </button>
          </div>

          {/* Instructor filter */}
          <select
            value={selectedInstructorId}
            onChange={(e) => filterByInstructor(e.target.value)}
            className="text-sm font-medium rounded-xl px-4 py-2 text-[#324D45] bg-white border border-[#D5DFDB] focus:outline-none focus:ring-2 focus:ring-[#0A1F18] focus:border-transparent transition-[border-color,box-shadow] duration-200"
          >
            <option value="">Alle instruktorer</option>
            {instructors.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.user.name ?? "Ukjent"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#7A8C85]">
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
