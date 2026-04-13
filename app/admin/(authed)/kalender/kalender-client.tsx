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
  AdminSelect,
  AdminTextarea,
  AdminInput,
  AdminHeatmap,
  AdminDrawer,
  AdminDialog,
  AdminDropdown,
  useToast,
} from "@/components/portal/mission-control/ui";
import type {
  AdminHeatmapCell,
  AdminDropdownItem,
} from "@/components/portal/mission-control/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, type TabItem } from "@/components/ui/tabs";
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

const viewTabs: TabItem[] = [
  { id: "month", label: "Måned", icon: <Grid3X3 className="w-3.5 h-3.5" /> },
  { id: "week", label: "Uke", icon: <CalendarIcon className="w-3.5 h-3.5" /> },
  { id: "day", label: "Dag", icon: <List className="w-3.5 h-3.5" /> },
];

// — Status styles —
const statusCellStyles: Record<string, string> = {
  PENDING:
    "bg-grey-50 border-grey-200 text-text",
  CONFIRMED:
    "bg-grey-50 border-grey-200 text-text",
  COMPLETED:
    "bg-grey-50 border-grey-200 text-text",
  NO_SHOW:
    "bg-grey-50 border-grey-200 text-text",
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
  COMPLETED: "Fullført",
  NO_SHOW: "Ikke møtt",
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
        title: "Merket som ikke møtt",
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
      label: "Merk som ikke møtt",
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

      <div className="p-6 space-y-6 bg-grey-50 min-h-screen">
        {/* Controls */}
        <div className="bg-white rounded-xl border border-grey-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavigate(subMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-grey-50 text-grey-500 transition-colors"
                aria-label="Forrige måned"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-black min-w-[150px] text-center capitalize">
                {format(currentDate, "MMMM yyyy", { locale: nb })}
              </h2>
              <button
                onClick={() => handleNavigate(addMonths(currentDate, 1))}
                className="p-2 rounded-lg hover:bg-grey-50 text-grey-500 transition-colors"
                aria-label="Neste måned"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <Button
                variant="secondary"
                onClick={() => handleNavigate(new Date())}
                className="ml-2"
              >
                I dag
              </Button>
              {isPending && (
                <Loader2 className="w-4 h-4 animate-spin text-grey-400" />
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Instructor filter */}
              <AdminSelect
                value={selectedInstructorId}
                onChange={(e) => handleInstructorFilter(e.target.value)}
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
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
              <Button
                variant="accent"
                onClick={() => setNewEventOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ny</span>
              </Button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="mt-4">
            <Tabs
              items={viewTabs}
              value={viewMode}
              onValueChange={handleViewChange}
              size="sm"
            />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-grey-200 overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-grey-200 bg-grey-50">
              {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map(
                (dayLabel) => (
                  <div
                    key={dayLabel}
                    className="px-3 py-2.5 text-center text-xs font-semibold text-grey-500 uppercase tracking-wider"
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
                      "min-h-[110px] p-2 border-b border-r border-grey-100 text-left transition-colors",
                      !isCurrentMonth &&
                        "bg-grey-50 opacity-60",
                      isToday && "bg-grey-100",
                      isSelected &&
                        "ring-2 ring-black ring-inset",
                      "hover:bg-grey-50",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                          isToday
                            ? "bg-black text-white"
                            : "text-black",
                        )}
                      >
                        {format(date, "d")}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="text-[10px] text-grey-400 tabular-nums">
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
                        <div className="text-[10px] text-grey-400 pl-1">
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
            <div className="bg-white rounded-xl border border-grey-200 p-4">
              <h3 className="text-sm font-semibold text-black mb-3 capitalize">
                {selectedDate
                  ? format(selectedDate, "EEEE d. MMMM", { locale: nb })
                  : "Velg en dato"}
              </h3>
              {selectedDateBookings.length === 0 ? (
                <div className="py-8 text-center">
                  <CalendarIcon className="w-10 h-10 text-grey-300 mx-auto mb-2" />
                  <span className="text-sm text-grey-400">
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
                        className="p-3 rounded-lg border border-grey-200 bg-grey-50"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 text-black">
                            <Clock className="w-3.5 h-3.5 text-grey-400" />
                            <span className="text-xs font-medium tabular-nums">
                              {formatTime(booking.startTime)}–
                              {formatTime(booking.endTime)}
                            </span>
                            <span className="text-[10px] text-grey-400">
                              ({formatDuration(booking)})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant={statusBadgeVariant[statusKey]}>
                              {statusLabels[booking.status] || booking.status}
                            </Badge>
                            <AdminDropdown
                              items={buildQuickActions(booking)}
                              trigger={
                                <button
                                  aria-label="Handlinger"
                                  className="p-1 rounded hover:bg-grey-100 text-grey-400"
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
                          <div className="text-sm font-medium text-black">
                            {booking.serviceType.name}
                          </div>
                          <div className="text-xs text-grey-500 mt-0.5">
                            {booking.student.name ||
                              booking.student.email ||
                              "Ukjent elev"}
                          </div>
                          {booking.instructor.user.name && (
                            <div className="text-xs text-grey-600">
                              Med {booking.instructor.user.name}
                            </div>
                          )}
                          {booking.location && (
                            <div className="text-xs text-grey-600">
                              {booking.location.name}
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <Button
                variant="accent"
                className="w-full mt-3"
                onClick={() => setNewEventOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Legg til hendelse
              </Button>
            </div>

            {/* Status Legend */}
            <div className="bg-white rounded-xl border border-grey-200 p-4">
              <h3 className="text-sm font-semibold text-black mb-3">Status</h3>
              <div className="space-y-2">
                {Object.entries(statusLabels).map(([status, label]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded border",
                        statusCellStyles[status],
                      )}
                    />
                    <span className="text-sm text-text">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="bg-white rounded-xl border border-grey-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-black">Aktivitet</h3>
              <p className="text-xs text-grey-400 mt-0.5">
                Antall bookinger per ukedag og klokkeslett
              </p>
            </div>
            <Badge variant="info">{bookings.length} totalt</Badge>
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
        </div>
      </div>

      {/* Note Dialog */}
      <AdminDialog
        open={noteModalBookingId !== null}
        onClose={() => setNoteModalBookingId(null)}
        title="Admin-notat"
        description="Internt notat på bookingen"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setNoteModalBookingId(null)}
            >
              Avbryt
            </Button>
            <Button
              variant="accent"
              onClick={handleAddNote}
              isLoading={isNotePending}
              disabled={!noteText.trim()}
            >
              Lagre
            </Button>
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
            <Button
              variant="secondary"
              onClick={() => setNewEventOpen(false)}
            >
              Avbryt
            </Button>
            <Button
              variant="accent"
              onClick={handleCreateNewEvent}
              disabled={!newEventForm.title.trim()}
            >
              Opprett
            </Button>
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
              <Button
                variant="secondary"
                onClick={() => {
                  setNoteText(drawerBooking.adminNotes || "");
                  setNoteModalBookingId(drawerBooking.id);
                }}
              >
                <MessageSquare className="w-4 h-4" />
                Notat
              </Button>
              {drawerBooking.status !== "NO_SHOW" &&
                drawerBooking.status !== "COMPLETED" && (
                  <Button
                    variant="secondary"
                    isLoading={isNoShowPending}
                    onClick={() => handleMarkNoShow(drawerBooking.id)}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Ikke møtt
                  </Button>
                )}
            </div>
          )
        }
      >
        {drawerBooking && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {isStatusKey(drawerBooking.status) && (
                <Badge variant={statusBadgeVariant[drawerBooking.status]}>
                  {statusLabels[drawerBooking.status] || drawerBooking.status}
                </Badge>
              )}
              <Badge variant="muted">
                {formatDuration(drawerBooking)}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-grey-400 mt-0.5" />
                <div>
                  <div className="text-xs text-grey-400">
                    Tidspunkt
                  </div>
                  <div className="text-sm text-black font-medium tabular-nums">
                    {formatTime(drawerBooking.startTime)}–
                    {formatTime(drawerBooking.endTime)}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-grey-400 mt-0.5" />
                <div>
                  <div className="text-xs text-grey-400">Elev</div>
                  <div className="text-sm text-grey-900 font-medium">
                    {drawerBooking.student.name || "Ukjent"}
                  </div>
                  {drawerBooking.student.email && (
                    <div className="text-xs text-grey-400">
                      {drawerBooking.student.email}
                    </div>
                  )}
                </div>
              </div>

              {drawerBooking.instructor.user.name && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-grey-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-grey-400">
                      Instruktør
                    </div>
                    <div className="text-sm text-grey-900 font-medium">
                      {drawerBooking.instructor.user.name}
                    </div>
                  </div>
                </div>
              )}

              {drawerBooking.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-grey-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-grey-400">
                      Lokasjon
                    </div>
                    <div className="text-sm text-grey-900 font-medium">
                      {drawerBooking.location.name}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {drawerBooking.adminNotes && (
              <div className="pt-3 border-t border-grey-200">
                <div className="text-xs font-semibold text-grey-400 uppercase tracking-wide mb-1">
                  Admin-notat
                </div>
                <p className="text-sm text-black whitespace-pre-wrap">
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
