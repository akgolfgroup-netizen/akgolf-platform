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
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminSelect,
  AdminTextarea,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
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
// Pill/kort i kalender-cellene bruker myke bakgrunner og accent-border
const statusCellStyles: Record<string, string> = {
  PENDING:
    "bg-[var(--color-warning)]/10 border-[var(--color-warning)]/40 text-[var(--color-warning)]",
  CONFIRMED:
    "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30 text-[var(--color-primary)]",
  COMPLETED:
    "bg-[var(--color-success)]/10 border-[var(--color-success)]/30 text-[var(--color-success)]",
  NO_SHOW:
    "bg-[var(--color-error)]/10 border-[var(--color-error)]/30 text-[var(--color-error)]",
};

type StatusKey = "PENDING" | "CONFIRMED" | "COMPLETED" | "NO_SHOW";

const statusBadgeVariant: Record<StatusKey, "warning" | "info" | "success" | "error"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  COMPLETED: "success",
  NO_SHOW: "error",
};

const statusLabels: Record<string, string> = {
  PENDING: "Venter",
  CONFIRMED: "Bekreftet",
  COMPLETED: "Fullfort",
  NO_SHOW: "Ikke mott",
};

function isStatusKey(s: string): s is StatusKey {
  return s === "PENDING" || s === "CONFIRMED" || s === "COMPLETED" || s === "NO_SHOW";
}

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
        <AdminCard compact>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavigate(subMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-muted)] transition-colors"
                aria-label="Forrige maned"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-[var(--color-text)] min-w-[150px] text-center capitalize">
                {format(currentDate, "MMMM yyyy", { locale: nb })}
              </h2>
              <button
                onClick={() => handleNavigate(addMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-muted)] transition-colors"
                aria-label="Neste maned"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <AdminButton
                variant="secondary"
                onClick={() => handleNavigate(new Date())}
                className="ml-2"
              >
                I dag
              </AdminButton>
              {isPending && (
                <Loader2 className="w-4 h-4 animate-spin text-[var(--color-muted)]" />
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Instructor filter */}
              <AdminSelect
                value={selectedInstructorId}
                onChange={(e) => handleInstructorFilter(e.target.value)}
                containerClassName="min-w-[180px]"
              >
                <option value="">Alle instruktorer</option>
                {instructors.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.user.name || "Ukjent"}
                  </option>
                ))}
              </AdminSelect>

              {/* View Mode Toggle */}
              <div className="inline-flex rounded-lg border border-[var(--color-grey-200)] bg-white p-1">
                {viewModes.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = viewMode === mode.value;
                  return (
                    <button
                      key={mode.value}
                      onClick={() => handleViewChange(mode.value)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                        isActive
                          ? "bg-[var(--color-primary)] text-white"
                          : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              <AdminButton variant="secondary" icon={<Filter className="w-4 h-4" />}>
                <span className="hidden sm:inline">Filter</span>
              </AdminButton>
              <AdminButton variant="primary" icon={<Plus className="w-4 h-4" />}>
                <span className="hidden sm:inline">Ny</span>
              </AdminButton>
            </div>
          </div>
        </AdminCard>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Main Calendar */}
          <div className="lg:col-span-3 bg-white border border-[var(--color-grey-200)] rounded-xl overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-[var(--color-grey-200)] bg-[var(--color-grey-50)]">
              {["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"].map(
                (dayLabel) => (
                  <div
                    key={dayLabel}
                    className="px-3 py-2.5 text-center text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider"
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
                      "min-h-[110px] p-2 border-b border-r border-[var(--color-grey-100)] text-left transition-colors",
                      !isCurrentMonth &&
                        "bg-[var(--color-grey-50)] opacity-60",
                      isToday && "bg-[var(--color-primary)]/5",
                      isSelected &&
                        "ring-2 ring-[var(--color-primary)] ring-inset",
                      "hover:bg-[var(--color-grey-50)]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                          isToday
                            ? "bg-[var(--color-primary)] text-white"
                            : "text-[var(--color-text)]"
                        )}
                      >
                        {format(date, "d")}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="text-[10px] text-[var(--color-muted)] tabular-nums">
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
                            statusCellStyles[booking.status] ||
                              statusCellStyles.CONFIRMED
                          )}
                        >
                          {formatTime(booking.startTime)}{" "}
                          {booking.student.name || booking.serviceType.name}
                        </div>
                      ))}
                      {dayBookings.length > 3 && (
                        <div className="text-[10px] text-[var(--color-muted)] pl-1">
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
            <AdminCard compact>
              <h3 className="admin-section-title mb-3 capitalize">
                {selectedDate
                  ? format(selectedDate, "EEEE d. MMMM", { locale: nb })
                  : "Velg en dato"}
              </h3>
              {selectedDateBookings.length === 0 ? (
                <div className="py-8 text-center">
                  <CalendarIcon className="w-10 h-10 text-[var(--color-muted)] mx-auto mb-2 opacity-50" />
                  <span className="text-sm text-[var(--color-muted)]">
                    Ingen bookinger
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateBookings.map((booking) => {
                    const statusKey = isStatusKey(booking.status)
                      ? booking.status
                      : "CONFIRMED";
                    return (
                      <div
                        key={booking.id}
                        className="p-3 rounded-lg border border-[var(--color-grey-200)] bg-white"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 text-[var(--color-text)]">
                            <Clock className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                            <span className="text-xs font-medium tabular-nums">
                              {formatTime(booking.startTime)}–
                              {formatTime(booking.endTime)}
                            </span>
                            <span className="text-[10px] text-[var(--color-muted)]">
                              ({formatDuration(booking)})
                            </span>
                          </div>
                          <AdminBadge variant={statusBadgeVariant[statusKey]}>
                            {statusLabels[booking.status] || booking.status}
                          </AdminBadge>
                        </div>
                        <div className="text-sm font-medium text-[var(--color-text)]">
                          {booking.serviceType.name}
                        </div>
                        <div className="text-xs text-[var(--color-muted)] mt-0.5">
                          {booking.student.name ||
                            booking.student.email ||
                            "Ukjent elev"}
                        </div>
                        {booking.instructor.user.name && (
                          <div className="text-xs text-[var(--color-muted)]">
                            Med {booking.instructor.user.name}
                          </div>
                        )}
                        {booking.location && (
                          <div className="text-xs text-[var(--color-muted)]">
                            {booking.location.name}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[var(--color-grey-100)]">
                          {booking.status !== "NO_SHOW" &&
                            booking.status !== "COMPLETED" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkNoShow(booking.id);
                                }}
                                disabled={isNoShowPending}
                                className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded hover:bg-[var(--color-error)]/10 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors disabled:opacity-50"
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
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded hover:bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                            title="Legg til notat"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Notat
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <AdminButton
                variant="primary"
                className="w-full mt-3"
                icon={<Plus className="w-4 h-4" />}
              >
                Legg til hendelse
              </AdminButton>
            </AdminCard>

            {/* Status Legend */}
            <AdminCard compact>
              <h3 className="admin-section-title mb-3">Status</h3>
              <div className="space-y-2">
                {Object.entries(statusLabels).map(([status, label]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded border",
                        statusCellStyles[status]
                      )}
                    />
                    <span className="text-sm text-[var(--color-text)]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {noteModalBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <AdminCard className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="admin-section-title">Admin-notat</h3>
              <button
                onClick={() => setNoteModalBookingId(null)}
                className="p-1 rounded hover:bg-[var(--color-grey-100)] text-[var(--color-muted)]"
                aria-label="Lukk"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdminTextarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={5}
              placeholder="Skriv et notat..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <AdminButton
                variant="secondary"
                onClick={() => setNoteModalBookingId(null)}
              >
                Avbryt
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handleAddNote}
                loading={isNotePending}
                disabled={!noteText.trim()}
              >
                Lagre
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      )}
    </>
  );
}
