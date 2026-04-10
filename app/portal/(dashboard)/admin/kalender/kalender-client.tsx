"use client";

import { useState, useTransition, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Filter,
  Grid3X3,
  List,
  AlertTriangle,
  MessageSquare,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar, HGCapacityBar } from "@/components/portal/mission-control";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  differenceInMinutes,
} from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarBooking } from "./actions";
import {
  getBookingsForPeriod,
  getBookingsForDay,
  getBookingsForWeek,
  markNoShow,
  addAdminNote,
} from "./actions";

// — Types —

interface Instructor {
  id: string;
  user: { name: string | null; image: string | null };
}

interface KalenderClientProps {
  initialBookings: CalendarBooking[];
  instructors: Instructor[];
}

// — View modes —

const viewModes = [
  { label: "Maned", value: "month", icon: Grid3X3 },
  { label: "Uke", value: "week", icon: CalendarIcon },
  { label: "Dag", value: "day", icon: List },
] as const;

type ViewMode = (typeof viewModes)[number]["value"];

// — Status styles —

const statusStyles: Record<string, string> = {
  PENDING:
    "bg-[color-mix(in_srgb,var(--color-warning)_15%,transparent)] border-[var(--color-warning)] text-[var(--color-warning)]",
  CONFIRMED:
    "bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] border-[var(--color-primary)] text-[var(--color-primary)]",
  COMPLETED:
    "bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] border-[var(--color-success)] text-[var(--color-success)]",
  NO_SHOW:
    "bg-[color-mix(in_srgb,var(--color-error)_15%,transparent)] border-[var(--color-error)] text-[var(--color-error)]",
};

const statusLabels: Record<string, string> = {
  PENDING: "Venter",
  CONFIRMED: "Bekreftet",
  COMPLETED: "Fullfort",
  NO_SHOW: "Ikke mott",
};

// — Component —

