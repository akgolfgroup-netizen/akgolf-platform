"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { useToast } from "@/components/portal/mission-control/ui";
import type { CalendarBooking, CalendarBlockedTime, CalendarAvailability } from "./actions";
import {
  getBookingsForPeriod,
  getBookingsForWeek,
  getBlockedTimesForPeriod,
  getInstructorAvailabilityPrisma,
  markNoShow,
  addAdminNote,
  createBlockedTimePrisma,
} from "./actions";

import KalenderControls from "./kalender-controls";
import KalenderMonthView from "./kalender-month-view";
import KalenderWeekView from "./kalender-week-view";
import KalenderAvailabilityPanel from "./kalender-availability-panel";
import KalenderSidebar from "./kalender-sidebar";
import KalenderHeatmap from "./kalender-heatmap";
import KalenderOverlays from "./kalender-overlays";

type ViewMode = "month" | "week" | "availability";

interface Instructor {
  id: string;
  user: { name: string | null; image: string | null };
}

interface KalenderClientProps {
  initialBookings: CalendarBooking[];
  instructors: Instructor[];
}

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
  const [blockedTimes, setBlockedTimes] = useState<CalendarBlockedTime[]>([]);
  const [availability, setAvailability] = useState<CalendarAvailability[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isNotePending, startNoteTransition] = useTransition();
  const [isNoShowPending, startNoShowTransition] = useTransition();

  // Overlays
  const [drawerBooking, setDrawerBooking] = useState<CalendarBooking | null>(null);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
    note: "",
  });
  const [noteModalBookingId, setNoteModalBookingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const fetchData = useCallback(
    (date: Date, view: ViewMode, instructorId?: string) => {
      startTransition(async () => {
        const iid = instructorId || undefined;
        let bookingResult: CalendarBooking[];
        let start: Date;
        let end: Date;

        if (view === "week") {
          start = startOfWeek(date, { weekStartsOn: 1 });
          end = endOfWeek(date, { weekStartsOn: 1 });
          bookingResult = await getBookingsForWeek(date.toISOString(), iid);
        } else {
          start = startOfMonth(date);
          end = endOfMonth(date);
          bookingResult = await getBookingsForPeriod(
            start.toISOString(),
            end.toISOString(),
            iid
          );
        }

        setBookings(bookingResult);

        // Fetch blocked times and availability for week/month views
        if (view !== "availability") {
          const bt = await getBlockedTimesForPeriod(
            start.toISOString(),
            end.toISOString(),
            iid
          );
          setBlockedTimes(bt);

          if (iid) {
            const av = await getInstructorAvailabilityPrisma(iid);
            setAvailability(av);
          } else {
            setAvailability([]);
          }
        }
      });
    },
    []
  );

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
    fetchData(newDate, viewMode, selectedInstructorId);
  };

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView);
    fetchData(currentDate, newView, selectedInstructorId);
  };

  const handleInstructorFilter = (instructorId: string) => {
    setSelectedInstructorId(instructorId);
    fetchData(currentDate, viewMode, instructorId);
  };

  const handleMarkNoShow = (bookingId: string) => {
    startNoShowTransition(async () => {
      await markNoShow(bookingId);
      toast({ variant: "warning", title: "Merket som ikke møtt", description: "Bookingen er oppdatert." });
      fetchData(currentDate, viewMode, selectedInstructorId);
    });
  };

  const handleAddNote = () => {
    if (!noteModalBookingId || !noteText.trim()) return;
    const id = noteModalBookingId;
    startNoteTransition(async () => {
      await addAdminNote(id, noteText.trim());
      toast({ variant: "success", title: "Notat lagret" });
      setNoteModalBookingId(null);
      setNoteText("");
      fetchData(currentDate, viewMode, selectedInstructorId);
    });
  };

  const handleCreateNewEvent = () => {
    if (!newEventForm.title.trim()) return;
    startTransition(async () => {
      try {
        const start = new Date(`${newEventForm.date}T${newEventForm.startTime}:00`);
        const end = new Date(`${newEventForm.date}T${newEventForm.endTime}:00`);
        await createBlockedTimePrisma({
          instructorId: selectedInstructorId || null,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          reason: newEventForm.title + (newEventForm.note ? ` — ${newEventForm.note}` : ""),
        });
        toast({
          variant: "success",
          title: "Tid blokkert",
          description: `${newEventForm.title} — ${newEventForm.date} ${newEventForm.startTime}`,
        });
        setNewEventOpen(false);
        setNewEventForm({ title: "", date: format(new Date(), "yyyy-MM-dd"), startTime: "09:00", endTime: "10:00", note: "" });
        fetchData(currentDate, viewMode, selectedInstructorId);
      } catch {
        toast({ variant: "error", title: "Feil", description: "Kunne ikke blokkere tid. Prøv igjen." });
      }
    });
  };

  // Calendar calculations for month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days: Date[] = useMemo(() => {
    const d: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      d.push(day);
      day = addDays(day, 1);
    }
    return d;
  }, [calendarStart, calendarEnd]);

  const handleAddNoteFromSidebar = (booking: CalendarBooking) => {
    setNoteText(booking.adminNotes || "");
    setNoteModalBookingId(booking.id);
  };

  const handleOpenNoteModal = (booking: CalendarBooking) => {
    setNoteText(booking.adminNotes || "");
    setDrawerBooking(null);
    setNoteModalBookingId(booking.id);
  };

  return (
    <>
      <MCTopbar
        title="Kalender"
        subtitle="Full oversikt over alle bookinger og hendelser"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6 bg-grey-50 min-h-screen">
        <KalenderControls
          currentDate={currentDate}
          viewMode={viewMode}
          selectedInstructorId={selectedInstructorId}
          instructors={instructors}
          isPending={isPending}
          onNavigate={handleNavigate}
          onViewChange={handleViewChange}
          onInstructorChange={handleInstructorFilter}
          onNewEvent={() => setNewEventOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {viewMode === "month" && (
              <KalenderMonthView
                days={days}
                currentDate={currentDate}
                selectedDate={selectedDate}
                bookings={bookings}
                onSelectDate={setSelectedDate}
                onBookingClick={setDrawerBooking}
              />
            )}
            {viewMode === "week" && (
              <KalenderWeekView
                currentDate={currentDate}
                bookings={bookings}
                blockedTimes={blockedTimes}
                availability={availability}
                onBookingClick={setDrawerBooking}
              />
            )}
            {viewMode === "availability" && (
              <KalenderAvailabilityPanel
                instructors={instructors}
                selectedInstructorId={selectedInstructorId}
              />
            )}
          </div>

          {viewMode !== "availability" && (
            <KalenderSidebar
              selectedDate={selectedDate}
              bookings={bookings}
              onBookingClick={setDrawerBooking}
              onAddNote={handleAddNoteFromSidebar}
              onMarkNoShow={handleMarkNoShow}
              onNewEvent={() => setNewEventOpen(true)}
            />
          )}
        </div>

        {viewMode !== "availability" && <KalenderHeatmap bookings={bookings} />}
      </div>

      <KalenderOverlays
        drawerBooking={drawerBooking}
        onCloseDrawer={() => setDrawerBooking(null)}
        noteModalBookingId={noteModalBookingId}
        onCloseNoteModal={() => setNoteModalBookingId(null)}
        noteText={noteText}
        onNoteTextChange={setNoteText}
        onSaveNote={handleAddNote}
        isNotePending={isNotePending}
        newEventOpen={newEventOpen}
        onCloseNewEvent={() => setNewEventOpen(false)}
        newEventForm={newEventForm}
        onNewEventFormChange={setNewEventForm}
        onCreateEvent={handleCreateNewEvent}
        isPending={isPending}
        isNoShowPending={isNoShowPending}
        onMarkNoShow={handleMarkNoShow}
        onOpenNoteModal={handleOpenNoteModal}
      />
    </>
  );
}
