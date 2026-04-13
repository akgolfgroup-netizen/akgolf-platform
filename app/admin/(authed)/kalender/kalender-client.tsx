"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
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
  MoreHorizontal,
  CheckCircle2,
  User,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminSelect,
  AdminTextarea,
  AdminInput,
  AdminTabs,
  AdminHeatmap,
  AdminDrawer,
  AdminDialog,
  AdminDropdown,
  useToast,
} from "@/components/portal/mission-control/ui";
import type {
  AdminTabItem,
  AdminHeatmapCell,
  AdminDropdownItem,
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
  getHours,
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
import { createBlockedTime } from "@/app/admin/(authed)/tilgjengelighet/actions";

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

type ViewMode = "month" | "week" | "day";

const viewTabs: AdminTabItem[] = [
  { id: "month", label: "Måned", icon: <Grid3X3 className="w-3.5 h-3.5" /> },
  { id: "week", label: "Uke", icon: <CalendarIcon className="w-3.5 h-3.5" /> },
  { id: "day", label: "Dag", icon: <List className="w-3.5 h-3.5" /> },
];

// — Status styles —
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

const statusBadgeVariant: Record<
  StatusKey,
  "warning" | "info" | "success" | "error"
> = {
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
  return (
    s === "PENDING" || s === "CONFIRMED" || s === "COMPLETED" || s === "NO_SHOW"
  );
}

// — Component —

export default function KalenderClient({
  initialBookings,
  instructors,
}: KalenderClientProps) {
  const { toggle } = useMCSidebar();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<CalendarBooking[]>(initialBookings);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Drawer / dialogs
  const [drawerBooking, setDrawerBooking] = useState<CalendarBooking | null>(
    null,
  );
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
    note: "",
  });

  // Note modal state
  const [noteModalBookingId, setNoteModalBookingId] = useState<string | null>(
    null,
  );
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
            iid,
          );
        }
        setBookings(result);
      });
    },
    [],
  );

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
    fetchBookings(newDate, viewMode, selectedInstructorId);
  };

  const handleViewChange = (newView: string) => {
    const v = newView as ViewMode;
    setViewMode(v);
    fetchBookings(currentDate, v, selectedInstructorId);
  };

  const handleInstructorFilter = (instructorId: string) => {
    setSelectedInstructorId(instructorId);
    fetchBookings(currentDate, viewMode, instructorId);
  };

  // — Actions —

  const handleMarkNoShow = (bookingId: string) => {
    startNoShowTransition(async () => {
      await markNoShow(bookingId);
      toast({
        variant: "warning",
        title: "Merket som ikke mott",
        description: "Bookingen er oppdatert.",
      });
      fetchBookings(currentDate, viewMode, selectedInstructorId);
    });
  };

  const handleAddNote = () => {
    if (!noteModalBookingId || !noteText.trim()) return;
    const id = noteModalBookingId;
    startNoteTransition(async () => {
      await addAdminNote(id, noteText.trim());
      toast({
        variant: "success",
        title: "Notat lagret",
      });
      setNoteModalBookingId(null);
      setNoteText("");
      fetchBookings(currentDate, viewMode, selectedInstructorId);
    });
  };

  const handleCreateNewEvent = () => {
    if (!newEventForm.title.trim()) return;
    startTransition(async () => {
      try {
        const startDateTime = new Date(`${newEventForm.date}T${newEventForm.startTime}:00`);
        const endDateTime = new Date(`${newEventForm.date}T${newEventForm.endTime}:00`);
        await createBlockedTime({
          instructorId: selectedInstructorId || null,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          reason: newEventForm.title + (newEventForm.note ? ` — ${newEventForm.note}` : ""),
        });
        toast({
          variant: "success",
          title: "Tid blokkert",
          description: `${newEventForm.title} — ${newEventForm.date} ${newEventForm.startTime}`,
        });
        setNewEventOpen(false);
        setNewEventForm({ title: "", date: format(new Date(), "yyyy-MM-dd"), startTime: "09:00", endTime: "10:00", note: "" });
        fetchBookings(currentDate, viewMode, selectedInstructorId);
      } catch {
        toast({
          variant: "error",
          title: "Feil",
          description: "Kunne ikke blokkere tid. Prøv igjen.",
        });
      }
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

  // — Heatmap data — antall bookinger per ukedag × time (8-20)
  const heatmapRows = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
  const heatmapCols = useMemo(
    () => Array.from({ length: 13 }, (_, i) => `${i + 8}`),
    [],
  );

  const heatmapData = useMemo<AdminHeatmapCell[]>(() => {
    const counts = new Map<string, number>();
    for (const b of bookings) {
      const d = new Date(b.startTime);
      const dow = (d.getDay() + 6) % 7; // Man=0
      const rowLabel = heatmapRows[dow];
      const hour = getHours(d);
      if (hour < 8 || hour > 20) continue;
      const key = `${rowLabel}|${hour}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const cells: AdminHeatmapCell[] = [];
    for (const row of heatmapRows) {
      for (const col of heatmapCols) {
        cells.push({
          row,
          col,
          value: counts.get(`${row}|${col}`) ?? 0,
        });
      }
    }
    return cells;
  }, [bookings, heatmapCols]);

  // — Render helpers —

  const formatTime = (date: Date) => format(new Date(date), "HH:mm");
  const formatDuration = (b: CalendarBooking) =>
    `${differenceInMinutes(new Date(b.endTime), new Date(b.startTime))} min`;

  const buildQuickActions = (
    booking: CalendarBooking,
  ): AdminDropdownItem[] => [
    {
      id: "view",
      label: "Se detaljer",
      icon: <CalendarIcon className="w-4 h-4" />,
      onSelect: () => setDrawerBooking(booking),
    },
    {
      id: "note",
      label: "Legg til notat",
      icon: <MessageSquare className="w-4 h-4" />,
      onSelect: () => {
        setNoteText(booking.adminNotes || "");
        setNoteModalBookingId(booking.id);
      },
    },
    {
      id: "no-show",
      label: "Merk som ikke mott",
      icon: <AlertTriangle className="w-4 h-4" />,
      variant: "danger" as const,
      disabled:
        booking.status === "NO_SHOW" || booking.status === "COMPLETED",
      onSelect: () => handleMarkNoShow(booking.id),
    },
  ];

  return (
    <>
      <MCTopbar
        title="Kalender"
        subtitle="Full oversikt over alle bookinger og hendelser"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
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

              <AdminButton
                variant="secondary"
                icon={<Filter className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">Filter</span>
              </AdminButton>
              <AdminButton
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setNewEventOpen(true)}
              >
                <span className="hidden sm:inline">Ny</span>
              </AdminButton>
            </div>
          </div>

          {/* View Tabs */}
          <div className="mt-4">
            <AdminTabs
              items={viewTabs}
              value={viewMode}
              onValueChange={handleViewChange}
              size="sm"
            />
          </div>
        </AdminCard>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-card overflow-hidden">
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
                ),
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
                      "hover:bg-[var(--color-grey-50)]",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                          isToday
                            ? "bg-[var(--color-primary)] text-white"
                            : "text-[var(--color-text)]",
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrawerBooking(booking);
                          }}
                          className={cn(
                            "px-1.5 py-0.5 text-[10px] rounded border truncate cursor-pointer",
                            statusCellStyles[booking.status] ||
                              statusCellStyles.CONFIRMED,
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
          <div className="space-y-6">
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
                          <div className="flex items-center gap-1">
                            <AdminBadge variant={statusBadgeVariant[statusKey]}>
                              {statusLabels[booking.status] || booking.status}
                            </AdminBadge>
                            <AdminDropdown
                              items={buildQuickActions(booking)}
                              trigger={
                                <button
                                  aria-label="Handlinger"
                                  className="p-1 rounded hover:bg-[var(--color-grey-100)] text-[var(--color-muted)]"
                                >
                                  <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                              }
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDrawerBooking(booking)}
                          className="block w-full text-left"
                        >
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
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <AdminButton
                variant="primary"
                className="w-full mt-3"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setNewEventOpen(true)}
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
                        statusCellStyles[status],
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

        {/* Activity Heatmap */}
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="admin-section-title">Aktivitet</h3>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                Antall bookinger per ukedag og klokkeslett
              </p>
            </div>
            <AdminBadge variant="info">{bookings.length} totalt</AdminBadge>
          </div>
          <div className="overflow-x-auto">
            <AdminHeatmap
              data={heatmapData}
              rows={heatmapRows}
              cols={heatmapCols}
              formatTooltip={(cell) =>
                `${cell.row} kl ${cell.col}:00 — ${cell.value} booking${
                  cell.value === 1 ? "" : "er"
                }`
              }
            />
          </div>
        </AdminCard>
      </div>

      {/* Note Dialog */}
      <AdminDialog
        open={noteModalBookingId !== null}
        onClose={() => setNoteModalBookingId(null)}
        title="Admin-notat"
        description="Internt notat på bookingen"
        footer={
          <>
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
          </>
        }
      >
        <AdminTextarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={5}
          placeholder="Skriv et notat..."
        />
      </AdminDialog>

      {/* New Event Dialog */}
      <AdminDialog
        open={newEventOpen}
        onClose={() => setNewEventOpen(false)}
        title="Ny hendelse"
        description="Opprett en ny kalenderhendelse"
        footer={
          <>
            <AdminButton
              variant="secondary"
              onClick={() => setNewEventOpen(false)}
            >
              Avbryt
            </AdminButton>
            <AdminButton
              variant="primary"
              onClick={handleCreateNewEvent}
              disabled={!newEventForm.title.trim()}
            >
              Opprett
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3">
          <AdminInput
            label="Tittel"
            value={newEventForm.title}
            onChange={(e) =>
              setNewEventForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="F.eks. Teamsamling"
          />
          <AdminInput
            label="Dato"
            type="date"
            value={newEventForm.date}
            onChange={(e) =>
              setNewEventForm((prev) => ({ ...prev, date: e.target.value }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Fra"
              type="time"
              value={newEventForm.startTime}
              onChange={(e) =>
                setNewEventForm((prev) => ({
                  ...prev,
                  startTime: e.target.value,
                }))
              }
            />
            <AdminInput
              label="Til"
              type="time"
              value={newEventForm.endTime}
              onChange={(e) =>
                setNewEventForm((prev) => ({
                  ...prev,
                  endTime: e.target.value,
                }))
              }
            />
          </div>
          <AdminTextarea
            label="Notat"
            value={newEventForm.note}
            onChange={(e) =>
              setNewEventForm((prev) => ({ ...prev, note: e.target.value }))
            }
            rows={3}
            placeholder="Valgfritt"
          />
        </div>
      </AdminDialog>

      {/* Booking Details Drawer */}
      <AdminDrawer
        open={drawerBooking !== null}
        onClose={() => setDrawerBooking(null)}
        title={drawerBooking?.serviceType.name ?? "Booking"}
        description={
          drawerBooking
            ? `${format(new Date(drawerBooking.startTime), "EEEE d. MMMM yyyy", {
                locale: nb,
              })} kl ${formatTime(drawerBooking.startTime)}`
            : undefined
        }
        width="lg"
        footer={
          drawerBooking && (
            <div className="flex items-center justify-end gap-2">
              <AdminButton
                variant="secondary"
                icon={<MessageSquare className="w-4 h-4" />}
                onClick={() => {
                  setNoteText(drawerBooking.adminNotes || "");
                  setNoteModalBookingId(drawerBooking.id);
                }}
              >
                Notat
              </AdminButton>
              {drawerBooking.status !== "NO_SHOW" &&
                drawerBooking.status !== "COMPLETED" && (
                  <AdminButton
                    variant="secondary"
                    icon={<AlertTriangle className="w-4 h-4" />}
                    loading={isNoShowPending}
                    onClick={() => handleMarkNoShow(drawerBooking.id)}
                  >
                    Ikke mott
                  </AdminButton>
                )}
            </div>
          )
        }
      >
        {drawerBooking && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {isStatusKey(drawerBooking.status) && (
                <AdminBadge variant={statusBadgeVariant[drawerBooking.status]}>
                  {statusLabels[drawerBooking.status] || drawerBooking.status}
                </AdminBadge>
              )}
              <AdminBadge variant="muted">
                {formatDuration(drawerBooking)}
              </AdminBadge>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[var(--color-muted)] mt-0.5" />
                <div>
                  <div className="text-xs text-[var(--color-muted)]">
                    Tidspunkt
                  </div>
                  <div className="text-sm text-[var(--color-text)] font-medium tabular-nums">
                    {formatTime(drawerBooking.startTime)}–
                    {formatTime(drawerBooking.endTime)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-[var(--color-muted)] mt-0.5" />
                <div>
                  <div className="text-xs text-[var(--color-muted)]">Elev</div>
                  <div className="text-sm text-[var(--color-text)] font-medium">
                    {drawerBooking.student.name || "Ukjent"}
                  </div>
                  {drawerBooking.student.email && (
                    <div className="text-xs text-[var(--color-muted)]">
                      {drawerBooking.student.email}
                    </div>
                  )}
                </div>
              </div>

              {drawerBooking.instructor.user.name && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-muted)] mt-0.5" />
                  <div>
                    <div className="text-xs text-[var(--color-muted)]">
                      Instruktør
                    </div>
                    <div className="text-sm text-[var(--color-text)] font-medium">
                      {drawerBooking.instructor.user.name}
                    </div>
                  </div>
                </div>
              )}

              {drawerBooking.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[var(--color-muted)] mt-0.5" />
                  <div>
                    <div className="text-xs text-[var(--color-muted)]">
                      Lokasjon
                    </div>
                    <div className="text-sm text-[var(--color-text)] font-medium">
                      {drawerBooking.location.name}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {drawerBooking.adminNotes && (
              <div className="pt-3 border-t border-[var(--color-grey-200)]">
                <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-1">
                  Admin-notat
                </div>
                <p className="text-sm text-[var(--color-text)] whitespace-pre-wrap">
                  {drawerBooking.adminNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </AdminDrawer>
    </>
  );
}