export default function KalenderClient({
  initialBookings,
  instructors,
}: KalenderClientProps) {
  const { toggle } = useMCSidebar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<CalendarBooking[]>(initialBookings);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Note modal state
  const [noteModalBookingId, setNoteModalBookingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isNotePending, startNoteTransition] = useTransition();
  const [isNoShowPending, startNoShowTransition] = useTransition();

  // — Data fetching —

  const fetchBookings = useCallback(
    (date: Date, view: ViewMode, instructorId?: string) => {
      startTransition(async () => {
        const iid = instructorId || undefined;
        let result: CalendarBooking[];

        if (view === "day") {
          result = await getBookingsForDay(date.toISOString(), iid);
        } else if (view === "week") {
          result = await getBookingsForWeek(date.toISOString(), iid);
        } else {
          const start = startOfMonth(date);
          const end = endOfMonth(date);
          result = await getBookingsForPeriod(
            start.toISOString(),
            end.toISOString(),
            iid
          );
        }
        setBookings(result);
      });
    },
    []
  );

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
    fetchBookings(newDate, viewMode, selectedInstructorId);
  };

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
    fetchBookings(currentDate, newView, selectedInstructorId);
  };

  const handleInstructorFilter = (instructorId: string) => {
    setSelectedInstructorId(instructorId);
    fetchBookings(currentDate, viewMode, instructorId);
  };

  // — Actions —

  const handleMarkNoShow = (bookingId: string) => {
    startNoShowTransition(async () => {
      await markNoShow(bookingId);
      fetchBookings(currentDate, viewMode, selectedInstructorId);
    });
  };

  const handleAddNote = () => {
    if (!noteModalBookingId || !noteText.trim()) return;
    const id = noteModalBookingId;
    startNoteTransition(async () => {
      await addAdminNote(id, noteText.trim());
      setNoteModalBookingId(null);
      setNoteText("");
      fetchBookings(currentDate, viewMode, selectedInstructorId);
    });
  };

  // — Calendar calculations —

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getBookingsForDate = (date: Date) =>
    bookings.filter((b) => isSameDay(new Date(b.startTime), date));

  const selectedDateBookings = selectedDate
    ? getBookingsForDate(selectedDate)
    : [];

  const todayBookings = getBookingsForDate(new Date());

  // — Render helpers —

  const formatTime = (date: Date) => format(new Date(date), "HH:mm");
  const formatDuration = (b: CalendarBooking) =>
    `${differenceInMinutes(new Date(b.endTime), new Date(b.startTime))} min`;

  return (
    <>
      <MCTopbar
        title="Kalender"
        subtitle="Full oversikt over alle bookinger og hendelser"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Controls */}
        <div className="hg-card p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavigate(subMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-[var(--hg-text)] min-w-[150px] text-center">
                {format(currentDate, "MMMM yyyy", { locale: nb })}
              </h2>
              <button
                onClick={() => handleNavigate(addMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleNavigate(new Date())}
                className="ml-2 hg-btn hg-btn-secondary text-xs"
              >
                I dag
              </button>
              {isPending && (
                <Loader2 className="w-4 h-4 animate-spin text-[var(--hg-text-muted)]" />
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Instructor filter */}
              <select
                value={selectedInstructorId}
                onChange={(e) => handleInstructorFilter(e.target.value)}
                className="hg-input text-sm py-1.5 px-3"
              >
                <option value="">Alle instruktorer</option>
                {instructors.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.user.name || "Ukjent"}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="hg-tabs">
                {viewModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.value}
                      onClick={() => handleViewChange(mode.value)}
                      className={cn(
                        "hg-tab flex items-center gap-1.5",
                        viewMode === mode.value && "active"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <button className="hg-btn hg-btn-secondary">
                <Filter className="w-4 h-4" />
              </button>
              <button className="hg-btn hg-btn-primary">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ny</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Main Calendar */}
          <div className="lg:col-span-3 hg-card overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-[var(--hg-border)]">
              {["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"].map(
                (dayLabel) => (
                  <div
                    key={dayLabel}
                    className="px-3 py-2 text-center text-xs font-semibold text-[var(--hg-text-muted)] uppercase tracking-wider"
                  >
                    {dayLabel}
                  </div>
                )
              )}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 auto-rows-fr">
              {days.map((date, i) => {
                const dayBookings = getBookingsForDate(date);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isToday = isSameDay(date, new Date());
                const isSelected =
                  selectedDate && isSameDay(date, selectedDate);

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "min-h-[100px] p-2 border-b border-r border-[var(--hg-border-subtle)] text-left transition-colors",
                      !isCurrentMonth &&
                        "bg-[var(--hg-surface-sunken)] opacity-50",
                      isToday && "bg-[var(--hg-primary-glow)]",
                      isSelected &&
                        "ring-2 ring-[var(--hg-primary)] ring-inset",
                      "hover:bg-[var(--hg-surface-raised)]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                          isToday
                            ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
                            : "text-[var(--hg-text)]"
                        )}
                      >
                        {format(date, "d")}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="text-[10px] text-[var(--hg-text-muted)]">
                          {dayBookings.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map((booking) => (
                        <div
                          key={booking.id}
                          className={cn(
                            "px-1.5 py-0.5 text-[10px] rounded border truncate",
                            statusStyles[booking.status] || statusStyles.CONFIRMED
                          )}
                        >
                          {formatTime(booking.startTime)}{" "}
                          {booking.student.name || booking.serviceType.name}
                        </div>
                      ))}
                      {dayBookings.length > 3 && (
                        <div className="text-[10px] text-[var(--hg-text-muted)] pl-1">
                          +{dayBookings.length - 3} flere
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Selected Date Details */}
            <div className="hg-card p-4">
              <h3 className="hg-section-title mb-3">
                {selectedDate
                  ? format(selectedDate, "EEEE d. MMMM", { locale: nb })
                  : "Velg en dato"}
              </h3>
              {selectedDateBookings.length === 0 ? (
                <div className="py-8 text-center">
                  <CalendarIcon className="w-10 h-10 text-[var(--hg-text-muted)] mx-auto mb-2 opacity-50" />
                  <span className="text-sm text-[var(--hg-text-muted)]">
                    Ingen bookinger
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        statusStyles[booking.status] || statusStyles.CONFIRMED
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">
                          {formatTime(booking.startTime)} -{" "}
                          {formatTime(booking.endTime)}
                        </span>
                        <span className="text-[10px] opacity-70">
                          ({formatDuration(booking)})
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        {booking.serviceType.name}
                      </div>
                      <div className="text-xs opacity-70 mt-0.5">
                        {booking.student.name || booking.student.email || "Ukjent elev"}
                      </div>
                      {booking.instructor.user.name && (
                        <div className="text-xs opacity-70">
                          Med {booking.instructor.user.name}
                        </div>
                      )}
                      {booking.location && (
                        <div className="text-xs opacity-60">
                          {booking.location.name}
                        </div>
                      )}
                      <div className="text-[10px] mt-1">
                        {statusLabels[booking.status] || booking.status}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-current/10">
                        {booking.status !== "NO_SHOW" &&
                          booking.status !== "COMPLETED" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkNoShow(booking.id);
                              }}
                              disabled={isNoShowPending}
                              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded hover:bg-black/5 transition-colors"
                              title="Merk som ikke mott"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              Ikke mott
                            </button>
                          )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNoteText(booking.adminNotes || "");
                            setNoteModalBookingId(booking.id);
                          }}
                          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded hover:bg-black/5 transition-colors"
                          title="Legg til notat"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Notat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="w-full mt-3 hg-btn hg-btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Legg til hendelse
              </button>
            </div>

            {/* Status Legend */}
            <div className="hg-card p-4">
              <h3 className="hg-section-title mb-3">Status</h3>
              <div className="space-y-2">
                {Object.entries(statusLabels).map(([status, label]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded border",
                        statusStyles[status]
                      )}
                    />
                    <span className="text-sm text-[var(--hg-text-secondary)]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity */}
            <div className="hg-card p-4">
              <h3 className="hg-section-title mb-3">Kapasitet</h3>
              <HGCapacityBar
                current={todayBookings.length}
                max={8}
                label="I dag"
                size="sm"
              />
              <HGCapacityBar
                current={bookings.length}
                max={40}
                label={viewMode === "month" ? "Denne maneden" : "Denne perioden"}
                size="sm"
                className="mt-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {noteModalBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="hg-card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--hg-text)]">
                Admin-notat
              </h3>
              <button
                onClick={() => setNoteModalBookingId(null)}
                className="p-1 rounded hover:bg-[var(--hg-surface-raised)]"
              >
                <X className="w-5 h-5 text-[var(--hg-text-muted)]" />
              </button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="hg-input w-full h-32 resize-none text-sm"
              placeholder="Skriv et notat..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setNoteModalBookingId(null)}
                className="hg-btn hg-btn-secondary text-sm"
              >
                Avbryt
              </button>
              <button
                onClick={handleAddNote}
                disabled={isNotePending || !noteText.trim()}
                className="hg-btn hg-btn-primary text-sm"
              >
                {isNotePending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Lagre"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
